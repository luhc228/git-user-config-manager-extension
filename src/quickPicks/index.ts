import * as vscode from 'vscode';
import showGitUserConfigsQuickPick from './gitUserConfigs';
import type { WorkspaceStorage } from '../Storage';

type Option = {
  executor: (context: vscode.ExtensionContext, workspaceStorage: WorkspaceStorage) => Promise<void>;
  label: string;
  detail: string;
};
const options: Option[] = [
  {
    label: 'Set Git User Config',
    detail: 'Select one of your git user configs to current workspace.',
    executor: showGitUserConfigsQuickPick,
  },
];

export function showEntryOptionsQuickPick(context: vscode.ExtensionContext, workspaceStorage: WorkspaceStorage) {
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = options.map(({ label, detail }) => {
    return {
      label,
      detail,
    };
  });
  quickPick.onDidChangeSelection(selection => {
    if (selection[0]) {
      const selected = options.find(option => option.label === selection[0].label);

      selected?.executor(context, workspaceStorage)
        .catch((err) => {
          vscode.window.showErrorMessage(err.message);
        });
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
