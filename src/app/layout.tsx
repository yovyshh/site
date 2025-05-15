import type { Metadata } from 'next';
import { VT323 } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

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
    <html lang="en" className="dark"> {/* Apply dark theme globally */}
      <body className={`${vt323.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
