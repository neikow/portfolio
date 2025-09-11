import { H3Error } from 'h3'
import { handleGalleryImageUpload } from '~~/server/handlers/handleImageUpload'
import { useDatabase } from '~~/server/utils/useDatabase'
import { galleryImagesTable } from '#shared/schemas/galleryImage'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    const db = useDatabase()

    if (!formData || formData.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No files uploaded' })
    }

    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif']

    const fileNames: string[] = []
    const errorFiles: string[] = []

    for (const file of formData) {
      if (!file.type || !allowedTypes.includes(file.type)) {
        throw createError({
          statusCode: 400,
          statusMessage:
            `File type ${file.type || 'unknown'} not allowed. 
        Allowed types: ${allowedTypes.join(', ')}`,
        })
      }

      const fileName = `${Date.now()}-${file.filename?.toLowerCase().replaceAll(' ', '_')}`

      const { success, cancel: cancelFileUpload } = await handleGalleryImageUpload(fileName, file.data)

      if (!success) {
        errorFiles.push(file.filename ?? 'unknown')
        continue
      }

      try {
        await db.insert(galleryImagesTable).values({
          filename: fileName,
        })
        fileNames.push(fileName)
      }
      catch (dbError) {
        await cancelFileUpload()
        throw dbError
      }
    }

    if (errorFiles.length > 0) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to upload some files`,
        data: errorFiles,
      })
    }

    return { fileNames }
  }
  catch (error) {
    console.error(error)

    if (error instanceof H3Error) {
      throw error
    }

    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})
