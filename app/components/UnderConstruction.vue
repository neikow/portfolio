<template>
  <UCard class="text-center shadow-md border-warning border-2 border-dashed">
    <UIcon
      :name="Icons.wip.icon"
      class="h-20 w-20 m-2 text-warning"
    />
    <h2 class="font-bold text-2xl mt-1 mb-2 text-balance text-highlighted">
      This section is under construction
    </h2>
    <p>
      Please check back at a later date
    </p>
  </UCard>
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'
</script>
