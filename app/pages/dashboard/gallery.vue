<script lang="ts" setup>
import InfiniteGallery from '~/components/InfiniteGallery.vue'

definePageMeta({
  layout: 'dashboard',
})

const fileUpload = ref<File[] | null | undefined>(null)
const uploadModalOpen = ref(false)

watch(uploadModalOpen, (newVal) => {
  if (!newVal) {
    fileUpload.value = null
  }
})

function handleImagesUpload() {
  if (!fileUpload.value || fileUpload.value.length === 0) {
    return
  }

  const formData = new FormData()
  for (let i = 0; i < fileUpload.value.length; i++) {
    formData.append('photos', fileUpload.value[i]!)
  }

  fetch('/api/gallery/photos', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(() => {
      uploadModalOpen.value = false
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
</script>

<template>
  <div>
    <div class="w-full flex justify-between items-center mb-4 p-4 border-b border-b-default bg-default">
      <h2 class="font-black text-2xl">
        Gallery
      </h2>

      <UModal
        v-model:open="uploadModalOpen"
      >
        <UButton icon="i-mdi-plus">
          Add images
        </UButton>

        <template #title>
          Upload images
        </template>

        <template #body>
          <UFileUpload
            v-model="fileUpload"
            accept="image/*"
            class="w-full min-h-48 cursor-pointer"
            description="PNG, JPG up to 10MB"
            label="Drop your images here"
            layout="list"
            multiple
          />
        </template>

        <template #footer>
          <div class="flex flex-row justify-end w-full gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              @click="uploadModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              color="primary"
              @click="handleImagesUpload"
            >
              Upload
            </UButton>
          </div>
        </template>
      </UModal>
    </div>

    <div class="p-5">
      <ClientOnly>
        <InfiniteGallery show-actions />
      </ClientOnly>
    </div>
  </div>
</template>
