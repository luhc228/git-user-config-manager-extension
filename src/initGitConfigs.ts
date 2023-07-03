import fse from 'fs-extra';
import { getBaseGitUserConfigs } from './utils/baseGitUserConfigs';
import { getGitConfigPath, writeGitConfigFile } from './utils/git';
import { globalExtensionConfigDir } from './constants';

/**
 * Init git configs in home dir.
 * This is useful for syncing vscode configuration in a new environment.
 */
export default async function initGitConfigs() {
  await fse.ensureDir(globalExtensionConfigDir);
  const gitUserConfigs = getBaseGitUserConfigs();
  for (const gitUserConfig of gitUserConfigs) {
    const gitConfigPath = getGitConfigPath(gitUserConfig.id);
    if (true || !await fse.pathExists(gitConfigPath)) {
      await writeGitConfigFile(gitUserConfig);
    }
  }
}
