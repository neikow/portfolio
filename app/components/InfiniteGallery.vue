<template>
  <div v-if="error">
    <ErrorState
      description="There was an error loading the gallery. Please try again later."
      title="Failed to load gallery"
    />
  </div>
  <div v-else-if="pictures.length === 0">
    <EmptyState
      :icon="Icons.photography.dashboard"
      description="Nothing to show here for the time being."
      title="No pictures yet"
    />
  </div>
  <MasonryGrid>
    <div
      v-for="(picture, index) in pictures"
      :key="`gallery-picture-${index}`"
      :class="{
        'masonry-grid-item w-full md:w-1/2 lg:w-1/3 p-1 group relative': true,
        'masonry-grid-sizer': index === 0,
      }"
    >
      <img
        :alt="picture.filename"
        :src="getGalleryImageUrl(picture.filename)"
        class="w-full object-cover rounded-lg shadow-sm transition-transform"
        loading="eager"
        @load="refresh"
      >
      <div
        v-if="showActions"
        class="w-full h-full absolute top-0 left-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity rounded-lg"
      />
      <div
        v-if="showActions"
        class="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-2"
      >
        <UDropdownMenu :items="getDropdownMenuOptions(picture)">
          <UButton
            :icon="Icons.ui.more"
            color="neutral"
          />
        </UDropdownMenu>
      </div>
    </div>

    <div
      v-if="status === 'idle' && hasMore"
      ref="moreLoader"
      class="w-full flex justify-center items-center p-4 masonry-grid-item"
    >
      <UIcon
        :name="Icons.ui.loading"
        class="animate-spin scale-150"
        size="xl"
      />
    </div>
  </MasonryGrid>
</template>

<script lang="ts" setup>
import { getGalleryImageUrl } from '#shared/utils/gallery'
import type { DropdownMenuItem } from '#ui/components/DropdownMenu.vue'
import { Icons } from '#shared/consts/icons'

defineProps({
  showActions: {
    type: Boolean,
    default: false,
  },
})

const PAGE_SIZE = 10

const { refresh } = useMasonry()

function resetInfiniteGallery() {
  reset()
}

defineExpose({
  resetInfiniteGallery,
})

const {
  pictures,
  loadMore,
  hasMore,
  error,
  status,
  remove,
  reset,
} = await useInfiniteGalleryScroll({ pageSize: PAGE_SIZE })

const moreLoader = useTemplateRef<HTMLDivElement>('moreLoader')

const toast = useToast()

useLoopingIntersectionObserver(moreLoader, () => {
  loadMore()
})

onMounted(() => {
  window.addEventListener('resize', refresh)
})

onUnmounted(() => {
  window.removeEventListener('resize', refresh)
})

async function deleteImage(filename: string) {
  const res = await fetch(`/api/gallery/photo/${filename}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    toast.add({
      title: 'Failed to delete image',
      description: 'There was an error deleting the image. Please try again.',
      color: 'error',
      icon: Icons.ui.error,
    })
    return
  }

  remove(filename)
  toast.add({
    title: 'Image deleted',
    description: 'The image was successfully deleted.',
    color: 'success',
    icon: Icons.ui.success,
  })
}

function getDropdownMenuOptions(picture: { filename: string }): DropdownMenuItem[] {
  return [
    {
      label: 'Delete',
      icon: Icons.actions.delete,
      color: 'error',
      onSelect: () => deleteImage(picture.filename),
    },
  ]
}
</script>
