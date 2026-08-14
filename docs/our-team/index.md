---
prev:
  text: 'API Reference'
  link: '/api-reference'
next: 
  text: 'Team & Contributors'
  link: '/team'
---

<!--
 * @Author: Skixkk skixkk7@gmail.com
 * @Date: 2026-08-14 19:23:30
 * @LastEditors: Skixkk skixkk7@gmail.com
 * @LastEditTime: 2026-08-14 22:14:14
 * @FilePath: \merchant-admin\docs\our-team\index.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

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

# Our Team

> Thank you to our outstanding team members and contributors for their contributions

<VPTeamMembers size="small" :members />
