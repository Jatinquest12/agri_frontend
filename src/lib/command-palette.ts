export type CommandGroup = "navigation" | "actions";

export type CommandItem = {
  id: string;
  group: CommandGroup;
  label: string;
  description?: string;
  /** Search synonyms (e.g. "kyc" → Farmer approvals). */
  aliases?: string[];
  keywords?: string[];
  href?: string;
  action?: "logout";
};

const MAX_RECENT = 8;

export function readRecentIds(storageKey: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function pushRecentId(storageKey: string, id: string): void {
  if (typeof window === "undefined") return;
  const prev = readRecentIds(storageKey);
  const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECENT);
  window.localStorage.setItem(storageKey, JSON.stringify(next));
}

function levenshtein(a: string, b: string): number {
  if (a.length < b.length) return levenshtein(b, a);
  if (b.length === 0) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const cur =
        a[i - 1] === b[j - 1]
          ? row[j]
          : 1 + Math.min(row[j], row[j - 1], prev);
      row[j - 1] = prev;
      prev = cur;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

function haystack(item: CommandItem): string {
  return [
    item.label,
    item.description ?? "",
    item.href ?? "",
    ...(item.aliases ?? []),
    ...(item.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

function aliasMatchBonus(q: string, item: CommandItem): number {
  if (!item.aliases?.length) return 0;
  let best = 0;
  for (const raw of item.aliases) {
    const a = raw.toLowerCase();
    if (a === q) best = Math.max(best, 48);
    else if (q.length >= 2 && a.startsWith(q)) best = Math.max(best, 36);
    else if (a.includes(q)) best = Math.max(best, 26);
    else {
      let qi = 0;
      for (let i = 0; i < a.length && qi < q.length; i++) {
        if (a[i] === q[qi]) qi++;
      }
      if (qi === q.length) best = Math.max(best, 22);
    }
  }
  return best;
}

/** Higher is better. 0 means no match (caller may still show with low score for empty query). */
export function fuzzyScore(query: string, item: CommandItem): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const hay = haystack(item);
  const aliasBoost = aliasMatchBonus(q, item);

  if (hay.includes(q)) {
    const idx = hay.indexOf(q);
    const prefixBoost = idx === 0 ? 40 : 0;
    return 100 + prefixBoost + Math.min(q.length * 4, 40) + Math.min(aliasBoost, 12);
  }

  let qi = 0;
  for (let i = 0; i < hay.length && qi < q.length; i++) {
    if (hay[i] === q[qi]) qi++;
  }
  if (qi === q.length) {
    return 55 + Math.min(q.length * 3, 25) + Math.min(aliasBoost, 12);
  }

  const words = hay.split(/\s+/).filter(Boolean);
  let best = aliasBoost;
  for (const w of words) {
    if (w.length < 2) continue;
    if (w.startsWith(q.slice(0, Math.min(3, q.length)))) best = Math.max(best, 35);
    if (q.length <= 6 && w.length <= 12) {
      const d = levenshtein(q, w);
      if (d <= 1) best = Math.max(best, 32 - d * 8);
      if (d === 2 && q.length >= 4) best = Math.max(best, 18);
    }
  }

  const label = item.label.toLowerCase();
  if (label.includes(q.slice(0, 2)) && q.length >= 2) {
    best = Math.max(best, 15);
  }

  return Math.max(best, aliasBoost);
}

export function rankCommands(query: string, items: CommandItem[]): CommandItem[] {
  const q = query.trim();
  if (!q) return items;
  return [...items]
    .map((item) => ({ item, score: fuzzyScore(q, item) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}
