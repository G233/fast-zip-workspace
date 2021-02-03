import * as vscode from 'vscode'
import * as util from 'util'
import { exec } from 'child_process'
const promiseExec = util.promisify(exec)

const getRename = async () => {
  const options = {
    prompt: '请输入压缩后的文件名: ',
    placeHolder: '默认为选中文件名',
  }
  const rename = await vscode.window.showInputBox(options)
  return rename
}

// 添加密码功能

const zipWorkSpace = async (rename: string | undefined) => {
  vscode.workspace.workspaceFolders?.forEach(async (folder) => {
    vscode.window.showInformationMessage('开始压缩')
    await promiseExec(
      `zip -q -r ${
        rename || folder.name
      }.zip .  --exclude "*node_modules*" "**/node_modules"`,
      { cwd: folder.uri.fsPath }
    ).catch((err) => {
      vscode.window.showErrorMessage(err)
    })
  })
}

const activate = (context: vscode.ExtensionContext) => {
  const disposable = vscode.commands.registerCommand(
    'zip-work-space.deleteNodeModulesCommand',
    async () => {
      const rename = await getRename()
      zipWorkSpace(rename)
    }
  )
  context.subscriptions.push(disposable)
}

const deactivate = () => {}

export { activate, deactivate }
