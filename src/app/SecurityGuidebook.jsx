import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Fuse from "fuse.js";
import {
  Search,
  Menu,
  X,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Shield,
  Crosshair,
  Hash,
  Download,
  Terminal,
  Clock,
  Home,
} from "lucide-react";
import { buildToc, slugify } from "./toc.js";
import { loadContentBilingual } from "./contentLoader.js";
import { exportAsPDF, exportAsMD } from "./utils/exportDoc.js";

const SITE = {
  name: "Red/Blue Field Manual",
  authorLabel: "Bonus1337",
  repoUrl: "https://github.com/Bonus1337/field-manual",
};

const UI = {
  pl: {
    search: 'szukaj… ("/")',
    edit: "Edytuj",
    updated: "Updated",
    difficulty: "Lvl",
    fallback: "Brak tej wersji językowej - pokazuję dostępną.",
    onThisPage: "NA TEJ STRONIE",
    next: "next",
    prev: "prev",
    start: "PINNED",
    home: "HOME",
  },
  en: {
    search: 'search… ("/")',
    edit: "Edit",
    updated: "Updated",
    difficulty: "Lvl",
    fallback: "No translation available - showing other language.",
    onThisPage: "ON THIS PAGE",
    next: "next",
    prev: "prev",
    start: "PINNED",
    home: "HOME",
  },
};

const T = {
  bg: "#07090f",
  bgSidebar: "#04060a",
  bgCard: "#0c1018",
  bgCardHover: "#111827",
  bgHeader: "#05070c",
  border: "#1a2636",
  borderHover: "#253850",
  red: "#ff3a5c",
  redDim: "rgba(255,58,92,0.10)",
  redBorder: "rgba(255,58,92,0.35)",
  redGlow: "0 0 16px rgba(255,58,92,0.18), 0 0 4px rgba(255,58,92,0.12)",
  blue: "#38bdf8",
  blueDim: "rgba(56,189,248,0.08)",
  blueBorder: "rgba(56,189,248,0.30)",
  blueGlow: "0 0 16px rgba(56,189,248,0.15), 0 0 4px rgba(56,189,248,0.10)",
  gen: "#22c55e",
  genDim: "rgba(34,197,94,0.07)",
  genBorder: "rgba(34,197,94,0.25)",
  genGlow: "0 0 16px rgba(34,197,94,0.12)",
  amber: "#f59e0b",
  cyan: "#a5f3fc",
  text: "#8b9cb5",
  textBright: "#e2e8f0",
  textMuted: "#3d5068",
  textDim: "#1e2d3d",
  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
};

function ts(team) {
  if (team === "red")
    return {
      color: T.red,
      dim: T.redDim,
      border: T.redBorder,
      glow: T.redGlow,
      label: "RED",
      Icon: Crosshair,
    };
  if (team === "blue")
    return {
      color: T.blue,
      dim: T.blueDim,
      border: T.blueBorder,
      glow: T.blueGlow,
      label: "BLUE",
      Icon: Shield,
    };
  return {
    color: T.gen,
    dim: T.genDim,
    border: T.genBorder,
    glow: T.genGlow,
    label: "GEN",
    Icon: Hash,
  };
}

function nodeToText(node) {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (typeof node === "object" && node.props?.children)
    return nodeToText(node.props.children);
  return "";
}

function titleize(s = "") {
  return s
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseSortableDate(v) {
  if (!v) return 0;
  const t = Date.parse(String(v));
  return Number.isNaN(t) ? 0 : t;
}

function sortDocsByDateAscThenTitle(a, b) {
  const da = parseSortableDate(a?.updatedAt);
  const db = parseSortableDate(b?.updatedAt);
  if (da !== db) return da - db;
  return String(a?.title || "").localeCompare(String(b?.title || ""));
}

function sortByDateDesc(a, b) {
  return parseSortableDate(b?.updatedAt) - parseSortableDate(a?.updatedAt);
}

const DIFF_ORDER = {
  portswigger: ["apprentice", "practitioner", "expert"],
  tryhackme: ["easy", "medium", "hard"],
};

const DIFF_LABEL = {
  apprentice: "Apprentice",
  practitioner: "Practitioner",
  expert: "Expert",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

function normalizeDifficulty(v) {
  return v ? String(v).trim().toLowerCase() : "unrated";
}

function labelDifficulty(v) {
  const k = normalizeDifficulty(v);
  return DIFF_LABEL[k] || titleize(k);
}

function sortByDifficulty(platform, a, b) {
  const order = DIFF_ORDER[platform] || [];
  const va = order.indexOf(normalizeDifficulty(a));
  const vb = order.indexOf(normalizeDifficulty(b));
  if ((va === -1 ? 999 : va) !== (vb === -1 ? 999 : vb)) {
    return (va === -1 ? 999 : va) - (vb === -1 ? 999 : vb);
  }
  return String(a || "").localeCompare(String(b || ""));
}

function normalizeTopic(v) {
  return String(v || "misc")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "");
}

const PINNED_ORDER = ["manifesto", "about"];
const PINNED_SET = new Set(PINNED_ORDER);

function useIsDesktop() {
  const QUERY = "(min-width: 1024px)";

  const snap = () =>
    typeof globalThis !== "undefined" && globalThis.matchMedia
      ? globalThis.matchMedia(QUERY).matches
      : true;

  const subscribe = (cb) => {
    const mql = globalThis.matchMedia(QUERY);
    const h = () => cb();

    if (mql.addEventListener) {
      mql.addEventListener("change", h);
      return () => mql.removeEventListener("change", h);
    }

    mql.addListener(h);
    return () => mql.removeListener(h);
  };

  return React.useSyncExternalStore(subscribe, snap, () => true);
}

function CodeBlock({ code, language }) {
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

function Markdown({ content }) {
  const usedIds = {};

  const makeId = (children) => {
    const text = nodeToText(children).trim();
    const m = text.match(/\s*\{#([a-z0-9\-_]+)\}\s*$/i);
    const visibleText = m ? text.replace(m[0], "").trim() : text;
    const baseId = m ? m[1] : slugify(visibleText);
    const prev = usedIds[baseId] ?? 0;
    usedIds[baseId] = prev + 1;

    return {
      id: prev > 0 ? `${baseId}-${prev + 1}` : baseId,
      visibleText,
      hasExplicit: Boolean(m),
    };
  };

  const [lb, setLb] = useState({ open: false, src: "", alt: "" });

  useEffect(() => {
    if (!lb.open) return;
    const p = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = p;
    };
  }, [lb.open]);

  useEffect(() => {
    if (!lb.open) return;
    const fn = (e) => {
      if (e.key === "Escape") setLb({ open: false, src: "", alt: "" });
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [lb.open]);

  const s = {
    fontFamily: T.mono,
    color: T.text,
    lineHeight: "1.85",
    fontSize: "14px",
  };

  const H = ({ level, children }) => {
    const { id, visibleText, hasExplicit } = makeId(children);

    const [color, prefix, size, mt] =
      level === 1
        ? [T.textBright, null, "22px", "0"]
        : level === 2
          ? [
              T.textBright,
              <span style={{ color: T.gen, marginRight: "8px", opacity: 0.9 }}>#</span>,
              "17px",
              "32px",
            ]
          : level === 3
            ? [
                T.text,
                <span style={{ color: T.blue, marginRight: "8px", opacity: 0.8 }}>
                  ##
                </span>,
                "15px",
                "22px",
              ]
            : [
                T.text,
                <span style={{ color: T.textMuted, marginRight: "8px" }}>###</span>,
                "14px",
                "18px",
              ];

    const Tag = `h${level}`;

    return (
      <Tag
        id={id}
        style={{
          color,
          fontFamily: T.mono,
          fontSize: size,
          fontWeight: level <= 2 ? 700 : 600,
          margin: `${mt} 0 10px`,
          paddingBottom: level === 1 ? "10px" : 0,
          borderBottom: level === 1 ? `1px solid ${T.border}` : "none",
          scrollMarginTop: "100px",
          display: "flex",
          alignItems: "baseline",
          gap: 0,
        }}
      >
        {prefix}
        {hasExplicit ? visibleText : children}
      </Tag>
    );
  };

  return (
    <div style={s}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },
          h1({ children }) {
            return <H level={1}>{children}</H>;
          },
          h2({ children }) {
            return <H level={2}>{children}</H>;
          },
          h3({ children }) {
            return <H level={3}>{children}</H>;
          },
          h4({ children }) {
            return <H level={4}>{children}</H>;
          },
          p({ children }) {
            return (
              <p style={{ color: T.text, lineHeight: "1.85", margin: "12px 0" }}>
                {children}
              </p>
            );
          },
          ul({ children }) {
            return (
              <ul style={{ margin: "12px 0", paddingLeft: 0, listStyle: "none" }}>
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol style={{ margin: "12px 0", paddingLeft: "18px", color: T.text }}>
                {children}
              </ol>
            );
          },
          li({ children, ordered }) {
            return ordered ? (
              <li style={{ color: T.text, margin: "5px 0", lineHeight: "1.7" }}>
                {children}
              </li>
            ) : (
              <li
                style={{
                  color: T.text,
                  margin: "5px 0",
                  display: "flex",
                  gap: "8px",
                  lineHeight: "1.7",
                }}
              >
                <span
                  style={{
                    color: T.gen,
                    flexShrink: 0,
                    marginTop: "1px",
                    fontSize: "12px",
                  }}
                >
                  ›
                </span>
                <span style={{ flex: 1 }}>{children}</span>
              </li>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: T.blue,
                  textDecoration: "none",
                  borderBottom: `1px solid ${T.blueBorder}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#7dd3fc";
                  e.currentTarget.style.borderBottomColor = T.blue;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = T.blue;
                  e.currentTarget.style.borderBottomColor = T.blueBorder;
                }}
              >
                {children}
              </a>
            );
          },
          strong({ children }) {
            return (
              <strong style={{ color: T.textBright, fontWeight: 700 }}>{children}</strong>
            );
          },
          em({ children }) {
            return <em style={{ color: T.amber, fontStyle: "italic" }}>{children}</em>;
          },
          hr() {
            return (
              <hr
                style={{
                  border: "none",
                  borderTop: `1px solid ${T.border}`,
                  margin: "28px 0",
                }}
              />
            );
          },
          blockquote({ children }) {
            return (
              <blockquote
                style={{
                  borderLeft: `3px solid ${T.amber}`,
                  background: "rgba(245,158,11,0.06)",
                  padding: "12px 18px",
                  margin: "16px 0",
                  borderRadius: "0 4px 4px 0",
                }}
              >
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div style={{ overflowX: "auto", margin: "16px 0" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: T.mono,
                    fontSize: "13px",
                  }}
                >
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th
                style={{
                  color: T.textBright,
                  fontWeight: 600,
                  padding: "8px 14px",
                  background: T.bgCard,
                  borderBottom: `1px solid ${T.border}`,
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td
                style={{
                  color: T.text,
                  padding: "8px 14px",
                  borderBottom: `1px solid ${T.textDim}`,
                }}
              >
                {children}
              </td>
            );
          },
          img({ src, alt }) {
            const s2 = String(src || "");
            const a = String(alt || "");
            return (
              <button
                type="button"
                onClick={() => setLb({ open: true, src: s2, alt: a })}
                style={{
                  display: "block",
                  width: "100%",
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                  borderRadius: "6px",
                  overflow: "hidden",
                  cursor: "zoom-in",
                  padding: 0,
                  margin: "20px 0",
                }}
              >
                <img
                  src={s2}
                  alt={a}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  loading="lazy"
                />
              </button>
            );
          },
          code({ inline, className, children }) {
            const raw = String(children ?? "");
            const trimmed = raw.replace(/\n$/, "");
            const match = /language-([\w-]+)/.exec(className || "");

            if (inline) {
              return (
                <code
                  style={{
                    fontFamily: T.mono,
                    background: "rgba(0,0,0,0.4)",
                    border: `1px solid ${T.border}`,
                    borderRadius: "3px",
                    padding: "1px 6px",
                    fontSize: "0.9em",
                    color: T.cyan,
                  }}
                >
                  {raw}
                </code>
              );
            }

            if (!match?.[1] && !trimmed.includes("\n") && trimmed.trim().length <= 120) {
              return (
                <code
                  style={{
                    display: "inline-flex",
                    fontFamily: T.mono,
                    background: "#030507",
                    border: `1px solid ${T.border}`,
                    borderRadius: "4px",
                    padding: "3px 10px",
                    fontSize: "0.88em",
                    color: T.cyan,
                    overflowX: "auto",
                    maxWidth: "100%",
                  }}
                >
                  {trimmed.trim()}
                </code>
              );
            }

            return <CodeBlock code={raw} language={match?.[1]} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>

      {lb.open && (
        <div
          onClick={() => setLb({ open: false, src: "", alt: "" })}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLb({ open: false, src: "", alt: "" })}
              style={{
                position: "absolute",
                top: "-14px",
                right: "-14px",
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: T.text,
              }}
            >
              <X size={13} />
            </button>

            <img
              src={lb.src}
              alt={lb.alt}
              style={{
                maxWidth: "94vw",
                maxHeight: "90vh",
                borderRadius: "6px",
                border: `1px solid ${T.border}`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ArticleCard({ doc, onGoDoc }) {
  const [hov, setHov] = useState(false);
  const m = ts(doc.team);
  const shortDescription = String(doc.shortDescription || "").trim();

  return (
    <button
      onClick={() => onGoDoc(doc.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: hov
          ? "linear-gradient(180deg, rgba(12,16,24,1) 0%, rgba(9,13,21,1) 100%)"
          : "linear-gradient(180deg, rgba(10,14,22,1) 0%, rgba(7,10,17,1) 100%)",
        border: `1px solid ${hov ? m.border : T.border}`,
        borderLeft: `3px solid ${hov ? m.color : m.border}`,
        borderRadius: "12px",
        padding: "26px 28px",
        cursor: "pointer",
        transition: "all 0.18s ease",
        boxShadow: hov
          ? m.glow
          : "0 10px 30px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.02)",
        fontFamily: T.mono,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            hov && doc.team === "red"
              ? "linear-gradient(90deg, rgba(255,58,92,0.06) 0%, transparent 18%)"
              : hov && doc.team === "blue"
                ? "linear-gradient(90deg, rgba(56,189,248,0.05) 0%, transparent 18%)"
                : hov
                  ? "linear-gradient(90deg, rgba(34,197,94,0.04) 0%, transparent 18%)"
                  : "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              minWidth: 0,
            }}
          >
            <m.Icon size={12} style={{ color: m.color }} />

            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.14em",
                fontWeight: 700,
                color: m.color,
              }}
            >
              {m.label}
            </span>

            {doc.category && (
              <>
                <span style={{ color: T.textDim, fontSize: "10px" }}>·</span>
                <span
                  style={{
                    fontSize: "11px",
                    color: T.textMuted,
                    letterSpacing: "0.05em",
                  }}
                >
                  {doc.category}
                </span>
              </>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {doc.difficulty && (
              <span
                style={{
                  fontSize: "11px",
                  color: T.textMuted,
                  background: "rgba(255,255,255,0.025)",
                  border: `1px solid ${T.border}`,
                  borderRadius: "6px",
                  padding: "5px 10px",
                }}
              >
                {doc.difficulty}
              </span>
            )}

            {doc.updatedAt && (
              <span
                style={{
                  fontSize: "11px",
                  color: T.textMuted,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Clock size={11} style={{ opacity: 0.7 }} />
                {doc.updatedAt}
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            color: hov ? T.textBright : "#d7deea",
            fontWeight: 700,
            fontSize: "17px",
            lineHeight: "1.5",
            marginBottom: shortDescription ? "12px" : "18px",
            transition: "color 0.15s",
            maxWidth: "1100px",
          }}
        >
          {doc.title}
        </div>

        {shortDescription && (
          <div
            style={{
              color: hov ? "#9db0c9" : T.textMuted,
              fontSize: "13px",
              lineHeight: "1.85",
              marginBottom: "18px",
              maxWidth: "980px",
              transition: "color 0.15s",
            }}
          >
            {shortDescription}
          </div>
        )}

        <div
          style={{
            borderTop: `1px solid ${T.border}`,
            paddingTop: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {doc.tags?.slice(0, 6).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "10px",
                  color: T.textMuted,
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${T.border}`,
                  borderRadius: "6px",
                  padding: "5px 10px",
                  letterSpacing: "0.02em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: hov ? T.textBright : T.textMuted,
              letterSpacing: "0.05em",
              transition: "color 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            read note →
          </div>
        </div>
      </div>
    </button>
  );
}

function HomeView({ docs, onGoDoc }) {
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

function DocButton({ item, isActive, onGoDoc }) {
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

export default function SecurityGuidebook() {
  const { lang, id } = useParams();
  const navigate = useNavigate();

  const mainRef = useRef(null);
  const articleRef = useRef(null);
  const exportRef = useRef(null);

  const [activeTocId, setActiveTocId] = useState(null);
  const [tocItems, setTocItems] = useState([]);
  const [exportOpen, setExportOpen] = useState(false);

  const safeLang = lang === "en" ? "en" : "pl";
  const t = UI[safeLang];
  const isDesktop = useIsDesktop();
  const isHome = !id || id === "home";

  useEffect(() => {
    const fid = "jb-mono-font";
    if (document.getElementById(fid)) return;

    const lk = document.createElement("link");
    lk.id = fid;
    lk.rel = "stylesheet";
    lk.href =
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(lk);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : true
  );

  const [query, setQuery] = useState("");
  const [openSections, setOpenSections] = useState({});
  const [openGroups, setOpenGroups] = useState({});

  const isSearching = Boolean(query.trim());
  const sidebarOpenEffective = isDesktop ? true : sidebarOpen;

  useEffect(() => {
    document.documentElement.style.colorScheme = "dark";
    document.body.style.background = T.bg;
  }, []);

  useEffect(() => {
    if (isDesktop) return;
    const p = document.body.style.overflow;
    if (sidebarOpenEffective) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = p;
    };
  }, [sidebarOpenEffective, isDesktop]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const el = document.getElementById("kb-search");
        if (el && document.activeElement !== el) {
          e.preventDefault();
          el.focus();
        }
      }

      if (e.key === "Escape") {
        const el = document.getElementById("kb-search");
        if (el && document.activeElement === el) el.blur();
        if (!isDesktop && sidebarOpenEffective) setSidebarOpen(false);
        setExportOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDesktop, sidebarOpenEffective]);

  useEffect(() => {
    if (!exportOpen) return;

    const h = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false);
      }
    };

    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [exportOpen]);

  const { map, canon } = useMemo(() => loadContentBilingual(), []);

  const sidebarItems = useMemo(() => {
    const items = [];

    for (const base of canon) {
      const pair = map.get(base.id);
      const loc = pair ? pair[safeLang] || pair.pl || pair.en : base;
      items.push(loc);
    }

    return items;
  }, [canon, map, safeLang]);

  const pair = map.get(id) || null;
  const doc = pair ? pair[safeLang] || pair.pl || pair.en : null;
  const isFallback = pair ? !pair[safeLang] : false;

  useEffect(() => {
    if (!id && canon?.length) {
      navigate(`/${safeLang}/doc/home`, { replace: true });
    }
  }, [id, canon, navigate, safeLang]);

  useEffect(() => {
    if (id && id !== "home" && !doc && canon?.length) {
      navigate(`/${safeLang}/doc/home`, { replace: true });
    }
  }, [doc, canon, safeLang, navigate, id]);

  const fuse = useMemo(
    () =>
      new Fuse(sidebarItems, {
        keys: ["title", "category", "tags", "content"],
        threshold: 0.35,
      }),
    [sidebarItems]
  );

  const filtered = useMemo(
    () => (query.trim() ? fuse.search(query).map((r) => r.item) : sidebarItems),
    [query, fuse, sidebarItems]
  );

  const { sectionsList, pathByDocId, pinned } = useMemo(() => {
    const secMap = new Map();
    const path = new Map();
    const pinnedDocs = [];

    const ensureSection = (secKey, payload) => {
      if (!secMap.has(secKey)) {
        secMap.set(secKey, {
          key: secKey,
          team: payload.team,
          sectionLabel: payload.sectionLabel,
          platform: "other",
          subs: new Map(),
          groups: new Map(),
          writeups: null,
        });
      }
      return secMap.get(secKey);
    };

    const ensureSub = (sec, subLabel) => {
      const subKey = subLabel || "__root__";
      const groupKey = `${sec.key}::sub::${subKey}`;

      if (!sec.subs.has(subKey)) {
        sec.subs.set(subKey, {
          key: groupKey,
          label: subLabel,
          items: [],
          kind: "docs",
          countOverride: null,
        });
      }

      return sec.subs.get(subKey);
    };

    for (const d of filtered) {
      if (PINNED_SET.has(d.id)) {
        pinnedDocs.push(d);
        continue;
      }

      const nav = d.nav || null;
      const isPS = nav?.root === "portswigger";
      const isTHM = nav?.root === "tryhackme";
      const isWU = Boolean(nav?.isWriteup);

      let sectionLabel = d.category || "General";
      let subLabel = "";

      if (isPS) {
        sectionLabel = "PortSwigger";
        subLabel = isWU ? "Writeups" : "Knowledge base";
      } else if (isTHM) {
        sectionLabel = "TryHackMe";
        subLabel = isWU ? "Writeups" : "Rooms";
      } else if (nav?.root && nav.root !== "general") {
        sectionLabel = titleize(nav.root);
        subLabel = d.category || "";
      } else {
        sectionLabel = d.category || "General";
        subLabel = "";
      }

      const secKey = `${d.team}::${sectionLabel}`;
      const sec = ensureSection(secKey, { team: d.team, sectionLabel });

      if (isPS && isWU) {
        sec.platform = "portswigger";
        const sub = ensureSub(sec, "Writeups");
        sub.kind = "portswigger-writeups";

        if (!sec.writeups) sec.writeups = { topics: new Map() };

        const topicRaw = (d.chapter || d.nav?.topic || d.category || "misc").trim();
        const topicSlug = normalizeTopic(topicRaw);
        const topicKey = `${secKey}::topic::${topicSlug}`;

        if (!sec.writeups.topics.has(topicKey)) {
          sec.writeups.topics.set(topicKey, {
            key: topicKey,
            label: titleize(topicRaw),
            diffs: new Map(),
          });
        }

        const topic = sec.writeups.topics.get(topicKey);
        const diffKey = normalizeDifficulty(d.difficulty);
        const diffGroupKey = `${topicKey}::diff::${diffKey}`;

        if (!topic.diffs.has(diffKey)) {
          topic.diffs.set(diffKey, {
            key: diffGroupKey,
            label: labelDifficulty(diffKey),
            raw: diffKey,
            items: [],
          });
        }

        topic.diffs.get(diffKey).items.push(d);
        sub.countOverride = (sub.countOverride ?? 0) + 1;

        path.set(d.id, {
          secKey,
          subKey: sub.key,
          parentKey: topicKey,
          groupKey: diffGroupKey,
        });

        continue;
      }

      if (isTHM && isWU) {
        sec.platform = "tryhackme";
        const diffKey = normalizeDifficulty(d.difficulty);
        const groupKey = `${secKey}::diff::${diffKey}`;

        if (!sec.groups.has(diffKey)) {
          sec.groups.set(diffKey, {
            key: groupKey,
            label: labelDifficulty(diffKey),
            raw: diffKey,
            items: [],
          });
        }

        sec.groups.get(diffKey).items.push(d);
        path.set(d.id, { secKey, groupKey });
        continue;
      }

      const sub = ensureSub(sec, subLabel);
      sub.items.push(d);
      path.set(d.id, { secKey, groupKey: sub.key });
    }

    const order = { neutral: 0, blue: 1, red: 2 };

    const out = Array.from(secMap.values()).sort((a, b) => {
      const t2 = (order[a.team] ?? 9) - (order[b.team] ?? 9);
      return t2 !== 0 ? t2 : a.sectionLabel.localeCompare(b.sectionLabel);
    });

    for (const sec of out) {
      const subsArr = Array.from(sec.subs.values()).sort((a, b) =>
        (a.label || "").localeCompare(b.label || "")
      );

      for (const sub of subsArr) {
        if (sub.kind === "docs") sub.items.sort(sortDocsByDateAscThenTitle);
      }

      sec.subsArr = subsArr;

      const groupsArr = Array.from(sec.groups.values()).sort((a, b) =>
        sortByDifficulty(sec.platform, a.raw, b.raw)
      );

      for (const g of groupsArr) g.items.sort(sortDocsByDateAscThenTitle);
      sec.groupsArr = groupsArr;

      if (sec.writeups?.topics) {
        const topicsArr = Array.from(sec.writeups.topics.values()).sort((a, b) =>
          (a.label || "").localeCompare(b.label || "")
        );

        for (const topic of topicsArr) {
          const diffsArr = Array.from(topic.diffs.values()).sort((a, b) =>
            sortByDifficulty("portswigger", a.raw, b.raw)
          );

          for (const g of diffsArr) g.items.sort(sortDocsByDateAscThenTitle);
          topic.diffsArr = diffsArr;
        }

        sec.writeups.topicsArr = topicsArr;
      }
    }

    pinnedDocs.sort(
      (a, b) =>
        PINNED_ORDER.indexOf(a.id) - PINNED_ORDER.indexOf(b.id) ||
        a.title.localeCompare(b.title)
    );

    return { sectionsList: out, pathByDocId: path, pinned: pinnedDocs };
  }, [filtered]);

  const activePath = doc?.id ? pathByDocId.get(doc.id) || null : null;

  useEffect(() => {
    if (!activePath?.secKey) return;

    const raf = requestAnimationFrame(() => {
      setOpenSections((prev) =>
        activePath.secKey in prev ? prev : { ...prev, [activePath.secKey]: true }
      );

      setOpenGroups((prev) => {
        let next = prev;

        for (const k of [
          activePath.subKey,
          activePath.parentKey,
          activePath.groupKey,
        ].filter(Boolean)) {
          if (!(k in next)) {
            next = next === prev ? { ...prev } : next;
            next[k] = true;
          }
        }

        return next;
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [
    activePath?.secKey,
    activePath?.subKey,
    activePath?.parentKey,
    activePath?.groupKey,
  ]);

  const canonSortedByDate = useMemo(
    () => [...canon].sort(sortDocsByDateAscThenTitle),
    [canon]
  );

  const docIndex = useMemo(
    () => canonSortedByDate.findIndex((d) => d.id === (doc?.id ?? "")),
    [canonSortedByDate, doc]
  );

  const prevDoc = docIndex > 0 ? canonSortedByDate[docIndex - 1] : null;
  const nextDoc =
    docIndex >= 0 && docIndex < canonSortedByDate.length - 1
      ? canonSortedByDate[docIndex + 1]
      : null;

  const onSwitchLang = useCallback(() => {
    navigate(`/${safeLang === "pl" ? "en" : "pl"}/doc/${id || "home"}`, {
      replace: false,
    });
    if (!isDesktop) setSidebarOpen(false);
  }, [navigate, safeLang, id, isDesktop]);

  const onGoDoc = useCallback(
    (docId2) => {
      navigate(`/${safeLang}/doc/${docId2}`);

      if (mainRef.current) {
        mainRef.current.scrollTo({ top: 0, behavior: "auto" });
      }

      if (!isDesktop) setSidebarOpen(false);
    },
    [navigate, safeLang, isDesktop]
  );

  const toggleSection = useCallback((k) => {
    setOpenSections((p) => ({ ...p, [k]: !p[k] }));
  }, []);

  const toggleGroup = useCallback((k) => {
    setOpenGroups((p) => ({ ...p, [k]: !p[k] }));
  }, []);

  const handleExportPdf = useCallback(() => {
    if (!doc) return;
    exportAsPDF(doc, articleRef);
    setExportOpen(false);
  }, [doc]);

  const handleExportMd = useCallback(() => {
    if (!doc) return;
    exportAsMD(doc);
    setExportOpen(false);
  }, [doc]);

  const editUrl = doc ? `${SITE.repoUrl}/blob/main/${doc.sourcePath}` : SITE.repoUrl;
  const docMeta = ts(doc?.team);

  useEffect(() => {
    if (!doc || isHome) return;

    const raf = requestAnimationFrame(() => {
      const article = articleRef.current;

      if (!article) {
        setTocItems([]);
        setActiveTocId(null);
        return;
      }

      const headings = Array.from(article.querySelectorAll("h1,h2,h3,h4"));

      if (!headings.length) {
        try {
          setTocItems(buildToc(doc.content) || []);
        } catch {
          setTocItems([]);
        }
        setActiveTocId(null);
        return;
      }

      const items = headings
        .map((el) => {
          const text = (el.textContent || "").trim();
          const hid = el.getAttribute("id");
          return text && hid ? { id: hid, text } : null;
        })
        .filter(Boolean);

      setTocItems(items);
      setActiveTocId(items[0]?.id ?? null);
    });

    return () => cancelAnimationFrame(raf);
  }, [doc?.id, doc?.content, isHome]);

  useEffect(() => {
    const root = mainRef.current;
    const article = articleRef.current;
    if (!root || !article || !tocItems.length) return;

    const onScroll = () => {
      const targets = tocItems
        .map((tci) => ({
          id: tci.id,
          el: article.querySelector(`#${CSS.escape(tci.id)}`),
        }))
        .filter((t) => t.el);

      if (!targets.length) return;

      const threshold = root.getBoundingClientRect().top + 100;
      let active = targets[0].id;

      for (const { id: tid, el } of targets) {
        if (el.getBoundingClientRect().top <= threshold) active = tid;
      }

      setActiveTocId(active);
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => root.removeEventListener("scroll", onScroll);
  }, [tocItems, doc?.id]);

  const scrollToHeading = useCallback((hid) => {
    const root = mainRef.current;
    const article = articleRef.current;
    if (!root || !article) return;

    const el = article.querySelector(`#${CSS.escape(hid)}`);
    if (!el) return;

    const top =
      el.getBoundingClientRect().top -
      root.getBoundingClientRect().top +
      root.scrollTop -
      96;

    root.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  const renderDocList = (items) =>
    items.map((item) => (
      <DocButton
        key={item.id}
        item={item}
        isActive={item.id === doc?.id}
        onGoDoc={onGoDoc}
      />
    ));

  const GroupToggle = ({ label, count, isOpen, onToggle, indentLevel = 0 }) => (
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

  const sidebarBg = T.bgSidebar;

  return (
    <div
      style={{
        height: "100dvh",
        width: "100%",
        background: T.bg,
        color: T.textBright,
        fontFamily: T.mono,
        display: "flex",
      }}
    >
      {!isDesktop && sidebarOpenEffective && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 30,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      <aside
        style={{
          position: isDesktop ? "static" : "fixed",
          inset: isDesktop ? "auto" : "0 auto 0 0",
          zIndex: isDesktop ? "auto" : 40,
          width: "272px",
          flexShrink: 0,
          background: sidebarBg,
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          transform: sidebarOpenEffective ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease",
        }}
      >
        <div
          style={{
            padding: "16px 16px 12px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => onGoDoc("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: `1px solid ${T.border}`,
                background: T.bgCard,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Terminal size={15} style={{ color: T.gen }} />
            </div>

            <div style={{ textAlign: "left", minWidth: 0 }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: T.textBright,
                  fontFamily: T.mono,
                }}
              >
                field-manual
              </div>
              <div style={{ fontSize: "10px", color: T.textMuted }}>
                by {SITE.authorLabel}
              </div>
            </div>
          </button>

          {!isDesktop && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.textMuted,
                padding: "4px",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ padding: "12px 12px 8px", flexShrink: 0 }}>
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <Search
              size={13}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: T.textMuted,
                pointerEvents: "none",
              }}
            />

            <input
              id="kb-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              style={{
                width: "100%",
                padding: "7px 10px 7px 30px",
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: "4px",
                color: T.textBright,
                fontFamily: T.mono,
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
                caretColor: T.gen,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = T.borderHover)}
              onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
            />
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            {[
              { label: safeLang === "pl" ? "EN" : "PL", onClick: onSwitchLang },
              { label: "GitHub", href: SITE.repoUrl },
            ].map((b) =>
              b.href ? (
                <a
                  key={b.label}
                  href={b.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    padding: "5px 8px",
                    borderRadius: "4px",
                    border: `1px solid ${T.border}`,
                    background: "transparent",
                    color: T.textMuted,
                    fontFamily: T.mono,
                    fontSize: "10px",
                    textDecoration: "none",
                    letterSpacing: "0.06em",
                    transition: "color 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.textBright)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
                >
                  {b.label}
                </a>
              ) : (
                <button
                  key={b.label}
                  onClick={b.onClick}
                  style={{
                    flex: 1,
                    padding: "5px 8px",
                    borderRadius: "4px",
                    border: `1px solid ${T.border}`,
                    background: "transparent",
                    color: T.textMuted,
                    fontFamily: T.mono,
                    fontSize: "10px",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    transition: "color 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.textBright)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
                >
                  {b.label}
                </button>
              )
            )}
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 8px 24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <button
              onClick={() => onGoDoc("home")}
              style={{
                width: "100%",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "7px 10px",
                borderRadius: "4px",
                background: isHome ? "rgba(255,255,255,0.04)" : "none",
                borderLeft: `2px solid ${isHome ? T.gen : "transparent"}`,
                border: "none",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <Home
                size={12}
                style={{ color: isHome ? T.gen : T.textMuted, flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: "11px",
                  color: isHome ? T.textBright : T.textMuted,
                  fontFamily: T.mono,
                  letterSpacing: "0.08em",
                }}
              >
                FEED
              </span>
            </button>
          </div>

          {pinned?.length ? (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  padding: "0 10px 6px",
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  color: T.textMuted,
                  fontWeight: 600,
                }}
              >
                {t.start}
              </div>

              {pinned.map((item) => (
                <DocButton
                  key={item.id}
                  item={item}
                  isActive={item.id === doc?.id}
                  onGoDoc={onGoDoc}
                />
              ))}
            </div>
          ) : null}

          {sectionsList.map((sec) => {
            const m2 = ts(sec.team);
            const isOpen = isSearching ? true : Boolean(openSections[sec.key]);

            return (
              <div key={sec.key} style={{ marginBottom: "18px" }}>
                <button
                  onClick={() => toggleSection(sec.key)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "5px 10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontFamily: T.mono,
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
                      size={11}
                      style={{
                        color: T.textMuted,
                        transition: "transform 0.15s",
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        flexShrink: 0,
                      }}
                    />

                    <span
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.14em",
                        fontWeight: 700,
                        color: T.textMuted,
                        textTransform: "uppercase",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sec.sectionLabel}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      fontWeight: 700,
                      color: m2.color,
                      flexShrink: 0,
                      background: `${m2.color}18`,
                      border: `1px solid ${m2.border}`,
                      borderRadius: "3px",
                      padding: "2px 5px",
                    }}
                  >
                    {m2.label}
                  </span>
                </button>

                {isOpen && (
                  <div style={{ paddingLeft: "4px" }}>
                    {sec.subsArr?.map((sub) => {
                      const subOpen = isSearching ? true : Boolean(openGroups[sub.key]);
                      const isPsWU = sub.kind === "portswigger-writeups";

                      return (
                        <div key={sub.key}>
                          {sub.label ? (
                            <GroupToggle
                              label={sub.label}
                              count={sub.countOverride ?? sub.items.length}
                              isOpen={subOpen}
                              onToggle={() => toggleGroup(sub.key)}
                              indentLevel={0}
                            />
                          ) : null}

                          {(sub.label ? subOpen : true) && (
                            <div style={{ paddingLeft: sub.label ? "12px" : "0" }}>
                              {!isPsWU && renderDocList(sub.items)}

                              {isPsWU &&
                                sec.writeups?.topicsArr?.map((topic) => {
                                  const topicOpen = isSearching
                                    ? true
                                    : Boolean(openGroups[topic.key]);

                                  return (
                                    <div key={topic.key}>
                                      <GroupToggle
                                        label={topic.label}
                                        count={
                                          topic.diffsArr?.reduce(
                                            (a, g) => a + g.items.length,
                                            0
                                          ) ?? 0
                                        }
                                        isOpen={topicOpen}
                                        onToggle={() => toggleGroup(topic.key)}
                                        indentLevel={0}
                                      />

                                      {topicOpen &&
                                        topic.diffsArr?.map((g) => {
                                          const gOpen = isSearching
                                            ? true
                                            : Boolean(openGroups[g.key]);

                                          return (
                                            <div
                                              key={g.key}
                                              style={{ paddingLeft: "10px" }}
                                            >
                                              <GroupToggle
                                                label={g.label}
                                                count={g.items.length}
                                                isOpen={gOpen}
                                                onToggle={() => toggleGroup(g.key)}
                                                indentLevel={0}
                                              />

                                              {gOpen && (
                                                <div style={{ paddingLeft: "10px" }}>
                                                  {renderDocList(g.items)}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {sec.groupsArr?.map((g) => {
                      const gOpen = isSearching ? true : Boolean(openGroups[g.key]);

                      return (
                        <div key={g.key}>
                          <GroupToggle
                            label={g.label}
                            count={g.items.length}
                            isOpen={gOpen}
                            onToggle={() => toggleGroup(g.key)}
                          />
                          {gOpen && (
                            <div style={{ paddingLeft: "16px" }}>
                              {renderDocList(g.items)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div
          style={{
            padding: "10px 14px 12px",
            borderTop: `1px solid ${T.border}`,
            flexShrink: 0,
            fontSize: "10px",
            color: T.textMuted,
            fontFamily: T.mono,
          }}
        >
          <span style={{ color: T.gen }}>$</span> built by{" "}
          <span style={{ color: T.text }}>{SITE.authorLabel}</span>
        </div>
      </aside>

      <main
        ref={mainRef}
        style={{
          flex: 1,
          height: "100dvh",
          overflowY: "auto",
          minWidth: 0,
          background: T.bg,
        }}
      >
        {!isHome && (
          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              borderBottom: `1px solid ${T.border}`,
              background: T.bgHeader,
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  minWidth: 0,
                }}
              >
                {!isDesktop && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    style={{
                      background: T.bgCard,
                      border: `1px solid ${T.border}`,
                      borderRadius: "4px",
                      padding: "6px 8px",
                      cursor: "pointer",
                      color: T.textMuted,
                      display: "flex",
                    }}
                  >
                    <Menu size={16} />
                  </button>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexShrink: 0,
                    background: docMeta.dim,
                    border: `1px solid ${docMeta.border}`,
                    borderRadius: "4px",
                    padding: "3px 9px",
                  }}
                >
                  <docMeta.Icon size={12} style={{ color: docMeta.color }} />
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: docMeta.color,
                      letterSpacing: "0.12em",
                    }}
                  >
                    {docMeta.label}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: T.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {doc?.title}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flexShrink: 0,
                }}
              >
                <div style={{ position: "relative" }} ref={exportRef}>
                  <button
                    onClick={() => setExportOpen((v) => !v)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      border: `1px solid ${exportOpen ? T.borderHover : T.border}`,
                      background: exportOpen ? T.bgCard : "transparent",
                      color: T.textMuted,
                      fontFamily: T.mono,
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    <Download size={12} />
                    <span className="hidden-sm">export</span>
                  </button>

                  {exportOpen && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 6px)",
                        zIndex: 50,
                        background: T.bgCard,
                        border: `1px solid ${T.border}`,
                        borderRadius: "6px",
                        overflow: "hidden",
                        minWidth: "160px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div
                        style={{
                          padding: "8px 12px 6px",
                          fontSize: "9px",
                          letterSpacing: "0.12em",
                          color: T.textMuted,
                          borderBottom: `1px solid ${T.border}`,
                          fontWeight: 600,
                        }}
                      >
                        EXPORT NOTE
                      </div>

                      <button
                        onClick={handleExportPdf}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "9px 14px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: T.mono,
                          fontSize: "12px",
                          color: T.text,
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = T.bgCardHover)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        📄 PDF / Print
                      </button>

                      <button
                        onClick={handleExportMd}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "9px 14px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: T.mono,
                          fontSize: "12px",
                          color: T.text,
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = T.bgCardHover)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        ⬇ Raw Markdown
                      </button>
                    </div>
                  )}
                </div>

                <a
                  href={editUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: `1px solid ${T.border}`,
                    background: "transparent",
                    color: T.textMuted,
                    fontFamily: T.mono,
                    fontSize: "11px",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.textBright)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
                >
                  <span className="hidden-sm">{t.edit}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </header>
        )}

        {isHome && !isDesktop && (
          <div
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: "4px",
                padding: "6px 8px",
                cursor: "pointer",
                color: T.textMuted,
                display: "flex",
              }}
            >
              <Menu size={16} />
            </button>

            <span style={{ fontSize: "13px", color: T.textMuted, fontFamily: T.mono }}>
              field-manual
            </span>
          </div>
        )}

        {isHome ? (
          <HomeView docs={sidebarItems} onGoDoc={onGoDoc} />
        ) : doc ? (
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "32px 24px 48px",
              display: "grid",
              gridTemplateColumns: isDesktop ? "1fr 240px" : "1fr",
              gap: "40px",
            }}
          >
            <article ref={articleRef} style={{ minWidth: 0 }}>
              {isFallback && (
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "10px 16px",
                    background: "rgba(245,158,11,0.07)",
                    border: `1px solid rgba(245,158,11,0.25)`,
                    borderRadius: "5px",
                    fontSize: "12px",
                    color: T.amber,
                    fontFamily: T.mono,
                  }}
                >
                  ⚠ {t.fallback}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "24px",
                }}
              >
                {doc.updatedAt && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      color: T.textMuted,
                      background: T.bgCard,
                      border: `1px solid ${T.border}`,
                      borderRadius: "4px",
                      padding: "3px 8px",
                    }}
                  >
                    <Clock size={10} /> {t.updated}: {doc.updatedAt}
                  </span>
                )}

                {doc.difficulty && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: T.textMuted,
                      background: T.bgCard,
                      border: `1px solid ${T.border}`,
                      borderRadius: "4px",
                      padding: "3px 8px",
                    }}
                  >
                    {t.difficulty}: {doc.difficulty}
                  </span>
                )}

                {doc.tags?.length ? (
                  <span
                    style={{
                      fontSize: "11px",
                      color: T.textMuted,
                      background: T.bgCard,
                      border: `1px solid ${T.border}`,
                      borderRadius: "4px",
                      padding: "3px 8px",
                    }}
                  >
                    {doc.tags.join(" · ")}
                  </span>
                ) : null}
              </div>

              <Markdown content={doc.content} />

              <div
                style={{
                  marginTop: "48px",
                  paddingTop: "20px",
                  borderTop: `1px solid ${T.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                {[
                  { doc: prevDoc, label: `← ${t.prev}`, align: "left" },
                  { doc: nextDoc, label: `${t.next} →`, align: "right" },
                ].map(({ doc: d, label, align }) => (
                  <button
                    key={label}
                    disabled={!d}
                    onClick={() => d && onGoDoc(d.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: align === "right" ? "flex-end" : "flex-start",
                      gap: "3px",
                      padding: "10px 14px",
                      borderRadius: "5px",
                      border: `1px solid ${T.border}`,
                      background: d ? "transparent" : "none",
                      cursor: d ? "pointer" : "not-allowed",
                      opacity: d ? 1 : 0.35,
                      fontFamily: T.mono,
                      transition: "border-color 0.12s",
                      maxWidth: "45%",
                    }}
                    onMouseEnter={(e) => {
                      if (d) e.currentTarget.style.borderColor = T.borderHover;
                    }}
                    onMouseLeave={(e) => {
                      if (d) e.currentTarget.style.borderColor = T.border;
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: T.textMuted,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {label}
                    </span>

                    {d && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: T.text,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "100%",
                        }}
                      >
                        {d.title}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </article>

            <aside style={{ display: isDesktop ? "block" : "none" }}>
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
                  {t.onThisPage}
                </div>

                <div
                  style={{
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1px",
                  }}
                >
                  {tocItems.length === 0 ? (
                    <span style={{ fontSize: "12px", color: T.textMuted }}>-</span>
                  ) : (
                    tocItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        style={{
                          textAlign: "left",
                          padding: "5px 8px",
                          borderRadius: "4px",
                          background:
                            activeTocId === item.id
                              ? "rgba(255,255,255,0.04)"
                              : "transparent",
                          borderLeft: `2px solid ${
                            activeTocId === item.id ? T.gen : "transparent"
                          }`,
                          border: "none",
                          outline: "none",
                          cursor: "pointer",
                          fontFamily: T.mono,
                          fontSize: "12px",
                          color: activeTocId === item.id ? T.textBright : T.textMuted,
                          transition: "all 0.1s",
                          lineHeight: "1.35",
                        }}
                        onMouseEnter={(e) => {
                          if (activeTocId !== item.id) {
                            e.currentTarget.style.color = T.text;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeTocId !== item.id) {
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
            </aside>
          </div>
        ) : null}
      </main>
    </div>
  );
}
