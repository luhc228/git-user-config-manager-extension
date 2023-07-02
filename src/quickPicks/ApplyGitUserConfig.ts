import * as vscode from 'vscode';
import { setUserConfig as setGitUserConfig } from '../utils/git';
import type { WorkspaceStorage } from '../Storage';
import { storageKeys } from '../constants';
import { getBaseGitUserConfigs } from '../utils/baseGitUserConfigs';
import { SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND } from '../commands/showNoGitUserConfigsFoundMessage';
import showGitUserConfigsQuickPick from './showGitUserConfigs';

export default async function showApplyGitUserConfigQuickPick(
  context: vscode.ExtensionContext,
  quickPick: vscode.QuickPick<vscode.QuickPickItem>,
  workspaceStorage: WorkspaceStorage,
) {
  const gitUserConfigs = getBaseGitUserConfigs();

  if (gitUserConfigs.length === 0) {
    await vscode.commands.executeCommand(SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND);
    quickPick.dispose();
    return;
  }

  showGitUserConfigsQuickPick(gitUserConfigs, async (selection) => {
    const selected = gitUserConfigs.find(gitUserConfig => gitUserConfig.id === selection.label);

    await setGitUserConfig(
      workspaceStorage.get(storageKeys.CURRENT_OPENED_GIT_REPOSITORY),
      selected!.username,
      selected!.userEmail,
    );
  });
}
