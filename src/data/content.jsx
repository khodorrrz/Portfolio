export const FOLDER_CONTENT = {
  "About Me": [
    {
      "heading": "Khodor El Hajj Moussa",
      "meta": "Beirut, Lebanon | +961 70 626 913 | khodorhajjmoussa@gmail.com | khodorrdev.shop",
      "body": "Full Stack Developer with experience delivering production web features, improving API performance, resolving application issues, and building AI-powered products. Skilled in React, TypeScript, Node.js, FastAPI, PostgreSQL, and end-to-end client delivery.",
      "links": [
        {
          "href": "/KHODOR-EL-HAJJ-MOUSSA-CV.pdf",
          "label": "Download CV (PDF)"
        },
        {
          "href": "/KHODOR-EL-HAJJ-MOUSSA-CV.docx",
          "label": "DOCX"
        }
      ]
    },
    {
      "heading": "Professional Summary",
      "body": "I build full-stack web applications and applied AI products, from interface and API development to testing and client delivery. I am completing my BSc in Computer Science at Antonine University, with graduation expected in November 2026."
    }
  ],
  "Projects": [
    {
      "heading": "Security Agent — Automated Security Analysis",
      "meta": "Static analysis, attack modeling, vulnerability verification | Security Platform",
      "body": "Built an automated security analysis tool that chains static analysis, attack modeling, and vulnerability verification in a deterministic workflow.",
      "items": [
        "Implemented reachability analysis and OWASP ASVS mapping to produce evidence-based reports.",
        "Private research project; sanitized report available on request."
      ]
    },
    {
      "heading": "QA Orchestrator — Autonomous White-Box Playwright Audit Engine",
      "meta": "PowerShell, Playwright, TypeScript, JSON Schema, React, Express | QA Platform",
      "body": "A white-box, code-aware QA audit engine for local web apps — reads source, plans against it, drives a real browser through every page and role, and produces a ledger-derived report with permanent Playwright regression tests.",
      "items": [
        "Built a 6-phase deterministic engine with DFS tree traversal — serial leaves, parallel FE/BE wiring children — wiring inventory becomes the census the gates enforce.",
        "Enforced 6 anti-glance gates on every page: census, checklist, before/after evidence, sentinels, interaction ratio, and mutation — a page that only looks tested cannot pass.",
        "Derived QA-REPORT.md and coverage directly from the ledger, generated permanent specs from passing scenarios, and made results reproducible with atomic writes and Ajv validation."
      ],
      "links": [
        {
          "href": "https://github.com/khodorrrz/QA-Orchestrator",
          "label": "GitHub"
        }
      ]
    },
    {
      "heading": "Multi-Tenant RAG Platform",
      "meta": "React, FastAPI, PostgreSQL, Docker, Redis, JWT | Full-Stack AI/RAG",
      "body": "Built a React/FastAPI PDF question-answering web app with hybrid retrieval, reranking, Redis jobs, JWT, tenant isolation, and Docker.",
      "items": [],
      "links": [
        {
          "href": "https://github.com/khodorrrz/Rag-System",
          "label": "GitHub"
        }
      ]
    },
    {
      "heading": "Khadamati — E-Government Services Platform",
      "meta": "Laravel, PHP, Blade, JavaScript, Stripe, Google Cloud Vision | Laravel App",
      "body": "Developed Laravel workflows for citizen requests and appointments; integrated OCR ID verification, Stripe, chat, and RBAC dashboards.",
      "items": [],
      "links": [
        {
          "href": "https://github.com/khodorrrz/Khadamati",
          "label": "GitHub"
        }
      ]
    },
    {
      "heading": "LiraTrack — Personal Finance Application",
      "meta": "TypeScript, Next.js, React, FastAPI, PostgreSQL, Docker",
      "body": "Built a Next.js/FastAPI finance app with receipt OCR, SMS transaction drafts, bilingual UI, OAuth, and optional TOTP 2FA.",
      "items": [],
      "links": [
        {
          "href": "https://github.com/khodorrrz/Lebanese_Finance_Tracker",
          "label": "GitHub"
        }
      ]
    },
    {
      "heading": "ASL Real-Time Sign Language Translator",
      "meta": "Python, FastAPI, MediaPipe, PyTorch, WebSockets | Computer Vision / ML",
      "body": "A real-time ASL translation system using webcam streaming, WebSockets, and hand-landmark extraction that supports dynamic and static gesture recognition using MediaPipe, PyTorch and FastAPI.",
      "items": [
        "Added GPT-2-based word suggestions and multi-frame stabilization to improve prediction consistency.",
        "Pipeline: MediaPipe landmarks → PyTorch ONNX + LSTM → GPT-2 suggestions."
      ],
      "links": [
        {
          "href": "https://github.com/khodorrrz/ASL-Real-Time-Sign-Language-Translator",
          "label": "GitHub"
        }
      ]
    },
    {
      "heading": "Compiler Workbench",
      "meta": "C++, Qt | Desktop / Compiler Tooling",
      "body": "A desktop Qt application for exploring compiler construction concepts through an integrated visual workbench.",
      "items": [
        "Implemented automata design, lexical analysis, parsing, semantic analysis, symbol tables, AST inspection, and basic code generation using C++ and Qt for visual interface.",
        "Concepts: automata, parsing, AST, code gen; UI via Qt6."
      ],
      "links": [
        {
          "href": "https://github.com/khodorrrz/CompilerDesign",
          "label": "GitHub"
        }
      ]
    }
  ],
  "Skills": [
    {
      "heading": "Languages",
      "tags": [
        "TypeScript",
        "JavaScript",
        "Python",
        "PHP",
        "SQL"
      ]
    },
    {
      "heading": "Frontend & Backend",
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
      "heading": "Data & Tools",
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
      "heading": "Security, Testing & AI",
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
      "heading": "Spoken Languages",
      "tags": [
        "English — Fluent",
        "Arabic — Fluent",
        "French — Intermediate"
      ]
    }
  ],
  "Experience": [
    {
      "heading": "Coderaas — Full Stack Developer",
      "meta": "July 2026 – Present",
      "items": [
        "Optimized Prisma queries and introduced server-side caching, reducing API response times by 60%.",
        "Built React/Express features, REST APIs, and database changes; helped modernize a legacy VB6 POS system into a web application.",
        "Troubleshot production crashes and access-control issues; implemented RBAC and regression tests."
      ]
    },
    {
      "heading": "Freelance — Web Developer & Local SEO (Barbershop Client)",
      "meta": "October 2026 – November 2026",
      "items": [
        "Built and launched a barbershop website directly with the owner, providing post-launch guidance and support.",
        "Set up Google Business Profile and Maps presence, supported customer reviews, and applied local SEO and crawlability practices for Google Search and AI crawlers."
      ]
    },
    {
      "heading": "Sync — Full Stack Developer (Project-Based)",
      "meta": "January 2026 – June 2026",
      "items": [
        "Built Jewebni, an AI-powered ordering and inventory platform using multi-LLM workflows and RAG over PDFs, DOCX files, and web menus.",
        "Implemented orders, pricing, returns, voice-assistant integration, delivery calculations, security controls, and automated tests."
      ]
    },
    {
      "heading": "Jtech — Programming Instructor",
      "meta": "September 2025 – May 2026",
      "items": [
        "Taught programming and robotics through hands-on Arduino and Minecraft Education projects."
      ]
    },
    {
      "heading": "Istay — Programming Instructor",
      "meta": "September 2024 – May 2026",
      "items": [
        "Taught introductory programming using Python Turtle, micro:bit, and MakeCode Arcade."
      ]
    }
  ],
  "Education": [
    {
      "heading": "Antonine University — Hadath, Lebanon",
      "meta": "September 2023 – Expected November 2026",
      "body": "Bachelor of Science in Computer Science"
    }
  ],
  "Contact": [
    {
      "heading": "Email",
      "body": "khodorhajjmoussa@gmail.com",
      "links": [
        {
          "href": "mailto:khodorhajjmoussa@gmail.com",
          "label": "Send email"
        }
      ]
    },
    {
      "heading": "Phone",
      "body": "+961 70 626 913",
      "links": [
        {
          "href": "tel:+96170626913",
          "label": "Call"
        }
      ]
    },
    {
      "heading": "Location",
      "body": "Beirut, Lebanon"
    },
    {
      "heading": "Website",
      "body": "khodorrdev.shop",
      "links": [
        {
          "href": "https://khodorrdev.shop",
          "label": "Open website"
        }
      ]
    },
    {
      "heading": "GitHub",
      "body": "github.com/khodorrrz",
      "links": [
        {
          "href": "https://github.com/khodorrrz",
          "label": "Open GitHub"
        }
      ]
    },
    {
      "heading": "Send a Message",
      "body": "Prefer a form? Your message opens in your email client — no spam, no tracking."
    }
  ]
};
