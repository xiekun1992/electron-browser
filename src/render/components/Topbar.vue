<template>
  <header class="clearfix" :class="{invisible: !visible}">
    <ul class="tabs" id="tabsEl" :style="{'--tabnum': webviews.length}">
      <li class="tab-window" :class="{active: view.active}" v-for="view in webviews" :key="view.id" @click="switchTab(view)">
        <img :src="view.favicon" v-if="!!view.favicon">
        <span class="icon-earth" v-else></span>
        <span>{{view.title}}</span>
        <a class="tab-close-btn icon-cross" @click.stop="closeTab(view)"></a>
      </li>
      <li class="tab-add" id="tab-1" @click="addTab">
        <a class="ico-btn">
          <span class="icon-plus"></span>
        </a>
      </li>
    </ul>
    <ul class="clearfix app-ops">
      <li id="minBtn" @click="minimizeApp"><a><span class="icon-minus"></span></a></li>
      <li id="maxBtn" @click="maximizeApp"><a><span class="icon-plus"></span></a></li>
      <li id="closeBtn" @click="closeApp"><a><span class="icon-cross"></span></a></li>
    </ul>
    <section>
      <div>
        <ul class="window-ops">
          <li id="historyBackBtn" @click="historyBack"><a class="ico-btn"><span class="icon-arrow-left2"></span></a></li>
          <li id="historyForwardBtn" @click="historyForward"><a class="ico-btn"><span class="icon-arrow-right2"></span></a></li>
          <li id="pageReloadBtn" @click="pageReload"><a class="ico-btn"><span class="icon-spinner11"></span></a></li>
          <li id="homepageBtn" @click="homepage"><a class="ico-btn"><span class="icon-home2"></span></a></li>
        </ul>
      </div>
      <form @submit.prevent="gotoSite">
        <div>
          <div class="address-tip pull-left ico-btn">
            <span class="icon-lock"></span>
          </div>
          <input type="text" id="urlEl" v-model="url" spellcheck="false">
          <div class="address-tip pull-right ico-btn">
            <span class="icon-star-empty"></span>
          </div>
        </div>
      </form>
      <div class="clearfix">
        <ul class="pull-right">
          <li><a class="ico-btn"><span class="icon-paragraph-justify"></span></a></li>
        </ul>
      </div>
    </section>
  </header>
</template>
<script>
const {
  ipcRenderer
} = require('electron')

export default {
  name: 'Topbar',
  props: {
    webviews: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      url: '',
      visible: true
    }
  },
  watch: {
    webviews: {
      deep: true,
      immediate: true,
      handler(val) {
        for (const view of this.webviews) {
          if (view.active) {
            this.url = view.src
            break
          }
        }
      }
    }
  },
  methods: {
    closeTab(view) {
      this.$emit('closeTab', view)
    },
    addTab() {
      this.$emit('addTab')
    },
    switchTab(view) {
      this.$emit('switchTab', view)
    },
    minimizeApp() {
      ipcRenderer.send('app-minimize')
    },
    maximizeApp() {
      ipcRenderer.send('app-maximize')
    },
    closeApp() {
      ipcRenderer.send('app-quit')
    },
    homepage() {
      this.$root.$emit('homepage')
    },
    historyBack() {
      this.$root.$emit('history-back')
    },
    historyForward() {
      this.$root.$emit('history-forward')
    },
    pageReload() {
      this.$root.$emit('page-reload')
    },
    gotoSite() {
      if (!this.url) {
        return
      }
      this.$root.$emit('goto-site', this.url)
    },
    hide() {
      this.visible = false
    },
    show() {
      this.visible = true
    }
  },
  created() {
    this.$root.$on('topbar-hide', this.hide)
    this.$root.$on('topbar-show', this.show)
  },
  beforeDestroy() {
    this.$root.$off('topbar-hide', this.hide)
    this.$root.$off('topbar-show', this.show)
  }
}
</script>
<style scoped>
.invisible {
  height: 0;
  overflow: hidden;
}
</style>