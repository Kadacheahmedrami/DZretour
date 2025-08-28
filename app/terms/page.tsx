"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function TermsPage() {
  const { language } = useLanguage()

  const content =
  language === "ar"
    ? {
        title: "شروط الاستخدام — Dzretour",
        sections: [
          {
            title: "مقدمة وقبول الشروط",
            content:
              "باستخدامك لخدمات Dzretour، فإنك توافق على الالتزام بهذه الشروط والأحكام بالكامل. إذا كنت لا توافق على أي من هذه الشروط، فيُرجى عدم استخدام المنصة.",
          },
          {
            title: "التعاريف",
            content:
              "في هذه الشروط، \"المنصة\" أو \"Dzretour\" تشير إلى الخدمة التي تقدمها Dzretour، و\"المستخدم\" يعني أي شخص أو كيان مسجّل يستخدم الخدمة (بما في ذلك التجار).",
          },
          {
            title: "المستخدمون المؤهلون والوصول",
            content:
              "الوصول إلى وظائف الفحص (lookup) مقصور على التجار المسجلين وذوي الحسابات الموثقة فقط. التسجيل يتطلب معلومات صحيحة، والتحقق من الهوية أو النشاط التجاري عند طلبنا. يُحظر الحسابات المجهولة أو الوهمية.",
          },
          {
            title: "الغرض المسموح به",
            content:
              "تُقدّم Dzretour كأداة لمساعدة التجار في تقييم مخاطر الإرجاع ومنع إساءة استخدام سياسات الإرجاع. لا يجوز استخدام النتائج لأغراض تشهيرية، تحريضية، أو تمييزية غير قانونية.",
          },
          {
            title: "الاستخدام المحظور",
            content:
              "يُمنع صراحة: (1) نشر أو إعادة توزيع نتائج الفحص للجمهور؛ (2) استخدام الخدمة لِدَوْس الخصوصية أو انتهاك الحقوق القانونية للأفراد؛ (3) القيام بعمليات بحث جماعية / آلية (scraping) أو اختبارات ضخمة دون إذن؛ (4) استخدام البيانات لابتزاز أو مضايقة أو تمييز؛ (5) تحويل أو إعادة التعريف أو محاولة استرجاع الأرقام المخزنة.",
          },
          {
            title: "أمان الحساب ومسؤولية المستخدم",
            content:
              "أنت مسؤولة عن سرية بيانات اعتماد حسابك. أي نشاط يحدث عبر حسابك يعتبر مسؤوليتك. يجب إبلاغنا فوراً عن أي استخدام غير مصرح به. نحتفظ بحق تعليق أو إيقاف أي حساب يسيء استخدام الخدمة أو يخرق هذه الشروط.",
          },
          {
            title: "المحتوى والنتائج",
            content:
              "النتائج المقدمة عبارة عن مؤشرات ومقترحات تقييمية (مستوى مخاطرة). هي معلومات مساعدة وليست بديلاً عن التحقق القانوني أو التحقيقي. ينصح بإجراء فحوصات إضافية قبل اتخاذ قرارات قانونية أو تنفيذ إجراءات تقاضٍ أو منع تسليم.",
          },
          {
            title: "البلاغات والنزاعات",
            content:
              "إذا اعتقد شخص ما أنه أُدرج خطأً أو أن هنالك بلاغاً غير صحيح، يمكنه تقديم طلب طعن عبر privacy@dzretour.com، مع إثبات الهوية وشرح مفصل. سنحقق ونصحح أو نحذف السجلات في حال ثبوت الخطأ وفق سياساتنا القانونية والعملية.",
          },
          {
            title: "الخصوصية وحماية البيانات",
            content:
              "تعمل Dzretour وفق سياسة الخصوصية المنشورة. الأرقام تخزن على شكل هاش مشفّر مع سَلْت (salt) ولا يتم كشفها بنص واضح. أي معالجة للبيانات تتم وفق القانون الجزائري (قانون رقم 18-07) وتخضع لإجراءات أمنية مناسبة.",
          },
          {
            title: "الاحتفاظ بالبيانات",
            content:
              "نحتفظ بالسجلات لمدة محددة فقط (الافتراضي: 6 أشهر) ما لم تُلزِمنا القوانين بفترة أطول. بعد انقضاء المدة، تُحذف البيانات أو تُجهّز للحذف التام.",
          },
          {
            title: "سجلات الوصول والتدقيق",
            content:
              "نحتفظ بسجلات من قام بعمليات البحث ومتى لأغراض الأمن والتحقيق في حالات إساءة الاستخدام. يمكن أن تُستخدم سجلات الوصول كجزء من إجراءات التحقيق أو الامتثال القانوني.",
          },
          {
            title: "التعويض وحدود المسؤولية",
            content:
              "أنت توافق على تعويض Dzretour وموظفيها ووكلائها عن أي مطالبات أو أضرار ناتجة عن استخدامك للخدمة أو خرقك لهذه الشروط. ما لم ينص القانون على خلاف ذلك، لا تتحمل Dzretour أي مسؤولية عن أية خسائر غير مباشرة أو تبعية أو فقدان أرباح أو بيانات ناتجة عن استخدام الخدمة.",
          },
          {
            title: "الإنهاء والتعليق",
            content:
              "نحتفظ بالحق في تعليق أو إلغاء حسابات المستخدمين في حال انتهاك هذه الشروط أو سوء الاستخدام أو طلب السلطات المختصة. عند الإنهاء، قد تُحذف معلومات الحساب حسب سياساتنا وطلبات الامتثال القانونية.",
          },
          {
            title: "الروابط إلى طرف ثالث",
            content:
              "قد تحتوي المنصة على روابط لخدمات أو مواقع طرف ثالث. نحن غير مسؤولين عن محتوى أو سياسات الخصوصية لتلك الجهات.",
          },
          {
            title: "التغييرات على الشروط",
            content:
              "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر النسخة المحدثة على الموقع مع تاريخ السريان. الاستمرار في استخدام الخدمة بعد التعديل يعني موافقتك على الشروط المعدلة.",
          },
          {
            title: "القانون الواجب التطبيق وتسوية المنازعات",
            content:
              "تخضع هذه الشروط وتُفسَّر وفق القوانين الجزائرية. أي نزاع ينشأ عن هذه الشروط يخضع للاختصاص القضائي للمحاكم الجزائرية المختصة، ما لم يتم الاتفاق خطياً على وسيلة تسوية بديلة.",
          },
          {
            title: "التواصل والملاحظات",
            content:
              "للاستفسارات أو شكاوى حول هذه الشروط أو الخدمة: privacy@dzretour.com. يُنصح بمراجعة القوانين المحلية وطلب استشارة قانونية محلية قبل الاستخدام التجاري.",
          },
          {
            title: "إخلاء مسؤولية قانوني",
            content:
              "توفر هذه الشروط معلومات عامة ولا تُعد نصيحة قانونية. من المستحسن استشارة محامٍ محلي للتأكد من التوافق مع المتطلبات التنظيمية المحلية (بما في ذلك التسجيل لدى ANPDP إن لزم).",
          },
        ],
      }
    : {
        title: "Conditions d'utilisation — Dzretour",
        sections: [
          {
            title: "Introduction et acceptation",
            content:
              "En utilisant les services de Dzretour, vous acceptez d'être lié par ces termes et conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.",
          },
          {
            title: "Définitions",
            content:
              "Dans ces conditions, \"la Plateforme\" ou \"Dzretour\" désigne le service fourni par Dzretour, et \"Utilisateur\" désigne toute personne ou entité (y compris les commerçants) utilisant le service.",
          },
          {
            title: "Utilisateurs éligibles et accès",
            content:
              "L'accès aux fonctions de vérification (lookup) est réservé aux commerçants enregistrés et vérifiés. L'inscription nécessite des informations exactes et peut être soumise à une vérification d'identité ou d'activité commerciale. Les comptes anonymes ou frauduleux sont interdits.",
          },
          {
            title: "Finalité autorisée",
            content:
              "Dzretour fournit un outil d'aide au commerce pour évaluer le risque de retours et prévenir les abus des politiques de retour. Les résultats ne doivent pas être utilisés à des fins diffamatoires, incitatives ou de discrimination illégale.",
          },
          {
            title: "Utilisations interdites",
            content:
              "Il est strictement interdit : (1) de publier ou redistribuer les résultats au public ; (2) d'utiliser le service pour violer la vie privée ou les droits légaux d'autrui ; (3) d'effectuer des recherches massives/automatisées (scraping) sans permission ; (4) d'utiliser les données pour extorsion, harcèlement ou discrimination ; (5) de tenter de reconstituer ou d'extraire les numéros stockés.",
          },
          {
            title: "Sécurité du compte et responsabilité de l'utilisateur",
            content:
              "Vous êtes responsable de la confidentialité des identifiants de votre compte. Toute activité réalisée via votre compte est à votre charge. Signalez-nous immédiatement toute utilisation non autorisée. Nous pouvons suspendre ou révoquer l'accès en cas d'abus ou de violation.",
          },
          {
            title: "Contenu et résultats",
            content:
              "Les résultats fournis sont indicatifs (niveau de risque) et à titre informatif uniquement. Ils ne remplacent pas une vérification juridique ou une enquête. Nous recommandons des vérifications complémentaires avant toute action légale ou commerciale.",
          },
          {
            title: "Signalements et contestations",
            content:
              "Si vous pensez avoir été signalé à tort, vous pouvez déposer une contestation à privacy@dzretour.com, en joignant une preuve d'identité et une description. Nous enquêterons et corrigerons ou supprimerons les données erronées si nécessaire.",
          },
          {
            title: "Confidentialité et protection des données",
            content:
              "Dzretour opère conformément à la politique de confidentialité publiée. Les numéros sont stockés sous forme de hachage sécurisé avec salt, et ne sont pas exposés en clair. Le traitement des données respecte la loi algérienne (Loi n°18-07) et fait l'objet de mesures de sécurité appropriées.",
          },
          {
            title: "Durée de conservation",
            content:
              "Les enregistrements sont conservés uniquement pour la durée nécessaire à la finalité (par défaut : 6 mois). Les rapports et hachages sont supprimés automatiquement à l'expiration, sauf obligation légale contraire.",
          },
          {
            title: "Journaux d'accès et audits",
            content:
              "Nous conservons des logs d'accès (qui a effectué la requête et quand) pour des besoins de sécurité et d'enquête en cas d'abus. Ces logs peuvent être utilisés dans le cadre d'enquêtes ou de conformité.",
          },
          {
            title: "Indemnisation et limitation de responsabilité",
            content:
              "Vous acceptez d'indemniser Dzretour et ses employés/agences contre toute réclamation résultant de votre utilisation du service ou de la violation de ces conditions. Sauf disposition légale contraire, Dzretour ne pourra être tenue responsable des pertes indirectes, fortuites, ou de profits manqués résultant de l'utilisation du service.",
          },
          {
            title: "Suspension et résiliation",
            content:
              "Nous nous réservons le droit de suspendre ou de résilier les comptes en cas de violation des présentes conditions, d'utilisation abusive ou sur demande d'autorités compétentes. En cas de résiliation, les données peuvent être supprimées selon notre politique et les exigences légales.",
          },
          {
            title: "Liens tiers",
            content:
              "La plateforme peut contenir des liens vers des services tiers. Nous ne sommes pas responsables du contenu, des pratiques ou des politiques de confidentialité de sites externes.",
          },
          {
            title: "Modifications des conditions",
            content:
              "Nous pouvons modifier ces conditions à tout moment. La version mise à jour sera publiée sur le site avec la date d'entrée en vigueur. L'utilisation continue de la plateforme vaut acceptation des conditions modifiées.",
          },
          {
            title: "Droit applicable et règlement des litiges",
            content:
              "Ces conditions sont régies et interprétées conformément au droit algérien. Tout litige relatif à ces conditions sera soumis aux tribunaux compétents algériens, sauf accord écrit contraire.",
          },
          {
            title: "Contact et remarques",
            content:
              "Pour toute question, plainte ou exercice de droits : privacy@dzretour.com. Il est conseillé de consulter un conseiller juridique local afin de s'assurer de la conformité réglementaire (y compris l'enregistrement auprès de l'ANPDP si nécessaire).",
          },
          {
            title: "Avertissement légal",
            content:
              "Ces conditions fournissent des indications générales et ne remplacent pas un avis juridique professionnel. Faites relire ces conditions par un avocat local avant toute mise en production.",
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
