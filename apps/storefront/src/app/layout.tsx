import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { getStoreData } from '@/lib/store-server';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export async function generateMetadata(): Promise<Metadata> {
  const { store } = await getStoreData();

  return {
    title: {
      default: store?.name || 'Store',
      template: `%s | ${store?.name || 'Store'}`,
    },
    description: store?.description || 'Welcome to our store',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { store, categories, storeIdentifier } = await getStoreData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers
          initialStore={store}
          initialCategories={categories}
          storeIdentifier={storeIdentifier}
        >
          <div className="flex min-h-screen flex-col">
            <Header
              storeName={store?.name}
              logo={store?.logo}
              categories={categories}
            />
            <main className="flex-1">{children}</main>
            <Footer storeName={store?.name} />
          </div>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
