import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  title: 'Stay Micro - Restez sous le plafond micro-entreprise',
  description:
    'Calculez votre marge de manœuvre et restez sous le plafond de 77 700 € pour conserver votre statut micro-entrepreneur.',
  keywords: [
    'micro-entreprise',
    'auto-entrepreneur',
    'plafond',
    '77700',
    'CA',
    'chiffre affaires',
    'freelance',
    'France',
  ],
  authors: [{ name: 'Stay Micro' }],
  openGraph: {
    title: 'Stay Micro - Restez sous le plafond micro-entreprise',
    description:
      'Calculez votre marge de manœuvre et restez sous le plafond de 77 700 €',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
