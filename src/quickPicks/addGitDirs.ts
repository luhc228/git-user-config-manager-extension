import * as vscode from 'vscode';
import { SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND } from '../commands/showNoGitUserConfigsFoundMessage';
import { getBaseGitUserConfigs } from '../utils/baseGitUserConfigs';
import showGitUserConfigsQuickPick from './showGitUserConfigs';
import { addUserGitDir } from '../utils/git';

export default async function addGitDirs() {
  const gitUserConfigs = getBaseGitUserConfigs();

  if (gitUserConfigs.length === 0) {
    await vscode.commands.executeCommand(SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND);
    return;
  }

  showGitUserConfigsQuickPick(gitUserConfigs, async (selection) => {
    const selected = gitUserConfigs.find(gitUserConfig => gitUserConfig.id === selection.label);
    if (!selected) {
      throw new Error(`There is no existing git user config of ${selection.label}.`);
    }

    const selectFolderUris = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: true,
    });
    if (!selectFolderUris) {
      return;
    }
    for (const { path } of selectFolderUris) {
      await addUserGitDir(path, selected.id);
    }
    vscode.window.showInformationMessage(`Add 'gitdir' config to use '${selected.id}' user config successfully!`);
  });
}
