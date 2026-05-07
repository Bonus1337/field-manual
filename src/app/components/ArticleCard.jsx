import React, { useMemo, useState } from "react";
import { T, ts, normalizeTeam } from "../constants/theme";
import { UI } from "../constants/config";

function getDocDomain(doc) {
  return doc?.domain || doc?.nav?.root || doc?.category || "general";
}
function getDocSection(doc) {
  return doc?.section || doc?.nav?.group || doc?.nav?.sub || "";
}
function prettyLabel(value) {
  const raw = String(value || "")
    .replace(/^\d+_/, "")
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .trim();
  if (!raw) return "";
  return raw
    .split(" ")
    .map((w) => {
      const l = w.toLowerCase();
      if (l === "cti") return "CTI";
      if (l === "soc") return "SOC";
      if (l === "osint") return "OSINT";
      if (l === "ejpt") return "eJPT";
      if (l === "xss") return "XSS";
      if (l === "sqli") return "SQLi";
      if (l === "csrf") return "CSRF";
      if (l === "ai") return "AI";
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}
function getDomainLabel(copy, domain) {
  return copy?.domainLabels?.[domain] || prettyLabel(domain);
}
function getDiffColor(d) {
  const v = String(d || "").toLowerCase();
  if (v === "easy" || v === "apprentice") return T.acc;
  if (v === "medium" || v === "practitioner") return T.amber;
  if (v === "hard" || v === "expert") return T.red;
  return T.textMuted;
}
function getReadingEstimate(doc) {
  const raw =
    doc?.content ||
    doc?.body ||
    doc?.markdown ||
    doc?.shortDescription ||
    doc?.title ||
    "";
  return Math.max(
    1,
    Math.ceil(String(raw).trim().split(/\s+/).filter(Boolean).length / 220)
  );
}

export function ArticleCard({ doc, onGoDoc, safeLang = "pl" }) {
  const [hovered, setHovered] = useState(false);

  const copy = UI?.[safeLang]?.homeView || UI.pl.homeView;
  const domain = getDocDomain(doc);
  const section = getDocSection(doc);
  const teamMeta = ts(normalizeTeam(doc?.team));
  const tags = Array.isArray(doc?.tags) ? doc.tags.slice(0, 7) : [];
  const minutes = useMemo(() => getReadingEstimate(doc), [doc]);
  const domainLabel = getDomainLabel(copy, domain);
  const sectionLabel = prettyLabel(section);
  const dateStr = String(doc?.updatedAt || doc?.date || "").slice(0, 10);

  return (
    <div
      onClick={() => onGoDoc(doc.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "22px 0",
        borderBottom: `1px solid ${T.border}`,
        cursor: "pointer",
        transition: "background 0.12s",
        fontFamily: T.mono,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "9px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            padding: "2px 7px",
            borderRadius: "2px",
            color: teamMeta.color,
            border: `1px solid ${teamMeta.border}`,
            background: teamMeta.dim,
          }}
        >
          {teamMeta.label.toLowerCase()}
        </span>

        <span
          style={{
            fontSize: "10px",
            color: T.textMuted,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {domainLabel}
        </span>

        {sectionLabel && (
          <>
            <span style={{ color: T.textDim, fontSize: "9px" }}>·</span>
            <span
              style={{
                fontSize: "10px",
                color: T.textDim,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {sectionLabel}
            </span>
          </>
        )}

        {doc.difficulty && (
          <>
            <span style={{ color: T.textDim, fontSize: "9px" }}>·</span>
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.06em",
                color: getDiffColor(doc.difficulty),
                textTransform: "lowercase",
              }}
            >
              {doc.difficulty}
            </span>
          </>
        )}

        <span
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "10px", color: T.textMuted }}>{minutes} min</span>
          {dateStr && (
            <span style={{ fontSize: "9px", color: T.textDim }}>{dateStr}</span>
          )}
        </span>
      </div>

      <div
        style={{
          fontSize: "17px",
          fontWeight: 600,
          lineHeight: 1.45,
          letterSpacing: "-0.015em",
          marginBottom: doc.shortDescription ? "8px" : tags.length ? "10px" : "0",
          color: hovered ? T.textBright : T.text,
          transition: "color 0.12s",
          maxWidth: "860px",
        }}
      >
        {doc.title}
      </div>

      {doc.shortDescription && (
        <div
          style={{
            fontSize: "13px",
            color: T.textMuted,
            lineHeight: 1.75,
            marginBottom: tags.length ? "12px" : "0",
            maxWidth: "760px",
          }}
        >
          {doc.shortDescription}
        </div>
      )}

      {tags.length > 0 && (
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "9px",
                color: T.textMuted,
                padding: "2px 7px",
                border: `1px solid ${T.border}`,
                borderRadius: "2px",
                letterSpacing: "0.02em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
