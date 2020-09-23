'use strict'

const { ipcMain } = require('electron')
const window = require('./window')
const {
  createContainerWindow,
  createRenderWindow
} = window


function init () {
  ipcMain.on('goto-website', (event, arg) => {
    console.log(arg, window)
    window.currentRenderWindow.loadURL(arg)
    window.currentRenderWindow.once('page-title-updated', () => {
      event.sender.send('goto-website-done', {
        url: window.currentRenderWindow.webContents.getURL(),
        title: window.currentRenderWindow.webContents.getTitle(),
      })
    })
  })
  ipcMain.on('history-back', (event, arg) => {
    window.currentRenderWindow.webContents.goBack()
  })
  ipcMain.on('history-forward', (event, arg) => {
    window.currentRenderWindow.webContents.goForward()
  })
  ipcMain.on('page-reload', (event, arg) => {
    window.currentRenderWindow.webContents.reload()
  })
  ipcMain.on('page-stop-loading', (event, arg) => {
    window.currentRenderWindow.webContents.stop()
  })
  ipcMain.on('goto-homepage', (event, arg) => {
    window.currentRenderWindow.loadFile('index.html')
  })
  ipcMain.on('app-minimize', (event, arg) => {
    window.currentContainerWindow.minimize()
  })
  ipcMain.on('app-maximize', (event, arg) => {
    if (window.currentContainerWindow.isMaximized()) {
      window.currentContainerWindow.unmaximize()
    } else {
      window.currentContainerWindow.maximize()
    }
  })
  ipcMain.on('app-close', (event, arg) => {
    window.currentContainerWindow.close()
  })
}

module.exports = {
  init
}