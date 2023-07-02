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
    const state = gitUserConfigs.find(gitUserConfig => gitUserConfig.id === selection.label) as BaseGitUserConfig;
    await MultiStepInput.run(input => inputGitUserConfigId(input, state, false));
    await setBaseGitConfig(state);

    vscode.window.showInformationMessage(`Edit Git User Config '${state.id}' successfully.`);
  });
}
