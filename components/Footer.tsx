"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import Logo from "./Logo"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold text-dark">DzRetour</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{t("footer.description")}</p>
          </div>

          <div>
            <h3 className="font-semibold text-dark mb-4">{t("footer.links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  {t("nav.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  {t("nav.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-dark mb-4">{t("footer.contact")}</h3>
            <p className="text-gray-600 text-sm">contact@dzretour.com</p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">© 2025 DzRetour. {t("footer.rights")}.</p>
        </div>
      </div>
    </footer>
  )
}
