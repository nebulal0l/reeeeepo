'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LanyardData } from '../types';

export function useLanyard(intervalMs = 10000) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch('/api/presence');
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setError(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, intervalMs);
    return () => clearInterval(id);
  }, [fetch_, intervalMs]);

  return { data, loading, error };
}
