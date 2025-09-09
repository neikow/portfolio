<script lang="ts" setup>
const { data: posts, error } = await useFetch('/api/blog/posts')
</script>

<template>
  <div>
    <div v-if="error">
      Error: {{ error.statusMessage || 'An error occurred' }}
    </div>
    <nav
      v-else-if="posts"
      class="max-w-2xl mx-auto p-4"
    >
      <div
        v-for="(post, index) in posts"
        :key="post.id"
      >
        {{ post.title }}
      </div>
    </nav>
    <div v-else>
      Loading...
    </div>
  </div>
</template>
