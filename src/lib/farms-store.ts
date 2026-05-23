import type { Farm } from "@/types/platform";

import { seedFarms } from "./mock-data";

const KEY = "agritrust_farms_v1";

function read(): Farm[] {
  if (typeof window === "undefined") return seedFarms();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const initial = seedFarms();
      window.localStorage.setItem(KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as Farm[];
  } catch {
    return seedFarms();
  }
}

function write(farms: Farm[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(farms));
}

export function getFarms(): Farm[] {
  return read();
}

export function getFarm(id: string): Farm | undefined {
  return read().find((f) => f.id === id);
}

export function upsertFarm(farm: Farm): void {
  const farms = read();
  const i = farms.findIndex((f) => f.id === farm.id);
  if (i === -1) farms.push(farm);
  else farms[i] = farm;
  write(farms);
}

export function newFarmId(): string {
  return `farm-${Date.now()}`;
}
