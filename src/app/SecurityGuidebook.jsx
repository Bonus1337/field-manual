import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Fuse from "fuse.js";
import { Menu, Clock } from "lucide-react";

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
  }, [doc]);

  const handleExportMd = useCallback(() => {
    if (!doc) return;
    exportAsMD(doc);
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
        ) : null}
      </main>
    </div>
  );
}
