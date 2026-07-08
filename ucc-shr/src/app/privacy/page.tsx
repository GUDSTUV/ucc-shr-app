import { Footer } from '@/src/components/organisms/Footer'
import { Metadata } from 'next'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'

export const metadata: Metadata = {
  title: 'Privacy Policy | CEGRAD-UCC',
  description: 'Privacy policy for the UCC Sexual Harassment Reporting platform.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="sm:p-12">
            <Heading as="h1" size={{ base: '3xl', md: '4xl' }} weight="semibold" tone="navy" className="mb-2">Privacy Policy</Heading>
            <Text size="sm" tone="muted" className="mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>

            <div className="prose prose-navy max-w-none space-y-6 text-gray-600">
              <p>
                The Centre for Gender Research, Advocacy and Documentation (CEGRAD) at the University of Cape Coast is committed to protecting your privacy and ensuring the confidentiality of any information you share through the Sexual Harassment Reporting and Awareness platform.
              </p>

              <Heading as="h2" size={{ base: 'lg', lg: 'xl' }} weight="semibold" tone="navy" className="mt-8 mb-4">1. Information We Collect</Heading>
              <p>
                We collect information when you voluntarily submit a report, use our tracking system, or contact us for help. The types of information we may collect include:
              </p>
              <ul className="list-disc pl-5">
                <li><strong>Anonymous Reports:</strong> Non-personally identifiable details of the incident. We do not collect your IP address or browser information if you choose to report anonymously.</li>
                <li><strong>Identified Reports:</strong> If you choose to provide your contact details (name, email, phone number, student/staff ID), they are securely stored to allow our team to follow up with you.</li>
                <li><strong>Usage Data:</strong> Standard website analytics to help us improve the platform's resources and user experience.</li>
              </ul>

              <Heading as="h2" size={{ base: 'lg', lg: 'xl' }} weight="semibold" tone="navy" className="mt-8 mb-4">2. How We Use Your Information</Heading>
              <p>
                The information collected is strictly used to:
              </p>
              <ul className="list-disc pl-5">
                <li>Investigate and respond to reported incidents of sexual and gender-based harassment.</li>
                <li>Provide you with appropriate support services, counselling, and guidance.</li>
                <li>Compile anonymised, aggregated statistics to identify trends and improve university policies and prevention strategies.</li>
              </ul>

              <Heading as="h2" size={{ base: 'lg', lg: 'xl' }} weight="semibold" tone="navy" className="mt-8 mb-4">3. Confidentiality and Anonymity</Heading>
              <p>
                We treat all reports with the strictest confidence. If you choose to report anonymously, your identity will remain completely unknown to us. For non-anonymous reports, your identity will only be shared with authorized CEGRAD personnel directly involved in the investigation and support process. We will not disclose your identity to any third party without your explicit consent, except where required by law or in cases of an imminent threat to safety.
              </p>

              <Heading as="h2" size={{ base: 'lg', lg: 'xl' }} weight="semibold" tone="navy" className="mt-8 mb-4">4. Data Security</Heading>
              <p>
                We implement robust technical and organizational measures to safeguard your data against unauthorized access, alteration, disclosure, or destruction. Our database is encrypted, and access is tightly restricted to authorized administrators.
              </p>

              <Heading as="h2" size={{ base: 'lg', lg: 'xl' }} weight="semibold" tone="navy" className="mt-8 mb-4">5. Your Rights</Heading>
              <p>
                You have the right to request access to, correction of, or deletion of your personal data held by us, provided it does not interfere with an ongoing formal investigation. If you have any concerns regarding how your data is handled, please contact us.
              </p>

              <Heading as="h2" size={{ base: 'lg', lg: 'xl' }} weight="semibold" tone="navy" className="mt-8 mb-4">6. Contact Us</Heading>
              <p>
                For questions regarding this Privacy Policy or the handling of your data, please contact CEGRAD directly through our help center or the official university communication channels.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
