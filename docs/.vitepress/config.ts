import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // app level config options
  lang: 'en-US',
  title: "merchant-admin",
  description: "saas admin & guide",
  
  // 👇 新增这一行，默认构建在主站的 `/` ；下面设置为 VitePress 打包资源路径 `/mrechant-admin` 下
  // 与仓库名完全一致，前后斜杠不可省略
  base: '/merchant-admin/',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
    ],

    sidebar: [
      {
        text: 'started',
        items: [
          { text: 'README', link: '/redame' },
          { text: 'Guide', link: '/guide' },
          { text: 'Prompt', link: '/prompt' },
          { text: 'github LGTM', link: '/github-lgtm' },
          { text: 'API Reference', link: '/api-reference' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Skixkk/merchant-admin' },
    ]
  }
})
