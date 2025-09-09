<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="border border-default bg-default rounded-lg"
  >
    <img
      :alt="post.title"
      :loading="lazy ? 'lazy' : 'eager'"
      :src="post.coverImageUrl"
      class="w-full h-48 object-cover mb-4 rounded-t-lg"
    >
    <div class="px-4">
      <h2 class="text-xl md:text-2xl lg:text-3xl font-bold mb-1 text-balance">
        {{ post.title }}
      </h2>
      <div class="mb-2 flex flex-wrap gap-1">
        <UBadge
          v-for="tag in post.tags"
          :key="tag"
          size="sm"
          variant="soft"
        >
          @{{ tag }}
        </UBadge>
      </div>
      <p class="text-dimmed mb-4">
        {{ post.description }}
      </p>
    </div>

    <div class="flex items-center justify-end gap-4 py-2 px-4 text-dimmed text-xs border-t border-default">
      <div class=" flex items-center">
        <UIcon
          class="w-4 h-4 mr-2"
          name="i-mdi-calendar"
        />
        <span>{{ (post.publishedAt ? new Date(post.publishedAt) : new Date()).toLocaleDateString() }}</span>
      </div>
      <div
        v-if="post.editedAt && !isSameDay(post.editedAt!, post.publishedAt ? new Date(post.publishedAt) : new Date())"
        class="flex items-center"
      >
        <UIcon
          class="w-4 h-4 mr-2"
          name="i-mdi-edit"
        />
        <span>{{ new Date(post.editedAt).toLocaleDateString() }}</span>
      </div>
    </div>

  </NuxtLink>
</template>

<script lang="ts" setup>
import type { blogPostsTable } from '#shared/schemas/blogPost'
import { isSameDay } from '#shared/utils/dateUtils'

const props = defineProps<{
  post: typeof blogPostsTable.$inferSelect
  lazy?: boolean
}>()
</script>
