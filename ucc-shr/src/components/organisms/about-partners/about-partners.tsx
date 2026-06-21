import { Heading } from "../../atoms/heading/heading"
import { Text } from "../../atoms/text/text"

const partnerGroups = [
  {
    category: "International",
    partners: ["UN Women", "Global Fund for Women", "Ford Foundation"]
  },
  {
    category: "National",
    partners: ["Ministry of Gender, Children and Social Protection", "DOVVSU Ghana", "ActionAid Ghana"]
  },
  {
    category: "Area / Local",
    partners: ["UCC Students' Representative Council (SRC)", "Cape Coast Metropolitan Assembly", "Local NGO Network"]
  }
]

export function AboutPartners() {
  return (
    <section className="bg-white py-20 lg:py-24 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
          <Text as="span" size="xs" weight="semibold" tone="navy" className="uppercase tracking-widest">Collaboration</Text>
          <Heading as="h2" size="4xl" tone="navy" weight="bold" className="mt-2">Our Partners</Heading>
          <Text size="lg" tone="muted" className="mx-auto mt-4 leading-relaxed">
            We collaborate at every level to ensure a safe, equitable, and highly supportive environment for the entire university community.
          </Text>
        </div>

        <div className="mx-auto max-w-4xl grid gap-12 sm:grid-cols-3">
          {partnerGroups.map((group, index) => (
            <div key={index} className="flex flex-col">
              <Heading as="h3" size="lg" weight="bold" tone="navy" className="mb-4">
                {group.category}
              </Heading>
              <div className="mb-6 h-0.5 w-12 bg-red-light" />
              <ul className="space-y-4">
                {group.partners.map((partner, i) => (
                  <li key={i}>
                    <Text size="base" className="text-gray-700 leading-snug font-medium">
                      {partner}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
