<script lang="ts" setup>
const route = useRoute()

const { data: page } = await useAsyncData('blog-' + route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <div class="blog-post">
    <div class="max-w-3xl mx-auto">
      <NuxtImg
        :src="page!.image"
        alt="Blog post image"
        class="w-full h-64 object-cover mb-6 rounded-lg shadow-lg"
      />
      <h1 class="text-4xl font-bold text-center text-balance mb-4">
        {{ page!.title }}
      </h1>
      <p class="text-dimmed mb-6">
        {{ page?.description }}
      </p>
      <div class="text-gray-600 dark:text-gray-400 mb-6 flex justify-center text-xs">
        <div v-if="page!.datePublished">
          Pub. {{ new Date(page!.datePublished).toLocaleDateString() }}&nbsp;
        </div>
        <div v-if="page!.dateEdited">
          | Upd. {{ new Date(page!.dateEdited).toLocaleDateString() }}
        </div>
      </div>
      <div class="flex justify-center items-center mb-6 gap-2">
        <UBadge
          v-for="tag in page!.tags"
          :key="tag"
          color="neutral"
          size="md"
          variant="outline"
        >
          #{{ tag }}
        </UBadge>
      </div>
    </div>
    <ContentRenderer
      v-if="page"
      :value="page"
    />
    <div class="max-w-3xl mx-auto">
      <ProseH2
        id="references"
        class="references"
      >
        References
      </ProseH2>

      <div
        v-for="ref in page!.refs"
        :key="ref.url"
        class="text-sm"
      >
        <UButton
          :href="ref.url"
          target="_blank"
          variant="link"
        >
          {{ ref.text || ref.url }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<style>
.blog-post {
  counter-reset: h2-counter;
}

.blog-post h2:not(.references) {
  counter-increment: h2-counter;
}

.blog-post h2:not(.references):before {
  content: counter(h2-counter, upper-roman) ". "
}
</style>
