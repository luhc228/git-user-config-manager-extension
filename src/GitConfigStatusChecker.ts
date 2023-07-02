import * as vscode from 'vscode';
import { isGitRepo, getUserConfig } from './utils/git';
import { NOT_SET_GIT_USER_CONFIG_WARNING_MESSAGE_COMMAND } from './commands/showNotSetGitUserConfigMessage';
import { storageKeys } from './constants';
import type StatusBarItem from './StatusBarItem';
import type { GlobalStorage, WorkspaceStorage } from './Storage';

export default class GitConfigStatusChecker {
  private statusBarItem: StatusBarItem;
  private globalStorage: GlobalStorage;
  private workspaceStorage: WorkspaceStorage;
  private gitRepositories: string[];

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

    const fsWatcher = vscode.workspace.createFileSystemWatcher('**');
    context.subscriptions.push(
      fsWatcher.onDidCreate(this.onDidCreateFile),
      fsWatcher.onDidDelete(this.onDidDeleteFile),
      vscode.workspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders),
      vscode.window.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors),
    );
    this.doInitialScan();
  }

  private async doInitialScan() {
    await this.scanWorkspaceFolders();

    const res = this.handleStatusBarItemDisplay();
    if (!res) {
      return;
    }

    this.setCurrentOpenedGitRepository();

    await Promise.all(this.gitRepositories.map((gitRepository) => {
      return this.checkIsGitUserConfigAlreadySet(gitRepository);
    }));
  }

  // set current opened git repository to workspace storage
  private setCurrentOpenedGitRepository() {
    let currentOpenedGitRepository: string = this.gitRepositories[0];

    const { activeTextEditor } = vscode.window;
    if (activeTextEditor && activeTextEditor.document.uri.scheme === 'file') {
      const resource = activeTextEditor.document.uri;
      const folder = vscode.workspace.getWorkspaceFolder(resource);
      const possibleGitRepository = this.gitRepositories.find(gitRepository => gitRepository === folder!.uri.path);
      if (possibleGitRepository) {
        currentOpenedGitRepository = possibleGitRepository;
      }
    }

    this.workspaceStorage.set(storageKeys.CURRENT_OPENED_GIT_REPOSITORY, currentOpenedGitRepository);
  }

  // Return true, display it. Return false, hide it.
  private handleStatusBarItemDisplay() {
    if (this.gitRepositories.length === 0) {
      this.statusBarItem.getStatusBarItem().hide();
      return false;
    }
    this.statusBarItem.getStatusBarItem().show();
    return true;
  }

  // Scans each workspace folder, looking for git repositories.
  private async scanWorkspaceFolders() {
    const workspaceFolderPaths = (vscode.workspace.workspaceFolders || []).map(folder => folder.uri.path);
    const gitRepositories = await this.getGitRepositories(workspaceFolderPaths);
    this.gitRepositories = gitRepositories;
  }

  private async getGitRepositories(files: string[]) {
    const gitRepositories: string[] = [];
    for (const file of files) {
      const possibleGitRepositoryPath = this.getPossibleGitRepository(file);
      if (await isGitRepo(possibleGitRepositoryPath)) {
        gitRepositories.push(possibleGitRepositoryPath);
      }
    }
    return gitRepositories;
  }

  private getPossibleGitRepository(path: string) {
    let possibleGitRepositoryPath;

    if (/\/\.git/.test(path)) {
      // get dir from file path
      const pathSplitItems = path.split('.git');
      possibleGitRepositoryPath = pathSplitItems[0];
    } else {
      // workspace dir
      possibleGitRepositoryPath = path;
    }
    return this.formatGitRepositoryPath(possibleGitRepositoryPath);
  }

  private async checkIsGitUserConfigAlreadySet(gitRepository: string) {
    if ((this.globalStorage.get<string[]>(storageKeys.CHECKED_GIT_REPOSITORIES) || []).includes(gitRepository)) {
      return;
    }
    const localUserConfig = await getUserConfig(gitRepository, 'local');
    if (localUserConfig.userEmail === null && localUserConfig.username === null) {
      // Show warning message.
      vscode.commands.executeCommand(
        NOT_SET_GIT_USER_CONFIG_WARNING_MESSAGE_COMMAND,
        gitRepository,
        () => {
          this.statusBarItem.updateStatusBarItem('Normal');
        },
      );
      this.statusBarItem.updateStatusBarItem('Warning', { command: NOT_SET_GIT_USER_CONFIG_WARNING_MESSAGE_COMMAND });

      // Update storage.
      this.addCheckedGitRepository(gitRepository);
    }
  }

  // add checked git repository to global storage
  private addCheckedGitRepository(gitRepository: string) {
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
    const addedWorkspaceFolders = added.map(folder => folder.uri.path);
    const removedWorkspaceFolders = removed.map(folder => folder.uri.path);

    const addedGitRepositories = await this.getGitRepositories(addedWorkspaceFolders);

    await Promise.all(removedWorkspaceFolders.map(removedWorkspaceFolder => {
      const possibleGitRepository = this.getPossibleGitRepository(removedWorkspaceFolder);
      const possibleGitRepositoryIndex = this.gitRepositories.indexOf(possibleGitRepository);
      if (possibleGitRepositoryIndex > -1) {
        this.gitRepositories.splice(possibleGitRepositoryIndex, 0);
      }
      return this.removeCheckedGitRepositoryFromStorage(possibleGitRepository);
    }));

    this.gitRepositories = this.gitRepositories.concat(addedGitRepositories);
    const res = this.handleStatusBarItemDisplay();
    if (!res) {
      return;
    }

    this.setCurrentOpenedGitRepository();

    await Promise.all(addedGitRepositories.map((addedGitRepository) => {
      return this.checkIsGitUserConfigAlreadySet(addedGitRepository);
    }));
  }

  private onDidCreateFile = async (fileUri: vscode.Uri) => {
    const gitRepositories = await this.getGitRepositories([fileUri.path]);
    this.gitRepositories = this.gitRepositories.concat(gitRepositories);

    const res = this.handleStatusBarItemDisplay();
    if (!res) {
      return;
    }

    this.setCurrentOpenedGitRepository();

    await Promise.all(gitRepositories.map((gitRepository) => {
      return this.checkIsGitUserConfigAlreadySet(gitRepository);
    }));
  };

  private onDidDeleteFile = async (fileUri: vscode.Uri) => {
    this.removeCheckedGitRepositoryFromStorage(this.getPossibleGitRepository(fileUri.path));
  };

  private onDidChangeVisibleTextEditors = () => {
    this.setCurrentOpenedGitRepository();
  };

  private formatGitRepositoryPath(originalGitRepositoryPath: string) {
    return originalGitRepositoryPath.replace(/[/\\\\]$/, '');
  }
}
