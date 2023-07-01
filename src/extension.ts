import * as vscode from 'vscode';
import GitConfigStatusChecker from './GitConfigStatusChecker';
import StatusBar from './StatusBarItem';
import registerCommands from './commands';
import Storage from './Storage';

export function activate(context: vscode.ExtensionContext) {
  registerCommands(context);

  const statusBar = new StatusBar(context);
  statusBar.updateStatusBarItem();

  const storage = new Storage(context);
  new GitConfigStatusChecker(context, statusBar, storage);
}

export function deactivate() { }
