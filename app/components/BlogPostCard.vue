<template>
  <article
    :class="{
      'rounded-lg bg-default hover:shadow-lg hover:-translate-y-1 transition duration-200 ease-in-out active:scale-95 shadow-md': true,
      'border-2 border-warning border-dashed': !post.published,
      'border border-default': post.published,
    }"
  >
    <NuxtLink
      :aria-labelledby="`post-title-${post.id}`"
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
            <time :datetime="post.publishedAt || new Date().toISOString()">
              {{ formatDate(post.publishedAt ?? new Date()) }}
            </time>
          </UBadge>

          <UBadge
            v-if="post.editedAt && post.publishedAt && isSameDay(new Date(post.editedAt), new Date(post.publishedAt))"
            :icon="Icons.blog.dateEdited"
            color="neutral"
            variant="soft"
          >
            <time :datetime="post.editedAt">
              {{ formatDate(post.editedAt ?? new Date()) }}
            </time>
          </UBadge>
        </div>
      </div>
      <div class="px-4">
        <h3 class="text-xl md:text-2xl lg:text-3xl font-bold mb-1 text-balance">
          {{ post.title }}
        </h3>
        <div
          aria-label="Blog post tags"
          class="mb-2 flex flex-wrap gap-1"
        >
          <UBadge
            v-for="tag in post.tags"
            :key="tag"
            size="sm"
            variant="soft"
          >
            #{{ tag }}
          </UBadge>
        </div>
        <p class="text-toned text-sm mb-4">
          {{ post.description }}
        </p>
      </div>
    </NuxtLink>
  </article>
</template>

<script lang="ts" setup>
import type { blogPostsTable } from '#shared/schemas/blogPost'
import { Icons } from '#shared/consts/icons'
import { formatDate } from '#shared/utils/dateUtils'

defineProps<{
  post: typeof blogPostsTable.$inferSelect
  lazy?: boolean
}>()
</script>
