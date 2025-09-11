<template>
  <div class="text-dimmed text-center flex items-center justify-center h-full w-full">
    <p>
      Such an empty place...
    </p>
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
