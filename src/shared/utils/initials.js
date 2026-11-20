/**
 * Initials from a person/entity name ("Jane Doe" -> "JD").
 * Safe for missing or non-string values (returns "?"), so a record without a
 * name can never crash a page with "Cannot read properties of undefined (reading 'split')".
 */
export function getInitials(name, max = 3) {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts.map((p) => p[0]).join('').slice(0, max);
}
