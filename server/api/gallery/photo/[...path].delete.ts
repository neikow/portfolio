import { galleryImagesTable } from '~~/server/schemas/galleryImage'
import { eq } from 'drizzle-orm'
import { deleteGalleryImage } from '~~/server/utils/gallery'

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const db = useDatabase()

  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'No file specified' })
  }

  await db.delete(galleryImagesTable).where(
    eq(galleryImagesTable.filename, path),
  )

  await deleteGalleryImage(path)

  return { success: true }
})
