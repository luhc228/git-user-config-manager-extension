import * as vscode from 'vscode';
import { VSCConfigurationKey } from '../constants';
import type { BaseGitUserConfig } from '../types';
import { removeGitConfigFile, writeGitConfigFile } from './git';

/**
 * Get git user configs from vscode extension configuration.
 */
export function getBaseGitUserConfigs() {
  return vscode.workspace
    .getConfiguration()
    .get(VSCConfigurationKey.GIT_USER_CONFIG) as BaseGitUserConfig[];
}

/**
 * Set git user configs to vscode extension configuration and local git config file.
 */
export async function setBaseGitConfig(baseGitUserConfig: BaseGitUserConfig) {
  const configs = getBaseGitUserConfigs();
  const configIndex = configs.findIndex(config => config.id === baseGitUserConfig.id);
  if (configIndex > -1) {
    configs.splice(configIndex, 1, baseGitUserConfig);
  } else {
    configs.push(baseGitUserConfig);
  }

  // Update to vscode configuration
  await vscode.workspace.getConfiguration().update(
    VSCConfigurationKey.GIT_USER_CONFIG,
    configs,
    vscode.ConfigurationTarget.Global,
  );

  await writeGitConfigFile(baseGitUserConfig);
}

/**
 * Remove git user configs from vscode extension configuration and local git config file.
 */
export async function removeBaseGitUserConfig(useConfigId: BaseGitUserConfig['id']) {
  const configs = getBaseGitUserConfigs();
  const configIndex = configs.findIndex(config => config.id === useConfigId);
  if (configIndex > -1) {
    const [{ id: removedId }] = configs.splice(configIndex, 1);

    // Remove it from vscode configuration
    await vscode.workspace.getConfiguration().update(
      VSCConfigurationKey.GIT_USER_CONFIG,
      configs,
      vscode.ConfigurationTarget.Global,
    );

    await removeGitConfigFile(removedId);
  }
}
