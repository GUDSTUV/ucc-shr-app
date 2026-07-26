'use client'

import { useState } from 'react'
import { Mail, Send, X, FileText } from 'lucide-react'
import { Button } from '@/src/components/atoms/button/button'
import { Input } from '@/src/components/atoms/input/input'
import { Textarea } from '@/src/components/atoms/textarea/textarea'

type ReportEmailFormProps = {
  reportCode: string
  reporterEmail: string
}

export function ReportEmailForm({ reportCode, reporterEmail }: ReportEmailFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return

    setIsSending(true)
    setStatusMsg(null)

    try {
      const res = await fetch(`/api/admin/reports/${encodeURIComponent(reportCode)}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: 'Email sent successfully!' })
        setSubject('')
        setMessage('')
        setTimeout(() => setIsOpen(false), 2000)
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to send email.' })
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Network error occurred.' })
    } finally {
      setIsSending(false)
    }
  }

  const applyInterviewTemplate = () => {
    setSubject(`Invitation for Discussion: Case ${reportCode}`)
    setMessage(`Dear [Complainant Name],\n\nWe hope this message finds you well.\n\nThis email is to acknowledge that your report submitted through the CEGRAD-UCC Sexual Harassment Reporting System has been reviewed.\n\nYou are kindly invited to meet to discuss your report further and provide any additional information that may assist with the investigation process.\n\n**Meeting Details:**\n\nDate: [Insert Date]\nTime: [Insert Time]\nVenue: [Insert Venue]\n\nThe discussion will be handled with the utmost confidentiality and respect. You are encouraged to share any concerns or information you feel is relevant, and you may ask any questions regarding the process during the meeting.\n\nIf you are unable to attend at the scheduled time, please contact us [contacts] or reply to this email so that an alternative arrangement can be made.\n\nYour safety, privacy, and well-being remain our priority.\n\nKind regards,\n[Case Officer Name]\n[Position/Role]\nCEGRAD-UCC\n[Contact Information]`)
  }

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
      {!isOpen ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">Email Communication</p>
            <p className="text-xs text-gray-500 mt-0.5">Send a direct email to the reporter ({reporterEmail})</p>
          </div>
          <Button size="sm" onClick={() => setIsOpen(true)} className="gap-2">
            <Mail size={14} /> Send Email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSendEmail} className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Mail size={14} className="text-navy" /> Compose Email to Reporter
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>

          {statusMsg && (
            <div className={`rounded-md p-3 text-sm ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {statusMsg.text}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={applyInterviewTemplate} className="gap-2 text-xs">
              <FileText size={12} /> Insert Invite Template
            </Button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              required
              disabled={isSending}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              required
              disabled={isSending}
              rows={6}
              className="text-sm resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSending} className="gap-2">
              <Send size={14} />
              {isSending ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
