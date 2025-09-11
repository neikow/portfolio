<template>
  <div class="relative">
    <div v-if="error">
      <h1 class="text-2xl font-bold">
        Error: {{ error.message || 'Unknown Error' }}
      </h1>
      <p class="text-muted">
        Status Code: {{ error.statusCode || 'N/A' }}
      </p>
    </div>
    <div v-else-if="!post">
      <h1 class="text-2xl font-bold">
        Loading...
      </h1>
    </div>
    <div
      v-else
      class="px-4"
    >
      <div class="relative mt-4">
        <img
          :alt="post.title"
          :src="post.coverImageUrl"
          class="blur-xl w-full max-h-96 opacity-60"
        >
        <img
          :alt="`${post.title}-blurred`"
          :src="post.coverImageUrl"
          class="rounded-md w-[90%] md:w-3xl lg:w-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border shadow-md"
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
            @{{ tag }}
          </UBadge>
        </div>

        <div class="flex items-center justify-center gap-4">
          <UBadge
            icon="i-mdi-rocket-launch"
            variant="ghost"
          >
            {{
              (post.publishedAt ? new Date(post.publishedAt) : new Date())?.toLocaleDateString()
            }}
          </UBadge>

          <UBadge
            v-if="post.editedAt && post.publishedAt && isSameDay(new Date(post.editedAt), new Date(post.publishedAt))"
            icon="i-mdi-edit"
            variant="ghost"
          >
            {{
              (post.editedAt ? new Date(post.editedAt) : new Date())?.toLocaleDateString()
            }}
          </UBadge>
        </div>

        <p class="text-center">
          {{ post.description }}
        </p>
      </div>
      <div
        class="prose dark:prose-invert mx-auto mt-5"
      >
        <article
          class="slide-enter-content
          prose-h2:text-5xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-4xl prose-h3:mt-10 prose-h3:mb-6
          prose-h4:text-3xl prose-h4:mt-8 prose-h4:mb-6
          prose-h5:text-2xl prose-h5:mt-6 prose-h5:mb-4
          prose-h6:text-xl prose-h6:mt-4 prose-h6:mb-4
          pb-32"
          v-html="post.content"
        />
      </div>
    </div>
    <div
      v-if="loggedIn && post"
      class="fixed bottom-4 right-4 flex items-center"
    >
      <UBadge
        v-if="!post.published"
        class="mr-2"
        color="warning"
        icon="i-mdi-construction"
      >
        WIP
      </UBadge>
      <UButton
        :to="`/dashboard/blog-posts/${post.id}`"
        icon="i-mdi-edit"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { params } = useRoute()
const { slug } = params
const { loggedIn } = useUserSession()

if (!slug) {
  throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
}
const { data: post, error } = await useFetch(`/api/blog/posts/${slug}`, {
  method: 'GET',
})

useSeoMeta({
  title: post.value ? post.value.title : 'Loading...',
  description: post.value ? post.value.description : 'Loading blog post...',
  author: 'Vitaly Lysen',
  articleTag: post.value ? post.value.tags : [],
  articleAuthor: ['Vitaly Lysen'],
  articleModifiedTime: post.value && post.value.editedAt ? new Date(post.value.editedAt).toISOString() : undefined,
  articlePublishedTime: post.value && post.value.publishedAt ? new Date(post.value.publishedAt).toISOString() : undefined,
  ogUrl: post.value ? `https://lysen.dev/blog/${post.value.slug}` : undefined,
  ogSiteName: 'lysen.dev Blog',
  ogLocale: 'en_US',
  ogType: 'article',
  ogTitle: post.value ? post.value.title : 'Loading...',
  ogDescription: post.value ? post.value.description : 'Loading blog post...',
  ogImage: post.value ? post.value.coverImageUrl : undefined,
})
</script>
