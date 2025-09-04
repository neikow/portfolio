<template>
  <div class="flex max-w-xl mx-auto mt-20 mb-8">
    <h2
      :id="props.id"
      :class="{ 'text-start mx-0 wrap-normal text-4xl font-semibold': true, [props.class ?? '']: !!props.class }"
    >
      <slot />
    </h2>
    <UButton
      :icon="copyIcon"
      aria-label="Copy link to section"
      class="ml-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex cursor-pointer items-center transition-colors"
      variant="ghost"
      @click="copyLink"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  id: string
  class?: string
}>()

const toast = useToast()

const copyIcon = ref('i-lucide-anchor')

function copyLink() {
  const url = `${window.location.origin}${window.location.pathname}#${props.id}`

  copyIcon.value = 'i-lucide-check'
  setTimeout(() => {
    copyIcon.value = 'i-lucide-anchor'
  }, 1000)

  if (!navigator.clipboard) {
    toast.add({
      color: 'error',
      title: 'Clipboard not supported',
      icon: 'i-lucide-x',
      description: 'Your browser does not support the Clipboard API. Please copy the link manually.',
    })
    return
  }
  navigator.clipboard.writeText(url).then(() => {
    toast.add({
      color: 'success',
      title: 'Link copied!',
      icon: 'i-lucide-check',
      description: 'The link to this section has been copied to your clipboard.',
    })
  }).catch(() => {
    toast.add({
      color: 'error',
      title: 'Failed to copy link',
      icon: 'i-lucide-x',
      description: 'An error occurred while trying to copy the link. Please try again.',
    })
  })
}
</script>
