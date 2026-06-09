import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // Don't leak whether the email exists
      return NextResponse.json({ ok: true })
    }

    // Google-only users can't reset password this way
    if (!user.password) {
      return NextResponse.json({ error: 'Cannot reset password for Google-linked accounts' }, { status: 400 })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    })

    // Simulated email send
    const resetLink = `${new URL(req.url).origin}/reset-password?token=${resetToken}`
    console.log(`\n\n[MOCK EMAIL] Password Reset Link for ${email}:\n${resetLink}\n\n`)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
