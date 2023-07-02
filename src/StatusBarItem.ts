import * as vscode from 'vscode';
import { SHOW_ENTRY_OPTIONS_QUICK_PICK_COMMAND } from './commands/showEntryOptionsQuickPick';

type Status = 'Normal' | 'Warning';

export default class GitUserConfigStatusBarItem {
  private statusBarItem: vscode.StatusBarItem;
  private defaultStatusBarLabel: string = 'Git User Config';
  private defaultStatusBarTooltip: string = 'Click to run Git User Config Manager';
  private normalStatusCommand: string | undefined;
  constructor(
    context: vscode.ExtensionContext,
  ) {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    context.subscriptions.push(this.statusBarItem);
    this.normalStatusCommand = SHOW_ENTRY_OPTIONS_QUICK_PICK_COMMAND;
  }

  public updateStatusBarItem(
    status: Status = 'Normal',
    statusBarItemProperties: { text?: string; command?: vscode.StatusBarItem['command']; tooltip?: vscode.StatusBarItem['tooltip'] } = {},
  ) {
    this.statusBarItem.text = `$(source-control) ${statusBarItemProperties.text || this.defaultStatusBarLabel}`;
    this.statusBarItem.tooltip = statusBarItemProperties.tooltip ?? this.defaultStatusBarTooltip;

    if (status === 'Warning') {
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
      this.statusBarItem.command = statusBarItemProperties.command;
    } else {
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.activeBackground');
      this.statusBarItem.command = statusBarItemProperties.command ?? this.normalStatusCommand;
    }
  }

  public getStatusBarItem() {
    return this.statusBarItem;
  }
}
