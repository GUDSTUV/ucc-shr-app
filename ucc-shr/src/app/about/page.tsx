"use client"

import { useState } from 'react'
import { PublicLayout } from '@/src/components/templates/public-layout'
import { ChevronRight, FileText, HelpCircle, Info, Shield } from 'lucide-react'

const legalItems = [
  {
    id: 'mission-vision-core-values',
    title: 'Mission, Vision & Core Values',
    description: 'Read CEGRAD\'s mission, vision, and guiding core values.',
    icon: <FileText className="h-5 w-5" />,
    content: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-600">
        <div>
          <p className="font-semibold text-navy">Mission</p>
          <p className="mt-1">
            To engage in theory and practice to position the University of Cape Coast as a leader in gender equality
            and women&apos;s rights within the academy and beyond.
          </p>
        </div>

        <div>
          <p className="font-semibold text-navy">Vision</p>
          <p className="mt-1">
            Create a safe, creative and inclusive space where gender and women&apos;s rights are fully protected.
          </p>
        </div>

        <div>
          <p className="font-semibold text-navy">Core Values</p>
          <ul className="mt-2 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
              <span>Create a gender equal and inclusive learning and work environment.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
              <span>
                Deliver professional services that are responsive to the needs of all genders in the university
                community and beyond.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
              <span>Ensure equal opportunities for all constituents in the university.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
              <span>Ensure a sexual and gender-based violence free university.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
              <span>Institutional integrity.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'about-application',
    title: 'About Application',
    description: 'Find details on the purpose, features, and how this platform works.',
    icon: <Info className="h-5 w-5" />,
    content:
      'This platform is built to help prevent and respond to sexual harassment through safe, anonymous reporting, survivor-centered support, and campus-wide awareness creation. Users can submit incidents confidentially, access guidance and referral resources, and follow trusted reporting pathways that promote accountability, dignity, and a safer learning environment for everyone.',
  },
  {
    id: 'privacy',
    title: 'Privacy',
    description: 'Learn how we collect, use, and protect your personal information.',
    icon: <Shield className="h-5 w-5" />,
    content:
      'Personal information is handled with care and only used for case support, communication, and platform safety improvements. Access is restricted to authorized teams.',
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Find answers to common questions and quick guides for using the app.',
    icon: <HelpCircle className="h-5 w-5" />,
    content: (
      <div className="space-y-3 text-sm text-gray-600">
        <div>
          <p className="font-semibold text-navy">Will my name be shown?</p>
          <p className="mt-1 leading-relaxed">
            No. If you submit anonymously, identifying details are hidden from regular case review and only
            authorized CEGRAD staff can access protected information when required for safety.
          </p>
        </div>

        <div>
          <p className="font-semibold text-navy">Can I edit my report?</p>
          <p className="mt-1 leading-relaxed">
            Yes. You can add updates or corrections using your report tracking code from the Track page.
          </p>
        </div>

        <div>
          <p className="font-semibold text-navy">What happens after submission?</p>
          <p className="mt-1 leading-relaxed">
            Your report is logged securely, reviewed by the support team, and assigned for action. You can monitor
            progress with your tracking code.
          </p>
        </div>

        <div>
          <p className="font-semibold text-navy">Will my report stay confidential?</p>
          <p className="mt-1 leading-relaxed">
            Reports are treated as confidential records and only shared on a need-to-handle basis according to CEGRAD
            policy.
          </p>
        </div>

        <div>
          <p className="font-semibold text-navy">Can I report for someone else?</p>
          <p className="mt-1 leading-relaxed">
            Yes. You may submit as a witness and include as much factual detail as possible for proper follow-up.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'policies',
    title: 'Policies',
    description: 'Read platform rules, safety standards, and terms of use.',
    icon: <FileText className="h-5 w-5" />,
    content:
      'Policies cover acceptable use, data responsibility, respectful communication, and consequences for misuse of reports or platform features.',
  },
]

export default function AboutPage() {
  const [openItem, setOpenItem] = useState(() => {
    if (typeof window === 'undefined') {
      return legalItems[0].id
    }

    const hash = window.location.hash.replace('#', '')
    const exists = legalItems.some((item) => item.id === hash)
    return exists ? hash : legalItems[0].id
  })

  const toggleItem = (itemId: string) => {
    setOpenItem((current) => (current === itemId ? '' : itemId))
  }

  return (
    <PublicLayout>
      <section className="mx-auto w-full max-w-md pb-6">
        <h1 className="text-center text-3xl font-bold text-navy">Legal</h1>
        <p className="mt-1 text-center text-sm text-gray-500">Important information and support resources.</p>
      </section>

      <section className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
        {legalItems.map((item, index) => (
          <article
            key={item.id}
            className={`${index < legalItems.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-expanded={openItem === item.id}
              aria-controls={`${item.id}-panel`}
              className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-gray-50"
            >
              <span className="grid h-10 w-10 shrink-0 place-content-center rounded-xl bg-navy-light text-navy">
                {item.icon}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold text-navy">{item.title}</span>
                <span className="mt-0.5 block text-sm text-gray-500">{item.description}</span>
              </span>

              <ChevronRight
                className={`h-5 w-5 shrink-0 text-gray-300 transition-transform duration-300 ${
                  openItem === item.id ? 'rotate-90' : ''
                }`}
              />
            </button>

            <div
              id={`${item.id}-panel`}
              className={`grid transition-all duration-300 ease-out ${openItem === item.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 pl-18 text-sm text-gray-600">
                  {typeof item.content === 'string' ? <p>{item.content}</p> : item.content}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </PublicLayout>
  )
}
