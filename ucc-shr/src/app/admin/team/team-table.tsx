'use client'

import { useState } from 'react'
import { Badge } from '@/src/components/atoms/badge'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { suspendAdmin, restoreAdmin, resetAdminPassword, deleteSuspendedAdmin } from './team-actions'
import { createAdminAccount } from './create-account-action'

type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  lastLoginAt?: Date | null
}

type TeamTableProps = {
  admins: AdminUser[]
  currentUserId: string
}

export function TeamTable({ admins, currentUserId }: TeamTableProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    const res = await createAdminAccount(formData)
    
    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(`Account for ${email} has been created successfully.`)
      e.currentTarget.reset()
    }
    setLoading(false)
  }

  async function handleSuspend(userId: string) {
    if (!confirm('Are you sure you want to suspend this admin? They will lose access to the portal.')) return
    
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await suspendAdmin(userId)
    
    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(`Admin has been suspended successfully.`)
    }
    setLoading(false)
  }

  async function handleRestore(userId: string) {
    if (!confirm('Are you sure you want to restore this admin? They will regain access to the portal.')) return
    
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await restoreAdmin(userId)
    
    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(`Admin has been restored successfully.`)
    }
    setLoading(false)
  }

  async function handleResetPassword(userId: string) {
    const newPassword = window.prompt("Enter the new password for this user (min 6 characters):")
    if (!newPassword) return

    setLoading(true)
    setError('')
    setSuccess('')

    const res = await resetAdminPassword(userId, newPassword)

    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(`Password has been successfully updated.`)
    }
    setLoading(false)
  }

  async function handleDelete(userId: string) {
    if (!confirm('WARNING: Are you absolutely sure you want to permanently delete this suspended account? This action cannot be undone.')) return
    
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await deleteSuspendedAdmin(userId)
    
    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(`Suspended account has been permanently deleted.`)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Create Admin Account</h2>
        <form onSubmit={handleCreate} className="flex flex-col md:flex-row items-end gap-3 max-w-4xl">
          <div className="flex-1 w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
            <Input 
              type="text" 
              name="name"
              placeholder="John Doe" 
              required
              disabled={loading}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">User Email</label>
            <Input 
              type="email" 
              name="email"
              placeholder="staff@stu.ucc.edu.gh" 
              required
              disabled={loading}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select 
              name="role"
              required
              disabled={loading}
              className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 transition-all focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ADMIN">Admin</option>
              <option value="COUNSELOR">Case Coordinator / Counselor</option>
              <option value="INVESTIGATOR">Investigator</option>
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">Temporary Password</label>
            <Input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>
        <p className="mt-2 text-xs text-gray-500">Provide these credentials to the new staff member so they can sign in.</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Current Admins</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-190 w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-[0.08em] text-gray-600">
                <th className="px-4 py-4 font-semibold">Name & Email</th>
                <th className="px-4 py-4 font-semibold">Role</th>
                <th className="px-4 py-4 font-semibold">Last Login</th>
                <th className="px-4 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-t border-gray-100 text-[15px]">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-900">{admin.name || 'No name'}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={
                      admin.role === 'SUPER_ADMIN' ? 'navy' : 
                      admin.role === 'SUSPENDED' ? 'error' : 
                      admin.role === 'COUNSELOR' ? 'success' :
                      admin.role === 'INVESTIGATOR' ? 'warning' : 'warning'
                    }>
                      {admin.role.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {admin.lastLoginAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(admin.lastLoginAt)) : 'Never'}
                  </td>
                  <td className="px-4 py-4 text-right space-x-2">
                    {admin.role !== 'SUPER_ADMIN' && admin.id !== currentUserId && admin.role !== 'SUSPENDED' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleSuspend(admin.id)}
                        disabled={loading}
                      >
                        Suspend
                      </Button>
                    )}
                    {admin.role === 'SUSPENDED' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRestore(admin.id)}
                          disabled={loading}
                        >
                          Restore Access
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(admin.id)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    {admin.role !== 'SUPER_ADMIN' && admin.id !== currentUserId && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleResetPassword(admin.id)}
                        disabled={loading}
                      >
                        Change Password
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
