import { AdminLayout } from '@/src/components/templates/admin-layout'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { SiteContentTabs } from './site-content-tabs'

export default async function SiteContentPage() {
  await requireSuperAdmin()

  // Fetch existing content
  const contentRecords = await prisma.siteContent.findMany()
  
  // Convert array to a key-value object
  const contentMap = contentRecords.reduce((acc: Record<string, unknown>, record: { key: string; value: unknown }) => {
    acc[record.key] = record.value
    return acc
  }, {} as Record<string, unknown>)

  // Default structure if empty — validate shapes where necessary
  const defaultContent = {
    heroTitle: typeof contentMap['heroTitle'] === 'string' ? contentMap['heroTitle'] : 'Confidential Support & Reporting',
    heroSubtitle: typeof contentMap['heroSubtitle'] === 'string' ? contentMap['heroSubtitle'] : 'A safe space to report sexual harassment and receive support at the University of Cape Coast.',
    contactEmail: typeof contentMap['contactEmail'] === 'string' ? contentMap['contactEmail'] : 'cegrad@ucc.edu.gh',
    contactPhone: typeof contentMap['contactPhone'] === 'string' ? contentMap['contactPhone'] : '+233 (0) 33 213 2440',
    contactAddress: typeof contentMap['contactAddress'] === 'string' ? contentMap['contactAddress'] : 'CEGRAD Office, University of Cape Coast, Cape Coast, Ghana',
    footerText: typeof contentMap['footerText'] === 'string' ? contentMap['footerText'] : '© 2026 CEGRAD UCC. All rights reserved. Providing a safe and confidential reporting environment for the university community.',

    // Arrays and JSON — keep as unknown[] but provide sensible defaults
    aboutCarousel: Array.isArray(contentMap['aboutCarousel']) ? (contentMap['aboutCarousel'] as unknown[]) : [
      {
        url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
        caption: "UCC Campus - Empowering the community"
      }
    ],
    aboutBoard: Array.isArray(contentMap['aboutBoard']) ? (contentMap['aboutBoard'] as unknown[]) : [
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
    faqs: Array.isArray(contentMap['faqs']) ? (contentMap['faqs'] as unknown[]) : [
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
      <SiteContentTabs initialData={defaultContent as any} />
    </AdminLayout>
  )
}
