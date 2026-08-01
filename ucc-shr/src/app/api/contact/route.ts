import { NextRequest, NextResponse } from 'next/server'
import { sendDirectEmail } from '@/src/lib/email'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 })
    }

    const { name, email, phone, message } = result.data

    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <br />
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `

    const recipientEmail = process.env.CONTACT_EMAIL ?? 'cegrad@ucc.edu.gh'

    await sendDirectEmail(
      recipientEmail, 
      `Contact Form: Message from ${name}`, 
      htmlContent,
      { email, name }, // replyTo
      name // senderName
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
