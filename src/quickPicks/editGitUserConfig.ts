import * as vscode from 'vscode';
import MultiStepInput from './MultiStepInput';
import type { BaseGitUserConfig } from 'src/types';
import { inputGitUserConfigId } from './inputs';
import { getBaseGitUserConfigs, setBaseGitConfig } from '../utils/baseGitUserConfigs';
import { SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND } from '../commands/showNoGitUserConfigsFoundMessage';
import showGitUserConfigsQuickPick from './showGitUserConfigs';

export default async function showEditGitUserConfigMultiInput() {
  const gitUserConfigs = getBaseGitUserConfigs();

  if (gitUserConfigs.length === 0) {
    vscode.commands.executeCommand(SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND);
    return;
  }

  showGitUserConfigsQuickPick(gitUserConfigs, async (selection) => {
    const selected = gitUserConfigs.find(gitUserConfig => gitUserConfig.id === selection.label) as BaseGitUserConfig;
    if (!selected) {
      throw new Error(`There is no existing git user config of ${selection.label}.`);
    }
    await MultiStepInput.run(input => inputGitUserConfigId(input, selected, false));
    await setBaseGitConfig(selected);

    vscode.window.showInformationMessage(`Edit Git User Config '${selected.id}' successfully.`);
  });
}
