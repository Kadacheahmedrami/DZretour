"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function FAQSection() {
  const { language } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs =
    language === "ar"
      ? [
          {
            question: "ما هو DzRetour؟",
            answer:
              "DzRetour هي منصة تساعد التجار في الجزائر على حماية أنفسهم من روتور عبر تبادل المعلومات حول الأرقام المشبوهة.",
          },
          {
            question: "كيف يمكنني الإبلاغ عن روتور؟",
            answer: "يمكنك الإبلاغ عن روتور بسهولة عبر إدخال رقم الهاتف وسبب روتور في صفحة الإبلاغ.",
          },
          {
            question: "هل الخدمة مجانية؟",
            answer: "نعم، الخدمة مجانية تماماً لجميع التجار في الجزائر.",
          },
        ]
      : [
          {
            question: "What is DzRetour?",
            answer:
              "DzRetour is a platform that helps merchants in Algeria protect themselves from returns by sharing information about suspicious numbers.",
          },
          {
            question: "How can I report a return?",
            answer: "You can easily report a return by entering the phone number and return reason on the report page.",
          },
          {
            question: "Is the service free?",
            answer: "Yes, the service is completely free for all merchants in Algeria.",
          },
        ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-dark text-center mb-12">
          {language === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card">
              <button
                className="w-full text-right rtl:text-right ltr:text-left flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-dark">{faq.question}</span>
                <span className="text-primary text-xl">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
