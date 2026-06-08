import { Globe, MapPin, Building2 } from "lucide-react"

const partners = {
  international: [
    { name: "UN Women", logo: "UN" },
    { name: "Global Fund for Women", logo: "GFW" },
    { name: "Ford Foundation", logo: "FF" },
  ],
  national: [
    { name: "Ministry of Gender", logo: "MoG" },
    { name: "DOVVSU Ghana", logo: "DOVVSU" },
    { name: "ActionAid Ghana", logo: "AAG" },
  ],
  area: [
    { name: "UCC SRC", logo: "SRC" },
    { name: "Cape Coast Metro Assembly", logo: "CCMA" },
    { name: "Local NGOs", logo: "NGO" },
  ],
}

export function AboutPartners() {
  return (
    <section className="bg-gray-50 py-16 lg:py-20 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mt-2 text-3xl font-bold text-navy lg:text-4xl">Our Partners</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
              Collaborating at every level to ensure a safe and equitable environment.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {/* International */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-red" />
                <h3 className="text-xl font-bold text-navy">International</h3>
              </div>
              <div className="flex flex-col gap-4">
                {partners.international.map((partner, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-navy/20 hover:shadow-md"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-content-center rounded-lg bg-gray-50 font-bold text-gray-400">
                      {partner.logo}
                    </div>
                    <span className="font-semibold text-gray-700">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* National */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-red" />
                <h3 className="text-xl font-bold text-navy">National</h3>
              </div>
              <div className="flex flex-col gap-4">
                {partners.national.map((partner, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-navy/20 hover:shadow-md"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-content-center rounded-lg bg-gray-50 font-bold text-gray-400">
                      {partner.logo}
                    </div>
                    <span className="font-semibold text-gray-700">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Area / Local */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-red" />
                <h3 className="text-xl font-bold text-navy">Area / Local</h3>
              </div>
              <div className="flex flex-col gap-4">
                {partners.area.map((partner, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-navy/20 hover:shadow-md"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-content-center rounded-lg bg-gray-50 font-bold text-gray-400">
                      {partner.logo}
                    </div>
                    <span className="font-semibold text-gray-700">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
