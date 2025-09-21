<script lang="ts" setup>
import ExperienceShowcaseCard from '~/components/ExperienceShowcaseCard.vue'

useSeoMeta({
  title: 'Projects & Experience',
  description: 'A collection of my projects & work experience.',
  ogType: 'website',
  ogTitle: 'Projects & Experience - lysen.dev',
  ogDescription: 'A collection of my projects & work experience.',
  ogUrl: 'https://lysen.dev/projects',
  ogSiteName: 'lysen.dev',
  ogLocale: 'en_US',
})

const { data: experiences, status } = await useFetch('/api/experiences', {
  method: 'GET',
})
</script>

<template>
  <div class="text-center flex flex-col items-center w-full">
    <PageTitle title="Projects & Experience" />
    <section class="w-full max-w-2xl mx-auto mt-12 mb-16 px-4">
      <h2 class="text-2xl font-bold mb-6 text-left text-toned">
        Work Experience
      </h2>
      <div
        v-if="status === 'pending'"
        class="text-center py-8"
      >
        Loading...
      </div>
      <div
        v-else-if="experiences && experiences.length === 0"
        class="text-muted text-center py-8"
      >
        <EmptyState
          description="There is nothing to display at the moment."
          icon="mdi-briefcase-off-outline"
          title="No Experiences Found"
        />
      </div>
      <div
        v-else
        class="flex flex-col gap-6"
      >
        <ExperienceShowcaseCard
          v-for="experience in experiences"
          :key="experience.id"
          :experience="experience"
        />
      </div>
    </section>
  </div>
</template>
