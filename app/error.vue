<script lang="ts" setup>
import type { NuxtError } from '#app'
import { Icons } from '#shared/consts/icons'

defineProps({
  error: Object as () => NuxtError,
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <div class="flex flex-col w-full items-center justify-center h-[70vh]">
        <h1 class="font-black text-9xl mb-4">
          {{ error?.statusCode }}
        </h1>
        <p class="mb-8">
          {{ error?.message || 'An unexpected error occurred.' }}
        </p>
        <UButton
          :icon="Icons.ui.arrowBack"
          to="/"
        >
          Go back home
        </UButton>
      </div>
    </NuxtLayout>
  </UApp>
</template>
