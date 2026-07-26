import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET() {
  const saved = await prisma.savedResource.findMany()
  const users = await prisma.user.findMany({ select: { id: true, email: true } })
  
  return NextResponse.json({ saved, users })
}
