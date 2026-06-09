"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/src/components/molecules/form-field'
import { Input } from '@/src/components/atoms/input'
import { Button } from '@/src/components/atoms/button'
import { AlertBox } from '@/src/components/molecules/alert-box'
import { Eye, EyeOff } from 'lucide-react'

export default function ChangePasswordForm() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      setSuccess('Password successfully updated.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <AlertBox variant="danger">{error}</AlertBox>}
      {success && <AlertBox variant="success">{success}</AlertBox>}

      <FormField label="Current Password" required>
        <div className="relative">
          <Input
            type={showPasswords ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isLoading}
            required
            className="pr-10"
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

      <FormField label="New Password" required>
        <div className="relative">
          <Input
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            required
            className="pr-10"
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

      <FormField label="Confirm New Password" required>
        <div className="relative">
          <Input
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
            className="pr-10"
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

      <div className="pt-2">
        <Button type="submit" fullWidth disabled={isLoading} loading={isLoading}>
          Change Password
        </Button>
      </div>
    </form>
  )
}
