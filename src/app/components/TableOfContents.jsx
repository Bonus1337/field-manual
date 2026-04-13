import React from "react";
import { T } from "../constants/theme";

export function TableOfContents({ items, activeId, onScrollTo, label }) {
  return (
    <div
      style={{
        position: "sticky",
        top: "68px",
        maxHeight: "calc(100vh - 5rem)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontSize: "9px",
          letterSpacing: "0.14em",
          fontWeight: 700,
          color: T.textMuted,
          marginBottom: "12px",
          fontFamily: T.mono,
        }}
      >
        {label}
      </div>

      <div
        style={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1px",
        }}
      >
        {items.length === 0 ? (
          <span style={{ fontSize: "12px", color: T.textMuted }}>-</span>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => onScrollTo(item.id)}
              style={{
                textAlign: "left",
                padding: "5px 8px",
                borderRadius: "4px",
                background:
                  activeId === item.id ? "rgba(255,255,255,0.04)" : "transparent",
                borderLeft: `2px solid ${activeId === item.id ? T.gen : "transparent"}`,
                border: "none",
                outline: "none",
                cursor: "pointer",
                fontFamily: T.mono,
                fontSize: "12px",
                color: activeId === item.id ? T.textBright : T.textMuted,
                transition: "all 0.1s",
                lineHeight: "1.35",
              }}
              onMouseEnter={(e) => {
                if (activeId !== item.id) {
                  e.currentTarget.style.color = T.text;
                }
              }}
              onMouseLeave={(e) => {
                if (activeId !== item.id) {
                  e.currentTarget.style.color = T.textMuted;
                }
              }}
            >
              {item.text}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
