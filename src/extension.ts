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
  const folderList = vscode.workspace.workspaceFolders

  if (!folderList) {
    vscode.window.showErrorMessage('未检测到项目目录，请打开项目文件夹后重试')
    return
  }
  // 获取 rootPath
  const folder = folderList[0]

  try {
    vscode.window.showInformationMessage('开始压缩...')
    await promiseExec(`git archive -o ${rename || folder.name}.zip  HEAD`, {
      cwd: folder.uri.fsPath,
    })
  } catch (err) {
    vscode.window.showErrorMessage('压缩出错，请检查是否在项目根目录')
  }
  vscode.window.showInformationMessage('压缩好了')
}

const activate = (context: vscode.ExtensionContext) => {
  const disposable = vscode.commands.registerCommand(
    'zip-work-space.zipWorkSpace',
    async () => {
      console.log('插件启动！')
      const rename = await getRename()
      zipWorkSpace(rename)
    }
  )
  context.subscriptions.push(disposable)
}

const deactivate = () => {}

export { activate, deactivate }
