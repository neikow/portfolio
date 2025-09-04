import Masonry from 'masonry-layout'

export default function useMasonry() {
  const masonry = ref<Masonry | null>(null)

  onMounted(() => {
    masonry.value = new Masonry('.masonry-grid', {
      itemSelector: '.masonry-grid-item',
      columnWidth: '.masonry-grid-sizer',
      transitionDuration: 0,
    })
  })

  const refresh = () => {
    masonry.value?.reloadItems?.()
    masonry.value?.layout?.()
  }

  return {
    masonry,
    refresh,
  }
}
