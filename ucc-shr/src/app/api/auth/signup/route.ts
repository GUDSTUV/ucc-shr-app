import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { z } from 'zod'
import { sendVerificationEmail } from '@/src/lib/email'

// Institutional email validation schema
const signupSchema = z.object({
  email: z
    .string()
    .email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = signupSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error.issues[0].message,
        },
        { status: 400 }
      )
    }

    const { email, password } = validation.data
    const normalizedEmail = email.toLowerCase()
    
    // Auto-generate a generic name for privacy
    const name = 'User'

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          error: 'An account with this email already exists',
        },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verifyToken = randomBytes(32).toString('hex')
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'STAFF',
        emailVerified: false,
        verifyToken,
        verifyTokenExpiry,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    // Send verification email (non-blocking — don't fail signup if email errors)
    try {
      await sendVerificationEmail(normalizedEmail, name, verifyToken)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
    }

    // In development mode, print the verification link to the console
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verifyToken}`
    if (process.env.NODE_ENV === 'development') {
      console.log('\n--- DEVELOPMENT MODE ---')
      console.log(`Verification link for ${normalizedEmail}:`)
      console.log(verifyUrl)
      console.log('------------------------\n')
    }

    return NextResponse.json(
      {
        message: 'Account created successfully. Please check your email to verify your account.',
        user,
        ...(process.env.NODE_ENV === 'development' && { devVerifyUrl: verifyUrl })
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)

    // Return more detailed error in development
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup'

    return NextResponse.json(
      {
        error: process.env.NODE_ENV === 'development'
          ? `Signup failed: ${errorMessage}`
          : 'An error occurred during signup. Please try again.',
      },
      { status: 500 }
    )
  }
}
