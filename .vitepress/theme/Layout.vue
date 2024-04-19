<!-- .vitepress/theme/Layout.vue -->

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Weather from "./components/Weather.vue";
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <slot name="doc-before"/>
    </template>
    <template #aside-top>
      <Weather/>
    </template>
    <template #home-hero-before>
      <slot name="home-hero-before"/>
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
