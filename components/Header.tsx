"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const { language, setLanguage, t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
              <Image src="/images/logo.png" alt="DzRetour Logo" width={48} height={48} className="h-12 w-12" />
              <span className="text-2xl font-bold text-foreground">DzRetour</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-primary/5"
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/report"
              className="text-muted-foreground hover:text-primary transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-primary/5"
            >
              {t("nav.report")}
            </Link>
            <Link
              href="/check"
              className="text-muted-foreground hover:text-primary transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-primary/5"
            >
              {t("nav.check")}
            </Link>
          </nav>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="hidden md:flex items-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-1">
              <button
                onClick={() => setLanguage("ar")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  language === "ar"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  language === "en"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-card/50 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <nav className="py-4 space-y-2">
              <Link
                href="/"
                className="block px-4 py-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/report"
                className="block px-4 py-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.report")}
              </Link>
              <Link
                href="/check"
                className="block px-4 py-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.check")}
              </Link>

              <div className="px-4 py-2">
                <div className="flex items-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-1">
                  <button
                    onClick={() => {
                      setLanguage("ar")
                      setIsMenuOpen(false)
                    }}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      language === "ar"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en")
                      setIsMenuOpen(false)
                    }}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      language === "en"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
