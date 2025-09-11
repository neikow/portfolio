<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'
import ErrorState from '~/components/ErrorState.vue'

const { data: posts, error } = await useFetch('/api/blog/posts')

useSeoMeta({
  title: 'Blog',
  description: 'Read the latest articles and updates on my blog.',
  ogType: 'website',
  ogTitle: 'Blog - lysen.dev',
  ogDescription: 'Read the latest articles and updates on my blog.',
  ogUrl: 'https://lysen.dev/blog',
  ogSiteName: 'lysen.dev',
  ogLocale: 'en_US',
})
</script>

<template>
  <div>
    <PageTitle title="Blog Posts" />

    <div v-if="error">
      <ErrorState
        description="Error fetching blog posts. Please try again later."
        title="An error occured"
      />
    </div>
    <div
      v-if="posts && posts.length === 0"
      class="text-center text-dimmed"
    >
      <EmptyState
        :icon="Icons.blog.icon"
        description="No blog posts have been published yet. Please check back later."
        title="No Blog Posts"
      />
    </div>
    <nav
      v-else-if="posts && posts.length > 0"
      class="max-w-2xl mx-auto p-4 flex flex-col gap-4 slide-enter-content"
    >
      <BlogPostCard
        v-for="(post, index) in posts"
        :key="post.id"
        :lazy="index > 5"
        :post="post"
      />
    </nav>
    <div v-else>
      Loading...
    </div>
  </div>
</template>
