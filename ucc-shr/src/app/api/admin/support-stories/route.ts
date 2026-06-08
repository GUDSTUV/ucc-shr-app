import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth/auth'

/**
 * GET /api/admin/support-stories
 * List all support stories (approved and pending)
 */
export async function GET(_request: NextRequest) {
  try {
    // Check admin authorization
    const session = await auth()
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
