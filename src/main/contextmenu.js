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
  
  const menuItems = [
    new MenuItem({ id: 11, visible: true, label: '在新标签页中打开链接', click(menuItem, browserWindow, event) {
      createRenderWindow(contextmenuPositionOptions.linkURL)
    } }),
    new MenuItem({ id: 12, visible: true, label: '复制链接地址', click() { console.log('item 1 clicked') } }),
    new MenuItem({ id: 20, visible: true, type: 'separator' }),
    
    new MenuItem({ id: 1, visible: true, label: '在新标签页中打开图片', click() { console.log('item 1 clicked') } }),
    new MenuItem({ id: 2, visible: true, label: '图片另存为', click() { console.log('item 1 clicked') } }),
    new MenuItem({ id: 3, visible: true, label: '复制图片', click() { console.log('item 1 clicked') } }),
    new MenuItem({ id: 4, visible: true, label: '复制图片地址', click() { console.log('item 1 clicked') } }),
    new MenuItem({ id: 10, visible: false, enabled: false, type: 'separator' }),
  
  
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
    new MenuItem({ id: 52, visible: true, role: 'toggleDevTools', label: '检查' }),
  ]
  function showInRender(options) {
    console.log(options)
    let menuIdMap = {}
    if (options.linkURL) {
      // linkURL
      menuIdMap = Object.assign(menuIdMap, {
        11: true, 12: true, 20: true, 52: true
      })
    }
    if (options.hasImageContents) {
      // srcURL
      menuIdMap = Object.assign(menuIdMap, {
        1: true, 2: true, 3: true, 4: true, 10: true, 52: true
      })
    }
    if (!options.linkURL && !options.hasImageContents) {
      menuIdMap = Object.assign(menuIdMap, {
        21: true, 22: true, 23: true, 30: true, 41: true, 42: true, 50: true, 51: true, 52: true
      })
    }
    const renderMenu = new Menu()
    menuItems.forEach((item) => {
      console.log(item.id)
      if (menuIdMap[item.id]) {
        renderMenu.append(item)
      }
    })
    contextmenuPositionOptions = options
    renderMenu.popup({
      x: options.x,
      y: options.y,
    })
  }
  function showInContainer(options) {
    
  }
  
  module.exports = {
    showInRender,
    showInContainer,
    init
  }