import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Video Generator',
  description: 'Create stunning videos with AI - Transform your ideas into professional video content using advanced AI technology',
  keywords: 'AI video generation, video creator, artificial intelligence, content creation, video production',
  authors: [{ name: 'AI Video Generator Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'AI Video Generator',
    description: 'Create stunning videos with AI technology',
    siteName: 'AI Video Generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Video Generator',
    description: 'Create stunning videos with AI technology',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}