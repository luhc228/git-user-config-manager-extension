import * as vscode from 'vscode';
import { showEntryOptionsQuickPick } from '../quickPicks';
import type { WorkspaceStorage } from '../Storage';

export const GIT_USER_CONFIG_QUICK_PICK = 'git-user-config-manager.gitUserConfigQuickPick';

export default function registryGitUserConfigQuickPick(
  context: vscode.ExtensionContext,
  workspaceStorage: WorkspaceStorage,
) {
  return vscode.commands.registerCommand(
    GIT_USER_CONFIG_QUICK_PICK,
    () => {
      showEntryOptionsQuickPick(context, workspaceStorage);
    },
  );
}
