import { validateEmail, validateUsername, validateConfigId } from '../utils/validation';
import type { BaseGitUserConfig } from '../types';
import type MultiStepInput from './MultiStepInput';

function getInputBoxTitle(create: boolean) {
  return create ? 'Add Git User Config' : 'Edit Git User Config';
}

export async function inputGitUserConfigId(
  input: MultiStepInput,
  state: Partial<BaseGitUserConfig>,
  create: boolean = true,
) {
  const tip = 'Enter id for current git user config. For Example: GitHub, GitLab';
  state.id = await input.showInputBox({
    title: getInputBoxTitle(create),
    value: state.id ?? '',
    step: 1,
    totalSteps: 3,
    placeholder: tip,
    shouldResume: shouldResume,
    prompt: tip,
    validate: async (input) => validateConfigId(input, create),
  });
  return (input: MultiStepInput) => inputGitUsername(input, state, create);
}

export async function inputGitUsername(
  input: MultiStepInput,
  state: Partial<BaseGitUserConfig>,
  create: boolean = true,
) {
  const tip = 'Enter your git user name.';
  state.username = await input.showInputBox({
    title: getInputBoxTitle(create),
    value: state.username ?? '',
    step: 2,
    totalSteps: 3,
    placeholder: tip,
    prompt: tip,
    shouldResume: shouldResume,
    validate: async (input) => validateUsername(input),
  });
  return (input: MultiStepInput) => inputGitUserEmail(input, state, create);
}

async function inputGitUserEmail(
  input: MultiStepInput,
  state: Partial<BaseGitUserConfig>,
  create: boolean = true,
) {
  const tip = 'Enter your git user email.';
  state.userEmail = await input.showInputBox({
    title: getInputBoxTitle(create),
    value: state.userEmail ?? '',
    step: 3,
    totalSteps: 3,
    placeholder: tip,
    shouldResume: shouldResume,
    prompt: tip,
    validate: async (input) => validateEmail(input),
  });
}

function shouldResume() {
  // Could show a notification with the option to resume.
  return new Promise<boolean>((resolve, reject) => {
    // noop
  });
}
