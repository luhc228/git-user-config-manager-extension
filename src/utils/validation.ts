import { getGitUserConfigs } from './gitUserConfigs';

function isEmpty(str: string) {
  return !str;
}
function isBlank(str: string) {
  return /^\s*$/.test(str);
}

export function validateConfigId(input: string, checkForDuplicates = true) {
  if (isEmpty(input) || isBlank(input)) {
    return 'Please enter a valid config id.';
  }
  if (checkForDuplicates) {
    const existingGitUserConfigs = getGitUserConfigs();
    if (existingGitUserConfigs.find((existingGitUserConfig) => existingGitUserConfig.id === input)) {
      return `Git config id with the same name '${input}' already exists!`;
    }
  }
  return undefined;
}

export function validateUsername(input: string) {
  if (isEmpty(input) || isBlank(input)) {
    return 'Please enter a valid username.';
  }
  return undefined;
}

export function validateEmail(input: string) {
  const validEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!validEmail.test(input)) {
    return 'Please enter a valid email.';
  }
  return undefined;
}

export function validateHostname(input: string) {
  const validHostname = /^[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-]+$/;
  if (!validHostname.test(input)) {
    return 'Please enter a valid host name.';
  }
  return undefined;
}
