import { Suspense } from 'react'
import ResetPasswordForm from './resetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
