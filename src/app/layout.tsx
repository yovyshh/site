
import type { Metadata } from 'next';
import { VT323 } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ModeToggle } from '@/components/mode-toggle';

const vt323 = VT323({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RetroSite Portfolio',
  description: 'A Windows 98 themed portfolio by an expert designer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${vt323.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ModeToggle />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
