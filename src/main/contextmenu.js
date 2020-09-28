const {
    Menu,
    MenuItem,
    dialog,
    clipboard,
    nativeImage
} = require('electron')

let contextmenuPositionOptions
let timer

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
  new MenuItem({ id: 1, visible: true, label: '在新标签页中打开图片', click(menuItem, browserWindow, event) { 
    browserWindow.webContents.send('new-window', {
      url: contextmenuPositionOptions.contents.image
    })
   } }),
  new MenuItem({ id: 4, visible: true, label: '复制图片地址', click() { 
    clipboard.writeText(contextmenuPositionOptions.contents.image)
   } }),
  new MenuItem({ id: 10, visible: false, enabled: false, type: 'separator' }),
]
const pageMenuItems = [
  new MenuItem({ id: 21, visible: true, label: '返回', click(menuItem, browserWindow, event) {
    browserWindow.webContents.send('history-back')
  } }),
  new MenuItem({ id: 22, visible: true, label: '前进', click(menuItem, browserWindow, event) {
    browserWindow.webContents.send('history-forward')
  } }),
  new MenuItem({ id: 23, visible: true, label: '重新加载', click(menuItem, browserWindow, event) {
    browserWindow.webContents.send('page-reload')
  } }),
  new MenuItem({ id: 50, visible: true, type: 'separator' })
]
const devMenuItems = [
  new MenuItem({ id: 52, visible: true, label: '检查', click(menuItem, browserWindow, event) {
    browserWindow.webContents.send('open-devtools')
  } }),
]
const textMenuItems = [
  new MenuItem({ id: 52, visible: true, label: '复制', click(menuItem, browserWindow, event) {
    clipboard.writeText(contextmenuPositionOptions.contents.text)
  } }),
  new MenuItem({ id: 50, visible: true, type: 'separator' })
]
function showInRender(options) {
  contextmenuPositionOptions = options
  console.log(options)
  const renderMenu = new Menu()
  renderMenu.once('menu-will-show', (event) => {
    clearTimeout(timer)
  })
  renderMenu.once('menu-will-close', (event) => {
    timer = setTimeout(() => {
      clearTimeout(timer)
      contextmenuPositionOptions = null
    }, 100)
  })
  if (options.contents.link) {
    linkMenuItems.forEach(item => renderMenu.append(item))
  }
  if (options.contents.image) {
    imageMenuItems.forEach(item => renderMenu.append(item))
  }
  if (options.contents.text) {
    textMenuItems.forEach(item => renderMenu.append(item))
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