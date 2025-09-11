<template>
  <div class="grid-bg min-h-screen grid ml-60">
    <aside
      class="bg-default border border-transparent border-r-default flex flex-col fixed top-0 left-0 h-full w-60 p-4"
    >
      <div class="flex-1">
        <h1 class="text-2xl font-bold mb-4">
          Dashboard
        </h1>
        <UButton
          class="w-full"
          icon="i-mdi-arrow-back"
          to="/"
          variant="ghost"
        >
          Back to site
        </UButton>

        <div class="border-b border-b-default my-2" />

        <nav class="flex flex-col">
          <UButton
            color="neutral"
            icon="i-mdi-house"
            to="/dashboard"
            variant="ghost"
          >
            Home
          </UButton>
          <UButton
            color="neutral"
            icon="i-mdi-image-multiple"
            to="/dashboard/gallery"
            variant="ghost"
          >
            Gallery
          </UButton>
          <UButton
            color="neutral"
            icon="i-mdi-post"
            to="/dashboard/blog-posts"
            variant="ghost"
          >
            Blog Posts
          </UButton>
        </nav>
      </div>
      <AuthState v-slot="{ clear }">
        <UButton
          color="error"
          icon="i-mdi-logout"
          size="sm"
          variant="ghost"
          @click="() => {
            clear();
          }"
        >
          Logout
        </UButton>
      </AuthState>
    </aside>
    <main>
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
</script>
