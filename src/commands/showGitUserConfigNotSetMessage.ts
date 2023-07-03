import * as vscode from 'vscode';
import * as path from 'node:path';
import { SHOW_APPLY_GIT_USER_CONFIG_QUICK_PICK_COMMAND } from './showApplyGitUserConfigQuickPick';

export const GIT_USER_CONFIG_NOT_SET_WARNING_MESSAGE_COMMAND = 'git-user-config-manager.showNotSetGitUserConfigWarningMessage';

let showWarningMessage = false;

export default function registryShowGitUserConfigNotSetWarningMessage() {
  return vscode.commands.registerCommand(
    GIT_USER_CONFIG_NOT_SET_WARNING_MESSAGE_COMMAND,
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
          vscode.commands.executeCommand(SHOW_APPLY_GIT_USER_CONFIG_QUICK_PICK_COMMAND);
        }
      });
    },
  );
}
