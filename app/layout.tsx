import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { LenisProvider } from '@/components/shared/SmoothScroll';
import GridBackground from '@/components/shared/GridBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Investigation Intelligence Copilot',
  description: 'An AI-powered investigation platform for law enforcement.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-straight/css/uicons-solid-straight.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-rounded/css/uicons-solid-rounded.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-rounded/css/uicons-regular-rounded.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-straight/css/uicons-regular-straight.css" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#FAFAFA] text-[#111111] overflow-x-hidden`} suppressHydrationWarning>
        <GridBackground />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
