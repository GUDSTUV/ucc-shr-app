import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/auth-options'

/**
 * PATCH /api/admin/support-stories/[id]
 * Admin approves or rejects a support story
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check admin authorization
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { approved } = body

    if (typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'Approved must be a boolean' }, { status: 400 })
    }

    // Update story
    const story = await prisma.supportStory.update({
      where: { id },
      data: { approved },
    })

    return NextResponse.json({ success: true, story })
  } catch (error) {
    console.error('Error updating support story:', error)
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 })
  }
}

/**
 * GET /api/admin/support-stories
 * List all support stories (approved and pending)
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const stories = await prisma.supportStory.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Error fetching support stories:', error)
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
  }
}
