import * as vscode from 'vscode';
import { setUserConfig as setGitUserConfig } from '../utils/git';
import type { WorkspaceStorage } from '../Storage';
import { storageKeys } from '../constants';
import { getGitUserConfigs } from '../utils/gitUserConfigs';
import { SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND } from '../commands/showNoGitUserConfigsFoundMessage';
import showGitUserConfigsQuickPick from './showGitUserConfigs';
import type StatusBarItem from '../StatusBarItem';

export default async function showApplyGitUserConfigQuickPick(
  context: vscode.ExtensionContext,
  workspaceStorage: WorkspaceStorage,
  statusBarItem: StatusBarItem,
) {
  const gitUserConfigs = getGitUserConfigs();

  if (gitUserConfigs.length === 0) {
    await vscode.commands.executeCommand(SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND);
    return;
  }

  showGitUserConfigsQuickPick(gitUserConfigs, async (selection) => {
    const selected = gitUserConfigs.find(gitUserConfig => gitUserConfig.id === selection.label);
    if (!selected) {
      throw new Error(`There is no existing git user config of ${selection.label}.`);
    }

    await setGitUserConfig(
      workspaceStorage.get(storageKeys.CURRENT_OPENED_GIT_REPOSITORY),
      selected.username,
      selected.userEmail,
    );
    statusBarItem.updateStatusBarItem('Normal', { text: `${selected.id}` });
    vscode.window.showInformationMessage(`Apply git user config '${selected.id}' successfully!`);
  });
}
