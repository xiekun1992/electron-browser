'use strict'

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
      ${tab.favicon ? `<img src="${tab.favicon}">` : '<span class="icon-earth"></span>'}
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
  tabsEl.style.setProperty('--tabnum', tabs.size)
}
function gotoSite(e) {
  e.preventDefault()
  ipcRenderer.send('goto-website', urlEl.value)
}
function getFavicon(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = function() {
      resolve(img.src)
    }
    img.onerror = function() {
      reject()
    }
  })
}