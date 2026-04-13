import React, { useState, useMemo } from "react";
import { T } from "../constants/theme";
import { PINNED_SET } from "../constants/config";
import { sortByDateDesc } from "../utils/sorting";
import { ArticleCard } from "./ArticleCard";

export function HomeView({ docs, onGoDoc }) {
  const [filter, setFilter] = useState("all");

  const nonPinned = useMemo(() => docs.filter((d) => !PINNED_SET.has(d.id)), [docs]);

  const platforms = useMemo(() => {
    const s = new Set();
    nonPinned.forEach((d) => {
      if (d.nav?.root && d.nav.root !== "general") s.add(d.nav.root);
    });
    return Array.from(s).sort();
  }, [nonPinned]);

  const filters = [
    { key: "all", label: "ALL" },
    { key: "red", label: "RED" },
    { key: "blue", label: "BLUE" },
    ...platforms.map((p) => ({ key: p, label: p.toUpperCase() })),
  ];

  const visible = useMemo(() => {
    const all = [...nonPinned].sort(sortByDateDesc);

    if (filter === "all") return all;
    if (filter === "red" || filter === "blue") {
      return all.filter((d) => d.team === filter);
    }

    return all.filter(
      (d) => d.nav?.root === filter || d.category?.toLowerCase() === filter
    );
  }, [nonPinned, filter]);

  const stats = useMemo(
    () => ({
      total: nonPinned.length,
      red: nonPinned.filter((d) => d.team === "red").length,
      blue: nonPinned.filter((d) => d.team === "blue").length,
    }),
    [nonPinned]
  );

  return (
    <div style={{ minHeight: "100%", background: T.bg, fontFamily: T.mono }}>
      <div
        style={{
          padding: "48px 36px 34px",
          borderBottom: `1px solid ${T.border}`,
          background:
            "linear-gradient(180deg, rgba(56,189,248,0.03) 0%, rgba(255,58,92,0.02) 35%, transparent 75%)",
        }}
      >
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div
            style={{
              color: T.textMuted,
              fontSize: "11px",
              marginBottom: "10px",
              letterSpacing: "0.06em",
            }}
          >
            <span style={{ color: T.gen }}>$</span>{" "}
            <span style={{ color: T.textMuted }}>cat /field-manual/feed.md</span>
          </div>

          <h1
            style={{
              color: T.textBright,
              fontSize: "28px",
              fontWeight: 700,
              margin: "0 0 10px",
              fontFamily: T.mono,
              letterSpacing: "-0.01em",
            }}
          >
            Red/Blue Field Manual
          </h1>

          <p
            style={{
              color: T.textMuted,
              fontSize: "13px",
              margin: "0 0 30px",
              maxWidth: "760px",
              lineHeight: "1.7",
            }}
          >
            Offensive &amp; defensive security notes - web application security, pentest
            workflow, CTF writeups, eJPT prep, mindset i praktyczne case-study.
          </p>

          <div style={{ display: "flex", gap: "36px", flexWrap: "wrap" }}>
            {[
              { label: "dokumenty", val: stats.total, color: T.textBright },
              { label: "red team", val: stats.red, color: T.red },
              { label: "blue team", val: stats.blue, color: T.blue },
            ].map((s2) => (
              <div
                key={s2.label}
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: s2.color,
                    fontFamily: T.mono,
                  }}
                >
                  {s2.val}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    color: T.textMuted,
                    letterSpacing: "0.12em",
                  }}
                >
                  {s2.label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "16px 36px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        {filters.map((f) => {
          const active = filter === f.key;
          const accent = f.key === "red" ? T.red : f.key === "blue" ? T.blue : T.gen;

          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "10px",
                letterSpacing: "0.1em",
                fontFamily: T.mono,
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.12s",
                border: `1px solid ${
                  active
                    ? f.key === "red"
                      ? T.redBorder
                      : f.key === "blue"
                        ? T.blueBorder
                        : T.borderHover
                    : T.border
                }`,
                background: active
                  ? f.key === "red"
                    ? T.redDim
                    : f.key === "blue"
                      ? T.blueDim
                      : "rgba(255,255,255,0.04)"
                  : "transparent",
                color: active
                  ? ["red", "blue"].includes(f.key)
                    ? accent
                    : T.textBright
                  : T.textMuted,
              }}
            >
              {f.label}
            </button>
          );
        })}

        <span
          style={{
            marginLeft: "auto",
            fontSize: "11px",
            color: T.textMuted,
            display: "flex",
            alignItems: "center",
          }}
        >
          {visible.length} result{visible.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div style={{ padding: "30px 36px 52px", maxWidth: "1180px", margin: "0 auto" }}>
        {visible.length === 0 ? (
          <div
            style={{
              color: T.textMuted,
              fontSize: "13px",
              padding: "48px 0",
              textAlign: "center",
            }}
          >
            <span style={{ color: T.gen }}>$</span> find . -name "*.md"{" "}
            <span style={{ color: T.red }}>→ 0 results</span>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {visible.map((doc) => (
              <ArticleCard key={doc.id} doc={doc} onGoDoc={onGoDoc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
