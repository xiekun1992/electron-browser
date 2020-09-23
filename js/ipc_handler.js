'use strict'

const { ipcMain } = require('electron')
const {
  createContainerWindow,
  createRenderWindow,
  currentContainerWindow,
  currentRenderWindow
} = require('./window')

function init () {
  ipcMain.on('goto-website', (event, arg) => {
    console.log(arg)
    currentRenderWindow.loadURL(arg)
    currentRenderWindow.once('page-title-updated', () => {
      event.sender.send('goto-website-done', {
        url: currentRenderWindow.webContents.getURL(),
        title: currentRenderWindow.webContents.getTitle(),
      })
    })
  })
  ipcMain.on('history-back', (event, arg) => {
    currentRenderWindow.webContents.goBack()
  })
  ipcMain.on('history-forward', (event, arg) => {
    currentRenderWindow.webContents.goForward()
  })
  ipcMain.on('page-reload', (event, arg) => {
    currentRenderWindow.webContents.reload()
  })
  ipcMain.on('page-stop-loading', (event, arg) => {
    currentRenderWindow.webContents.stop()
  })
  ipcMain.on('goto-homepage', (event, arg) => {
    currentRenderWindow.loadFile('index.html')
  })
  ipcMain.on('app-minimize', (event, arg) => {
    currentContainerWindow.minimize()
  })
  ipcMain.on('app-maximize', (event, arg) => {
    if (currentContainerWindow.isMaximized()) {
      currentContainerWindow.unmaximize()
    } else {
      currentContainerWindow.maximize()
    }
  })
  ipcMain.on('app-close', (event, arg) => {
    currentContainerWindow.close()
  })
}

module.exports = {
  init
}