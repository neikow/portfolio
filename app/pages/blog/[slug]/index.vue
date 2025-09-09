<template>
  <div>
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
    <div v-else>
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
        <h1 class="text-5xl font-bold mb-4 text-center">
          {{ post.title }}
        </h1>

        <div class="flex items-center justify-center gap-2 mt-2 mb-4">
          <UBadge
            v-for="tag in post.tags"
            :key="tag"
            variant="soft"
          >
            {{ tag }}
          </UBadge>
        </div>

        <div class="flex items-center justify-center gap-4">
          <div class="flex items-center">
            <UIcon
              class="text-muted"
              name="i-mdi-calendar"
            />
            <span class="text-muted text-xs ml-1">{{
              (post.publishedAt ? new Date(post.publishedAt) : new Date())?.toLocaleDateString()
            }}</span>
          </div>

          <div
            v-if="post.editedAt"
            class="flex items-center"
          >
            <UIcon
              class="text-muted"
              name="i-mdi-edit"
            />
            <span class="text-muted text-xs ml-1">{{
              (post.editedAt ? new Date(post.editedAt) : new Date())?.toLocaleDateString()
            }}</span>
          </div>
        </div>

        <p class="text-center">
          {{ post.description }}
        </p>
      </div>
      <div
        class="prose dark:prose-invert mx-auto mt-5"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          v-html="post.content"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { params } = useRoute()
const { slug } = params

if (!slug) {
  throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
}
const { data: post, error } = await useFetch(`/api/blog/posts/${slug}`, {
  method: 'GET',
})
</script>
