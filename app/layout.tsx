import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_Arabic } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/LanguageContext"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DzRetour — احمِ تجارتك من روتور في الجزائر",
  description:
    "منصة تبادل بيانات روتور لتجار الجزائر. تحقق من أرقام العملاء وأبلغ عن روتور لحماية تجارتك وتقليل الخسائر.",
  keywords: "ريتور, الجزائر, تجارة, حماية, تحقق, أرقام",
  authors: [{ name: "DzRetour Team" }],
  creator: "DzRetour",
  publisher: "DzRetour",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    alternateLocale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "DzRetour",
    title: "DzRetour — احمِ تجارتك من روتور في الجزائر",
    description:
      "منصة تبادل بيانات روتور لتجار الجزائر. تحقق من أرقام العملاء وأبلغ عن روتور لحماية تجارتك وتقليل الخسائر.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DzRetour - احمِ تجارتك من روتور",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DzRetour — احمِ تجارتك من روتور في الجزائر",
    description: "منصة تبادل بيانات روتور لتجار الجزائر",
    images: ["/og-image.png"],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL} />
        <link rel="alternate" hrefLang="ar" href={`${process.env.NEXT_PUBLIC_SITE_URL}/ar`} />
        <link rel="alternate" hrefLang="en" href={`${process.env.NEXT_PUBLIC_SITE_URL}/en`} />
        <link rel="alternate" hrefLang="x-default" href={process.env.NEXT_PUBLIC_SITE_URL} />
      </head>
      <body className={`${inter.variable} ${notoSansArabic.variable}`}>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}
