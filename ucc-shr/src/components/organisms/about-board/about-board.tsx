import { Heading } from "../../atoms/heading/heading"
import { Text } from "../../atoms/text/text"

const boardMembers = [
  {
    id: 1,
    name: "Prof. Jane Doe",
    role: "Chairperson",
    bio: "Professor of Gender Studies with over 20 years of experience in advocacy and policy development.",
    initials: "JD",
  },
  {
    id: 2,
    name: "Dr. Kwame Nkrumah",
    role: "Director, CEGRAD",
    bio: "Lead researcher and coordinator for university-wide gender initiatives and programs.",
    initials: "KN",
  },
  {
    id: 3,
    name: "Dr. Ama Atta",
    role: "Head of Counseling",
    bio: "Specialist in trauma-informed care and student support services.",
    initials: "AA",
  },
  {
    id: 4,
    name: "Mr. John Smith",
    role: "Legal Advisor",
    bio: "Expert in human rights law and institutional policy frameworks.",
    initials: "JS",
  },
]

type BoardMember = { id?: number; name: string; role: string; bio: string; initials: string; imageUrl?: string }

export function AboutBoard({ customMembers }: { customMembers?: BoardMember[] }) {
  const activeMembers = customMembers && customMembers.length > 0 ? customMembers : boardMembers

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto">
          <div className="mb-12 text-center">
            <Text as="span" size="xs" weight="semibold" tone="navy" className="uppercase tracking-widest">Leadership</Text>
            <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="bold" className="mt-2">Our Board Members</Heading>
            <Text size="base" tone="muted" className="mx-auto mt-3 max-w-2xl">
              Meet the dedicated team leading CEGRAD&apos;s mission and initiatives.
            </Text>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {activeMembers.map((member, i) => (
              <div
                key={member.id || i}
                className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.name} className="mb-4 h-24 w-24 rounded-full object-cover border-2 border-navy/20" />
                ) : (
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-navy-light/20 text-2xl font-bold text-navy transition-colors group-hover:bg-navy group-hover:text-white">
                    {member.initials}
                  </div>
                )}
                <Text as="h3" size="lg" weight="bold" tone="navy">{member.name}</Text>
                <Text size="sm" weight="medium" className="text-red">{member.role}</Text>
                <Text size="sm" tone="muted" className="mt-3 leading-relaxed text-gray-500">
                  {member.bio}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
