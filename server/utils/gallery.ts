export function deleteGalleryImage(filename: string) {
  const storage = useStorage('galleryUploads')
  return storage.removeItem(filename)
}
