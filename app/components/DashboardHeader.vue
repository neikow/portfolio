<template>
  <header class="relative">
    <div class="w-full flex justify-between items-center p-4 border-b border-b-default bg-default">
      <h2 class="font-black text-2xl">
        <slot name="title">
          Blog Posts
        </slot>
      </h2>

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
</script>
