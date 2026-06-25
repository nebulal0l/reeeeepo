export interface Project {
  name: string;
  description: string;
  tags: string[];
  url?: string;
  repo?: string;
  wip?: boolean;
  shutdown?: boolean;
}

export const projects: Project[] = [
  {
    name: 'Paragon',
    description: 'Bio/profile link platform. Glassmorphic, clean, yours.',
    tags: ['FastAPI', 'SQLite', 'Next.js'],
    url: 'https://paragn.lol',
    wip: false,
  },
  {
    name: 'Wavebox',
    description: 'Self-hosted music streaming service with an Electron frontend.',
    tags: ['FastAPI', 'SQLite', 'Electron'],
    wip: false,
  },
  {
    name: 'Noctura',
    description: 'Roblox script hub. Contains mass amount of supported games.',
    tags: ['Lua', 'Vercel', 'Roblox'],
    url: 'https://noctura-lovat.vercel.app/',
    wip: true,
  },
  {
    name: 'panOS',
    description: 'Arch-based Linux distro with KDE Plasma. Built via archiso.',
    tags: ['Arch Linux', 'KDE', 'archiso'],
    wip: true,
  },
  {
    name: 'Photogram',
    description: 'Discord/messaging clone with glassmorphism UI.',
    tags: ['Next.js', 'FastAPI', 'Cloudflare'],
    wip: false,
    shutdown: true,
  },
  {
    name: 'CustomProfiles',
    description: 'Vencord/Equicord plugin for spoofing Discord profile data.',
    tags: ['TypeScript', 'Vencord', 'Discord'],
    repo: 'https://github.com/hdhw/CustomProfiles',
    wip: false,
  },
];
