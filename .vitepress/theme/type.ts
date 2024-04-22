import {DefaultTheme} from "vitepress";

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
  export interface Config extends DefaultTheme.Config {
    blog?: BlogConfig
  }
