import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Fuse from "fuse.js";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

import { T } from "./constants/theme";
import { SITE, UI, PINNED_ORDER, PINNED_SET } from "./constants/config";
import { useIsDesktop } from "./hooks/useIsDesktop";
import {
  titleize,
  normalizeTopic,
  sortDocsByDateAscThenTitle,
  normalizeDifficulty,
  labelDifficulty,
  sortByDifficulty,
} from "./utils/index";
import { buildToc } from "./toc";
import { loadContentBilingual } from "./contentLoader";
import { exportAsPDF, exportAsMD } from "./utils/exportDoc";
import {
  Markdown,
  HomeView,
  Sidebar,
  DocHeader,
  TableOfContents,
} from "./components/index";

function getDiffColor(d) {
  const v = String(d || "").toLowerCase();
  if (v === "easy" || v === "apprentice") return T.acc;
  if (v === "medium" || v === "practitioner") return T.amber;
  if (v === "hard" || v === "expert") return T.red;
  return T.textMuted;
}

function getDomainLabel(navRoot, domainLabels) {
  if (!navRoot || !domainLabels) return null;

  if (domainLabels[navRoot]) return domainLabels[navRoot];

  const rootSlug = String(navRoot)
    .replace(/^\d+[-_]/, "")
    .toLowerCase();
  for (const [key, label] of Object.entries(domainLabels)) {
    const keySlug = String(key)
      .replace(/^\d+[-_]/, "")
      .toLowerCase();
    if (keySlug === rootSlug) return label;
  }

  return null;
}

function navRootOrder(navRoot) {
  const m = String(navRoot || "").match(/^(\d+)/);
  return m ? Number(m[1]) : 999;
}

export default function SecurityGuidebook() {
  const { lang, id } = useParams();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const articleRef = useRef(null);

  const [activeTocId, setActiveTocId] = useState(null);
  const [tocItems, setTocItems] = useState([]);

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
    const prev = document.body.style.overflow;
    if (sidebarOpenEffective) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDesktop, sidebarOpenEffective]);

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
    if (!id && canon?.length) navigate(`/${safeLang}/doc/home`, { replace: true });
  }, [id, canon, navigate, safeLang]);

  useEffect(() => {
    if (id && id !== "home" && !doc && canon?.length)
      navigate(`/${safeLang}/doc/home`, { replace: true });
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
    const domainLabels = UI[safeLang]?.homeView?.domainLabels || {};

    const ensureSection = (secKey, payload) => {
      if (!secMap.has(secKey)) {
        secMap.set(secKey, {
          key: secKey,
          team: payload.team,
          sectionLabel: payload.sectionLabel,
          navRoot: payload.navRoot, // ← przechowujemy dla sortowania
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
      let navRoot = nav?.root || "";

      if (isPS) {
        sectionLabel = "PortSwigger";
        subLabel = isWU ? "Writeups" : "Knowledge base";
        navRoot = "portswigger";
      } else if (isTHM) {
        sectionLabel = "TryHackMe";
        subLabel = isWU ? "Writeups" : "Rooms";
        navRoot = "tryhackme";
      } else if (nav?.root && nav.root !== "general") {
        sectionLabel = getDomainLabel(nav.root, domainLabels) || titleize(nav.root);
        subLabel = d.category || "";
        navRoot = nav.root;
      } else {
        sectionLabel = d.category || "General";
        subLabel = "";
        navRoot = "general";
      }

      const secKey = navRoot;
      const sec = ensureSection(secKey, { team: d.team, sectionLabel, navRoot });

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

    const out = Array.from(secMap.values()).sort((a, b) => {
      const na = navRootOrder(a.navRoot);
      const nb = navRootOrder(b.navRoot);
      if (na !== nb) return na - nb;
      return a.sectionLabel.localeCompare(b.sectionLabel);
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
  }, [filtered, safeLang]);

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
      if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "auto" });
      if (!isDesktop) setSidebarOpen(false);
    },
    [navigate, safeLang, isDesktop]
  );

  const toggleSection = useCallback(
    (k) => setOpenSections((p) => ({ ...p, [k]: !p[k] })),
    []
  );
  const toggleGroup = useCallback(
    (k) => setOpenGroups((p) => ({ ...p, [k]: !p[k] })),
    []
  );

  const handleExportPdf = useCallback(() => {
    if (doc) exportAsPDF(doc, articleRef);
  }, [doc]);
  const handleExportMd = useCallback(() => {
    if (doc) exportAsMD(doc);
  }, [doc]);

  const editUrl = doc ? `${SITE.repoUrl}/blob/main/${doc.sourcePath}` : SITE.repoUrl;

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
  }, [doc, isHome]);

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
      <Sidebar
        isDesktop={isDesktop}
        sidebarOpen={sidebarOpenEffective}
        onCloseSidebar={() => setSidebarOpen(false)}
        onOpenSidebar={() => setSidebarOpen(true)}
        query={query}
        onQueryChange={setQuery}
        t={t}
        safeLang={safeLang}
        onSwitchLang={onSwitchLang}
        onGoDoc={onGoDoc}
        isHome={isHome}
        currentDocId={doc?.id}
        pinned={pinned}
        sectionsList={sectionsList}
        openSections={openSections}
        openGroups={openGroups}
        toggleSection={toggleSection}
        toggleGroup={toggleGroup}
        isSearching={isSearching}
      />

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
        {!isHome && doc && (
          <DocHeader
            doc={doc}
            editUrl={editUrl}
            t={t}
            isDesktop={isDesktop}
            onOpenSidebar={() => setSidebarOpen(true)}
            onExportPdf={handleExportPdf}
            onExportMd={handleExportMd}
          />
        )}

        {isHome && !isDesktop && (
          <div
            style={{
              padding: "11px 16px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: T.mono, fontSize: "12px", color: T.textMuted }}>
              field<span style={{ color: T.acc }}>/</span>manual
            </span>
          </div>
        )}

        {isHome && <HomeView docs={sidebarItems} onGoDoc={onGoDoc} safeLang={safeLang} />}

        {!isHome && doc && (
          <div
            style={{
              maxWidth: "1120px",
              margin: "0 auto",
              padding: "36px 28px 64px",
              display: "grid",
              gridTemplateColumns: isDesktop ? "1fr 220px" : "1fr",
              gap: "48px",
            }}
          >
            <article ref={articleRef} style={{ minWidth: 0 }}>
              {isFallback && (
                <div
                  style={{
                    marginBottom: "24px",
                    padding: "10px 14px",
                    background: "rgba(245,158,11,0.06)",
                    border: `1px solid ${T.amberBorder}`,
                    borderRadius: "3px",
                    fontSize: "12px",
                    color: T.amber,
                    fontFamily: T.mono,
                  }}
                >
                  ⚠ {t.fallback}
                </div>
              )}

              {(doc.updatedAt || doc.difficulty || doc.tags?.length) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexWrap: "wrap",
                    marginBottom: "28px",
                    paddingBottom: "20px",
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  {doc.updatedAt && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontFamily: T.mono,
                        fontSize: "10px",
                        color: T.textMuted,
                        padding: "3px 8px",
                        border: `1px solid ${T.border}`,
                        borderRadius: "2px",
                        background: T.bgCard,
                      }}
                    >
                      <Clock size={10} />
                      {t.updated}: {doc.updatedAt}
                    </span>
                  )}

                  {doc.difficulty && (
                    <span
                      style={{
                        fontFamily: T.mono,
                        fontSize: "10px",
                        letterSpacing: "0.06em",
                        color: getDiffColor(doc.difficulty),
                        padding: "3px 8px",
                        border: `1px solid ${getDiffColor(doc.difficulty)}30`,
                        borderRadius: "2px",
                        background: `${getDiffColor(doc.difficulty)}08`,
                      }}
                    >
                      {doc.difficulty}
                    </span>
                  )}

                  {doc.tags?.length > 0 && (
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {doc.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: T.mono,
                            fontSize: "10px",
                            color: T.textMuted,
                            padding: "3px 7px",
                            border: `1px solid ${T.border}`,
                            borderRadius: "2px",
                            background: T.bgCard,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Markdown content={doc.content} />

              <div
                style={{
                  marginTop: "56px",
                  paddingTop: "20px",
                  borderTop: `1px solid ${T.border}`,
                  display: "grid",
                  gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
                  gap: "12px",
                  minWidth: 0,
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              >
                {[
                  { d: prevDoc, label: t.prev, isNext: false },
                  { d: nextDoc, label: t.next, isNext: true },
                ].map(({ d, label, isNext }) => (
                  <button
                    key={label}
                    disabled={!d}
                    onClick={() => d && onGoDoc(d.id)}
                    style={{
                      minWidth: 0,
                      maxWidth: "100%",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isDesktop && isNext ? "flex-end" : "flex-start",
                      gap: "6px",
                      padding: isDesktop ? "14px 16px" : "16px",
                      border: `1px solid ${T.border}`,
                      borderRadius: "3px",
                      background: "transparent",
                      cursor: d ? "pointer" : "not-allowed",
                      opacity: d ? 1 : 0.3,
                      fontFamily: T.mono,
                      textAlign: isDesktop && isNext ? "right" : "left",
                      transition: "border-color 0.12s, background 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      if (!d) return;
                      e.currentTarget.style.borderColor = T.accBorder;
                      e.currentTarget.style.background = T.accDim;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: "9px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: T.textDim,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {!isNext && <ChevronLeft size={10} />}
                      {label}
                      {isNext && <ChevronRight size={10} />}
                    </span>

                    {d && (
                      <span
                        style={{
                          minWidth: 0,
                          maxWidth: "100%",
                          display: "block",
                          fontSize: "12px",
                          lineHeight: 1.5,
                          color: T.text,
                          whiteSpace: "normal",
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {d.title}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </article>

            {isDesktop && (
              <aside>
                <TableOfContents
                  items={tocItems}
                  activeId={activeTocId}
                  onScrollTo={scrollToHeading}
                  label={t.onThisPage}
                />
              </aside>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
