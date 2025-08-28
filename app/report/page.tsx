"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Shield, CheckCircle, XCircle, ChevronDown, AlertTriangle, Check, Clipboard } from "lucide-react"
import Link from "next/link"

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

  // Convert +213 format to Algerian local format (0xxxxxxxxx)
  const formatAlgerianNumber = (phone: string) => {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, "")
    
    // Handle +213 format
    if (cleaned.startsWith("+213")) {
      // Remove +213 and add 0 at the beginning
      const localPart = cleaned.substring(4)
      if (localPart.length <= 9) {
        return "0" + localPart
      }
      // If more than 9 digits after +213, truncate to 9
      return "0" + localPart.substring(0, 9)
    }
    
    // Handle 213 format (without +)
    if (cleaned.startsWith("213") && cleaned.length > 3) {
      const localPart = cleaned.substring(3)
      if (localPart.length <= 9) {
        return "0" + localPart
      }
      // If more than 9 digits after 213, truncate to 9
      return "0" + localPart.substring(0, 9)
    }
    
    // If it already starts with 0, keep as is but limit length
    if (cleaned.startsWith("0")) {
      return cleaned.substring(0, MAX_ALGERIAN_DIGITS)
    }
    
    // If it's a 9-digit number (missing the leading 0), add it
    if (cleaned.length === 9 && /^[567]/.test(cleaned)) {
      return "0" + cleaned
    }
    
    // For other cases, just return cleaned number with length limit
    return cleaned.substring(0, MAX_ALGERIAN_DIGITS)
  }

  // Validate Algerian phone number
  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, "")
    
    // Algerian phone numbers should:
    // - Start with 0
    // - Be exactly 10 digits
    // - Second digit should be 5, 6, or 7 (mobile) or other digits for landlines
    return (
      cleaned.length === MAX_ALGERIAN_DIGITS &&
      cleaned.startsWith("0") &&
      /^0[567][0-9]{8}$/.test(cleaned) // Mobile numbers
    ) || (
      cleaned.length === MAX_ALGERIAN_DIGITS &&
      cleaned.startsWith("0") &&
      /^0[2-4][0-9]{8}$/.test(cleaned) // Landline numbers
    )
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
                "رقم جزائري غير صحيح (يجب أن يبدأ بـ 0 ويحتوي على 10 أرقام)" : 
                "Numéro algérien invalide (doit commencer par 0 et contenir 10 chiffres)"
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

export default function ReportPage() {
  const { t, language } = useLanguage()
  const [phone, setPhone] = useState("")
  const [reason, setReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // These must match exactly with the backend validReasons array
  const reasons =
    language === "ar"
      ? [
          "عدم الرضا عن المنتج",
          "رفض فتح الطرد", 
          "تلف الطرد أثناء التوصيل",
          "تغيير رأي العميل",
          "أخرى"
        ]
      : [
          "Product dissatisfaction",
          "Refused to open package",
          "Package damaged during delivery",
          "Customer changed mind",
          "Other"
        ]

  useEffect(() => {
    setReason("")
    setCustomReason("")
    setIsDropdownOpen(false)
  }, [language])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsDropdownOpen(false)
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || !phone || !agreedToTerms || !reason) return

    // For "Other" reason, use customReason if provided, otherwise use the "Other" reason itself
    const finalReason =
      reason === (language === "ar" ? "أخرى" : "Other") && customReason.trim() ? reason : reason

    const requestBody: any = {
      phone: phone.replace(/\s/g, ""),
      reason: finalReason,
    }

    // Add customReason only if "Other" is selected and customReason is provided
    if (reason === (language === "ar" ? "أخرى" : "Other") && customReason.trim()) {
      requestBody.customReason = customReason.trim()
    }

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(t("report.success"))
        setPhone("")
        setReason("")
        setCustomReason("")
        setAgreedToTerms(false)
        setIsValid(false)
      } else {
        switch (data.code) {
          case "DUPLICATE_REPORT":
            setMessage(language === "ar" ? "تم الإبلاغ عن هذا الرقم مؤخراً" : "Ce numéro a déjà été signalé récemment")
            break
          case "RATE_LIMITED":
            setMessage(
              language === "ar" ? "تم تجاوز الحد المسموح. حاول مرة أخرى لاحقاً" : "Limite dépassée. Réessayez plus tard",
            )
            break
          case "INVALID_PHONE":
            setMessage(language === "ar" ? "تنسيق رقم الهاتف غير صحيح" : "Format de numéro de téléphone invalide")
            break
          case "INVALID_REASON":
            setMessage(language === "ar" ? "السبب المحدد غير صحيح" : "Raison sélectionnée invalide")
            break
          default:
            setMessage(data.error || t("report.error"))
        }
      }
    } catch (error) {
      console.error("Network error:", error)
      setMessage(language === "ar" ? "خطأ في الشبكة. تحقق من اتصالك" : "Erreur réseau. Vérifiez votre connexion")
    } finally {
      setIsLoading(false)
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: language === "ar" ? "أبلغ عن روتور" : "Signaler un retour",
    description:
      language === "ar"
        ? "أبلغ عن حالات روتور لحماية التجار الآخرين"
        : "Signalez les cas de retour pour protéger les autres commerçants",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/report`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-gradient-to-br mt-12 from-slate-50 to-slate-100 pt-20 pb-8">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("report.title")}</h1>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium text-slate-700 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}
                >
                  {t("report.phone.label")} *
                </label>
                <div className={`${language === "ar" ? "rtl" : "ltr"}`}>
                  <PhoneInput value={phone} onChange={setPhone} onValidation={setIsValid} />
                </div>
                <p className={`text-xs text-slate-500 ${language === "ar" ? "text-right" : "text-left"}`}>
                  {t("report.phone.help") || "أدخل رقم الهاتف الذي تريد الإبلاغ عنه"}
                </p>
              </div>

              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium text-slate-700 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}
                >
                  {t("report.reason.label")}
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onKeyDown={handleKeyDown}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="listbox"
                    className={`w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white flex items-center justify-between hover:border-slate-300 focus:outline-none ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    <span className={`${reason ? "text-slate-900" : "text-slate-500"}`}>
                      {reason || t("report.reason.placeholder")}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
                      role="listbox"
                    >
                      {reasons.map((r, index) => (
                        <button
                          key={index}
                          type="button"
                          role="option"
                          aria-selected={reason === r}
                          onClick={() => {
                            setReason(r)
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-3 hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100 last:border-b-0 focus:bg-slate-50 focus:outline-none ${
                            language === "ar" ? "text-right" : "text-left"
                          } ${reason === r ? "bg-primary/5 text-primary font-medium" : "text-slate-700"}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {reason === (language === "ar" ? "أخرى" : "Other") && (
                  <div className="mt-3">
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder={language === "ar" ? "اكتب السبب..." : "Écrivez la raison..."}
                      className={`w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white resize-none ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      rows={3}
                      maxLength={200}
                      dir={language === "ar" ? "rtl" : "ltr"}
                    />
                    <p className={`text-xs text-slate-500 mt-1 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {customReason.length}/200
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      id="terms-agreement"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <label
                      htmlFor="terms-agreement"
                      className={`flex items-center justify-center w-5 h-5 rounded-md border-2 cursor-pointer transition-all duration-200 ${
                        agreedToTerms
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-slate-300 hover:border-primary/50"
                      }`}
                    >
                      {agreedToTerms && <CheckCircle className="w-3 h-3 text-white" />}
                    </label>
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm text-slate-700 leading-relaxed ${language === "ar" ? "text-right" : "text-left"}`}
                    >
                      {language === "ar" ? (
                        <>
                          أوافق على{" "}
                          <Link href="/terms" className="text-primary hover:text-primary/80 font-medium underline">
                            شروط الاستخدام
                          </Link>{" "}
                          و{" "}
                          <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium underline">
                            سياسة الخصوصية
                          </Link>
                        </>
                      ) : (
                        <>
                          I agree to the{" "}
                          <Link href="/terms" className="text-primary hover:text-primary/80 font-medium underline">
                            terms of use
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium underline">
                            privacy policy
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  !isValid ||
                  isLoading ||
                  !agreedToTerms ||
                  !reason ||
                  (reason === (language === "ar" ? "أخرى" : "Other") && !customReason.trim())
                }
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 min-h-[48px]"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    {t("loading")}
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    {t("report.submit")}
                  </>
                )}
              </button>

              {message && (
                <div
                  className={`p-4 rounded-xl border flex items-center gap-3 ${
                    message === t("report.success")
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {message === t("report.success") ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <span className="font-medium text-sm">{message}</span>
                </div>
              )}
            </form>
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {t("report.secure") || "آمن"}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {t("report.verified") || "موثق"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}