<template>
  <div>
    <webview ref="webview" :src="url"></webview>
  </div>
</template>
<script>
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
    view: {
      type: Object,
      default: () => {}
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

    this.$root.$on('page-reload', this.pageReload)
    this.$root.$on('history-forward', this.historyForward)
    this.$root.$on('history-back', this.historyBack)
    this.$root.$on('homepage', this.homepage)
    this.$root.$on('goto-site', this.gotoSite)
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
  }
}
</script>
<style>

</style>