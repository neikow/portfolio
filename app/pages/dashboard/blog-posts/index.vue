<template>
  <div>
    <DashboardHeader>
      <template #title>
        Blog Posts
      </template>

      <template #actions>
        <UButton
          :icon="Icons.actions.add"
          to="/dashboard/blog-posts/new"
        >
          New Post
        </UButton>
      </template>
    </DashboardHeader>

    <div v-if="posts && posts.length === 0">
      <EmptyState
        :icon="Icons.blog.dashboard"
        description="You haven't created any blog posts yet. Click the button below to create your first post."
        title="No blog posts yet"
      />
    </div>

    <div v-else-if="posts && posts.length > 0">
      <NuxtLink
        v-for="post in posts"
        :key="post.id"
        :to="`/dashboard/blog-posts/${post.id}`"
        class="flex items-start gap-4 p-2 bg-default border-b m-4 rounded-xl border border-default hover:-translate-y-0.5 transition-all"
      >
        <div class="h-24 aspect-[3/1] relative">
          <img
            :src="post.coverImageUrl"
            alt="Post Image"
            class="h-24 aspect-[3/1] object-cover rounded"
          >

          <div class="absolute bottom-2 left-2 flex gap-1">
            <UBadge
              v-for="tag in post.tags.slice(0, MAX_DISPLAYED_TAGS)"
              :key="tag"
              size="sm"
            >
              @{{ tag }}
            </UBadge>
            <UBadge
              v-if="post.tags.length > MAX_DISPLAYED_TAGS"
              size="sm"
            >
              +{{ post.tags.length - MAX_DISPLAYED_TAGS }} more
            </UBadge>
          </div>
        </div>

        <div class="w-full h-24 flex flex-col justify-between">
          <div class="flex-1 flex flex-col">
            <div class="w-full flex justify-between items-center">
              <h2 class="text-lg font-semibold mb-0.5 line-clamp-1">
                {{ post.title }}
              </h2>

              <UBadge
                :color="post.published ? 'success' : 'warning'"
                :icon="post.published ? Icons.blog.datePublished : Icons.wip.icon"
                class="text-sm"
                variant="soft"
              >
                {{ post.published ? 'Published' : 'Draft' }}
              </UBadge>

            </div>
            <p class="text-sm text-muted line-clamp-1">
              {{ post.description }}
            </p>
          </div>
          <div class="flex gap-2">
            <UBadge
              v-if="post.createdAt"
              :icon="Icons.blog.dateCreated"
              size="sm"
              variant="soft"
            >
              {{ new Date(post.createdAt).toLocaleDateString() }}
            </UBadge>
            <UBadge
              v-if="post.editedAt"
              :icon="Icons.blog.dateEdited"
              size="sm"
              variant="soft"
            >
              {{ new Date(post.editedAt).toLocaleDateString() }}
            </UBadge>
            <UBadge
              v-if="post.publishedAt"
              :icon="Icons.blog.datePublished"
              size="sm"
              variant="soft"
            >
              {{ new Date(post.publishedAt).toLocaleDateString() }}
            </UBadge>
          </div>
        </div>
      </NuxtLink>
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script lang="ts" setup>
import DashboardHeader from '~/components/DashboardHeader.vue'
import { Icons } from '#shared/consts/icons'

const MAX_DISPLAYED_TAGS = 3

const { data: posts } = await useFetch('/api/blog/posts')

useHead({
  title: 'Manage Blog Posts - lysen.dev',
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated'],
})
</script>
