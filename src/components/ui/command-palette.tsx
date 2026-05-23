"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  pushRecentId,
  rankCommands,
  readRecentIds,
  type CommandItem,
} from "@/lib/command-palette";

export type { CommandGroup, CommandItem } from "@/lib/command-palette";

type Section = { key: string; title: string; items: CommandItem[] };

type PaletteRow =
  | { type: "header"; key: string; title: string }
  | { type: "item"; item: CommandItem; flatIndex: number }
  | { type: "hint"; key: string; text: string };

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  recentStorageKey?: string;
  onLogout?: () => void;
};

export function CommandPalette({
  open,
  onClose,
  items,
  recentStorageKey,
  onLogout,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentVersion, setRecentVersion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const byId = useMemo(() => {
    const m = new Map<string, CommandItem>();
    for (const it of items) m.set(it.id, it);
    return m;
  }, [items]);

  const sections = useMemo((): Section[] => {
    const q = query.trim();
    const nav = items.filter((i) => i.group === "navigation");
    const act = items.filter((i) => i.group === "actions");

    if (q) {
      const ranked = rankCommands(q, items);
      if (ranked.length === 0) {
        return [{ key: "empty", title: "No matches", items: [] }];
      }
      return [{ key: "results", title: "Results", items: ranked }];
    }

    const recentIds = recentStorageKey
      ? readRecentIds(recentStorageKey)
      : [];
    const recentItems: CommandItem[] = [];
    const seen = new Set<string>();
    for (const id of recentIds) {
      const it = byId.get(id);
      if (it && !seen.has(it.id)) {
        recentItems.push(it);
        seen.add(it.id);
      }
    }

    const recentNavIds = new Set(
      recentItems.filter((i) => i.group === "navigation").map((i) => i.id),
    );
    const navDeduped = nav.filter((i) => !recentNavIds.has(i.id));

    const out: Section[] = [];
    if (recentItems.length > 0) {
      out.push({ key: "recent", title: "Recent", items: recentItems });
    }
    out.push({
      key: "navigation",
      title: "Navigation",
      items: [...navDeduped].sort((a, b) => a.label.localeCompare(b.label)),
    });
    if (act.length > 0) {
      out.push({
        key: "actions",
        title: "Actions",
        items: [...act].sort((a, b) => a.label.localeCompare(b.label)),
      });
    }
    return out;
  }, [items, query, recentStorageKey, byId, recentVersion]);

  const rows = useMemo((): PaletteRow[] => {
    let flatIndex = 0;
    const out: PaletteRow[] = [];
    for (const section of sections) {
      out.push({ type: "header", key: section.key, title: section.title });
      for (const item of section.items) {
        out.push({ type: "item", item, flatIndex: flatIndex++ });
      }
      if (section.key === "empty" && section.items.length === 0) {
        out.push({
          type: "hint",
          key: "empty-hint",
          text: "Try another search term.",
        });
      }
    }
    return out;
  }, [sections]);

  const flatItems = useMemo(
    () => rows.filter((r): r is Extract<PaletteRow, { type: "item" }> => r.type === "item"),
    [rows],
  );

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (activeIndex >= flatItems.length) {
      setActiveIndex(flatItems.length > 0 ? flatItems.length - 1 : 0);
    }
  }, [flatItems.length, activeIndex]);

  const runSelect = useCallback(
    (item: CommandItem) => {
      if (recentStorageKey) {
        pushRecentId(recentStorageKey, item.id);
        setRecentVersion((v) => v + 1);
      }
      if (item.action === "logout") {
        onClose();
        onLogout?.();
        return;
      }
      if (item.href) {
        onClose();
        router.push(item.href);
      }
    },
    [onClose, onLogout, router, recentStorageKey],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (flatItems.length === 0) return;
        setActiveIndex((i) => (i + 1) % flatItems.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (flatItems.length === 0) return;
        setActiveIndex(
          (i) => (i - 1 + flatItems.length) % flatItems.length,
        );
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const row = flatItems[activeIndex];
        if (row) runSelect(row.item);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, flatItems, activeIndex, runSelect]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/40 px-3 py-10 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="surface-card w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] shadow-2xl">
        <div className="border-b border-[var(--border)] px-3 py-2">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search pages and actions…"
            className="w-full rounded-lg border border-transparent bg-[var(--surface-muted)] px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--ring)] focus-visible:border-transparent focus-visible:ring-2"
          />
        </div>
        <div className="max-h-[min(60vh,420px)] overflow-y-auto py-2">
          {rows.map((row) => {
            if (row.type === "header") {
              return (
                <div
                  key={row.key}
                  className="px-3 pb-1 pt-2 first:pt-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]"
                >
                  {row.title}
                </div>
              );
            }
            if (row.type === "hint") {
              return (
                <div
                  key={row.key}
                  className="px-3 py-2 text-sm text-[var(--muted-foreground)]"
                >
                  {row.text}
                </div>
              );
            }
            const active = row.flatIndex === activeIndex;
            return (
              <button
                key={`${row.item.id}-${row.flatIndex}`}
                type="button"
                onMouseEnter={() => setActiveIndex(row.flatIndex)}
                onClick={() => runSelect(row.item)}
                className={`flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm transition ${
                  active
                    ? "bg-[var(--surface-muted)] text-[var(--foreground)]"
                    : "text-[var(--foreground)] hover:bg-[var(--surface-muted)]/70"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{row.item.label}</span>
                  {row.item.href ? (
                    <span className="truncate text-xs text-[var(--muted-foreground)]">
                      {row.item.href}
                    </span>
                  ) : null}
                </div>
                {row.item.description ? (
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {row.item.description}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <div className="border-t border-[var(--border)] px-3 py-2 text-[11px] text-[var(--muted-foreground)]">
          <span className="mr-3">
            <kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> move
          </span>
          <span className="mr-3">
            <kbd className="kbd">Enter</kbd> open
          </span>
          <span>
            <kbd className="kbd">Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
