const {
    Menu,
    MenuItem,
    dialog,
    clipboard,
    nativeImage
} = require('electron')

let contextmenuPositionOptions

const linkMenuItems = [
  new MenuItem({ id: 11, visible: true, label: '在新标签页中打开链接', click(menuItem, browserWindow, event) {
    browserWindow.webContents.send('new-window', {
      url: contextmenuPositionOptions.contents.link
    })
  } }),
  new MenuItem({ id: 12, visible: true, label: '复制链接地址', click() { 
    clipboard.writeText(contextmenuPositionOptions.contents.link)
   } }),
  new MenuItem({ id: 20, visible: true, type: 'separator' }),
]
const imageMenuItems = [
  new MenuItem({ id: 1, visible: true, label: '在新标签页中打开图片', click() { 
    browserWindow.webContents.send('new-window', {
      url: contextmenuPositionOptions.contents.image
    })
   } }),
  new MenuItem({ id: 2, visible: true, label: '图片另存为', click() { console.log('item 1 clicked') } }),
  new MenuItem({ id: 3, visible: true, label: '复制图片', click() { 
    // clipboard.writeImage(nativeImage.createFromPath(contextmenuPositionOptions.contents.image))
   } }),
  new MenuItem({ id: 4, visible: true, label: '复制图片地址', click() { 
    clipboard.writeText(contextmenuPositionOptions.contents.image)
   } }),
  new MenuItem({ id: 10, visible: false, enabled: false, type: 'separator' }),
]
const pageMenuItems = [
  new MenuItem({ id: 21, visible: true, label: '返回', click(menuItem, browserWindow, event) {
    browserWindow.webContents.goBack()
  } }),
  new MenuItem({ id: 22, visible: true, label: '前进', click(menuItem, browserWindow, event) {
    browserWindow.webContents.goForward()
  } }),
  new MenuItem({ id: 23, visible: true, role: 'reload', label: '重新加载' }),
  new MenuItem({ id: 30, visible: true, type: 'separator' }),
  
  new MenuItem({ id: 41, visible: true, label: '另存为', click(menuItem, browserWindow, event) {
  dialog.showSaveDialog({
    title: '另存为',
    filters: [
      {
        name: '网页, 仅HTML (*.html;*.htm)',
        extensions: [
          'html','htm'
        ]
      },
      {
        name: '网页 (单个文件) (*.mhtml)',
        extensions: ['mhtml']
      },
      {
        name: '网页, 全部 (*.htm;*.html)',
        extensions: ['htm', 'html']
      }
    ]
  }).then(function(result) {
    if (!result.canceled) {
      let saveType = ''
      switch (result.filePath.split('.').pop()) {
        case 'html': saveType = 'HTMLOnly'; break
        case 'mhtml': saveType = 'MHTML'; break
        case 'htm': saveType = 'HTMLComplete'; break
      }
      browserWindow.webContents.savePage(result.filePath, saveType)
    }
  })
  } }),
  new MenuItem({ id: 42, visible: true, label: '打印', click(menuItem, browserWindow, event) {
  browserWindow.webContents.print()
  } }),
  new MenuItem({ id: 50, visible: true, type: 'separator' }),
  new MenuItem({ id: 51, visible: true, label: '查看网页源代码', click(menuItem, browserWindow, event) {
    if (browserWindow) {
      const url = `view-source:${browserWindow.webContents.getURL()}`
      createRenderWindow(url)
    }
  } }),
]
const devMenuItems = [
  new MenuItem({ id: 52, visible: true, role: 'toggleDevTools', label: '检查' }),
]
function showInRender(options) {
  contextmenuPositionOptions = options
  console.log(options)
  const renderMenu = new Menu()
  if (options.contents.link) {
    linkMenuItems.forEach(item => renderMenu.append(item))
  }
  if (options.contents.image) {
    imageMenuItems.forEach(item => renderMenu.append(item))
  }
  if (renderMenu.items.length === 0) {
    pageMenuItems.forEach(item => renderMenu.append(item))
  }
  devMenuItems.forEach(item => renderMenu.append(item))

  renderMenu.popup({
    x: options.x,
    y: options.y,
  })
}

module.exports = {
  showInRender,
}