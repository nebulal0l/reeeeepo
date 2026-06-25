'use client';

import Image from 'next/image';
import type { SpotifyData } from '../types';

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function NowPlayingBanner({
  spotify,
  progressMs,
  onClick,
}: {
  spotify: SpotifyData;
  progressMs: number;
  onClick?: () => void;
}) {
  const duration = spotify.timestamps.end - spotify.timestamps.start;
  const pct = Math.min(100, (progressMs / duration) * 100);

  return (
    <button
      onClick={onClick}
      className="glass flex items-center gap-3 px-4 py-3 text-left w-full max-w-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      title="Click to jump to music player"
    >
      {/* Album art */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-md overflow-hidden relative">
          <Image
            src={spotify.album_art_url}
            alt={spotify.album}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        {/* Spinning vinyl overlay indicator */}
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="white">
            <polygon points="3,1 9,5 3,9" />
          </svg>
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/40 mb-0.5">Listening to</p>
        <p className="text-sm font-semibold text-white truncate">{spotify.song}</p>
        <p className="text-xs text-white/50 truncate">{spotify.artist}</p>

        {/* Progress */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] text-white/30 tabular-nums">
            {formatMs(progressMs)} / {formatMs(duration)}
          </span>
        </div>
      </div>
    </button>
  );
}
