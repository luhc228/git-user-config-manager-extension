import * as vscode from 'vscode';
import { setUserConfig as setGitUserConfig } from '../utils/git';
import type { BaseGitUserConfig } from '../types';
import type { WorkspaceStorage } from '../Storage';
import { VSCConfigurationKey, storageKeys } from '../constants';

export default async function showGitUserConfigsQuickPick(
  context: vscode.ExtensionContext,
  workspaceStorage: WorkspaceStorage,
) {
  const gitUserConfigs = vscode.workspace
    .getConfiguration()
    .get(VSCConfigurationKey.GIT_USER_CONFIG) as BaseGitUserConfig[];

  if (!gitUserConfigs.length) {
    const actionItem = 'Add Git User Config';
    vscode.window.showWarningMessage(
      'It seems you haven\'t added the git user config yet. Please add it.',
      actionItem,
    ).then(res => {
      if (actionItem === res) {
        // TODO: execute command to show add git user config setup input quick input
        // vscode.commands.executeCommand()
      }
    });
    return;
  }

  const quickPick = vscode.window.createQuickPick();
  quickPick.items = gitUserConfigs.map(({ id, userEmail, username }) => ({
    label: id,
    detail: `$(account) ${username}
$(mail) ${userEmail}`,
  }));
  quickPick.onDidChangeSelection(async selection => {
    if (selection[0]) {
      const selected = gitUserConfigs.find(gitUserConfig => gitUserConfig.id === selection[0].label);

      setGitUserConfig(
        workspaceStorage.get(storageKeys.CURRENT_OPENED_GIT_REPOSITORY),
        selected!.username,
        selected!.userEmail,
      ).catch((err) => {
        vscode.window.showErrorMessage(err.message);
      }).finally(() => {
        quickPick.dispose();
      });
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
