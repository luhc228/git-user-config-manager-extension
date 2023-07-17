import { dirname } from 'path';
import * as vscode from 'vscode';
import { isGitRepo, getUserConfig as getGitUserConfig } from './utils/git';
import { GIT_USER_CONFIG_NOT_SET_WARNING_MESSAGE_COMMAND } from './commands/showGitUserConfigNotSetMessage';
import { storageKeys } from './constants';
import { getGitUserConfigs } from './utils/gitUserConfigs';
import type StatusBarItem from './StatusBarItem';
import type { GlobalStorage, WorkspaceStorage } from './Storage';
import { GitUserConfig } from './types';

export default class GitConfigStatusChecker {
  private statusBarItem: StatusBarItem;
  private globalStorage: GlobalStorage;
  private workspaceStorage: WorkspaceStorage;
  private gitRepositories: string[];
  private currentGitUserConfig: GitUserConfig | undefined;

  constructor(
    context: vscode.ExtensionContext,
    statusBarItem: StatusBarItem,
    globalStorage: GlobalStorage,
    workspaceStorage: WorkspaceStorage,
  ) {
    this.statusBarItem = statusBarItem;
    this.globalStorage = globalStorage;
    this.workspaceStorage = workspaceStorage;
    this.gitRepositories = [];

    const fsWatcher = vscode.workspace.createFileSystemWatcher('**/.git');
    context.subscriptions.push(
      fsWatcher.onDidCreate(this.onDidCreateGitDir),
      fsWatcher.onDidDelete(this.onDidDeleteGitDir),
      vscode.workspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders),
      vscode.window.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors),
    );
    this.doInitialScan();
  }

  public getCurrentGitUserConfig() {
    return this.currentGitUserConfig;
  }

  private async doInitialScan() {
    await this.scanWorkspaceFolders();

    this.handleStatusBarItemDisplay();

    await this.setCurrentOpenedGitRepository();

    await Promise.all(this.gitRepositories.map((gitRepository) => {
      return this.checkIsGitUserConfigAlreadySet(gitRepository);
    }));
  }

  // set current opened git repository to workspace storage.
  private async setCurrentOpenedGitRepository() {
    let currentOpenedGitRepository: string = this.gitRepositories[0];

    const { activeTextEditor } = vscode.window;
    if (activeTextEditor && activeTextEditor.document.uri.scheme === 'file') {
      const resource = activeTextEditor.document.uri;
      const folder = vscode.workspace.getWorkspaceFolder(resource);
      if (!folder) {
        return;
      }
      const possibleGitRepository = this.gitRepositories.find(gitRepository => gitRepository === folder.uri.path);
      if (possibleGitRepository) {
        currentOpenedGitRepository = possibleGitRepository;
      }
    }
    // If current opened git repo change, update the status bar item
    if (currentOpenedGitRepository) {
      const currentGitUserConfig = await this._getCurrentGitUserConfig(currentOpenedGitRepository);
      this.currentGitUserConfig = currentGitUserConfig;
      if (currentGitUserConfig) {
        this.statusBarItem.updateStatusBarItem('Normal', { text: `${currentGitUserConfig.id}` });
      }
    }

    this.workspaceStorage.set(storageKeys.CURRENT_OPENED_GIT_REPOSITORY, currentOpenedGitRepository);
  }

  private async _getCurrentGitUserConfig(openedGitRepository: string) {
    const gitUserConfigs = getGitUserConfigs();
    const localGitUserConfig = await getGitUserConfig(openedGitRepository, 'local');
    // Maybe it will use the includeIf.gitdir.path git config.
    const currentRepoGitUserConfig = await getGitUserConfig(openedGitRepository);
    return gitUserConfigs.find(gitUserConfig => {
      return (
        localGitUserConfig.userEmail === gitUserConfig.userEmail &&
        localGitUserConfig.username === gitUserConfig.username
      ) || (
          currentRepoGitUserConfig.userEmail === gitUserConfig.userEmail &&
          currentRepoGitUserConfig.username === gitUserConfig.username
      );
    });
  }

  private async updateGitConfigToStatusBarItem(currentGitUserConfig: GitUserConfig) {
    this.statusBarItem.updateStatusBarItem('Normal', { text: `${currentGitUserConfig.id}` });
  }

  // Return true, display it. Return false, hide it.
  private handleStatusBarItemDisplay() {
    if (this.gitRepositories.length === 0) {
      this.statusBarItem.getStatusBarItem().hide();
    } else {
      this.statusBarItem.getStatusBarItem().show();
    }
  }

  // Scans each workspace folder, looking for git repositories.
  private async scanWorkspaceFolders() {
    const workspaceFolderPaths = (vscode.workspace.workspaceFolders || []).map(folder => folder.uri.path);

    const gitRepositories: string[] = [];
    for (const workspaceFolderPath of workspaceFolderPaths) {
      if (await isGitRepo(workspaceFolderPath)) {
        gitRepositories.push(workspaceFolderPath);
      }
    }

    this.gitRepositories = gitRepositories;
  }

  private async checkIsGitUserConfigAlreadySet(gitRepository: string) {
    // Ensure show warning message only once for the same git repo.
    if ((this.globalStorage.get<string[]>(storageKeys.CHECKED_GIT_REPOSITORIES) || []).includes(gitRepository)) {
      return;
    }
    // Mark as checked git repo to global storage, don't show warning message next time.
    this.addCheckedGitRepositoryToStorage(gitRepository);

    const localGitUserConfig = await getGitUserConfig(gitRepository, 'local');
    // Maybe it will use the includeIf.gitdir.path git config.
    const currentRepoGitUserConfig = await getGitUserConfig(gitRepository);
    const globalGitUserConfig = await getGitUserConfig(gitRepository, 'global');
    if (
      // local git user config not set
      (localGitUserConfig.userEmail === null && localGitUserConfig.username === null) && (
        // If current repo git user config is same as global git user config, show warning message to user.
        currentRepoGitUserConfig.userEmail === globalGitUserConfig.userEmail &&
        currentRepoGitUserConfig.username === globalGitUserConfig.username
      )
    ) {
      const commandArgs = [
        gitRepository,
        globalGitUserConfig,
        () => {
          // While user confirm the message, we don't show warning status again.
          this.statusBarItem.updateStatusBarItem('Normal');
        },
      ];

      vscode.commands.executeCommand(
        GIT_USER_CONFIG_NOT_SET_WARNING_MESSAGE_COMMAND,
        ...commandArgs,
      );

      this.statusBarItem.updateStatusBarItem(
        'Warning',
        {
          command: {
            command: GIT_USER_CONFIG_NOT_SET_WARNING_MESSAGE_COMMAND,
            title: '',
            arguments: commandArgs,
          },
        },
      );
    }
  }

  // add checked git repository to global storage
  private addCheckedGitRepositoryToStorage(gitRepository: string) {
    const checkedGitRepositories = new Set(this.globalStorage.get<string[]>(
      storageKeys.CHECKED_GIT_REPOSITORIES) || [],
    );
    checkedGitRepositories.add(gitRepository);
    this.globalStorage.set(storageKeys.CHECKED_GIT_REPOSITORIES, Array.from(checkedGitRepositories.values()));
  }

  // remove checked git repository from global storage
  private removeCheckedGitRepositoryFromStorage(gitRepository: string) {
    const checkedGitRepositories = new Set(this.globalStorage.get<string[]>(
      storageKeys.CHECKED_GIT_REPOSITORIES) || [],
    );

    if (checkedGitRepositories.has(gitRepository)) {
      checkedGitRepositories.delete(gitRepository);
      this.globalStorage.set(storageKeys.CHECKED_GIT_REPOSITORIES, Array.from(checkedGitRepositories.values()));
    }
  }

  private async onDidChangeWorkspaceFolders({ added, removed }: vscode.WorkspaceFoldersChangeEvent) {
    // Handle removed workspace folders
    const removedWorkspaceFolders = removed.map(folder => folder.uri.path);

    await Promise.all(removedWorkspaceFolders.map(removedWorkspaceFolder => {
      return this.handleDeleteGitRepo(removedWorkspaceFolder);
    }));

    // Handle added workspace folders
    const addedWorkspaceFolders = added.map(folder => folder.uri.path);
    const gitRepositories: string[] = [];
    for (const addedWorkspaceFolder of addedWorkspaceFolders) {
      if (await isGitRepo(addedWorkspaceFolder)) {
        gitRepositories.push(addedWorkspaceFolder);
      }
    }
    gitRepositories.forEach(gitRepository => {
      this.handleCreateGitRepo(gitRepository);
    });
  }

  private onDidCreateGitDir = async (fileUri: vscode.Uri) => {
    const gitRepositoryPath = dirname(fileUri.path);
    const isGitRepository = await isGitRepo(gitRepositoryPath);
    if (!isGitRepository) {
      return;
    }

    this.handleCreateGitRepo(gitRepositoryPath);
  };

  private onDidDeleteGitDir = async (fileUri: vscode.Uri) => {
    this.handleDeleteGitRepo(dirname(fileUri.path));
  };

  private onDidChangeVisibleTextEditors = () => {
    this.setCurrentOpenedGitRepository();
  };

  private handleCreateGitRepo(gitRepositoryPath: string) {
    this.gitRepositories.push(gitRepositoryPath);

    this.handleStatusBarItemDisplay();

    this.setCurrentOpenedGitRepository();

    this.checkIsGitUserConfigAlreadySet(gitRepositoryPath);
  }

  private handleDeleteGitRepo(possibleGitRepositoryPath: string) {
    const possibleGitRepositoryIndex = this.gitRepositories.indexOf(possibleGitRepositoryPath);
    if (possibleGitRepositoryIndex === -1) {
      return;
    }

    const gitRepositoryPath = possibleGitRepositoryPath;

    this.gitRepositories.splice(possibleGitRepositoryIndex, 1);

    this.handleStatusBarItemDisplay();

    this.setCurrentOpenedGitRepository();

    this.removeCheckedGitRepositoryFromStorage(gitRepositoryPath);
  }
}
