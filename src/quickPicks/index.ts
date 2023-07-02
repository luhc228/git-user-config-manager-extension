import * as vscode from 'vscode';
import showApplyGitUserConfigQuickPick from './ApplyGitUserConfig';
import showAddGitUserConfigMultiInput from './addGitUserConfig';
import showEditGitUserConfigMultiInput from './editGitUserConfig';
import type { WorkspaceStorage } from '../Storage';

type Option = {
  executor: (
    context: vscode.ExtensionContext,
    quickPick: vscode.QuickPick<vscode.QuickPickItem>,
    workspaceStorage: WorkspaceStorage
  ) => Promise<void>;
  label: string;
  detail: string;
};
const options: Option[] = [
  {
    label: 'Apply Git User Config',
    detail: 'Select one of your git user configs and set to current workspace.',
    executor: showApplyGitUserConfigQuickPick,
  },
  {
    label: 'Add Git User Config',
    detail: 'Add a git user config.',
    executor: showAddGitUserConfigMultiInput,
  },
  {
    label: 'Edit Git User Config',
    detail: 'Edit one of your git user configs.',
    executor: showEditGitUserConfigMultiInput,
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

      selected?.executor(context, quickPick, workspaceStorage)
        .catch((err) => {
          vscode.window.showErrorMessage(err.message);
        });
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}

export {
  showAddGitUserConfigMultiInput,
  showSetGitUserConfigQuickPick,
  showEditGitUserConfigMultiInput,
};
