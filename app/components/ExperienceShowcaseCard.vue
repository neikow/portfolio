<template>
  <div
    :id="generateExperienceHtmlId(experience)"
    class="group flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 p-4 rounded-xl border border-default bg-default shadow-sm hover:shadow-lg transition"
  >
    <img
      v-if="experience.logoUrl"
      :alt="experience.company + ' logo'"
      :src="experience.logoUrl"
      class="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded-lg flex-shrink-0"
    >
    <div
      v-else
      class="h-12 w-12 sm:h-16 sm:w-16 bg-inverted rounded-lg flex items-center justify-center text-muted text-xl sm:text-2xl"
    >
      <UIcon :name="Icons.experiences.dashboard" />
    </div>
    <div class="flex-1 flex flex-col items-center sm:items-start">
      <div class="flex flex-col sm:flex-row w-full justify-between items-center">
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
      </div>
      <div class="text-sm text-dimmed flex items-center gap-1">
        <span>
          {{ formatDate(experience.startDate) }} - {{ experience.endDate ? formatDate(experience.endDate) : 'Present' }}
        </span>
      </div>
      <p class="mt-2 text-default text-base text-center sm:text-justify leading-relaxed">
        {{ experience.description }}
      </p>
      <div>
        <ul class="mt-1 flex flex-wrap">
          <li
            v-for="(tech, index) in experience.technologies"
            :key="`tech-${index}`"
            class="bg-accent/10 text-accent px-1 py-1 rounded-full text-sm"
          >
            <UTooltip>
              <img
                :alt="`${tech} icon`"
                :src="getTechnologyWithVersionIconUrl(tech)"
                class="w-6 h-6 p-1 bg-white rounded-md"
              >
            </UTooltip>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Experience } from '#shared/schemas/experience'
import { Icons } from '#shared/consts/icons'
import { generateExperienceHtmlId } from '#shared/utils/experience'
import { getTechnologyWithVersionIconUrl } from '#shared/utils/technologies'

defineProps<{ experience: Experience }>()

function formatDate(date: string) {
  const d = new Date(date)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
}
</script>
