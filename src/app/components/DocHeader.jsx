import React, { useState, useRef, useEffect } from "react";
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

  const handleExportPdf = () => {
    onExportPdf();
    setExportOpen(false);
  };

  const handleExportMd = () => {
    onExportMd();
    setExportOpen(false);
  };

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
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "12px 24px",
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
                borderRadius: "4px",
                padding: "6px 8px",
                cursor: "pointer",
                color: T.textMuted,
                display: "flex",
              }}
            >
              <Menu size={16} />
            </button>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
              background: docMeta.dim,
              border: `1px solid ${docMeta.border}`,
              borderRadius: "4px",
              padding: "3px 9px",
            }}
          >
            <docMeta.Icon size={12} style={{ color: docMeta.color }} />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: docMeta.color,
                letterSpacing: "0.12em",
              }}
            >
              {docMeta.label}
            </span>
          </div>

          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: T.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {doc?.title}
          </div>
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
                padding: "6px 10px",
                borderRadius: "4px",
                border: `1px solid ${exportOpen ? T.borderHover : T.border}`,
                background: exportOpen ? T.bgCard : "transparent",
                color: T.textMuted,
                fontFamily: T.mono,
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              <Download size={12} />
              <span className="hidden-sm">export</span>
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
                  borderRadius: "6px",
                  overflow: "hidden",
                  minWidth: "160px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  style={{
                    padding: "8px 12px 6px",
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    color: T.textMuted,
                    borderBottom: `1px solid ${T.border}`,
                    fontWeight: 600,
                  }}
                >
                  EXPORT NOTE
                </div>

                <button
                  onClick={handleExportPdf}
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
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = T.bgCardHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  📄 PDF / Print
                </button>

                <button
                  onClick={handleExportMd}
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
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = T.bgCardHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  ⬇ Raw Markdown
                </button>
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
              padding: "6px 10px",
              borderRadius: "4px",
              border: `1px solid ${T.border}`,
              background: "transparent",
              color: T.textMuted,
              fontFamily: T.mono,
              fontSize: "11px",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = T.textBright)}
            onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
          >
            <span className="hidden-sm">{t.edit}</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </header>
  );
}
