import * as vscode from 'vscode';
import showApplyGitUserConfigQuickPick from './ApplyGitUserConfig';
import showAddGitUserConfigMultiInput from './addGitUserConfig';
import showEditGitUserConfigMultiInput from './editGitUserConfig';
import showRemoveGitUserConfigQuickPick from './removeGitUserConfig';
import showGenerateSSHKeyQuickPick from './generateSSHKey';
import showCopySSHKeyQuickPick from './copySSHKey';
import editGitDirs from './editGitDirs';
import addGitDirs from './addGitDirs';
import type { WorkspaceStorage } from '../Storage';
import type StatusBarItem from 'src/StatusBarItem';

type Option = {
  executor: (
    context: vscode.ExtensionContext,
    workspaceStorage: WorkspaceStorage,
    statusBarItem: StatusBarItem,
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
  {
    label: 'Remove Git User Config',
    detail: 'Remove one of your git user configs.',
    executor: showRemoveGitUserConfigQuickPick,
  },
  {
    label: 'Generate SSH Key',
    detail: 'Generate SSH Key by your git user configs.',
    executor: showGenerateSSHKeyQuickPick,
  },
  {
    label: 'Copy SSH Key',
    detail: 'Generate SSH Key by your git user configs.',
    executor: showCopySSHKeyQuickPick,
  },
  {
    label: 'Add Git Dirs',
    detail: 'Select one or more directories to use one of your git user configs.',
    executor: addGitDirs,
  },
  {
    label: 'Edit Git Dirs',
    detail: 'Edit or delete your `gitdir` config.',
    executor: editGitDirs,
  },
];

export function showEntryOptionsQuickPick(
  context: vscode.ExtensionContext,
  workspaceStorage: WorkspaceStorage,
  statusBarItem: StatusBarItem,
) {
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
      if (!selected) {
        vscode.window.showErrorMessage(`'${selection[0].label}' config is not found.`);
        return;
      }

      selected.executor(context, workspaceStorage, statusBarItem)
        .catch((err) => {
          vscode.window.showErrorMessage(err.message);
        }).finally(() => {
          quickPick.dispose();
        });
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}

export {
  showAddGitUserConfigMultiInput,
  showApplyGitUserConfigQuickPick,
  showEditGitUserConfigMultiInput,
};
