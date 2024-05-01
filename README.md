# JinYue的知识库

📝 **JinYue的个人技术知识库，记录 & 分享个人碎片化、结构化、体系化的技术知识内容。** 

🐇 [GitHub Pages（完整体验）](https://jinyue127.github.io/study-docs/)

## 开始

```bash
# 1.克隆本仓库
git clone git@github.com:JinYue127/study-docs.git
# 2.安装依赖
npm install
# 3.dev 运行，访问：http://localhost:5173
npm run dev
# 4.打包，文件存放位置：.vitepress/dist
# 如果是部署到 GitHub Pages，可以利用 GitHub Actions，在 push 到 GitHub 后自动部署打包
# 详情见：.github/workflows/deploy-pages.yml，根据个人需要删减工作流配置
npm run build
# 5.部署
# 5.1 push 到 GitHub 仓库，部署到 GitHub Pages：需要在仓库设置中启用 GitHub Pages（本仓库采用此种部署方式）
# 5.2 在其他平台部署, 例如：Gitee Pages、Vercel、Netlify、个人虚拟主机、个人服务器等
```

## 已扩展功能（持续优化细节）

- [x] 拆分配置文件：解决“大”配置文件问题，提取公有配置选项进行复用，方便维护

- [x] GitHub Actions：push 到 GitHub，自动进行项目打包及 GitHub Pages 部署

- [x] 自动生成侧边栏：将文章按规律性目录存放后，侧边栏将自动生成，支持文章置顶🔝（在文章 frontmatter 中配置 `isTop: true`，即可在侧边栏自动出现置顶分组）

- [x] 自定义页脚：支持ICP备案号、公安备案号、版权信息配置（符合大陆网站审核要求）

- [x] 文章元数据信息显示：文章标题下显示是否原创、作者、发布时间、所属分类、标签列表等信息，可全局配置作者及作者主页信息

- [x] 基于[不蒜子](https://busuanzi.ibruce.info/)已扩展文章阅读数信息，默认已启用.（bug:苹果设备计数会有异常）

- [x] 《我的标签》：模仿语雀标签页风格，另有标签云展示

- [x] 《我的归档》：自定义时间轴，展示历史文章数据。年份前可展示生肖，还可按分类、标签筛选

- [x] 文章评论：目前仅支持Giscus

- [x] 版权声明：文末显示原创或转载文章的版权声明，可自由配置采用的版权协议
- [x] Mermaid 流程图：在 Markdown 中绘制流程图、状态图、时序图、甘特图、饼图等，更多语法请参见：[Mermaid 官方文档](https://github.com/mermaid-js/mermaid/blob/develop/README.zh-CN.md) 。（Typora 编辑器也支持 `mermaid` 语法）

- [x] Markdown 脚注、Markdown 公式支持

- [x] 更多细节优化：敬请发现
  - [x] ......


## 特别鸣谢

- [vuejs/vitepress](https://github.com/vuejs/vitepress) （本知识库基于 VitePress 构建）
- [Charles7c](https://github.com/Charles7c/charles7c.github.io) （本知识库参考于 Charles7c ）
- [oml2d](https://oml2d.com/) （看板娘）
- ......
