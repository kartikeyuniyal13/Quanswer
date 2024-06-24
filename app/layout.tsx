import { Inter, Space_Grotesk } from 'next/font/google';
import type { Metadata } from 'next';

import {
  ClerkProvider,
} from '@clerk/nextjs';
import './globals.css';
import React from 'react';
import { ThemeContextProvider } from '@/context/ThemeProvider';


const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk'
});

export const metadata: Metadata = {
  title: "Quanswer",
  description: "A repository of knowledge",
  keywords: "nextpro1",
  icons: {
    icon: '/assets/images/site-logo.svg',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'primary-gradient',
          footerActionLink: 'primary-text-gradient hover:text-primary-500'
        }
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
          <main>
             <ThemeContextProvider>
             {children}
            </ThemeContextProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
