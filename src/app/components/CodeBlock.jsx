import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { T } from "../constants/theme";

export function CodeBlock({ code, language, wrap = false }) {
  const [copied, setCopied] = useState(false);

  const value = String(code || "").trim();

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
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
        maxWidth: "100%",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "8px 14px",
          borderBottom: `1px solid ${T.border}`,
          background: T.bgCard,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            minWidth: 0,
          }}
        >
          <span style={{ color: "#ff5f57", fontSize: "9px", flexShrink: 0 }}>●</span>
          <span style={{ color: "#febc2e", fontSize: "9px", flexShrink: 0 }}>●</span>
          <span style={{ color: "#28c840", fontSize: "9px", flexShrink: 0 }}>●</span>

          <span
            style={{
              color: T.textMuted,
              fontSize: "11px",
              marginLeft: "8px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {language || "text"}
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
            flexShrink: 0,
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
          padding: "18px 20px",
          margin: 0,
          fontSize: "13px",
          lineHeight: "1.75",
          maxWidth: "100%",
          minWidth: 0,

          overflowX: wrap ? "hidden" : "auto",
          whiteSpace: wrap ? "pre-wrap" : "pre",
          overflowWrap: wrap ? "anywhere" : "normal",
          wordBreak: wrap ? "break-word" : "normal",
        }}
      >
        <code
          style={{
            display: "block",
            fontFamily: T.mono,
            color: T.cyan,
            whiteSpace: "inherit",
            overflowWrap: "inherit",
            wordBreak: "inherit",
            minWidth: 0,
          }}
        >
          {value}
        </code>
      </pre>
    </div>
  );
}
