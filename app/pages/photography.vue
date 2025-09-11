<template>
  <div class="mx-auto max-w-3xl mt-4 pb-16">
    <ClientOnly>
      <LazyInfiniteGallery />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Photography',
  description: 'A collection of my photography works.',
  ogType: 'website',
  ogTitle: 'Photography - lysen.dev',
  ogDescription: 'A collection of my photography works.',
  ogUrl: 'https://lysen.dev/photography',
  ogSiteName: 'lysen.dev',
  ogLocale: 'en_US',
})
</script>
