import React from "react";
import { ChevronRight } from "lucide-react";
import { T } from "../constants/theme";

export function GroupToggle({ label, count, isOpen, onToggle, indentLevel = 0 }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `6px ${8 + indentLevel * 8}px`,
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: T.mono,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
        <ChevronRight
          size={12}
          style={{
            color: T.textMuted,
            transition: "transform 0.15s",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: "11px",
            color: isOpen ? T.text : T.textMuted,
            fontWeight: isOpen ? 500 : 400,
            transition: "color 0.12s",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>

      <span
        style={{
          fontSize: "10px",
          color: T.textMuted,
          flexShrink: 0,
          marginLeft: "6px",
        }}
      >
        {count}
      </span>
    </button>
  );
}
