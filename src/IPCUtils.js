const renderer = require('electron').ipcRenderer

function minimize() {
  renderer.send('app.minimize')
}
function maximize() {
  renderer.send('app.maximize')
}
function close() {
  renderer.send('app.close')
}
function backward() {
  renderer.send('view.backward')
}
function forward() {
  renderer.send('view.forward')
}
function refresh() {
  renderer.send('view.refresh')
}
function home() {
  renderer.send('view.home')
}
function navigateURL(url) {
  renderer.send('view.navigate', { url })
}
function setActiveViewById(id) {
  renderer.send('view.setActiveById', { id })
}
function deleteActiveViewById(id) {
  renderer.send('view.deleteById', { id })
}
function createNewView(id) {
  renderer.send('view.create', { id })
}