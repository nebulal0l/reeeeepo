'use client';

import { useState, useEffect, useRef } from 'react';

interface LyricsState {
  lines: string[];
  loading: boolean;
  error: string | null;
  activeIndex: number;
}

export function useLyrics(
  artist: string | null,
  song: string | null,
  progressMs: number,
  durationMs: number
) {
  const [state, setState] = useState<LyricsState>({
    lines: [],
    loading: false,
    error: null,
    activeIndex: 0,
  });
  const cacheRef = useRef<Record<string, string[]>>({});
  const lastSongRef = useRef<string>('');

  // Fetch lyrics when song changes
  useEffect(() => {
    if (!artist || !song) return;
    const key = `${artist}::${song}`;
    if (key === lastSongRef.current) return;
    lastSongRef.current = key;

    // Check cache first
    if (cacheRef.current[key]) {
      setState(s => ({ ...s, lines: cacheRef.current[key], loading: false, error: null }));
      return;
    }

    setState(s => ({ ...s, loading: true, error: null, lines: [] }));

    const controller = new AbortController();
    fetch(`/api/lyrics?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(song)}`, {
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => {
        if (data.lyrics) {
          cacheRef.current[key] = data.lyrics;
          setState(s => ({ ...s, lines: data.lyrics, loading: false }));
        } else {
          setState(s => ({ ...s, loading: false, error: 'No lyrics found' }));
        }
      })
      .catch(e => {
        if (e.name !== 'AbortError') {
          setState(s => ({ ...s, loading: false, error: 'Failed to load lyrics' }));
        }
      });

    return () => controller.abort();
  }, [artist, song]);

  // Active line estimation based on progress
  useEffect(() => {
    if (state.lines.length === 0 || durationMs === 0) return;

    const progress = progressMs / durationMs;
    // Non-uniform distribution: lyrics usually start ~5% in, end ~90% in
    const lyricsProgress = Math.max(0, (progress - 0.05) / 0.85);
    const rawIndex = Math.floor(lyricsProgress * state.lines.length);
    // Skip blank lines
    let idx = Math.min(rawIndex, state.lines.length - 1);
    while (idx > 0 && state.lines[idx] === '') idx--;

    setState(s => ({ ...s, activeIndex: idx }));
  }, [progressMs, durationMs, state.lines]);

  return state;
}
