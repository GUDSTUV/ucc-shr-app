"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/src/components/templates/auth-layout'
import { FormField } from '@/src/components/molecules/form-field'
import { Input } from '@/src/components/atoms/input'
import { Button } from '@/src/components/atoms/button'
import { AlertBox } from '@/src/components/molecules/alert-box'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to request password reset')
      }

      setStatus('success')
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMessage(err.message)
      else setErrorMessage('An error occurred')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <AuthLayout>
        <div className="mb-6 space-y-1 text-center">
          <h2 className="text-2xl font-bold text-navy">Check your email</h2>
          <p className="text-sm text-gray-500">
            If an account exists for {email}, we&apos;ve sent a password reset link.
          </p>
        </div>

        <div className="text-center">
          <Link href="/login">
            <Button variant="outline" fullWidth>
              Return to login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="mb-6 space-y-1 text-center">
        <h2 className="text-2xl font-bold text-navy">Forgot Password</h2>
        <p className="text-sm text-gray-500">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {status === 'error' && (
        <AlertBox title="Error" variant="danger">
          {errorMessage}
        </AlertBox>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email address" required>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            autoComplete="email"
          />
        </FormField>

        <Button type="submit" fullWidth disabled={status === 'loading'} loading={status === 'loading'}>
          Send Reset Link
        </Button>
      </form>

      <div className="mt-8 text-center text-[13px] text-gray-500">
        Remember your password?{' '}
        <Link href="/login" className="font-semibold text-navy underline-offset-2 hover:underline">
          Sign In
        </Link>
      </div>
    </AuthLayout>
  )
}
