import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock3, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import { Button } from '@/src/components/atoms/button'
import { Heading } from '@/src/components/atoms/heading'
import { Text } from '@/src/components/atoms/text'
// events/faq/feedback sections removed to avoid missing-module errors

interface HomePageContentProps {
  reportHref: string
}

const quickActions = [
  {
    title: 'Report Incident',
    description: 'Submit an official report to CEGRAD quickly and securely.',
    href: 'REPORT_LINK',
  },
  {
    title: 'Learn Your Rights',
    description: 'Understand student, staff, and survivor protections.',
    href: '#rights',
  },
  {
    title: 'Awareness Hub',
    description: 'Educational resources on harassment prevention and response.',
    href: '#awareness',
  },
  {
    title: 'Contact CEGRAD',
    description: 'Reach the CEGRAD team for guidance and support.',
    href: '#contact',
  },
]

const awarenessCards = [
  {
    title: 'What is sexual harassment?',
    description: 'Clear definitions and how harassment can appear in campus settings.',
  },
  {
    title: 'Types of harassment',
    description: 'Verbal, physical, online, and abuse of authority examples.',
  },
  {
    title: 'Impact on survivors',
    description: 'Understand the emotional, academic, and social effects.',
  },
  {
    title: 'Why reporting matters',
    description: 'Supports accountability, safety, and prevention efforts.',
  },
]

const rightsItems = [
  'Rights of students',
  'Rights of staff',
  'Rights of victims',
  'Responsibilities of the university community',
  'Protection against harassment',
]

const reportingSteps = [
  'Submit a report',
  'Case review',
  'Investigation process',
  'Appropriate action',
]

const campaignItems = [
  'Current awareness campaigns and campus initiatives',
  'Educational outreach and training programs',
  'Advocacy programs and support partnerships',
  'Community engagement activities',
]

const eventItems = [
  'Awareness seminars',
  'Educational workshops',
  'Gender advocacy events',
  'Campus programs and dialogues',
]

const contactCards = [
  {
    icon: MapPin,
    title: 'Office Location',
    lines: [
      'Centre for Gender Research, Advocacy and Documentation (CEGRAD)',
      'University of Cape Coast',
      'Cape Coast, Ghana',
    ],
  },
  {
    icon: Phone,
    title: 'Phone',
    lines: ['Main Line: +233 (0) 332 137 974', 'Emergency: +233 (0) XXX XXX XXX'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['General Inquiries: info@cegrad.ucc.edu.gh', 'Report Incident: report@cegrad.ucc.edu.gh'],
  },
  {
    icon: Clock3,
    title: 'Office Hours',
    lines: ['Monday – Friday: 8:00 AM – 5:00 PM', 'Saturday: 9:00 AM – 1:00 PM', 'Sunday: Closed'],
  },
]

const contactLinks = [
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
]

function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 rounded-3xl bg-navy-dark px-4 py-12 text-white shadow-xl shadow-navy/20 sm:px-6 lg:px-8 font-sans"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="space-y-3 text-center">
          <Text as="p" size="sm" weight="semibold" tone="light" className="uppercase tracking-[0.24em] text-navy-light">
            Contact CEGRAD
          </Text>
          <Heading as="h2" size="4xl" tone="white" className="leading-tight">
            Reach us for support, guidance, and reporting
          </Heading>
          <Text size="base" tone="light" className="mx-auto max-w-3xl sm:text-lg">
            We are here to help students, staff, and visitors with information, outreach, and incident reporting.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 gap-4">
            {contactCards.map(({ icon: Icon, title, lines }) => (
              <article key={title} className="rounded-2xl border border-navy-light/10 bg-navy/70 p-5 shadow-lg shadow-black/10 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-light/10 text-navy-light">
                    <Icon size={18} />
                  </span>
                  <div className="space-y-2">
                    <Heading as="h3" size="xl" tone="white" weight="semibold">
                      {title}
                    </Heading>
                    <div className="space-y-1">
                      {lines.map((line) => (
                        <Text key={line} as="p" size="sm" tone="light" className="leading-relaxed">
                          {line}
                        </Text>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-navy-light/10 bg-navy/70 shadow-lg shadow-black/10">
              <div className="grid min-h-60 place-items-center px-6 py-10 text-center sm:px-10">
                <div className="space-y-4">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-navy-light/15 bg-navy-light/10 text-navy-light">
                    <MapPin size={28} />
                  </span>
                  <div className="space-y-2">
                    <Heading as="h3" size="2xl" tone="white" weight="semibold">
                      Campus Map Location
                    </Heading>
                    <Text size="sm" tone="light">
                      Visit us at the CEGRAD office on main campus.
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-navy-light/10 bg-navy/70 p-5 shadow-lg shadow-black/10">
                <Heading as="h3" size="xl" tone="white" weight="semibold">
                  Connect With Us
                </Heading>
                <div className="mt-4 flex flex-wrap gap-3">
                  {contactLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center rounded-xl bg-navy-light/10 text-navy-light transition hover:bg-navy-light hover:text-navy"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-red/20 bg-red/20 p-5 shadow-lg shadow-black/10">
                <Heading as="h3" size="xl" tone="white" weight="semibold">
                  Emergency Contacts
                </Heading>
                <div className="mt-4 space-y-2">
                  <Text size="sm" tone="light">
                    If you are in immediate danger, please contact emergency services.
                  </Text>
                  <div className="space-y-1">
                    <Text size="sm" tone="white" weight="semibold">
                      Campus Security: +233 XXX XXX XXX
                    </Text>
                    <Text size="sm" tone="white" weight="semibold">
                      Ghana Police: 191
                    </Text>
                    <Text size="sm" tone="white" weight="semibold">
                      Medical Emergency: 112
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-navy-light/10 bg-navy/70 px-5 py-4 text-center sm:flex-row sm:text-left">
          <div className="space-y-1">
            <Heading as="h3" size="xl" tone="white" weight="semibold">
              Need immediate support?
            </Heading>
            <Text size="sm" tone="light">
              Report an incident or request help from the CEGRAD team.
            </Text>
          </div>
          <Link
            href="/report"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy-light px-5 py-3 text-sm font-semibold text-navy transition hover:bg-white"
          >
            Report Incident
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}



export function HomePageContent({ reportHref }: HomePageContentProps) {
  return (
    <div className="space-y-12 pb-16">
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-6 w-screen bg-navy-dark text-white">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20">
          <Heading
            as="h1"
            size="3xl"
            tone="white"
            className="mt-6 max-w-4xl leading-tight sm:text-4xl lg:text-5xl"
          >
            Creating a Safe and Respectful Campus Environment
          </Heading>
          <Text
            size="base"
            tone="light"
            className="mt-4 max-w-2xl sm:text-lg"
          >
            Centre for Gender Research, Advocacy and Documentation (CEGRAD) is committed to preventing sexual harassment and promoting gender equity at the University of Cape Coast.
          </Text>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={reportHref}>
              <Button variant="report" size="lg">Report Incident</Button>
            </Link>
            <Link href="#rights">
              <Button
                variant="outline"
                size="lg"
                className="border-navy-light text-navy-light hover:bg-navy-dark"
              >
                Learn Your Rights
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* (Events/Campaigns, FAQ, and Review sections were removed temporarily) */}
      {/* Contact */}
      <ContactSection />
    </div>
  )
}
