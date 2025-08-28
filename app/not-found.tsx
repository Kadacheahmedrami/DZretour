"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

export default function NotFound() {
  const { language } = useLanguage()

  const content =
    language === "ar"
      ? {
          title: "الصفحة غير موجودة",
          description: "عذراً، الصفحة التي تبحث عنها غير موجودة.",
          button: "العودة للرئيسية",
        }
      : {
          title: "Page non trouvée",
          description: "Désolé, la page que vous recherchez n'existe pas.",
          button: "Retour à l'accueil",
        }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="card">
          <div className="text-6xl mb-4">404</div>
          <h1 className="text-2xl font-bold text-dark mb-4">{content.title}</h1>
          <p className="text-gray-600 mb-8">{content.description}</p>
          <Link href="/" className="btn-primary">
            {content.button}
          </Link>
        </div>
      </div>
    </div>
  )
}
