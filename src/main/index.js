const { app, BrowserWindow, ipcMain, session } = require('electron')
const path = require('path')
const { showInRender } = require('./contextmenu')

const isProd = process.argv.includes('--dev') ? false : true
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
  // session.defaultSession.webRequest.onBeforeRequest(function(details, callback) {
  //   console.log(details.url)
  //   callback({
  //     requestHeaders: details.requestHeaders
  //   })
  // })
  session.defaultSession.on('will-download', (event, item, webContents) => {
    // event.preventDefault()
    // require('request')(item.getURL(), (data) => {
    //   require('fs').writeFileSync('/somewhere', data)
    // })
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })
  // 并且为你的应用加载index.html
  if (isProd) {
    win.loadFile(path.resolve(__dirname, '../render/dist/index.html'))
  } else {
    win.loadURL('http://localhost:2000')
    // 打开开发者工具
    win.webContents.openDevTools()
  }
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
  // if (isProd) {
  // } else {
  //   event.returnValue = `file://${path.resolve(__dirname, 'js/contextmenu.js')}`
  // }
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