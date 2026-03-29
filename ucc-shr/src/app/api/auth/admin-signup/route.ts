import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const adminSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .email('Invalid email format')
    .refine(
      (email) => email.endsWith('@stu.ucc.edu.gh'),
      'Only UCC institutional emails (@stu.ucc.edu.gh) are allowed'
    ),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  adminKey: z.string().min(1, 'Admin setup key is required'),
})

function parseAdminEmails() {
  const raw = process.env.SUPER_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS ?? ''
  return raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

export async function POST(request: NextRequest) {
  try {
    const bootstrapSecret = process.env.ADMIN_SIGNUP_SECRET

    if (!bootstrapSecret) {
      return NextResponse.json(
        { error: 'Admin signup is not configured on this server.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const validation = adminSignupSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password, adminKey } = validation.data
    const normalizedEmail = email.toLowerCase()

    if (adminKey !== bootstrapSecret) {
      return NextResponse.json(
        { error: 'Invalid admin setup key.' },
        { status: 403 }
      )
    }

    const configuredAdmins = parseAdminEmails()
    const superAdminCount = await prisma.user.count({
      where: { role: 'SUPER_ADMIN' },
    })

    if (configuredAdmins.length > 0 && !configuredAdmins.includes(normalizedEmail)) {
      return NextResponse.json(
        { error: 'This email is not allowed for admin signup.' },
        { status: 403 }
      )
    }

    if (configuredAdmins.length === 0 && superAdminCount > 0) {
      return NextResponse.json(
        {
          error:
            'Admin signup is disabled. Configure SUPER_ADMIN_EMAILS to allow additional admin accounts.',
        },
        { status: 403 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
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
        message: 'Admin account created successfully',
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Admin signup error:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred during admin signup'

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === 'development'
            ? `Admin signup failed: ${errorMessage}`
            : 'An error occurred during admin signup. Please try again.',
      },
      { status: 500 }
    )
  }
}
