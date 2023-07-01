import * as vscode from 'vscode';
import registryGitUserConfigWarningMessage from './gitUserConfigWarningMessage';

export default function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    registryGitUserConfigWarningMessage(),
  );
}
