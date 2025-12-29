<template>
  <div>
    <div
      :class="drag ? 'bg-elevated/25' : ''"
      class="flex flex-col h-64 gap-2 mb-4 overflow-y-auto border border-default rounded-md p-2"
    >
      <draggable
        v-model="images"
        class="grid grid-cols-3 gap-2"
        group="images"
        item-key="id"
        @end="drag=false"
        @start="drag=true"
      >
        <template #item="{ element: href, index }">
          <div class="flex justify-center items-center relative">
            <img
              :key="href"
              :alt="`Uploaded image ${index + 1}`"
              :src="href"
              class="h-24 object-cover rounded-md border border-default"
            >

            <UButton
              :icon="Icons.actions.delete"
              class="absolute bottom-1 right-1"
              color="error"
              size="xs"
              @click="() => {
                images.splice(index, 1)

              }"
            />
          </div>
        </template>
      </draggable>
    </div>
    <div>
      <UFileUpload
        v-model="uploadedFiles"
        accept="image/*"
        multiple
        size="sm"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { Icons } from '#shared/consts/icons'

const images = defineModel<string[]>('images', { required: true })

const uploadedFiles = ref<File[]>([])

const toast = useToast()

const uploading = ref(false)

watch(uploadedFiles, async (newFiles) => {
  if (newFiles.length > 0) {
    await handleNewFilesUpload(newFiles)
    uploadedFiles.value = []
  }
})

async function handleNewFilesUpload(files: File[]) {
  uploading.value = true
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('images', file)
  })

  const res = await $fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  res.uploads.forEach((upload) => {
    if (upload.success) {
      images.value.push(upload.href)
    }
    else {
      toast.add({ title: `Failed to upload ${upload.fileName}`, color: 'error' })
    }
  })

  uploading.value = false
}

const drag = ref(false)
</script>
