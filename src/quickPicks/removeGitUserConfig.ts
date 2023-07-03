import * as vscode from 'vscode';
import { getBaseGitUserConfigs, removeBaseGitUserConfig } from '../utils/baseGitUserConfigs';
import { SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND } from '../commands/showNoGitUserConfigsFoundMessage';
import showGitUserConfigsQuickPick from './showGitUserConfigs';
import { WorkspaceStorage } from '../Storage';
import type StatusBarItem from 'src/StatusBarItem';

export default async function showRemoveGitUserConfigQuickPick(
  context: vscode.ExtensionContext,
  workspaceStorage: WorkspaceStorage,
  statusBarItem: StatusBarItem,
) {
  const gitUserConfigs = getBaseGitUserConfigs();

  if (gitUserConfigs.length === 0) {
    await vscode.commands.executeCommand(SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND);
    return;
  }

  showGitUserConfigsQuickPick(gitUserConfigs, async (selection) => {
    await removeBaseGitUserConfig(selection.label);
    statusBarItem.updateStatusBarItem('Normal');
    vscode.window.showInformationMessage(`Remove git user config ${selection.label} successfully!`);
  });
}
