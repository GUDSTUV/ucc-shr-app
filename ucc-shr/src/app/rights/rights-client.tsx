'use client'

import { Download } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'

export function RightsClient() {
  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="sm:p-12">
          
          <Heading as="h1" size={{ base: '3xl', md: '4xl' }} weight="semibold" tone="navy" className="mb-6">
            Know Your Rights and Responsibilities
          </Heading>
          <Text size={{ base: 'base', lg: 'lg' }} tone="muted" leading="relaxed" className="mb-10">
            The University of Cape Coast is committed to providing a safe, respectful, and inclusive environment for all students, staff, and visitors. Sexual harassment in any form is not tolerated. Every member of the university community has the right to learn, work, and participate in university life free from harassment, intimidation, discrimination, or abuse.
          </Text>

          <div className="space-y-8 text-gray-600">
            
            <section>
              <Heading as="h2" size={{ base: 'xl', lg: '2xl' }} weight="semibold" tone="navy" className="mb-4">What is Sexual Harassment?</Heading>
              <Text className="mb-6">
                Sexual harassment refers to any unwelcome sexual advance, request for sexual favours, or verbal, physical, written, digital, or visual conduct of a sexual nature that causes discomfort, humiliation, intimidation, embarrassment, or interferes with a person's academic or work environment.
              </Text>
              
              <Heading as="h3" size={{ base: 'lg', lg: 'xl' }} weight="semibold" tone="navy" className="mb-3">Examples of Sexual Harassment</Heading>
              
              <div className="space-y-6 pl-4">
                <div>
                  <Text as="h4" weight="bold" tone="navy" className="mb-2">Verbal Harassment</Text>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><Text>Sexual jokes or comments</Text></li>
                    <li><Text>Unwanted remarks about appearance</Text></li>
                    <li><Text>Repeated sexual propositions</Text></li>
                    <li><Text>Offensive comments about gender or sexuality</Text></li>
                  </ul>
                </div>

                <div>
                  <Text as="h4" weight="bold" tone="navy" className="mb-2">Digital Harassment</Text>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><Text>Inappropriate text messages</Text></li>
                    <li><Text>Sexual images or videos</Text></li>
                    <li><Text>Offensive emails</Text></li>
                    <li><Text>Harassing social media messages</Text></li>
                  </ul>
                </div>

                <div>
                  <Text as="h4" weight="bold" tone="navy" className="mb-2">Physical Harassment</Text>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><Text>Unwanted touching</Text></li>
                    <li><Text>Sexual advances</Text></li>
                    <li><Text>Sexual assault</Text></li>
                    <li><Text>Physical intimidation</Text></li>
                  </ul>
                </div>

                <div>
                  <Text as="h4" weight="bold" tone="navy" className="mb-2">Abuse of Authority</Text>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><Text>Requesting sexual favours in exchange for grades, promotions, opportunities, or benefits</Text></li>
                    <li><Text>Exploiting positions of power for sexual gain</Text></li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            <section>
              <Heading as="h2" size={{ base: 'xl', lg: '2xl' }} weight="semibold" tone="navy" className="mb-6">Your Rights</Heading>
              
              <div className="space-y-6">
                <div>
                  <Heading as="h3" size={{ base: 'base', lg: 'lg' }} weight="semibold" tone="navy" className="mb-1">Right to a Safe Environment</Heading>
                  <Text>You have the right to study, work, and participate in university activities without fear of sexual harassment or discrimination.</Text>
                </div>

                <div>
                  <Heading as="h3" size={{ base: 'base', lg: 'lg' }} weight="semibold" tone="navy" className="mb-1">Right to Report</Heading>
                  <Text>Any student or staff member who experiences or witnesses sexual harassment has the right to report the incident and seek assistance.</Text>
                </div>

                <div>
                  <Heading as="h3" size={{ base: 'base', lg: 'lg' }} weight="semibold" tone="navy" className="mb-1">Right to Confidentiality</Heading>
                  <Text>Information disclosed during reporting and investigations will be handled confidentially to the extent permitted by university policy and the law.</Text>
                </div>

                <div>
                  <Heading as="h3" size={{ base: 'base', lg: 'lg' }} weight="semibold" tone="navy" className="mb-1">Right to Protection from Retaliation</Heading>
                  <Text>No person should be intimidated, threatened, punished, or treated unfairly because they reported sexual harassment or participated in an investigation.</Text>
                </div>

                <div>
                  <Heading as="h3" size={{ base: 'base', lg: 'lg' }} weight="semibold" tone="navy" className="mb-1">Right to Support</Heading>
                  <Text>Survivors are entitled to counselling, guidance, and other support services throughout the reporting and resolution process.</Text>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            <section>
              <Heading as="h2" size={{ base: 'xl', lg: '2xl' }} weight="semibold" tone="navy" className="mb-4">Understanding Consent</Heading>
              <Text className="mb-4">Consent means freely agreeing to engage in a specific activity.</Text>
              
              <Heading as="h3" size={{ base: 'base', lg: 'lg' }} weight="semibold" tone="navy" className="mb-3">Important Things to Know</Heading>
              <ul className="list-disc pl-5 space-y-2">
                <li><Text>Consent must be voluntary and informed.</Text></li>
                <li><Text>Silence does not automatically mean consent.</Text></li>
                <li><Text>Consent can be withdrawn at any time.</Text></li>
                <li><Text>Consent cannot be assumed because of a previous relationship.</Text></li>
                <li><Text>Relationships involving significant power differences may not be considered truly consensual.</Text></li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section>
              <Heading as="h2" size={{ base: 'xl', lg: '2xl' }} weight="semibold" tone="navy" className="mb-4">What UCC Does Not Tolerate</Heading>
              <ul className="list-disc pl-5 space-y-2">
                <li><Text>Sexual Harassment</Text></li>
                <li><Text>Sexual Imposition</Text></li>
                <li><Text>Sexual Assault</Text></li>
                <li><Text>Rape</Text></li>
                <li><Text>Retaliation against complainants</Text></li>
                <li><Text>Abuse of power for sexual purposes</Text></li>
                <li><Text>Creation of hostile learning or working environments</Text></li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section>
              <Heading as="h2" size={{ base: 'xl', lg: '2xl' }} weight="semibold" tone="navy" className="mb-4">Possible Consequences for Violations</Heading>
              <Text className="mb-4">Individuals found responsible for violating the Sexual Harassment Policy may face disciplinary action, including:</Text>
              <ul className="list-disc pl-5 space-y-2">
                <li><Text>Formal warnings or reprimands</Text></li>
                <li><Text>Mandatory educational programmes</Text></li>
                <li><Text>Restrictions on contact</Text></li>
                <li><Text>Relocation or reassignment</Text></li>
                <li><Text>Suspension</Text></li>
                <li><Text>Expulsion</Text></li>
                <li><Text>Dismissal from employment</Text></li>
                <li><Text>Referral to law enforcement agencies</Text></li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section>
              <Heading as="h2" size={{ base: 'xl', lg: '2xl' }} weight="semibold" tone="navy" className="mb-4">Support and Help</Heading>
              <Text className="mb-4">If you experience or witness sexual harassment, support is available. You may seek assistance from:</Text>
              <ul className="list-disc pl-5 space-y-2">
                <li><Text>CEGRAD</Text></li>
                <li><Text>Counselling Centre</Text></li>
                <li><Text>Hall Tutors</Text></li>
                <li><Text>Dean of Students</Text></li>
                <li><Text>Heads of Department</Text></li>
                <li><Text>Sexual Harassment Committee</Text></li>
                <li><Text>University Management</Text></li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section className="pt-4">
              <Heading as="h2" size={{ base: 'xl', lg: '2xl' }} weight="semibold" tone="navy" className="mb-4">Need More Information?</Heading>
              <Text className="mb-8">
                This page provides a summary of the University's Sexual Harassment Policy. For complete details, reporting procedures, definitions, and policy provisions, please download and review the full policy document.
              </Text>
              <a 
                href="/documents/UCC_Anti_Sexual_Harassment_Policy.pdf" 
                download 
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border-[1.5px] border-navy px-5 font-sans font-medium text-[15px] text-navy transition-all hover:bg-navy/5 active:scale-[0.97] cursor-pointer"
              >
                <Download size={18} />
                Download Full UCC Sexual Harassment Policy
              </a>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
