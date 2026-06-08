import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth/auth'

/**
 * PATCH /api/admin/support-stories/[id]
 * Admin approves or rejects a support story
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check admin authorization
    const session = await auth()
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
 * DELETE /api/admin/support-stories/[id]
 * Admin deletes a support story
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check admin authorization
    const session = await auth()
    if (!session || session.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    await prisma.supportStory.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting support story:', error)
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 })
  }
}
