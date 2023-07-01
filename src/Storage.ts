import * as vscode from 'vscode';

export default class Storage {
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
