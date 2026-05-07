import React, { useMemo } from "react";
import { Search, X, ChevronRight, Home, Terminal } from "lucide-react";
import { T } from "../constants/theme";
import { SITE } from "../constants/config";
import { DocButton } from "./DocButton";
import { GroupToggle } from "./GroupToggle";

function normLabel(value = "") {
  return String(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function uniqueById(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function mergeSubsArr(a = [], b = []) {
  const map = new Map();
  [...a, ...b].forEach((sub) => {
    const key = sub.key || normLabel(sub.label) || sub.kind || "default";
    if (!map.has(key)) {
      map.set(key, { ...sub, items: [...(sub.items || [])] });
      return;
    }
    const ex = map.get(key);
    map.set(key, {
      ...ex,
      ...sub,
      items: uniqueById([...(ex.items || []), ...(sub.items || [])]),
      countOverride: ex.countOverride ?? sub.countOverride ?? undefined,
    });
  });
  return Array.from(map.values());
}

function mergeGroupsArr(a = [], b = []) {
  const map = new Map();
  [...a, ...b].forEach((group) => {
    const key = group.key || normLabel(group.label) || "default";
    if (!map.has(key)) {
      map.set(key, { ...group, items: [...(group.items || [])] });
      return;
    }
    const ex = map.get(key);
    map.set(key, {
      ...ex,
      ...group,
      items: uniqueById([...(ex.items || []), ...(group.items || [])]),
    });
  });
  return Array.from(map.values());
}

function mergeSections(sections = []) {
  const map = new Map();
  sections.forEach((sec) => {
    const key = normLabel(sec.sectionLabel || sec.key);
    if (!map.has(key)) {
      map.set(key, {
        ...sec,
        key,
        subsArr: [...(sec.subsArr || [])],
        groupsArr: [...(sec.groupsArr || [])],
        team: "neutral",
      });
      return;
    }
    const ex = map.get(key);
    map.set(key, {
      ...ex,
      ...sec,
      key,
      sectionLabel: ex.sectionLabel || sec.sectionLabel,
      subsArr: mergeSubsArr(ex.subsArr, sec.subsArr),
      groupsArr: mergeGroupsArr(ex.groupsArr, sec.groupsArr),
      writeups: ex.writeups || sec.writeups,
      team: "neutral",
    });
  });
  return Array.from(map.values());
}

function getSectionCount(sec) {
  const s =
    sec.subsArr?.reduce(
      (a, sub) => a + (sub.countOverride ?? sub.items?.length ?? 0),
      0
    ) ?? 0;
  const g = sec.groupsArr?.reduce((a, gr) => a + (gr.items?.length ?? 0), 0) ?? 0;
  const w =
    sec.writeups?.topicsArr?.reduce(
      (a, t) => a + (t.diffsArr?.reduce((s, d) => s + (d.items?.length ?? 0), 0) ?? 0),
      0
    ) ?? 0;
  return s + g + w;
}

function slugLabel(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[/_]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getMeta(item, key, fallback) {
  return (
    item?.[key] ??
    item?.meta?.[key] ??
    item?.frontmatter?.[key] ??
    item?.data?.[key] ??
    fallback
  );
}

const DOMAIN_LABELS = {
  "start-here": "START HERE",
  "web-security": "WEB SECURITY",
  "web-pentesting": "WEB PENTESTING",
  "network-infrastructure": "NETWORK INFRASTRUCTURE",
  "soc-defensive-security": "SOC DEFENSIVE SECURITY",
  certifications: "CERTIFICATIONS",
};

const DOMAIN_ORDER = [
  "start-here",
  "web-security",
  "web-pentesting",
  "network-infrastructure",
  "soc-defensive-security",
  "certifications",
];

const SECTION_LABELS = {
  orientation: "Orientation",
  "offensive-security": "Offensive Security",
  "defensive-security": "Defensive Security",
  "learning-paths": "Learning Paths",

  foundations: "Foundations",
  "authentication-access-control": "Authentication & Access Control",
  "browser-security": "Browser Security",
  vulnerabilities: "Vulnerabilities",
  "secure-coding": "Secure Coding",
  "testing-workflows": "Testing Workflows",

  recon: "Recon",
  methodology: "Methodology",
  reporting: "Reporting",
  "labs-writeups": "Labs & Writeups",

  siem: "SIEM",
  logs: "Logs",
  detection: "Detection",
  "incident-response": "Incident Response",
};

const SECTION_ORDER = [
  "orientation",
  "offensive-security",
  "defensive-security",
  "learning-paths",

  "foundations",
  "authentication-access-control",
  "browser-security",
  "vulnerabilities",
  "secure-coding",
  "testing-workflows",

  "recon",
  "methodology",
  "reporting",
  "labs-writeups",

  "siem",
  "logs",
  "detection",
  "incident-response",
];

function prettyLabel(value = "") {
  const slug = slugLabel(value);
  return (
    SECTION_LABELS[slug] ||
    DOMAIN_LABELS[slug] ||
    String(value)
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase())
  );
}

function inferDomainFromLegacySection(sectionLabel = "") {
  const raw = slugLabel(sectionLabel);

  if (raw.includes("start-here")) return "start-here";
  if (raw.includes("web-security")) return "web-security";
  if (raw.includes("web-pentesting")) return "web-pentesting";
  if (raw.includes("network")) return "network-infrastructure";
  if (raw.includes("soc") || raw.includes("defensive")) return "soc-defensive-security";

  return raw || "start-here";
}

function collectDocsFromSections(sections = []) {
  const docs = [];

  sections.forEach((sec) => {
    const domainFallback = inferDomainFromLegacySection(sec.sectionLabel || sec.key);

    sec.subsArr?.forEach((sub) => {
      sub.items?.forEach((item) => {
        docs.push({ ...item, __domainFallback: domainFallback });
      });
    });

    sec.groupsArr?.forEach((group) => {
      group.items?.forEach((item) => {
        docs.push({ ...item, __domainFallback: domainFallback });
      });
    });

    sec.writeups?.topicsArr?.forEach((topic) => {
      topic.diffsArr?.forEach((diff) => {
        diff.items?.forEach((item) => {
          docs.push({ ...item, __domainFallback: domainFallback });
        });
      });
    });
  });

  return uniqueById(docs);
}

function buildSemanticSidebarSections(rawSections = []) {
  const docs = collectDocsFromSections(rawSections);
  const domainMap = new Map();

  docs.forEach((doc) => {
    const domain = slugLabel(getMeta(doc, "domain", doc.__domainFallback));
    const section = slugLabel(getMeta(doc, "section", "uncategorized"));

    if (!domainMap.has(domain)) {
      domainMap.set(domain, new Map());
    }

    const sectionMap = domainMap.get(domain);

    if (!sectionMap.has(section)) {
      sectionMap.set(section, []);
    }

    sectionMap.get(section).push(doc);
  });

  const sortedDomains = Array.from(domainMap.keys()).sort((a, b) => {
    const ai = DOMAIN_ORDER.indexOf(a);
    const bi = DOMAIN_ORDER.indexOf(b);

    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;

    return ai - bi;
  });

  return sortedDomains.map((domain) => {
    const sectionMap = domainMap.get(domain);

    const sortedSections = Array.from(sectionMap.keys()).sort((a, b) => {
      const ai = SECTION_ORDER.indexOf(a);
      const bi = SECTION_ORDER.indexOf(b);

      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;

      return ai - bi;
    });

    return {
      key: domain,
      sectionLabel: DOMAIN_LABELS[domain] || prettyLabel(domain).toUpperCase(),
      subsArr: sortedSections.map((section) => ({
        key: `${domain}:${section}`,
        label: SECTION_LABELS[section] || prettyLabel(section),
        items: sectionMap.get(section),
      })),
      groupsArr: [],
      team: "neutral",
    };
  });
}

export function Sidebar({
  isDesktop,
  sidebarOpen,
  onCloseSidebar,
  query,
  onQueryChange,
  t,
  safeLang,
  onSwitchLang,
  onGoDoc,
  isHome,
  currentDocId,
  pinned,
  sectionsList,
  openSections,
  openGroups,
  toggleSection,
  toggleGroup,
  isSearching,
}) {
  const sections = useMemo(
    () => buildSemanticSidebarSections(mergeSections(sectionsList || [])),
    [sectionsList]
  );

  const renderDocList = (items = []) =>
    uniqueById(items).map((item) => (
      <DocButton
        key={item.id}
        item={item}
        isActive={item.id === currentDocId}
        onGoDoc={onGoDoc}
      />
    ));

  return (
    <>
      {!isDesktop && sidebarOpen && (
        <div
          onClick={onCloseSidebar}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 30,
            background: "rgba(0,0,0,0.65)",
          }}
        />
      )}

      <aside
        style={{
          position: isDesktop ? "static" : "fixed",
          inset: isDesktop ? "auto" : "0 auto 0 0",
          zIndex: isDesktop ? "auto" : 40,
          width: "248px",
          flexShrink: 0,
          background: T.bgSidebar,
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          transform: isDesktop
            ? "none"
            : sidebarOpen
              ? "translateX(0)"
              : "translateX(-100%)",
          transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
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
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontFamily: T.mono,
                fontSize: "13px",
                fontWeight: 600,
                color: T.textBright,
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              field<span style={{ color: T.acc }}>/</span>manual
            </div>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: "10px",
                color: T.textMuted,
                marginTop: "3px",
              }}
            >
              by {SITE.authorLabel}
            </div>
          </button>

          {!isDesktop && (
            <button
              onClick={onCloseSidebar}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: T.textMuted,
                display: "flex",
              }}
              aria-label="Zamknij menu"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div
          style={{
            padding: "10px 12px 8px",
            borderBottom: `1px solid ${T.border}`,
            flexShrink: 0,
          }}
        >
          <div style={{ position: "relative", marginBottom: "8px" }}>
            <Search
              size={12}
              style={{
                position: "absolute",
                left: "9px",
                top: "50%",
                transform: "translateY(-50%)",
                color: T.textMuted,
                pointerEvents: "none",
              }}
            />
            <input
              id="kb-search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t.search}
              style={{
                width: "100%",
                padding: "7px 10px 7px 28px",
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: "3px",
                color: T.textBright,
                fontFamily: T.mono,
                fontSize: "11px",
                outline: "none",
                boxSizing: "border-box",
                caretColor: T.acc,
                transition: "border-color 0.1s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = T.accBorder;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = T.border;
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            {[
              {
                label: safeLang === "pl" ? "EN" : "PL",
                onClick: onSwitchLang,
                href: null,
              },
              { label: "GitHub", onClick: null, href: SITE.repoUrl },
            ].map(({ label, onClick, href }) => {
              const shared = {
                style: {
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px 8px",
                  border: `1px solid ${T.border}`,
                  borderRadius: "3px",
                  background: "transparent",
                  color: T.textMuted,
                  fontFamily: T.mono,
                  fontSize: "10px",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "color 0.1s, border-color 0.1s",
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.color = T.textBright;
                  e.currentTarget.style.borderColor = T.borderHover;
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.color = T.textMuted;
                  e.currentTarget.style.borderColor = T.border;
                },
              };
              return href ? (
                <a key={label} href={href} target="_blank" rel="noreferrer" {...shared}>
                  {label}
                </a>
              ) : (
                <button key={label} onClick={onClick} {...shared}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "10px 8px 24px" }}>
          <div style={{ marginBottom: "14px" }}>
            <button
              onClick={() => onGoDoc("home")}
              style={{
                width: "100%",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 10px",
                background: isHome ? `${T.acc}0f` : "none",
                border: "none",
                borderLeft: `2px solid ${isHome ? T.acc : "transparent"}`,
                borderRadius: "0 3px 3px 0",
                cursor: "pointer",
              }}
            >
              <Home
                size={12}
                style={{ color: isHome ? T.acc : T.textMuted, flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  color: isHome ? T.textBright : T.textMuted,
                }}
              >
                {t.home || "HOME"}
              </span>
            </button>
          </div>

          {pinned?.length ? (
            <div style={{ marginBottom: "18px" }}>
              <div
                style={{
                  padding: "0 10px 5px",
                  fontFamily: T.mono,
                  fontSize: "9px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: T.textDim,
                  fontWeight: 600,
                }}
              >
                {t.start || "PINNED"}
              </div>
              {renderDocList(pinned)}
            </div>
          ) : null}

          {sections.map((sec) => {
            const isOpen = isSearching ? true : Boolean(openSections[sec.key]);
            const count = getSectionCount(sec);

            return (
              <div key={sec.key} style={{ marginBottom: "2px" }}>
                <button
                  onClick={() => toggleSection(sec.key)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "6px",
                    padding: "6px 10px",
                    background: isOpen ? `${T.acc}08` : "none",
                    border: "none",
                    borderLeft: `2px solid ${isOpen ? T.acc : "transparent"}`,
                    borderRadius: "0 3px 3px 0",
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
                        transition: "transform 0.15s",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.14em",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: isOpen ? T.textBright : T.textMuted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sec.sectionLabel}
                    </span>
                  </div>

                  {count > 0 && (
                    <span
                      style={{
                        fontSize: "9px",
                        color: isOpen ? T.textMuted : T.textDim,
                        flexShrink: 0,
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>

                {isOpen && (
                  <div
                    style={{ paddingLeft: "4px", marginTop: "2px", marginBottom: "8px" }}
                  >
                    {sec.subsArr?.map((sub) => {
                      const subOpen = isSearching ? true : Boolean(openGroups[sub.key]);
                      const isPsWU = sub.kind === "portswigger-writeups";

                      return (
                        <div key={sub.key}>
                          {sub.label && (
                            <GroupToggle
                              label={sub.label}
                              count={sub.countOverride ?? sub.items.length}
                              isOpen={subOpen}
                              onToggle={() => toggleGroup(sub.key)}
                              indentLevel={0}
                            />
                          )}

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
            padding: "10px 16px 12px",
            borderTop: `1px solid ${T.border}`,
            flexShrink: 0,
            fontFamily: T.mono,
            fontSize: "10px",
            color: T.textMuted,
          }}
        >
          <span style={{ color: T.acc }}>$</span>{" "}
          <span style={{ color: T.textDim }}>built by </span>
          <span style={{ color: T.text }}>{SITE.authorLabel}</span>
        </div>
      </aside>
    </>
  );
}
