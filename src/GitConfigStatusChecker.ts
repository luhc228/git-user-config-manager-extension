import * as vscode from 'vscode';
import { isGitRepo, getUserConfig } from './utils/git';
import { GIT_USER_CONFIG_WARNING_MESSAGE } from './commands/gitUserConfigWarningMessage';
import { storageKeys } from './constants';
import type StatusBarItem from './StatusBarItem';
import type Storage from './Storage';

export default class GitConfigStatusChecker {
  private statusBarItem: StatusBarItem;
  private storage: Storage;

  constructor(
    context: vscode.ExtensionContext,
    statusBarItem: StatusBarItem,
    storage: Storage,
  ) {
    this.statusBarItem = statusBarItem;
    this.storage = storage;
    const fsWatcher = vscode.workspace.createFileSystemWatcher('**');
    context.subscriptions.push(
      fsWatcher.onDidCreate(this.onDidCreateFile),
      fsWatcher.onDidDelete(this.onDidDeleteFile),
      vscode.workspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders),
    );
    this.doInitialScan();
  }

  private async doInitialScan() {
    const gitRepositories = await this.scanWorkspaceFolders();
    await Promise.all(gitRepositories.map((gitRepository) => {
      return this.checkIsGitUserConfigAlreadySet(gitRepository);
    }));
  }

  // Scans each workspace folder, looking for git repositories.
  private async scanWorkspaceFolders() {
    const workspaceFolderPaths = (vscode.workspace.workspaceFolders || []).map(folder => folder.uri.path);
    return this.getGitRepositories(workspaceFolderPaths);
  }

  private async getGitRepositories(files: string[]) {
    const gitRepositories: string[] = [];
    for (const file of files) {
      const possibleGitRepositoryPath = this.getPossibleGitRepositoryPath(file);
      if (await isGitRepo(possibleGitRepositoryPath)) {
        gitRepositories.push(possibleGitRepositoryPath);
      }
    }
    return gitRepositories;
  }

  private getPossibleGitRepositoryPath(path: string) {
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
    if ((this.storage.get<string[]>(storageKeys.CHECKED_GIT_REPOSITORIES) || []).includes(gitRepository)) {
      return;
    }
    const localUserConfig = await getUserConfig(gitRepository, 'local');
    if (localUserConfig.userEmail === null && localUserConfig.username === null) {
      // Show warning message.
      vscode.commands.executeCommand(
        GIT_USER_CONFIG_WARNING_MESSAGE,
        gitRepository,
        () => {
          this.statusBarItem.updateStatusBarItem('Normal');
        },
      );
      this.statusBarItem.updateStatusBarItem('Warning', { command: GIT_USER_CONFIG_WARNING_MESSAGE });

      // Update storage.
      this.addCheckedGitRepositoryToStorage(gitRepository);
    }
  }

  private addCheckedGitRepositoryToStorage(gitRepository: string) {
    const checkedGitRepositories = new Set(this.storage.get<string[]>(storageKeys.CHECKED_GIT_REPOSITORIES) || []);
    checkedGitRepositories.add(gitRepository);
    this.storage.set(storageKeys.CHECKED_GIT_REPOSITORIES, Array.from(checkedGitRepositories.values()));
  }

  private removeCheckedGitRepositoryFromStorage(gitRepository: string) {
    const checkedGitRepositories = new Set(this.storage.get<string[]>(storageKeys.CHECKED_GIT_REPOSITORIES) || []);

    if (checkedGitRepositories.has(gitRepository)) {
      checkedGitRepositories.delete(gitRepository);
      this.storage.set(storageKeys.CHECKED_GIT_REPOSITORIES, Array.from(checkedGitRepositories.values()));
    }
  }

  private async onDidChangeWorkspaceFolders({ added, removed }: vscode.WorkspaceFoldersChangeEvent) {
    const addedWorkspaceFolders = added.map(folder => folder.uri.path);
    const removedWorkspaceFolders = removed.map(folder => folder.uri.path);

    const addedGitRepositories = await this.getGitRepositories(addedWorkspaceFolders);
    await Promise.all(addedGitRepositories.map((addedGitRepository) => {
      return this.checkIsGitUserConfigAlreadySet(addedGitRepository);
    }));

    await Promise.all(removedWorkspaceFolders.map(removedWorkspaceFolder => {
      return this.removeCheckedGitRepositoryFromStorage(this.getPossibleGitRepositoryPath(removedWorkspaceFolder));
    }));
  }

  private onDidCreateFile = async (fileUri: vscode.Uri) => {
    const gitRepositories = await this.getGitRepositories([fileUri.path]);

    await Promise.all(gitRepositories.map((gitRepository) => {
      return this.checkIsGitUserConfigAlreadySet(gitRepository);
    }));
  };

  private onDidDeleteFile = async (fileUri: vscode.Uri) => {
    this.removeCheckedGitRepositoryFromStorage(this.getPossibleGitRepositoryPath(fileUri.path));
  };

  private formatGitRepositoryPath(originalGitRepositoryPath: string) {
    return originalGitRepositoryPath.replace(/[/\\\\]$/, '');
  }
}
