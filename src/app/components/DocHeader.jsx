import React, { useState, useRef, useEffect, useCallback } from "react";
import { Menu, Download, ExternalLink } from "lucide-react";
import { T, ts } from "../constants/theme";

export function DocHeader({
  doc,
  editUrl,
  t,
  isDesktop,
  onOpenSidebar,
  onExportPdf,
  onExportMd,
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);
  const docMeta = ts(doc?.team);

  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setExportOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleExportPdf = useCallback(() => {
    onExportPdf();
    setExportOpen(false);
  }, [onExportPdf]);
  const handleExportMd = useCallback(() => {
    onExportMd();
    setExportOpen(false);
  }, [onExportMd]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        borderBottom: `1px solid ${T.border}`,
        background: T.bgHeader,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "10px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: 0,
          }}
        >
          {!isDesktop && (
            <button
              onClick={onOpenSidebar}
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: "3px",
                padding: "5px 7px",
                cursor: "pointer",
                color: T.textMuted,
                display: "flex",
                flexShrink: 0,
              }}
            >
              <Menu size={15} />
            </button>
          )}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
              background: docMeta.dim,
              border: `1px solid ${docMeta.border}`,
              borderRadius: "2px",
              padding: "3px 8px",
            }}
          >
            <docMeta.Icon size={11} style={{ color: docMeta.color }} />
            <span
              style={{
                fontFamily: T.mono,
                fontSize: "9px",
                fontWeight: 700,
                color: docMeta.color,
                letterSpacing: "0.12em",
              }}
            >
              {docMeta.label}
            </span>
          </div>

          <span
            style={{
              fontFamily: T.mono,
              fontSize: "12px",
              fontWeight: 500,
              color: T.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {doc?.title}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          <div style={{ position: "relative" }} ref={exportRef}>
            <button
              onClick={() => setExportOpen((v) => !v)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                border: `1px solid ${exportOpen ? T.borderHover : T.border}`,
                borderRadius: "3px",
                background: exportOpen ? T.bgCard : "transparent",
                color: exportOpen ? T.textBright : T.textMuted,
                fontFamily: T.mono,
                fontSize: "11px",
                cursor: "pointer",
                transition: "color 0.1s, border-color 0.1s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = T.textBright;
              }}
              onMouseLeave={(e) => {
                if (!exportOpen) e.currentTarget.style.color = T.textMuted;
              }}
            >
              <Download size={11} />
              export
            </button>

            {exportOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 6px)",
                  zIndex: 50,
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                  borderRadius: "3px",
                  overflow: "hidden",
                  minWidth: "160px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  style={{
                    padding: "7px 12px 6px",
                    fontFamily: T.mono,
                    fontSize: "9px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: T.textDim,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  export note
                </div>

                {[
                  { label: "PDF / Print", icon: "📄", action: handleExportPdf },
                  { label: "Raw Markdown", icon: "⬇", action: handleExportMd },
                ].map(({ label, icon, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "9px 14px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: T.mono,
                      fontSize: "12px",
                      color: T.text,
                      textAlign: "left",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = T.bgCardHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href={editUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              border: `1px solid ${T.border}`,
              borderRadius: "3px",
              background: "transparent",
              color: T.textMuted,
              fontFamily: T.mono,
              fontSize: "11px",
              textDecoration: "none",
              transition: "color 0.1s, border-color 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.textBright;
              e.currentTarget.style.borderColor = T.borderHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.textMuted;
              e.currentTarget.style.borderColor = T.border;
            }}
          >
            {t.edit}
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </header>
  );
}
