"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function FeaturesSection() {
  const { t } = useLanguage()

  const features = [
    {
      title: t("features.report.title"),
      description: t("features.report.description"),
      icon: "📢",
      color: "bg-red-50 text-red-600",
    },
    {
      title: t("features.check.title"),
      description: t("features.check.description"),
      icon: "🔍",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: t("features.protect.title"),
      description: t("features.protect.description"),
      icon: "🛡️",
      color: "bg-green-50 text-green-600",
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4 text-balance">
            {t("features.title")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">{t("features.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card text-center group cursor-pointer hover:scale-[1.02] transition-all duration-300 min-h-[200px] flex flex-col justify-center"
            >
              <div
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-3 md:mb-4 text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-card-foreground mb-2 md:mb-3 group-hover:text-primary transition-colors duration-300 text-balance">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed px-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
