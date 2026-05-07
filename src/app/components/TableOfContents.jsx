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
          fontFamily: T.mono,
          fontSize: "9px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: T.textDim,
          marginBottom: "14px",
          paddingBottom: "10px",
          borderBottom: `1px solid ${T.border}`,
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
          <span
            style={{
              fontFamily: T.mono,
              fontSize: "11px",
              color: T.textDim,
            }}
          >
            -
          </span>
        ) : (
          items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onScrollTo(item.id)}
                style={{
                  textAlign: "left",
                  padding: "5px 10px",
                  background: isActive ? T.accDim : "transparent",
                  borderLeft: `2px solid ${isActive ? T.acc : "transparent"}`,
                  borderTop: "none",
                  borderRight: "none",
                  borderBottom: "none",
                  borderRadius: "0 2px 2px 0",
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: T.mono,
                  fontSize: "11px",
                  color: isActive ? T.textBright : T.textMuted,
                  lineHeight: 1.45,
                  transition: "color 0.1s, background 0.1s, border-color 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = T.text;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = T.textMuted;
                }}
              >
                {item.text}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
