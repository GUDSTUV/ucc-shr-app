import Link from 'next/link'

export type CategoryData = {
  label: string
  percent: number
}

export type CategoryDistributionProps = {
  categoryData: CategoryData[]
}

export function CategoryDistribution({ categoryData }: CategoryDistributionProps) {
  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Category Distribution</h2>
          <Link href="/admin/reports" className="text-sm font-semibold text-navy hover:text-navy-dark">
            View
          </Link>
        </div>

        <div className="space-y-4">
          {categoryData.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-base">
                <span className="text-gray-800">{item.label}</span>
                <span className="font-semibold text-gray-900">{item.percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100" aria-hidden="true">
                <div className="h-full rounded-full bg-navy" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
