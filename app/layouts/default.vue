<template>
  <div>
    <a
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded"
      href="#main-content"
    >Skip to main content</a>
    <div class="grid-bg min-h-screen">
      <WebsiteHeader />
      <div id="main-content">
        <slot />
      </div>
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
