import { Target, Eye, ShieldCheck, Heart, Users, CheckCircle, Scale } from "lucide-react"

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
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-navy">Purpose</span>
              <h2 className="text-2xl font-bold text-navy lg:text-3xl">Our Mission</h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                To engage in theory and practice to position the University of Cape Coast as a leader in gender equality and women&apos;s rights within the academy and beyond.
              </p>
            </div>

            {/* Vision Card */}
            <div className="rounded-2xl border border-navy/10 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red/10">
                <Eye className="h-6 w-6 text-red" />
              </div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-navy">Future State</span>
              <h2 className="text-2xl font-bold text-navy lg:text-3xl">Our Vision</h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                Create a safe, creative and inclusive space where gender and women&apos;s rights are fully protected.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mt-12 rounded-3xl bg-navy px-8 py-12 text-white sm:px-12 lg:py-16">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/70">Guiding Principles</span>
              <h2 className="mt-2 text-3xl font-bold lg:text-4xl">Our Core Values</h2>
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
                  <p className="text-sm font-medium leading-relaxed">{value.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

