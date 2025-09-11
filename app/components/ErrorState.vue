<script lang='ts' setup>
import { Icons } from '#shared/consts/icons'

defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="text-error text-center flex flex-col items-center justify-center w-full mt-32">
    <div
      class="mb-4 text-6xl"
    >
      <UIcon :name="Icons.ui.error" />
    </div>
    <h2 class="text-2xl font-semibold mb-2">
      {{ title || 'An Error Occurred' }}
    </h2>
    <p class="text-base max-w-md">
      {{ description || 'Sorry, something went wrong while processing your request. Please try again later.' }}
    </p>
  </div>
</template>
