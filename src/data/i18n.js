import { FOLDER_CONTENT } from "./content.jsx";

export const translations = {
  "en": {
    "folderLabels": {
      "About Me": "About Me",
      "Projects": "Projects",
      "Skills": "Skills",
      "Experience": "Experience",
      "Education": "Education",
      "Contact": "Contact"
    },
    "aboutBody": "I build full-stack web applications and applied AI products, from interface and API development to testing and client delivery. I am completing my BSc in Computer Science at Antonine University, with graduation expected in November 2026."
  },
  "ar": {
    "folderLabels": {
      "About Me": "عني",
      "Projects": "المشاريع",
      "Skills": "المهارات",
      "Experience": "الخبرة",
      "Education": "التعليم",
      "Contact": "تواصل"
    },
    "aboutBody": "أبني تطبيقات ويب متكاملة ومنتجات ذكاء اصطناعي تطبيقي، من الواجهات وواجهات البرمجة إلى الاختبارات والتسليم. أكمل بكالوريوس علوم الحاسوب في الجامعة الأنطونية، مع تخرج متوقع في نوفمبر 2026."
  },
  "fr": {
    "folderLabels": {
      "About Me": "À propos",
      "Projects": "Projets",
      "Skills": "Compétences",
      "Experience": "Expérience",
      "Education": "Formation",
      "Contact": "Contact"
    },
    "aboutBody": "Je développe des applications web full-stack et des produits d’IA appliquée, des interfaces et API aux tests et à la livraison. Je termine une licence en informatique à l’Université Antonine, avec un diplôme prévu en novembre 2026."
  }
};
export const LANG_CYCLE = [
  "en",
  "ar",
  "fr"
];
export const LANG_LABELS = {
  "en": "EN",
  "ar": "العربية",
  "fr": "FR"
};

const overrides = {
  "ar": {
    "About Me": [
      {
        "body": "مطور تطبيقات متكاملة بخبرة في تطوير ميزات ويب إنتاجية وتحسين أداء واجهات البرمجة ومعالجة مشكلات التطبيقات وبناء منتجات مدعومة بالذكاء الاصطناعي. أستخدم React وTypeScript وNode.js وFastAPI وPostgreSQL وأعمل مع العملاء من الفكرة إلى التسليم."
      },
      {
        "heading": "الملخص المهني",
        "body": "أبني تطبيقات ويب متكاملة ومنتجات ذكاء اصطناعي تطبيقي، من الواجهات وواجهات البرمجة إلى الاختبارات والتسليم. أكمل بكالوريوس علوم الحاسوب في الجامعة الأنطونية، مع تخرج متوقع في نوفمبر 2026."
      }
    ],
    "Projects": [
      {
        "heading": "Security Agent — تحليل أمني آلي",
        "body": "أداة تحليل أمني تجمع التحليل الساكن ونمذجة الهجمات والتحقق من الثغرات ضمن سير عمل محدد.",
        "items": [
          "تحليل قابلية الوصول وربط OWASP ASVS لإعداد تقارير قائمة على الأدلة. مشروع بحثي خاص؛ تقرير منقح متاح عند الطلب."
        ]
      },
      {
        "heading": "QA Orchestrator — أداة اختبارات Playwright",
        "body": "أداة لاختبار تطبيقات الويب تعتمد على قراءة المصدر واختبارات المتصفح وتسجيل الأدلة وإنتاج اختبارات لمنع تكرار الأخطاء.",
        "items": []
      },
      {
        "heading": "منصة RAG متعددة المستأجرين",
        "body": "منصة RAG متعددة المستأجرين تتيح للمستخدمين رفع ملفات PDF والحصول على إجابات مولدة عبر LLM مع استشهادات دقيقة.",
        "items": []
      },
      {
        "heading": "Khadamati — منصة الخدمات الحكومية",
        "body": "منصة حكومية إلكترونية تربط المواطنين والبلديات والإداريين عبر سير عمل رقمي للخدمات باستخدام Laravel و PHP و Blade و JavaScript.",
        "items": []
      },
      {
        "heading": "LiraTrack — تطبيق الإدارة المالية",
        "body": "تطبيق لإدارة الشؤون المالية الشخصية مصمم لبيئة لبنان المختلطة بين الليرة والدولار.",
        "items": []
      },
      {
        "heading": "ASL — ترجمة لغة الإشارة",
        "body": "نظام ترجمة لغة الإشارة الأمريكية في الوقت الحقيقي باستخدام بث كاميرا الويب و WebSockets واستخراج معالم اليد، يدعم التعرف على الإيماءات الديناميكية والثابتة باستخدام MediaPipe و PyTorch و FastAPI.",
        "items": [
          "أضفت اقتراحات كلمات مدعومة بـ GPT-2 وتثبيتاً متعدد الإطارات لتحسين ثبات التنبؤ.",
          "خط المعالجة: معالم MediaPipe ← PyTorch ONNX + LSTM ← اقتراحات GPT-2."
        ]
      },
      {
        "heading": "Compiler Workbench — أدوات المترجمات",
        "body": "تطبيق سطح مكتب باستخدام Qt لاستكشاف مفاهيم بناء المترجمات عبر منصة مرئية متكاملة.",
        "items": [
          "نفذت تصميم الأوتوماتا والتحليل المعجمي والتحليل النحوي والتحليل الدلالي وجداول الرموز وفحص شجرة AST وتوليد الشيفرة الأساسي باستخدام C++ و Qt للواجهة المرئية.",
          "المفاهيم: الأوتوماتا والتحليل النحوي و AST وتوليد الشيفرة؛ الواجهة عبر Qt6."
        ]
      }
    ],
    "Skills": [
      {
        "heading": "لغات البرمجة",
        "tags": [
          "TypeScript",
          "JavaScript",
          "Python",
          "PHP",
          "SQL"
        ]
      },
      {
        "heading": "الواجهات والخلفية",
        "tags": [
          "React",
          "Next.js",
          "Tailwind CSS",
          "Node.js",
          "Express",
          "FastAPI",
          "Laravel",
          "Prisma",
          "REST APIs"
        ]
      },
      {
        "heading": "البيانات والأدوات",
        "tags": [
          "PostgreSQL",
          "MySQL",
          "MongoDB",
          "Redis",
          "Docker",
          "Git",
          "GitHub"
        ]
      },
      {
        "heading": "الأمان والاختبارات والذكاء الاصطناعي",
        "tags": [
          "JWT",
          "OAuth",
          "RBAC",
          "pytest",
          "Unit testing",
          "E2E testing",
          "RAG",
          "LLM APIs"
        ]
      },
      {
        "heading": "اللغات المحكية",
        "tags": [
          "الإنجليزية — بطلاقة",
          "العربية — بطلاقة",
          "الفرنسية — متوسط"
        ]
      }
    ],
    "Experience": [
      {
        "heading": "Coderaas — مطور تطبيقات متكاملة",
        "meta": "يوليو 2026 – الآن",
        "items": [
          "حسّنت استعلامات Prisma وأضفت التخزين المؤقت على الخادم، مما خفض زمن استجابة واجهات البرمجة بنسبة 60%.",
          "طورت ميزات React وExpress وواجهات REST وتغييرات قواعد البيانات، وساهمت في تحويل نظام نقاط بيع قديم مبني على VB6 إلى تطبيق ويب.",
          "عالجت أعطال الإنتاج ومشكلات التحكم بالوصول وطبقت RBAC واختبارات لمنع تكرار الأخطاء."
        ],
        "body": ""
      },
      {
        "heading": "عمل حر — تطوير الويب وتحسين الظهور المحلي (صالون حلاقة)",
        "meta": "أكتوبر 2026 – نوفمبر 2026",
        "items": [
          "أنشأت وأطلقت موقع صالون حلاقة بالتعاون المباشر مع المالك، مع إرشاد ودعم بعد الإطلاق.",
          "أعددت Google Business Profile والظهور على الخرائط، ودعمت مراجعات العملاء وطبقت تحسينات البحث المحلي وقابلية الزحف لمحركات Google وأدوات الذكاء الاصطناعي."
        ],
        "body": ""
      },
      {
        "heading": "Sync — مطور تطبيقات متكاملة (مشروع)",
        "meta": "يناير 2026 – يونيو 2026",
        "items": [
          "طورت Jewebni، منصة للطلبات والمخزون تستخدم نماذج لغوية متعددة وRAG فوق ملفات PDF وDOCX وقوائم الويب.",
          "نفذت الطلبات والتسعير والمرتجعات وتكامل المساعد الصوتي وحساب التوصيل وضوابط الأمان والاختبارات الآلية."
        ],
        "body": ""
      },
      {
        "heading": "Jtech — مدرب برمجة",
        "meta": "سبتمبر 2025 – مايو 2026",
        "items": [
          "درست البرمجة والروبوتات عبر مشاريع عملية باستخدام Arduino وMinecraft Education."
        ],
        "body": ""
      },
      {
        "heading": "Istay — مدرب برمجة",
        "meta": "سبتمبر 2024 – مايو 2026",
        "items": [
          "درست أساسيات البرمجة باستخدام Python Turtle وmicro:bit وMakeCode Arcade."
        ],
        "body": ""
      }
    ],
    "Education": [
      {
        "heading": "الجامعة الأنطونية — الحدث، لبنان",
        "meta": "سبتمبر 2023 – تخرج متوقع نوفمبر 2026",
        "body": "بكالوريوس علوم الحاسوب"
      }
    ],
    "Contact": [
      {
        "heading": "البريد الإلكتروني",
        "links": [
          {
            "label": "إرسال بريد"
          }
        ]
      },
      {
        "heading": "الهاتف",
        "links": [
          {
            "label": "اتصال"
          }
        ]
      },
      {
        "heading": "الموقع",
        "body": "بتشاي، لبنان"
      },
      {
        "heading": "الموقع الإلكتروني",
        "links": [
          {
            "label": "فتح الموقع"
          }
        ]
      },
      {
        "heading": "GitHub",
        "links": [
          {
            "label": "فتح GitHub"
          }
        ]
      },
      {
        "heading": "أرسل رسالة",
        "body": "تفضل نموذجاً؟ رسالتك تُفتح في بريدك الإلكتروني — بدون إزعاج أو تتبع."
      }
    ]
  },
  "fr": {
    "About Me": [
      {
        "body": "Développeur Full Stack avec une expérience en fonctionnalités web de production, optimisation des API, résolution de problèmes et produits intégrant l’IA. Compétences en React, TypeScript, Node.js, FastAPI, PostgreSQL et livraison de projets clients de bout en bout."
      },
      {
        "heading": "Résumé professionnel",
        "body": "Je développe des applications web full-stack et des produits d’IA appliquée, des interfaces et API aux tests et à la livraison. Je termine une licence en informatique à l’Université Antonine, avec un diplôme prévu en novembre 2026."
      }
    ],
    "Projects": [
      {
        "heading": "Security Agent — Analyse de sécurité automatisée",
        "body": "Outil d’analyse de sécurité combinant analyse statique, modélisation des attaques et vérification des vulnérabilités dans un flux déterministe.",
        "items": [
          "Analyse d’accessibilité et correspondance OWASP ASVS pour des rapports fondés sur des preuves. Recherche privée ; rapport expurgé disponible sur demande."
        ]
      },
      {
        "heading": "QA Orchestrator — Moteur d’audit Playwright",
        "body": "Outil de test des applications web associant lecture du code, tests navigateur, preuves et génération de tests de régression.",
        "items": []
      },
      {
        "heading": "Plateforme RAG multi-tenant",
        "body": "Une plateforme RAG multi-tenant permettant aux utilisateurs de téléverser des PDF et d'obtenir des réponses générées par LLM avec citations.",
        "items": []
      },
      {
        "heading": "Khadamati — Services e-gouvernement",
        "body": "Une plateforme e-gouvernement connectant citoyens, municipalités et administrateurs via des flux de services numériques avec Laravel PHP, Blade et JavaScript.",
        "items": []
      },
      {
        "heading": "LiraTrack — Application de finances personnelles",
        "body": "Une application de finances personnelles adaptée à l'environnement mixte LBP/USD du Liban.",
        "items": []
      },
      {
        "heading": "ASL — Traduction de la langue des signes",
        "body": "Un système de traduction ASL en temps réel utilisant le streaming webcam, WebSockets et l'extraction de points de repère de la main, prenant en charge la reconnaissance de gestes dynamiques et statiques avec MediaPipe, PyTorch et FastAPI.",
        "items": [
          "Ajout de suggestions de mots basées sur GPT-2 et stabilisation multi-trames pour améliorer la cohérence des prédictions.",
          "Pipeline : landmarks MediaPipe → PyTorch ONNX + LSTM → suggestions GPT-2."
        ]
      },
      {
        "heading": "Compiler Workbench — Atelier de compilation",
        "body": "Une application de bureau Qt pour explorer les concepts de construction de compilateurs via un atelier visuel intégré.",
        "items": [
          "Implémenté la conception d'automates, analyse lexicale, parsing, analyse sémantique, tables de symboles, inspection AST et génération de code de base avec C++ et Qt pour l'interface visuelle.",
          "Concepts : automates, parsing, AST, génération de code ; UI via Qt6."
        ]
      }
    ],
    "Skills": [
      {
        "heading": "Langages",
        "tags": [
          "TypeScript",
          "JavaScript",
          "Python",
          "PHP",
          "SQL"
        ]
      },
      {
        "heading": "Frontend et backend",
        "tags": [
          "React",
          "Next.js",
          "Tailwind CSS",
          "Node.js",
          "Express",
          "FastAPI",
          "Laravel",
          "Prisma",
          "REST APIs"
        ]
      },
      {
        "heading": "Données et outils",
        "tags": [
          "PostgreSQL",
          "MySQL",
          "MongoDB",
          "Redis",
          "Docker",
          "Git",
          "GitHub"
        ]
      },
      {
        "heading": "Sécurité, tests et IA",
        "tags": [
          "JWT",
          "OAuth",
          "RBAC",
          "pytest",
          "Unit testing",
          "E2E testing",
          "RAG",
          "LLM APIs"
        ]
      },
      {
        "heading": "Langues parlées",
        "tags": [
          "Anglais — Courant",
          "Arabe — Courant",
          "Français — Intermédiaire"
        ]
      }
    ],
    "Experience": [
      {
        "heading": "Coderaas — Développeur Full Stack",
        "meta": "Juillet 2026 – Présent",
        "items": [
          "Optimisé les requêtes Prisma et ajouté un cache serveur, réduisant les temps de réponse des API de 60 %.",
          "Développé des fonctionnalités React/Express, des API REST et des modifications de base de données ; contribué à la migration d’un système de caisse VB6 vers une application web.",
          "Résolu des incidents de production et de contrôle d’accès ; implémenté RBAC et des tests de régression."
        ],
        "body": ""
      },
      {
        "heading": "Freelance — Développement web et référencement local (salon de coiffure)",
        "meta": "Octobre 2026 – Novembre 2026",
        "items": [
          "Créé et lancé un site de salon de coiffure avec le propriétaire, avec accompagnement après lancement.",
          "Configuré Google Business Profile et Maps, accompagné les avis clients et appliqué les pratiques de référencement local et d’exploration pour Google et les outils d’IA."
        ],
        "body": ""
      },
      {
        "heading": "Sync — Développeur Full Stack (projet)",
        "meta": "Janvier 2026 – Juin 2026",
        "items": [
          "Développé Jewebni, une plateforme de commandes et de stocks utilisant plusieurs LLM et RAG sur PDF, DOCX et menus web.",
          "Implémenté commandes, tarification, retours, assistant vocal, calculs de livraison, contrôles de sécurité et tests automatisés."
        ],
        "body": ""
      },
      {
        "heading": "Jtech — Formateur en programmation",
        "meta": "Septembre 2025 – Mai 2026",
        "items": [
          "Enseigné la programmation et la robotique avec des projets Arduino et Minecraft Education."
        ],
        "body": ""
      },
      {
        "heading": "Istay — Formateur en programmation",
        "meta": "Septembre 2024 – Mai 2026",
        "items": [
          "Enseigné les bases de la programmation avec Python Turtle, micro:bit et MakeCode Arcade."
        ],
        "body": ""
      }
    ],
    "Education": [
      {
        "heading": "Université Antonine — Hadath, Liban",
        "meta": "Septembre 2023 – Diplôme prévu novembre 2026",
        "body": "Licence en informatique"
      }
    ],
    "Contact": [
      {
        "heading": "Email",
        "links": [
          {
            "label": "Envoyer un email"
          }
        ]
      },
      {
        "heading": "Téléphone",
        "links": [
          {
            "label": "Appeler"
          }
        ]
      },
      {
        "heading": "Localisation"
      },
      {
        "heading": "Site web",
        "links": [
          {
            "label": "Ouvrir le site"
          }
        ]
      },
      {
        "heading": "GitHub",
        "links": [
          {
            "label": "Ouvrir GitHub"
          }
        ]
      },
      {
        "heading": "Envoyer un message",
        "body": "Un formulaire ? Votre message s'ouvre dans votre client email — sans spam, sans suivi."
      }
    ]
  }
};

export function getLocalizedContent(lang) {
  if (lang === "en" || !overrides[lang]) return FOLDER_CONTENT;
  const over = overrides[lang];
  const out = {};
  for (const key of Object.keys(FOLDER_CONTENT)) {
    const baseArr = FOLDER_CONTENT[key];
    const overArr = over[key];
    if (!overArr) { out[key] = baseArr; continue; }
    out[key] = baseArr.map((entry, i) => {
      const o = overArr[i] || {};
      const merged = { ...entry };
      if (o.heading !== undefined) merged.heading = o.heading;
      if (o.meta !== undefined) merged.meta = o.meta;
      if (o.body !== undefined) merged.body = o.body;
      if (o.items !== undefined) merged.items = o.items;
      if (o.tags !== undefined) merged.tags = o.tags;
      if (o.links !== undefined) {
        const baseLinks = entry.links || [];
        merged.links = o.links.map((l, idx) => ({ ...(baseLinks[idx] || {}), ...l }));
        // if base had more links than override, keep them
        if (baseLinks.length > o.links.length) merged.links.push(...baseLinks.slice(o.links.length));
      }
      return merged;
    });
  }
  return out;
}
