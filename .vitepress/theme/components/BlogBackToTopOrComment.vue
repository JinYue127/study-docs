<script lang="ts" setup>
import {useElementSize, useElementVisibility, useScroll} from '@vueuse/core'
import {ElIcon} from 'element-plus'
import {computed, h, ref} from 'vue'
import {vOuterHtml} from '../directives'
import {useBackToComment, useBackToTopConfig} from '../composables/config/blog'
import {Comment} from '@element-plus/icons-vue'
import {useData} from "vitepress";

function handleBackRoTop() {
  window.scrollTo({top: 0, behavior: 'smooth'})
}

const $vpDoc = document.querySelector('.vp-doc')
const el = ref<any>($vpDoc)
const {width} = useElementSize(el)
const docWidth = computed(() => `${width.value}px`)

const backToTopConfig = useBackToTopConfig()
const openBackToTop = computed(() => !!(backToTopConfig ?? true))

const {y} = useScroll(window)
const defaultTriggerHeight = 450
const triggerTop = computed(() => (typeof backToTopConfig === 'boolean' ? undefined : backToTopConfig?.top) ?? defaultTriggerHeight)

const show = computed(() => width && y.value > triggerTop.value)

const iconSVGStr = computed(() => typeof backToTopConfig === 'boolean' ? '' : backToTopConfig?.icon)


// 回到评论
const commentEl = document.querySelector('#giscus')
const commentIsVisible = useElementVisibility(commentEl as any)
const backToCommentConfig = useBackToComment()
const labelText = computed(() => {
  return backToCommentConfig?.label ?? '评论'
})
const mobileMinify = computed(() => width.value < 768 && (backToCommentConfig?.mobileMinify ?? true))
const CommentIcon = backToCommentConfig?.icon
    ? h('i', {
      onVnodeMounted(vnode) {
        if (vnode.el) {
          vnode.el.outerHTML = backToCommentConfig?.icon
        }
      },
    })
    : h(Comment)
const {frontmatter} = useData()
const showComment = computed(() => {
  return frontmatter.value.comment !== false
})

function handleScrollToComment() {
  document.querySelector('#giscus')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}
</script>
<template>
  <div v-if="openBackToTop" v-show="show" class="back-to-top">
    <span class="icon-wrapper" @click="handleBackRoTop">
      <ElIcon :size="20">
        <i v-if="iconSVGStr" v-outer-html="iconSVGStr"/>
        <svg v-else width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
              fill="currentColor"
              d="m20 22l-3.86-1.55c.7-1.53 1.2-3.11 1.51-4.72zM7.86 20.45L4 22l2.35-6.27c.31 1.61.81 3.19 1.51 4.72M12 2s5 2 5 10c0 3.1-.75 5.75-1.67 7.83A2 2 0 0 1 13.5 21h-3a2 2 0 0 1-1.83-1.17C7.76 17.75 7 15.1 7 12c0-8 5-10 5-10m0 10c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2"
          />
        </svg>
      </ElIcon>
    </span>
  </div>
  <div v-if="showComment && width" class="blog-comment-wrapper">
    <div v-show="!commentIsVisible" class="comment-btn-wrapper">
      <span v-if="!mobileMinify && labelText" class="icon-wrapper-text" @click="handleScrollToComment">
        <ElIcon :size="20">
          <CommentIcon/>
        </ElIcon>
        <span class="text">
          {{ labelText }}
        </span>
      </span>
      <span v-else class="icon-wrapper" @click="handleScrollToComment">
        <ElIcon :size="20">
          <CommentIcon/>
        </ElIcon>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  width: v-bind(docWidth);
  text-align: right;
  bottom: 80px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  opacity: 0.6;
  display: flex;
  justify-content: right;
  z-index: 200;

  &:hover {
    opacity: 1;
  }

  .icon-wrapper {
    cursor: pointer;
    border-radius: 50%;
    position: relative;
    right: -80px;
    box-shadow: var(--box-shadow);
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);

    &:hover {
      box-shadow: var(--box-shadow-hover);
    }
  }
}

@media screen and (max-width: 1200px) {
  .back-to-top .icon-wrapper {
    border-radius: 50%;
    position: static;
  }
}

.comment-btn-wrapper {
  position: fixed;
  width: v-bind(docWidth);
  text-align: right;
  bottom: 40px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  opacity: 0.6;
  display: flex;
  justify-content: right;
  z-index: 200;

  &:hover {
    opacity: 1;
  }

  .icon-wrapper,
  .icon-wrapper-text {
    cursor: pointer;
    border-radius: 50%;
    position: relative;
    right: -80px;
    box-shadow: var(--box-shadow);
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);

    &:hover {
      box-shadow: var(--box-shadow-hover);
    }
  }

  .icon-wrapper-text {
    border-radius: 2px;
    padding: 2px 6px;

    span.text {
      font-size: 12px;
      margin-left: 4px;
    }
  }
}

@media screen and (max-width: 1200px) {
  .comment-btn-wrapper {

    .icon-wrapper,
    .icon-wrapper-text {
      position: static;
    }
  }
}
</style>
