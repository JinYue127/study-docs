import {defineConfig} from 'vitepress'
import {set_sidebar} from './utils'

export default defineConfig({
  srcDir: 'src',
  title: "Docs",
  description: "good good study,day day up",
  head: [
    ['link', {rel: 'icon', href: '/logo.png'}],
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
      level: [2,3]
    },

    logo: '/logo.png',

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://gitee.com/jinyue12138/study-docs/tree/master/src/:path',
      text: '在 Gitee 上编辑此页面'
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
      // {
      //   text: '组件库', items: [
      //     {text: 'Fusion', link: 'https://fusion.design/pc/?themeid=2'},
      //     {text: 'Shadcn', link: 'https://ui.shadcn.com/'},
      //     {text: 'ant-design-react', link: 'https://ant-design.antgroup.com/components/overview-cn'},
      //     {text: 'Element Plus', link: 'https://element-plus.gitee.io/zh-CN/'},
      //     {text: 'Vant', link: 'https://vant-ui.github.io/vant/#/zh-CN/'},
      //     {text: 'Tailwindcss', link: 'https://www.tailwindcss.cn/'},
      //   ]
      // },
      // {
      //   text: '官方文档', items: [
      //     {text: 'Vitest', link: 'https://cn.vitest.dev/'},
      //     {text: 'Vitepress', link: 'https://vitepress.dev/zh/'},
      //     {text: 'Vite', link: 'https://cn.vitejs.dev/'},
      //     {text: '飞冰 (ICE)', link: 'https://v3.ice.work/'},
      //     {text: 'MDN', link: 'https://developer.mozilla.org/zh-CN/docs/Learn'},
      //     {text: 'Clerk', link: 'https://dashboard.clerk.com/'},
      //     {text: 'Nuxt', link: 'https://www.nuxt.com.cn/'},
      //     {text: 'Astro', link: 'https://docs.astro.build/zh-cn/getting-started/'},
      //     {text: 'Mock', link: 'https://github.com/nuysoft/Mock/wiki/Getting-Started'},
      //     {text: 'Dayjs', link: 'https://dayjs.fenxianglu.cn/'},
      //     {text: 'Echarts', link: 'https://echarts.apache.org/zh/index.html'},
      //     {text: 'Pinia', link: 'https://pinia.web3doc.top/'},
      //     {text: 'Typeorm', link: 'https://typeorm.biunav.com/'},
      //     {text: '微信公众平台', link: 'https://mp.weixin.qq.com/'},
      //     {text: 'Vue Router', link: 'https://router.vuejs.org/zh/introduction.html'},
      //     {text: 'w3school', link: 'https://www.w3school.com.cn/index.html'},
      //   ]
      // },
      // {
      //   text: '面试', items: []
      // },
      // {
      //   text: '问题', items: []
      // },
      // {
      //   text: 'Game', items: [
      //     {text: 'gamer520', link: 'https://www.gamer520.com/'},
      //     {text: 'xd-game', link: 'https://www.xdgame.com/'},
      //     {text: 'truck-game', link: 'https://truckgame.cn/'},
      //     {text: 'ali213', link: 'https://down.ali213.net/'},
      //   ]
      // },
      // {
      //   text: '工具', items: [
      //     {text: 'GitHub', link: 'https://github.com/'},
      //     {text: 'Gitee', link: 'https://gitee.com/'},
      //     {text: 'Gmail', link: 'https://gmail.com/'},
      //     {text: 'Wrmhole', link: 'https://wormhole.app/'},
      //     {text: '阿里云', link: 'https://home.console.aliyun.com/home/dashboard/ProductAndService'},
      //     {text: 'ProcessOn', link: 'https://www.processon.com/'},
      //     {text: 'ngrok', link: 'https://dashboard.ngrok.com/cloud-edge/domains'},
      //     {text: '掘金', link: 'https://juejin.cn/'},
      //     {text: 'ShowDoc', link: 'https://www.showdoc.com.cn/'},
      //     {text: '力扣', link: 'https://leetcode.cn/'},
      //     {text: '乔布简历', link: 'https://cv.qiaobutang.com/'},
      //     {text: 'boardmix', link: 'https://boardmix.cn/'},
      //     {text: '测网速', link: 'https://www.speedtest.cn/'},
      //     {text: 'idea激活码', link: 'https://www.jiweichengzhu.com/ide/code'},
      //     {text: '网页图标在线抓取', link: 'https://gonglue.qinggl.com/app/img/icon.jsp'},
      //     {text: 'JSON工具', link: 'https://www.bejson.com/'},
      //     {text: 'JSON转TypeScript', link: 'https://tooltt.com/json2typescript/'},
      //     {text: 'HTML/URL To Markdown', link: 'https://devtool.tech/html-md'},
      //   ]
      // },
      // {
      //   text: '资源', items: [
      //     {text: '阿里小站', link: 'https://pan666.net/'},
      //     {text: '佛系软件', link: 'https://foxirj.com/'},
      //     {text: '魔戒', link: 'https://mojie.app/dashboard'},
      //     {text: 'pexels', link: 'https://www.pexels.com/zh-cn/'},
      //     {text: 'pixabay', link: 'https://pixabay.com/'},
      //     {text: '潮点', link: 'https://shipin520.com/sousuo/?word=&type=all&kid=&order=&data=&page=1&from_code=12&sk=5042065'},
      //     {text: 'IconFont', link: 'https://www.iconfont.cn/'},
      //     {text: 'NBA', link: 'https://www.aliyundrive.com/s/hVAgTmqUELD'},
      //     {text: '后盾人', link: 'https://doc.houdunren.com/'},
      //   ]
      // },
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
        icon:'github',
        link: 'https://gitee.com/jinyue12138/study-docs'
      }
    ]
  }
})
