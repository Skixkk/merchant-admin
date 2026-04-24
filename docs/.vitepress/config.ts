import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // app level config options
  lang: 'en-US',
  title: "merchant-admin",
  description: "saas admin & guide",
  
  // 👇 新增这一行，固定写法，必须加
  base: '/docs/',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Prompt', link: '/prompt' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'started',
        items: [
          { text: 'README', link: '/redame' },
          { text: 'Guide', link: '/guide' },
          { text: 'Prompt', link: '/prompt' },
          { text: 'API Reference', link: '/api-reference' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Skixkk' }
    ]
  }
})
