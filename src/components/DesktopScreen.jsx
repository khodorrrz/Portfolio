import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  DESKTOP_FOLDERS,
  DEFAULT_MOBILE_FOLDER,
} from "../data/constants.js";
import { FOLDER_CONTENT } from "../data/content.jsx";
import { getLocalizedContent, translations } from "../data/i18n.js";

function FolderIcon({ title, label, onOpen }) {
  return (
    <button
      className="desktop-folder"
      onClick={() => onOpen(title)}
      type="button"
    >
      <span className="desktop-folder__icon" aria-hidden="true">
        <svg viewBox="0 0 64 52" role="presentation">
          <path
            d="M6 14a6 6 0 0 1 6-6h14l5 6h21a6 6 0 0 1 6 6v20a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8V14Z"
            fill="#f1bf42"
          />
          <path
            d="M4 20a6 6 0 0 1 6-6h42a6 6 0 0 1 6 6v4H4v-4Z"
            fill="#ffd56a"
          />
        </svg>
      </span>
      <span className="desktop-folder__label">{label}</span>
    </button>
  );
}

function tagIcon(tag) {
  const m = {
    JavaScript: "🟨",
    TypeScript: "🔷",
    Python: "🐍",
    PHP: "🐘",
    "C++": "⚙️",
    "C#": "♯",
    SQL: "🗄️",
    CSS: "🎨",
    React: "⚛️",
    "Next.js": "▲",
    "React Three Fiber": "🧊",
    "Three.js": "🎮",
    "Tailwind CSS": "🌬️",
    FastAPI: "⚡",
    "REST API": "🔌",
    "JWT Authentication": "🔑",
    OAuth: "🔐",
    Bcrypt: "🔒",
    PostgreSQL: "🐘",
    MySQL: "🐬",
    MongoDB: "🍃",
    PyTorch: "🔥",
    MediaPipe: "🤚",
    OpenCV: "👁️",
    "scikit-learn": "📊",
    Docker: "🐳",
    Git: "🔧",
    pytest: "🧪",
    Redis: "🧰",
    JWT: "🔑",
    Laravel: "🔶",
    Stripe: "💳",
  };
  return m[tag] || "";
}

const PROJECT_FILTERS = ["All", "AI/RAG", "Full-Stack", "ML", "Tooling", "Security & QA"];
function matchesProjectFilter(section, filter) {
  if (filter === "All") return true;
  const h = section.heading;
  if (filter === "AI/RAG") return h.includes("RAG");
  if (filter === "Full-Stack") return h.includes("Khadamati") || h.includes("LiraTrack");
  if (filter === "ML") return h.includes("ASL");
  if (filter === "Tooling") return h.includes("Compiler") || h.includes("Security") || h.includes("QA Orchestrator");
  if (filter === "Security & QA") return h.includes("Security") || h.includes("QA Orchestrator");
  return true;
}

export function DesktopWindow({ className = "", title, lang = "en", onClose }) {
  const localized = getLocalizedContent(lang);
  const rawSections = localized[title] ?? FOLDER_CONTENT[title];
  const sections = rawSections;
  const displayTitle = translations[lang]?.folderLabels?.[title] ?? title;
  const closeRef = useRef(null);
  const [copied, setCopied] = useState(null);
  const [projectFilter, setProjectFilter] = useState("All");

  useEffect(() => {
    setProjectFilter("All");
  }, [title]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <section
      className={`desktop-window ${className}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="desktop-window-title"
    >
      <header className="desktop-window__header">
        <strong id="desktop-window-title">{displayTitle}</strong>
        <button
          ref={closeRef}
          aria-label="Close window"
          className="desktop-window__close"
          onClick={onClose}
          type="button"
        >
          x
        </button>
      </header>
      <div className="desktop-window__body">
        {title === "Projects" && sections ? (
          <div className="project-filter" role="tablist" aria-label="Project filters">
            {PROJECT_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={projectFilter === f}
                className={`project-filter__pill${projectFilter === f ? " project-filter__pill--active" : ""}`}
                onClick={() => setProjectFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        ) : null}
        {sections ? (
          title === "Experience" ? (
            <div className="timeline">
              <div className="timeline__line" aria-hidden="true" />
              {sections.map((section) => (
                <div className="timeline__item" key={section.heading}>
                  <span className="timeline__dot" aria-hidden="true" />
                  <div className="timeline__content">
                    <h2>{section.heading}</h2>
                    {section.meta ? (
                      <p className="desktop-window__meta">{section.meta}</p>
                    ) : null}
                    {section.image ? (
                      <img src={section.image} alt="" loading="lazy" style={{ width: "100%", marginTop: "0.5rem", display: "block" }} />
                    ) : null}
                    {section.body ? <p>{section.body}</p> : null}
                    {section.items ? (
                      <ul className="desktop-window__list">
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                    {section.tags ? (
                      <div className="desktop-window__tags">
                        {section.tags.map((tag) => {
                          const icon = tagIcon(tag);
                          return (
                            <span className="desktop-window__tag" key={tag} title={tag}>
                              {icon ? <span aria-hidden="true" style={{ marginRight: "0.28rem" }}>{icon}</span> : null}
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    ) : null}
                    {section.links || section.link ? (
                      <div className="desktop-window__links">
                        {(
                          section.links ?? [
                            {
                              href: section.link,
                              label: section.linkLabel ?? "GitHub",
                            },
                          ]
                        ).map((link) => (
                          <a
                            className="desktop-window__link"
                            href={link.href}
                            key={link.href}
                            rel="noopener noreferrer"
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            (title === "Projects" ? sections.filter((s) => matchesProjectFilter(s, projectFilter)) : sections).map((section) => (
              <section className="desktop-window__section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.meta ? (
                  <p className="desktop-window__meta">{section.meta}</p>
                ) : null}
                {section.image ? (
                  <img src={section.image} alt="" loading="lazy" style={{ width: "100%", marginTop: "0.5rem", display: "block" }} />
                ) : null}
                {section.body ? <p>{section.body}</p> : null}
                {section.items ? (
                  <ul className="desktop-window__list">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.tags ? (
                  <div className="desktop-window__tags">
                    {section.tags.map((tag) => {
                      const icon = tagIcon(tag);
                      return (
                        <span className="desktop-window__tag" key={tag} title={tag}>
                          {icon ? <span aria-hidden="true" style={{ marginRight: "0.28rem" }}>{icon}</span> : null}
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                ) : null}
                {section.links || section.link ? (
                  <div className="desktop-window__links">
                    {(
                      section.links ?? [
                        {
                          href: section.link,
                          label: section.linkLabel ?? "GitHub",
                        },
                      ]
                    ).map((link) => (
                      <a
                        className="desktop-window__link"
                        href={link.href}
                        key={link.href}
                        rel="noopener noreferrer"
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
                      >
                        {link.label}
                      </a>
                    ))}
                    {(section.heading === "Email" || section.heading === "Phone") && section.body ? (
                      <button
                        type="button"
                        className="desktop-window__link"
                        onClick={() => {
                          navigator.clipboard.writeText(section.body).then(() => {
                            setCopied(section.heading);
                            setTimeout(() => setCopied(null), 1500);
                          });
                        }}
                      >
                        {copied === section.heading ? "Copied!" : "Copy"}
                      </button>
                    ) : null}
                  </div>
                ) : (section.heading === "Email" || section.heading === "Phone") && section.body ? (
                  <div className="desktop-window__links">
                    <button
                      type="button"
                      className="desktop-window__link"
                      onClick={() => {
                        navigator.clipboard.writeText(section.body).then(() => {
                          setCopied(section.heading);
                          setTimeout(() => setCopied(null), 1500);
                        });
                      }}
                    >
                      {copied === section.heading ? "Copied!" : "Copy"}
                    </button>
                  </div>
                ) : null}
                {title === "Contact" && section.heading === "Send a Message" ? (
                  <form
                    className="contact-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const name = form.elements.namedItem("name").value.trim();
                      const email = form.elements.namedItem("email").value.trim();
                      const message = form.elements.namedItem("message").value.trim();
                      const subject = `Portfolio contact from ${name}`;
                      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
                      const mailto = `mailto:khodorhajjmoussa@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      window.location.href = mailto;
                    }}
                  >
                    <label className="contact-form__field">
                      <span>Name</span>
                      <input name="name" required placeholder="Your name" autoComplete="name" />
                    </label>
                    <label className="contact-form__field">
                      <span>Email</span>
                      <input name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
                    </label>
                    <label className="contact-form__field">
                      <span>Message</span>
                      <textarea name="message" required placeholder="How can I help?" rows={4} />
                    </label>
                    <button type="submit" className="contact-form__send">Send</button>
                    <p className="contact-form__fallback">
                      Opens your email client. If nothing happens, email <a href="mailto:khodorhajjmoussa@gmail.com">khodorhajjmoussa@gmail.com</a> directly.
                    </p>
                  </form>
                ) : null}
              </section>
            ))
          )
        ) : (
          <>
            <p>{title}</p>
            <p>Placeholder content for the {title} folder.</p>
          </>
        )}
      </div>
    </section>
  );
}

function MobileFolderTab({ isActive, title, label, onOpen }) {
  return (
    <button
      className={`mobile-folder-tab${isActive ? " mobile-folder-tab--active" : ""}`}
      onClick={() => onOpen(title)}
      type="button"
    >
      {label}
    </button>
  );
}

function DesktopBootScreen() {
  return (
    <section className="desktop-screen__boot" aria-live="polite">
      <div className="desktop-screen__boot-panel">
        <p className="desktop-screen__boot-title">Booting KhodorOS</p>
        <div className="desktop-screen__boot-loader" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}

export default function DesktopScreen({
  isBooting,
  isMobile,
  isVisible,
  lang = "en",
  opacity,
  screenRect,
}) {
  const [openWindow, setOpenWindow] = useState(null);

  const syncOpenWindow = useCallback((next) => {
    setOpenWindow(next);
    if (next && DESKTOP_FOLDERS.includes(next)) {
      const encoded = `#${encodeURIComponent(next)}`;
      if (window.location.hash !== encoded) history.replaceState(null, "", encoded);
    } else if (!next) {
      if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    if (!isVisible || isBooting) {
      setOpenWindow(null);
      return;
    }

    if (isMobile) {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (DESKTOP_FOLDERS.includes(hash)) {
        setOpenWindow(hash);
        return;
      }
      setOpenWindow((currentWindow) => currentWindow ?? DEFAULT_MOBILE_FOLDER);
      return;
    }

    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (DESKTOP_FOLDERS.includes(hash)) {
      setOpenWindow(hash);
    }
  }, [isBooting, isMobile, isVisible]);

  useEffect(() => {
    const readHash = () => {
      const raw = decodeURIComponent(window.location.hash.slice(1));
      if (DESKTOP_FOLDERS.includes(raw)) setOpenWindow(raw);
      else if (!raw) setOpenWindow(null);
    };
    if (isVisible && !isBooting) readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [isVisible, isBooting]);

  if (!isVisible || !screenRect) return null;

  if (isMobile) {
    return (
      <section
        className="desktop-screen desktop-screen--mobile"
        style={{ opacity }}
      >
        <div className="desktop-screen__mobile-shell">
          <div className="desktop-screen__mobile-folders">
            {DESKTOP_FOLDERS.map((folder) => (
              <MobileFolderTab
                key={folder}
                isActive={openWindow === folder}
                label={translations[lang]?.folderLabels?.[folder] ?? folder}
                onOpen={syncOpenWindow}
                title={folder}
              />
            ))}
          </div>

          {openWindow ? (
            <DesktopWindow
              className="desktop-window--mobile"
              lang={lang}
              title={openWindow}
              onClose={() => syncOpenWindow(null)}
            />
          ) : (
            <section className="desktop-screen__mobile-placeholder">
              <p>Tap a folder to open it.</p>
            </section>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="desktop-screen">
      <div
        className="desktop-screen__anchor"
        style={{
          left: `${screenRect.left}px`,
          opacity,
          top: `${screenRect.top}px`,
          width: `${screenRect.width}px`,
          height: `${screenRect.height}px`,
        }}
      >
        <div className="desktop-screen__surface">
          {isBooting ? (
            <DesktopBootScreen />
          ) : (
            <>
              <div className="desktop-screen__folders">
                {DESKTOP_FOLDERS.map((folder) => (
                  <FolderIcon
                    key={folder}
                    label={translations[lang]?.folderLabels?.[folder] ?? folder}
                    title={folder}
                    onOpen={syncOpenWindow}
                  />
                ))}
              </div>

              {openWindow ? (
                <DesktopWindow
                  lang={lang}
                  title={openWindow}
                  onClose={() => syncOpenWindow(null)}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
