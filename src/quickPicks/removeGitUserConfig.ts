import * as vscode from 'vscode';
import { getGitUserConfigs, removeGitUserConfig } from '../utils/gitUserConfigs';
import { SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND } from '../commands/showNoGitUserConfigsFoundMessage';
import showGitUserConfigsQuickPick from './showGitUserConfigs';
import { WorkspaceStorage } from '../Storage';
import type StatusBarItem from '../StatusBarItem';
import GitConfigStatusChecker from 'src/GitConfigStatusChecker';

export default async function showRemoveGitUserConfigQuickPick(
  context: vscode.ExtensionContext,
  workspaceStorage: WorkspaceStorage,
  statusBarItem: StatusBarItem,
  gitConfigStatusChecker: GitConfigStatusChecker,
) {
  const gitUserConfigs = getGitUserConfigs();

  if (gitUserConfigs.length === 0) {
    await vscode.commands.executeCommand(SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND);
    return;
  }

  showGitUserConfigsQuickPick(gitUserConfigs, async (selection) => {
    await removeGitUserConfig(selection.label);
    if (gitConfigStatusChecker.getCurrentGitUserConfig()?.id === selection.label) {
      statusBarItem.updateStatusBarItem('Normal');
    }
    vscode.window.showInformationMessage(`Remove git user config ${selection.label} successfully!`);
  });
}
