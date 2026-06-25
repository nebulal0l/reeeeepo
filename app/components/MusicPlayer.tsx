'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useLyrics } from '../hooks/useLyrics';
import type { SpotifyData } from '../types';

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function MusicPlayer({
  spotify,
  progressMs,
}: {
  spotify: SpotifyData | null;
  progressMs: number;
}) {
  const lyricsRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLParagraphElement>(null);
  const hasScrolledRef = useRef(false);
  const userScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const duration = spotify ? spotify.timestamps.end - spotify.timestamps.start : 0;
  const pct = spotify ? Math.min(100, (progressMs / duration) * 100) : 0;

  const { lines, loading, error, activeIndex } = useLyrics(
    spotify?.artist ?? null,
    spotify?.song ?? null,
    progressMs,
    duration
  );

  // Track user manually scrolling the lyrics box — pause auto-scroll briefly
  useEffect(() => {
    const el = lyricsRef.current;
    if (!el) return;
    const onScroll = () => {
      userScrollingRef.current = true;
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        userScrollingRef.current = false;
      }, 2000);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [lines.length]);

  // Scroll WITHIN the lyrics container only — never touches window scroll
  useEffect(() => {
    if (!activeLineRef.current || !lyricsRef.current) return;
    if (userScrollingRef.current) return;
    // Skip index 0 on first render so page doesn't jump on load
    if (!hasScrolledRef.current && activeIndex === 0) return;
    hasScrolledRef.current = true;

    const container = lyricsRef.current;
    const line = activeLineRef.current;
    const offset =
      line.offsetTop - container.clientHeight / 2 + line.clientHeight / 2;
    container.scrollTo({ top: offset, behavior: 'smooth' });
  }, [activeIndex]);

  if (!spotify) {
    return (
      <section id="music" className="relative z-10 px-4 py-20 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-white">music</h2>
        <div className="glass p-8 text-center">
          <p className="text-white/20 text-sm">not listening to anything right now...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="music" className="relative z-10 px-4 py-20 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-white">music</h2>

      <div className="glass p-6 md:p-8">
        {/* Top: album art + info */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
          {/* Vinyl-style album art */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 vinyl-spin relative">
              <Image
                src={spotify.album_art_url}
                alt={spotify.album}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-4 h-4 rounded-full bg-black border-2 border-white/10" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-white/40 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <p className="text-xs text-white/30 uppercase tracking-widest">Spotify</p>
            </div>
            <h3 className="text-xl font-bold text-white truncate">{spotify.song}</h3>
            <p className="text-sm text-white/50 truncate">{spotify.artist}</p>
            <p className="text-xs text-white/25 truncate mt-0.5">{spotify.album}</p>

            {/* Progress bar — white/grey */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-white/25 tabular-nums w-10">{formatMs(progressMs)}</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-white/25 tabular-nums w-10 text-right">{formatMs(duration)}</span>
            </div>
          </div>
        </div>

        {/* Lyrics section */}
        <div className="border-t border-white/5 pt-6">
          <p className="text-xs text-white/20 uppercase tracking-widest mb-4">Lyrics</p>

          {loading && (
            <div className="flex gap-1 py-4 justify-center">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}

          {error && !loading && (
            <p className="text-white/15 text-sm text-center py-4">{error}</p>
          )}

          {lines.length > 0 && (
            <div
              ref={lyricsRef}
              className="max-h-72 overflow-y-auto space-y-2 pr-2 relative"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
            >
              <div className="sticky top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

              {lines.map((line, i) => {
                const isActive = i === activeIndex;
                const isNear = Math.abs(i - activeIndex) <= 2;

                return (
                  <p
                    key={i}
                    ref={isActive ? activeLineRef : undefined}
                    className={[
                      'text-sm leading-relaxed transition-all duration-500 select-none',
                      line === ''
                        ? 'h-3'
                        : isActive
                        ? 'text-white font-semibold scale-[1.02] origin-left lyric-active'
                        : isNear
                        ? 'text-white/40'
                        : 'text-white/12',
                    ].join(' ')}
                  >
                    {line || '\u00A0'}
                  </p>
                );
              })}

              <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
