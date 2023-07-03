import * as vscode from 'vscode';
import { showApplyGitUserConfigQuickPick } from '../quickPicks';
import type { WorkspaceStorage } from '../Storage';

export const SHOW_APPLY_GIT_USER_CONFIG_QUICK_PICK_COMMAND = 'git-user-config-manager.showApplyGitUserConfigQuickPick';

export default function registryShowApplyGitUserConfigQuickPick(
  context: vscode.ExtensionContext,
  workspaceStorage: WorkspaceStorage,
) {
  return vscode.commands.registerCommand(
    SHOW_APPLY_GIT_USER_CONFIG_QUICK_PICK_COMMAND,
    () => {
      showApplyGitUserConfigQuickPick(context, workspaceStorage);
    },
  );
}
