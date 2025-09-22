<template>
  <div
    class="flex flex-col sm:flex-row border border-default rounded-lg bg-default p-4 gap-4 items-start"
  >
    <img
      v-if="experience.logoUrl"
      :alt="experience.name"
      :src="experience.logoUrl"
      class="h-12 w-12 sm:h-16 sm:w-16 object-contain flex-shrink-0"
    >
    <div
      v-else
      class="h-12 w-12 sm:h-16 sm:w-16 bg-inverted rounded-lg flex items-center justify-center text-inverted text-xl sm:text-2xl flex-shrink-0"
    >
      <UIcon :name="Icons.experiences.dashboard" />
    </div>
    <div class="flex flex-col md:flex-row w-full gap-2">
      <div class="w-full sm:w-48 flex flex-col gap-1">
        <h3 class="font-bold text-base md:text-lg text-balance">
          {{ experience.name }}
        </h3>
        <p class="text-sm">
          {{ experience.role }} at
          <a
            v-if="experience.companyUrl"
            :href="experience.companyUrl"
            class="underline-link"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ experience.company }}
          </a>
          <span v-else>
            {{ experience.company }}
          </span>
        </p>
      </div>
      <div class="flex-1">
        <div class="text-muted text-sm flex gap-1 items-center">
          <UIcon :name="Icons.ui.calendar" />
          <p>
            {{ df.format(new Date(experience.startDate)) }}
            -
            {{ experience.endDate ? df.format(new Date(experience.endDate)) : 'Present' }}
          </p>
        </div>
        <p class="mt-2 text-sm">
          {{ experience.description }}
        </p>
      </div>
    </div>
    <div
      class="flex flex-row sm:flex-col gap-2 mt-2 sm:mt-0"
    >
      <UButton
        :icon="Icons.actions.edit"
        @click="emitEdit"
      />
      <UButton
        :icon="Icons.actions.delete"
        color="error"
        @click="emitDelete"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Experience } from '#shared/schemas/experience'
import { DateFormatter } from '@internationalized/date'
import { Icons } from '#shared/consts/icons'

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const props = defineProps<{
  experience: Experience
}>()
const emit = defineEmits<{
  (e: 'edit' | 'delete', id: number): void
}>()

function emitEdit() {
  emit('edit', props.experience.id)
}

function emitDelete() {
  emit('delete', props.experience.id)
}
</script>
