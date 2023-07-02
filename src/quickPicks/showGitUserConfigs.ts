import * as vscode from 'vscode';
import type { BaseGitUserConfig } from '../types';

export default function showGitUserConfigsQuickPick(
  gitUserConfigs: BaseGitUserConfig[],
  callback: (selected: vscode.QuickPickItem) => Promise<void>,
) {
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = gitUserConfigs.map(({ id, userEmail, username }) => ({
    label: id,
    detail: `$(account) ${username}
$(mail) ${userEmail}`,
  }));
  quickPick.onDidChangeSelection(async selection => {
    if (selection[0]) {
      try {
        await callback(selection[0]);
      } catch (error: any) {
        vscode.window.showErrorMessage(error.message);
      } finally {
        quickPick.dispose();
      }
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
