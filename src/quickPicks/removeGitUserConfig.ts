import * as vscode from 'vscode';
import { getBaseGitUserConfigs, removeBaseGitConfig } from '../utils/baseGitUserConfigs';
import { SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND } from '../commands/showNoGitUserConfigsFoundMessage';
import showGitUserConfigsQuickPick from './showGitUserConfigs';

export default async function showRemoveGitUserConfigQuickPick(
  context: vscode.ExtensionContext,
  quickPick: vscode.QuickPick<vscode.QuickPickItem>,
) {
  const gitUserConfigs = getBaseGitUserConfigs();

  if (gitUserConfigs.length === 0) {
    await vscode.commands.executeCommand(SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND);
    quickPick.dispose();
    return;
  }

  showGitUserConfigsQuickPick(gitUserConfigs, async (selection) => {
    await removeBaseGitConfig(selection.label);
    vscode.window.showInformationMessage(`Remove git user config ${selection.label} successfully!`);
  });
}
