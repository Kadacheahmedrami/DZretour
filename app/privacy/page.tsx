"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function PrivacyPage() {
  const { language } = useLanguage()

  const content =
  language === "ar"
    ? {
        title: "سياسة الخصوصية — Dzretour",
        sections: [
          {
            title: "مقدمة",
            content:
              "نحن في Dzretour نأخذ خصوصيتك على محمل الجد. تُحدد هذه السياسة كيف نجمع ونستخدم ونحمي ونحتفظ بالمعلومات الشخصية المرتبطة بخدماتنا الخاصة بمكافحة إساءة استخدام سياسة الإرجاع. تلتزم Dzretour بالامتثال لقانون حماية البيانات الجزائري (قانون رقم 18-07) وقوانين التجارة الإلكترونية ذات الصلة.",
          },
          {
            title: "الجهة المتحكِّمة في المعطيات",
            content:
              "الجهة المتحكِّمة: Dzretour (اسم الكيان/الشخص المُشرَك). للتواصل بشأن الخصوصية أو الحقوق: privacy@dzretour.com. يجب استبدال البريد بالبريد الفعلي عندما يكون متوفراً.",
          },
          {
            title: "نوع المعطيات التي نجمعها",
            content:
              "نجمع الحد الأدنى من المعطيات الضرورية لتشغيل الخدمة: أرقام الهواتف (تُخزَّن بشكل مشفر/مُهشَّم)، سبب البلاغ (من قائمة محددة أو نص اختياري محدود)، وطوابع زمنية للبلاغات. لا نجمع أسماء أو عناوين أو بيانات حساسة دون موافقة صريحة.",
          },
          {
            title: "أساس ومبرر المعالجة",
            content:
              "الأساس القانوني: مصلحة تجارية مشروعة في منع الاحتيال وإساءة استخدام نظام الإرجاع، مع اتخاذ تدابير توازن تحمي حقوق الأفراد. عند الاقتضاء، سنطلب موافقة صريحة إذا استوجبت المعالجة ذلك.",
          },
          {
            title: "كيف نُخزّن ونحمي الأرقام",
            content:
              "نطبق مبدأ التقليل في المعطيات: • نُخزّن أرقام الهواتف كمخرجات هاش آمنة (مثلاً SHA-256) مع سَلْت (salt) سري. • مقارنة الأرقام تُجرى عبر هاش للمدخلات، وليس بمقارنة نصية مباشرة. • التشفير في النقل (TLS) والتشفير عند الاستراحة مُفعّلان. • الوصول مقصر لمسؤولي النظام المخولّين فقط وتخضع لسجلات وصول ومراجعات دورية.",
          },
          {
            title: "ما الذي نعرضه عند الفحص (lookup)",
            content:
              "عند التحقق من رقم، نعرض **مستوى المخاطرة** فقط (مثال: آمن / منخفض / متوسط / مرتفع). لا نكشف تاريخ البلاغات التفصيلي، أو أسماء المشتكين، أو تفاصيل قد تُعرّض أي شخص للأذى أو التشهير.",
          },
          {
            title: "التحكم بالوصول وسجل الطلبات",
            content:
              "وصول واجهات البحث مقصور على تجّار مُسجّلين وموثّقين فقط. نقوم بتسجيل من أجرى الفحص ومتى (سجلات الوصول) لاستخدامها في حالات التحقيق وإكتشاف إساءة الاستخدام.",
          },
          {
            title: "قيود على الاحتفاظ بالبيانات",
            content:
              "نحتفظ بالسجلات فقط للمدة اللازمة لتحقيق غرضنا (الافتراضي: 6 أشهر). بعد انقضاء المدة، تُحذف البلاغات ورموز الهاش تلقائياً ما لم تكن هناك حاجة قانونية للاحتفاظ لفترة أطول.",
          },
          {
            title: "حق الوصول والتصحيح والحذف",
            content:
              "للمستخدمين (المُبلغ عنهم أو المتأثرين) حقوق: طلب الاطلاع على بياناتهم، طلب تصحيحها، الاعتراض على معالجتها، وطلب الحذف. لتقديم طلبات الحقوق: راسلنا عبر privacy@dzretour.com مع وصف واضح لهويتك وطلبك. سنرد ضمن إطار زمني معقول ومع مراعاة متطلبات القانون.",
          },
          {
            title: "آليات الطعن والفضّ",
            content:
              "إذا رُفع بلاغ خاطئ أو تعتقد أنك أُدرجت ظلماً، يمكنك تقديم استئناف. سنتحقق من البلاغ ونقوم بالتصحيح أو الحذف إذا ثبت الخطأ. نحتفظ بسجل للإجراءات المتخذة للامتثال للمسائلة.",
          },
          {
            title: "الإبلاغ عن خروقات البيانات",
            content:
              "في حال وقوع خرق بيانات جوهري، سنتخذ إجراءات فنية وتنظيمية فورية، وسنُخطر الجهات المختصة (بما في ذلك ANPDP) والمتأثرين حسب متطلبات القانون وبالسرعة المناسبة.",
          },
          {
            title: "معالِجو الطرف الثالث",
            content:
              "نستخدم مزوّدين تقنيين لمعالجة البيانات (مثلاً لاستضافة أو نسخ احتياطي). نبرم عقود معالجة بيانات تلزمهم بالسرية وتطبيق معايير أمنية مناسبة. إذا تم نقل بيانات خارج الجزائر، سيتم ذلك فقط بعد الحصول على الموافقات المطلوبة من الجهات المختصة.",
          },
          {
            title: "الاستضافة ونقل البيانات عبر الحدود",
            content:
              "نوصي بالاستضافة داخل الجزائر. إن اضطررنا للاستضافة خارجياً، سنحصل على التفويضات القانونية المطلوبة ونطبق ضمانات تقنية وقانونية لحماية البيانات قبل أي نقل.",
          },
          {
            title: "القيود على الاستخدام والمسؤولية",
            content:
              "يُمنع استخدام نتائج الفحص لأغراض التشهير أو التمييز غير القانوني. Dzretour ليست مسؤولة عن قرارات تجارية يتخذها الطرف المُستعلم استناداً للنتيجة؛ نوصي بإجراء تحقق إضافي قبل اتخاذ إجراءات قانونية أو تجارية ضد شخص ما.",
          },
          {
            title: "الأطفال والقُصر",
            content:
              "لا نستهدف بيانات الأطفال. إذا علمنا أننا جمعنا بيانات طفل دون موافقة قانونية، سنتخذ إجراءات فورية لحذفها.",
          },
          {
            title: "تغييرات سياسة الخصوصية",
            content:
              "قد نحدّث هذه السياسة من وقت لآخر. سنعرّض النسخة الأحدث على الموقع مع تاريخ سريان. ننصح بالاطلاع الدوري.",
          },
          {
            title: "معلومات الاتصال والجهات الرسمية",
            content:
              "للاستفسارات أو طلبات الحقوق: privacy@dzretour.com. يرجى أيضاً التواصل مع السلطة الوطنية لحماية البيانات (ANPDP) للحصول على معلومات رسمية حول حقوقك وطرق التظلم.",
          },
          {
            title: "ملاحظة قانونية",
            content:
              "توفر هذه السياسة إرشادات عامة ولا تُعد بديلاً عن استشارة قانونية مهنية. يُنصح بمراجعة محامٍ محلي قبل النشر والبدء في معالجة البيانات، والتأكد من إتمام تسجيل/إعلان معالجة البيانات لدى ANPDP كما يقتضي القانون.",
          },
        ],
      }
    : {
        title: "Politique de confidentialité — Dzretour",
        sections: [
          {
            title: "Introduction",
            content:
              "Chez Dzretour, nous prenons la confidentialité au sérieux. Cette politique décrit comment nous collectons, utilisons, protégeons et supprimons les données personnelles liées à notre service de prévention des abus de retours. Dzretour se conforme à la loi algérienne sur la protection des données (Loi n°18-07) et aux obligations du commerce électronique.",
          },
          {
            title: "Responsable du traitement",
            content:
              "Responsable: Dzretour (nom de l'entité/personne). Contact pour la confidentialité : privacy@dzretour.com. Remplacez cet e-mail par une adresse opérationnelle si disponible.",
          },
          {
            title: "Données collectées",
            content:
              "Nous collectons uniquement le strict nécessaire : numéros de téléphone (stockés sous forme hachée/chiffrée), motif du signalement (choix parmi une liste ou raison personnalisée limitée), et horodatages. Nous n’enregistrons pas de données sensibles sans consentement explicite.",
          },
          {
            title: "Base et finalité du traitement",
            content:
              "Base légale : intérêt légitime pour prévenir la fraude et l’abus des politiques de retour, avec mesures d’équilibre protégeant les droits des personnes. Lorsque nécessaire, nous solliciterons le consentement explicite.",
          },
          {
            title: "Stockage et protection des numéros",
            content:
              "Principe de minimisation : • Les numéros sont stockés sous forme de hachage sécurisé (par ex. SHA-256) avec un sel (salt) secret. • Les comparaisons sont effectuées via hachage d'entrée, jamais par comparaison en clair. • Chiffrement en transit (TLS) et au repos activé. • Accès limité aux administrateurs autorisés et journalisation des accès.",
          },
          {
            title: "Résultats de vérification (lookup)",
            content:
              "Lors d’une vérification, nous fournissons uniquement un **niveau de risque** (Ex : Sûr / Faible / Moyen / Élevé). Nous ne divulguons pas l’historique détaillé des signalements, ni d’informations identifiantes supplémentaires.",
          },
          {
            title: "Contrôle d'accès et journalisation",
            content:
              "L’accès aux vérifications est réservé aux commerçants inscrits et vérifiés. Nous conservons des logs d’accès (qui a effectué la requête et quand) pour enquêter en cas d’abus.",
          },
          {
            title: "Durée de conservation",
            content:
              "Données conservées uniquement pour la durée nécessaire à la finalité (par défaut : 6 mois). Les rapports et hachages sont supprimés automatiquement au terme défini, sauf obligation légale contraire.",
          },
          {
            title: "Droits des personnes",
            content:
              "Les personnes concernées peuvent demander l’accès, la rectification, l’opposition ou la suppression de leurs données. Pour exercer ces droits : privacy@dzretour.com. Nous répondrons dans un délai raisonnable, conformément à la loi.",
          },
          {
            title: "Procédure de contestation",
            content:
              "Si vous estimez avoir été signalé à tort, vous pouvez déposer une contestation. Nous enquêterons et corrigerons ou supprimerons les données erronées si nécessaire, et garderons un registre des actions entreprises.",
          },
          {
            title: "Violation de données",
            content:
              "En cas de violation significative, nous prendrons des mesures techniques et organisationnelles immédiates, et informerons les autorités compétentes (y compris l'ANPDP) et les personnes affectées conformément aux exigences légales.",
          },
          {
            title: "Sous-traitants",
            content:
              "Nous pouvons recourir à des prestataires pour l'hébergement ou la sauvegarde. Des contrats de traitement conformes sont signés pour garantir confidentialité et sécurité. Tout transfert hors Algérie se fera uniquement après les autorisations nécessaires.",
          },
          {
            title: "Hébergement et transferts internationaux",
            content:
              "Nous recommandons l’hébergement local en Algérie. Si des données doivent être transférées hors du territoire, nous veillerons à obtenir les autorisations requises et à fournir des garanties adaptées.",
          },
          {
            title: "Limitation d'utilisation et responsabilité",
            content:
              "Les résultats de vérification ne doivent pas être utilisés à des fins de diffamation ou de discrimination illégale. Dzretour n’est pas responsable des décisions commerciales prises exclusivement sur la base d’un résultat ; une vérification additionnelle est recommandée.",
          },
          {
            title: "Mineurs",
            content:
              "Nous ne collectons pas sciemment de données d’enfants. Si nous apprenons qu’une donnée d’un mineur a été collectée sans consentement légal, nous la supprimerons promptement.",
          },
          {
            title: "Modifications de la politique",
            content:
              "Nous pouvons mettre à jour cette politique. La version la plus récente sera publiée sur le site avec la date d’entrée en vigueur. Consultez-la régulièrement.",
          },
          {
            title: "Contact & autorités compétentes",
            content:
              "Pour toute question ou exercice de vos droits : privacy@dzretour.com. Vous pouvez également contacter l'Autorité nationale de protection des données (ANPDP) pour des informations officielles ou des recours.",
          },
          {
            title: "Avertissement légal",
            content:
              "Ce document fournit des orientations générales et ne remplace pas un avis juridique professionnel. Faites réviser la politique par un avocat local et procédez à l’enregistrement/déclaration auprès de l'ANPDP avant mise en production.",
          },
        ],
      }


  return (
    <div className="min-h-screen bg-gray-50 pt-24 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
          <h1 className="text-3xl font-bold text-dark mb-8">{content.title}</h1>

          <div className="space-y-8">
            {content.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold text-dark mb-4">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
