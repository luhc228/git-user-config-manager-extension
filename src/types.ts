export interface BaseGitUserConfig {
  id: string;
  username: string;
  userEmail: string;
}

export interface GitUserConfig extends BaseGitUserConfig {
  gitdir: string[];
  hostName?: string;
}
