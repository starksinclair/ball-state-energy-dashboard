export function parseOptionalNumber(raw: string): number | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  const n = parseFloat(t);
  return Number.isNaN(n) ? undefined : n;
}
