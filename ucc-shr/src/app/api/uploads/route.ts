import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'

const MAX_FILES = 10
const MAX_FILE_BYTES = 10 * 1024 * 1024

function safeBaseName(value: string) {
  return value
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120)
}

function uploadToCloudinary(buffer: Buffer, baseName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'cegrad',
        public_id: `${Date.now()}-${randomUUID()}-${baseName}`
      },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve(result.secure_url)
      }
    ).end(buffer)
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files').filter((item): item is File => item instanceof File)
    const kinds = formData.getAll('kinds').map((item) => String(item))

    if (files.length === 0) {
      return NextResponse.json({ ok: false, error: 'No files uploaded.' }, { status: 400 })
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { ok: false, error: `You can upload at most ${MAX_FILES} files.` },
        { status: 400 }
      )
    }

    const useCloudinary = !!process.env.CLOUDINARY_URL
    let uploadsDir = ''
    
    if (!useCloudinary) {
      uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadsDir, { recursive: true })
    }

    const savedFiles: string[] = []

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i]
      const kind = kinds[i] || 'evidence'

      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { ok: false, error: `${file.name} is larger than 10MB.` },
          { status: 400 }
        )
      }

      const extension = path.extname(file.name)
      const base = path.basename(file.name, extension)
      const safeName = safeBaseName(base)
      
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      if (useCloudinary) {
        try {
          const secureUrl = await uploadToCloudinary(buffer, safeName)
          savedFiles.push(`${kind}:${secureUrl}`)
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError)
          throw new Error("Failed to upload to Cloudinary")
        }
      } else {
        const outputFile = `${Date.now()}-${randomUUID()}-${safeName}${extension}`
        const fullPath = path.join(uploadsDir, outputFile)
        await writeFile(fullPath, buffer)
        savedFiles.push(`${kind}:/uploads/${outputFile}`)
      }
    }

    return NextResponse.json({ ok: true, files: savedFiles })
  } catch (error) {
    console.error("Upload route error:", error)
    return NextResponse.json(
      { ok: false, error: 'Unable to upload files right now. Please try again.' },
      { status: 500 }
    )
  }
}

