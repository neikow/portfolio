<template>
  <div class="w-full flex justify-between items-center mb-4 p-4 border-b border-b-default bg-default">
    <h2 class="font-black text-2xl">
      <slot name="title">
        Blog Posts
      </slot>
    </h2>

    <div />
    <slot name="actions" />
  </div>
</template>

<script lang="ts" setup>
</script>
