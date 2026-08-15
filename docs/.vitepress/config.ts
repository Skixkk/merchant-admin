/*
 * @Author: Skixkk skixkk7@gmail.com
 * @Date: 2026-08-14 22:45:25
 * @LastEditors: Skixkk skixkk7@gmail.com
 * @LastEditTime: 2026-08-15 13:55:50
 * @FilePath: \merchant-admin\docs\.vitepress\config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // app level config options
  
  // 👇 新增这一行，默认构建在主站的 `/` ；下面设置为 VitePress 打包资源路径 `/mrechant-admin` 下
  // 与仓库名完全一致，形成主站  ，前后斜杠不可省略
  base: '/merchant-admin/',
  lang: 'en-US',

  title: "merchant-admin",
  description: "saas admin & guide",
  head: [
    // 浏览器tab图标 favicon
    ['link', { rel: 'icon', type:'image/x-icon', href: '/merchant-admin/favicon.ico' }]
  ],

  themeConfig: {
    logo: {
      dark: 'https://youupro.xyz/ly/dark-logo.png',
      light: 'https://youupro.xyz/ly/light-logo.png',
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    // 网站标题
    siteTitle: 'merchant',
    // aside: 'left',
    // lastUpdatedText: "最后更新于(基于Git)",
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },

    nav: [
      // 一级目录 1
      { text: 'Home', link: '/' },
      {
        text: 'README',
        items: [
          { text: 'README', link: '/readme' },
          { text: 'Prompt', link: '/prompt' },
          { text: 'github LGTM', link: '/github-lgtm' },
          { text: 'Our Team', link: '/our-team' }
        ]
      },
      // 一级目录 2
      { text: 'Team & Contributors', link: '/team' } // 指向我们新建的 team.md
    ],

    sidebar: [
      {
        text: 'started',
        items: [
          { text: 'README', link: '/readme' },
          { text: 'Guide', link: '/guide' },
          { text: 'Prompt', link: '/prompt' },
          { text: 'github LGTM', link: '/github-lgtm' },
          { text: 'API Reference', link: '/api-reference' },
          { text: 'Our Team', link: '/our-team' },
        ]
      }
    ],

    // 定义切换页面上方显示的文字
    // docFooter: {
    //   prev: 'Pagina prior',
    //   next: 'Proxima pagina'
    // },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Skixkk/merchant-admin' },
    ],

    // 在 github 上编辑页面的链接
    editLink: {
      pattern: 'https://github.com/Skixkk/merchant-admin/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      copyright: 'Open source · <a href="https://github.com/Skixkk/merchant-admin/blob/main/LICENSE">MIT</a> · © 2026 <a href="https://github.com/Skixkk">Skixkk</a>. All rights reserved.'
    }
  }
})
