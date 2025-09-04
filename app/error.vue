<script lang="ts" setup>
import type { NuxtError } from '#app'

const props = defineProps({
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
          icon="i-mdi-arrow-back"
          to="/"
        >
          Go back home
        </UButton>
      </div>
    </NuxtLayout>
  </UApp>
</template>
