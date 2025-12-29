export type FileUploadResult = {
  href: string
  success: true
  error: null
  fileName: string
  slug: string
} | {
  href: null
  success: false
  error: string
  fileName: string
  slug: string
}

export interface UploadResponse {
  success: boolean
  uploads: FileUploadResult[]
}

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400, statusMessage: 'No files uploaded',
    })
  }

  const storage = useStorage('commonUploads')

  const uploads = await Promise.all(formData.map<Promise<FileUploadResult>>(async (file) => {
    if (!file || !file.data || !file.filename) {
      return {
        success: false,
        href: null,
        error: 'Invalid file upload',
        fileName: '',
        slug: '',
      } satisfies FileUploadResult
    }

    const fileName = `${Date.now()}-${(file.filename ?? '').toLowerCase().replaceAll(' ', '_')}`

    try {
      await storage.setItemRaw(fileName, file.data)
    }
    catch (error) {
      console.error(error)
      return {
        success: false,
        href: null,
        error: 'Error uploading file',
        fileName: file.filename,
        slug: fileName,
      } satisfies FileUploadResult
    }

    return {
      success: true,
      href: `/media/${fileName}`,
      error: null,
      fileName: file.filename,
      slug: fileName,
    } satisfies FileUploadResult
  }))

  return {
    success: uploads.every(upload => upload.success),
    uploads,
  }
})
