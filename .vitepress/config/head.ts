import type { HeadConfig } from 'vitepress';
import { metaData } from './constants';

export const head: HeadConfig[] = [
  ['link', { rel: 'icon', href: '/study-docs/img/favicon.png' }],
  ['meta', { name: 'author', content: 'JinYue' }],
  ['meta', { name: 'keywords', content: 'JinYue的知识库, 知识库, 博客' }],
  ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
  ['meta', { name: 'HandheldFriendly', content: 'True' }],
  ['meta', { name: 'MobileOptimized', content: '320' }],
  ['meta', { name: 'theme-color', content: '#3c8772' }],
  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:locale', content: metaData.locale }],
  ['meta', { property: 'og:title', content: metaData.title }],
  ['meta', { property: 'og:description', content: metaData.description }],
  ['meta', { property: 'og:site', content: metaData.site }],
  ['meta', { property: 'og:site_name', content: metaData.title }],
  ['meta', { property: 'og:image', content: metaData.image }],
];
