import React, { Component } from "react";
import { DESKTOP_FOLDERS } from "../data/constants.js";
import { FOLDER_CONTENT } from "../data/content.jsx";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error("3D room failed to load", error, info);
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export function FlatPortfolioFallback() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 15,
        overflow: "auto",
        padding: "5rem 1rem 1rem",
        background: "#0b1020",
        color: "#f4f4f5",
      }}
    >
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            background: "rgba(255,213,106,0.12)",
            border: "1px solid rgba(255,213,106,0.35)",
            color: "#ffd56a",
            fontWeight: 700,
          }}
        >
          Failed to load 3D room — viewing flat portfolio
        </div>
        {DESKTOP_FOLDERS.map((folder) => (
          <section key={folder} style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ margin: "0 0 0.5rem", color: "#fafafa" }}>{folder}</h2>
            {(FOLDER_CONTENT[folder] ?? []).map((section) => (
              <div
                key={section.heading}
                style={{
                  marginBottom: "0.75rem",
                  padding: "0.75rem",
                  background: "rgba(39,39,42,0.96)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <h3 style={{ margin: "0 0 0.25rem", fontSize: "0.9rem", color: "#fafafa" }}>{section.heading}</h3>
                {section.meta ? <p style={{ margin: "0 0 0.25rem", color: "#ffd56a", fontSize: "0.78rem", fontWeight: 700 }}>{section.meta}</p> : null}
                {section.body ? <p style={{ margin: 0, color: "#d4d4d8", lineHeight: 1.45, fontSize: "0.85rem" }}>{section.body}</p> : null}
                {section.tags ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.4rem" }}>
                    {section.tags.map((tag) => (
                      <span key={tag} style={{ padding: "0.2rem 0.4rem", background: "rgba(63,63,70,0.82)", border: "1px solid rgba(255,255,255,0.14)", fontSize: "0.72rem" }}>{tag}</span>
                    ))}
                  </div>
                ) : null}
                {section.items ? (
                  <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1rem", color: "#d4d4d8", fontSize: "0.82rem" }}>
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                ) : null}
                {section.links ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.4rem" }}>
                    {section.links.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" style={{ color: "#ffd56a", fontSize: "0.82rem" }}>{link.label}</a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
