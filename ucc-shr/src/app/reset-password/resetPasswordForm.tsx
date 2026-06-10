"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthLayout } from '@/src/components/templates/auth-layout'
import { FormField } from '@/src/components/molecules/form-field'
import { Input } from '@/src/components/atoms/input'
import { Button } from '@/src/components/atoms/button'
import { AlertBox } from '@/src/components/molecules/alert-box'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  if (!token) {
    return (
      <AuthLayout>
        <AlertBox title="Invalid Link" variant="danger">
          No reset token was provided. Please request a new password reset link.
        </AlertBox>
        <div className="mt-4 text-center">
          <Link href="/forgot-password">
            <Button variant="outline">Request new link</Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      setStatus('error')
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long')
      setStatus('error')
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to reset password')
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
          <h2 className="text-2xl font-bold text-navy">Password Reset</h2>
          <p className="text-sm text-gray-500">
            Your password has been successfully reset.
          </p>
        </div>

        <div className="text-center">
          <Link href="/login">
            <Button fullWidth>Sign In</Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="mb-6 space-y-1 text-center">
        <h2 className="text-2xl font-bold text-navy">Set New Password</h2>
        <p className="text-sm text-gray-500">
          Please enter your new password below.
        </p>
      </div>

      {status === 'error' && (
        <AlertBox title="Error" variant="danger">
          {errorMessage}
        </AlertBox>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="New Password" required>
          <div className="relative">
            <Input
              type={showPasswords ? 'text' : 'password'}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={status === 'loading'}
              className="pr-11"
              minLength={8}
            />
            <Button
              variant="unstyled"
              type="button"
              tabIndex={-1}
              onClick={() => setShowPasswords((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </FormField>

        <FormField label="Confirm Password" required>
          <div className="relative">
            <Input
              type={showPasswords ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={status === 'loading'}
              className="pr-11"
              minLength={8}
            />
            <Button
              variant="unstyled"
              type="button"
              tabIndex={-1}
              onClick={() => setShowPasswords((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </FormField>

        <Button type="submit" fullWidth disabled={status === 'loading'} loading={status === 'loading'}>
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  )
}
