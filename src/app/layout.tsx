import type { Metadata } from 'next';
import { AccentThemeProvider } from '@/components/providers/AccentThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { rootLayoutClassNames } from './root-layout.styles';
import './globals.css';

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
    <html lang="en" className={rootLayoutClassNames.html}>
      <body className={rootLayoutClassNames.body}>
        <AccentThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AccentThemeProvider>
      </body>
    </html>
  );
}
