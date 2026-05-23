"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchFarmsList } from "@/lib/farms-api";
import type { Farm } from "@/types/platform";

export function useFarmsFromApi(): {
  farms: Farm[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
} {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchFarmsList();
      setFarms(list);
    } catch (e) {
      setError((e as Error).message);
      setFarms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { farms, loading, error, reload };
}
