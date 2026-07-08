import { api } from './api'

export const reportsService = {
  submitReport: async (data: any) => {
    return api.post('/reports', data)
  },
  getReportByCode: async (code: string) => {
    return api.get(`/reports/${encodeURIComponent(code)}`)
  },
  getReportMessages: async (code: string) => {
    return api.get(`/reports/${encodeURIComponent(code)}/messages`)
  },
  sendReportMessage: async (code: string, data: { content: string, fileUrl?: string }) => {
    return api.post(`/reports/${encodeURIComponent(code)}/messages`, data)
  },
  adminUpdateReport: async (code: string, data: any) => {
    return api.patch(`/admin/reports/${encodeURIComponent(code)}`, data)
  }
}
