import type { Metadata } from 'next';
import { AccentThemeProvider } from '@/components/providers/AccentThemeProvider';
import './globals.css';

const defaultAccentHex = '#5CFF7B' as const;

export const metadata: Metadata = {
  title: '2k-garden',
  description:
    'A web application for managing and monitoring your unique digital space, providing real-time data and insights',
  icons: {
    icon: '/logo.svg',
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex flex-col w-full m-0 p-0">
        <AccentThemeProvider accentHex={defaultAccentHex}>{children}</AccentThemeProvider>
      </body>
    </html>
  );
}
