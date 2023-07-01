import simpleGit from 'simple-git';

export async function isGitRepo(repoPath: string) {
  try {
    return simpleGit(repoPath).checkIsRepo();
  } catch (error) {
    return false;
  }
}

export async function getUserConfig(repoPath: string, scope: 'global' | 'local') {
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
}
