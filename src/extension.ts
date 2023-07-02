import * as vscode from 'vscode';
import GitConfigStatusChecker from './GitConfigStatusChecker';
import StatusBar from './StatusBarItem';
import registerCommands from './commands';
import { GlobalStorage, WorkspaceStorage } from './Storage';
import initGlobalConfig from './initGlobalConfig';

export async function activate(context: vscode.ExtensionContext) {
  await initGlobalConfig();

  const globalStorage = new GlobalStorage(context);
  const workspaceStorage = new WorkspaceStorage(context);

  registerCommands(context, workspaceStorage);

  const statusBar = new StatusBar(context);
  statusBar.updateStatusBarItem();


  new GitConfigStatusChecker(context, statusBar, globalStorage, workspaceStorage);
}

export function deactivate() { }
