<script lang="ts" setup>
import { SITE_URL } from '#shared/consts/urls'
import { Icons } from '#shared/consts/icons'

const { data: experiences, status } = await useFetch('/api/experiences', {
  method: 'GET',
})

const description = computed(() => {
  if (experiences.value && experiences.value.length > 0) {
    const roles = experiences.value.slice(0, 3).map(e => e.role).join(', ')
    return `Professional experience including roles as ${roles}. Explore the portfolio and career journey of Vitaly Lysen.`
  }
  return 'Explore the professional work experience and software development projects of Vitaly Lysen.'
})

useSeoMeta({
  title: 'Work Experience & Software Projects | Vitaly Lysen',
  description: description,
  ogType: 'website',
  ogTitle: 'Vitaly Lysen - Professional Experience',
  ogDescription: description,
  ogUrl: `${SITE_URL}/projects`,
  ogSiteName: 'lysen.dev',
  ogLocale: 'en_US',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      value: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Work Experience of Vitaly Lysen',
        'itemListElement': experiences.value?.map((exp, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'Organization',
            'name': exp.company,
            'description': exp.description,
            'jobTitle': exp.role,
          },
        })),
      }),
    },
  ],
})
</script>

<template>
  <div class="text-center flex flex-col items-center w-full slide-enter-content">
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
          :icon="Icons.experiences.empty"
          description="There is nothing to display at the moment."
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
