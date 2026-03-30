"use client"

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { FormLayout } from '@/src/components/templates/form-layout'
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
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const successMessage = searchParams.get('signup') === 'success'
    ? 'Account created successfully! Please login.'
    : ''

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    // Client-side validation for institutional email
    if (!email.endsWith('@stu.ucc.edu.gh')) {
      setError('Only UCC institutional emails (@stu.ucc.edu.gh) are allowed')
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        portal: 'user',
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        setIsLoading(false)
        return
      }

      // Respect callback target from middleware-protected routes.
      const callbackUrl = searchParams.get('callbackUrl')
      router.push(resolveSafeCallback(callbackUrl, '/user/userDashboard'))
    } catch {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <FormLayout title="Login">
      <AlertBox title="Secure access" variant="info">
        Login with your UCC institutional account to manage reports and access protected features.
      </AlertBox>

      {successMessage && (
        <AlertBox title="Success" variant="success">
          {successMessage}
        </AlertBox>
      )}

      {error && (
        <AlertBox title="Error" variant="danger">
          {error}
        </AlertBox>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-100 bg-white p-4">
        <FormField label="Email">
          <Input
            type="email"
            placeholder="you@stu.ucc.edu.gh"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Password">
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={isLoading}
          />
        </FormField>

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-3 text-[13px] font-medium">
        <Link href="/signup" className="text-navy underline underline-offset-2">
          Create account
        </Link>
        <Link href="/report/new" className="text-red underline underline-offset-2">
          Continue as Guest
        </Link>
      </div>
    </FormLayout>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}
