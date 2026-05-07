import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { T } from "../constants/theme";

export function GroupToggle({ label, count, isOpen, onToggle, indentLevel = 0 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `5px ${8 + indentLevel * 8}px 5px ${10 + indentLevel * 8}px`,
        background: hovered ? "rgba(255,255,255,0.02)" : "none",
        border: "none",
        borderRadius: "2px",
        cursor: "pointer",
        fontFamily: T.mono,
        transition: "background 0.1s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          minWidth: 0,
        }}
      >
        <ChevronRight
          size={10}
          style={{
            color: isOpen ? T.acc : T.textMuted,
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.15s, color 0.12s",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: "11px",
            color: isOpen ? T.text : hovered ? T.text : T.textMuted,
            fontWeight: isOpen ? 500 : 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            transition: "color 0.12s",
          }}
        >
          {label}
        </span>
      </div>

      <span
        style={{
          fontFamily: T.mono,
          fontSize: "9px",
          color: isOpen ? T.textMuted : T.textDim,
          flexShrink: 0,
          marginLeft: "6px",
          transition: "color 0.12s",
        }}
      >
        {count}
      </span>
    </button>
  );
}
