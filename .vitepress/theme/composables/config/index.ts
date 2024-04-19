import {DefaultTheme} from "vitepress";

export namespace Theme {
  export interface PageMeta {
    title: string
    date: string
    tag?: string[]
    description?: string
    descriptionHTML?: string
    cover?: string
    hiddenCover?: boolean
    readingTime?: boolean
    sticky?: number
    author?: string
    hidden?: boolean
    layout?: string
    // old
    categories: string[]
    tags: string[]
    /**
     * 文章首页置顶
     */
    top?: number
    /**
     * 手动控制相关文章列表的顺序
     */
    recommend?: number | false | string | string[] | [...string[], number]
    /**
     * TODO: 待开发
     * 时间线
     */
    timeline: string
    /**
     * TODO: 待开发
     * 专栏&合集
     */
    album: string
    // 是否发布
    publish?: boolean
    /**
     * 文章作者，标签等信息插入位置
     * @default 'h1'
     */
    docMetaInsertSelector?: string
    /**
     * 文章作者，标签等信息插入位置
     * @default 'after'
     */
    docMetaInsertPosition?: 'before' | 'after'
  }

  export interface PageData {
    route: string
    meta: PageMeta
  }

  export interface HomeBlog {
    name?: string
    motto?: string
    inspiring?: string | string[]
    inspiringTimeout?: number
    pageSize?: number
    author?: string | boolean
    logo?: string | boolean
    /**
     * @default 'card'
     */
    avatarMode?: 'card' | 'split'
  }

  export interface ArticleConfig {
    readingTime?: boolean
    /**
     * 阅读时间分析展示位置
     * @default 'inline'
     */
    readingTimePosition?: 'inline' | 'newLine' | 'top'
    hiddenCover?: boolean
  }

  export type ThemeColor =
    | 'vp-default'
    | 'vp-green'
    | 'vp-yellow'
    | 'vp-red'
    | 'el-blue'
    | 'el-yellow'
    | 'el-green'
    | 'el-red'

  export interface BlogConfig {
    /**
     * 内置一些主题色
     * @default 'vp-default'
     * 也可以自定义颜色，详见 TODO：文档
     */
    themeColor?: ThemeColor
    pagesData: PageData[]
    author?: string
    home?: HomeBlog
    /**
     * 首页页脚
     */
    footer?: Footer | Footer[]
    /**
     * 文章作者，标签等信息插入位置
     * @default 'h1'
     */
    docMetaInsertSelector?: string
    /**
     * 文章作者，标签等信息插入位置
     * @default 'after'
     */
    docMetaInsertPosition?: 'before' | 'after'
    /**
     * 回到顶部
     * @default true
     */
    backToTop?: boolean | BackToTop
    backToComment?: boolean | BackToComment
  }

  export interface BackToTop {
    /**
     * 距离顶部多少距离出现
     * @default 450
     */
    top?: number

    /**
     * 设置展示图标，svg
     * @recommend https://iconbuddy.app/search?q=fire
     */
    icon?: string
  }

  export interface BackToComment {
    /**
     * @default '评论'
     */
    label?: string
    /**
     * 自定义图标，SVG 格式
     * @recommend https://iconbuddy.app/search?q=fire
     */
    icon?: string
    /**
     * 移动端最小化按钮
     * @default true
     */
    mobileMinify?: boolean
  }

  export interface FooterItem {
    text: string
    link?: string
    icon?: boolean | string
  }

  export interface Footer {
    /**
     * 自定义补充信息（支持配置为HTML），在内置的 footer 上方
     */
    message?: string | string[]
    /**
     * 自定义补充信息（支持配置为HTML），在内置的 footer 下方
     */
    bottomMessage?: string | string[]
    /**
     * 自定义补充信息（支持配置为HTML），紧随内置的后方
     */
    list?: string | string[] | FooterItem | FooterItem[]
  }

  export interface Config extends DefaultTheme.Config {
    blog?: BlogConfig
  }
}
