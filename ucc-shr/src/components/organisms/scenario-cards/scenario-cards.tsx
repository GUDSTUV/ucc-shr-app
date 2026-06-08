'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, AlertTriangle, HelpCircle, CheckCircle2 } from 'lucide-react'

const scenarios = [
  {
    situation: 'A lecturer repeatedly makes comments about a student\'s physical appearance during class, saying things like "You look too good to focus on studies."',
    question: 'Is this sexual harassment?',
    answer: 'Yes — this is verbal sexual harassment.',
    explanation: 'Repeated, unwelcome comments about someone\'s appearance in a professional or academic setting constitute verbal sexual harassment. The power dynamic between a lecturer and student makes this particularly serious. The student may feel unable to object due to fear of academic consequences.',
    whatToDo: [
      'Document the date, time, and exact words used.',
      'If safe, tell the lecturer the comments are unwelcome.',
      'Report the behaviour to CEGRAD through the reporting platform.',
      'You can report anonymously or with your contact details for follow-up.',
    ],
    isHarassment: true,
  },
  {
    situation: 'A classmate sends you repeated unsolicited messages on social media asking you out, even after you\'ve said you\'re not interested. They start commenting on all your posts and showing up at places they know you\'ll be.',
    question: 'Is this harassment or just persistence?',
    answer: 'Yes — this is digital harassment and stalking behaviour.',
    explanation: 'When someone continues to contact you after you\'ve clearly declined, and begins monitoring your movements and online activity, this crosses the line from interest into harassment and stalking. Consent includes the right to say no and have that respected.',
    whatToDo: [
      'Screenshot all messages and keep records of encounters.',
      'Block them on social media platforms.',
      'Tell a trusted friend or family member about the situation.',
      'File a report with CEGRAD — this behaviour can escalate.',
    ],
    isHarassment: true,
  },
  {
    situation: 'During a group study session, a fellow student accidentally brushes against your arm while reaching for a book and immediately apologizes.',
    question: 'Is this harassment?',
    answer: 'No — this is accidental contact, not harassment.',
    explanation: 'Accidental physical contact that is not sexual in nature and is immediately acknowledged with an apology does not constitute harassment. Intent, repetition, and context matter. A single, genuine accident is different from deliberate, unwanted touching.',
    whatToDo: [
      'Accept the apology — accidents happen.',
      'If it made you uncomfortable, it\'s okay to express that calmly.',
      'If similar "accidental" touching becomes a pattern, it may be intentional — then consider reporting.',
    ],
    isHarassment: false,
  },
  {
    situation: 'A senior student in your department tells you that they can help you pass an exam if you agree to go on a date with them. When you decline, they hint that things could "go badly" for you.',
    question: 'Is this a threat or just talk?',
    answer: 'Yes — this is quid pro quo sexual harassment.',
    explanation: 'Offering academic benefits in exchange for sexual or romantic favours is a serious form of sexual harassment known as "quid pro quo" (this for that). The implied threat of negative consequences for refusing makes it even more severe. This is a violation of UCC policy regardless of whether the person follows through.',
    whatToDo: [
      'Do not agree to any conditions — you are not obligated.',
      'Save any messages or record what was said (date, time, location).',
      'Report immediately to CEGRAD — this is a serious offence.',
      'Seek support from the university\'s counselling services.',
    ],
    isHarassment: true,
  },
]

function ScenarioCard({
  scenario,
  index,
}: {
  scenario: typeof scenarios[number]
  index: number
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Scenario Header */}
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
            {index + 1}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-navy/60">Scenario</span>
        </div>
        <p className="text-sm leading-relaxed text-gray-700">
          {scenario.situation}
        </p>
      </div>

      {/* Question / CTA */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={`scenario-answer-${index}`}
        className="flex w-full items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 text-left transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy"
      >
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-navy" />
          <span className="text-sm font-semibold text-navy">{scenario.question}</span>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-navy transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Answer Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`scenario-answer-${index}`}
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-6 pb-6 pt-5">
              {/* Verdict */}
              <div
                className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                  scenario.isHarassment
                    ? 'bg-red/10 text-red'
                    : 'bg-green-50 text-green-700'
                }`}
              >
                {scenario.isHarassment ? (
                  <AlertTriangle size={14} />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                {scenario.answer}
              </div>

              {/* Explanation */}
              <p className="text-sm leading-relaxed text-gray-600">
                {scenario.explanation}
              </p>

              {/* What to do */}
              <div className="mt-4">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-navy">
                  What should you do?
                </h4>
                <ul className="space-y-2">
                  {scenario.whatToDo.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function ScenarioCards() {
  return (
    <section className="bg-gray-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-navy">
            Real-Life Situations
          </span>
          <h2 className="mt-2 text-3xl font-bold text-navy lg:text-4xl">
            What Would You Do?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
            Read through these campus scenarios and test your understanding. Click each question to see the answer and learn how to respond.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl items-start gap-5 md:grid-cols-2">
          {scenarios.map((scenario, i) => (
            <ScenarioCard key={i} scenario={scenario} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
