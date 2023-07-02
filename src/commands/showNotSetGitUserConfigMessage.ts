import * as vscode from 'vscode';
import * as path from 'node:path';
import { SHOW_ENTRY_OPTIONS_QUICK_PICK_COMMAND } from './showEntryOptionsQuickPick';

export const NOT_SET_GIT_USER_CONFIG_WARNING_MESSAGE_COMMAND = 'git-user-config-manager.showNotSetGitUserConfigWarningMessage';

let showWarningMessage = false;

export default function registryShowNotSetGitUserConfigWarningMessage() {
  return vscode.commands.registerCommand(
    NOT_SET_GIT_USER_CONFIG_WARNING_MESSAGE_COMMAND,
    (gitRepoPath: string, callback: () => void) => {
      if (showWarningMessage) {
        return;
      }
      showWarningMessage = true;
      const actions = ['Yes', 'No'];
      vscode.window.showWarningMessage<string>(
        `Current git repository(${path.basename(gitRepoPath)}) is not set the user config. Do you want to set it?`,
        ...actions,
      ).then(res => {
        showWarningMessage = false;
        callback();
        if (res === actions[0]) {
          vscode.commands.executeCommand(SHOW_ENTRY_OPTIONS_QUICK_PICK_COMMAND);
        }
      });
    },
  );
}
