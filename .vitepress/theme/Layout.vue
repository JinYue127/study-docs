<!-- .vitepress/theme/Layout.vue -->

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Weather from "./components/Weather.vue";
import BlogBackToTopOrComment from "./components/BlogBackToTopOrComment.vue";
</script>

<template>
  <DefaultTheme.Layout>
    <template #aside-top>
      <Weather/>
    </template>
    <template #doc-after>
      <slot name="doc-after"/>
      <ClientOnly>
        <BlogBackToTopOrComment/>
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
