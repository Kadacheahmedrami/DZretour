"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.report": "أبلغ",
    "nav.check": "تحقق",
    "nav.terms": "الشروط",
    "nav.privacy": "الخصوصية",

    // Landing Page
    "hero.title": "احمِ تجارتك من روتور في الجزائر",
    "hero.subtitle":
      "منصة تبادل بيانات روتور لتجار الجزائر. تحقق من أرقام العملاء وأبلغ عن روتور لحماية تجارتك وتقليل الخسائر.",
    "hero.cta.report": "أبلغ الآن",
    "hero.cta.check": "تحقق الآن",
    "hero.stats.reports": "تقرير موثق",
    "hero.stats.merchants": "تاجر محمي",
    "hero.stats.accuracy": "دقة التحقق",

    // Features
    "features.report.title": "أبلغ عن روتور",
    "features.report.description": "ساعد التجار الآخرين بالإبلاغ عن حالات روتور",
    "features.check.title": "تحقق من الأرقام",
    "features.check.description": "تحقق من تاريخ رقم الهاتف قبل الشحن",
    "features.protect.title": "احمِ تجارتك",
    "features.protect.description": "قلل من خسائر روتور وزد أرباحك",

    // Report Page
    "report.title": "أبلغ عن روتور",
    "report.phone.label": "رقم الهاتف",
    "report.phone.placeholder": "مثال: +213 555 123 456",
    "report.phone.help": "أدخل رقم الهاتف الجزائري بالتنسيق الصحيح",
    "report.reason.label": "سبب روتور (اختياري)",
    "report.reason.placeholder": "اختر السبب",
    // Updated reason translations to match backend exactly
    "report.reason.product_dissatisfaction": "عدم الرضا عن المنتج",
    "report.reason.refused_to_open": "رفض فتح الطرد",
    "report.reason.package_damaged": "تلف الطرد أثناء التوصيل", 
    "report.reason.changed_mind": "تغيير رأي العميل",
    "report.reason.other": "أخرى",
    "report.evidence.label": "رابط الدليل (اختياري)",
    "report.evidence.placeholder": "رابط الصورة أو الفيديو",
    "report.submit": "أبلغ الآن",
    "report.success": "تم الإبلاغ بنجاح",
    "report.error": "حدث خطأ، حاول مرة أخرى",
    "report.secure": "بياناتك آمنة ومحمية",
    "report.verified": "تم التحقق من البيانات",
    "report.terms.agree": "أوافق على",
    "report.terms.and": "و",

    // Check Page
    "check.title": "تحقق من رقم",
    "check.phone.label": "رقم الهاتف",
    "check.phone.placeholder": "أدخل رقم الهاتف",
    "check.submit": "تحقق",
    "check.risk.high": "خطر عالي",
    "check.risk.medium": "خطر متوسط",
    "check.risk.low": "خطر منخفض",
    "check.reports": "عدد البلاغات",
    "check.last_reported": "آخر بلاغ",
    "check.protect_cta": "حماية تجارتك",

    // Footer
    "footer.description": "منصة تبادل بيانات روتور لحماية التجار في الجزائر",
    "footer.links": "روابط مهمة",
    "footer.contact": "اتصل بنا",
    "footer.rights": "جميع الحقوق محفوظة",

    // Common
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    "phone.invalid": "رقم الهاتف غير صحيح",
    "phone.format": "يجب أن يبدأ الرقم بـ +213",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.report": "Report",
    "nav.check": "Check",
    "nav.terms": "Terms",
    "nav.privacy": "Privacy",

    // Landing Page
    "hero.title": "Protect Your Business from Returns in Algeria",
    "hero.subtitle":
      "Return data sharing platform for Algerian merchants. Check customer numbers and report returns to protect your business and reduce losses.",
    "hero.cta.report": "Report Now",
    "hero.cta.check": "Check Now",
    "hero.stats.reports": "Documented Reports",
    "hero.stats.merchants": "Protected Merchants",
    "hero.stats.accuracy": "Verification Accuracy",

    // Features
    "features.report.title": "Report a Return",
    "features.report.description": "Help other merchants by reporting return cases",
    "features.check.title": "Check Numbers",
    "features.check.description": "Check a phone number's history before shipping",
    "features.protect.title": "Protect Your Business",
    "features.protect.description": "Reduce return losses and increase your profits",

    // Report Page
    "report.title": "Report a Return",
    "report.phone.label": "Phone Number",
    "report.phone.placeholder": "Example: +213 555 123 456",
    "report.phone.help": "Enter Algerian phone number in correct format",
    "report.reason.label": "Return Reason (optional)",
    "report.reason.placeholder": "Choose reason",
    // Updated reason translations to match backend exactly
    "report.reason.product_dissatisfaction": "Product dissatisfaction",
    "report.reason.refused_to_open": "Refused to open package",
    "report.reason.package_damaged": "Package damaged during delivery",
    "report.reason.changed_mind": "Customer changed mind", 
    "report.reason.other": "Other",
    "report.evidence.label": "Evidence Link (optional)",
    "report.evidence.placeholder": "Image or video link",
    "report.submit": "Report Now",
    "report.success": "Report submitted successfully",
    "report.error": "Error occurred, please try again",
    "report.secure": "Your data is secure and protected",
    "report.verified": "Data has been verified",
    "report.terms.agree": "I agree to the",
    "report.terms.and": "and",

    // Check Page
    "check.title": "Check a Number",
    "check.phone.label": "Phone Number",
    "check.phone.placeholder": "Enter phone number",
    "check.submit": "Check",
    "check.risk.high": "High Risk",
    "check.risk.medium": "Medium Risk",
    "check.risk.low": "Low Risk",
    "check.reports": "Number of Reports",
    "check.last_reported": "Last Reported",
    "check.protect_cta": "Protect Your Business",

    // Footer
    "footer.description": "Return reporting platform to protect merchants in Algeria",
    "footer.links": "Important Links",
    "footer.contact": "Contact Us",
    "footer.rights": "All rights reserved",

    // Common
    loading: "Loading...",
    error: "An error occurred",
    "phone.invalid": "Invalid phone number",
    "phone.format": "Number must start with +213",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && (savedLang === "ar" || savedLang === "en")) {
      setLanguage(savedLang)
    } else {
      // Clear invalid language from localStorage and default to Arabic
      localStorage.setItem("language", "ar")
      setLanguage("ar")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"

    if (language === "ar") {
      document.documentElement.classList.add("font-arabic")
    } else {
      document.documentElement.classList.remove("font-arabic")
    }
  }, [language])

  const t = (key: string): string => {
    if (language !== "ar" && language !== "en") {
      console.warn(`[v0] Invalid language detected: ${language}, defaulting to Arabic`)
      return translations.ar[key as keyof typeof translations.ar] || key
    }

    const currentTranslations = translations[language]
    if (!currentTranslations) {
      console.warn(`[v0] No translations found for language: ${language}`)
      return key
    }

    const translation = currentTranslations[key as keyof typeof currentTranslations]
    if (!translation) {
      console.warn(`[v0] Missing translation for key: ${key} in language: ${language}`)
      return key
    }

    return translation
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}