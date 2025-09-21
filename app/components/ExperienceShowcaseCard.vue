<template>
  <div
    class="group flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 p-4 rounded-xl border border-default bg-default shadow-sm hover:shadow-lg transition"
  >
    <img
      v-if="experience.logoUrl"
      :alt="experience.company + ' logo'"
      :src="experience.logoUrl"
      class="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded-lg flex-shrink-0"
    >
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Experience } from '#shared/schemas/experience'

defineProps<{ experience: Experience }>()

function formatDate(date: string) {
  const d = new Date(date)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
}
</script>
