import * as vscode from 'vscode';
import GitConfigStatusChecker from './GitConfigStatusChecker';
import StatusBar from './StatusBarItem';
import registerCommands from './commands';
import { GlobalStorage, WorkspaceStorage } from './Storage';
import initGitConfigs from './initGitConfigs';

export async function activate(context: vscode.ExtensionContext) {
  await initGitConfigs();

  const globalStorage = new GlobalStorage(context);
  const workspaceStorage = new WorkspaceStorage(context);

  const statusBar = new StatusBar(context);
  statusBar.updateStatusBarItem();

  const gitConfigStatusChecker = new GitConfigStatusChecker(context, statusBar, globalStorage, workspaceStorage);

  registerCommands(context, workspaceStorage, statusBar, gitConfigStatusChecker);
}

export function deactivate() { }
