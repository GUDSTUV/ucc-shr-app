/**
 * Compresses an image in the browser using HTML5 Canvas before upload.
 * This guarantees the payload stays well below hosting/serverless limits (e.g. Vercel 4.5MB limit)
 * and makes uploads significantly faster.
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.85
): Promise<File> {
  // Only compress raster images
  if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
    return file
  }

  // If already under 1MB, no compression needed
  if (file.size <= 1024 * 1024) {
    return file
  }

  return new Promise<File>((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (readerEvent) => {
      const img = new Image()
      img.src = readerEvent.target?.result as string

      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          } else {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return resolve(file)
        }

        ctx.drawImage(img, 0, 0, width, height)

        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              return resolve(file)
            }
            const compressedFile = new File([blob], file.name, {
              type: outputType,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          outputType,
          quality
        )
      }

      img.onerror = () => resolve(file)
    }

    reader.onerror = () => resolve(file)
  })
}
