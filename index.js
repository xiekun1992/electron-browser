const {app, Menu, ipcMain} = require('electron')
const { BaseWindow, WebContentsView } = require('electron')
const path = require('path')

app.whenReady().then(() => {
    const viewHeight = 80
    const win = new BaseWindow({ width: 1280, height: 720, frame: false })

    // 顶部区域
    const view = new WebContentsView({
        webPreferences: {
            preload: path.resolve(__dirname, 'preload.js')
        }
    })
    win.contentView.addChildView(view)
    // view.webContents.loadFile('./index.html')
    // view.webContents.loadURL('http://www.baidu.com/')
    view.webContents.loadURL('http://localhost:5173/')
    view.setBounds({
        x: 0, y: 0, 
        width: win.getContentBounds().width,
        height: viewHeight
    })
    view.webContents.openDevTools()

    win.on('resize', () => {
        win.contentView.children.forEach(c => {
            if (c !== view) {
                c.setBounds({x: 0, y: viewHeight, width: win.getContentBounds().width, height: win.getContentBounds().height - viewHeight })
            } else {
                c.setBounds({x: 0, y: 0, width: win.getContentBounds().width, height: viewHeight })
            }
        })
    })
    ipcMain.handle('views.get', async () => {
        return {
            views: win.contentView.children.filter(item => item !== view).map(item => ({
                id: item.webContents.id,
                url: item.webContents.getURL(),
                title: item.webContents.getTitle(),
            })),
            activeId: win.contentView.children.filter(item => item !== view).find(item => item.getVisible())?.webContents.id
        }
    })
    ipcMain.handle('view.close', async (e, viewId) => {
        win.contentView.children.filter(item => item !== view).forEach(item => item.setVisible(false))
        const v = win.contentView.children.find(item => item.webContents.id === viewId)
        const vidx = win.contentView.children.findIndex(item => item.webContents.id === viewId)
        if (win.contentView.children[vidx + 1]) {
            win.contentView.children[vidx + 1].setVisible(true)
        } else {
            win.contentView.children[vidx - 1].setVisible(true)
        }
        win.contentView.removeChildView(v)
        v.webContents.close()
        if (win.contentView.children.length <= 1) {
            win.close()
        }
    })
    ipcMain.handle('view.switch', async (e, viewId) => {
        win.contentView.children.filter(item => item !== view).forEach(item => item.setVisible(false))
        const v = win.contentView.children.find(item => item.webContents.id === viewId)
        v.setVisible(true)
    })
    ipcMain.handle('view.back', async () => {
        const v = win.contentView.children.find(item => item.getVisible() && item !== view)
        v.webContents.navigationHistory.goBack()
    })
    ipcMain.handle('view.forward', async () => {
        const v = win.contentView.children.find(item => item.getVisible() && item !== view)
        v.webContents.navigationHistory.goForward()
    })
    ipcMain.handle('view.reload', async () => {
        const v = win.contentView.children.find(item => item.getVisible() && item !== view)
        v.webContents.reload()
    })
    ipcMain.handle('app.close', async () => {
        if (!win.isClosable()) {
            return false;
        }
        win.close()
        return true
    })
    ipcMain.handle('app.minimize', async () => {
        if (!win.isMinimizable()) {
            return false;
        }
        if (!win.isMinimized()) {
            win.minimize()
        }
        return true
    })
    ipcMain.handle('app.maximize', async () => {
        if (!win.isMaximizable()) {
            return false;
        }
        if (!win.isMaximized()) {
            win.maximize()
        } else {
            win.restore()
        }
        return true
    })

    
    const addView = (url) => {
        const view1 = new WebContentsView()
        win.contentView.addChildView(view1)
        view1.webContents.loadURL(url)
        // view1.webContents.loadURL('https://e-hentai.org/g/2492842/aecd93c75a')
        view1.setBounds({
            x: 0, y: viewHeight,
            width: win.getContentBounds().width,
            height: win.getContentBounds().height - viewHeight
        })
        view1.setVisible(true)
        view1.webContents.setWindowOpenHandler((details) => {
            // 在这里处理新窗口的打开，例如我们可以选择在默认浏览器中打开
            // 或者创建新的BrowserWindow

            // 例如：如果我们想要在外部浏览器中打开
            const { url } = details;
            // 判断url，如果不想在应用中打开，则用系统浏览器打开
            // if (url.startsWith('http:')) {
            //     require('electron').shell.openExternal(url);
            // }
            addView(url)

            // 返回一个对象，告诉Electron不创建新窗口
            return { action: 'deny' };
        });
        view1.webContents.on('page-title-updated', () => {
            console.log('page-title-updated')
            view.webContents.send('view.add', [win.contentView.children.filter(item => item !== view).map(item => ({
                id: item.webContents.id,
                url: item.webContents.getURL(),
                title: item.webContents.getTitle(),
            })), {
                id: view1.webContents.id,
                url: view1.webContents.getURL(),
                title: view1.webContents.getTitle(),
            }])
        })
        view1.webContents.on('will-frame-navigate', (origin, targets) => console.log('will-frame-navigate'))
        view1.webContents.on('will-navigate', (details, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId) => console.log('will-navigate'))
        view1.webContents.on('context-menu', (e, params) => {
            let template = []
            if (params.linkURL) {
                template.push(...[
                    {
                        label: '在新标签页中打开链接',
                        click() {
                            addView(params.linkURL)
                            view1.setVisible(false)
                        }
                    },
                    {
                        label: '在新窗口中打开链接',
                        click() {
                            
                        }
                    },
                    { type: 'separator' },
                    {
                        label: '复制链接地址',
                        click() {
                            
                        }
                    }
                ])
            }
            if (params.selectionText) {
                template.push(...[
                    { type: 'separator' },
                    {
                        label: '复制',
                        click() {
                            
                        }
                    }
                ])
            }
            if (template.length === 0) {
                template.push(...[
                    { type: 'separator' },
                    {
                        label: '返回',
                        enabled: view1.webContents.navigationHistory.canGoBack(),
                        click() {
                            view1.webContents.navigationHistory.goBack()
                        }
                    },
                    {
                        label: '前进',
                        enabled: view1.webContents.navigationHistory.canGoForward(),
                        click() {
                            view1.webContents.navigationHistory.goForward()
                        }
                    },
                    {
                        label: '重新加载',
                        click() {
                            view1.webContents.reload()
                        }
                    }
                ])    
            }
            template.push(...[
                { type: 'separator' },
                {
                    label: '检查',
                    click() {
                        view1.webContents.openDevTools()
                    }
                }
            ])
            const menu = Menu.buildFromTemplate(template)
            menu.popup({
                x: params.x,
                y: params.y + viewHeight
            })
            console.log(e, params)
        })
    }

    addView('https://www.baidu.com')
    // addView('https://e-hentai.org/g/2492842/aecd93c75a')
})