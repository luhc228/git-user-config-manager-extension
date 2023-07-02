export interface BaseGitUserConfig {
  id: string;
  username: string;
  userEmail: string;
  hostName?: string;
}

export interface GitUserConfig extends BaseGitUserConfig {
  gitdir: string[];
}
