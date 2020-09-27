<template>
  <div class="webview-container">
    <webview ref="webview" :src="url" :preload="view.preloadScript"></webview>
    <div class="link-hint" :class="{show: !!hoverLink}">{{hoverLink}}</div>
  </div>
</template>
<script>
const {
  ipcRenderer
} = require('electron')

export default {
  name: 'BrowserWindow',
  props: {
    url: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    favicon: {
      type: String,
      default: ''
    },
    view: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      preloadScript: '',
      hoverLink: ''
    }
  },
  methods: {
    getFavicon(url) {
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
    },
    loading() {
      const title = '正在加载'
      this.$emit('update:title', title)
    },
    pageTitleUpdated() {
      const title = this.$refs.webview.getTitle()
      this.$emit('update:title', title)
    },
    newWindow(e) {
      this.$emit('initWebview', e.url)
    },
    async pageFaviconUpdatedasync(e) {
      for (let url of e.favicons) {
        try {
          this.$emit('update:favicon', await this.getFavicon(url))
          break
        } catch(e) {}
      }
    },
    pageReload() {
      if (this.view.active) {
        this.$refs.webview.reload()
      }
    },
    historyForward() {
      if (this.view.active && this.$refs.webview.canGoForward()) {
        this.$refs.webview.goForward()
      }
    },
    historyBack() {
      if (this.view.active && this.$refs.webview.canGoBack()) {
        this.$refs.webview.goBack()
      }
    },
    homepage() {
      if (this.view.active) {
        this.view.src = this.view.homepage
        this.$refs.webview.loadURL(this.view.homepage)
      }
    },
    gotoSite(url) {
      if (this.view.active) {
        this.view.src = url
        this.$refs.webview.loadURL(url)
      }
    },
    didNavigate(e) {
      this.$emit('update:url', e.url)
    },
    ipcNewWindow(event, arg) {
      if (this.view.active) {
        this.newWindow(arg)
      }
    },
    openDevTools() {
      if (this.view.active) {
        this.$refs.webview.openDevTools()
      }
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.$refs.webview.openDevTools()
    //   this.$refs.webview.executeJavaScript('window.addEventListener("contextmenu", function(e) {console.log(e)})')
    // }, 1000)
    this.$refs.webview.addEventListener('load-commit', this.loading)
    // this.$refs.webview.addEventListener('did-start-loading', () => {
    //   const title = '正在加载'
    //   this.$emit('update:title', title)
    // })
    this.$refs.webview.addEventListener('page-title-updated', this.pageTitleUpdated)
    this.$refs.webview.addEventListener('did-stop-loading', this.pageTitleUpdated)
    this.$refs.webview.addEventListener('new-window', this.newWindow)
    this.$refs.webview.addEventListener('page-favicon-updated', this.pageFaviconUpdatedasync)
    this.$refs.webview.addEventListener('did-navigate-in-page', this.didNavigate)
    this.$refs.webview.addEventListener('did-navigate', this.didNavigate)

    // this.$refs.webview.addEventListener('dom-ready', () => {
    //     this.$refs.webview.openDevTools()
    // })
    this.$refs.webview.addEventListener('ipc-message', event => {
      const options = JSON.parse(event.channel)
      options.y += 82
      ipcRenderer.send('contextmenu-show', options)
    })
    this.$refs.webview.addEventListener('update-target-url', (event) => {
      this.hoverLink = event.url
    })


    this.$root.$on('page-reload', this.pageReload)
    this.$root.$on('history-forward', this.historyForward)
    this.$root.$on('history-back', this.historyBack)
    this.$root.$on('homepage', this.homepage)
    this.$root.$on('goto-site', this.gotoSite)

    ipcRenderer.on('open-devtools', this.openDevTools)
    ipcRenderer.on('new-window', this.ipcNewWindow)
    ipcRenderer.on('history-forward', this.historyForward)
    ipcRenderer.on('history-back', this.historyBack)
    ipcRenderer.on('page-reload', this.pageReload)
  },
  beforeDestroy() {
    this.$refs.webview.removeEventListener('load-commit', this.loading)
    this.$refs.webview.removeEventListener('page-title-updated', this.pageTitleUpdated)
    this.$refs.webview.removeEventListener('did-stop-loading', this.pageTitleUpdated)
    this.$refs.webview.removeEventListener('new-window', this.newWindow)
    this.$refs.webview.removeEventListener('page-favicon-updated', this.pageFaviconUpdatedasync)

    this.$root.$off('page-reload', this.pageReload)
    this.$root.$off('history-forward', this.historyForward)
    this.$root.$off('history-back', this.historyBack)
    this.$root.$off('homepage', this.homepage)
    this.$root.$off('goto-site', this.gotoSite)

    ipcRenderer.off('open-devtools', this.openDevTools)
    ipcRenderer.off('new-window', this.ipcNewWindow)
    ipcRenderer.off('history-forward', this.historyForward)
    ipcRenderer.off('history-back', this.historyBack)
    ipcRenderer.off('page-reload', this.pageReload)
  }
}
</script>
<style scoped>
.webview-container {
  position: absolute;
  background: #fff;
}
.link-hint {
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 12px;
  color: #888;
  z-index: 99999;
  background: #fff;
  border-radius: 0 5px 0 0;
  opacity: 0;
  /* transition: opacity .5s; */
  pointer-events: none;
}
.link-hint.show {
  padding: 4px 10px;
  opacity: 1;
}
</style>