import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X } from "lucide-react";
import { T } from "../constants/theme";
import { nodeToText } from "../utils/textHelpers";
import { slugify } from "../toc";
import { CodeBlock } from "./CodeBlock";

export function Markdown({ content }) {
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lb.open]);

  useEffect(() => {
    if (!lb.open) return;
    const handler = (e) => {
      if (e.key === "Escape") setLb({ open: false, src: "", alt: "" });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lb.open]);

  const baseStyle = {
    fontFamily: T.mono,
    color: T.text,
    lineHeight: "1.85",
    fontSize: "14px",
  };

  const Heading = ({ level, children }) => {
    const { id, visibleText, hasExplicit } = makeId(children);

    const [color, prefix, size, mt] =
      level === 1
        ? [T.textBright, null, "22px", "0"]
        : level === 2
          ? [
              T.textBright,
              <span key="p" style={{ color: T.acc, marginRight: "8px", opacity: 0.8 }}>
                #
              </span>,
              "17px",
              "32px",
            ]
          : level === 3
            ? [
                T.text,
                <span key="p" style={{ color: T.blue, marginRight: "8px", opacity: 0.7 }}>
                  ##
                </span>,
                "15px",
                "22px",
              ]
            : [
                T.textMuted,
                <span key="p" style={{ color: T.textDim, marginRight: "8px" }}>
                  ###
                </span>,
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

  const shouldWrapCodeBlock = (language) => {
    const lang = String(language || "").toLowerCase();
    const noWrap = new Set([
      "bash",
      "sh",
      "shell",
      "zsh",
      "powershell",
      "ps1",
      "cmd",
      "terminal",
      "console",
    ]);
    return !noWrap.has(lang);
  };

  return (
    <div style={baseStyle}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },

          h1({ children }) {
            return <Heading level={1}>{children}</Heading>;
          },
          h2({ children }) {
            return <Heading level={2}>{children}</Heading>;
          },
          h3({ children }) {
            return <Heading level={3}>{children}</Heading>;
          },
          h4({ children }) {
            return <Heading level={4}>{children}</Heading>;
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
                    color: T.acc,
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
                  e.currentTarget.style.color = T.textBright;
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
                  borderLeft: `3px solid ${T.acc}`,
                  background: T.accDim,
                  padding: "12px 18px",
                  margin: "16px 0",
                  borderRadius: "0 3px 3px 0",
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
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                {children}
              </td>
            );
          },

          img({ src, alt }) {
            const imgSrc = String(src || "");
            const imgAlt = String(alt || "");
            return (
              <button
                type="button"
                onClick={() => setLb({ open: true, src: imgSrc, alt: imgAlt })}
                style={{
                  display: "block",
                  width: "100%",
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                  borderRadius: "3px",
                  overflow: "hidden",
                  cursor: "zoom-in",
                  padding: 0,
                  margin: "20px 0",
                }}
              >
                <img
                  src={imgSrc}
                  alt={imgAlt}
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
            const language = match?.[1];

            if (inline) {
              return (
                <code
                  style={{
                    fontFamily: T.mono,
                    background: "rgba(0,0,0,0.35)",
                    border: `1px solid ${T.border}`,
                    borderRadius: "3px",
                    padding: "1px 6px",
                    fontSize: "0.9em",
                    color: T.acc,
                    whiteSpace: "break-spaces",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  {raw}
                </code>
              );
            }

            if (!language && !trimmed.includes("\n") && trimmed.trim().length <= 120) {
              return (
                <code
                  style={{
                    display: "inline-flex",
                    fontFamily: T.mono,
                    background: "#030507",
                    border: `1px solid ${T.border}`,
                    borderRadius: "3px",
                    padding: "3px 10px",
                    fontSize: "0.88em",
                    color: T.acc,
                    maxWidth: "100%",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    overflowX: "hidden",
                  }}
                >
                  {trimmed.trim()}
                </code>
              );
            }

            return (
              <CodeBlock
                code={raw}
                language={language}
                wrap={shouldWrapCodeBlock(language)}
              />
            );
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
            background: "rgba(0,0,0,0.9)",
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
                color: T.textMuted,
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
                borderRadius: "4px",
                border: `1px solid ${T.border}`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
