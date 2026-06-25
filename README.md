# star's portfolio

Glassmorphic Next.js portfolio with live Discord presence (Lanyard) and a scroll-synced lyrics player.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS**
- **Framer Motion** (optional, not wired yet — add entrance animations yourself if you want)
- **Lanyard** for Discord presence / Spotify RPC
- **lyrics.ovh** for free lyrics fetching (no API key needed)

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## Config

### Discord ID
Your Discord ID is already baked in at `app/api/presence/route.ts`:
```ts
const DISCORD_ID = '530244467039535104';
```

**You must be in the [Lanyard Discord server](https://discord.gg/lanyard)** for your presence to be tracked.

### Projects
Edit `app/data/projects.ts` to update your projects list.

### Socials
Edit the social links array in `app/page.tsx` in the `// Social links` section.

### Bio
Also in `app/page.tsx`, update the `<p>` tag in the bio section.

## How the lyrics work

1. Lanyard returns the current Spotify song + artist + timestamps
2. On song change, the app hits `/api/lyrics?artist=...&title=...`
3. That route calls `lyrics.ovh` (free, no key needed)
4. Lyrics are split into lines, cached in memory for the session
5. Progress is calculated from Spotify's `timestamps.start/end` via `requestAnimationFrame` for smooth updates
6. The active lyric line is estimated proportionally (non-uniform — accounts for intros/outros)
7. `scrollIntoView` keeps the active line centered

> **Note:** Line-level sync is an estimate, not LRC timestamped. It's close but not perfect.

## Deploy

Works on Vercel out of the box:
```bash
npx vercel
```

Or any platform supporting Next.js.
