export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'COUNSELOR', 'INVESTIGATOR'] as const;

export type AdminRole = typeof ADMIN_ROLES[number];

export function isAdminRole(role: string | null | undefined): boolean {
  if (!role) return false;
  return ADMIN_ROLES.includes(role as AdminRole);
}
