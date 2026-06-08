import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { randomBytes } from 'crypto'
import { sendVerificationEmail } from '@/src/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, name: true, email: true, emailVerified: true },
    })

    // Always respond success to prevent email enumeration
    if (!user || user.emailVerified) {
      return NextResponse.json({ message: 'If that email is registered and unverified, a new link has been sent.' })
    }

    const verifyToken = randomBytes(32).toString('hex')
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: { verifyToken, verifyTokenExpiry },
    })

    try {
      await sendVerificationEmail(user.email, user.name, verifyToken)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verifyToken}`
    if (process.env.NODE_ENV === 'development') {
      console.log('\n--- DEVELOPMENT MODE ---')
      console.log(`Resent verification link for ${user.email}:`)
      console.log(verifyUrl)
      console.log('------------------------\n')
    }

    return NextResponse.json({ 
      message: 'If that email is registered and unverified, a new link has been sent.',
      ...(process.env.NODE_ENV === 'development' && { devVerifyUrl: verifyUrl })
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json({ error: 'Failed to resend verification email.' }, { status: 500 })
  }
}
