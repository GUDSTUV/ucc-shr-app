import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=verification_missing', request.url))
  }

  const user = await prisma.user.findUnique({
    where: { verifyToken: token },
    select: { id: true, emailVerified: true, verifyTokenExpiry: true },
  })

  if (!user) {
    return NextResponse.redirect(new URL('/login?error=verification_invalid', request.url))
  }

  if (user.emailVerified) {
    return NextResponse.redirect(new URL('/login?verified=already', request.url))
  }

  if (!user.verifyTokenExpiry || user.verifyTokenExpiry < new Date()) {
    return NextResponse.redirect(new URL('/login?error=verification_expired', request.url))
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verifyToken: null,
      verifyTokenExpiry: null,
    },
  })

  return NextResponse.redirect(new URL('/login?verified=success', request.url))
}
