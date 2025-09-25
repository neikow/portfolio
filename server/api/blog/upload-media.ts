export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  await requireUserSession(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400, statusMessage: 'No files uploaded',
    })
  }

  if (formData.length > 1) {
    throw createError({
      statusCode: 400, statusMessage: 'You can upload only one picture at a time.',
    })
  }

  const file = formData[0]

  if (!file || !file.data || !file.filename) {
    throw createError({
      statusCode: 400, statusMessage: 'Invalid file upload',
    })
  }

  const storage = useStorage('blogUploads')

  const fileName = `${Date.now()}-${(file.filename ?? '').toLowerCase().replaceAll(' ', '_')}`

  try {
    await storage.setItemRaw(fileName, file.data)
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500, statusMessage: 'Error uploading file',
    })
  }

  return {
    href: `/uploads/blog/${fileName}`,
  }
})
