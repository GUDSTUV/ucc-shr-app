import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const MAX_FILES = 10
const MAX_FILE_BYTES = 10 * 1024 * 1024

function safeBaseName(value: string) {
  return value
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120)
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

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

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
      const outputFile = `${Date.now()}-${randomUUID()}-${safeBaseName(base)}${extension}`
      const fullPath = path.join(uploadsDir, outputFile)

      const bytes = await file.arrayBuffer()
      await writeFile(fullPath, Buffer.from(bytes))

      savedFiles.push(`${kind}:/uploads/${outputFile}`)
    }

    return NextResponse.json({ ok: true, files: savedFiles })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to upload files right now. Please try again.' },
      { status: 500 }
    )
  }
}
