import { window } from 'vscode';
import MultiStepInput from './MultiStepInput';
import { BaseGitUserConfig } from 'src/types';
import { inputGitUserConfigId } from './inputs';
import { setBaseGitConfig } from '../utils/baseGitUserConfigs';

export default async function showAddGitUserConfigMultiInput() {
  const state = {} as BaseGitUserConfig;
  await MultiStepInput.run(input => inputGitUserConfigId(input, state));

  await setBaseGitConfig(state);

  window.showInformationMessage(`Create Git User Config '${state.id}' successfully.`);
}
