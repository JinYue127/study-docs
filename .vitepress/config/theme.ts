import type {DefaultTheme} from 'vitepress';
import {nav} from './nav';
import {sidebar} from './sidebar';
import {localSearchOptions} from './search/local-search';

export const themeConfig: DefaultTheme.Config = {
  nav, // 导航栏配置
  sidebar, // 侧边栏配置
  logo: '/study-docs/logo.png',
  outline: {
    label: '页面导航',
    level: 'deep'
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
  // 编辑链接配置
  editLink: {
    pattern: 'https://github.com/JinYue127/study-docs/tree/master/src/:path',
    text: '在 Github 上编辑此页面'
  },
  // 搜索配置
  search: {
    // 本地离线搜索
    provider: 'local',
    options: localSearchOptions
  },
  // 导航栏右侧社交链接配置
  socialLinks: [
    {icon: 'github', link: 'https://github.com/JinYue127/study-docs'},
  ],

  // 自定义扩展: 文章元数据配置
  // @ts-ignore
  articleMetadataConfig: {
    author: 'JinYue', // 文章全局默认作者名称
    authorLink: '/study-docs/about/me', // 点击作者名时默认跳转的链接
    showViewCount: false, // 是否显示文章阅读数, 需要在 docs/.vitepress/theme/api/config.js 及 interface.js 配置好相应 API 接口
  },
}
