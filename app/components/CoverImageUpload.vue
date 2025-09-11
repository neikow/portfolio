<template>
  <div
    v-if="coverUrl"
    class="w-full aspect-[3/1] relative"
  >
    <img
      :src="coverUrl"
      alt="Cover Picture"
      class="rounded-md w-full h-full object-cover"
    >

    <UButton
      :icon="Icons.actions.delete"
      class="absolute bottom-2 right-2"
      color="error"
      @click="coverUrl = ''"
    />
  </div>

  <UFileUpload
    v-else
    v-model="coverPictureFile"
    class="w-full aspect-[3/1]"
    variant="button"
  />
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'

const coverUrl = defineModel<string>('url')

const coverPictureFile = ref<File | null>(null)

watch(coverPictureFile, async (newFile) => {
  if (newFile) {
    const url = await uploadToServer(newFile)
    coverUrl.value = url
  }
})

async function uploadToServer(file: File) {
  const formData = new FormData()
  formData.append('cover', file)

  try {
    const res = await $fetch('/api/blog/upload-media', {
      method: 'POST',
      body: formData,
    })

    return res.href
  }
  catch (e) {
    console.error(e)
    throw new Error('Unable to upload image to server.')
  }
}
</script>
