import * as path from 'node:path';
import * as vscode from 'vscode';
import { HOME_DIR } from '../constants';

export default async function editGitDirs() {
  const globalGitConfigPath = path.join(HOME_DIR, '.gitconfig');
  const document = await vscode.workspace.openTextDocument(globalGitConfigPath);
  await vscode.window.showTextDocument(document);
}
