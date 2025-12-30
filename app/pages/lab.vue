<script lang="ts" setup>
import { SITE_URL } from '#shared/consts/urls'
import { Icons } from '#shared/consts/icons'

useSeoMeta({
  title: 'Lab | Vitaly Lysen',
  description: 'The place where I experiment with new ideas and web technologies.',
  ogType: 'website',
  ogTitle: 'Vitaly Lysen - Lab',
  ogDescription: 'The place where I experiment with new ideas and web technologies.',
  ogUrl: `${SITE_URL}/lab`,
  ogSiteName: 'lysen.dev',
  ogLocale: 'en_US',
})

const { data: experiments, status } = await useFetch('/api/lab/', {
  server: true,
})
</script>

<template>
  <div class="text-center flex flex-col items-center w-full slide-enter-content">
    <PageTitle
      title="Lab"
    />
    <p class="text-default max-w-md">
      My interactive web-dev experiments and small projects, that can run directly in your browser.
    </p>
    <div
      v-if="status === 'pending'"
      class="text-center py-8"
    >
      Loading...
    </div>
    <div
      v-else-if="experiments && experiments.length === 0"
      class="text-muted text-center py-8"
    >
      <EmptyState
        :icon="Icons.lab.empty"
        description="There is nothing to display at the moment."
        title="No Experiments Found"
      />
    </div>
    <div
      v-else
      class="max-w-2xl grid grid-cols-1 md:grid-cols-2 mt-4"
    >
      <div
        v-for="experiment in experiments"
        :key="experiment.id"
        class="m-4 p-4 border border-default bg-default rounded-lg hover:shadow-lg transition-shadow"
      >
        <div>
          <img
            v-if="experiment.pictures && experiment.pictures.length > 0"
            :alt="`Preview for ${experiment.name}`"
            :src="experiment.pictures[0]"
            class="w-full h-24 md:h-32 lg:h-48 object-cover rounded-md mb-4"
          >
        </div>

        <h3 class="text-2xl font-bold mb-2">
          {{ experiment.name }}
        </h3>
        <div class="mb-2 flex items-center justify-center gap-2 flex-wrap">
          <UBadge
            v-for="tag in experiment.tags"
            :key="tag"
            size="sm"
            variant="soft"
          >
            {{ tag }}
          </UBadge>
        </div>

        <p class="mb-4 text-sm">
          {{ experiment.description }}
        </p>
        <div class="flex gap-2 w-full justify-center flex-wrap">
          <UButton
            v-if="experiment.url"
            :href="experiment.url"
            :icon="Icons.ui.externalLink"
            size="xs"
            target="_blank"
          >
            Live Demo
          </UButton>
          <UButton
            v-if="experiment.repoUrl"
            :href="experiment.repoUrl"
            :icon="Icons.socials.github"
            size="xs"
            target="_blank"
          >
            Repository
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
