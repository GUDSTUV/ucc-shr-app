interface HubFilterChipsProps<TCategory extends string> {
  categories: TCategory[]
  categoryLabels?: Record<TCategory, string>
  activeCategory: TCategory
  onCategoryChange: (category: TCategory) => void
}

export function HubFilterChips<TCategory extends string>({
  categories,
  categoryLabels,
  activeCategory,
  onCategoryChange,
}: HubFilterChipsProps<TCategory>) {
  return (
    <div className="-mx-4 mt-4 overflow-x-auto px-4">
      <div className="flex min-w-max gap-3 pb-1">
        {categories.map((category) => {
          const active = activeCategory === category
          const label = categoryLabels?.[category] ?? category

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`h-10 rounded-full border px-5 text-sm font-semibold transition ${
                active
                  ? 'border-navy bg-navy text-white'
                  : 'border-gray-100 bg-white text-gray-600 hover:border-navy hover:text-navy'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
