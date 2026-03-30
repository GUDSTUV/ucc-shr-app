'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { FormLayout } from '@/src/components/templates/form-layout'
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
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl')

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
        setError('Invalid admin credentials')
        setIsLoading(false)
        return
      }

      router.push(resolveSafeCallback(callbackUrl, '/admin', { requirePrefix: '/admin' }))
    } catch {
      setError('Unable to sign in right now. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <FormLayout title="Admin Login">
      <AlertBox title="Restricted access" variant="info">
        Sign in with a SUPER_ADMIN account to access the admin dashboard.
      </AlertBox>

      {error ? (
        <AlertBox title="Login failed" variant="danger">
          {error}
        </AlertBox>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-100 bg-white p-4">
        <FormField label="Admin Email">
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
          {isLoading ? 'Signing In...' : 'Sign In to Admin'}
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-3 text-[13px] font-medium">
        <Link href="/admin/signup" className="text-navy underline underline-offset-2">
          Need to set up an admin account?
        </Link>
      </div>
    </FormLayout>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginContent />
    </Suspense>
  )
}