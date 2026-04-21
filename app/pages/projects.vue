<script lang="ts" setup>
import { SITE_URL } from '#shared/consts/urls'
import { Icons } from '#shared/consts/icons'
import { getOgImageUrl } from '#shared/utils/og'

const ogImage = getOgImageUrl('projects')

const { data: experiences, status } = await useFetch('/api/experiences', { method: 'GET' })
const { data: educations } = await useFetch('/api/education', { method: 'GET' })

const description = computed(() => {
  if (experiences.value && experiences.value.length > 0) {
    const roles = experiences.value.slice(0, 3).map(e => e.role).join(', ')
    return `Professional experience including roles as ${roles}. Explore the portfolio, academic background, and career journey of Vitaly Lysen.`
  }
  return 'Explore the professional work experience, education, and software development projects of Vitaly Lysen.'
})

useSeoMeta({
  title: 'Work Experience, Education & Projects | Vitaly Lysen',
  description: description,
  ogType: 'website',
  ogTitle: 'Vitaly Lysen - Experience & Education',
  ogDescription: description,
  ogUrl: `${SITE_URL}/projects`,
  ogSiteName: 'lysen.dev',
  ogLocale: 'en_US',
  ogImage,
  twitterCard: 'summary_large_image',
  twitterImage: ogImage,
})

useHead({ link: [{ rel: 'canonical', href: `${SITE_URL}/projects` }] })

useHead({
  script: [
    {
      type: 'application/ld+json',
      value: JSON.stringify([
        {
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
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          'name': 'Vitaly Lysen',
          'url': SITE_URL,
          'alumniOf': educations.value?.map(edu => ({
            '@type': 'EducationalOrganization',
            'name': edu.school,
            'url': edu.websiteUrl,
            'description': `${edu.degree} in ${edu.field}`,
          })),
        },
      ]),
    },
  ],
})
</script>

<template>
  <div class="text-center flex flex-col items-center w-full slide-enter-content">
    <PageTitle title="Projects & Experience" />

    <!-- Work Experience -->
    <section class="w-full max-w-2xl mx-auto mt-12 mb-16 px-4">
      <h2 class="text-2xl font-bold mb-6 text-left text-toned">
        Work Experience
      </h2>
      <div
        v-if="status === 'pending'"
        aria-live="polite"
        aria-atomic="true"
        class="text-center py-8"
      >
        <span>Loading…</span>
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

    <!-- Education & School Projects -->
    <section
      v-if="educations && educations.length > 0"
      class="w-full max-w-2xl mx-auto mb-16 px-4"
    >
      <h2 class="text-2xl font-bold mb-6 text-left text-toned">
        Education
      </h2>
      <div class="flex flex-col gap-6">
        <article
          v-for="edu in educations"
          :key="edu.id"
          class="group flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 p-4 rounded-xl border border-default bg-default shadow-sm hover:shadow-lg transition"
        >
          <img
            v-if="edu.logoUrl"
            :alt="edu.school + ' logo'"
            :src="edu.logoUrl"
            class="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded-lg flex-shrink-0"
            loading="lazy"
          >
          <div
            v-else
            aria-hidden="true"
            class="h-12 w-12 sm:h-16 sm:w-16 bg-inverted rounded-lg flex items-center justify-center text-muted text-xl sm:text-2xl"
          >
            <UIcon :name="Icons.education.icon" />
          </div>
          <div class="flex-1 flex flex-col items-center sm:items-start">
            <header class="flex flex-col sm:flex-row w-full justify-between items-center">
              <h3 class="font-semibold text-lg sm:text-xl text-highlighted text-start">
                {{ edu.degree }} in {{ edu.field }}
              </h3>
              <UButton
                v-if="edu.websiteUrl"
                :to="edu.websiteUrl"
                class="text-center w-min text-nowrap"
                rel="noopener noreferrer"
                size="xl"
                target="_blank"
                variant="link"
              >
                @{{ edu.school }}
              </UButton>
              <span
                v-else
                class="text-center w-min text-nowrap font-xl text-primary"
              >@{{ edu.school }}</span>
            </header>
            <div class="text-sm text-dimmed flex items-center gap-1">
              <time :datetime="edu.startDate">
                {{ new Date(edu.startDate).getFullYear() }}
              </time>
              <span>-</span>
              <time :datetime="edu.endDate || new Date().toISOString()">
                {{ edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present' }}
              </time>
            </div>
            <p
              v-if="edu.description"
              class="mt-2 text-default text-base text-center sm:text-justify leading-relaxed"
            >
              {{ edu.description }}
            </p>

            <!-- School Projects -->
            <div
              v-if="edu.schoolProjects && edu.schoolProjects.length"
              class="mt-4 w-full"
            >
              <h4 class="text-sm font-semibold text-muted mb-2 text-left">
                School Projects
              </h4>
              <ul class="flex flex-col gap-2">
                <li
                  v-for="project in edu.schoolProjects"
                  :key="project.name"
                  class="border border-default rounded-lg px-3 py-2 text-left"
                >
                  <div class="flex items-center gap-2">
                    <UIcon
                      :name="Icons.education.project"
                      class="text-muted flex-shrink-0"
                    />
                    <span class="font-medium text-sm">{{ project.name }}</span>
                    <UButton
                      v-if="project.url"
                      :icon="Icons.ui.externalLink"
                      :to="project.url"
                      color="neutral"
                      size="xs"
                      target="_blank"
                      variant="ghost"
                    />
                    <UButton
                      v-if="project.repoUrl"
                      :icon="Icons.socials.github"
                      :to="project.repoUrl"
                      color="neutral"
                      size="xs"
                      target="_blank"
                      variant="ghost"
                    />
                    <UButton
                      v-if="project.pdfUrl"
                      :to="project.pdfUrl"
                      color="neutral"
                      size="xs"
                      target="_blank"
                      variant="ghost"
                    >
                      <UIcon
                        class="text-error"
                        name="i-mdi-file-pdf-box"
                      />
                      Report
                    </UButton>
                  </div>
                  <p
                    v-if="project.description"
                    class="text-xs text-muted mt-1 ml-6"
                  >
                    {{ project.description }}
                  </p>
                  <div
                    v-if="project.tags && project.tags.length"
                    class="mt-1 ml-6 flex flex-wrap gap-1"
                  >
                    <UBadge
                      v-for="tag in project.tags"
                      :key="tag"
                      :label="tag"
                      color="neutral"
                      size="xs"
                      variant="subtle"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
