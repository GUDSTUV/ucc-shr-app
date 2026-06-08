import { Footer } from '@/src/components/organisms/Footer'

export default function TermsOfServicePage() {
  return (
    <>
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">
            <h1 className="mb-2 text-3xl font-bold text-navy md:text-4xl">Terms of Service</h1>
            <p className="mb-8 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

            <div className="prose prose-navy max-w-none space-y-6 text-gray-600">
              <p>
                By accessing and using the Sexual Harassment Reporting and Awareness platform provided by the Centre for Gender Research, Advocacy and Documentation (CEGRAD) at the University of Cape Coast, you agree to comply with the following Terms of Service. Please read them carefully.
              </p>

              <h2 className="text-xl font-bold text-navy">1. Purpose of the Platform</h2>
              <p>
                This platform is designed to provide information, resources, and a secure reporting mechanism regarding sexual and gender-based harassment within the University of Cape Coast community. It is intended for use by students, faculty, staff, and authorized visitors.
              </p>

              <h2 className="text-xl font-bold text-navy">2. Responsible Use</h2>
              <p>
                You agree to use this platform responsibly and in good faith. You must not:
              </p>
              <ul className="list-disc pl-5">
                <li>Submit intentionally false, malicious, or fabricated reports.</li>
                <li>Attempt to breach the security, anonymity, or confidentiality of the platform or its users.</li>
                <li>Use the platform to harass, threaten, or intimidate others.</li>
              </ul>
              <p>
                Misuse of the reporting system may result in disciplinary action under university policies.
              </p>

              <h2 className="text-xl font-bold text-navy">3. Reporting and Anonymity</h2>
              <p>
                We offer the option to report incidents anonymously. While we will take all anonymous reports seriously, please be aware that our ability to investigate or take formal disciplinary action may be limited if we cannot verify the details or contact the reporter for further information.
              </p>

              <h2 className="text-xl font-bold text-navy">4. Confidentiality</h2>
              <p>
                CEGRAD handles all reports with the utmost confidentiality, in accordance with our Privacy Policy. However, absolute confidentiality cannot be guaranteed if there is an imminent threat to life or safety, or if disclosure is required by law.
              </p>

              <h2 className="text-xl font-bold text-navy">5. Limitation of Liability</h2>
              <p>
                While we strive to provide a secure and reliable platform, CEGRAD and the University of Cape Coast cannot guarantee uninterrupted access or assume liability for technical failures. The information provided on the platform is for educational and support purposes and does not substitute for professional legal or medical advice.
              </p>

              <h2 className="text-xl font-bold text-navy">6. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. Significant changes will be communicated through the platform. Continued use of the platform after changes have been posted constitutes your acceptance of the revised terms.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
