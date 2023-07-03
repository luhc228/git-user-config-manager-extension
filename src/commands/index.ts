import * as vscode from 'vscode';
import registryShowGitUserConfigNotSetMessage from './showGitUserConfigNotSetMessage';
import registryShowEntryOptionsQuickPick from './showEntryOptionsQuickPick';
import registryShowNoGitUserConfigsFoundMessage from './showNoGitUserConfigsFoundMessage';
import registryShowAddUserConfigQuickPick from './addGitUserConfig';
import registryShowApplyGitUserConfigQuickPick from './showApplyGitUserConfigQuickPick';
import type { WorkspaceStorage } from '../Storage';

export default function registerCommands(
  context: vscode.ExtensionContext,
  workspaceStorage: WorkspaceStorage,
) {
  context.subscriptions.push(
    registryShowGitUserConfigNotSetMessage(),
    registryShowEntryOptionsQuickPick(context, workspaceStorage),
    registryShowAddUserConfigQuickPick(),
    registryShowNoGitUserConfigsFoundMessage(),
    registryShowApplyGitUserConfigQuickPick(context, workspaceStorage),
  );
}
