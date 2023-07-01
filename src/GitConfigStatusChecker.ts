import * as vscode from 'vscode';
import { isGitRepo, getUserConfig } from './utils/git';
import { GIT_USER_CONFIG_WARNING_MESSAGE } from './commands/gitUserConfigWarningMessage';
import { storageKeys } from './constants';
import type StatusBarItem from './StatusBarItem';
import type Storage from './Storage';

export default class GitConfigStatusChecker {
  private statusBarItem: StatusBarItem;
  private gitRepositories: string[];
  private context: vscode.ExtensionContext;
  private storage: Storage;

  constructor(
    context: vscode.ExtensionContext,
    statusBarItem: StatusBarItem,
    storage: Storage,
  ) {
    this.statusBarItem = statusBarItem;
    this.context = context;
    this.gitRepositories = [];
    this.storage = storage;

    context.subscriptions.push(
      vscode.window.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors),
      vscode.workspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders),
    );

    this.doInitialScan();
  }

  getGitRepositories() {
    return this.gitRepositories;
  }

  private async doInitialScan() {
    this.scanWorkspaceFolders();
    await this.checkIsGitUserConfigAlreadySet();
  }

  private scanWorkspaceFolders() {
    (vscode.workspace.workspaceFolders || []).forEach(folder => {
      // TODO: Support workspace folder children: https://github.com/microsoft/vscode/blob/main/extensions/git/src/model.ts#L344
      this.openGitRepository(folder.uri.path);
    });
  }

  private async checkIsGitUserConfigAlreadySet() {
    for (const gitRepository of this.gitRepositories) {
      if ((this.storage.get<string[]>(storageKeys.CHECKED_GIT_REPOSITORIES) || []).includes(gitRepository)) {
        continue;
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
        const newCheckedGitRepositories = [
          ...(this.storage.get<string[]>(storageKeys.CHECKED_GIT_REPOSITORIES) || []),
          gitRepository,
        ];
        this.storage.set(storageKeys.CHECKED_GIT_REPOSITORIES, newCheckedGitRepositories);
      }
    }
  }

  private openGitRepository(folderPath: string) {
    if (isGitRepo(folderPath)) {
      this.gitRepositories.push(folderPath);
    }
  }

  private onDidChangeWorkspaceFolders() {
    // TODO:
  }

  private onDidChangeVisibleTextEditors() {

  }
}
