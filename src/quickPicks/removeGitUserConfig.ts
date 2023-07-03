import * as vscode from 'vscode';
import { getBaseGitUserConfigs, removeBaseGitConfig } from '../utils/baseGitUserConfigs';
import { SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND } from '../commands/showNoGitUserConfigsFoundMessage';
import showGitUserConfigsQuickPick from './showGitUserConfigs';

export default async function showRemoveGitUserConfigQuickPick() {
  const gitUserConfigs = getBaseGitUserConfigs();

  if (gitUserConfigs.length === 0) {
    await vscode.commands.executeCommand(SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND);
    return;
  }

  showGitUserConfigsQuickPick(gitUserConfigs, async (selection) => {
    await removeBaseGitConfig(selection.label);
    vscode.window.showInformationMessage(`Remove git user config ${selection.label} successfully!`);
  });
}
