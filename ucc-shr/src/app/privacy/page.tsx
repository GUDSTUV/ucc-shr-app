import { Footer } from '@/src/components/organisms/Footer'

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">
            <h1 className="mb-2 text-3xl font-bold text-navy md:text-4xl">Privacy Policy</h1>
            <p className="mb-8 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

            <div className="prose prose-navy max-w-none space-y-6 text-gray-600">
              <p>
                The Centre for Gender Research, Advocacy and Documentation (CEGRAD) at the University of Cape Coast ("we," "our," or "us") is committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our Sexual Harassment Reporting and Awareness platform.
              </p>

              <h2 className="text-xl font-bold text-navy">1. Information We Collect</h2>
              <p>
                <strong>Anonymous Reporting:</strong> You have the option to submit reports completely anonymously. If you choose this option, we do not collect any identifying information such as your name, email address, or IP address.
              </p>
              <p>
                <strong>Identified Reporting:</strong> If you choose to provide your contact information (name, email, phone number) for follow-up and support, this information is collected securely and access is strictly limited to authorized CEGRAD personnel.
              </p>

              <h2 className="text-xl font-bold text-navy">2. How We Use Your Information</h2>
              <p>
                Any information collected is used exclusively for:
              </p>
              <ul className="list-disc pl-5">
                <li>Investigating and responding to reports of sexual harassment.</li>
                <li>Providing necessary support, counseling, and resources to survivors.</li>
                <li>Analyzing aggregate, non-identifiable data to identify trends and improve campus safety initiatives.</li>
              </ul>

              <h2 className="text-xl font-bold text-navy">3. Data Protection and Confidentiality</h2>
              <p>
                We employ strict technical and organizational security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. Confidentiality is our highest priority. Your identity and the details of your report will not be shared with third parties without your explicit consent, except where required by law or university policy to ensure the immediate safety of the community.
              </p>

              <h2 className="text-xl font-bold text-navy">4. Your Rights</h2>
              <p>
                You have the right to request access to the personal information we hold about you, request corrections to inaccurate data, or request the deletion of your data, subject to legal and institutional retention requirements.
              </p>

              <h2 className="text-xl font-bold text-navy">5. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact CEGRAD directly through the <a href="/help" className="text-red hover:underline">Help & Support</a> page.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
