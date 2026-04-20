const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'pdf'])
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_FILES = 20

const MAGIC: Array<{ mime: string, check: (b: Buffer) => boolean }> = [
  { mime: 'image/jpeg', check: b => b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF },
  { mime: 'image/png', check: b => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47 },
  { mime: 'image/gif', check: b => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 },
  {
    mime: 'image/webp',
    check: b =>
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46
      && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
  {
    mime: 'image/avif',
    check: (b) => {
      if (b.length < 12) return false
      if (b[4] !== 0x66 || b[5] !== 0x74 || b[6] !== 0x79 || b[7] !== 0x70) return false
      const brand = b.slice(8, 12).toString('ascii')
      return ['avif', 'avis', 'heic', 'heif', 'mif1'].includes(brand)
    },
  },
  { mime: 'application/pdf', check: b => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 },
]

const ALLOWED_MIMES = new Set(MAGIC.map(m => m.mime))

function detectMime(buf: Buffer): string | null {
  return MAGIC.find(m => m.check(buf))?.mime ?? null
}

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

  if (formData.length > MAX_FILES) {
    throw createError({ statusCode: 400, statusMessage: `Too many files (max ${MAX_FILES})` })
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

    if (file.data.length > MAX_FILE_SIZE) {
      return { success: false, href: null, error: 'File too large (max 10 MB)', fileName: file.filename, slug: '' } satisfies FileUploadResult
    }

    const rawExt = file.filename.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXTENSIONS.has(rawExt)) {
      return { success: false, href: null, error: `File type not allowed: .${rawExt}`, fileName: file.filename, slug: '' } satisfies FileUploadResult
    }

    const detectedMime = detectMime(Buffer.from(file.data))
    if (!detectedMime || !ALLOWED_MIMES.has(detectedMime)) {
      return { success: false, href: null, error: `File content not allowed`, fileName: file.filename, slug: '' } satisfies FileUploadResult
    }

    const safeName = file.filename.replace(/[^a-z0-9._-]/gi, '_').toLowerCase()
    const fileName = `${crypto.randomUUID()}-${safeName}`

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
