import type { Metadata } from 'next'
import './globals.css'
import WhatsAppButton from './components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Lumera | Melt Into Luxury - Premium Handcrafted Candles',
  description:
    'Discover Lumera\'s exquisite collection of handcrafted luxury candles. A redefined balance of fragrance, craftsmanship, and quiet luxury - created to elevate everyday moments.',
  keywords: [
    'luxury candles',
    'handcrafted candles',
    'premium candles India',
    'scented candles',
    'soy wax candles',
    'home fragrance',
    'Lumera candles',
    'gift candles',
  ],
  authors: [{ name: 'Lumera' }],
  creator: 'Lumera',
  publisher: 'Lumera',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Lumera | Melt Into Luxury',
    description:
      'A redefined balance of fragrance, craftsmanship, and quiet luxury - created to elevate everyday moments.',
    url: '/',
    siteName: 'Lumera',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Lumera - Melt Into Luxury',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumera | Melt Into Luxury',
    description:
      'A redefined balance of fragrance, craftsmanship, and quiet luxury.',
    images: ['/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="lumera-site">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
