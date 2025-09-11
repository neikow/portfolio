<template>
  <header class="flex container mx-auto z-50">
    <div class="flex-1" />
    <a href="/">
      <WebsiteLogo />
    </a>
    <nav class="flex-1 flex justify-end">
      <div
        v-for="nav in navigation"
        :key="nav.name"
      >
        <UTooltip
          v-if="!nav.adminOnly || (nav.adminOnly && loggedIn)"
          :text="nav.name"
        >
          <UButton
            :icon="nav.icon"
            :target="nav.openInNewTab ? '_blank' : undefined"
            :to="nav.href"
            :variant="nav.variantOverride || 'ghost'"
            class="aspect-square justify-center m-2"
          />
        </UTooltip>
      </div>

      <UTooltip
        text="Toggle dark mode"
      >
        <UButton
          :icon="$colorMode.preference === 'dark' ? Icons.theme.dark : Icons.theme.light"
          class="aspect-square justify-center m-2"
          variant="ghost"
          @click="$colorMode.preference = $colorMode.preference === 'dark' ? 'light' : 'dark'"
        />
      </UTooltip>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'

const { loggedIn } = useUserSession()

const navigation: {
  name: string
  href: string
  icon: string
  variantOverride?: string
  openInNewTab?: boolean
  adminOnly?: boolean
}[] = [
  { name: 'Home', href: '/', icon: Icons.home.icon },
  { name: 'Photography', href: '/photography', icon: Icons.photography.icon },
  { name: 'Projects & Experience', href: '/projects', icon: Icons.projects.icon },
  { name: 'Lab', href: '/lab', icon: Icons.lab.icon },
  { name: 'Blog', href: '/blog', icon: Icons.blog.icon },
  { name: 'GitHub', href: 'https://www.github.com/Neikow', icon: Icons.socials.github, openInNewTab: true },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'i-mdi-view-dashboard-outline',
    variantOverride: 'solid',
    adminOnly: true,
  },
]
</script>
