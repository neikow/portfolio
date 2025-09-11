import type { FetchPhotosParams } from '#shared/types/photos'

export async function useInfiniteGalleryScroll(config: { pageSize: number }) {
  const pictures: Ref<Awaited<ReturnType<typeof $fetch<unknown, '/api/gallery/photos'>>>> = ref([])
  const currentPage = ref(0)
  const hasMore = ref(true)
  const status = ref<'idle' | 'loading' | 'error'>('idle')
  const error = ref<Error | null>(null)

  function fetchPictures(page: number) {
    return $fetch('/api/gallery/photos', {
      params: {
        limit: config.pageSize,
        offset: (page - 1) * config.pageSize,
      } satisfies FetchPhotosParams,
    })
  }

  function reset() {
    pictures.value = []
    currentPage.value = 0
    hasMore.value = true
    status.value = 'idle'
  }

  function remove(filename: string) {
    pictures.value = pictures.value?.filter(p => p.filename !== filename) ?? []
  }

  async function loadMore() {
    if (status.value === 'loading' || !hasMore.value) return

    status.value = 'loading'
    currentPage.value++
    try {
      error.value = null
      const newPictures = await fetchPictures(currentPage.value)

      if (newPictures.length < config.pageSize) {
        hasMore.value = false
      }

      pictures.value = [...pictures.value, ...newPictures]
      status.value = 'idle'
    }
    catch (err) {
      error.value = err as Error
      status.value = 'error'
    }
  }

  return {
    pictures,
    loadMore,
    hasMore,
    status,
    error,
    remove,
    reset,
  }
}
