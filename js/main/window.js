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

const contextmenu = require('./contextmenu')
contextmenu.init({
  addRenderWindow
})

function createContainerWindow () {   
  // 创建浏览器窗口
  const win = new BrowserWindow({
    title: 'Electron-Browser',
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

  containerWindows.push(win)
  currentContainerWindow = win
  
  win.webContents.on('did-finish-load', () => {
    renderWindows.push(createRenderWindow(win))
    currentRenderWindow = renderWindows[renderWindows.length - 1]
  })
  win.webContents.on('context-menu', (event, params) => {
    // console.log(event, params)
    contextmenu.showInContainer(params)
  })
  // 打开开发者工具
  win.webContents.openDevTools()
  
  return win
}

function createRenderWindow(parentWindow = currentContainerWindow, url) {
  const subwin = new BrowserWindow({
    title: 'Electron-Browser',
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
  currentContainerWindow.send('tab-new', {
    id: subwin.id
  })
  
  subwin.webContents.on('context-menu', (event, params) => {
    // console.log(event, params)
    contextmenu.showInRender(params)
  })
  subwin.webContents.on('will-navigate', (event, url) => {
  })
  subwin.webContents.on('did-navigate', (event, url, httpResponseCode, httpStatusText) => {
  })
  subwin.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) => {
    event.preventDefault()
    renderWindows.push(createRenderWindow(currentContainerWindow, url))
    currentRenderWindow = renderWindows[renderWindows.length - 1]
  })
  subwin.webContents.on('page-favicon-updated', (event, favicons) => {
    // console.log(favicons)
    currentContainerWindow.send('favicon-list', { favicons, tabId: subwin.id })
  })

  subwin.on('page-title-updated', () => {
    // console.log(currentRenderWindow.webContents.getURL(), currentRenderWindow.webContents.getTitle())
    currentContainerWindow.send('goto-website-done', {
      id: currentRenderWindow.id,
      url: currentRenderWindow.webContents.getURL() || url,
      title: currentRenderWindow.webContents.getTitle() || url,
      history: currentRenderWindow.webContents.history,
    })
  })
  // console.log(url)
  if (url) {
    subwin.webContents.loadURL(url)
    if (url.startsWith('view-source:')) {
      currentContainerWindow.send('goto-website-done', {
        id: subwin.id,
        url: url,
        title: url,
        history: null,
      })
    }
  } else {
    subwin.loadFile('index.html')
  }
  // subwin.webContents.openDevTools()
  return subwin
}
function addRenderWindow(url) {
  const subwin = createRenderWindow(currentContainerWindow, url)
  renderWindows.push(subwin)
  currentRenderWindow = subwin
  return subwin
}
function removeRenderWindow() {
  for (let i = renderWindows.length - 1; i > -1 ; i--) {
    const win = renderWindows[i]
    if (win.isDestroyed()) {
      renderWindows.splice(i, 1)
    }
  }
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
    set (val) {
      currentContainerWindow = val
    }
  },
  currentRenderWindow: {
    get () {
      return currentRenderWindow
    },
    set (val) {
      currentRenderWindow = val
    }
  }
})
module.exports = Object.assign(exportProps, {
  createContainerWindow,
  createRenderWindow,
  addRenderWindow,
  removeRenderWindow,
})