import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StoreInitializer } from '@/components/providers/StoreInitializer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Motor Z-Score - Jaiber Arellano',
  description:
    'Sistema computacional de estructuración de Balance General, cálculo de razones financieras y predicción de riesgo crediticio.',
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
        <StoreInitializer>{children}</StoreInitializer>
      </body>
    </html>
  );
}
