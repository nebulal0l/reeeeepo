'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Github, Globe, ArrowDown, MessageCircle } from 'lucide-react';
import { useLanyard } from './hooks/useLanyard';
import { NowPlayingBanner } from './components/NowPlayingBanner';
import { MusicPlayer } from './components/MusicPlayer';
import { ProjectCard } from './components/ProjectCard';
import { StatusDot } from './components/StatusDot';
import { FooterModal } from './components/FooterModal';
import { projects } from './data/projects';

export default function Home() {
  const { data } = useLanyard(10000);
  const [progressMs, setProgressMs] = useState(0);
  const frameRef = useRef<number>(0);

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

  return (
    <main className="relative min-h-screen">
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

          {/* Bio */}
          <div className="max-w-xl">
            <p className="text-white/50 text-base leading-relaxed">
              thanks to everyone whos been supportive 💖
            </p>
          </div>

          {/* Social links */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Github, label: 'GitHub', href: 'https://github.com/hdhw' },
              { icon: Globe, label: 'Paragon <3', href: 'https://paragn.lol/u/1' },
              { icon: MessageCircle, label: 'Discord', href: 'https://discord.com/users/530244467039535104' },
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
