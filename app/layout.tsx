import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Lao } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { StoreProvider } from '@/lib/store'
import { AuthProvider } from '@/lib/auth'
import { ShopChrome } from '@/components/layout/shop-chrome'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
})

const notoSansLao = Noto_Sans_Lao({
  subsets: ['lao'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-lao',
})

export const metadata: Metadata = {
  title: 'ສຸຂະພາບ & ຄວາມງາມ | Health & Beauty Laos',
  description: 'ຮ້ານຂາຍອາຫານເສີມ, ວິຕາມິນ ແລະ ຜະລິດຕະພັນດູແລຜິວໜັງຄຸນນະພາບສູງ ນຳເຂົ້າໂດຍກົງຈາກຕ່າງປະເທດ',
  generator: 'v0.app',
  keywords: ['ອາຫານເສີມ', 'ວິຕາມິນ', 'ຄໍລາເຈນ', 'ດູແລຜິວໜັງ', 'ລາວ', 'supplements', 'vitamins', 'skincare', 'laos'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#064E3B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="lo" className={`${geist.variable} ${geistMono.variable} ${notoSansLao.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <StoreProvider>
          <AuthProvider>
            <ShopChrome>{children}</ShopChrome>
          </AuthProvider>
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
