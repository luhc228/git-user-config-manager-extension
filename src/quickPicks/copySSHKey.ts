import * as vscode from 'vscode';
import { getGitUserConfigs } from '../utils/gitUserConfigs';
import { SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND } from '../commands/showNoGitUserConfigsFoundMessage';
import showGitUserConfigsQuickPick from './showGitUserConfigs';
import { getSSHPublicKey } from '../utils/ssh';

export default async function showShowSSHKeyQuickPick() {
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

    const SSHPublicKey = await getSSHPublicKey(selected.id);
    await vscode.env.clipboard.writeText(SSHPublicKey);
    await vscode.window.showInformationMessage(
      `Copy SSH Key of '${selected.id}' successfully!`,
    );
  });
}
