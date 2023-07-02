import * as vscode from 'vscode';
import { showEntryOptionsQuickPick } from '../quickPicks';
import type { WorkspaceStorage } from '../Storage';

export const SHOW_ENTRY_OPTIONS_QUICK_PICK_COMMAND = 'git-user-config-manager.showEntryOptionsQuickPick';

export default function registryShowEntryOptionsQuickPick(
  context: vscode.ExtensionContext,
  workspaceStorage: WorkspaceStorage,
) {
  return vscode.commands.registerCommand(
    SHOW_ENTRY_OPTIONS_QUICK_PICK_COMMAND,
    () => {
      showEntryOptionsQuickPick(context, workspaceStorage);
    },
  );
}
