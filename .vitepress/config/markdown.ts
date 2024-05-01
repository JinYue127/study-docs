import type {MarkdownOptions} from 'vitepress';
import timeline from "vitepress-markdown-timeline";
import {tabsMarkdownPlugin} from "vitepress-plugin-tabs";
import taskLists from 'markdown-it-task-checkbox'

export const markdown: MarkdownOptions = {
  // Shiki主题, 所有主题参见: https://github.com/shikijs/shiki/blob/main/docs/themes.md
  theme: {
    light: 'github-light',
    dark: 'github-dark-dimmed'
  },
  image: {
    lazyLoading: true
  },
  math: true,
  config: (md) => {

    md.use(timeline).use(taskLists, {
      disabled: false,
      divWrap: false,
      divClass: 'checkbox',
      idPrefix: 'cbx_',
      ulClass: 'task-list',
      liClass: 'task-list-item',
    }).use(tabsMarkdownPlugin)
    // 在所有文档的<h1>标签后添加<ArticleMetadata/>组件
    md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
      let htmlResult = slf.renderToken(tokens, idx, options);
      if (tokens[idx].tag === 'h1') htmlResult += `\n<ClientOnly><ArticleMetadata v-if="($frontmatter?.aside ?? true) && ($frontmatter?.showArticleMetadata ?? true)" :article="$frontmatter" /></ClientOnly>`;
      return htmlResult;
    }
  },
};
