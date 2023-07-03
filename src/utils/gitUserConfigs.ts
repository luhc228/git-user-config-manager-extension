import * as vscode from 'vscode';
import { VSCConfigurationKey } from '../constants';
import type { GitUserConfig } from '../types';
import { removeGitConfigFile, writeGitConfigFile } from './git';

/**
 * Get git user configs from vscode extension configuration.
 */
export function getGitUserConfigs() {
  return vscode.workspace
    .getConfiguration()
    .get(VSCConfigurationKey.GIT_USER_CONFIG) as GitUserConfig[];
}

/**
 * Set git user configs to vscode extension configuration and local git config file.
 */
export async function updateGitUserConfig(gitUserConfig: GitUserConfig) {
  const configs = getGitUserConfigs();
  const configIndex = configs.findIndex(config => config.id === gitUserConfig.id);
  if (configIndex > -1) {
    configs.splice(configIndex, 1, gitUserConfig);
  } else {
    configs.push(gitUserConfig);
  }

  // Update to vscode configuration
  await vscode.workspace.getConfiguration().update(
    VSCConfigurationKey.GIT_USER_CONFIG,
    configs,
    vscode.ConfigurationTarget.Global,
  );

  await writeGitConfigFile(gitUserConfig);
}

/**
 * Remove git user configs from vscode extension configuration and local git config file.
 */
export async function removeGitUserConfig(useConfigId: GitUserConfig['id']) {
  const configs = getGitUserConfigs();
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
