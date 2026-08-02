/**
 * Email service using Brevo Transactional Email API
 * Docs: https://developers.brevo.com/reference/sendtransacemail
 *
 * Required env vars:
 *  BREVO_API_KEY  — your API key from Brevo → Settings → SMTP & API → API Keys (starts with xkeysib-)
 *  EMAIL_FROM_NAME  — sender display name (e.g. "CEGRAD UCC")
 *  EMAIL_FROM_ADDRESS — verified sender email in Brevo (e.g. "noreply.apptest2004@gmail.com")
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

const FROM_NAME = process.env.EMAIL_FROM_NAME ?? 'UCC SHR'
const FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS ?? 'noreply.apptest2004@gmail.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

async function sendBrevoEmail(
  to: string,
  subject: string,
  htmlContent: string,
  replyTo?: { email: string; name?: string },
  senderName?: string
) {
  const apiKey = process.env.BREVO_API_KEY

  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not set in environment variables')
  }

  const payload: any = {
    sender: { name: senderName ?? FROM_NAME, email: FROM_ADDRESS },
    to: [{ email: to }],
    subject,
    htmlContent,
  }

  if (replyTo) {
    payload.replyTo = replyTo
  }

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Brevo API error ${response.status}: ${errorBody}`)
  }

  return response.json()
}

function wrapInTemplate(contentHtml: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
          <!-- Header -->
          <tr>
            <td style="background:#263875;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:.5px;">UCC Sexual Harassment Reporting</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <div style="font-size:15px;color:#374151;line-height:1.6;">
                ${contentHtml}
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">University of Cape Coast &bull; Centre for Gender Research and Advocacy</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`

  const contentHtml = `
    <p style="margin:0 0 16px;">Hi <strong>${name}</strong>,</p>
    <p style="margin:0 0 24px;">
      Thank you for creating an account. Please verify your email address to activate your account.
    </p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${verifyUrl}"
         style="display:inline-block;background:#263875;color:#ffffff;font-size:15px;font-weight:600;
                text-decoration:none;padding:14px 36px;border-radius:8px;">
        Verify Email Address
      </a>
    </div>
    <p style="margin:0 0 8px;font-size:13px;color:#6b7280;line-height:1.5;">
      Or copy and paste this link into your browser:
    </p>
    <p style="margin:0 0 24px;font-size:12px;color:#263875;word-break:break-all;">${verifyUrl}</p>
    <p style="margin:0;font-size:13px;color:#9ca3af;">This link expires in <strong>24 hours</strong>. If you did not create an account, you can safely ignore this email.</p>
  `

  await sendBrevoEmail(to, 'Verify your UCC SHR account', wrapInTemplate(contentHtml))
}

export async function sendDirectEmail(
  to: string,
  subject: string,
  html: string,
  replyTo?: { email: string; name?: string },
  senderName?: string
) {
  await sendBrevoEmail(to, subject, wrapInTemplate(html), replyTo, senderName)
}

export type EventEmailData = {
  id: string
  title: string
  description: string
  venue: string
  startDate: Date | string
  endDate?: Date | string | null
}

export async function sendEventAnnouncementEmail(
  to: string,
  recipientName: string,
  event: EventEmailData
) {
  const eventUrl = `${APP_URL}/events/${event.id}`
  const startDateObj = new Date(event.startDate)

  const dateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(startDateObj)

  const timeFormatted = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(startDateObj)

  const contentHtml = `
    <div style="text-align:center;margin-bottom:20px;">
      <span style="display:inline-block;background:#EEF1FA;color:#263875;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:20px;">
        New Campus Event
      </span>
    </div>

    <h2 style="margin:0 0 14px;color:#1A1D2E;font-size:20px;font-weight:700;line-height:1.3;text-align:center;">
      ${event.title}
    </h2>

    <p style="margin:0 0 20px;color:#4B5563;font-size:15px;line-height:1.6;">
      ${event.description.length > 280 ? event.description.slice(0, 280) + '...' : event.description}
    </p>

    <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:5px 0;font-size:14px;color:#374151;">
            <strong style="color:#263875;">📅 Date:</strong> ${dateFormatted}
          </td>
        </tr>
        <tr>
          <td style="padding:5px 0;font-size:14px;color:#374151;">
            <strong style="color:#263875;">⏰ Time:</strong> ${timeFormatted}
          </td>
        </tr>
        <tr>
          <td style="padding:5px 0;font-size:14px;color:#374151;">
            <strong style="color:#263875;">📍 Venue:</strong> ${event.venue}
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;margin:28px 0;">
      <a href="${eventUrl}"
         style="display:inline-block;background:#263875;color:#ffffff;font-size:15px;font-weight:600;
                text-decoration:none;padding:14px 36px;border-radius:8px;">
        View Event & RSVP
      </a>
    </div>

    <p style="margin:24px 0 0;font-size:12px;color:#9CA3AF;text-align:center;line-height:1.5;">
      You received this email because you have a registered account on the UCC CEGRAD platform.<br />
      University of Cape Coast &bull; Centre for Gender Research and Advocacy
    </p>
  `

  await sendBrevoEmail(to, `[CEGRAD UCC] New Event: ${event.title}`, wrapInTemplate(contentHtml))
}

export async function broadcastEventAnnouncement(event: EventEmailData) {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.warn('[EMAIL WARNING] BREVO_API_KEY is not set in environment variables. Skipping event email broadcast.')
      return { count: 0, error: 'BREVO_API_KEY is missing' }
    }

    const { prisma } = await import('@/src/lib/prisma')
    // Get all registered users with valid emails (excluding suspended users)
    const users = await prisma.user.findMany({
      where: {
        role: { not: 'SUSPENDED' },
        email: { not: '' },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!users || users.length === 0) {
      console.log('No active registered users found to notify for event:', event.id)
      return { count: 0 }
    }

    console.log(`Broadcasting event "${event.title}" to ${users.length} registered user(s)...`)

    // Send emails in batches of 5 to avoid connection flooding
    const BATCH_SIZE = 5
    let successCount = 0
    let failureCount = 0

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE)
      const results = await Promise.allSettled(
        batch.map((user) =>
          sendEventAnnouncementEmail(user.email, user.name || 'Member', event)
        )
      )

      for (const res of results) {
        if (res.status === 'fulfilled') {
          successCount++
        } else {
          failureCount++
          console.error('[EMAIL ERROR] Failed to send event announcement:', res.reason)
        }
      }
    }

    console.log(`Event broadcast completed. Sent: ${successCount}, Failed: ${failureCount}`)
    return { count: successCount, failureCount }
  } catch (error) {
    console.error('Error during broadcastEventAnnouncement:', error)
    return { count: 0, error }
  }
}
