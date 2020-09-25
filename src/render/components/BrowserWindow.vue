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
    }
  },
  mounted() {
    this.$refs.webview.addEventListener('load-commit', () => {
      const title = '正在加载'
      this.$emit('update:title', title)
    })
    // this.$refs.webview.addEventListener('did-start-loading', () => {
    //   const title = '正在加载'
    //   this.$emit('update:title', title)
    // })
    this.$refs.webview.addEventListener('page-title-updated', () => {
      const title = this.$refs.webview.getTitle()
      this.$emit('update:title', title)
    })
    // this.$refs.webview.addEventListener('did-stop-loading', () => {
    //   const title = this.$refs.webview.getTitle()
    //   this.$emit('update:title', title)
    // })
    this.$refs.webview.addEventListener('new-window', async (e) => {
      this.$emit('initWebview', e.url)
    })
    this.$refs.webview.addEventListener('page-favicon-updated', async (e) => {
      for (let url of e.favicons) {
        try {
          this.$emit('update:favicon', await this.getFavicon(url))
          break
        } catch(e) {}
      }
    })
  }
}
</script>
<style>

</style>