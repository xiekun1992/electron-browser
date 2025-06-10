const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('x', {
    onViewAdd(cb) {
        const handler = (e, args) => {
            console.log(123123)
            cb?.(...args)
        }
        ipcRenderer.on('view.add', handler)
        return () => {
            ipcRenderer.removeListener('view.add', handler)
        }
    },
    getViews() {
        return ipcRenderer.invoke('views.get')
    },
    closeView(viewId) {
        return ipcRenderer.invoke('view.close', viewId)
    },
    switchView(viewId) {
        return ipcRenderer.invoke('view.switch', viewId)
    },
    openView() {},
    // address bar
    back() {
        return ipcRenderer.invoke('view.back')
    },
    forward() {
        return ipcRenderer.invoke('view.forward')
    },
    reload() {
        return ipcRenderer.invoke('view.reload')
    },
    // app btns
    close() {
        return ipcRenderer.invoke('app.close')
    },
    minimize() {
        return ipcRenderer.invoke('app.minimize')
    },
    maximize() {
        return ipcRenderer.invoke('app.maximize')
    }
})