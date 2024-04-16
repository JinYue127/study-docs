import Layout from './Layout.vue'
import DefaultTheme from 'vitepress/theme'


export default {
  // Layout,
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}
