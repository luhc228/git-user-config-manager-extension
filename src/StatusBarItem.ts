import * as vscode from 'vscode';

type Status = 'Normal' | 'Warning';

export default class GitUserConfigStatusBarItem {
  private statusBarItem: vscode.StatusBarItem;
  private defaultStatusBarLabel: string = 'Git User Config';

  constructor(
    context: vscode.ExtensionContext,
  ) {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    context.subscriptions.push(this.statusBarItem);

    this.statusBarItem.show();
  }

  public updateStatusBarItem(
    status: Status = 'Normal',
    statusBarItemProperties: { text?: string; command?: vscode.StatusBarItem['command']; tooltip?: vscode.StatusBarItem['tooltip'] } = {},
  ) {
    this.statusBarItem.text = `$(source-control) ${statusBarItemProperties.text || this.defaultStatusBarLabel}`;
    this.statusBarItem.command = statusBarItemProperties.command;
    this.statusBarItem.tooltip = statusBarItemProperties.tooltip;

    if (status === 'Warning') {
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else {
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.activeBackground');
    }
  }

  public getStatusBarItem() {
    return this.statusBarItem;
  }
}
