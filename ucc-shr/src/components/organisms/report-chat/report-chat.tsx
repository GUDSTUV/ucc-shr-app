'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Shield, RefreshCw, CheckCheck, Clock } from 'lucide-react'
import { Button } from '@/src/components/atoms/button'
import { Textarea } from '@/src/components/atoms/textarea'
import { Text } from '@/src/components/atoms/text/text'

type Message = {
  id: string
  content: string
  createdAt: string
  senderId: string
  senderName: string
  senderRole: 'STAFF' | 'SUPER_ADMIN' | 'USER' | string
  isMe: boolean
  isPending?: boolean
}

type ReportChatProps = {
  reportCode: string
  isAssignedCounsellor?: boolean
}

export function ReportChat({ reportCode, isAssignedCounsellor = false }: ReportChatProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [content, setContent] = useState('')
  const [isLiveActive, setIsLiveActive] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const previousMessageCount = useRef(0)

  const fetchMessages = useCallback(async (isSilent = false) => {
    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(reportCode)}/messages`)
      const data = await res.json()

      if (res.ok && data.ok) {
        setMessages((prev) => {
          // Retain any pending messages that are still sending
          const pending = prev.filter((m) => m.isPending)
          const fetchedIds = new Set(data.messages.map((m: Message) => m.id))
          const nonDuplicatedPending = pending.filter(
            (p) => !data.messages.some((m: Message) => m.content === p.content && Math.abs(new Date(m.createdAt).getTime() - new Date(p.createdAt).getTime()) < 10000)
          )
          return [...data.messages, ...nonDuplicatedPending]
        })
        setError(null)
      } else {
        if (res.status === 403) {
          setError('Access denied')
        } else if (!isSilent) {
          setError('Failed to load messages.')
        }
      }
    } catch {
      if (!isSilent) {
        setError('Network error.')
      }
    } finally {
      setLoading(false)
    }
  }, [reportCode])

  // Fast smart polling (2.5 seconds when active, 15s when inactive)
  useEffect(() => {
    fetchMessages()

    let intervalId: NodeJS.Timeout

    const startPolling = () => {
      clearInterval(intervalId)
      const delay = document.visibilityState === 'visible' ? 2500 : 15000
      setIsLiveActive(document.visibilityState === 'visible')
      intervalId = setInterval(() => {
        fetchMessages(true)
      }, delay)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchMessages(true)
      }
      startPolling()
    }

    const handleFocus = () => {
      fetchMessages(true)
    }

    startPolling()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [fetchMessages])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > previousMessageCount.current) {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    }
    previousMessageCount.current = messages.length
  }, [messages.length])

  // Instant Optimistic Send
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || sending) return

    const tempId = `temp-${Date.now()}`
    const optimisticMessage: Message = {
      id: tempId,
      content: trimmed,
      createdAt: new Date().toISOString(),
      senderId: 'me',
      senderName: 'You',
      senderRole: isAssignedCounsellor ? 'STAFF' : 'USER',
      isMe: true,
      isPending: true,
    }

    // 1. Immediately show message in chat (0ms)
    setMessages((prev) => [...prev, optimisticMessage])
    setContent('')
    setSending(true)

    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(reportCode)}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed }),
      })
      const data = await res.json()

      if (res.ok && data.ok) {
        // 2. Replace optimistic message with confirmed server message
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? { ...data.message, isPending: false } : msg))
        )
      } else {
        // Rollback optimistic message on failure
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId))
        alert(data.error || 'Failed to send message.')
        setContent(trimmed)
      }
    } catch {
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId))
      alert('Network error while sending.')
      setContent(trimmed)
    } finally {
      setSending(false)
    }
  }

  if (error === 'Access denied') {
    return null
  }

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden h-[500px]">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Text as="h3" size="sm" weight="semibold" tone="muted" className="uppercase tracking-[0.12em] text-gray-700">
            Messages
          </Text>
          <div className="flex items-center gap-1.5 pl-2">
            <span className={`h-2 w-2 rounded-full ${isLiveActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-[11px] font-medium text-gray-500">Live</span>
          </div>
        </div>
        <Button 
          variant="unstyled"
          onClick={() => fetchMessages(false)}
          className="text-gray-400 hover:text-navy transition-colors p-1"
          title="Refresh messages now"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white scroll-smooth">
        {loading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 mb-3">
              <Shield className="h-6 w-6 text-gray-400" />
            </div>
            <Text as="p" size="sm" weight="medium" className="text-gray-700">No messages yet</Text>
            <Text as="p" size="xs" tone="muted" className="mt-1 max-w-[200px]">
              This is a secure channel between the reporter and the assigned case officer.
            </Text>
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
                    <Text as="span" size="xs" weight="semibold" tone="muted" className="text-[10px] uppercase tracking-wider">
                      {['SUPER_ADMIN', 'ADMIN', 'COUNSELOR', 'INVESTIGATOR'].includes(msg.senderRole) ? 'CEGRAD Staff' : 'Reporter'}
                    </Text>
                  )}
                  <Text as="span" size="xs" tone="muted" className="text-[10px] text-gray-400 flex items-center gap-1">
                    {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(msg.createdAt))}
                    {msg.isMe && (
                      msg.isPending ? <Clock size={10} className="text-gray-400" /> : <CheckCheck size={12} className="text-navy/70" />
                    )}
                  </Text>
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.isMe
                      ? `rounded-tr-sm bg-navy text-white ${msg.isPending ? 'opacity-70' : ''}`
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
