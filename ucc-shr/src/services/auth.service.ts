import { api } from './api'

export const authService = {
  login: async (data: any) => {
    return api.post('/auth/login', data)
  },
  signup: async (data: any) => {
    return api.post('/auth/signup', data)
  },
  adminSignup: async (data: any) => {
    return api.post('/auth/admin-signup', data)
  },
  forgotPassword: async (data: { email: string }) => {
    return api.post('/auth/forgot-password', data)
  },
  resetPassword: async (data: any) => {
    return api.post('/auth/reset-password', data)
  },
  resendVerification: async (data: { email: string }) => {
    return api.post('/auth/resend-verification', data)
  }
}
