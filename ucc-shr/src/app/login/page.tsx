"use client"

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { AuthLayout } from '@/src/components/templates/auth-layout'
import { FormField } from '@/src/components/molecules/form-field'
import { Input } from '@/src/components/atoms/input'
import { Button } from '@/src/components/atoms/button'
import { AlertBox } from '@/src/components/molecules/alert-box'
import { resolveSafeCallback } from '@/src/lib/auth/safe-redirect'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const signupSuccess = searchParams.get('signup') === 'success'
  const emailVerified = searchParams.get('verified') === 'success'
  const alreadyVerified = searchParams.get('verified') === 'already'

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    const callbackUrl = searchParams.get('callbackUrl')
    await signIn('google', { callbackUrl: resolveSafeCallback(callbackUrl, '/user/userDashboard') })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        portal: 'user',
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password.')
        setIsLoading(false)
        return
      }

      const callbackUrl = searchParams.get('callbackUrl')
      router.push(resolveSafeCallback(callbackUrl, '/user/userDashboard'))
    } catch {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6 space-y-1 text-center">
        <h2 className="text-2xl font-bold text-navy">Welcome back</h2>
        <p className="text-sm text-gray-500">
          Sign in to submit reports and access support.
        </p>
      </div>

      {signupSuccess && (
        <AlertBox title="Account created" variant="success">
          Your account was created. You can now sign in.
        </AlertBox>
      )}

      {emailVerified && (
        <AlertBox title="Email verified" variant="success">
          Your email has been verified. You can now sign in.
        </AlertBox>
      )}

      {alreadyVerified && (
        <AlertBox title="Already verified" variant="info">
          Your email is already verified. Sign in below.
        </AlertBox>
      )}

      {error && (
        <AlertBox title="Sign in failed" variant="danger">
          {error}
        </AlertBox>
      )}

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:opacity-50"
      >
        <GoogleLogo />
        {googleLoading ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <Divider label="or sign in with email" />

      {/* Email form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email address" required>
          <Input
            type="email"
            placeholder="you@stu.ucc.edu.gh or personal email"
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
              className="pr-11"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="mt-1 flex justify-end">
            <Link href="/forgot-password" className="text-xs font-semibold text-navy hover:underline">
              Forgot password?
            </Link>
          </div>
        </FormField>

        <Button type="submit" fullWidth disabled={isLoading} loading={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center text-[13px] text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-navy underline-offset-2 hover:underline">
          Create one
        </Link>
      </div>
    </AuthLayout>
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}
