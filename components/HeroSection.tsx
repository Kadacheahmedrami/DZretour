"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { Shield, Search } from "lucide-react"

export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className=" mt-4   bg-gradient-to-br from-slate-50 to-slate-100 md:mt-0 min-h-screen flex items-center relative overflow-hidden pt-16 md:pt-24 pb-8 md:pb-0">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 md:top-20 left-4 md:left-10 w-48 h-48 md:w-72 md:h-72 bg-primary/5 rounded-full blur-3xl float-animation"></div>
        <div
          className="absolute bottom-10 md:bottom-20 right-4 md:right-10 w-64 h-64 md:w-96 md:h-96 bg-secondary/5 rounded-full blur-3xl float-animation"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-4 md:mb-8 leading-tight tracking-tight text-balance">
            {t("hero.title")}
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed font-medium px-2">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center items-center mb-12 md:mb-16 px-4">
            <Link
              href="/report"
              className="btn-primary text-base md:text-lg px-8 md:px-10 py-4 md:py-5 w-full sm:w-auto sm:min-w-[200px] group"
            >
              <span className="flex items-center justify-center gap-3">
                <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {t("hero.cta.report")}
              </span>
            </Link>
            <Link
              href="/check"
              className="btn-secondary text-base md:text-lg px-8 md:px-10 py-4 md:py-5 w-full sm:w-auto sm:min-w-[200px] group"
            >
              <span className="flex items-center justify-center gap-3">
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {t("hero.cta.check")}
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto px-2">
            <div className="glass-card text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">10,000+</div>
              <div className="text-xs md:text-sm text-muted-foreground">{t("hero.stats.reports")}</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">5,000+</div>
              <div className="text-xs md:text-sm text-muted-foreground">{t("hero.stats.merchants")}</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">95%</div>
              <div className="text-xs md:text-sm text-muted-foreground">{t("hero.stats.accuracy")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
