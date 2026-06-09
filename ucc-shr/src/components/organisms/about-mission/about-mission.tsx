import { Target, Eye, ShieldCheck, Heart, Users, CheckCircle, Scale } from "lucide-react"
import { Heading } from "../../atoms/heading/heading"
import { Text } from "../../atoms/text/text"

const coreValues = [
  { text: "Create a gender equal and inclusive learning and work environment.", icon: <Users className="h-5 w-5 text-red" /> },
  { text: "Deliver professional services that are responsive to the needs of all genders in the university community and beyond.", icon: <Heart className="h-5 w-5 text-red" /> },
  { text: "Ensure equal opportunities for all constituents in the university.", icon: <Scale className="h-5 w-5 text-red" /> },
  { text: "Ensure a sexual and gender-based violence free university.", icon: <ShieldCheck className="h-5 w-5 text-red" /> },
  { text: "Institutional integrity.", icon: <CheckCircle className="h-5 w-5 text-red" /> },
]

export function AboutMission() {
  return (
    <section className="bg-navy-light/10 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Mission Card */}
            <div className="rounded-2xl border border-navy/10 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-light/30">
                <Target className="h-6 w-6 text-navy" />
              </div>
              <Text as="span" size="xs" weight="semibold" tone="navy" className="mb-2 block uppercase tracking-widest">Purpose</Text>
              <Heading as="h2" size={{ base: '2xl', lg: '3xl' }} tone="navy" weight="bold">Our Mission</Heading>
              <Text size="base" tone="muted" className="mt-4 leading-relaxed">
                To engage in theory and practice to position the University of Cape Coast as a leader in gender equality and women&apos;s rights within the academy and beyond.
              </Text>
            </div>

            {/* Vision Card */}
            <div className="rounded-2xl border border-navy/10 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red/10">
                <Eye className="h-6 w-6 text-red" />
              </div>
              <Text as="span" size="xs" weight="semibold" tone="navy" className="mb-2 block uppercase tracking-widest">Future State</Text>
              <Heading as="h2" size={{ base: '2xl', lg: '3xl' }} tone="navy" weight="bold">Our Vision</Heading>
              <Text size="base" tone="muted" className="mt-4 leading-relaxed">
                Create a safe, creative and inclusive space where gender and women&apos;s rights are fully protected.
              </Text>
            </div>
          </div>

          {/* Core Values */}
          <div className="mt-12 rounded-3xl bg-navy px-8 py-12 text-white sm:px-12 lg:py-16">
            <div className="text-center">
              <Text as="span" size="xs" weight="semibold" tone="white" className="uppercase tracking-widest opacity-70">Guiding Principles</Text>
              <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} weight="bold" tone="white" className="mt-2">Our Core Values</Heading>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {coreValues.map((value, i) => (
                <div
                  key={i}
                  className="flex w-full max-w-[320px] items-start gap-4 rounded-xl bg-white/10 p-5 backdrop-blur-md transition hover:bg-white/20 sm:w-auto"
                >
                  <div className="mt-1 flex-shrink-0 rounded-full bg-white/20 p-2">
                    {value.icon}
                  </div>
                  <Text size="sm" weight="medium" tone="white" className="leading-relaxed">{value.text}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

