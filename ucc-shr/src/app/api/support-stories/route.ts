import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

/**
 * POST /api/support-stories
 * Submit an anonymous support story for admin review
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    // Validate message
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const trimmed = message.trim()
    if (trimmed.length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters' }, { status: 400 })
    }

    if (trimmed.length > 500) {
      return NextResponse.json({ error: 'Message must not exceed 500 characters' }, { status: 400 })
    }

    // Create support story (pending approval)
    const story = await prisma.supportStory.create({
      data: {
        message: trimmed,
        approved: false,
      },
    })

    return NextResponse.json({ success: true, id: story.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating support story:', error)
    return NextResponse.json({ error: 'Failed to submit story' }, { status: 500 })
  }
}
