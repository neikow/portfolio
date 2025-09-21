<script lang="ts" setup>
import { SITE_URL } from '#shared/consts/urls'

useSeoMeta({
  title: 'Lab',
  description: 'The place where I experiment with new ideas and web technologies.',
  ogType: 'website',
  ogTitle: 'Lab - lysen.dev',
  ogDescription: 'The place where I experiment with new ideas and web technologies.',
  ogUrl: `${SITE_URL}/lab`,
  ogSiteName: 'lysen.dev',
  ogLocale: 'en_US',
})
</script>

<template>
  <div class="text-dimmed text-center flex flex-col items-center w-full">
    <PageTitle title="Lab" />
    <div class="mt-32">
      <UnderConstruction />
    </div>
  </div>
</template>
