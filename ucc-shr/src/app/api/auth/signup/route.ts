import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Institutional email validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .email('Invalid email format')
    .refine(
      (email) => email.endsWith('@stu.ucc.edu.gh'),
      'Only UCC institutional emails (@stu.ucc.edu.gh) are allowed'
    ),
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

    const { name, email, password } = validation.data
    const normalizedEmail = email.toLowerCase()

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

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'STAFF',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user,
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
