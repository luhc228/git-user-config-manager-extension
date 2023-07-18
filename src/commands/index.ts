import * as vscode from 'vscode';
import registryShowGitUserConfigNotSetMessage from './showGitUserConfigNotSetMessage';
import registryShowEntryOptionsQuickPick from './showEntryOptionsQuickPick';
import registryShowNoGitUserConfigsFoundMessage from './showNoGitUserConfigsFoundMessage';
import registryShowAddUserConfigQuickPick from './addGitUserConfig';
import registryShowApplyGitUserConfigQuickPick from './showApplyGitUserConfigQuickPick';
import type { WorkspaceStorage } from '../Storage';
import type StatusBarItem from '../StatusBarItem';
import type GitConfigStatusChecker from '../GitConfigStatusChecker';

export default function registerCommands(
  context: vscode.ExtensionContext,
  workspaceStorage: WorkspaceStorage,
  statusBarItem: StatusBarItem,
  gitConfigStatusChecker: GitConfigStatusChecker,
) {
  context.subscriptions.push(
    registryShowGitUserConfigNotSetMessage(),
    registryShowEntryOptionsQuickPick(context, workspaceStorage, statusBarItem, gitConfigStatusChecker),
    registryShowAddUserConfigQuickPick(),
    registryShowNoGitUserConfigsFoundMessage(),
    registryShowApplyGitUserConfigQuickPick(context, workspaceStorage, statusBarItem),
  );
}
