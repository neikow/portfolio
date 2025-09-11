<template>
  <div class="relative">
    <UForm
      :schema="formSchema"
      :state="formData"
      :validate="validate"
      @error="console.log($event)"
      @submit="publishPost"
    >
      <DashboardHeader back-button-to="/dashboard/blog-posts">
        <template #title>
          New Post
        </template>

        <template #actions>
          <div
            :class="{ 'flex gap-2 items-center text-dimmed transition-opacity': true, 'opacity-0': !saving, 'opacity-100': saving }"
          >
            <UIcon
              class="animate-spin"
              name="i-mdi-loading"
            />
            <p class="text-sm">
              Saving...
            </p>
          </div>

          <UButton
            color="error"
            icon="i-mdi-eraser"
            variant="soft"
            @click="formData.content = DEFAULT_CONTENT"
          >
            Clear
          </UButton>

          <UButton
            color="primary"
            icon="i-mdi-eye"
            type="submit"
          >
            Preview
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
                  .../blog/{{ slugify(formData.title) }}
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
  </div>
</template>

<script lang="ts" setup>
import DashboardHeader from '~/components/DashboardHeader.vue'
import { useStorage } from '@vueuse/core'
import debounce from 'debounce'
import slugify from 'slugify'
import CoverImageUpload from '~/components/CoverImageUpload.vue'
import { z } from 'zod'
import type { NewBlogPost } from '#shared/types/blog'

const DEFAULT_CONTENT = `<h1>Hello World!</h1><p>This is a rich text editor using TipTap.</p>`
const DESCRIPTION_MAX_LENGTH = 255

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.').max(DESCRIPTION_MAX_LENGTH, `Description must be less than ${DESCRIPTION_MAX_LENGTH} characters.`),
  content: z.string().min(1, 'Content is required.'),
  tags: z.array(z.string()),
  coverImageUrl: z.string(),
})

const toast = useToast()
const router = useRouter()

type FormSchema = z.infer<typeof formSchema>

const newPost = useStorage<FormSchema>('new-post', {
  title: '',
  description: '',
  content: DEFAULT_CONTENT,
  tags: [],
  coverImageUrl: '',
})

const formData = reactive<FormSchema>(newPost.value)

const saving = ref(false)

const savePost = debounce((formData: FormSchema) => {
  newPost.value = formData
}, 500)

watch(formData, (formData) => {
  savePost(formData)
})

function validate() {
  const errors: { name: string, message: string }[] = []
  if (!formData.title.trim()) {
    errors.push({ name: 'title', message: 'Title is required.' })
  }
  if (!formData.description) {
    errors.push({ name: 'description', message: 'Description is required.' })
  }
  if (formData.description.length > DESCRIPTION_MAX_LENGTH) {
    errors.push({ name: 'description', message: `Description must be less than ${DESCRIPTION_MAX_LENGTH} characters.` })
  }
  if (!formData.content || formData.content === DEFAULT_CONTENT) {
    errors.push({ name: 'content', message: 'Content is required.' })
  }
  if (!formData.coverImageUrl) {
    errors.push({ name: 'cover-image', message: 'Cover image is required.' })
  }

  return errors
}

async function publishPost() {
  const { slug, success } = await $fetch('/api/blog/posts', {
    method: 'POST',
    body: {
      ...formData,
      slug: slugify(formData.title),
    } satisfies NewBlogPost,
  })

  if (!success) {
    toast.add({
      title: 'Error',
      description: 'There was an error publishing your post. Please try again.',
      color: 'error',
    })

    return
  }

  await router.push(`/blog/${slug}`)
  toast.add({
    title: 'Success',
    description: 'Your post has been published successfully!',
    color: 'success',
  })
}

definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated'],
})
</script>
