<template>
  <div>
    <DashboardHeader>
      <template #title>
        Blog Posts
      </template>

      <template #actions>
        <UButton
          icon="i-mdi-plus"
          to="/dashboard/blog-posts/create"
        >
          New Post
        </UButton>
      </template>
    </DashboardHeader>
  </div>
</template>

<script lang="ts" setup>
import DashboardHeader from '~/components/DashboardHeader.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated'],
})
</script>
