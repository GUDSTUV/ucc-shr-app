
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

export function AboutBoard() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-navy">Leadership</span>
            <h2 className="mt-2 text-3xl font-bold text-navy lg:text-4xl">Our Board Members</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
              Meet the dedicated team leading CEGRAD&apos;s mission and initiatives.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {boardMembers.map((member) => (
              <div
                key={member.id}
                className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-navy-light/20 text-2xl font-bold text-navy transition-colors group-hover:bg-navy group-hover:text-white">
                  {member.initials}
                </div>
                <h3 className="text-lg font-bold text-navy">{member.name}</h3>
                <p className="text-sm font-medium text-red">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
