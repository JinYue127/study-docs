import {defineConfig} from "vitepress";
import {withMermaid} from "vitepress-plugin-mermaid";
import {blogTheme} from "./config/blog-theme";
import {markdown} from "./config/markdown";
import {head} from "./config/head";
import {themeConfig} from "./config/theme";
import {metaData} from "./config/constants";

export default withMermaid(
  defineConfig({
    sitemap: {
      hostname: 'https://jinyue127.github.io/study-docs'
    },
    base: '/study-docs/',
    srcDir: 'src',
    mermaid: {
      // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
    },
    // optionally set additional config for plugin itself with MermaidPluginConfig
    mermaidPlugin: {
      class: "mermaid my-class", // set additional css classes for parent container
    },
    markdown: markdown,
    lang: metaData.lang,
    title: metaData.title,
    description: metaData.description,
    head: head,
    cleanUrls: true,
    themeConfig: {
      blog: blogTheme,
      footer: {
        message: `本站总访问量 <span id="busuanzi_value_site_pv" /> 次`,
        copyright: '本站访客数 <span id="busuanzi_value_site_uv" /> 人次'
      },
      ...themeConfig
    }
  })
)
