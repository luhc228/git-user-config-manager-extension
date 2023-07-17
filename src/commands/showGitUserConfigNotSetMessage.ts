import * as vscode from 'vscode';
import * as path from 'node:path';
import { SHOW_APPLY_GIT_USER_CONFIG_QUICK_PICK_COMMAND } from './showApplyGitUserConfigQuickPick';
import type { GitUserConfig } from '../types';

export const GIT_USER_CONFIG_NOT_SET_WARNING_MESSAGE_COMMAND = 'git-user-config-manager.showNotSetGitUserConfigWarningMessage';

let showWarningMessage = false;

export default function registryShowGitUserConfigNotSetWarningMessage() {
  return vscode.commands.registerCommand(
    GIT_USER_CONFIG_NOT_SET_WARNING_MESSAGE_COMMAND,
    (gitRepoPath: string, { username, userEmail }: GitUserConfig, callback: () => void) => {
      if (showWarningMessage) {
        return;
      }
      showWarningMessage = true;
      const actions = ['Yes', 'No'];
      vscode.window.showWarningMessage<string>(
        `Current git repository(${path.basename(gitRepoPath)}) will use the global git config(${username}(${userEmail})). Do you want to use another one?`,
        ...actions,
      ).then(
        (res) => {
        showWarningMessage = false;
        callback();
        if (res === actions[0]) {
          vscode.commands.executeCommand(SHOW_APPLY_GIT_USER_CONFIG_QUICK_PICK_COMMAND);
        }
        },
        () => {
          showWarningMessage = false;
        },
      );
    },
  );
}
