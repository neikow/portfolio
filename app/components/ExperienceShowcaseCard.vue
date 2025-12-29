<template>
  <article
    :id="generateExperienceHtmlId(experience)"
    class="group flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 p-4 rounded-xl border border-default bg-default shadow-sm hover:shadow-lg transition"
  >
    <img
      v-if="experience.logoUrl"
      :alt="experience.company + ' logo'"
      :src="experience.logoUrl"
      class="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded-lg flex-shrink-0"
      loading="lazy"
    >
    <div
      v-else
      aria-hidden="true"
      class="h-12 w-12 sm:h-16 sm:w-16 bg-inverted rounded-lg flex items-center justify-center text-muted text-xl sm:text-2xl"
    >
      <UIcon :name="Icons.experiences.dashboard" />
    </div>
    <div class="flex-1 flex flex-col items-center sm:items-start">
      <header class="flex flex-col sm:flex-row w-full justify-between items-center">
        <h3 class="font-semibold text-lg sm:text-xl text-highlighted">
          {{ experience.role }}
        </h3>
        <UButton
          :to="experience.companyUrl || '#'"
          class="text-center w-min text-nowrap"
          rel="noopener noreferrer"
          size="xl"
          target="_blank"
          variant="link"
        >
          @{{ experience.company }}
        </UButton>
      </header>
      <div class="text-sm text-dimmed flex items-center gap-1">
        <time :datetime="experience.startDate">
          {{ formatDate(experience.startDate) }}
        </time>
        <span>-</span>
        <time :datetime="experience.endDate || new Date().toISOString()">
          {{ experience.endDate ? formatDate(experience.endDate) : 'Present' }}
        </time>
      </div>
      <p class="mt-2 text-default text-base text-center sm:text-justify leading-relaxed">
        {{ experience.description }}
      </p>
      <footer>
        <ul
          aria-label="Technologies used"
          class="mt-1 flex flex-wrap"
        >
          <li
            v-for="(tech, index) in experience.technologies"
            :key="`tech-${index}`"
            class="bg-accent/10 text-accent px-1 py-1 rounded-full text-sm"
          >
            <UTooltip>
              <img
                :alt="tech"
                :src="getTechnologyWithVersionIconUrl(tech)"
                class="w-6 h-6 p-1 bg-white rounded-md"
                loading="lazy"
              >
            </UTooltip>
          </li>
        </ul>
      </footer>
    </div>
  </article>
</template>

<script lang="ts" setup>
import type { Experience } from '#shared/schemas/experience'
import { Icons } from '#shared/consts/icons'
import { generateExperienceHtmlId } from '#shared/utils/experience'
import { getTechnologyWithVersionIconUrl } from '#shared/utils/technologies'
import { formatDate } from '#shared/utils/dateUtils'

defineProps<{ experience: Experience }>()
</script>
