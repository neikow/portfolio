<script lang='ts' setup>
defineProps<{
  title?: string
  description?: string
  icon?: string
}>()
</script>

<template>
  <div class="text-dimmed text-center flex flex-col items-center justify-center w-full mt-32">
    <div
      v-if="icon"
      class="mb-4 text-6xl"
    >
      <UIcon :name="icon" />
    </div>
    <h2 class="text-2xl font-semibold mb-2">
      {{ title || 'No Content Available' }}
    </h2>
    <p class="text-base max-w-md">
      {{ description || 'There is currently no content to display here. Please check back later.' }}
    </p>
  </div>
</template>
