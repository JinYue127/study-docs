// posts.data.js
import {createContentLoader} from 'vitepress'

export interface Data {
  // data 类型
  url: string,
  title?: string,
  date?: string,
  tags?: string[],
  categories?: string[],
  description?: string,
  cover?: string,
  [key: string]: any
}

declare const data: Data
export {data}
const excludedUrl = [
  "/",
  "/tags",
  "/about/",
  "/about/me",
  "/archives",
  "/categories/fragments/",
  "/categories/issues/",
  "/categories/tools/",
  "/categories/solutions/",
  "/courses/array/",
  "/courses/typescript/",
  "/courses/nest/",
];
export default createContentLoader('/**/*.md', {
  includeSrc: false, // 包含原始 markdown 源?
  render: false,     // 包含渲染的整页 HTML?
  excerpt: false,    // 包含摘录?
  transform(rawData) {
    return rawData.filter(item => {
      return !excludedUrl.includes(item.url)
    }).map(v => ({
      ...v.frontmatter,
      url: v.url
    }))
    // 根据需要对原始数据进行 map、sort 或 filter
    // 最终的结果是将发送给客户端的内容
  }
})
