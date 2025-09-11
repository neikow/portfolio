<template>
  <h1
    class="text-4xl font-black text-highlighted text-center my-8"
  >
    {{ title }}
  </h1>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>
