'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import { signOut, signIn } from 'next-auth/react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '@/src/components/templates/auth-layout'
import { FormField } from '@/src/components/molecules/form-field'
import { Input } from '@/src/components/atoms/input'
import { Button } from '@/src/components/atoms/button'
import { AlertBox } from '@/src/components/molecules/alert-box'
import { resolveSafeCallback } from '@/src/lib/auth/safe-redirect'

function AdminLoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const urlError = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl')

  useEffect(() => {
    if (urlError === 'Suspended') {
      setError('Your account has been suspended by a Super Admin. Please contact support.')
      signOut({ redirect: false }).then(() => {
        router.replace('/admin/login')
      })
    } else if (urlError) {
      setError(urlError)
      router.replace('/admin/login')
    }
  }, [urlError, router])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        portal: 'admin',
        redirect: false,
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError('Invalid admin credentials')
        } else {
          setError(result.error)
        }
        setIsLoading(false)
        return
      }

      router.refresh()
      router.push(resolveSafeCallback(callbackUrl, '/admin', { requirePrefix: '/admin' }))
    } catch {
      setError('Unable to sign in right now. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout hideBackButton>
      <div className="mb-6 space-y-1 text-center">
        <h2 className="text-2xl font-bold text-navy">Admin Portal</h2>
        <p className="text-sm text-gray-500">
          Sign in to your admin account.
        </p>
      </div>

      {error && (
        <div className="mt-4">
          <AlertBox title="Login failed" variant="danger">
            {error}
          </AlertBox>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <FormField label="Admin Email" required>
          <Input
            type="email"
            placeholder="admin@ucc.edu.gh"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
              className="pr-11"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FormField>

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In to Admin'}
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[13px] font-medium">
        <Link href="/admin/signup" className="text-navy hover:text-navy-dark transition-colors underline underline-offset-2">
          Need to set up an admin account?
        </Link>
      </div>
    </AuthLayout>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginContent />
    </Suspense>
  )
}