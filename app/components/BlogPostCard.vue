<template>
  <NuxtLink
    :class="{
      'bg-default rounded-lg transition duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1 active:scale-95 shadow-md': true,
      'border-2 border-warning border-dashed': !post.published,
      'border border-default': post.published,
    }"
    :to="`/blog/${post.slug}`"
  >
    <div class="w-full h-48 mb-4 relative">
      <img
        :alt="post.title"
        :loading="lazy ? 'lazy' : 'eager'"
        :src="post.coverImageUrl"
        class="w-full h-48 object-cover rounded-t-lg"
      >
      <div class="absolute bottom-2 right-2 flex gap-4">
        <UBadge
          :icon="Icons.blog.datePublished"
          color="neutral"
          variant="soft"
        >
          {{
            (post.publishedAt ? new Date(post.publishedAt) : new Date())?.toLocaleDateString()
          }}
        </UBadge>

        <UBadge
          v-if="post.editedAt && post.publishedAt && isSameDay(new Date(post.editedAt), new Date(post.publishedAt))"
          :icon="Icons.blog.dateEdited"
          color="neutral"
          variant="soft"
        >
          {{
            (post.editedAt ? new Date(post.editedAt) : new Date())?.toLocaleDateString()
          }}
        </UBadge>
      </div>
    </div>
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
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { blogPostsTable } from '#shared/schemas/blogPost'
import { Icons } from '#shared/consts/icons'

defineProps<{
  post: typeof blogPostsTable.$inferSelect
  lazy?: boolean
}>()
</script>
