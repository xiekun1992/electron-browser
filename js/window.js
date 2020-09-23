'use strict'

const {
  BrowserWindow
} = require('electron')

const topbarHeight = 86
const windowBorder = 2
const defaultWindowSize = {
  width: 1280,
  height: 800,
}

const renderWindows = []
const containerWindows = []
let currentRenderWindow = null
let currentContainerWindow = null

function createContainerWindow () {   
  // 创建浏览器窗口
  const win = new BrowserWindow({
    frame: false,
    width: defaultWindowSize.width,
    height: defaultWindowSize.height,
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

  renderWindows.push(createRenderWindow(win))
  currentRenderWindow = renderWindows[renderWindows.length - 1]

  containerWindows.push(win)
  currentContainerWindow = win
  // 打开开发者工具
  win.webContents.openDevTools()
  
  return win
}

function createRenderWindow(parentWindow) {
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
      nodeIntegration: false // 需要关闭，不然容易和客户端js冲突
    }
  })
  subwin.webContents.on('context-menu', (event, params) => {
    console.log(event, params)
  })
  subwin.webContents.on('will-navigate', (event, url) => {
    console.log(event, url)
  })
  subwin.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) => {
    console.log(event, url, frameName, disposition, options, additionalFeatures, referrer, postBody)
  })
  subwin.loadFile('index.html')
  subwin.webContents.openDevTools()
  return subwin
}
function resizeWindow() {
  // console.log(win.getSize(), win.getContentBounds())
  renderWindows.forEach((subwin) => {
    subwin.setResizable(true)
    subwin.setSize(
      currentContainerWindow.getSize()[0] - windowBorder * 2,
      currentContainerWindow.getSize()[1] - topbarHeight
    )
    subwin.setResizable(false)
    subwin.setPosition(
      currentContainerWindow.getPosition()[0] + windowBorder,
      currentContainerWindow.getPosition()[1] + topbarHeight - windowBorder
    )
  })
}
function maxWindow() {
  renderWindows.forEach((subwin) => {
    subwin.setResizable(true)
    subwin.setSize(
      currentContainerWindow.getContentBounds().width - windowBorder * 2,
      currentContainerWindow.getContentBounds().height - topbarHeight
    )
    subwin.setResizable(false)
    subwin.setPosition(
      currentContainerWindow.getContentBounds().x + windowBorder,
      currentContainerWindow.getContentBounds().y + topbarHeight - windowBorder
    )
  })
}
const exportProps = {}
Object.defineProperties(exportProps, {
  currentContainerWindow: {
    get () {
      return currentContainerWindow
    },
    set () {
      return false
    }
  },
  currentRenderWindow: {
    get () {
      return currentRenderWindow
    },
    set () {
      return false
    }
  }
})
module.exports = Object.assign(exportProps, {
  createContainerWindow,
  createRenderWindow,
})