import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { T } from "../constants/theme";

export function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(code || "").trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* empty */
    }
  };

  return (
    <div
      style={{
        margin: "20px 0",
        borderRadius: "6px",
        border: `1px solid ${T.border}`,
        background: "#030507",
        overflow: "hidden",
        fontFamily: T.mono,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 14px",
          borderBottom: `1px solid ${T.border}`,
          background: T.bgCard,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{ color: "#ff5f57", fontSize: "9px" }}>●</span>
          <span style={{ color: "#febc2e", fontSize: "9px" }}>●</span>
          <span style={{ color: "#28c840", fontSize: "9px" }}>●</span>
          <span style={{ color: T.textMuted, fontSize: "11px", marginLeft: "8px" }}>
            {language || "bash"}
          </span>
        </div>

        <button
          onClick={onCopy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "3px 9px",
            borderRadius: "4px",
            border: `1px solid ${T.border}`,
            background: "transparent",
            color: T.textMuted,
            fontFamily: T.mono,
            fontSize: "11px",
            cursor: "pointer",
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = T.textBright)}
          onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "copied" : "copy"}
        </button>
      </div>

      <pre
        style={{
          overflowX: "auto",
          padding: "18px 20px",
          margin: 0,
          fontSize: "13px",
          lineHeight: "1.75",
        }}
      >
        <code style={{ fontFamily: T.mono, color: T.cyan }}>
          {String(code || "").trim()}
        </code>
      </pre>
    </div>
  );
}
