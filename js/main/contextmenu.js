const {
  Menu,
  MenuItem,
  dialog
} = require('electron')

let createRenderWindow
function init(options) {
  createRenderWindow = options.addRenderWindow
}

let contextmenuPositionOptions

const containerMenu = new Menu()
containerMenu.append(new MenuItem({ label: 'MenuItem1', click() { console.log('item 1 clicked') } }))
containerMenu.append(new MenuItem({ type: 'separator' }))
containerMenu.append(new MenuItem({ role: 'toggleDevTools' }))

const renderMenu = new Menu()
renderMenu.append(new MenuItem({ id: 1, visible: true, label: '在新标签页中打开图片', click() { console.log('item 1 clicked') } }))
renderMenu.append(new MenuItem({ id: 2, visible: true, label: '图片另存为', click() { console.log('item 1 clicked') } }))
renderMenu.append(new MenuItem({ id: 3, visible: true, label: '复制图片', click() { console.log('item 1 clicked') } }))
renderMenu.append(new MenuItem({ id: 4, visible: true, label: '复制图片地址', click() { console.log('item 1 clicked') } }))
renderMenu.append(new MenuItem({ id: 10, visible: true, type: 'separator' }))

renderMenu.append(new MenuItem({ id: 11, visible: true, label: '在新标签页中打开链接', click() { console.log('item 1 clicked') } }))
renderMenu.append(new MenuItem({ id: 12, visible: true, label: '复制链接地址', click() { console.log('item 1 clicked') } }))
renderMenu.append(new MenuItem({ id: 20, visible: true, type: 'separator' }))

renderMenu.append(new MenuItem({ visible: true, label: '返回', click(menuItem, browserWindow, event) {
  browserWindow.webContents.goBack()
} }))
renderMenu.append(new MenuItem({ visible: true, label: '前进', click(menuItem, browserWindow, event) {
  browserWindow.webContents.goForward()
} }))
renderMenu.append(new MenuItem({ visible: true, role: 'reload', label: '重新加载' }))

renderMenu.append(new MenuItem({ visible: true, type: 'separator' }))
renderMenu.append(new MenuItem({ visible: true, label: '另存为', click(menuItem, browserWindow, event) {
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
} }))
renderMenu.append(new MenuItem({ visible: true, label: '打印', click(menuItem, browserWindow, event) {
  browserWindow.webContents.print()
} }))

renderMenu.append(new MenuItem({ visible: true, type: 'separator' }))
renderMenu.append(new MenuItem({ visible: true, label: '查看网页源代码', click(menuItem, browserWindow, event) {
  if (browserWindow) {
    const url = `view-source:${browserWindow.webContents.getURL()}`
    createRenderWindow(url)
  }
} }))
renderMenu.append(new MenuItem({ visible: true, role: 'toggleDevTools', label: '检查' }))

function show(menuInstance, options) {
  // console.log(options.linkURL)
  // console.log(renderMenu)
  contextmenuPositionOptions = options
  menuInstance.popup({
    x: options.x,
    y: options.y,
  })
}
function showInRender(options) {
  show(renderMenu, options)
}
function showInContainer(options) {
  // show(containerMenu, options)
}

module.exports = {
  showInRender,
  showInContainer,
  init
}