<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'

const { loggedIn } = useUserSession()

useSeoMeta({
  title: 'Login',
  description: 'Login with GitHub to access the website dashboard.',
})
</script>

<template>
  <div class="w-full h-full flex items-center justify-center mt-32">
    <UCard>
      <template #header>
        <h2 class="font-black text-2xl">
          Dashboard
        </h2>
      </template>

      <template #default>
        <p class="mb-4 max-w-64">
          Please login with GitHub to access the website dashboard.
        </p>
        <UButton
          v-if="!loggedIn"
          :icon="Icons.socials.github"
          autofocus
          color="neutral"
          external
          label="Login with GitHub"
          size="md"
          to="/api/auth/github"
        />
      </template>
    </UCard>
  </div>
</template>
