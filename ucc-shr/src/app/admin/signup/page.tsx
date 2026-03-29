'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormLayout } from '@/src/components/templates/form-layout'
import { FormField } from '@/src/components/molecules/form-field'
import { Input } from '@/src/components/atoms/input'
import { Button } from '@/src/components/atoms/button'
import { AlertBox } from '@/src/components/molecules/alert-box'

export default function AdminSignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminKey, setAdminKey] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email.endsWith('@stu.ucc.edu.gh')) {
      setError('Only UCC institutional emails (@stu.ucc.edu.gh) are allowed')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/admin-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          adminKey,
        }),
      })

      const contentType = response.headers.get('content-type') || ''
      const isJsonResponse = contentType.includes('application/json')
      const data = isJsonResponse ? await response.json() : null

      if (!response.ok) {
        setError(isJsonResponse && data?.error ? data.error : 'Admin signup failed. Please try again.')
        setIsLoading(false)
        return
      }

      router.push('/admin/login')
    } catch (err) {
      console.error('Admin signup error:', err)
      setError('Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  return (
    <FormLayout title="Admin Sign Up">
      <AlertBox title="Restricted setup" variant="info">
        This page requires a valid admin setup key and is intended for authorized setup only.
      </AlertBox>

      {error ? (
        <AlertBox title="Error" variant="danger">
          {error}
        </AlertBox>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-100 bg-white p-4">
        <FormField label="Full Name">
          <Input
            placeholder="Your name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
            disabled={isLoading}
          />
        </FormField>

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
            placeholder="Create a password (min. 8 characters)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Admin Setup Key">
          <Input
            type="password"
            placeholder="Enter secure setup key"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            required
            disabled={isLoading}
          />
        </FormField>

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Creating Admin...' : 'Create Admin Account'}
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-3 text-[13px] font-medium">
        <Link href="/admin/login" className="text-navy underline underline-offset-2">
          Already have admin account? Login
        </Link>
      </div>
    </FormLayout>
  )
}
