const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { showInRender } = require('./contextmenu')

let win

function createWindow () {   
  // 创建浏览器窗口
  win = new BrowserWindow({
    frame: false,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    },
  })

  // 并且为你的应用加载index.html
  win.loadURL('http://localhost:2000')
  // win.loadFile('../render/dist/index.html')

  // 打开开发者工具
  win.webContents.openDevTools()
}

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 您可以把应用程序其他的流程写在在此文件中
// 代码 也可以拆分成几个文件，然后用 require 导入。
ipcMain.on('app-root-path', (event) => {
  event.returnValue = path.resolve(__dirname, 'js/contextmenu.js')
})
ipcMain.on('contextmenu-show', (event, arg) => {
  showInRender(arg)
})
ipcMain.on('app-minimize', (event, arg) => {
  win.minimize()
})
ipcMain.on('app-maximize', (event, arg) => {
  if (win.isMaximized()) {
    win.restore()
  } else {
    win.maximize()
  }
})
ipcMain.on('app-quit', () => {
  process.exit(0)
})