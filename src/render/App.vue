<template>
  <div class="container">
    <Topbar
      :webviews.sync="webviews"
      @addTab="addTab"
      @closeTab="closeTab"
      @switchTab="switchTab">
    </Topbar>
    <main>
      <BrowserWindow
        class="webview"
        :class="{active: view.active}"
        v-for="(view) in webviews"
        :key="view.id"
        :view="view"
        :url.sync="view.src"
        :favicon.sync="view.favicon"
        :title.sync="view.title"
        @initWebview="initWebview">
      </BrowserWindow>
    </main>
  </div>
</template>
<script>
import './assets/css/style.css'
import './assets/css/bar-header.css'
import './assets/css/bar-address.css'
import Topbar from './components/Topbar.vue'
import BrowserWindow from './components/BrowserWindow.vue'
const {
  ipcRenderer
} = require('electron')

export default {
  components: {
    Topbar,
    BrowserWindow
  },
  data() {
    return {
      webviews: [],
      activeWebview: null,
      id: 1,
      baseWebview: {
        homepage: 'https://zh.foxhentai.com/',
        preloadScript: ''
        // homepage: 'https://www.baidu.com'
      },
    }
  },
  methods: {
    switchTab(view) {
      this.webviews.forEach((webview) => {
        webview.active = false
      })
      view.active = true
    },
    addTab() {
      this.initWebview()
    },
    closeTab(view) {
      if (this.webviews.length === 1) {
        // quit app
        ipcRenderer.send('app-quit')
        return
      }
      for (let i = this.webviews.length - 1; i > -1; i--) {
        if (this.webviews[i] === view) {
          if (view.active) {
            if (this.webviews[i + 1]) {
              this.switchTab(this.webviews[i + 1])
            } else if (this.webviews[i - 1]) {
              this.switchTab(this.webviews[i - 1])
            }
          }
          this.webviews.splice(i, 1)
          break
        }
      }
    },
    initWebview(url) {
      const webview = Object.create({
        id: this.id++,
        active: true,
        src: '',
        title: '新标签页',
        favicon: '',
      })
      Object.setPrototypeOf(webview, this.baseWebview)
      webview.src = url || webview.homepage
      
      this.switchTab(webview)
      this.webviews.push(webview)
    }
  },
  created() {
    this.baseWebview.preloadScript = `file://${ipcRenderer.sendSync('app-root-path')}`
  },
  mounted() {
    this.addTab()
  },
  beforeDestroy() {
    ipcRenderer.off('new-window', this.newWindow)
  }
}
</script>
<style>

</style>