---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Merchant Admin 0.2.0"
  text: "The future has arrived."
  tagline: Small and medium-sized food delivery SaaS platform
  image:
    src: /tech-stack.svg
    alt: Developed by Skixkk, an open-source organization of Runsme.com. 

  actions:
    - theme: brand
      text: Developer docs
      link: /readme
    - theme: alt
      text: View on GitHub
      link: https://github.com/Skixkk/merchant-admin

features:
  - title: 产品说明
    details: Saas 外卖商家商品管理系统后台
  - title: 协助开发提示词
    details: AI SKILL & DESGIN
  - title: 团队
    details: 版本 && 计划
    
---

## Getting Started

You can get started using the repo

```sh
git clone https://github.com/Skixkk/merchant-admin
cd merchant-admin
node -v
npm -v

npm i
npm run dev

# If you need to modify the document
npm run docs:dev
```

---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/166358870?s=400&v=4',
    name: 'Skixkk',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/Skixkk' },
    ]
  },
]
</script>

### contributors

> Excellent creators, excellent developers, excellent collaborators

<VPTeamMembers size="small" :members />
