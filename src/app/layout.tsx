import '@/styles/globals.css';
import { type Metadata } from 'next';

import { HydrateClient } from '@/trpc/server';
import { TRPCReactProvider } from '@/trpc/react';
import { ThemeProvider } from '@/components/theme-providers';
import { Toaster } from "@/components/ui/sonner"
import { env } from '@/env';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Runable Editor',
  description:
    'Runable Editor',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="canonical" href={env.NEXT_PUBLIC_APP_URL} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <HydrateClient>
              {children}
            </HydrateClient>
          </TRPCReactProvider>
        </ThemeProvider>
        <Toaster />
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
