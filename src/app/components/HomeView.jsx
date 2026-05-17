import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Crosshair, Layers3, Radar, Shield, Terminal } from "lucide-react";
import { T, ts, normalizeTeam, getAccentByDomain } from "../constants/theme";
import { UI, PINNED_SET } from "../constants/config";
import { sortByDateDesc } from "../utils/sorting";
import { ArticleCard } from "./ArticleCard";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);

    update();
    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function normalizeDomainKey(value) {
  return String(value || "general")
    .replace(/^\d+_/, "")
    .trim()
    .toLowerCase();
}

function getDocDomain(doc) {
  return normalizeDomainKey(doc?.domain || doc?.nav?.root || doc?.category || "general");
}

function prettyLabel(value) {
  const raw = String(value || "")
    .replace(/^\d+_/, "")
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .trim();

  if (!raw) return "General";

  return raw
    .split(" ")
    .map((w) => {
      const l = w.toLowerCase();
      if (l === "cti") return "CTI";
      if (l === "soc") return "SOC";
      if (l === "osint") return "OSINT";
      if (l === "ejpt") return "eJPT";
      if (l === "ai") return "AI";
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

function getDomainLabel(copy, domain) {
  return copy?.domainLabels?.[domain] || prettyLabel(domain);
}

function getTeamVisual(key) {
  if (key === "all") {
    return {
      key: "all",
      label: "All",
      color: T.acc,
      dim: T.accDim,
      border: T.accBorder,
    };
  }

  return ts(key);
}

function getFeatured(docs) {
  return [...docs].sort(sortByDateDesc)[0];
}

function RecentItem({ doc, copy, onGoDoc }) {
  const [hovered, setHovered] = useState(false);
  const domain = getDocDomain(doc);
  const team = ts(normalizeTeam(doc.team));

  return (
    <div
      onClick={() => onGoDoc(doc.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: 0,
        padding: "12px 0",
        borderBottom: `1px solid ${T.border}`,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          minWidth: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "4px",
        }}
      >
        <span
          style={{
            minWidth: 0,
            fontFamily: T.mono,
            fontSize: "9px",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: T.textMuted,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {getDomainLabel(copy, domain)}
        </span>

        <span
          style={{
            flexShrink: 0,
            fontFamily: T.mono,
            fontSize: "9px",
            fontWeight: 600,
            color: team.color,
          }}
        >
          {team.label.toLowerCase()}
        </span>
      </div>

      <div
        style={{
          minWidth: 0,
          fontSize: "12px",
          fontWeight: 500,
          lineHeight: 1.45,
          color: hovered ? T.textBright : T.text,
          transition: "color 0.12s",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {doc.title}
      </div>

      {doc.readingTime && (
        <div style={{ fontSize: "10px", color: T.textMuted, marginTop: "3px" }}>
          {doc.readingTime} min
        </div>
      )}
    </div>
  );
}

function PathCard({
  num,
  heading,
  desc,
  cta,
  onClick,
  isLast = false,
  isMobile = false,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: 0,
        padding: isMobile ? "22px 0" : "26px 28px",
        cursor: "pointer",
        background: hovered ? T.bgCard : "transparent",
        transition: "background 0.12s",
        borderRight: isMobile || isLast ? "none" : `1px solid ${T.border}`,
        borderBottom: isMobile && !isLast ? `1px solid ${T.border}` : "none",
      }}
    >
      <div
        style={{
          fontFamily: T.mono,
          fontSize: isMobile ? "34px" : "36px",
          fontWeight: 500,
          color: hovered ? T.border : T.textDim,
          lineHeight: 1,
          marginBottom: "14px",
          transition: "color 0.12s",
        }}
      >
        {num}
      </div>

      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: T.textBright,
          marginBottom: "6px",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {heading}
      </div>

      <div
        style={{
          fontSize: "11px",
          color: T.textMuted,
          lineHeight: 1.65,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {desc}
      </div>

      <div
        style={{
          fontFamily: T.mono,
          fontSize: "10px",
          marginTop: "14px",
          color: hovered ? T.acc : T.textMuted,
          transition: "color 0.1s",
        }}
      >
        {cta}
      </div>
    </div>
  );
}

function TeamTab({ f, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const meta = getTeamVisual(f.key);
  const color = f.key === "all" ? T.acc : meta.color;
  const Icon = f.Icon;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        fontFamily: T.mono,
        fontSize: "10px",
        letterSpacing: "0.04em",
        color: active ? color : hovered ? T.text : T.textMuted,
        padding: "4px 14px 14px",
        background: "none",
        border: "none",
        borderBottom: `2px solid ${active ? color : "transparent"}`,
        cursor: "pointer",
        transition: "color 0.1s, border-color 0.1s",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        whiteSpace: "nowrap",
      }}
    >
      {Icon && <Icon size={11} />}
      {f.label}
    </button>
  );
}

function DomainChip({ label, count, active, accent, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: T.mono,
        fontSize: "10px",
        padding: "3px 10px",
        marginRight: "4px",
        flexShrink: 0,
        border: `1px solid ${active ? accent + "55" : hovered ? T.borderHover : T.border}`,
        background: active ? accent + "12" : "transparent",
        color: active ? accent : hovered ? T.text : T.textMuted,
        cursor: "pointer",
        borderRadius: "2px",
        transition: "all 0.1s",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      <span style={{ opacity: 0.45, fontSize: "9px" }}>{count}</span>
    </button>
  );
}

export function HomeView({ docs, onGoDoc, safeLang = "pl" }) {
  const isMobile = useIsMobile();

  const copy = UI?.[safeLang]?.homeView || UI.pl.homeView;
  const isPl = safeLang === "pl";

  const [teamFilter, setTeamFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");

  const nonPinned = useMemo(() => docs.filter((d) => !PINNED_SET.has(d.id)), [docs]);
  const sortedDocs = useMemo(() => [...nonPinned].sort(sortByDateDesc), [nonPinned]);
  const featured = useMemo(() => getFeatured(sortedDocs), [sortedDocs]);
  const feedDocs = useMemo(() => [...docs].sort(sortByDateDesc), [docs]);

  const recentDocs = useMemo(
    () => sortedDocs.filter((d) => d.id !== featured?.id).slice(0, 4),
    [sortedDocs, featured]
  );

  const domainGroups = useMemo(() => {
    const map = new Map();

    feedDocs.forEach((doc) => {
      const d = getDocDomain(doc);
      if (!map.has(d)) map.set(d, []);
      map.get(d).push(doc);
    });

    return Array.from(map.entries()).sort(([a], [b]) => {
      const na = String(a).match(/^(\d+)/)?.[1];
      const nb = String(b).match(/^(\d+)/)?.[1];

      if (na && nb) return Number(na) - Number(nb);

      return String(a).localeCompare(String(b));
    });
  }, [feedDocs]);

  const visible = useMemo(
    () =>
      feedDocs.filter((doc) => {
        const tMatch = teamFilter === "all" || normalizeTeam(doc.team) === teamFilter;
        const dMatch = domainFilter === "all" || getDocDomain(doc) === domainFilter;

        return tMatch && dMatch;
      }),
    [feedDocs, teamFilter, domainFilter]
  );

  const teamFilters = [
    { key: "all", label: copy.all, Icon: null },
    { key: "red", label: copy.redTeam, Icon: Crosshair },
    { key: "blue", label: copy.blueTeam, Icon: Shield },
    { key: "red-blue", label: copy.redBlue, Icon: Radar },
    { key: "neutral", label: copy.neutral, Icon: Layers3 },
  ];

  const featuredDomain = featured ? getDocDomain(featured) : "general";
  const featuredTeamMeta = ts(normalizeTeam(featured?.team));
  const activeLabel =
    domainFilter === "all" ? copy.allDomains : getDomainLabel(copy, domainFilter);

  const paths = [
    {
      num: "01",
      heading: isPl ? "Zaczynam od zera" : "Starting from scratch",
      desc: isPl
        ? "Fundamenty, mindset i pierwsze pojęcia bez zakładania że cokolwiek wiesz."
        : "Foundations, mindset, and first concepts - no prior knowledge assumed.",
      cta: "start here →",
      onClick: () => {
        setDomainFilter("start-here");
        setTeamFilter("all");
      },
    },
    {
      num: "02",
      heading: isPl ? "Interesuje mnie atak" : "I'm interested in offense",
      desc: isPl
        ? "Web security, pentesting, podatności, Burp Suite, laby PortSwigger."
        : "Web security, pentesting, vulnerabilities, Burp Suite, labs.",
      cta: "red team path →",
      onClick: () => {
        setTeamFilter("red");
        setDomainFilter("all");
      },
    },
    {
      num: "03",
      heading: isPl ? "Interesuje mnie obrona" : "I'm interested in defense",
      desc: isPl
        ? "SOC, phishing, Wazuh, SIEM, detekcja i incident response."
        : "SOC, phishing, Wazuh, SIEM, detection, and incident response.",
      cta: "blue team path →",
      onClick: () => {
        setTeamFilter("blue");
        setDomainFilter("all");
      },
    },
  ];

  return (
    <div
      style={{
        background: T.bg,
        fontFamily: T.mono,
        minHeight: "100%",
        color: T.text,
        minWidth: 0,
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          padding: isMobile ? "10px 16px" : "10px 36px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "11px",
          color: T.textMuted,
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <Terminal size={12} style={{ color: T.acc, flexShrink: 0 }} />
        <span style={{ color: T.acc }}>$</span>
        <span>{copy.command}</span>
        <span style={{ color: T.border, margin: "0 6px" }}>·</span>
        <span>{copy.mode}</span>
      </div>

      <section style={{ borderBottom: `1px solid ${T.border}` }}>
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            padding: isMobile ? "0 16px" : "0 36px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 290px",
            }}
          >
            <div
              style={{
                minWidth: 0,
                padding: isMobile ? "28px 0" : "40px 36px 40px 0",
                borderRight: isMobile ? "none" : `1px solid ${T.border}`,
                borderBottom: isMobile ? `1px solid ${T.border}` : "none",
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "10px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: T.acc,
                  marginBottom: "18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  minWidth: 0,
                  overflowWrap: "anywhere",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: "20px",
                    height: "1px",
                    background: T.acc,
                    flexShrink: 0,
                  }}
                />
                featured · {getDomainLabel(copy, featuredDomain).toLowerCase()}
              </div>

              <h1
                style={{
                  fontFamily: T.serif,
                  fontSize: isMobile ? "30px" : "clamp(28px, 3vw, 48px)",
                  fontWeight: 400,
                  color: T.textBright,
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  margin: "0 0 14px",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {featured?.title || copy.title}
              </h1>

              <p
                style={{
                  fontSize: "13px",
                  color: T.text,
                  lineHeight: 1.8,
                  maxWidth: "1600px",
                  marginBottom: "22px",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {featured?.shortDescription || copy.description}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: isMobile ? "stretch" : "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: T.mono,
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: featuredTeamMeta.color,
                    padding: "2px 7px",
                    border: `1px solid ${featuredTeamMeta.border}`,
                    background: featuredTeamMeta.dim,
                    borderRadius: "2px",
                  }}
                >
                  {featuredTeamMeta.label}
                </span>

                <span style={{ fontSize: "11px", color: T.textMuted }}>
                  {getDomainLabel(copy, featuredDomain)}
                </span>

                {featured?.readingTime && (
                  <>
                    <span style={{ color: T.textDim }}>·</span>
                    <span style={{ fontSize: "11px", color: T.textMuted }}>
                      {featured.readingTime} min
                    </span>
                  </>
                )}

                <button
                  onClick={() => featured && onGoDoc(featured.id)}
                  style={{
                    marginLeft: isMobile ? 0 : "auto",
                    width: isMobile ? "100%" : "auto",
                    marginTop: isMobile ? "8px" : 0,
                    fontFamily: T.mono,
                    fontSize: "11px",
                    letterSpacing: "0.06em",
                    color: T.bg,
                    background: T.acc,
                    border: "none",
                    padding: "8px 16px",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  {isPl ? "czytaj artykuł →" : "read article →"}
                </button>
              </div>
            </div>

            <div
              style={{
                minWidth: 0,
                padding: isMobile ? "22px 0" : "28px 0 28px 26px",
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "9px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: T.textMuted,
                  paddingBottom: "10px",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                {copy.recentlyUpdated}
              </div>

              {recentDocs.map((doc) => (
                <RecentItem key={doc.id} doc={doc} copy={copy} onGoDoc={onGoDoc} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ borderBottom: `1px solid ${T.border}` }}>
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            padding: isMobile ? "0 16px" : "0 36px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          }}
        >
          {paths.map((p, i) => (
            <PathCard
              key={p.num}
              {...p}
              isMobile={isMobile}
              isLast={i === paths.length - 1}
            />
          ))}
        </div>
      </section>

      <div style={{ borderBottom: `1px solid ${T.border}` }}>
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            padding: isMobile ? "0 16px" : "0 36px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: isMobile ? "flex-start" : "center",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "10px" : "0",
              paddingTop: "14px",
              borderBottom: `1px solid ${T.bgCard}`,
            }}
          >
            <span
              style={{
                fontFamily: T.mono,
                fontSize: "9px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: T.textMuted,
                marginRight: isMobile ? 0 : "16px",
                paddingBottom: isMobile ? 0 : "14px",
              }}
            >
              {copy.team}
            </span>

            <div
              style={{
                display: "flex",
                overflowX: "auto",
                width: "100%",
              }}
            >
              {teamFilters.map((f) => (
                <TeamTab
                  key={f.key}
                  f={f}
                  active={teamFilter === f.key}
                  onClick={() => setTeamFilter(f.key)}
                />
              ))}
            </div>

            <span
              style={{
                marginLeft: isMobile ? 0 : "auto",
                paddingBottom: "14px",
                fontFamily: T.mono,
                fontSize: "10px",
                color: T.textMuted,
              }}
            >
              {visible.length} {visible.length === 1 ? copy.result : copy.results}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingTop: "10px",
              paddingBottom: "14px",
              overflowX: "auto",
              gap: "0",
            }}
          >
            <span
              style={{
                fontFamily: T.mono,
                fontSize: "9px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: T.textMuted,
                marginRight: "14px",
                flexShrink: 0,
              }}
            >
              {copy.domain}
            </span>

            <DomainChip
              label={copy.allDomains}
              count={feedDocs.length}
              active={domainFilter === "all"}
              accent={T.acc}
              onClick={() => setDomainFilter("all")}
            />

            {domainGroups.map(([domain, items]) => {
              const normalizedDomain = normalizeDomainKey(domain);

              return (
                <DomainChip
                  key={normalizedDomain}
                  label={getDomainLabel(copy, normalizedDomain)}
                  count={items.length}
                  active={domainFilter === normalizedDomain}
                  accent={getAccentByDomain(normalizedDomain)}
                  onClick={() =>
                    setDomainFilter(
                      domainFilter === normalizedDomain ? "all" : normalizedDomain
                    )
                  }
                />
              );
            })}
          </div>
        </div>
      </div>

      <section
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: isMobile ? "28px 16px 80px" : "40px 56px 100px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "baseline",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "12px" : "0",
            marginBottom: "16px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: "9px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: T.textMuted,
                marginBottom: "5px",
              }}
            >
              {copy.currentFeed}
            </div>

            <h2
              style={{
                fontFamily: T.mono,
                fontSize: "18px",
                color: T.textBright,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                margin: 0,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {activeLabel}
            </h2>
          </div>

          {(domainFilter !== "all" || teamFilter !== "all") && (
            <button
              onClick={() => {
                setDomainFilter("all");
                setTeamFilter("all");
              }}
              style={{
                fontFamily: T.mono,
                fontSize: "10px",
                letterSpacing: "0.06em",
                color: T.textMuted,
                border: `1px solid ${T.border}`,
                background: "transparent",
                padding: "6px 12px",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              {copy.resetFilters} ×
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <div
            style={{
              color: T.textMuted,
              fontSize: "13px",
              padding: isMobile ? "42px 16px" : "60px 0",
              textAlign: "center",
              border: `1px dashed ${T.border}`,
              borderRadius: "4px",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <span style={{ color: T.acc }}>$</span> {copy.noResultsCommand}
              <span style={{ color: T.red }}> → {copy.noResults}</span>
            </div>

            <button
              onClick={() => {
                setDomainFilter("all");
                setTeamFilter("all");
              }}
              style={{
                fontFamily: T.mono,
                fontSize: "10px",
                letterSpacing: "0.06em",
                color: T.acc,
                border: `1px solid ${T.accBorder}`,
                background: T.accDim,
                padding: "8px 14px",
                cursor: "pointer",
                borderRadius: "2px",
                marginTop: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {copy.showEverything} <ArrowRight size={12} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            {visible.map((doc) => (
              <ArticleCard key={doc.id} doc={doc} onGoDoc={onGoDoc} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
