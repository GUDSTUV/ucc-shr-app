'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
import { Heading } from '../../atoms/heading/heading'
import { Text } from '../../atoms/text/text'
import { Button } from '../../atoms/button/button'
import { Input } from '../../atoms/input/input'
import { Textarea } from '../../atoms/textarea/textarea'

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
              <Heading size="xl" weight="bold" tone="navy">Send a Message</Heading>
              <Button
                variant="unstyled"
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="p-6">
              {emailStatus === "success" ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 size={32} />
                  </div>
                  <Heading as="h3" size="xl" weight="bold" tone="navy" className="mt-4">Message Sent</Heading>
                  <Text tone="muted" className="mt-2 text-center">
                    Thank you for reaching out. A CEGRAD representative will review your message and get back to you shortly.
                  </Text>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <Text as="label" htmlFor="name" size="sm" weight="medium" className="mb-1 block text-gray-700">Name (Optional)</Text>
                    <Input
                      type="text"
                      id="name"
                      placeholder="How should we call you?"
                    />
                  </div>
                  <div>
                    <Text as="label" htmlFor="email" size="sm" weight="medium" className="mb-1 block text-gray-700">Email Address <span className="text-red">*</span></Text>
                    <Input
                      type="email"
                      id="email"
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <Text as="label" htmlFor="message" size="sm" weight="medium" className="mb-1 block text-gray-700">Message <span className="text-red">*</span></Text>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="How can we help you?"
                    />
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      fullWidth
                      loading={emailStatus === "sending"}
                    >
                      {emailStatus === "sending" ? "Sending..." : "Send Message"}
                    </Button>
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
