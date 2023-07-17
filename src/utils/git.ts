import * as path from 'node:path';
import simpleGit from 'simple-git';
import fse from 'fs-extra';
import ini from 'ini';
import { HOME_DIR, globalExtensionConfigDir } from '../constants';
import type { GitUserConfig } from '../types';

const GLOBAL_GITCONFIG_PATH = path.join(HOME_DIR, '.gitconfig');

export async function isGitRepo(repoPath: string) {
  try {
    return simpleGit(repoPath).checkIsRepo();
  } catch (error) {
    return false;
  }
}

export async function getUserConfig(repoPath: string, scope?: 'system' | 'global' | 'local' | 'worktree') {
  const git = simpleGit(repoPath);
  const username = await git.getConfig('user.name', scope);
  const userEmail = await git.getConfig('user.email', scope);

  return {
    username: username.value,
    userEmail: userEmail.value,
  };
}

export async function setUserConfig(repoPath: string, name: string, email: string) {
  const git = simpleGit(repoPath);
  await git.addConfig('user.name', name);
  await git.addConfig('user.email', email);
  console.info(`Set user config('user.name: '${name}, 'user.email: '${email}) to ${repoPath}.`);
}

export async function writeGitConfigFile(gitUserConfig: GitUserConfig) {
  const { id, ...rest } = gitUserConfig;
  const gitConfigPath = getGitConfigPath(id);

  writeGitConfig(gitConfigPath, transformGitUserConfig({ ...rest }));
  console.info('write-git-config-file: ', gitConfigPath, gitUserConfig);
}

export async function removeGitConfigFile(id: GitUserConfig['id']) {
  const gitConfigPath = getGitConfigPath(id);
  if (await fse.pathExists(gitConfigPath)) {
    await fse.remove(gitConfigPath);
    console.info('remove-git-config-file: ', gitConfigPath);
  }
}

export function getGitConfigPath(gitConfigId: string) {
  return path.join(globalExtensionConfigDir, `.gitconfig-${gitConfigId}`);
}

/**
 * Transform git user config to git standard config.
 * username -> { user: { name } }
 * userEmail -> { user: { Email } }
 */
function transformGitUserConfig({ userEmail, username }: Omit<GitUserConfig, 'id'>) {
  return {
    user: {
      name: username,
      email: userEmail,
    },
  };
}

export async function addUserGitDir(
  gitDir: string,
  configId: string,
) {
  const globalGitConfig = await parseGitConfig(GLOBAL_GITCONFIG_PATH);

  const includeIfKey = `includeIf "gitdir:${formatGitDir(gitDir)}"`;

  const gitConfigPath = getGitConfigPath(configId);
  globalGitConfig[includeIfKey] = { path: gitConfigPath };
  await writeGitConfig(GLOBAL_GITCONFIG_PATH, globalGitConfig);

  console.info('update-user-git-dir: ', includeIfKey, globalGitConfig[includeIfKey]);
}

export async function getUserGitDirs() {
  const globalGitConfig = await parseGitConfig(GLOBAL_GITCONFIG_PATH);
  const userGitDirs: Record<string, string[]> = {};

  const configKeys = Object.keys(globalGitConfig);

  for (const configKey of configKeys) {
    const { path: gitConfigPath } = globalGitConfig[configKey];
    if (!gitConfigPath) {
      continue;
    }
    if (!userGitDirs[gitConfigPath]) {
      userGitDirs[gitConfigPath] = [];
    }
    const gitDir = configKey.replace(/includeIf "gitdir:(.*)"/, (match, p1) => p1);
    userGitDirs[gitConfigPath].push(gitDir);
  }

  return userGitDirs;
}
async function parseGitConfig(gitConfigPath: string) {
  const gitConfigContent = await fse.readFile(gitConfigPath, 'utf-8');
  return ini.parse(gitConfigContent);
}

async function writeGitConfig(gitConfigPath: string, config: Record<string, any>) {
  await fse.writeFile(gitConfigPath, ini.stringify(config));
  console.info('write-git-config: ', config, gitConfigPath);
}

/**
 * Add path.sep to git dir path to make it match everything inside of the git dir recursively.
 */
function formatGitDir(originGitDir: string) {
  const { sep } = path;
  if (!originGitDir.endsWith(sep)) {
    return originGitDir + sep;
  }
  return originGitDir;
}
