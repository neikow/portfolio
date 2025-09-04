<script lang="ts" setup>
const { data } = await useAsyncData('navigation', () => {
  return queryCollection('blog').where('published', '=', true).order('datePublished', 'DESC').all()
})
</script>

<template>
  <nav>
    <ul v-if="data">
      <li
        v-for="item in data"
        :key="item.path"
        class="max-w-2xl p-4 mx-auto"
      >
        <NuxtLink :to="item.path">
          <NuxtImg
            v-if="item.image"
            :src="item.image"
            alt="Blog post image"
            class="w-full h-64 object-cover rounded-lg shadow-sm mr-4"
          />
          <h2 class="text-2xl font-bold mb-2 mt-3 text-balance">
            {{ item.title }}
          </h2>
          <p v-if="item.description">
            {{ item.description }}
          </p>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
