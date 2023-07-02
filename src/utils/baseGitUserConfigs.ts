import * as vscode from 'vscode';
import { VSCConfigurationKey } from '../constants';
import type { BaseGitUserConfig } from '../types';

export function getBaseGitUserConfigs() {
  return vscode.workspace
    .getConfiguration()
    .get(VSCConfigurationKey.GIT_USER_CONFIG) as BaseGitUserConfig[];
}

export async function setBaseGitConfig(baseGitUserConfig: BaseGitUserConfig) {
  const configs = getBaseGitUserConfigs();
  const configIndex = configs.findIndex(config => config.id === baseGitUserConfig.id);
  if (configIndex > -1) {
    configs.splice(configIndex, 1, baseGitUserConfig);
  } else {
    configs.push(baseGitUserConfig);
  }

  await vscode.workspace.getConfiguration().update(
    VSCConfigurationKey.GIT_USER_CONFIG,
    configs,
    vscode.ConfigurationTarget.Global,
  );
}

export async function removeBaseGitConfig(useConfigId: BaseGitUserConfig['id']) {
  const configs = getBaseGitUserConfigs();
  const configIndex = configs.findIndex(config => config.id === useConfigId);
  if (configIndex > -1) {
    configs.splice(configIndex, 1);

    await vscode.workspace.getConfiguration().update(
      VSCConfigurationKey.GIT_USER_CONFIG,
      configs,
      vscode.ConfigurationTarget.Global,
    );
  }
}
