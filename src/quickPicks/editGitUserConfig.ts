import * as vscode from 'vscode';
import MultiStepInput from './MultiStepInput';
import type { GitUserConfig } from '../types';
import { inputGitUserConfigId } from './inputs';
import { getGitUserConfigs, updateGitUserConfig } from '../utils/gitUserConfigs';
import { SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND } from '../commands/showNoGitUserConfigsFoundMessage';
import showGitUserConfigsQuickPick from './showGitUserConfigs';

export default async function showEditGitUserConfigMultiInput() {
  const gitUserConfigs = getGitUserConfigs();

  if (gitUserConfigs.length === 0) {
    vscode.commands.executeCommand(SHOW_NO_GIT_USER_CONFIGS_FOUND_WARNING_MESSAGE_COMMAND);
    return;
  }

  showGitUserConfigsQuickPick(gitUserConfigs, async (selection) => {
    const selected = gitUserConfigs.find(gitUserConfig => gitUserConfig.id === selection.label) as GitUserConfig;
    if (!selected) {
      throw new Error(`There is no existing git user config of ${selection.label}.`);
    }
    await MultiStepInput.run(input => inputGitUserConfigId(input, selected, false));
    await updateGitUserConfig(selected);

    vscode.window.showInformationMessage(`Edit Git User Config '${selected.id}' successfully.`);
  });
}
