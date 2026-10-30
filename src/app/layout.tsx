import type { Metadata } from 'next';
import { AccentThemeProvider } from '@/components/providers/AccentThemeProvider';
import './globals.css';

const defaultAccentHex = '#321899' as const;

export const metadata: Metadata = {
  title: 'KK Garden',
  description: 'A web application for managing and monitoring your garden, providing real-time data and insights',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex flex-col w-full m-0 p-0">
        <AccentThemeProvider accentHex={defaultAccentHex}>{children}</AccentThemeProvider>
      </body>
    </html>
  );
}
