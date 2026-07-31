'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input/input'
import { Textarea } from '@/src/components/atoms/textarea/textarea'
import { Text } from '@/src/components/atoms/text/text'
import { Heading } from '@/src/components/atoms/heading/heading'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    
    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setStatus('success')
        form.reset()
        // Reset success state after a few seconds so they can send another if needed
        setTimeout(() => setStatus('idle'), 4000)
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }



  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div>
        <Text as="label" htmlFor="contact-name" size="sm" weight="regular" tone="white" className="mb-1 block opacity-80">
          Name <span className="text-red-300">*</span>
        </Text>
        <Input type="text" id="contact-name" name="name" required placeholder="Your name" className="text-navy placeholder:text-gray-500" />
      </div>
      <div>
        <Text as="label" htmlFor="contact-email" size="sm" weight="regular" tone="white" className="mb-1 block opacity-80">
          Email Address <span className="text-red-300">*</span>
        </Text>
        <Input type="email" id="contact-email" name="email" required placeholder="you@example.com" className="text-navy placeholder:text-gray-500" />
      </div>
      <div>
        <Text as="label" htmlFor="contact-phone" size="sm" weight="regular" tone="white" className="mb-1 block opacity-80">
          Phone Number (Optional)
        </Text>
        <Input type="tel" id="contact-phone" name="phone" placeholder="e.g., 020 123 4567" className="text-navy placeholder:text-gray-500" />
      </div>
      <div>
        <Text as="label" htmlFor="contact-message" size="sm" weight="regular" tone="white" className="mb-1 block opacity-80">
          Message <span className="text-red-300">*</span>
        </Text>
        <Textarea id="contact-message" name="message" required rows={5} placeholder="How can we help you?" className="text-navy placeholder:text-gray-500" />
      </div>
      <div className="pt-2">
        <Button type="submit" variant="report" size="md" loading={status === 'sending'} className="min-w-40 font-normal">
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </Button>
      </div>
      {status === 'success' && (
        <div className="flex items-center gap-2 text-base text-green-200 mt-4">
          <CheckCircle2 size={18} />
          <span>Message sent successfully.</span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-base text-red-300 mt-4">
          <span>Failed to send message. Please try again.</span>
        </div>
      )}
    </form>
  )
}
