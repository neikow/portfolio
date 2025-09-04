<template>
  <div class="grid-bg min-h-screen grid ml-60">
    <aside class="bg-default border border-transparent border-r-default fixed top-0 left-0 h-full w-60 p-4">
      <h1 class="text-2xl font-bold mb-4">
        Dashboard
      </h1>

      <nav class="flex flex-col">
        <UButton
          color="neutral"
          to="/dashboard"
          variant="ghost"
        >
          Home
        </UButton>
        <UButton
          color="neutral"
          to="/dashboard/gallery"
          variant="ghost"
        >
          Gallery
        </UButton>
      </nav>
    </aside>
    <main>
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
</script>
