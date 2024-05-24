<!-- .vitepress/theme/Layout.vue -->

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Weather from "./components/Weather.vue";
import BlogBackToTopOrComment from "./components/BlogBackToTopOrComment.vue";
import Copyright from "./components/Copyright.vue";
import {useData} from "vitepress";
import md5 from 'blueimp-md5';

const {page, frontmatter} = useData();
</script>

<template>
  <ClientOnly>
    <DefaultTheme.Layout>
      <template #doc-footer-before>
        <Copyright
            v-if="(frontmatter?.aside ?? true) && (frontmatter?.showArticleMetadata ?? true) && !(frontmatter.authorLink)"
            :key="md5(page.relativePath)"
        />
      </template>

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
  </ClientOnly>
</template>

<style scoped lang="scss">
.home {
  margin: 0 auto;
  padding: 20px;
  max-width: 1126px;
}
</style>
