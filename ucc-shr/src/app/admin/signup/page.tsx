'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react'
import { AuthLayout } from '@/src/components/templates/auth-layout'
import { FormField } from '@/src/components/molecules/form-field'
import { Input } from '@/src/components/atoms/input'
import { Button } from '@/src/components/atoms/button'
import { AlertBox } from '@/src/components/molecules/alert-box'

export default function AdminSignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [adminKey, setAdminKey] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showAdminKey, setShowAdminKey] = useState(false)
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const passwordStrength =
    password.length === 0
      ? null
      : password.length < 8
        ? 'weak'
        : /[A-Z]/.test(password) && /[0-9]/.test(password)
          ? 'strong'
          : 'medium'

  const strengthMeta = {
    weak:   { color: 'bg-red',        label: 'Weak (min. 8 chars)', width: 'w-1/3', textColor: 'text-red' },
    medium: { color: 'bg-yellow-400', label: 'Fair',                width: 'w-2/3', textColor: 'text-yellow-600' },
    strong: { color: 'bg-teal',       label: 'Strong',              width: 'w-full', textColor: 'text-teal' },
  }

  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== password

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail.endsWith('@ucc.edu.gh') && !normalizedEmail.endsWith('@stu.ucc.edu.gh')) {
      setError('Only UCC institutional emails (@ucc.edu.gh) are allowed.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/admin-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: fullName.trim(),
          email: normalizedEmail,
          password,
          adminKey: adminKey.trim(),
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

      router.push('/admin/login?setup=success')
    } catch (err) {
      console.error('Admin signup error:', err)
      setError('Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6 space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-navy/10 text-navy">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-navy">Super Admin Setup</h2>
        <p className="text-sm text-gray-500">
          Provision the master administrator account for the CEGRAD portal.
        </p>
      </div>

      {error ? (
        <AlertBox title="Setup Failed" variant="danger">
          {error}
        </AlertBox>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <FormField label="Full Name" required>
          <Input
            placeholder="e.g. CEGRAD Administrator"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
            disabled={isLoading}
            autoComplete="name"
          />
        </FormField>

        <FormField
          label="Admin Email"
          required
        >
          <Input
            type="email"
            placeholder="cegrad@ucc.edu.gh"
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
              placeholder="Create a strong password (min. 8 chars)"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              autoComplete="new-password"
              className="pr-11"
            />
            <TogglePasswordButton
              show={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
            />
          </div>
          {passwordStrength && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all ${strengthMeta[passwordStrength].color} ${strengthMeta[passwordStrength].width}`}
                />
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
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              disabled={isLoading}
              autoComplete="new-password"
              className="pr-11"
              error={confirmMismatch}
            />
            <TogglePasswordButton
              show={showConfirm}
              onToggle={() => setShowConfirm((prev) => !prev)}
            />
          </div>
        </FormField>

        <FormField
          label="Admin Setup Key"
          required
          hint="Master authorization key for initial portal setup."
        >
          <div className="relative">
            <Input
              type={showAdminKey ? 'text' : 'password'}
              placeholder="Enter secure admin setup key"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              required
              disabled={isLoading}
              autoComplete="off"
              className="pr-11"
            />
            <TogglePasswordButton
              show={showAdminKey}
              onToggle={() => setShowAdminKey((prev) => !prev)}
            />
          </div>
        </FormField>

        <Button
          type="submit"
          fullWidth
          disabled={isLoading || confirmMismatch}
          loading={isLoading}
          className="mt-2"
        >
          {isLoading ? 'Creating Account...' : 'Complete Super Admin Setup'}
        </Button>
      </form>

      <div className="mt-8 text-center text-[13px] text-gray-500">
        Already have an admin account?{' '}
        <Link
          href="/admin/login"
          className="font-semibold text-navy underline-offset-2 hover:underline"
        >
          Sign in to Admin Portal
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
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:outline-none"
      aria-label={show ? 'Hide value' : 'Show value'}
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </Button>
  )
}
