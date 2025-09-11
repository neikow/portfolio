<template>
  <div class="relative">
    <UForm
      :schema="formSchema"
      :state="formData"
      @submit="handleSubmit"
    >
      <DashboardHeader back-button-to="/dashboard/blog-posts">
        <template #title>
          Editing Post
        </template>

        <template #actions>
          <UButton
            :icon="Icons.blog.link"
            :to="`/blog/${post?.slug}`"
            color="primary"
            rel="noopener noreferrer"
            target="_blank"
            variant="link"
          >
            View Post
          </UButton>
          <UButton
            v-model="formData.published"
            :color="formData.published ? 'warning' : 'success'"
            :icon="formData.published ? Icons.actions.unpublish : Icons.actions.publish"
            loading-auto
            variant="soft"
            @click="handlePublishToggle"
          >
            {{ formData.published ? 'Unpublish' : 'Publish' }}
          </UButton>

          <UButton
            :icon="Icons.actions.save"
            color="primary"
            type="submit"
          >
            Save
          </UButton>
        </template>

        <template #toolbar>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-6">
            <div class="flex flex-col gap-2">
              <UFormField
                label="Title"
                name="title"
              >
                <UInput
                  v-model="formData.title"
                  class="w-full"
                  size="xl"
                />
                <span class="text-xs text-muted">
                  .../blog/{{ formData.slug }}
                </span>
              </UFormField>
              <UFormField
                label="Tags"
                name="tags"
              >
                <UInputTags
                  v-model="formData.tags"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Description"
                name="description"
              >
                <UTextarea
                  v-model="formData.description"
                  :maxlength="DESCRIPTION_MAX_LENGTH"
                  :ui="{ trailing: 'pointer-events-none' }"
                  aria-describedby="character-count"
                  class="w-full"
                >
                  <template #trailing>
                    <div
                      id="character-count"
                      aria-live="polite"
                      class="text-xs text-muted tabular-nums"
                      role="status"
                    >
                      {{ formData.description?.length }}/{{ DESCRIPTION_MAX_LENGTH }}
                    </div>
                  </template>
                </UTextarea>
              </UFormField>
            </div>
            <div>
              <UFormField
                label="Cover Picture"
                name="cover-image"
              >
                <CoverImageUpload v-model:url="formData.coverImageUrl" />
              </UFormField>
            </div>
          </div>
        </template>
      </DashboardHeader>

      <div>
        <TipTap
          v-model="formData.content"
          @input="(newContent: string) => formData.content = newContent"
        />
      </div>
    </UForm>
    <div class="bg-default flex justify-center items-center p-4 border-t border-default mt-4">
      <UModal>
        <UButton
          :icon="Icons.actions.delete"
          color="error"
          variant="soft"
        >
          Delete Post
        </UButton>

        <template #title>
          <h2 class="text-2xl font-black">
            Delete post ?
          </h2>
        </template>

        <template #body>
          <p class="text-center">
            Are you sure you want to delete this post?
          </p>
        </template>

        <template #footer>
          <div class="flex flex-row justify-end w-full gap-2">
            <UButton
              color="neutral"
              variant="ghost"
            >
              Cancel
            </UButton>
            <UButton
              :icon="Icons.actions.delete"
              color="error"
              loading-auto
              @click="deletePost"
            >
              Delete
            </UButton>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DashboardHeader from '~/components/DashboardHeader.vue'
import CoverImageUpload from '~/components/CoverImageUpload.vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { diff } from 'deep-object-diff'
import { useOnBeforeUnload } from '~/composables/useOnBeforeUnload'
import type { blogPostsTable } from '#shared/schemas/blogPost'
import { Icons } from '#shared/consts/icons'

useHead({
  title: 'Editing Blog Post - lysen.dev',
})

const DESCRIPTION_MAX_LENGTH = 255

const formSchema = z.object({
  id: z.number().min(1),
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.').max(DESCRIPTION_MAX_LENGTH, `Description must be less than ${DESCRIPTION_MAX_LENGTH} characters.`),
  content: z.string().min(1, 'Content is required.'),
  tags: z.array(z.string()),
  slug: z.string().min(1, 'Slug is required.'),
  coverImageUrl: z.string(),
  published: z.boolean(),
  publishedAt: z.string().nullable().optional(),
  editedAt: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
})

type FormData = z.infer<typeof formSchema>

defineShortcuts({
  meta_s: async (ev) => {
    ev.preventDefault()
    await handleSave(formData)
  },
})

const toast = useToast()
const { params } = useRoute()
const router = useRouter()
const postId = params.id as string

const { data: posts, refresh } = await useFetch(`/api/blog/posts?id=${postId}`)

const [post] = posts.value ?? []

useOnBeforeUnload(() => {
  if (!post) return undefined
  const changes = diff(post, formData) as Partial<FormData>
  delete changes.editedAt
  delete changes.published
  delete changes.publishedAt
  console.log(changes)
  return Object.keys(changes).length > 0 ? 'You have unsaved changes. Are you sure you want to leave?' : undefined
})

const formData = reactive<FormData>({
  id: post?.id ?? 0,
  title: post?.title ?? '',
  description: post?.description ?? '',
  slug: post?.slug ?? '',
  content: post?.content ?? '',
  tags: post?.tags ?? [],
  coverImageUrl: post?.coverImageUrl ?? '',
  published: post?.published ?? false,
  publishedAt: post?.publishedAt ?? null,
  editedAt: post?.editedAt ?? null,
  createdAt: post?.createdAt ?? null,
})

const patchPost = async (data: Partial<FormData>) => {
  delete data.editedAt
  const response = await fetch(`/api/blog/posts`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: Number(postId),
      ...data,
    } satisfies Partial<FormData>),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const result = await response.json() as {
    success: true
    post: typeof blogPostsTable.$inferSelect
  } | {
    success: false
    error: string
  }

  if (!result.success) {
    throw new Error(result.error)
  }

  return result.post
}

async function handleSubmit(event: FormSubmitEvent<FormData>) {
  await handleSave(event.data)
}

async function handleSave(data: FormData) {
  if (!post) {
    toast.add({
      title: 'Error',
      description: 'Original post data not found. Cannot save changes.',
      color: 'error',
      icon: Icons.ui.error,
    })
    return
  }

  const changes = diff(post, data) as Partial<FormData>

  if (Object.keys(changes).length === 0) {
    toast.add({
      title: 'No changes',
      description: 'No changes to save.',
      color: 'info',
      icon: Icons.ui.info,
    })
    return
  }

  for (const key in changes) {
    const _key = key as keyof FormData
    if (_key === 'tags') {
      changes['tags'] = data.tags
    }
  }

  try {
    const result = await patchPost(changes)
    Object.assign(formData, result)
    await refresh()
    toast.add({
      title: 'Success',
      description: 'Post updated successfully.',
      color: 'success',
      icon: Icons.ui.success,
    })
  }
  catch (error) {
    console.error(error)
    toast.add({
      title: 'Error',
      description: 'There was an error saving your changes. Please try again.',
      color: 'error',
      icon: Icons.ui.error,
    })
  }
}

async function handlePublishToggle() {
  const newPublishValue = (formData.published = !formData.published)

  try {
    const result = await patchPost({ published: newPublishValue })
    await refresh()
    Object.assign(formData, result)
    toast.add({
      title: 'Success',
      description: `Post has been ${newPublishValue ? 'published' : 'unpublished'}.`,
      color: 'success',
      icon: newPublishValue ? Icons.actions.publish : Icons.actions.unpublish,
    })
  }
  catch (error) {
    console.error(error)
    formData.published = !newPublishValue
    toast.add({
      title: 'Error',
      description: 'There was an error updating the post status. Please try again.',
      color: 'error',
      icon: Icons.ui.error,
    })
  }
}

async function deletePost() {
  if (!post) return

  try {
    const response = await fetch(`/api/blog/posts/${post.slug}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const result = await response.json() as {
      success: true
    } | {
      success: false
      error: string
    }

    if (!result.success) {
      throw new Error(result.error)
    }

    await router.push('/dashboard/blog-posts')
    toast.add({
      title: 'Success',
      description: 'Post deleted successfully.',
      color: 'success',
      icon: Icons.ui.success,
    })
  }
  catch (error) {
    console.error(error)
    toast.add({
      title: 'Error',
      description: 'There was an error deleting the post. Please try again.',
      color: 'error',
      icon: Icons.ui.error,
    })
  }
}

definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated'],
})
</script>
