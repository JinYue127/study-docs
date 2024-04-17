import {defineConfig} from "vitepress";
import {set_sidebar} from './utils'
import timeline from "vitepress-markdown-timeline";
import taskLists from 'markdown-it-task-checkbox'
import {withMermaid} from "vitepress-plugin-mermaid";
import {tabsMarkdownPlugin} from 'vitepress-plugin-tabs'

export default withMermaid(
  defineConfig({
    base: '/study-docs/',
    mermaid: {
      // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
    },
    // optionally set additional config for plugin itself with MermaidPluginConfig
    mermaidPlugin: {
      class: "mermaid my-class", // set additional css classes for parent container
    },
    markdown: {
      image: {
        // 开启图片懒加载
        lazyLoading: true
      },
      //时间线
      config: (md) => {
        md.use(timeline).use(taskLists, {
          disabled: false,
          divWrap: false,
          divClass: 'checkbox',
          idPrefix: 'cbx_',
          ulClass: 'task-list',
          liClass: 'task-list-item',
        }).use(tabsMarkdownPlugin)
      },
    },
    srcDir: 'src',
    title: "Docs",
    description: "good good study,day day up",
    head: [
      ['link', {rel: 'icon', href: '/study-docs/logo.png'}],
      [
        "meta",
        {
          name: "referrer",
          content: "no-referrer"
        }
      ],
    ],
    cleanUrls: true,

    themeConfig: {
      footer: {
        message: '学习文档'
        // copyright: 'Copyright © 2019-present Evan You'
      },

      docFooter: {
        prev: '上一页',
        next: '下一页'
      },

      lastUpdated: {
        text: '最后更新于',
        formatOptions: {
          dateStyle: 'short',
          timeStyle: 'medium'
        }
      },

      returnToTopLabel: '回到顶部',
      sidebarMenuLabel: '菜单',
      darkModeSwitchLabel: '主题',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',
      externalLinkIcon: true,

      outline: {
        label: '页面导航',
        level: [2, 3]
      },

      logo: '/logo.png',
      search: {
        provider: 'local',
        options: {
          locales: {
            root: {
              translations: {
                button: {
                  buttonText: '搜索文档',
                  buttonAriaLabel: '搜索文档',
                },
                modal: {
                  noResultsText: '无法找到相关结果',
                  displayDetails: '显示详情',
                  resetButtonTitle: '清除查询条件',
                  footer: {
                    selectText: '选择',
                    navigateText: '切换',
                    closeText: '关闭',
                  },
                },
              },
            },
          },
        },
      },

      editLink: {
        pattern: 'https://github.com/JinYue127/study-docs/tree/master/src/:path',
        text: '在 Github 上编辑此页面'
      },
      // https://vitepress.dev/reference/default-theme-config

      nav: [
        {text: 'Home', link: '/'},
        {
          text: '前端', items: [
            {text: 'Typescript', link: '/前端/typescript/1.为什么说TypeScript 可能超越JavaScript？'},
            {text: '数组方法', link: '/前端/basicArray/不改变原数组（11个）'},
            {text: 'Radash', link: 'https://jinyue12138.gitee.io/radash-study/'},
          ]
        },
        {
          text: '后端', items: [
            {text: 'Nest', link: '/后端/nest/介绍'},
          ]
        },
        {
          text: '其他', items: [
            {text: 'markdown扩展', link: '/other/markdown扩展/index'},
          ]
        }
      ],

      sidebar: {
        '/前端/typescript/': {
          text: 'typescript',
          items: set_sidebar('/前端/typescript')
        },
        '/前端/basicArray/': {
          text: 'array',
          items: set_sidebar('/前端/basicArray')
        },
        '/后端/nest/': {
          text: 'nest',
          items: set_sidebar('/后端/nest')
        }
      },

      socialLinks: [
        {
          icon: 'github',
          link: 'https://github.com/JinYue127/study-docs'
        }
      ]
    }
  })
)
