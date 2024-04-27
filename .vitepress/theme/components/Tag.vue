<template>
  <div class="main-container-tag">
    <!-- 头部 -->
    <div class="tag-header-wrapper">
      <span class="tag-breadcrumb-icon">
        <svg role="img" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em"
             class="larkui-icon icon-svg index-module_size_wVASz" style="width: 16px; min-width: 16px; height: 16px;"><defs></defs><path
            d="M527.744 32c20.8 0.192 40.32 8.32 55.04 23.04l386.112 386.24c14.912 14.848 23.104 34.56 23.104 55.68 0 20.992-8.192 40.704-23.04 55.552l-416.512 416.512c-14.784 14.784-34.624 22.976-55.68 22.976a78.08 78.08 0 0 1-55.616-23.04L55.104 582.784A78.272 78.272 0 0 1 32 527.552V110.72C32 67.2 67.2 32 110.72 32h417.024zM267.136 267.136a128.064 128.064 0 1 0 181.184 181.12 128.064 128.064 0 0 0-181.184-181.12z"></path></svg>
      </span>
      <span class="tag-breadcrumb-item">我的标签</span>
    </div>

    <!-- 内容 -->
    <div>
      <!-- 标签云 -->
      <WordCloud :dataList="dataList" :style="{ width: '100%', height: '130px' }"/>
      <el-card style="width: 100%;margin-bottom: 20px" shadow="always">
        <div class="tag">
          <el-check-tag
              v-for="(tag, tagTitle) in tags"
              :key='tagTitle'
              @click="toggleTag(tagTitle)"
              effect="light" type="primary"
              round
              :checked="selectTag===tagTitle"
          >
            {{ tagTitle }}&nbsp;&nbsp;{{ tag.length }}
          </el-check-tag>
        </div>
      </el-card>
      <el-card v-if="selectTag" style="width: 100%;margin-bottom: 20px" shadow="always" class="card-box">
        <template #header>
          <div class="card-header">
            <span> 共 {{ tags[selectTag].length }} 篇文章</span>
          </div>
        </template>
        <div class="result-item" v-for="(article, index) in tags[selectTag]" :key="index">
          <h3 class="result-item-title">
            <a :href="article.path" target="_blank">{{ article.title }}</a>
          </h3>
          <!-- 文章元数据信息 -->
          <ArticleMetadata :article="article" :key="md5(article.date)"/>
        </div>
      </el-card>
      <el-card v-if="!selectTag" style="width: 100%;margin-bottom: 20px" shadow="always">
        <el-empty description="点击上方标签，查看标签下的所有文章"/>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import md5 from 'blueimp-md5';
import {data as articleData} from '../../../article.data.js';
import {getQueryParam} from "../utils";
import WordCloud from "./WordCloud.vue";
import {ElCard, ElCheckTag, ElEmpty} from 'element-plus'
import ArticleMetadata from "./ArticleMetadata.vue";

const tags = computed(() => initTags(articleData));

/**
 * 初始化标签数据
 * {tagTitle1: [article1, article2, ...}
 */
function initTags(articleData: any) {
  const tags: any = {};
  for (let i = 0; i < articleData.length; i++) {
    const article = articleData[i];
    const articleTags = article.tags;
    if (Array.isArray(articleTags)) {
      articleTags.forEach((articleTag) => {
        if (!tags[articleTag]) {
          tags[articleTag] = [];
        }
        tags[articleTag].push(article);
        // 文章按发布时间降序排序
        tags[articleTag].sort((a, b) => b.date.localeCompare(a.date));
      });
    }
  }
  return tags;
}

// 点击指定Tag后进行选中
let selectTag = ref<any>('');
const toggleTag = (tagTitle: any) => {
  if (selectTag.value && selectTag.value == tagTitle) {
    selectTag.value = null;
  } else {
    selectTag.value = tagTitle;
  }
}

// 如果URL路径有tag参数, 默认选中指定Tag, 例如: /tags?tag=Git
let tag = getQueryParam('tag');
if (tag && tag.trim() != '') {
  toggleTag(tag);
}

const dataList = computed(() => initWordCloud(tags));

/**
 * 初始化词云数据
 * [{"name": xx, "value": xx}]
 */
function initWordCloud(tags: any) {
  const dataList = [];
  for (let tag in tags.value) {
    dataList.push({"name": tag, "value": tags.value[tag].length});
  }
  return dataList;
}
</script>

<style scoped>
/** 头部样式 */
.main-container-tag .tag-header-wrapper {
  padding: 24px 0;
  margin-bottom: 24px;
  box-shadow: 0 1px 0 0 var(--vp-c-gutter);
  -webkit-box-shadow: 0 1px 0 0 var(--vp-c-gutter);
}

.main-container-tag .tag-header-wrapper .tag-breadcrumb-icon {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  vertical-align: middle;
}

.main-container-tag .tag-header-wrapper .tag-breadcrumb-icon .icon-svg {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -8px;
  margin-top: -8px;
  fill: #bec0bf;
}

.main-container-tag .tag-header-wrapper .tag-breadcrumb-item {
  vertical-align: middle;
  display: inline-block;
  font-size: 16px;
  margin-left: 16px;
}

svg:not(:root) {
  overflow: hidden;
}

.tag {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.result-item {
  padding-left: 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 20px;
  padding-top: 20px;

  .result-item-title {
    margin: 0;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;

    a {
      font-weight: 400;
      font-size: 14px;
    }
  }
}

.card-box :deep(.el-card__body) {
  padding: 0;
}

</style>
