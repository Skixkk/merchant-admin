---
layout: page
title: Team
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/166358870?s=400&v=4',
    name: 'Skixkk',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/Skixkk' }
    ]
  }
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Our Team
    </template>
    <template #lead>
      The development of this project has been contributed by international developers and open source teams, 
      some of whom have chosen to showcase below.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members />
</VPTeamPage>
