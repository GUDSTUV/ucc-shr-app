'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSiteContent, updateSiteContentJson } from './actions'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { toast } from 'react-hot-toast'
import { Plus, Trash2, GripVertical, PhoneCall, HelpCircle } from 'lucide-react'

type FAQ = { question: string; answer: string }

type Props = {
  initialData: {
    contactEmail: string
    contactPhone: string
    contactAddress: string
    faqs: FAQ[]
  }
}

export function HelpContentForm({ initialData }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [faqs, setFaqs] = useState<FAQ[]>(initialData.faqs)

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }])
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index))
  const updateFaq = (index: number, field: keyof FAQ, value: string) => {
    const newFaqs = [...faqs]
    newFaqs[index][field] = value
    setFaqs(newFaqs)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      // 1. Update text fields
      const textEntries = ['contactEmail', 'contactPhone', 'contactAddress']
      const textResults = await Promise.all(
        textEntries.map(key => updateSiteContent(key, formData.get(key) as string))
      )

      // 2. Update JSON arrays
      const jsonRes = await updateSiteContentJson('faqs', faqs)

      if (textResults.every(r => r.success) && jsonRes.success) {
        toast.success('Help & Contacts updated successfully')
        router.refresh()
      } else {
        toast.error('Failed to save some content')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* CONTACT INFO SECTION */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <PhoneCall className="text-navy" size={24} />
          <div>
            <h2 className="text-lg font-medium text-navy">Contact Information</h2>
            <p className="mt-1 text-sm text-gray-500">Displayed in the footer and on the Help page.</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Input 
            label="Email Address"
            name="contactEmail"
            type="email"
            defaultValue={initialData.contactEmail}
            required
          />
          <Input 
            label="Phone Number"
            name="contactPhone"
            defaultValue={initialData.contactPhone}
            required
          />
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm font-medium text-gray-700">Office Address</label>
            <textarea 
              name="contactAddress"
              defaultValue={initialData.contactAddress}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy sm:text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* FAQS SECTION */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="text-navy" size={24} />
            <div>
              <h2 className="text-lg font-medium text-navy">Frequently Asked Questions</h2>
              <p className="mt-1 text-sm text-gray-500">Manage the FAQs displayed on the Home and Help pages.</p>
            </div>
          </div>
          <Button type="button" onClick={addFaq} variant="outline" size="sm" className="gap-2">
            <Plus size={16} /> Add FAQ
          </Button>
        </div>

        <div className="space-y-4 mt-6">
          {faqs.map((faq, index) => (
            <div key={index} className="flex gap-4 items-start rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="mt-2 text-gray-400 cursor-move"><GripVertical size={20} /></div>
              <div className="flex-1 space-y-3">
                <Input 
                  label="Question" 
                  value={faq.question} 
                  onChange={(e) => updateFaq(index, 'question', e.target.value)} 
                />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Answer</label>
                  <textarea 
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy sm:text-sm"
                  />
                </div>
              </div>
              <button type="button" onClick={() => removeFaq(index)} className="mt-8 text-red hover:text-red-dark">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {faqs.length === 0 && <p className="text-sm text-gray-500 italic">No FAQs added.</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Help Content'}
        </Button>
      </div>
    </form>
  )
}
