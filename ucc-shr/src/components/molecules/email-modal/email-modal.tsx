'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EmailModal({ isOpen, onClose }: EmailModalProps) {
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEmailStatus("sending")
    // Mock API call
    setTimeout(() => {
      setEmailStatus("success")
      setTimeout(() => {
        onClose()
        setEmailStatus("idle")
      }, 2000)
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 text-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-xl font-bold text-navy">Send a Message</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {emailStatus === "success" ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-navy">Message Sent</h3>
                  <p className="mt-2 text-gray-600">
                    Thank you for reaching out. A CEGRAD representative will review your message and get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Name (Optional)</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                      placeholder="How should we call you?"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email Address <span className="text-red">*</span></label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">Message <span className="text-red">*</span></label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={emailStatus === "sending"}
                      className="w-full rounded-xl bg-navy py-3 text-center font-semibold text-white transition hover:bg-navy-dark disabled:opacity-70"
                    >
                      {emailStatus === "sending" ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
