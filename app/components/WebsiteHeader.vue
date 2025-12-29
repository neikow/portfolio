<template>
  <header class="flex container mx-auto z-50">
    <div class="flex-1 hidden sm:block" />
    <NuxtLink
      class="mx-2"
      to="/"
    >
      <WebsiteLogo />
      <span class="sr-only">lysen.dev</span>
    </NuxtLink>
    <nav
      aria-label="Main Navigation"
      class="flex-1"
    >
      <ul class="flex justify-end items-center">
        <li
          v-for="nav in navigation"
          :key="nav.name"
          :class="{
            'hidden sm:block': nav.mobileHidden,
          }"
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
            >
              <span class="sr-only">{{ nav.name }}</span>
            </UButton>
          </UTooltip>
        </li>

        <li>
          <UTooltip
            text="Toggle dark mode"
          >
            <UButton
              :icon="$colorMode.preference === 'dark' ? Icons.theme.dark : Icons.theme.light"
              aria-label="Toggle dark mode"
              class="aspect-square justify-center m-2"
              variant="ghost"
              @click="$colorMode.preference = $colorMode.preference === 'dark' ? 'light' : 'dark'"
            />
          </UTooltip>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'
import { GITHUB_PROFILE } from '#shared/consts/urls'

const { loggedIn } = useUserSession()

const navigation: {
  name: string
  href: string
  icon: string
  variantOverride?: 'solid'
  openInNewTab?: boolean
  adminOnly?: boolean
  mobileHidden?: boolean
}[] = [
  { name: 'Home', href: '/', icon: Icons.home.icon, mobileHidden: true },
  { name: 'Photography', href: 'https://photography.lysen.dev', icon: Icons.photography.icon },
  { name: 'Projects & Experience', href: '/projects', icon: Icons.projects.icon },
  { name: 'Lab', href: '/lab', icon: Icons.lab.icon },
  { name: 'Blog', href: '/blog', icon: Icons.blog.icon },
  {
    name: 'GitHub',
    href: GITHUB_PROFILE,
    icon: Icons.socials.github,
    openInNewTab: true,
    mobileHidden: true,
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Icons.dashboard.icon,
    variantOverride: 'solid',
    adminOnly: true,
  },
]
</script>
