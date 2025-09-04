<template>
  <footer class="border-t border-t-default">
    <div class="flex container mx-auto justify-center p-4 bg-default">
      <span class="text-sm text-muted-foreground">
        © {{ currentYear }} Vitaly Lysen. All rights reserved.
      </span>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const currentYear = new Date().getFullYear()
</script>
