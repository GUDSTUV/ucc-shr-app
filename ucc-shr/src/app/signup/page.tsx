"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Eye, EyeOff, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { AuthLayout } from '@/src/components/templates/auth-layout'
import { FormField } from '@/src/components/molecules/form-field'
import { Input } from '@/src/components/atoms/input'
import { Button } from '@/src/components/atoms/button'
import { AlertBox } from '@/src/components/molecules/alert-box'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [signupEmail, setSignupEmail] = useState<string | null>(null)

  const passwordStrength =
    password.length === 0
      ? null
      : password.length < 8
        ? 'weak'
        : /[A-Z]/.test(password) && /[0-9]/.test(password)
          ? 'strong'
          : 'medium'

  const strengthMeta = {
    weak:   { color: 'bg-red',       label: 'Weak',   width: 'w-1/3', textColor: 'text-red' },
    medium: { color: 'bg-yellow-400', label: 'Fair',   width: 'w-2/3', textColor: 'text-yellow-600' },
    strong: { color: 'bg-teal',       label: 'Strong', width: 'w-full', textColor: 'text-teal' },
  }

  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== password

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl: '/user/userDashboard' })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error ?? 'Signup failed. Please try again.')
        setIsLoading(false)
        return
      }

      setSignupEmail(email)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  if (signupEmail) {
    return <CheckEmailView email={signupEmail} />
  }

  return (
    <AuthLayout>
      <div className="mb-6 space-y-1 text-center">
        <h2 className="text-2xl font-bold text-navy">Create your account</h2>
        <p className="text-sm text-gray-500">
          Sign up to submit reports and track your cases.
        </p>
      </div>

      {error && (
        <AlertBox title="Error" variant="danger">
          {error}
        </AlertBox>
      )}

      {/* Google */}
      <Button
        variant="unstyled"
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:opacity-50"
      >
        <GoogleLogo />
        {googleLoading ? 'Redirecting…' : 'Continue with Google'}
      </Button>

      <Divider label="or sign up with email" />

      {/* Email form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email address"
          required
          hint="Use your UCC email, or a secure personal email for added privacy."
        >
          <Input
            type="email"
            placeholder="you@stu.ucc.edu.gh"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </FormField>

        <FormField label="Password" required>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              autoComplete="new-password"
              className="pr-11"
            />
            <TogglePasswordButton show={showPassword} onToggle={() => setShowPassword((p) => !p)} />
          </div>
          {passwordStrength && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div className={`h-full rounded-full transition-all ${strengthMeta[passwordStrength].color} ${strengthMeta[passwordStrength].width}`} />
              </div>
              <span className={`text-[11px] font-semibold ${strengthMeta[passwordStrength].textColor}`}>
                {strengthMeta[passwordStrength].label}
              </span>
            </div>
          )}
        </FormField>

        <FormField
          label="Confirm Password"
          required
          error={confirmMismatch ? 'Passwords do not match.' : undefined}
        >
          <div className="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="new-password"
              className="pr-11"
              error={confirmMismatch}
            />
            <TogglePasswordButton show={showConfirm} onToggle={() => setShowConfirm((p) => !p)} />
          </div>
        </FormField>

        <Button type="submit" fullWidth disabled={isLoading || confirmMismatch} loading={isLoading}>
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center text-[13px] text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-navy underline-offset-2 hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  )
}

function TogglePasswordButton({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <Button
      variant="unstyled"
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </Button>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{label}</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  )
}

function CheckEmailView({ email }: { email: string }) {
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  async function handleResend() {
    setResendLoading(true)
    setResendMsg('')
    try {
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setResendMsg('A new verification link has been sent.')
    } catch {
      setResendMsg('Failed to resend. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal/10">
          <Mail className="h-7 w-7 text-teal" />
        </div>
        <div className="mb-6 space-y-1">
          <h2 className="text-2xl font-bold text-navy">Check your email</h2>
          <p className="text-sm text-gray-500">
            We&apos;ve sent a verification link to <strong className="text-gray-700">{email}</strong>.
            Click the link to activate your account.
          </p>
        </div>
        <p className="text-xs text-gray-400">The link expires in 24 hours. Check your spam folder if you don&apos;t see it.</p>
        <div className="mt-2 flex flex-col items-center gap-2">
          <p className="text-xs text-gray-500">Didn&apos;t receive it?</p>
          <Button variant="outline" size="sm" onClick={handleResend} disabled={resendLoading} loading={resendLoading}>
            Resend verification email
          </Button>
          {resendMsg && <p className="text-xs text-teal">{resendMsg}</p>}
        </div>
        <Link href="/login" className="text-xs font-semibold text-navy underline-offset-2 hover:underline">
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  )
}

