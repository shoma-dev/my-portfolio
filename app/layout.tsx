import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shoma — Data Engineer & Consultant',
  description: 'データエンジニア・コンサルタント Shoma のポートフォリオサイト。Web制作・RPA・AIエージェント・データ分析。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
