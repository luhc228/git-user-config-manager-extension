import * as vscode from 'vscode';

type Status = 'Normal' | 'Warning';

export default class GitUserConfigStatusBarItem {
  private statusBarItem: vscode.StatusBarItem;
  private defaultStatusBarLabel: string = 'Git User Config';
  private normalStatusCommand: string | undefined;
  constructor(
    context: vscode.ExtensionContext,
  ) {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    context.subscriptions.push(this.statusBarItem);
    this.normalStatusCommand = undefined;
    this.statusBarItem.show();
  }

  public updateStatusBarItem(
    status: Status = 'Normal',
    statusBarItemProperties: { text?: string; command?: vscode.StatusBarItem['command']; tooltip?: vscode.StatusBarItem['tooltip'] } = {},
  ) {
    this.statusBarItem.text = `$(source-control) ${statusBarItemProperties.text || this.defaultStatusBarLabel}`;

    if (status === 'Warning') {
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
      this.statusBarItem.command = statusBarItemProperties.command;
      this.statusBarItem.tooltip = statusBarItemProperties.tooltip;
    } else {
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.activeBackground');
      this.statusBarItem.command = statusBarItemProperties.command ?? this.normalStatusCommand;
      this.statusBarItem.tooltip = statusBarItemProperties.tooltip;
    }
  }

  public getStatusBarItem() {
    return this.statusBarItem;
  }
}
