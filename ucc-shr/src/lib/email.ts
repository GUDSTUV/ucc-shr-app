import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'UCC SHR <noreply@ucc-shr.edu.gh>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`

  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: 'Verify your UCC SHR account',
    html: `
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
            <td style="background:#00695C;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:.5px;">UCC Sexual Harassment Reporter</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <p style="margin:0 0 16px;font-size:15px;color:#374151;">Hi <strong>${name}</strong>,</p>
              <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
                Thank you for creating an account. Please verify your email address to activate your account.
              </p>
              <div style="text-align:center;margin:28px 0;">
                <a href="${verifyUrl}"
                   style="display:inline-block;background:#00695C;color:#ffffff;font-size:15px;font-weight:600;
                          text-decoration:none;padding:14px 36px;border-radius:8px;">
                  Verify Email Address
                </a>
              </div>
              <p style="margin:0 0 8px;font-size:13px;color:#6b7280;line-height:1.5;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 24px;font-size:12px;color:#00695C;word-break:break-all;">${verifyUrl}</p>
              <p style="margin:0;font-size:13px;color:#9ca3af;">This link expires in <strong>24 hours</strong>. If you did not create an account, you can safely ignore this email.</p>
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
    `,
  })
}
