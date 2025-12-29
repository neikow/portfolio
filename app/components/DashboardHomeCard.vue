<template>
  <div class="flex flex-col border border-default rounded-lg bg-default p-4 gap-4 items-start justify-between">
    <div class="w-full flex-col gap-4">
      <h2 class="text-xl font-semibold mb-2">
        {{ title }}
      </h2>

      <div
        v-if="stats && stats.length > 0"
        :class="['grid w-full gap-4', {
          'grid-cols-1': stats.length === 1,
          'grid-cols-2': stats.length >= 2,
        }]"
      >
        <div
          v-for="stat in stats"
          :key="title + '-' + stat.label"
          class="flex flex-col gap-1 items-center w-full border rounded-md border-default p-4"
        >
          <strong class="text-2xl font-bold">{{ stat.value }}</strong>
          <span class="text-toned">{{ stat.label }}</span>
        </div>
      </div>

      <div
        v-if="$slots.default"
        class="w-full mt-4"
      >
        <slot name="default" />
      </div>
    </div>

    <div
      v-if="$slots.actions"
      class="w-full"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  stats?: Stat[]
}>()

export interface Stat {
  label: string
  value: string | number | null | undefined
}
</script>
