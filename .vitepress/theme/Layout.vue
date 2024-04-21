<!-- .vitepress/theme/Layout.vue -->

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Weather from "./components/Weather.vue";
import BlogHomeHeaderAvatar from "./components/BlogHomeHeaderAvatar.vue";
import BlogBackToTopOrComment from "./components/BlogBackToTopOrComment.vue";
import BlogArticleAnalyze from "./components/BlogArticleAnalyze.vue";
</script>

<template>
  <DefaultTheme.Layout>
    <template #aside-top>
      <Weather/>
    </template>
    <!-- 自定义首页 -->
    <template #home-hero-before>
      <slot name="home-hero-before"/>
      <div class="home">
        <BlogHomeHeaderAvatar/>
      </div>
    </template>
    <template #doc-after>
      <slot name="doc-after"/>
      <ClientOnly>
        <BlogBackToTopOrComment/>
      </ClientOnly>
    </template>
    <template #doc-before>
      <slot name="doc-before"/>
      <!-- 阅读时间分析 -->
      <ClientOnly>
        <BlogArticleAnalyze/>
      </ClientOnly>
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped lang="scss">
.home {
  margin: 0 auto;
  padding: 20px;
  max-width: 1126px;
}
</style>
