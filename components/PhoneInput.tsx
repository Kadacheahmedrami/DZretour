"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Clipboard } from "lucide-react"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onValidation?: (isValid: boolean) => void
}

export default function PhoneInput({ value, onChange, placeholder, className = "", onValidation }: PhoneInputProps) {
  const { t, language } = useLanguage()
  const [error, setError] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      )
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "")
    return cleaned.length >= 9 && cleaned.length <= 10
  }

  const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "")

    if (cleaned.length === 0) return ""

    // Always start with 0 for Algerian numbers
    let formatted = cleaned.startsWith("0") ? cleaned : "0" + cleaned

    // Limit to 10 digits total
    formatted = formatted.substring(0, 10)

    // Add spaces for readability: 0555 123 456
    if (formatted.length > 4) {
      formatted = formatted.substring(0, 4) + " " + formatted.substring(4)
    }
    if (formatted.length > 8) {
      formatted = formatted.substring(0, 8) + " " + formatted.substring(8)
    }

    return formatted
  }

  useEffect(() => {
    const isValid = validatePhone(value)
    setError(isValid || !value ? "" : t("phone.invalid"))
    onValidation?.(isValid)
  }, [value, t, onValidation])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    onChange(formatted)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const formatted = formatPhone(text)
      onChange(formatted)
    } catch (err) {
      console.error("Failed to paste:", err)
    }
  }

  const getPlaceholder = () => {
    if (placeholder) return placeholder
    return language === "ar" ? "أدخل رقم الهاتف" : "Enter phone number"
  }

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder={getPlaceholder()}
          className={`input-field ${error ? "border-danger focus:ring-danger" : ""} ${className} text-left ${isMobile ? "pr-12" : ""}`}
          dir="ltr"
          inputMode="tel"
          autoComplete="tel"
        />
        {isMobile && (
          <button
            type="button"
            onClick={handlePaste}
            className={`absolute top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors ${
              language === "ar" ? "left-2" : "right-2"
            }`}
            aria-label={language === "ar" ? "لصق" : "Paste"}
          >
            <Clipboard size={18} />
          </button>
        )}
      </div>
      {error && (
        <p className={`mt-1 text-sm text-danger ${language === "ar" ? "text-right" : "text-left"}`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
