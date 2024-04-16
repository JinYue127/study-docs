import Layout from './Layout.vue'
import DefaultTheme from 'vitepress/theme'
import '//at.alicdn.com/t/c/font_4510196_jy6z3d81r7l.js'
import {module} from "./constants";

export default {
  // Layout,
  extends: DefaultTheme,
  Layout,
  async enhanceApp({app, router, siteData}) {
    if (!import.meta.env.SSR) {
      const {loadOml2d} = await import('oh-my-live2d');
      loadOml2d({
        menus: {
          items: (defaultItems) => {
            return [
              defaultItems[0],
              defaultItems[1],
              {
                id: 'github',
                title: '我的github',
                icon: 'icon-github-fill',
                onClick: () => window.open('https://github.com/JinYue127')
              }
            ]
          }
        },
        models: module
      });
    }
  }
}
