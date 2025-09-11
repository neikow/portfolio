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
          :icon="$colorMode.preference === 'dark' ? 'i-mdi-white-balance-sunny' : 'i-mdi-weather-night'"
          class="aspect-square justify-center m-2"
          variant="ghost"
          @click="$colorMode.preference = $colorMode.preference === 'dark' ? 'light' : 'dark'"
        />
      </UTooltip>
    </nav>
  </header>
</template>

<script lang="ts" setup>
const { loggedIn } = useUserSession()

const navigation: {
  name: string
  href: string
  icon: string
  variantOverride?: string
  openInNewTab?: boolean
  adminOnly?: boolean
}[] = [
  { name: 'Home', href: '/', icon: 'i-mdi-home-outline' },
  { name: 'Photography', href: '/photography', icon: 'i-mdi-camera-outline' },
  { name: 'Projects & Experience', href: '/projects', icon: 'i-mdi-code' },
  { name: 'Lab', href: '/lab', icon: 'i-mdi-flask' },
  { name: 'Blog', href: '/blog', icon: 'i-mdi-blog-outline' },
  { name: 'GitHub', href: 'https://www.github.com/Neikow', icon: 'i-mdi-github', openInNewTab: true },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'i-mdi-view-dashboard-outline',
    variantOverride: 'solid',
    adminOnly: true,
  },
]
</script>
