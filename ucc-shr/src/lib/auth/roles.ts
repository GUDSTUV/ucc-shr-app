export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'COUNSELOR', 'INVESTIGATOR'] as const;

export type AdminRole = typeof ADMIN_ROLES[number];

/** Roles that map to "Case Officer" — NSS, Counsellors, Trained Staff */
export const CASE_OFFICER_ROLES = ['ADMIN', 'COUNSELOR', 'INVESTIGATOR'] as const;

export type CaseOfficerRole = typeof CASE_OFFICER_ROLES[number];

export function isAdminRole(role: string | null | undefined): boolean {
  if (!role) return false;
  return ADMIN_ROLES.includes(role as AdminRole);
}

export function isCaseOfficerRole(role: string | null | undefined): boolean {
  if (!role) return false;
  return CASE_OFFICER_ROLES.includes(role as CaseOfficerRole);
}
