import * as vscode from 'vscode';
import { getBaseGitUserConfigs } from '../utils/baseGitUserConfigs';
import { SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND } from '../commands/showNoGitUserConfigsFoundMessage';
import showGitUserConfigsQuickPick from './showGitUserConfigs';
import { generateSSHKey, isSSHKeyExisted, updateSSHConfig } from '../utils/ssh';

export default async function showGenerateSSHKeyQuickPick() {
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

    const SSHKeyExisted = await isSSHKeyExisted(selected!.id);
    if (SSHKeyExisted) {
      const items = ['Yes', 'No'];
      const value = await vscode.window.showQuickPick(
        items,
        {
          title: `A SSH key has already generated for '${selected.id}'. Do you want to continue to generate?`,
        },
      );
      if (value === items[1]) {
        return;
      }
    }

    const hostName = await vscode.window.showInputBox({
      prompt: 'Enter the host name of code platform.',
      placeHolder: 'For example: github.com, gitlab.com',
    });
    if (!hostName) {
      throw new Error('Host name is invalid.');
    }
    const { pubKey } = await generateSSHKey(selected.id, selected.userEmail);
    await updateSSHConfig(selected.id, hostName, selected.username);

    const actions: string[] = [
      'Copy SSH Public Key',
    ];
    const actionSelection = await vscode.window.showInformationMessage(
      `Generate SSH Key for ${selected?.id} successfully!`,
      ...actions,
    );
    if (actionSelection === actions[0]) {
      await vscode.env.clipboard.writeText(pubKey);
    }
  });
}
