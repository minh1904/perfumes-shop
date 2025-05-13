import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const generalSans = localFont({
  src: [
    {
      path: '../assets/fonts/GeneralSans-Variable.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../assets/fonts/GeneralSans-VariableItalic.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-general-sans',
  display: 'swap',
});

const roslindaleItalic = localFont({
  src: [
    {
      path: '../assets/fonts/Roslindale-DeckNarrowItalic-Testing.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-roslindale-italic',
  display: 'swap',
});

const roslindaleMediumItalic = localFont({
  src: [
    {
      path: '../assets/fonts/Roslindale-DeckNarrowMediumItalic-Testing.woff2',
      weight: '600',
      style: 'italic',
    },
  ],
  variable: '--font-roslindale-medium-italic',
  display: 'swap',
});
export const metadata: Metadata = {
  title: 'Parfum Elite',
  description: 'An Perfume shop',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${generalSans.variable} ${roslindaleItalic.variable} ${roslindaleMediumItalic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
