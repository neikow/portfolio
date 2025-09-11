<template>
  <header class="relative">
    <div class="w-full flex justify-between items-center p-4 border-b border-b-default bg-default">
      <div class="flex items-center gap-4">
        <UButton
          v-if="backButtonTo"
          :icon="Icons.ui.arrowBack"
          :to="backButtonTo"
          class="p-2 rounded-full"
          variant="soft"
        />

        <h2 class="font-black text-2xl">
          <slot name="title">
            Dashboard Header
          </slot>
        </h2>
      </div>

      <div class="flex gap-2">
        <slot name="actions" />
      </div>
    </div>
    <div
      v-if="$slots.toolbar"
      class="mb-4 bg-default px-4 pt-2 pb-4 border-b border-b-default sticky top-0"
    >
      <slot name="toolbar" />
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'

defineProps<{
  backButtonTo?: string
}>()
</script>
