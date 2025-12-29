<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'
import ErrorState from '~/components/ErrorState.vue'
import { SITE_URL } from '#shared/consts/urls'

const { data: posts, error } = await useFetch('/api/blog/posts')

const description = computed(() => {
  if (posts.value?.length) {
    return `Explore ${posts.value.length} articles on software development, engineering, and technology by Vitaly Lysen.`
  }
  return 'Technical articles, tutorials, and thoughts on software engineering by Vitaly Lysen.'
})

useSeoMeta({
  title: 'Blog | Vitaly Lysen',
  description: description,
  ogType: 'website',
  ogTitle: 'Vitaly Lysen - Blog',
  ogDescription: description,
  ogUrl: `${SITE_URL}/blog`,
  ogSiteName: 'lysen.dev',
  ogLocale: 'en_US',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      value: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        'name': 'Vitaly Lysen\'s Blog',
        'url': `${SITE_URL}/blog`,
        'description': 'Technical blog about software development and engineering.',
        'author': {
          '@type': 'Person',
          'name': 'Vitaly Lysen',
        },
        'blogPost': posts.value?.map(post => ({
          '@type': 'BlogPosting',
          'headline': post.title,
          'url': `${SITE_URL}/blog/${post.slug}`,
          'datePublished': post.publishedAt,
        })),
      }),
    },
  ],
})
</script>

<template>
  <div class="slide-enter-content">
    <PageTitle title="Blog Posts" />

    <main class="max-w-2xl mx-auto">
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
        class="p-4 flex flex-col gap-4 slide-enter-content"
      >
        <BlogPostCard
          v-for="(post, index) in posts"
          :key="post.id"
          :lazy="index > 5"
          :post="post"
        />
      </nav>
      <div
        v-else
        aria-live="polite"
      >
        Loading...
      </div>
    </main>
  </div>
</template>
