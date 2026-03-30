export type SavedResourceItem = {
  id: string
  resourceType: 'ARTICLE' | 'EVENT'
  resourceId: string
  title: string
  summary: string
  label: string
  href: string
}
