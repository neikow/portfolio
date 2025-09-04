export default defineEventHandler(async (event) => {
  const storage = useStorage('galleryUploads')
  const path = getRouterParam(event, 'path')

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required',
    })
  }
  return await storage.getItemRaw(path)
})
