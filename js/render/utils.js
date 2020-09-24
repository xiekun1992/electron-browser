function renderTabs() {
  let html = ''
  let activeFound = false
  tabs.forEach((tab, id) => {
    let pos = ''
    if (tab.active) {
      activeFound = true
    }
    if (!tab.active) {
      pos = 'left'
    } else if (!tab.active && !activeFound) {
      pos = 'right'
    } else {
      pos = 'active'
    }
    html += `<li class="tab-window ${pos}" id="tab${id}">
      <span>${tab.title || '新标签页'}</span>
      <a data-tab-id="${id}" class="tab-close-btn icon-cross"></a>
    </li>`
  })
  html += `<li class="tab-add" id="tab-1">
    <a class="ico-btn">
      <span class="icon-plus"></span>
    </a>
  </li>`
  tabsEl.innerHTML = html
}
function gotoSite(e) {
  e.preventDefault()
  ipcRenderer.send('goto-website', urlEl.value)
}