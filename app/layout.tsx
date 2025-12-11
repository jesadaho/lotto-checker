import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import PrimeReactProviderWrapper from '@/components/PrimeReactProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lotto Checker - Admin',
  description: 'Lottery checker for lotto seller admin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <PrimeReactProviderWrapper>
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {children}
          </main>
        </PrimeReactProviderWrapper>
      </body>
    </html>
  );
}

