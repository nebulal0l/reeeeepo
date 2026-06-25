'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Github, Globe, ArrowDown, MessageCircle } from 'lucide-react';
import { useLanyard } from './hooks/useLanyard';
import { NowPlayingBanner } from './components/NowPlayingBanner';
import { MusicPlayer } from './components/MusicPlayer';
import { ProjectCard } from './components/ProjectCard';
import { StatusDot } from './components/StatusDot';
import { FooterModal } from './components/FooterModal';
import { projects } from './data/projects';

// "Just Monika" — each character code
const SECRET = 'just monika';

export default function Home() {
  const { data } = useLanyard(10000);
  const [progressMs, setProgressMs] = useState(0);
  const frameRef = useRef<number>(0);

  // Easter egg state
  const [monika, setMonika] = useState(false);
  const bufferRef = useRef('');

  // Keydown listener — accumulates typed chars, checks against secret
  const handleKey = useCallback((e: KeyboardEvent) => {
    // ignore modifier combos
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    let ch = '';
    if (e.key === ' ') ch = ' ';
    else if (e.key.length === 1) ch = e.key.toLowerCase();
    else return;
    bufferRef.current = (bufferRef.current + ch).slice(-SECRET.length);
    if (bufferRef.current === SECRET) {
      setMonika(true);
      bufferRef.current = '';
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    if (!data?.spotify) return;
    const update = () => {
      const now = Date.now();
      const elapsed = now - data.spotify!.timestamps.start;
      const duration = data.spotify!.timestamps.end - data.spotify!.timestamps.start;
      setProgressMs(Math.min(elapsed, duration));
      frameRef.current = requestAnimationFrame(update);
    };
    frameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameRef.current);
  }, [data?.spotify?.track_id]);

  const scrollToMusic = () => {
    document.getElementById('music')?.scrollIntoView({ behavior: 'smooth' });
  };

  const avatarUrl = 'https://cdn.pfps.gg/pfps/2024-eoljjang.png';
  const displayName = data?.discord_user?.global_name || data?.discord_user?.username || 'cat';

  // Bio switches when monika mode is active
  const bio = monika
    ? 'Domn Gihceu'
    : 'Lets go read a story! What about S̶̻͆a̷̮̕y̵̩͆ö̶͎r̶̢͊ì̸͈  lets talk about me instead!';

  return (
    <main className="relative min-h-screen">

      {/* ─── JUST MONIKA MODAL ────────────────────────────── */}
      {monika && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
          onClick={() => setMonika(false)}
        >
          <div
            className="flex flex-col items-center gap-4"
            onClick={e => e.stopPropagation()}
          >
            {/* The card image */}
            <img
              src="/monika.svg"
              alt="Just Monika."
              style={{
                width: 360,
                borderRadius: 18,
                boxShadow: '0 24px 80px #f48fb155',
                animation: 'monikaPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
              }}
            />
            <button
              onClick={() => setMonika(false)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.4)',
                fontSize: 11,
                padding: '6px 18px',
                borderRadius: 99,
                cursor: 'pointer',
                letterSpacing: 1,
              }}
            >
              esc
            </button>
          </div>
          <style>{`
            @keyframes monikaPop {
              from { opacity: 0; transform: scale(0.6); }
              to   { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center px-4 max-w-4xl mx-auto py-24">
        <div className="flex flex-col gap-8">
          {/* Avatar + status */}
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 relative">
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {data && (
                <div className="absolute -bottom-1 -right-1">
                  <span
                    className="block w-4 h-4 rounded-full border-2 border-black"
                    style={{
                      backgroundColor:
                        data.discord_status === 'online'
                          ? '#ffffff'
                          : data.discord_status === 'idle'
                          ? '#aaaaaa'
                          : data.discord_status === 'dnd'
                          ? '#555555'
                          : '#333333',
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
                cat
              </h1>
              {data && (
                <div className="mt-1">
                  <StatusDot status={data.discord_status} />
                </div>
              )}
            </div>
          </div>

          {/* Bio — switches to encoded message when triggered */}
          <div className="max-w-xl">
            <p
              className="text-white/50 text-base leading-relaxed transition-all duration-500"
              style={monika ? { color: '#f48fb1', fontStyle: 'italic' } : {}}
            >
              {bio}
            </p>
          </div>

          {/* Social links */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Github, label: 'GitHub', href: 'https://github.com/hdhw' },
              { icon: Globe, label: 'Paragon <3', href: 'https://paragn.lol/u/1' },
              { icon: MessageCircle, label: 'Discord', href: '#' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-white transition-colors"
              >
                <Icon size={13} />
                {label}
              </a>
            ))}
          </div>

          {/* Now playing */}
          {data?.listening_to_spotify && data.spotify && (
            <NowPlayingBanner
              spotify={data.spotify}
              progressMs={progressMs}
              onClick={scrollToMusic}
            />
          )}

          {/* Scroll hint */}
          <div className="mt-4 flex items-center gap-2 text-white/15 text-xs animate-bounce">
            <ArrowDown size={12} />
            scroll
          </div>
        </div>
      </section>

      {/* ─── PROJECTS ──────────────────────────────────────── */}
      <section className="relative z-10 px-4 py-20 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-white">projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </section>

      {/* ─── MUSIC PLAYER ──────────────────────────────────── */}
      <MusicPlayer
        spotify={data?.spotify ?? null}
        progressMs={progressMs}
      />

      {/* ─── FOOTER ────────────────────────────────────────── */}
      <footer className="relative z-10 px-4 py-12 max-w-4xl mx-auto border-t border-white/5">
        <div className="flex items-center justify-center gap-1">
          <p className="text-white/15 text-xs text-center">
            meow · presence via{' '}
            <a href="https://lanyard.rest" className="hover:text-white/40 transition-colors">
              lanyard
            </a>{' '}
            · lyrics via lyrics.ovh
          </p>
          <FooterModal />
        </div>
      </footer>
    </main>
  );
}
