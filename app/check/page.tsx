"use client"

import { useState, useCallback } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Search, Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, Info, Eye, EyeOff, Clipboard, Check } from "lucide-react"
import { useEffect, useRef } from "react"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  onValidation: (isValid: boolean) => void
}

function PhoneInput({ value, onChange, onValidation }: PhoneInputProps) {
  const { language } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [showPasteButton, setShowPasteButton] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Algerian phone number constants
  const ALGERIA_COUNTRY_CODE = "+213"
  const MAX_ALGERIAN_DIGITS = 10 // 0xxxxxxxxx format
  
  // Check if clipboard API is available and if there's likely content to paste
  useEffect(() => {
    const checkClipboard = async () => {
      if (navigator.clipboard && navigator.clipboard.readText) {
        try {
          const text = await navigator.clipboard.readText()
          // Show paste button if clipboard contains something that looks like a phone number
          setShowPasteButton(!!(!value && text && /[\d\s\+\-\(\)]{8,}/.test(text)))
        } catch (err) {
          setShowPasteButton(false)
        }
      }
    }
    
    checkClipboard()
  }, [value])

  // Convert +213 format to Algerian local format (0xxxxxxxxx) - matches API normalization
  const formatAlgerianNumber = (phone: string) => {
    // Remove all spaces, dashes, parentheses, but keep + and digits
    let cleaned = phone.replace(/[\s\-\(\)]/g, "")
    
    // Convert all formats to local format (0XXXXXXXXX) to match API normalization
    if (cleaned.startsWith("+213")) {
      // Convert +213xxxxxxxx to 0xxxxxxxx
      cleaned = "0" + cleaned.substring(4)
    } else if (cleaned.startsWith("00213")) {
      // Convert 00213xxxxxxxx to 0xxxxxxxx
      cleaned = "0" + cleaned.substring(5)
    } else if (cleaned.startsWith("213")) {
      // Convert 213xxxxxxxx to 0xxxxxxxx
      cleaned = "0" + cleaned.substring(3)
    } else if (cleaned.match(/^[567]\d{8}$/)) {
      // If it starts with 5, 6, or 7 and has 9 digits total, add 0
      cleaned = "0" + cleaned
    }
    // If it already starts with 0, keep it as is but limit length
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(0, MAX_ALGERIAN_DIGITS)
    }
    
    return cleaned
  }

  // Validate Algerian phone number - matches API regex: /^0[567]\d{8}$/
  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, "")
    // Match API validation exactly: starts with 0, followed by 5/6/7, then 8 digits
    return /^0[567]\d{8}$/.test(cleaned)
  }

  useEffect(() => {
    onValidation(isValidPhone(value))
  }, [value, onValidation])

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText()
        const formattedNumber = formatAlgerianNumber(text.trim())
        onChange(formattedNumber)
        setCopied(true)
        setShowPasteButton(false)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error('Failed to paste:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const formattedNumber = formatAlgerianNumber(inputValue)
    
    // Only update if the formatted number is different or within limits
    if (formattedNumber.length <= MAX_ALGERIAN_DIGITS) {
      onChange(formattedNumber)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, arrow keys
    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        (e.keyCode === 90 && e.ctrlKey === true) ||
        // Allow: Shift+Arrow keys for text selection
        (e.shiftKey && [37, 38, 39, 40].indexOf(e.keyCode) !== -1) ||
        // Allow: Ctrl+Shift+Arrow keys for word selection
        (e.ctrlKey && e.shiftKey && [37, 39].indexOf(e.keyCode) !== -1)) {
      return
    }
    
    // Allow numbers from main keyboard (0-9) and numpad (0-9)
    const isNumber = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)
    
    // Allow only numbers
    if (!isNumber) {
      e.preventDefault()
      return
    }
    
    // Stop input if max length reached (but allow backspace and delete)
    if (value.length >= MAX_ALGERIAN_DIGITS && e.keyCode !== 8 && e.keyCode !== 46) {
      e.preventDefault()
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="tel"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={language === "ar" ? "0xxxxxxxxx (10 أرقام)" : "0xxxxxxxxx (10 chiffres)"}
          maxLength={MAX_ALGERIAN_DIGITS}
          className={`
            w-full py-3 text-lg border-2 border-slate-200 rounded-xl 
            focus:border-primary focus:ring-4 focus:ring-primary/10 
            transition-all duration-200 bg-white font-mono
            ${language === "ar" ? "text-right" : "text-left"}
            ${showPasteButton 
              ? (language === "ar" ? "pl-14 pr-4" : "pr-14 pl-4") 
              : "px-4"
            }
          `}
          dir="ltr" // Always LTR for phone numbers regardless of language
        />
        
        {/* Paste button - positioned based on language direction */}
        {showPasteButton && (
          <button
            onClick={handlePaste}
            className={`
              absolute top-1/2 transform -translate-y-1/2 
              ${language === "ar" ? "left-3" : "right-3"}
              p-2 rounded-lg bg-primary text-white 
              hover:bg-primary/90 transition-colors
              flex items-center justify-center
              w-10 h-10
              sm:w-11 sm:h-11
              z-10
            `}
            type="button"
            title={language === "ar" ? "لصق من الحافظة" : "Coller depuis le presse-papier"}
          >
            {copied ? (
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Clipboard className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        )}
      </div>
      
      {/* Character counter */}
      <div className={`mt-1 text-xs text-slate-400 ${language === "ar" ? "text-right" : "text-left"}`}>
        {value.length}/{MAX_ALGERIAN_DIGITS}
      </div>
      
      {/* Validation indicator */}
      {value && (
        <div className={`mt-2 text-sm ${language === "ar" ? "text-right" : "text-left"}`}>
          {isValidPhone(value) ? (
            <span className="text-green-600 flex items-center gap-2">
              <Check className="w-4 h-4" />
              {language === "ar" ? "رقم جزائري صحيح" : "Numéro algérien valide"}
            </span>
          ) : value.length > 0 ? (
            <span className="text-red-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {language === "ar" ? 
                "رقم جزائري غير صحيح (يجب أن يبدأ بـ 05 أو 06 أو 07)" : 
                "Numéro algérien invalide (doit commencer par 05, 06 ou 07)"
              }
            </span>
          ) : null}
        </div>
      )}
      
      {/* Help text */}
      {!value && (
        <div className={`mt-2 text-xs text-slate-500 ${language === "ar" ? "text-right" : "text-left"}`}>
          {language === "ar" ? 
            "مثال: 0550123456 أو يمكنك لصق رقم بصيغة +213" : 
            "Exemple: 0550123456 ou collez un numéro au format +213"
          }
        </div>
      )}
    </div>
  )
}

// Updated interface to match API response exactly
interface CheckResult {
  isReported: boolean
  risk: {
    level: "safe" | "low" | "medium" | "high"
    message: string
    score?: number // Only in development
  }
  patterns?: {
    reasonTypes: string[]
    hasCustomReasons: boolean
    reportedRecently: boolean
    reportingTimespan?: {
      first: string
    }
  } | null
  metadata: {
    checkedAt: string
    remaining: number
  }
}

interface ApiErrorResponse {
  error: string
  code: string
  resetTime?: number
  debug?: {
    input: string
    normalized: string
    expected: string
  }
}

export default function CheckPage() {
  const { t, language } = useLanguage()
  const [phone, setPhone] = useState("")
  const [result, setResult] = useState<CheckResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const checkPhone = async (phoneNumber: string) => {
    if (!phoneNumber || !isValid) return

    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber.replace(/\s/g, ""), // Send exactly what API expects
        }),
      })

      const data: CheckResult | ApiErrorResponse = await response.json()

      if (response.ok) {
        setResult(data as CheckResult)
      } else {
        const errorData = data as ApiErrorResponse
        switch (errorData.code) {
          case "INVALID_PHONE":
            setError(language === "ar" ? 
              "تنسيق رقم الهاتف غير صحيح. يجب أن يبدأ بـ 05 أو 06 أو 07" : 
              "Format de numéro invalide. Doit commencer par 05, 06 ou 07"
            )
            break
          case "MISSING_PHONE":
            setError(language === "ar" ? "رقم الهاتف مطلوب" : "Numéro de téléphone requis")
            break
          case "RATE_LIMITED_CHECK":
            const resetTime = errorData.resetTime ? new Date(errorData.resetTime).toLocaleTimeString() : ""
            setError(
              language === "ar" 
                ? `تم تجاوز الحد المسموح (100 فحص/ساعة). حاول مرة أخرى ${resetTime ? `في ${resetTime}` : 'لاحقاً'}` 
                : `Limite de vérifications atteinte (100/heure). Réessayez ${resetTime ? `à ${resetTime}` : 'plus tard'}`
            )
            break
          case "INVALID_JSON":
            setError(language === "ar" ? "خطأ في تنسيق البيانات" : "Erreur de format des données")
            break
          case "INTERNAL_ERROR":
            setError(language === "ar" ? "خطأ في الخادم. حاول مرة أخرى" : "Erreur serveur. Réessayez")
            break
          default:
            setError(errorData.error || (language === "ar" ? "حدث خطأ غير متوقع" : "Une erreur inattendue s'est produite"))
        }
      }
    } catch (err) {
      console.error("Network error:", err)
      setError(language === "ar" ? "خطأ في الشبكة. تحقق من اتصالك" : "Erreur réseau. Vérifiez votre connexion")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckClick = () => {
    if (phone && isValid && !isLoading) {
      checkPhone(phone)
    }
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)
    // Clear previous results when phone changes
    if (result && value !== phone) {
      setResult(null)
      setError("")
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high":
        return <AlertTriangle className="w-8 h-8 text-red-600" />
      case "medium":
        return <Shield className="w-8 h-8 text-yellow-600" />
      case "low":
        return <TrendingUp className="w-8 h-8 text-orange-600" />
      case "safe":
        return <CheckCircle className="w-8 h-8 text-green-600" />
      default:
        return <Search className="w-8 h-8 text-gray-600" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-50 border-red-200 text-red-800"
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "low":
        return "bg-orange-50 border-orange-200 text-orange-800"
      case "safe":
        return "bg-green-50 border-green-200 text-green-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const getRiskTitle = (risk: string) => {
    const titles = {
      ar: {
        safe: "آمن ✓",
        low: "خطر منخفض ⚠️",
        medium: "خطر متوسط ⚠️",
        high: "خطر عالي ❌",
      },
      fr: {
        safe: "Sûr ✓",
        low: "Risque faible ⚠️",
        medium: "Risque moyen ⚠️",
        high: "Risque élevé ❌",
      },
    }
    return titles[language as keyof typeof titles]?.[risk as keyof typeof titles.ar] || risk
  }

  const getActionRecommendation = (risk: string) => {
    if (language === "ar") {
      switch (risk) {
        case "safe":
          return "يمكن المتابعة بأمان"
        case "low":
          return "توخي الحذر العادي"
        case "medium":
          return "ينصح بالحذر الشديد"
        case "high":
          return "تجنب التعامل مع هذا الرقم"
        default:
          return ""
      }
    } else {
      switch (risk) {
        case "safe":
          return "Procéder en toute sécurité"
        case "low":
          return "Prudence normale recommandée"
        case "medium":
          return "Grande prudence recommandée"
        case "high":
          return "Évitez ce numéro"
        default:
          return ""
      }
    }
  }

  const formatTimespan = (timespan: string) => {
    if (language === "ar") {
      switch (timespan) {
        case "over a year ago":
          return "منذ أكثر من عام"
        case "over a month ago":
          return "منذ أكثر من شهر"
        case "over a week ago":
          return "منذ أكثر من أسبوع"
        case "recently":
          return "مؤخراً"
        default:
          return timespan
      }
    }
    return timespan
  }

  // Helper function to translate reason types
  const translateReasonType = (reason: string) => {
    const translations = {
      ar: {
        "Spam": "رسائل مزعجة",
        "Scam": "احتيال",
        "Harassment": "مضايقة",
        "Fraud": "نصب",
        "Robocall": "مكالمات آلية",
        "Telemarketing": "تسويق هاتفي",
        "Other": "أخرى"
      },
      fr: {
        "Spam": "Spam",
        "Scam": "Arnaque",
        "Harassment": "Harcèlement", 
        "Fraud": "Fraude",
        "Robocall": "Appel automatique",
        "Telemarketing": "Télémarketing",
        "Other": "Autre"
      }
    }
    
    return translations[language as keyof typeof translations]?.[reason as keyof typeof translations.ar] || reason
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: language === "ar" ? "تحقق من رقم" : "Vérifier un numéro",
    description:
      language === "ar" ? "تحقق من تاريخ رقم الهاتف قبل الشحن" : "Vérifiez l'historique d'un numéro avant expédition",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/check`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 mt-12 to-slate-100 pt-20 pb-8">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("check.title")}</h1>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium text-slate-700 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}
                >
                  {t("check.phone.label") || "رقم الهاتف"}
                </label>
                <div className={`${language === "ar" ? "rtl" : "ltr"}`}>
                  <PhoneInput value={phone} onChange={handlePhoneChange} onValidation={setIsValid} />
                </div>
              </div>

              {/* Check Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleCheckClick}
                  disabled={!phone || !isValid || isLoading}
                  className={`
                    px-8 py-3 w-full justify-center items-center  rounded-xl font-semibold text-white text-lg
                    transition-all duration-200 transform
                    ${!phone || !isValid || isLoading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                    }
                    flex items-center gap-3
                  `}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      {language === "ar" ? "جاري الفحص..." : "Vérification..."}
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      {language === "ar" ? "فحص الرقم" : "Vérifier le numéro"}
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-red-800 font-medium text-sm">{error}</span>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className={`rounded-2xl p-6 border-2 ${getRiskColor(result.risk.level)}`}>
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-4">{getRiskIcon(result.risk.level)}</div>
                      <h3 className="text-xl font-bold mb-2">{getRiskTitle(result.risk.level)}</h3>
                      <p className="text-sm font-medium">{getActionRecommendation(result.risk.level)}</p>
                    </div>

                    <div className="bg-white/50 rounded-xl p-4 mb-4">
                      <p className={`text-sm leading-relaxed text-center font-medium ${language === "ar" ? "text-right" : "text-left"}`}>
                        {result.risk.message}
                      </p>
                    </div>

                    {/* Show report status */}
                    <div className="mb-4">
                      <div className={`text-sm font-medium text-center p-3 rounded-lg ${
                        result.isReported 
                          ? "bg-orange-100 text-orange-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {result.isReported 
                          ? (language === "ar" ? "تم الإبلاغ عن هذا الرقم" : "Ce numéro a été signalé")
                          : (language === "ar" ? "لم يتم الإبلاغ عن هذا الرقم" : "Aucun signalement pour ce numéro")
                        }
                      </div>
                    </div>

                    {result.patterns && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium text-slate-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                            {language === "ar" ? "تفاصيل إضافية:" : "Détails supplémentaires:"}
                          </h4>
                          <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                          >
                            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {language === "ar" ? (showDetails ? "إخفاء" : "إظهار") : (showDetails ? "Masquer" : "Afficher")}
                          </button>
                        </div>

                        {showDetails && (
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg">
                              <span className="text-sm font-medium">
                                {language === "ar" ? "أول تقرير:" : "Premier signalement:"}
                              </span>
                              <span className="text-sm text-slate-600">
                                {result.patterns.reportingTimespan?.first 
                                  ? formatTimespan(result.patterns.reportingTimespan.first)
                                  : "-"
                                }
                              </span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg">
                              <span className="text-sm font-medium">
                                {language === "ar" ? "تقارير حديثة:" : "Signalements récents:"}
                              </span>
                              <span className="text-sm text-slate-600">
                                {result.patterns.reportedRecently 
                                  ? (language === "ar" ? "نعم" : "Oui")
                                  : (language === "ar" ? "لا" : "Non")
                                }
                              </span>
                            </div>

                            {result.patterns.reasonTypes.length > 0 && (
                              <div className="p-3 bg-white/30 rounded-lg">
                                <div className="text-sm font-medium mb-2">
                                  {language === "ar" ? "أنواع المشاكل المبلغ عنها:" : "Types de problèmes signalés:"}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {result.patterns.reasonTypes.map((reason, index) => (
                                    <span 
                                      key={index}
                                      className="inline-block px-2 py-1 bg-white/60 rounded text-xs"
                                    >
                                      {translateReasonType(reason)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.patterns.hasCustomReasons && (
                              <div className="flex items-center gap-2 p-3 bg-white/30 rounded-lg">
                                <Info className="w-4 h-4 text-slate-600" />
                                <span className="text-sm">
                                  {language === "ar" 
                                    ? "يحتوي على شكاوى مخصصة" 
                                    : "Contient des plaintes personnalisées"
                                  }
                                </span>
                              </div>
                            )}

                            {result.risk.score && process.env.NODE_ENV === "development" && (
                              <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg">
                                <span className="text-sm font-medium">Risk Score (Dev):</span>
                                <span className="text-sm text-slate-600">{result.risk.score}/100</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Rate limit info */}
                    <div className="mt-4 text-xs text-slate-500 text-center">
                      {language === "ar" ? 
                        `${result.metadata.remaining} فحص متبقي هذه الساعة` :
                        `${result.metadata.remaining} vérifications restantes cette heure`
                      }
                    </div>
                  </div>
                </div>
              )}

              {!result && !isLoading && !error && (
                <div className="bg-slate-50 rounded-xl p-4 mt-6">
                  <h4 className={`font-medium text-slate-900 mb-3 ${language === "ar" ? "text-right" : "text-left"}`}>
                    {language === "ar" ? "🔒 الأمان والخصوصية" : "🔒 Sécurité et Confidentialité"}
                  </h4>
                  <ul className={`text-sm text-slate-600 space-y-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>
                        {language === "ar"
                          ? "أرقام الهواتف مُشفرة ولا تُحفظ بشكل مكشوف"
                          : "Numéros cryptés et non stockés en clair"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>
                        {language === "ar" ? "نظام تقييم المخاطر بدلاً من العد المباشر" : "Système de score de risque au lieu de comptage direct"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>
                        {language === "ar" ? "حد أقصى 100 استعلام في الساعة لمنع الإساءة" : "Limite de 100 requêtes par heure pour éviter les abus"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>
                        {language === "ar" ? "بيانات مجمعة لحماية خصوصية المستخدمين" : "Données agrégées pour protéger la confidentialité"}
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}