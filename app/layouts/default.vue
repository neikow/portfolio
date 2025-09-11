<template>
  <div>
    <div class="grid-bg min-h-screen">
      <WebsiteHeader />
      <slot />
    </div>
    <WebsiteFooter />
  </div>
</template>

<script lang="ts" setup>
defineShortcuts({
  'g-h': () => navigateTo('/'),
  'g-c': () => navigateTo('/photography'),
  'g-p': () => navigateTo('/projects'),
  'g-l': () => navigateTo('/lab'),
  'g-b': () => navigateTo('/blog'),
  'g-d': () => navigateTo('/dashboard'),
})
</script>
