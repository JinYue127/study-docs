import type {DefaultTheme} from 'vitepress';

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: '我的分类',
    items: [
      {text: 'Bug万象集', link: '/categories/issues/index', activeMatch: '/categories/issues/'},
      {text: '"杂碎"逆袭史', link: '/categories/fragments/index', activeMatch: '/categories/fragments/'},
      {text: '工具四海谈', link: '/categories/tools/index', activeMatch: '/categories/tools/'},
      {text: '方案春秋志', link: '/categories/solutions/index', activeMatch: '/categories/solutions/'}
    ],
    activeMatch: '/categories/'
  },
  {
    text: '我的小册',
    items: [
      {text: '数组快速入门', link: '/courses/array/index', activeMatch: '/courses/array/'},
      {text: 'typescript快速入门', link: '/courses/typescript/index', activeMatch: '/courses/typescript/'},
      {text: 'nest快速入门', link: '/courses/nest/index', activeMatch: '/courses/nest/'},
    ],
    activeMatch: '/courses/'
  },
  {
    text: '我的标签',
    link: '/tags',
    activeMatch: '/tags'
  },
  {
    text: '我的归档',
    link: '/archives',
    activeMatch: '/archives'
  },
  {
    text: '友情链接',
    items: [
      {text: '前端文章', link: 'https://fed.chanceyu.com/'},
      {text: 'Next.js学习', link: 'https://www.codewithantonio.com/'},
      {text: 'Radash学习', link: 'https://jinyue12138.gitee.io/radash-study/'},
      {text: 'z-library', link: 'https://zh.z-library.se/popular'},
      {text: 'wormhole', link: 'https://wormhole.app/'},
      {text: '阿里小站', link: 'https://pan666.net/'},
      {text: 'z-library', link: 'https://zh.z-library.se/'},
    ]
  },
  {
    text: '关于',
    items: [
      {text: '关于知识库', link: '/about/index', activeMatch: '/about/index'},
      {text: '关于我', link: '/about/me', activeMatch: '/about/me'}
    ],
    activeMatch: '/about/' // // 当前页面处于匹配路径下时, 对应导航菜单将突出显示
  },
];
