<template>
  <div class="grid-bg min-h-screen grid ml-60">
    <aside
      class="bg-default border border-transparent border-r-default flex flex-col fixed top-0 left-0 h-full w-60 p-4"
    >
      <div class="flex-1">
        <h1 class="text-2xl font-bold mb-4">
          Dashboard
        </h1>
        <UButton
          :icon="Icons.ui.arrowBack"
          class="w-full"
          to="/"
          variant="ghost"
        >
          Back to site
        </UButton>

        <div class="border-b border-b-default my-2" />

        <nav class="flex flex-col gap-2">
          <UButton
            v-for="item in navigation"
            :key="item.name"
            :icon="item.icon"
            :to="item.href"
            color="neutral"
            variant="ghost"
          >
            {{ item.name }}
          </UButton>
        </nav>
      </div>
      <AuthState v-slot="{ clear }">
        <UButton
          :icon="Icons.ui.logOut"
          color="error"
          size="sm"
          variant="ghost"
          @click="clear()"
        >
          Logout
        </UButton>
      </AuthState>
    </aside>
    <main>
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'

const navigation: { name: string, href: string, icon: string }[] = [
  { name: 'Home', href: '/dashboard', icon: Icons.home.icon },
  { name: 'Experiences', href: '/dashboard/experiences', icon: Icons.experiences.dashboard },
  { name: 'Lab', href: '/dashboard/lab', icon: Icons.lab.dashboard },
  { name: 'Blog Posts', href: '/dashboard/blog-posts', icon: Icons.blog.dashboard },
]
</script>
