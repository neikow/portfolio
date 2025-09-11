<script lang="ts" setup>
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
    <h1
      class="text-4xl font-black text-center my-8"
    >
      Blog Posts
    </h1>

    <div v-if="error">
      Error: {{ error.statusMessage || 'An error occurred' }}
    </div>
    <nav
      v-else-if="posts"
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
