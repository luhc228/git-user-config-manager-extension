import * as vscode from 'vscode';

export class GlobalStorage {
  private context: vscode.ExtensionContext;
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  get<T>(key: string) {
    return this.context.globalState.get(key) as T;
  }

  set(key: string, value: any) {
    return this.context.globalState.update(key, value);
  }
}

export class WorkspaceStorage {
  private context: vscode.ExtensionContext;
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  get<T>(key: string) {
    return this.context.workspaceState.get(key) as T;
  }

  set(key: string, value: any) {
    return this.context.workspaceState.update(key, value);
  }
}