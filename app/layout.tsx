import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'cat :D',
  description: 'Just Monika.',
  openGraph: {
    title: 'cat',
    description: 'yuri from ddlc so peak',
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
