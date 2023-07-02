import * as vscode from 'vscode';
import { ADD_GIT_USER_CONFIG_COMMAND } from './addGitUserConfig';

export const SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND = 'git-user-config-manager.showNoGitUserConfigsFoundWarningMessage';

export default function registerShowNoGitUserConfigsFoundWarningMessage() {
  return vscode.commands.registerCommand(
    SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND,
    () => {
      const actionItem = 'Add Git User Config';
      vscode.window.showWarningMessage(
        'It seems you haven\'t added the git user config yet. Please add it.',
        actionItem,
      ).then(confirm => {
        if (actionItem === confirm) {
          vscode.commands.executeCommand(ADD_GIT_USER_CONFIG_COMMAND);
        }
      });
    },
  );
}
