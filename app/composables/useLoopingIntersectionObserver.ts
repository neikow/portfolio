import type { MaybeComputedElementRef } from '@vueuse/core'
import { useIntersectionObserver } from '@vueuse/core'

export function useLoopingIntersectionObserver(
  target: MaybeComputedElementRef,
  onIntersection: () => void, options = { immediate: true, interval: 100 }) {
  const intervalId = ref<number | null>(null)

  function startInterval() {
    if (intervalId.value === null) {
      intervalId.value = window.setInterval(onIntersection, options.interval)
    }
  }

  function stopInterval() {
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  return useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry?.isIntersecting) {
        startInterval()
      }
      else {
        stopInterval()
      }
    },
    { immediate: true },
  )
}
