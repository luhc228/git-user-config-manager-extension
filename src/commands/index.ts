import * as vscode from 'vscode';
import registryGitUserConfigWarningMessage from './gitUserConfigWarningMessage';
import registryGitUserConfigQuickPick from './gitUserConfigQuickPick';
import type { WorkspaceStorage } from '../Storage';

export default function registerCommands(
  context: vscode.ExtensionContext,
  workspaceStorage: WorkspaceStorage,
) {
  context.subscriptions.push(
    registryGitUserConfigWarningMessage(),
    registryGitUserConfigQuickPick(context, workspaceStorage),
  );
}
