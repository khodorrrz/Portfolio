// Future blog / case study data. Not rendered yet — placeholder for blog route.
// Each entry keyed by project slug. Keep in sync with src/data/content.jsx Projects.

export const CASE_STUDIES = {
  rag: {
    title: "Multi-Tenant RAG Platform",
    repo: "https://github.com/khodorrrz/Rag-System",
    challenge:
      "Users needed cited answers from large PDF collections with tenant isolation and low latency.",
    solution:
      "Hybrid vector + keyword search with reranking, confidence thresholds, re-retrieval, section detection, and multi-part query handling.",
    stack: "React, FastAPI, PostgreSQL + pgvector, Redis, JWT, Docker",
    architecture: "React → FastAPI → pgvector + Redis workers, Docker. Full-stack ownership.",
    impact: "Cited, grounded answers; async ingest via Redis workers; Dockerized deploy.",
    diagramText: `
[ React UI ] ──JWT──> [ FastAPI ]
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
        [ pgvector ] [ Redis Queue ] [ Auth / Tenants ]
              │           │
              └─────> [ Workers: chunk → embed → index ]
                          │
                    [ Rerank → Confidence → Cite ]
`,
  },
  khadamati: {
    title: "Khadamati — E-Government Services Platform",
    repo: "https://github.com/khodorrrz/Khadamati",
    challenge:
      "Digitize citizen–municipality–admin workflows with identity verification and secure payments.",
    solution:
      "Role-based dashboards, request/approval flows, appointment booking, QR tracking, and real-time chat.",
    stack: "Laravel PHP 8.2, Blade, Vite, Stripe, Google Cloud Vision",
    architecture: "Blade/Vite UI → Laravel → MySQL + Stripe + Cloud Vision OCR",
    impact: "Lebanese ID OCR verification, Stripe payments, auditable request lifecycle.",
    diagramText: `
[ Blade + Vite ] ──> [ Laravel (PHP 8.2) ] ──> [ MySQL ]
                          │           │
                    [ Stripe ]  [ Cloud Vision OCR ]
                          │           │
                    [ QR / Chat / Booking / RBAC ]
`,
  },
  liraTrack: {
    title: "LiraTrack — Personal Finance Application",
    repo: "https://github.com/khodorrrz/Lebanese_Finance_Tracker",
    challenge:
      "Mixed LBP/USD wallets in Lebanon — receipts, SMS, and bilingual UX needed.",
    solution:
      "OCR receipt scanning, SMS transaction drafts, bilingual support, PDF exports, OAuth/JWT + optional TOTP 2FA.",
    stack: "TypeScript, Next.js, React, FastAPI, PostgreSQL, Docker",
    architecture: "Next.js → FastAPI → PostgreSQL, Docker Compose",
    impact: "Handles dual-currency reality; OCR + SMS drafts reduce manual entry.",
    diagramText: `
[ Next.js (TS) ] ──> [ FastAPI ] ──> [ PostgreSQL ]
       │                  │
  [ OCR / SMS drafts ] [ JWT + TOTP 2FA / OAuth ]
       │                  │
              [ PDF Exports / i18n ]
`,
  },
  asl: {
    title: "ASL Real-Time Sign Language Translator",
    repo: "https://github.com/khodorrrz/ASL-Real-Time-Sign-Language-Translator",
    challenge:
      "Real-time ASL translation from webcam with stable predictions and word suggestions.",
    solution:
      "Hand-landmark extraction, ONNX/LSTM recognition, multi-frame stabilization, and GPT-2 word suggestions over WebSockets.",
    stack: "Python, FastAPI, MediaPipe, PyTorch (ONNX/LSTM), GPT-2, WebSockets",
    architecture: "MediaPipe landmarks → PyTorch ONNX + LSTM → GPT-2 suggestions",
    impact: "Low-latency streaming; stabilized predictions; assistive word completion.",
    diagramText: `
[ Webcam ] ──WS──> [ FastAPI ]
                       │
                 [ MediaPipe Landmarks ]
                       │
                 [ PyTorch ONNX + LSTM ]
                       │
              [ Stabilizer ] → [ GPT-2 Suggest ]
`,
  },
  compiler: {
    title: "Compiler Workbench",
    repo: "https://github.com/khodorrrz/CompilerDesign",
    challenge:
      "Make compiler construction concepts explorable through a visual desktop workbench.",
    solution:
      "Automata design, lexing, parsing, semantic analysis, symbol tables, AST inspection, and code generation with a Qt UI.",
    stack: "C++, Qt6",
    architecture: "Qt6 UI → Lex → Parse → Semantic → AST → CodeGen",
    impact: "Interactive exploration of automata, parsing, and code gen in one tool.",
    diagramText: `
[ Qt6 UI ]
    │
[ Automata ] → [ Lexer ] → [ Parser ] → [ Semantic / Symbol Table ]
                                      │
                                   [ AST ] → [ CodeGen ]
`,
  },
};

export default CASE_STUDIES;
