import { Heading } from "../../atoms/heading/heading"
import { Text } from "../../atoms/text/text"

type BoardMember = { id?: number; name: string; role: string; bio: string; initials: string; imageUrl?: string }

const boardMembers: BoardMember[] = [
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
                className="group flex flex-col items-center p-4 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative mb-6 h-48 w-48 overflow-hidden rounded-full shadow-md ring-4 ring-gray-50 transition-all duration-500 group-hover:ring-navy/20 group-hover:shadow-lg">
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-navy-light/10 text-5xl font-bold text-navy transition-colors duration-500 group-hover:bg-navy group-hover:text-white">
                      {member.initials}
                    </div>
                  )}
                </div>
                
                <div className="mt-auto flex flex-col items-center justify-center">
                  <Text as="h3" size="xl" weight="bold" tone="navy" className="mb-1">{member.name}</Text>
                  <Text size="sm" weight="semibold" className="text-red uppercase tracking-widest">{member.role}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
