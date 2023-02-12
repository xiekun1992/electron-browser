const { app, BrowserView, BrowserWindow, ipcMain } = require('electron')

let x = 0, y = 80, width = 1280, height = 720;
let views = [], win, activeView, viewId = 0;
const defaultURL = 'https://www.baidu.com';

app.whenReady().then(() => {
  win = new BrowserWindow({ 
    width, height, frame: false, 
    minWidth: 375,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
  } })
  win.webContents.loadFile('index.html')
  win.setBackgroundColor('#fff')

  win.webContents.on('did-finish-load', () => {
    createNewView(defaultURL)
  })

  win.on('resize', () => {
    resizeView()
  })
  win.webContents.openDevTools({mode: 'detach'})
})

ipcMain.on('app.minimize', () => {
  win.minimize()
})
ipcMain.on('app.maximize', () => {
  if (win.isMaximized()) {
    win.restore()
  } else {
    win.maximize()
  }
})
ipcMain.on('app.close', () => {
  win.close()
})

ipcMain.on('view.create', (event, { url }) => {
  createNewView(url ?? defaultURL)
})
ipcMain.on('view.backward', () => {
  activeView.webContents.canGoBack() && activeView.webContents.goBack()
})
ipcMain.on('view.forward', () => {
  activeView.webContents.canGoForward() && activeView.webContents.goForward()
})
ipcMain.on('view.refresh', () => {
  activeView.webContents.reload()
})
ipcMain.on('view.home', () => {
  activeView.webContents.loadURL(defaultURL)
})
ipcMain.on('view.navigate', (event, { url }) => {
  activeView.webContents.loadURL(url)
})
ipcMain.on('view.setActiveById', (event, { id }) => {
  const view = views.find(v => v.id === id)
  if (view) {
    setActiveView(view)
    updateTabs()
  }
})
ipcMain.on('view.deleteById', (event, { id }) => {
  let nextActiveView
  if (views.length === 1) {
    // 关闭最后一个
    win.close()
    return
  }
  for (let i = views.length - 1; i > -1; i--) {
    if (views[i].id === id) {
      if (views[i].active) {
        nextActiveView = views[i + 1] || views[i - 1] // 默认选中当前的后一个，否则删除的是最后一个，选中更新后的最后一个
      }
      views.splice(i, 1)
      break
    }
  }
  if (nextActiveView) {
    setActiveView(nextActiveView)
  }
  updateTabs()
})

function createNewView(url) {
  const view = new BrowserView()
  view.id = viewId++
  view.webContents.loadURL(url)
  
  // console.log(view)
  views.push(view)
  setActiveView(view)
  view.webContents.on('page-title-updated', () => {
    updateTabs()
  })

  view.webContents.on('will-navigate', (event, url) => {
    console.log(url)
    updateTabs()
  })

  view.webContents.setWindowOpenHandler((detail) => {
    // console.log(detail)
    createNewView(detail.url)
    return {
      action: 'deny'
    }
  })
}

function updateTabs() {
  win.webContents.send('tabs.update', {
    tabs: views.map(v => {
      return {
        id: v.id,
        active: v.active,
        title: v.webContents.getTitle(),
        url: v.webContents.getURL()
      }
    })
  })
}

function setActiveView(view) {
  activeView = view
  views.forEach(v => {
    v.active = activeView === v
  })
  resizeView()
  win.setBrowserView(activeView)
}

function resizeView() {
  setTimeout(() => {
    const rect = win.getBounds()
    activeView.setBounds({
      x: x, 
      y: y, 
      width: rect.x < 0? rect.width + rect.x * 2 : rect.width, 
      height: (rect.y < 0? rect.height + rect.y * 2 : rect.height) - y
    })
  }, 0);
}