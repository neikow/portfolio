export function useOnBeforeUnload(callback: () => string | undefined) {
  if (import.meta.server) return

  const route = useRoute()
  const router = useRouter()

  router.beforeEach((to, from, next) => {
    if (from.fullPath === route.fullPath) {
      const message = callback()

      if (!message || confirm(message)) {
        next()
      }
      else {
        next(false)
      }
    }
    else {
      next()
    }
  })

  const handler = (event: BeforeUnloadEvent) => {
    const message = callback()
    if (message) {
      event.preventDefault()
      return message
    }
  }

  onMounted(() => {
    window.addEventListener('beforeunload', handler)
  })

  onUnmounted(() => {
    window.removeEventListener('beforeunload', handler)
  })
}
