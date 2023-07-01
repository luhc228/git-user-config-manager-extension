import * as vscode from 'vscode';
import * as path from 'path';

export const GIT_USER_CONFIG_WARNING_MESSAGE = 'git-user-config-manager.gitUserConfigNotSetWarningMessage';

export default function registryGitUserConfigWarningMessage() {
  return vscode.commands.registerCommand(
    GIT_USER_CONFIG_WARNING_MESSAGE,
    (gitRepoPath: string, callback: () => void) => {
      const actions = ['Yes', 'No'];
      vscode.window.showWarningMessage<string>(
        `Current git repository(${path.basename(gitRepoPath)}) is not set the user config. Do you want to set it?`,
        ...actions,
      ).then(res => {
        callback();
        if (res === actions[0]) {
          // TODO: show then git config select
        }
      });
    },
  );
}
