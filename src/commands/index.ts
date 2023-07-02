import * as vscode from 'vscode';
import registryShowNotSetGitUserConfigMessage from './showNotSetGitUserConfigMessage';
import registryShowEntryOptionsQuickPick from './showEntryOptionsQuickPick';
import registryShowNoGitUserConfigsFoundMessage from './showNoGitUserConfigsFoundMessage';
import registryShowAddUserConfigQuickPick from './addGitUserConfig';

import type { WorkspaceStorage } from '../Storage';

export default function registerCommands(
  context: vscode.ExtensionContext,
  workspaceStorage: WorkspaceStorage,
) {
  context.subscriptions.push(
    registryShowNotSetGitUserConfigMessage(),
    registryShowEntryOptionsQuickPick(context, workspaceStorage),
    registryShowAddUserConfigQuickPick(),
    registryShowNoGitUserConfigsFoundMessage(),
  );
}
