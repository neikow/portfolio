export default defineNuxtPlugin(() => {
  const router = useRouter()
  router.beforeEach((to) => {
    if (to.path.startsWith('/_ws')) return false
  })
})
