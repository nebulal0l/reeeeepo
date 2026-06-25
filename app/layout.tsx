import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'star — developer & builder',
  description: 'portfolio of star / panquake',
  openGraph: {
    title: 'star',
    description: 'developer & builder',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="orb orb-pink" />
        <div className="orb orb-purple" />
        {children}
      </body>
    </html>
  );
}
