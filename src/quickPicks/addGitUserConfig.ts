import { window } from 'vscode';
import MultiStepInput from './MultiStepInput';
import type { GitUserConfig } from '../types';
import { inputGitUserConfigId } from './inputs';
import { updateGitUserConfig } from '../utils/gitUserConfigs';

export default async function showAddGitUserConfigMultiInput() {
  const state = {} as GitUserConfig;
  await MultiStepInput.run(input => inputGitUserConfigId(input, state));

  await updateGitUserConfig(state);

  window.showInformationMessage(`Create Git User Config '${state.id}' successfully.`);
}
