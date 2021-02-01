import * as vscode from 'vscode'
import { exec } from 'child_process'

const activate = (context: vscode.ExtensionContext) => {
  console.log('开始启动插件....')

  let disposable = vscode.commands.registerCommand(
    'zip-work-space.deleteNodeModulesCommand',
    () => {
      const options = {
        prompt: '请输入压缩后的文件名: ',
        placeHolder: '默认为选中文件名',
      }
      vscode.window.showInputBox(options).then((zipName) => {
        vscode.workspace.workspaceFolders?.forEach((folder) => {
          // 与 path 的区别
          vscode.window.showInformationMessage('开始压缩')
          exec(
            // 记得使用完整路径
            `zip -q -r  ${folder.uri.fsPath}/${zipName || folder.name}.zip  ${
              folder.uri.fsPath
            }  `,
            (err: any) => {
              if (err) {
                console.error(err)
              }
            }
          )
          vscode.window.showInformationMessage('压缩成功')
        })
      })
    }
  )

  context.subscriptions.push(disposable)
}

const deactivate = () => {}

export { activate, deactivate }
