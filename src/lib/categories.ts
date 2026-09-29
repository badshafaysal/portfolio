/** Canonical category keys (must match Decap admin options) + display labels */
export const CATEGORY_LABELS: Record<string, string> = {
  industrial: 'Industrial',
  portal: 'Portal / PEB',
  multistorey: 'Multi-storey',
  retrofit: 'Retrofitting / As-Built',
};

export const CATEGORY_ORDER = ['industrial', 'portal', 'multistorey', 'retrofit'] as const;

export function labelForCategory(key: string): string {
  return CATEGORY_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

/** Unique categories present in published projects, in stable order */
export function usedCategories(
  projects: { data: { category: string[] } }[]
): string[] {
  const used = new Set<string>();
  for (const p of projects) {
    for (const c of p.data.category ?? []) used.add(c);
  }
  // Prefer known order, then any extras alphabetically
  const ordered = CATEGORY_ORDER.filter((k) => used.has(k));
  const extras = [...used].filter((k) => !CATEGORY_ORDER.includes(k as any)).sort();
  return [...ordered, ...extras];
}
