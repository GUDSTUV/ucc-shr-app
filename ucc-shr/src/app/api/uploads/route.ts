import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_FILES = 10
const MAX_FILE_BYTES = 10 * 1024 * 1024

function initCloudinary(): boolean {
  const rawUrl = process.env.CLOUDINARY_URL?.trim()
  if (rawUrl) {
    const cleanUrl = rawUrl.replace(/^["']|["']$/g, '').trim()
    const urlPattern = /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/
    const match = cleanUrl.match(urlPattern)
    if (match) {
      cloudinary.config({
        api_key: match[1],
        api_secret: match[2],
        cloud_name: match[3],
        secure: true,
      })
      return true
    }
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim().replace(/^["']|["']$/g, '')
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim().replace(/^["']|["']$/g, '')
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim().replace(/^["']|["']$/g, '')

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    })
    return true
  }

  return false
}

function safeBaseName(value: string) {
  return value
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 60)
}

function uploadToCloudinary(buffer: Buffer, baseName: string, retries = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    function attempt(remaining: number) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'cegrad',
          public_id: `${Date.now()}-${randomUUID().slice(0, 8)}-${baseName || 'file'}`,
          timeout: 60000,
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            if (remaining > 0) {
              console.warn(`Cloudinary upload attempt failed, retrying (${remaining} left)...`, error)
              return attempt(remaining - 1)
            }
            return reject(error || new Error('No secure_url returned by Cloudinary'))
          }
          resolve(result.secure_url)
        }
      )
      uploadStream.end(buffer)
    }

    attempt(retries)
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

    const isCloudinaryReady = initCloudinary()
    let uploadsDir = ''
    if (!isCloudinaryReady) {
      uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      try {
        await mkdir(uploadsDir, { recursive: true })
      } catch (dirError) {
        console.error('Failed to create local uploads directory (read-only environment):', dirError)
        return NextResponse.json(
          {
            ok: false,
            error:
              'Cloud storage is not configured on this server. Please add your CLOUDINARY_URL in your hosting environment variables.',
          },
          { status: 500 }
        )
      }
    }

    const savedFiles: string[] = []

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i]
      const kind = kinds[i] || 'media'

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

      if (isCloudinaryReady) {
        try {
          const secureUrl = await uploadToCloudinary(buffer, safeName)
          savedFiles.push(`${kind}:${secureUrl}`)
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError)
          return NextResponse.json(
            {
              ok: false,
              error: 'Failed to upload image to Cloudinary. Please check your credentials.',
            },
            { status: 500 }
          )
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
    console.error('Upload route error:', error)
    const message = error instanceof Error ? error.message : 'Unable to upload files right now.'
    return NextResponse.json(
      { ok: false, error: message || 'Unable to upload files right now. Please try again.' },
      { status: 500 }
    )
  }
}

