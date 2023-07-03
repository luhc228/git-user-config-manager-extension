export interface BaseGitUserConfig {
  id: string;
  username: string;
  userEmail: string;
}

export interface GitUserConfig extends BaseGitUserConfig {
  gitdirs: string[];
}
