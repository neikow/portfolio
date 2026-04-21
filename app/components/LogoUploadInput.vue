<template>
  <div class="flex items-center gap-3">
    <div class="h-14 w-14 flex-shrink-0 border border-default rounded-lg overflow-hidden flex items-center justify-center bg-elevated">
      <img
        v-if="modelValue"
        :alt="alt"
        :src="modelValue"
        class="h-full w-full object-contain"
      >
      <UIcon
        v-else
        :name="placeholderIcon"
        class="text-muted text-2xl"
      />
    </div>

    <div class="flex-1 flex flex-col gap-1">
      <UFileUpload
        v-model="uploadedFile"
        :disabled="uploading"
        accept="image/*"
        size="sm"
      />
      <p
        v-if="uploading"
        class="text-xs text-muted"
      >
        Uploading...
      </p>
      <UButton
        v-if="modelValue"
        :icon="Icons.actions.delete"
        color="error"
        size="xs"
        variant="ghost"
        @click="$emit('update:modelValue', '')"
      >
        Remove
      </UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'

withDefaults(defineProps<{
  modelValue: string
  alt?: string
  placeholderIcon?: string
}>(), {
  alt: 'Logo',
  placeholderIcon: Icons.ui.info,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const toast = useToast()
const uploading = ref(false)
const uploadedFile = ref<File | null>(null)

watch(uploadedFile, async (file) => {
  if (!file) return

  uploading.value = true
  const formData = new FormData()
  formData.append('images', file)

  try {
    const res = await $fetch('/api/upload', { method: 'POST', body: formData })
    const upload = res.uploads[0]
    if (upload?.success) {
      emit('update:modelValue', upload.href)
    }
    else {
      toast.add({ title: 'Upload failed', color: 'error', icon: Icons.ui.error })
      console.error('Upload failed', res)
    }
  }
  catch (error) {
    toast.add({ title: 'Upload failed', color: 'error', icon: Icons.ui.error })
    console.error(error)
  }
  finally {
    uploading.value = false
    uploadedFile.value = null
  }
})
</script>
