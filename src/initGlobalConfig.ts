import fse from 'fs-extra';
import { globalConfigPath } from './constants';
import type { GitUserConfig } from './types';
import { getBaseGitUserConfigs } from './utils/baseGitUserConfigs';

/**
 * Init global config.
 * This is useful when the configuration is synchronized to another computer
 */
export default async function initGlobalConfig() {
  if (!await fse.pathExists(globalConfigPath)) {
    const baseGitUserConfigs = getBaseGitUserConfigs();

    const gitUserConfigs: GitUserConfig[] = baseGitUserConfigs.map((baseGitUserConfig) => {
      return {
        ...baseGitUserConfig,
        gitdir: [],
      };
    });

    await fse.writeJSON(globalConfigPath, gitUserConfigs);
  }
}
