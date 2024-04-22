import type {Component, InjectionKey, Ref} from 'vue'
import {computed, defineComponent, h, inject, provide,} from "vue";
import {useData, useRoute, withBase} from "vitepress";
import {Config} from "../../../type";

const configSymbol: InjectionKey<Ref<Config>> = Symbol('theme-config')

export function useConfig() {
  return {
    config: inject(configSymbol)!.value
  }
}

function resolveConfig(config: Config): Config {
  return {
    ...config,
    blog: {
      ...config?.blog,
      pagesData: config?.blog?.pagesData || []
    }
  }
}

export function useBlogConfig() {
  return inject(configSymbol)!.value.blog!
}

export function withConfigProvider(App: Component) {
  return defineComponent({
    name: 'ConfigProvider',
    setup(_, {slots}) {
      const {theme} = useData()
      console.log(theme, '---------theme')
      const config = computed(() => resolveConfig(theme.value))
      provide(configSymbol, config as any)
      return () => h(App, null, slots)
    }
  })
}

export function useBackToTopConfig() {
  return useBlogConfig().backToTop
}

export function useBackToComment() {
  return useBlogConfig().backToComment
}

export function useCurrentArticle() {
  const blogConfig = useConfig()
  const route = useRoute()

  const docs = computed(() => blogConfig.config?.blog?.pagesData)
  return computed(() => {
    const currentPath = route.path.replace(/.html$/, '')
    // 兼容中文路径
    const okPaths = [currentPath, decodeURIComponent(currentPath)]

    // 兼容 /(index.md)
    if (currentPath.endsWith('/')) {
      okPaths.push(
        ...[`${currentPath}index`, `${decodeURIComponent(currentPath)}index`]
      )
    }
    console.log(currentPath, okPaths, 'currentPath, okPaths')
    return docs.value?.find(v => okPaths.includes(withBase(v.route)))
  })
}

export function useDocMetaInsertPosition() {
  const blogConfig = useConfig()
  const {frontmatter} = useData()
  return computed(() => frontmatter.value?.docMetaInsertPosition || blogConfig.config?.blog?.docMetaInsertPosition || 'after')
}

export function useDocMetaInsertSelector() {
  const blogConfig = useConfig()
  const {frontmatter} = useData()
  return computed(() => frontmatter.value?.docMetaInsertSelector || blogConfig.config?.blog?.docMetaInsertSelector || 'h1')
}
