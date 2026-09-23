import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arnab Crafts',
  description: 'Custom photo frames from ₹149, available in A4 to large sizes.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
