export async function handleGalleryImageUpload(filename: string, data: Buffer): Promise<{
  success: boolean
  cancel: () => Promise<void>
}> {
  const storage = useStorage('galleryUploads')

  try {
    await storage.setItemRaw(filename, data)

    return {
      success: true,
      cancel: async () => {
        await storage.removeItem(filename)
      },
    }
  }
  catch (error) {
    console.error('Error uploading image:', error)
    return {
      success: false,
      cancel: async () => { /* No-op */
      },
    }
  }
}
