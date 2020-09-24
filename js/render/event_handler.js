'use strict'

tabsEl.onclick = function(e) {
  for (const el of e.path) {
    // 点击关闭tab
    if (el.tagName.toLowerCase() === 'a' && el.classList.contains('tab-close-btn')) {
      const tabId = +el.getAttribute('data-tab-id')
      if (tabs.size > 1) {
        ipcRenderer.send('tab-close-manual', { tabId })
      } else {
        ipcRenderer.send('app-close')
      }
      break
    } else if (el.tagName.toLowerCase() === 'li') {
      tabs.forEach((tab, id) => {
        tab.active = false
      })
      const targetEl = el
      const id = +targetEl.getAttribute('id').replace('tab', '')
      if (id === -1) { // new tab
        ipcRenderer.send('tab-new-manual')
      } else {
        const tab = tabs.get(id)
        tab.active = true
        urlEl.value = tab.url
        ipcRenderer.send('tab-switch', { tabId: id })
        renderTabs()
      }
      break
    }
  }
}
minBtn.onclick = function() {
  ipcRenderer.send('app-minimize')
}
maxBtn.onclick = function() {
  ipcRenderer.send('app-maximize')
}
closeBtn.onclick = function() {
  ipcRenderer.send('app-close')
}
historyBackBtn.onclick = function() {
  ipcRenderer.send('history-back')
}
historyForwardBtn.onclick = function() {
  ipcRenderer.send('history-forward')
}
pageReloadBtn.onclick = function() {
  ipcRenderer.send('page-reload')
}
homepageBtn.onclick = function() {
  ipcRenderer.send('goto-homepage')
}