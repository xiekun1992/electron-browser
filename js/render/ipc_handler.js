'use strict'

ipcRenderer.on('goto-website-done', (event, arg) => {
  if (arg.id) {
    const el = document.querySelector('#tab' + arg.id)
    if (el) {
      const tab = tabs.get(arg.id)
      if (arg.url) {
        tab.url = arg.url
        urlEl.value = arg.url
      }
      if (arg.title) {
        tab.title = arg.title
      }
      renderTabs()
    }
  }
})
ipcRenderer.on('tab-new', (event, arg) => {
  tabs.forEach((tab, id) => {
    tab.active = false
  })
  tabs.set(arg.id, {
    active: true,
    url: '',
    title: ''
  })
  renderTabs()
})
ipcRenderer.on('tab-closed', (event, arg) => {
  // 查找下一个激活tab
  if (tabs.get(arg.tabId).active) {
    const ids = Array.from(tabs.keys())
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      if (id === arg.tabId) {
        const nextId = ids[i + 1]
        const prevId = ids[i - 1]
        let tab, activeTabId
        if (nextId) {
          tab = tabs.get(nextId)
          activeTabId = nextId
        } else if (prevId) {
          tab = tabs.get(prevId)
          activeTabId = prevId
        } else { // 只打开了一个tab
          ipcRenderer.send('app-close')
          break
        }
        tabs.delete(arg.tabId)
        tabs.forEach((tab, id) => {
          tab.active = false
        })

        tab.active = true
        urlEl.value = tab.url
        ipcRenderer.send('tab-switch', { tabId: activeTabId })
        renderTabs()
        break
      }
    }
  } else {
    tabs.delete(arg.tabId)
    renderTabs()
  }
})
ipcRenderer.on('favicon-list', async (event, arg) => {
  // 尝试可用的favicon
  let avail = false
  for (let url of arg.favicons) {
    try {
      tabs.get(arg.tabId).favicon = await getFavicon(url)
      avail = true
      renderTabs()
      break
    } catch(e) {}
  }
  if (!avail) {
    // document.querySelector(`#tab${arg.tabId}>img`).src = await getFavicon(url)
  }
})