import React, { useState } from "react";
import { T, ts } from "../constants/theme";

export function DocButton({ item, isActive, onGoDoc }) {
  const [hov, setHov] = useState(false);
  const m = ts(item.team);

  return (
    <button
      onClick={() => onGoDoc(item.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        textAlign: "left",
        display: "block",
        padding: "7px 10px",
        cursor: "pointer",
        fontFamily: T.mono,
        outline: "none",
        border: "none",
        borderLeft: `2px solid ${isActive ? m.color : hov ? m.border : "transparent"}`,
        borderRadius: "0 3px 3px 0",

        background: isActive
          ? `${m.color}0f`
          : hov
            ? "rgba(255,255,255,0.025)"
            : "transparent",

        transition: "background 0.12s, border-color 0.12s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "5px",
          color: isActive ? T.textBright : hov ? T.text : T.textMuted,
          fontSize: "12px",
          lineHeight: "1.35",
          marginBottom: item.tags?.length ? "4px" : 0,
          transition: "color 0.12s",
        }}
      >
        {isActive && (
          <span
            style={{
              color: m.color,
              fontSize: "10px",
              flexShrink: 0,
            }}
          >
            ›
          </span>
        )}
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.title}
        </span>
      </div>

      {item.tags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "9px",
                color: T.textDim,
                letterSpacing: "0.04em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
