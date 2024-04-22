import type {Component, InjectionKey, Ref} from 'vue'
import {computed, defineComponent, h, inject, provide,} from "vue";
import {useData} from "vitepress";
import {Config} from "../../type";

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
