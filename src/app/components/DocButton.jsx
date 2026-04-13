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
        borderRadius: "4px",
        cursor: "pointer",
        background: isActive
          ? "rgba(255,255,255,0.04)"
          : hov
            ? "rgba(255,255,255,0.025)"
            : "transparent",
        borderLeft: `2px solid ${isActive ? m.color : hov ? m.border : "transparent"}`,
        border: "none",
        outline: "none",
        boxShadow: isActive
          ? `inset 0 0 0 0 transparent, -2px 0 8px ${m.color}22`
          : "none",
        fontFamily: T.mono,
        transition: "all 0.12s",
      }}
    >
      <div
        style={{
          color: isActive ? T.textBright : hov ? T.text : "#6b7e96",
          fontSize: "12px",
          lineHeight: "1.35",
          marginBottom: item.tags?.length ? "4px" : 0,
          transition: "color 0.12s",
        }}
      >
        {isActive && (
          <span style={{ color: m.color, marginRight: "5px", fontSize: "10px" }}>›</span>
        )}
        {item.title}
      </div>

      {item.tags?.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              style={{ fontSize: "9px", color: T.textMuted, letterSpacing: "0.04em" }}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}
