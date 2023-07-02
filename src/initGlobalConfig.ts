import * as vscode from 'vscode';
import fse from 'fs-extra';
import { VSCConfigurationKey, globalConfigPath } from './constants';
import type { BaseGitUserConfig, GitUserConfig } from './types';

/**
 * Init global config.
 * This is useful when the configuration is synchronized to another computer
 */
export default async function initGlobalConfig() {
  if (!await fse.pathExists(globalConfigPath)) {
    const baseGitUserConfigs = vscode.workspace
      .getConfiguration()
      .get(VSCConfigurationKey.GIT_USER_CONFIG) as BaseGitUserConfig[];

    const gitUserConfigs: GitUserConfig[] = baseGitUserConfigs.map((baseGitUserConfig) => {
      return {
        ...baseGitUserConfig,
        gitdir: [],
      };
    });

    await fse.writeJSON(globalConfigPath, gitUserConfigs);
  }
}
