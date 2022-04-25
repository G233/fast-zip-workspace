import * as vscode from 'vscode'
import * as util from 'util'
import { exec } from 'child_process'
const promiseExec = util.promisify(exec)

const getRename = async () => {
  const options = {
    prompt: 'Please enter name of ZIP file what you want: ',
    placeHolder: 'Default is the selected name',
  }
  const rename = await vscode.window.showInputBox(options)
  return rename
}

// 添加密码功能

const zipWorkSpace = async (rename: string | undefined) => {
  const folderList = vscode.workspace.workspaceFolders

  if (!folderList) {
    vscode.window.showErrorMessage('Project directory not detected, please open the project folder and try again')
    return
  }
  // 获取 rootPath
  const folder = folderList[0]

  try {
    vscode.window.showInformationMessage('Starting compressions...')
    await promiseExec(`git archive -o ${rename || folder.name}.zip  HEAD`, {
      cwd: folder.uri.fsPath,
    })
  } catch (err) {
    vscode.window.showErrorMessage('Compression error, please check if it is in the project root')
  }
  vscode.window.showInformationMessage('Compressed')
}

const activate = (context: vscode.ExtensionContext) => {
  const disposable = vscode.commands.registerCommand(
    'zip-work-space.zipWorkSpace',
    async () => {
      console.log('Plug-in launch！')
      const rename = await getRename()
      zipWorkSpace(rename)
    }
  )
  context.subscriptions.push(disposable)
}

const deactivate = () => {}

export { activate, deactivate }
