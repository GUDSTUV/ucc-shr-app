'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, User as UserIcon, Shield, RefreshCw } from 'lucide-react'
import { Button } from '@/src/components/atoms/button'
import { Textarea } from '@/src/components/atoms/textarea'

type Message = {
  id: string
  content: string
  createdAt: string
  senderId: string
  senderName: string
  senderRole: 'STAFF' | 'SUPER_ADMIN' | 'USER' | string
  isMe: boolean
}

type ReportChatProps = {
  reportCode: string
  isAssignedCounsellor?: boolean
}

export function ReportChat({ reportCode, isAssignedCounsellor = false }: ReportChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [content, setContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(reportCode)}/messages`)
      const data = await res.json()

      if (res.ok && data.ok) {
        setMessages(data.messages)
        setError(null)
      } else {
        // If 403, we don't show the chat
        if (res.status === 403) {
          setError('Access denied')
        } else {
          setError('Failed to load messages.')
        }
      }
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    // Optional: Add polling here if needed, e.g., setInterval
    const interval = setInterval(fetchMessages, 10000)
    return () => clearInterval(interval)
  }, [reportCode])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || sending) return

    setSending(true)
    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(reportCode)}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()

      if (res.ok && data.ok) {
        setMessages((prev) => [...prev, data.message])
        setContent('')
      } else {
        alert(data.error || 'Failed to send message.')
      }
    } catch {
      alert('Network error while sending.')
    } finally {
      setSending(false)
    }
  }

  if (error === 'Access denied') {
    return null // Hide chat if the user/staff is not assigned to this report
  }

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden h-[500px]">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-700">Messages</h3>
        <button 
          onClick={fetchMessages}
          className="text-gray-400 hover:text-navy transition-colors"
          title="Refresh messages"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {loading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 mb-3">
              <Shield className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700">No messages yet</p>
            <p className="mt-1 text-xs text-gray-500 max-w-[200px]">
              This is a secure channel between the reporter and the assigned counsellor.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className="mb-1 flex items-center gap-1.5 px-1">
                  {!msg.isMe && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      {msg.senderRole === 'SUPER_ADMIN' || msg.senderRole === 'STAFF' ? 'CEGRAD Staff' : 'Reporter'}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400">
                    {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(msg.createdAt))}
                  </span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.isMe
                      ? 'rounded-tr-sm bg-navy text-white'
                      : 'rounded-tl-sm bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-100 bg-gray-50 p-3">
        <form onSubmit={handleSend} className="flex gap-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message securely..."
            className="min-h-[44px] max-h-32 resize-none rounded-xl text-sm"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(e)
              }
            }}
          />
          <Button
            type="submit"
            disabled={!content.trim() || sending}
            className="h-auto shrink-0 rounded-xl px-4"
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  )
}
