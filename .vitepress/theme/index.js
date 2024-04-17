// import Layout from './Layout.vue'
import DefaultTheme from 'vitepress/theme'
import {module} from "./constants";
import {nextTick, onMounted, toRefs, watch} from 'vue';
import giscusTalk from "vitepress-plugin-comment-with-giscus";
import {useData, useRoute} from "vitepress";
import "vitepress-markdown-timeline/dist/theme/index.css";
import mediumZoom from "medium-zoom";
import './styles/index.scss'
import googleAnalytics from 'vitepress-plugin-google-analytics'
import {enhanceAppWithTabs} from 'vitepress-plugin-tabs/client'

export default {
  // Layout,
  extends: DefaultTheme,
  setup() {
    const {frontmatter} = toRefs(useData());
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom('.main img', {background: 'var(--vp-c-bg)'}); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    };
    onMounted(() => {
      import ('./assets/iconFont')

      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
    giscusTalk(
      {
        repo: 'JinYue127/study-docs',
        repoId: 'R_kgDOLut63g',
        category: 'General', // 默认: `General`
        categoryId: 'DIC_kwDOLut63s4CeuGG',
        mapping: 'pathname', // 默认: `pathname`
        inputPosition: 'bottom', // 默认: `top`
        lang: 'zh-CN', // 默认: `zh-CN`
        lightTheme: 'light', // 默认: `light`
        darkTheme: 'transparent_dark', // 默认: `transparent_dark`
        loading: 'eager',
      },
      {
        frontmatter,
        route,
      },
      // 是否全部页面启动评论区。
      // 默认为 true，表示启用，此参数可忽略；
      // 如果为 false，表示不启用。
      // 可以在页面使用 `comment: true` 前言单独启用
      true
    );
  },
  async enhanceApp({app, router, siteData}) {
    enhanceAppWithTabs(app)
    googleAnalytics({
      id: 'G-JKGZZT00ND', //跟踪ID，在analytics.google.com注册即可
    })
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
  },
}
