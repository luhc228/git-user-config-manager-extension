import * as path from 'node:path';
import * as os from 'node:os';
export const storageKeys = {
  CHECKED_GIT_REPOSITORIES: 'git-user-config-manager-checked-git-repositories',
  CURRENT_OPENED_GIT_REPOSITORY: 'git-user-config-manager-current-opened-git-repository',
};

export const VSCConfigurationKey = {
  GIT_USER_CONFIG: 'git-user-config-manager.gitUserConfig',
};

export const HOME_DIR = os.homedir();

export const globalExtensionConfigDir = path.join(HOME_DIR, 'git-user-config-manager-vsc-ext');
