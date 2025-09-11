<template>
  <div class="text-dimmed text-center flex items-center justify-center h-full w-full">
    <UnderConstruction />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated'],
})

useHead({
  title: 'Dashboard - lysen.dev',
})
</script>
