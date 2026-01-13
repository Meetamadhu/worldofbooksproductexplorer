import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SWRProvider } from '@/lib/swr-config';

export const metadata: Metadata = {
  title: 'Product Data Explorer',
  description: 'Explore and discover products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SWRProvider>
          <Header />
          <main style={{ minHeight: '70vh' }}>
            {children}
          </main>
          <Footer />
        </SWRProvider>
      </body>
    </html>
  );
}
