import { AdminLayout } from '@/src/components/templates/admin-layout'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { SiteContentTabs } from './site-content-tabs'

export default async function SiteContentPage() {
  await requireSuperAdmin()

  // Fetch existing content
  const contentRecords = await prisma.siteContent.findMany()
  
  // Convert array to a key-value object
  const contentMap = contentRecords.reduce((acc, record) => {
    acc[record.key] = record.value as any
    return acc
  }, {} as Record<string, any>)

  // Default structure if empty
  const defaultContent = {
    heroTitle: contentMap['heroTitle'] || 'Confidential Support & Reporting',
    heroSubtitle: contentMap['heroSubtitle'] || 'A safe space to report sexual harassment and receive support at the University of Cape Coast.',
    contactEmail: contentMap['contactEmail'] || 'cegrad@ucc.edu.gh',
    contactPhone: contentMap['contactPhone'] || '+233 (0) 33 213 2440',
    contactAddress: contentMap['contactAddress'] || 'CEGRAD Office, University of Cape Coast, Cape Coast, Ghana',
    footerText: contentMap['footerText'] || '© 2026 CEGRAD UCC. All rights reserved. Providing a safe and confidential reporting environment for the university community.',
    
    // Arrays and JSON
    aboutCarousel: Array.isArray(contentMap['aboutCarousel']) ? contentMap['aboutCarousel'] : [
      {
        url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
        caption: "UCC Campus - Empowering the community"
      }
    ],
    aboutBoard: Array.isArray(contentMap['aboutBoard']) ? contentMap['aboutBoard'] : [
      {
        name: "Prof. Jane Doe",
        role: "Chairperson",
        bio: "Professor of Gender Studies with over 20 years of experience in advocacy and policy development.",
        imageUrl: "",
        initials: "JD",
      }
    ],
    awarenessBanner: typeof contentMap['awarenessBanner'] === 'string' ? contentMap['awarenessBanner'] : '',
    awarenessVideoUrl: typeof contentMap['awarenessVideoUrl'] === 'string' ? contentMap['awarenessVideoUrl'] : '',
    faqs: Array.isArray(contentMap['faqs']) ? contentMap['faqs'] : [
      {
        question: "Is my report completely confidential?",
        answer: "Yes, all reports are handled with the strictest confidence."
      }
    ]
  }

  return (
    <AdminLayout 
      title="Site Content CMS" 
      description="Update text, images, and dynamic lists displayed on the public frontend pages."
    >
      <SiteContentTabs initialData={defaultContent} />
    </AdminLayout>
  )
}
