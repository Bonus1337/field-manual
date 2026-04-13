import React, { useState } from "react";
import { Clock } from "lucide-react";
import { T, ts } from "../constants/theme";

export function ArticleCard({ doc, onGoDoc }) {
  const [hov, setHov] = useState(false);
  const m = ts(doc.team);
  const shortDescription = String(doc.shortDescription || "").trim();

  return (
    <button
      onClick={() => onGoDoc(doc.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: hov
          ? "linear-gradient(180deg, rgba(12,16,24,1) 0%, rgba(9,13,21,1) 100%)"
          : "linear-gradient(180deg, rgba(10,14,22,1) 0%, rgba(7,10,17,1) 100%)",
        border: `1px solid ${hov ? m.border : T.border}`,
        borderLeft: `3px solid ${hov ? m.color : m.border}`,
        borderRadius: "12px",
        padding: "26px 28px",
        cursor: "pointer",
        transition: "all 0.18s ease",
        boxShadow: hov
          ? m.glow
          : "0 10px 30px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.02)",
        fontFamily: T.mono,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            hov && doc.team === "red"
              ? "linear-gradient(90deg, rgba(255,58,92,0.06) 0%, transparent 18%)"
              : hov && doc.team === "blue"
                ? "linear-gradient(90deg, rgba(56,189,248,0.05) 0%, transparent 18%)"
                : hov
                  ? "linear-gradient(90deg, rgba(34,197,94,0.04) 0%, transparent 18%)"
                  : "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              minWidth: 0,
            }}
          >
            <m.Icon size={12} style={{ color: m.color }} />

            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.14em",
                fontWeight: 700,
                color: m.color,
              }}
            >
              {m.label}
            </span>

            {doc.category && (
              <>
                <span style={{ color: T.textDim, fontSize: "10px" }}>·</span>
                <span
                  style={{
                    fontSize: "11px",
                    color: T.textMuted,
                    letterSpacing: "0.05em",
                  }}
                >
                  {doc.category}
                </span>
              </>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {doc.difficulty && (
              <span
                style={{
                  fontSize: "11px",
                  color: T.textMuted,
                  background: "rgba(255,255,255,0.025)",
                  border: `1px solid ${T.border}`,
                  borderRadius: "6px",
                  padding: "5px 10px",
                }}
              >
                {doc.difficulty}
              </span>
            )}

            {doc.updatedAt && (
              <span
                style={{
                  fontSize: "11px",
                  color: T.textMuted,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Clock size={11} style={{ opacity: 0.7 }} />
                {doc.updatedAt}
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            color: hov ? T.textBright : "#d7deea",
            fontWeight: 700,
            fontSize: "17px",
            lineHeight: "1.5",
            marginBottom: shortDescription ? "12px" : "18px",
            transition: "color 0.15s",
            maxWidth: "1100px",
          }}
        >
          {doc.title}
        </div>

        {shortDescription && (
          <div
            style={{
              color: hov ? "#9db0c9" : T.textMuted,
              fontSize: "13px",
              lineHeight: "1.85",
              marginBottom: "18px",
              maxWidth: "980px",
              transition: "color 0.15s",
            }}
          >
            {shortDescription}
          </div>
        )}

        <div
          style={{
            borderTop: `1px solid ${T.border}`,
            paddingTop: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {doc.tags?.slice(0, 6).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "10px",
                  color: T.textMuted,
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${T.border}`,
                  borderRadius: "6px",
                  padding: "5px 10px",
                  letterSpacing: "0.02em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: hov ? T.textBright : T.textMuted,
              letterSpacing: "0.05em",
              transition: "color 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            read note →
          </div>
        </div>
      </div>
    </button>
  );
}
