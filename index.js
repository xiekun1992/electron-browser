const { app, BrowserWindow, ipcMain } = require('electron')

const subWindows = []
let currentWindow = null
const topbarHeight = 86
const windowBorder = 2
let parentWindow

function createWindow () {   
  // 创建浏览器窗口
  const win = new BrowserWindow({
    frame: false,
    width: 1280,
    height: 800,
    // useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.on('move', resizeWindow)
  win.on('resize', resizeWindow)
  win.on('maximize', maxWindow)
  // 并且为你的应用加载index.html
  win.loadFile('bar.html')

  subWindows.push(createSubWindow(win))
  currentWindow = subWindows[subWindows.length - 1]
  // 打开开发者工具
  win.webContents.openDevTools()
  function resizeWindow() {
    console.log(win.getSize(), win.getContentBounds())
    subWindows.forEach((subwin) => {
      subwin.setResizable(true)
      subwin.setSize(win.getSize()[0] - windowBorder * 2, win.getSize()[1] - topbarHeight)
      subwin.setResizable(false)
      subwin.setPosition(
        win.getPosition()[0] + windowBorder,
        win.getPosition()[1] + topbarHeight - windowBorder
      )
    })
  }
  function maxWindow() {
    subWindows.forEach((subwin) => {
      subwin.setResizable(true)
      subwin.setSize(win.getContentBounds().width - windowBorder * 2, win.getContentBounds().height - topbarHeight)
      subwin.setResizable(false)
      subwin.setPosition(
        win.getContentBounds().x + windowBorder,
        win.getContentBounds().y + topbarHeight - windowBorder
      )
    })
  }
  return win
}
function createSubWindow(parentWindow) {
  const subwin = new BrowserWindow({
    frame: false,
    x: parentWindow.getPosition()[0] + windowBorder,
    y: parentWindow.getPosition()[1] + topbarHeight - windowBorder,
    movable: false,
    resizable: false,
    thickFrame: false,
    maximizable: false,
    minimizable: false,
    parent: parentWindow,
    width: parentWindow.getSize()[0] - windowBorder * 2,
    height: parentWindow.getSize()[1] - topbarHeight,
    webPreferences: {
      nodeIntegration: true
    }
  })
  subwin.loadFile('index.html')
  return subwin
}
// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  parentWindow = createWindow()
})

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
    parentWindow = createWindow()
  }
})

// 您可以把应用程序其他的流程写在在此文件中
// 代码 也可以拆分成几个文件，然后用 require 导入。

ipcMain.on('goto-website', (event, arg) => {
  console.log(arg)
  currentWindow.loadURL(arg)
  currentWindow.once('page-title-updated', () => {
    event.sender.send('goto-website-done', {
      url: currentWindow.webContents.getURL(),
      title: currentWindow.webContents.getTitle(),
    })
  })
})
ipcMain.on('history-back', (event, arg) => {
  currentWindow.webContents.goBack()
})
ipcMain.on('history-forward', (event, arg) => {
  currentWindow.webContents.goForward()
})
ipcMain.on('window-reload', (event, arg) => {
  currentWindow.webContents.reload()
})
ipcMain.on('window-stop-loading', (event, arg) => {
  currentWindow.webContents.stop()
})
ipcMain.on('app-minimize', (event, arg) => {
  parentWindow.minimize()
})
ipcMain.on('app-maximize', (event, arg) => {
  if (parentWindow.isMaximized()) {
    parentWindow.unmaximize()
  } else {
    parentWindow.maximize()
  }
})
ipcMain.on('app-close', (event, arg) => {
  parentWindow.close()
})