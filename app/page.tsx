import type { Metadata } from "next"
import HeroSection from "@/components/HeroSection"
import FeaturesSection from "@/components/FeaturesSection"
import FAQSection from "@/components/FAQSection"

export const metadata: Metadata = {
  title: "DzRetour — احمِ تجارتك من روتور في الجزائر",
  description:
    "منصة تبادل بيانات روتور لتجار الجزائر. تحقق من أرقام العملاء وأبلغ عن روتور لحماية تجارتك وتقليل الخسائر.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
    languages: {
      ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en`,
    },
  },
}

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DzRetour",
    description: "منصة تبادل بيانات روتور لتجار الجزائر",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL}/check?phone={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
    </>
  )
}
