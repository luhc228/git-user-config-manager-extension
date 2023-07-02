import * as vscode from 'vscode';
import { showAddGitUserConfigMultiInput } from '../quickPicks';

export const ADD_GIT_USER_CONFIG_COMMAND = 'git-user-config-manager.addGitUserConfig';

export default function registryShowAddUserConfigQuickPick() {
  return vscode.commands.registerCommand(
    ADD_GIT_USER_CONFIG_COMMAND,
    () => {
      showAddGitUserConfigMultiInput();
    },
  );
}
