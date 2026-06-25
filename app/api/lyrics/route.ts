import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const title = searchParams.get('title');

  if (!artist || !title) {
    return NextResponse.json({ error: 'Missing artist or title' }, { status: 400 });
  }

  // Clean up strings — remove featured artists, parenthetical junk
  const cleanArtist = artist.replace(/\(.*?\)/g, '').split(',')[0].split('&')[0].trim();
  const cleanTitle = title
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/feat\..*$/i, '')
    .trim();

  try {
    const res = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      // fallback: try chartlyrics
      return NextResponse.json({ lyrics: null, error: 'Lyrics not found' }, { status: 404 });
    }

    const data = await res.json();

    if (!data.lyrics) {
      return NextResponse.json({ lyrics: null, error: 'No lyrics returned' }, { status: 404 });
    }

    // Split into lines, strip blank dupes
    const lines: string[] = data.lyrics
      .split('\n')
      .map((l: string) => l.trim())
      .filter((l: string, i: number, arr: string[]) => {
        if (l === '' && arr[i - 1] === '') return false;
        return true;
      });

    return NextResponse.json({ lyrics: lines, raw: data.lyrics });
  } catch {
    return NextResponse.json({ error: 'Fetch error' }, { status: 500 });
  }
}
