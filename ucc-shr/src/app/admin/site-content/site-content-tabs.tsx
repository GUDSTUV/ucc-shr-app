'use client'

import { useState } from 'react'
import { SiteContentForm } from './site-content-form'
import { AboutContentForm } from './about-content-form'
import { AwarenessContentForm } from './awareness-content-form'
import { HelpContentForm } from './help-content-form'

type SiteContentTabsProps = {
  initialData: any
}

export function SiteContentTabs({ initialData }: SiteContentTabsProps) {
  const [activeTab, setActiveTab] = useState('home')

  const tabs = [
    { id: 'home', label: 'Home Page' },
    { id: 'about', label: 'About Page' },
    { id: 'awareness', label: 'Awareness Page' },
    { id: 'help', label: 'Help & Contacts' },
  ]

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                ${activeTab === tab.id
                  ? 'border-navy text-navy'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-2">
        {activeTab === 'home' && <SiteContentForm initialData={initialData} />}
        {activeTab === 'about' && <AboutContentForm initialData={initialData} />}
        {activeTab === 'awareness' && <AwarenessContentForm initialData={initialData} />}
        {activeTab === 'help' && <HelpContentForm initialData={initialData} />}
      </div>
    </div>
  )
}
