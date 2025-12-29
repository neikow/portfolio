<template>
  <main class="relative">
    <ErrorState
      v-if="error"
      description="An error occurred while fetching the blog post. Please try again later."
      title="Error loading blog post"
    />
    <div
      v-else-if="!post"
      class="flex justify-center py-20"
    >
      <span class="text-2xl font-bold animate-pulse">
        Loading...
      </span>
    </div>

    <article
      v-else
      class="px-4"
    >
      <div class="relative mt-4">
        <img
          :alt="`${post.title}-blurred`"
          :src="post.coverImageUrl"
          aria-hidden="true"
          class="blur-xl w-full max-h-96 object-cover opacity-60"
        >
        <img
          :alt="post.title"
          :src="post.coverImageUrl"
          class="rounded-md w-[90%] max-h-96 object-cover md:w-3xl lg:w-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md"
        >
      </div>
      <div class="prose dark:prose-invert mx-auto mt-4">
        <h1 class="text-5xl font-bold mb-4 text-center break-words">
          {{ post.title }}
        </h1>

        <div class="flex items-center justify-center gap-1 mt-2 mb-4">
          <UBadge
            v-for="tag in post.tags"
            :key="tag"
            class="font-bold"
            variant="soft"
          >
            #{{ tag }}
          </UBadge>
        </div>

        <div class="flex items-center justify-center gap-4">
          <UBadge
            :icon="Icons.blog.datePublished"
            variant="subtle"
          >
            <time :datetime="post.publishedAt || new Date().toISOString()">
              {{ formatDate(post.publishedAt ?? new Date()) }}
            </time>
          </UBadge>

          <UBadge
            v-if="post.editedAt && post.publishedAt && isSameDay(new Date(post.editedAt), new Date(post.publishedAt))"
            :icon="Icons.blog.dateEdited"
            variant="subtle"
          >
            <time :datetime="post.editedAt">
              Updated {{ formatDate(post.editedAt) }}
            </time>
          </UBadge>
        </div>

        <p class="text-center text-xl text-muted leading-relaxed">
          {{ post.description }}
        </p>
      </div>
      <div
        class="prose dark:prose-invert mx-auto mt-10"
      >
        <section
          class="slide-enter-content
          prose-headings:text-highlighted
          prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-4
          prose-h3:text-2xl prose-h3:mt-8
          prose-a:text-primary prose-a:underline
          prose-img:rounded-xl
          pb-32"
          v-html="post.content"
        />
      </div>
    </article>
    <div
      v-if="loggedIn && post"
      class="fixed bottom-4 right-4 flex items-center"
    >
      <UBadge
        v-if="!post.published"
        :icon="Icons.wip.icon"
        class="mr-2"
        color="warning"
        size="md"
      >
        WIP
      </UBadge>
      <UButton
        :icon="Icons.actions.edit"
        :to="`/dashboard/blog-posts/${post.id}`"
      />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'
import { SITE_URL } from '#shared/consts/urls'
import { formatDate } from '#shared/utils/dateUtils'

const { params } = useRoute()
const { slug } = params
const { loggedIn } = useUserSession()

if (!slug) {
  throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
}
const { data: post, error } = await useFetch(`/api/blog/posts/${slug}`, {
  method: 'GET',
})

watchEffect(() => {
  if (post.value) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          value: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': post.value.title,
            'image': [post.value.coverImageUrl],
            'datePublished': post.value.publishedAt || post.value.createdAt,
            'dateModified': post.value.editedAt || post.value.publishedAt || post.value.createdAt,
            'author': [{
              '@type': 'Person',
              'name': 'Vitaly Lysen',
              'url': SITE_URL,
            }],
            'description': post.value.description,
          }),
        },
      ],
    })
  }
})

useSeoMeta({
  title: post.value ? post.value.title : 'Loading... | Vitaly Lysen',
  description: post.value ? post.value.description : 'Loading blog post...',
  author: 'Vitaly Lysen',
  articleTag: post.value ? post.value.tags : [],
  articleAuthor: ['Vitaly Lysen'],
  articleModifiedTime: post.value && post.value.editedAt ? new Date(post.value.editedAt).toISOString() : undefined,
  articlePublishedTime: post.value && post.value.publishedAt ? new Date(post.value.publishedAt).toISOString() : undefined,
  ogUrl: post.value ? `${SITE_URL}/blog/${post.value.slug}` : undefined,
  ogSiteName: 'lysen.dev Blog',
  ogLocale: 'en_US',
  ogType: 'article',
  ogTitle: post.value ? post.value.title : 'Loading...',
  ogDescription: post.value ? post.value.description : 'Loading blog post...',
  ogImage: post.value ? `${SITE_URL}/${post.value.coverImageUrl}` : undefined,
})
</script>
