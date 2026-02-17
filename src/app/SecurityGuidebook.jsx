import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Fuse from "fuse.js";
import {
  BookOpen,
  Search,
  Menu,
  X,
  Github,
  ExternalLink,
  Sun,
  Moon,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Shield,
  Crosshair,
  Hash,
} from "lucide-react";
import { buildToc, slugify } from "./toc.js";
import { loadContentBilingual } from "./contentLoader.js";

const SITE = {
  name: "Red/Blue Field Manual",
  authorLabel: "Bonus1337",
  repoUrl: "https://github.com/Bonus1337/field-manual",
};

const UI = {
  pl: {
    search: 'Szukaj… ("/")',
    edit: "Edytuj na GitHub",
    updated: "Aktualizacja",
    difficulty: "Poziom",
    fallback: "Brak tej wersji językowej - pokazuję dostępną.",
    onThisPage: "Na tej stronie",
    next: "Następna",
    prev: "Poprzednia",
    start: "Start",
  },
  en: {
    search: 'Search… ("/")',
    edit: "Edit on GitHub",
    updated: "Updated",
    difficulty: "Difficulty",
    fallback: "No translation available - showing the other language.",
    onThisPage: "On this page",
    next: "Next",
    prev: "Previous",
    start: "Start",
  },
};

function cx(...cls) {
  return cls.filter(Boolean).join(" ");
}

function teamMeta(team) {
  switch (team) {
    case "red":
      return {
        label: "Red",
        Icon: Crosshair,
        chip: "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200",
      };
    case "blue":
      return {
        label: "Blue",
        Icon: Shield,
        chip: "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-200",
      };
    default:
      return {
        label: "General",
        Icon: Hash,
        chip: "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-200",
      };
  }
}

function getStoredTheme() {
  const v = localStorage.getItem("fm_theme");
  return v === "light" ? "light" : "dark";
}
function setStoredTheme(v) {
  localStorage.setItem("fm_theme", v);
}

function nodeToText(node) {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (typeof node === "object" && node.props && node.props.children) {
    return nodeToText(node.props.children);
  }
  return "";
}

function titleize(s = "") {
  return s
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
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
  if (!v) return "unrated";
  return String(v).trim().toLowerCase();
}

function labelDifficulty(v) {
  const k = normalizeDifficulty(v);
  return DIFF_LABEL[k] || titleize(k);
}

function sortByDifficulty(platform, a, b) {
  const order = DIFF_ORDER[platform] || [];
  const ia = order.indexOf(normalizeDifficulty(a));
  const ib = order.indexOf(normalizeDifficulty(b));

  const va = ia === -1 ? 999 : ia;
  const vb = ib === -1 ? 999 : ib;

  if (va !== vb) return va - vb;
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

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(code || "").trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.warn("Clipboard copy failed", e);
    }
  };

  return (
    <div className="my-5 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800">
        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          {language || "code"}
        </div>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          title="Copy"
          type="button"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-slate-900 dark:text-slate-100">
          {String(code || "").trim()}
        </code>
      </pre>
    </div>
  );
}

function Markdown({ content }) {
  const usedIdsRef = useRef(new Map());

  const [lightbox, setLightbox] = useState({
    open: false,
    src: "",
    alt: "",
  });

  useEffect(() => {
    if (!lightbox.open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lightbox.open]);

  useEffect(() => {
    if (!lightbox.open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox({ open: false, src: "", alt: "" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox.open]);
  useEffect(() => {
    usedIdsRef.current = new Map();
  }, [content]);

  const computeHeading = (children) => {
    const text = nodeToText(children).trim();

    const m = text.match(/\s*\{#([a-z0-9\-_]+)\}\s*$/i);
    const visibleText = m ? text.replace(m[0], "").trim() : text;
    const baseId = m ? m[1] : slugify(visibleText);

    const used = usedIdsRef.current;
    const prev = used.get(baseId) ?? 0;
    used.set(baseId, prev + 1);

    const id = prev > 0 ? `${baseId}-${prev + 1}` : baseId;

    return { id, visibleText, hasExplicit: Boolean(m) };
  };

  return (
    <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },

          h1({ children }) {
            const { id, visibleText, hasExplicit } = computeHeading(children);
            return <h1 id={id}>{hasExplicit ? visibleText : children}</h1>;
          },
          h2({ children }) {
            const { id, visibleText, hasExplicit } = computeHeading(children);
            return <h2 id={id}>{hasExplicit ? visibleText : children}</h2>;
          },
          h3({ children }) {
            const { id, visibleText, hasExplicit } = computeHeading(children);
            return <h3 id={id}>{hasExplicit ? visibleText : children}</h3>;
          },
          h4({ children }) {
            const { id, visibleText, hasExplicit } = computeHeading(children);
            return <h4 id={id}>{hasExplicit ? visibleText : children}</h4>;
          },
          img({ src, alt }) {
            const s = String(src || "");
            const a = String(alt || "");

            return (
              <button
                type="button"
                onClick={() => setLightbox({ open: true, src: s, alt: a })}
                className="my-4 block w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                title="Kliknij, żeby powiększyć"
              >
                <img
                  src={s}
                  alt={a}
                  className="w-full h-auto cursor-zoom-in"
                  loading="lazy"
                />
              </button>
            );
          },
          code({ inline, className, children }) {
            const raw = String(children ?? "");
            const trimmed = raw.replace(/\n$/, "");
            const match = /language-([\w-]+)/.exec(className || "");
            const hasLang = Boolean(match?.[1]);

            if (inline) {
              return (
                <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.95em] dark:bg-slate-900">
                  {raw}
                </code>
              );
            }

            const isSingleLine = !trimmed.includes("\n");
            if (!hasLang && isSingleLine && trimmed.trim().length <= 120) {
              return (
                <code className="inline-flex max-w-full overflow-x-auto rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[0.9em] text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  {trimmed.trim()}
                </code>
              );
            }

            return <CodeBlock code={raw} language={match?.[1]} />;
          },

          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-amber-300 bg-amber-50/60 p-4 not-italic dark:border-amber-900/70 dark:bg-amber-950/20">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {lightbox.open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
          onClick={() => setLightbox({ open: false, src: "", alt: "" })}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[90vh] max-w-[95vw]">
              <button
                type="button"
                onClick={() => setLightbox({ open: false, src: "", alt: "" })}
                className="absolute -top-3 -right-3 rounded-full border border-slate-200 bg-white p-2 shadow-md hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                title="Zamknij"
              >
                <X size={16} />
              </button>

              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="max-h-[90vh] max-w-[95vw] rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 cursor-zoom-out"
                onClick={() => setLightbox({ open: false, src: "", alt: "" })}
              />
              {lightbox.alt ? (
                <div className="mt-2 text-center text-xs text-slate-200/90">
                  {lightbox.alt}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
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

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState(() => getStoredTheme());

  const [openSections, setOpenSections] = useState(() => ({}));
  const [openGroups, setOpenGroups] = useState(() => ({}));

  const isSearching = Boolean(query.trim());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setStoredTheme(theme);
  }, [theme]);

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
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { map, canon } = useMemo(() => loadContentBilingual(), []);

  const sidebarItems = useMemo(() => {
    const items = [];
    for (const base of canon) {
      const pair = map.get(base.id);
      const localized = pair ? pair[safeLang] || pair.pl || pair.en : base;
      items.push(localized);
    }
    return items;
  }, [canon, map, safeLang]);

  const pair = map.get(id) || null;
  const doc = pair ? pair[safeLang] || pair.pl || pair.en : null;
  const isFallback = pair ? !pair[safeLang] : false;

  useEffect(() => {
    if (!doc && canon?.[0]) {
      navigate(`/${safeLang}/doc/${canon[0].id}`, { replace: true });
    }
  }, [doc, canon, safeLang, navigate]);

  const fuse = useMemo(
    () =>
      new Fuse(sidebarItems, {
        keys: ["title", "category", "tags", "content"],
        threshold: 0.35,
      }),
    [sidebarItems]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return sidebarItems;
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse, sidebarItems]);

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

      const isPortSwigger = nav?.root === "portswigger";
      const isTryHackMe = nav?.root === "tryhackme";
      const isWriteup = Boolean(nav?.isWriteup);

      let sectionLabel = d.category || "General";
      let subLabel = "";

      if (isPortSwigger) {
        sectionLabel = "PortSwigger";
        subLabel = isWriteup ? "Writeups" : "Knowledge base";
      } else if (isTryHackMe) {
        sectionLabel = "TryHackMe";
        subLabel = isWriteup ? "Writeups" : "Rooms";
      } else if (nav?.root && nav.root !== "general") {
        sectionLabel = titleize(nav.root);
        subLabel = d.category || "";
      } else {
        sectionLabel = d.category || "General";
        subLabel = "";
      }

      const secKey = `${d.team}::${sectionLabel}`;
      const sec = ensureSection(secKey, { team: d.team, sectionLabel });

      if (isPortSwigger && isWriteup) {
        sec.platform = "portswigger";

        const sub = ensureSub(sec, "Writeups");
        sub.kind = "portswigger-writeups";

        if (!sec.writeups) {
          sec.writeups = {
            topics: new Map(),
          };
        }

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

      if (isTryHackMe && isWriteup) {
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
      const t = (order[a.team] ?? 9) - (order[b.team] ?? 9);
      if (t !== 0) return t;
      return a.sectionLabel.localeCompare(b.sectionLabel);
    });

    for (const sec of out) {
      const subsArr = Array.from(sec.subs.values());
      subsArr.sort((a, b) => (a.label || "").localeCompare(b.label || ""));
      for (const sub of subsArr) {
        if (sub.kind === "docs") {
          sub.items.sort((a, b) => a.title.localeCompare(b.title));
        }
      }
      sec.subsArr = subsArr;

      const groupsArr = Array.from(sec.groups.values());
      groupsArr.sort((a, b) => sortByDifficulty(sec.platform, a.raw, b.raw));
      for (const g of groupsArr) g.items.sort((a, b) => a.title.localeCompare(b.title));
      sec.groupsArr = groupsArr;

      if (sec.writeups?.topics) {
        const topicsArr = Array.from(sec.writeups.topics.values());
        topicsArr.sort((a, b) => (a.label || "").localeCompare(b.label || ""));

        for (const topic of topicsArr) {
          const diffsArr = Array.from(topic.diffs.values());
          diffsArr.sort((a, b) => sortByDifficulty("portswigger", a.raw, b.raw));
          for (const g of diffsArr)
            g.items.sort((a, b) => a.title.localeCompare(b.title));
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

  const docId = doc?.id ?? null;
  const activePath = docId ? pathByDocId.get(docId) || null : null;

  useEffect(() => {
    if (!activePath?.secKey) return;

    const raf = requestAnimationFrame(() => {
      setOpenSections((prev) => {
        if (prev[activePath.secKey] !== undefined) return prev;
        return { ...prev, [activePath.secKey]: true };
      });

      setOpenGroups((prev) => {
        let next = prev;

        const want = [
          activePath.subKey,
          activePath.parentKey,
          activePath.groupKey,
        ].filter(Boolean);

        for (const k of want) {
          if (next[k] === undefined) {
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

  const docIndex = useMemo(
    () => canon.findIndex((d) => d.id === (doc?.id ?? "")),
    [canon, doc]
  );
  const prevDoc = docIndex > 0 ? canon[docIndex - 1] : null;
  const nextDoc =
    docIndex >= 0 && docIndex < canon.length - 1 ? canon[docIndex + 1] : null;

  const onSwitchLang = () => {
    const next = safeLang === "pl" ? "en" : "pl";
    navigate(`/${next}/doc/${id}`, { replace: false });
  };

  const onGoDoc = (docId2) => {
    navigate(`/${safeLang}/doc/${docId2}`);
    const root = mainRef.current;
    if (root) root.scrollTo({ top: 0, behavior: "auto" });
  };

  const toggleSection = (secKey) => {
    setOpenSections((prev) => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  const toggleGroup = (groupKey) => {
    setOpenGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const editUrl = doc ? `${SITE.repoUrl}/blob/main/${doc.sourcePath}` : SITE.repoUrl;
  const meta = teamMeta(doc?.team);

  useEffect(() => {
    if (!doc) return;

    const raf = requestAnimationFrame(() => {
      const article = articleRef.current;
      if (!article) {
        setTocItems([]);
        setActiveTocId(null);
        return;
      }

      const headings = Array.from(article.querySelectorAll("h1, h2, h3, h4"));
      if (headings.length === 0) {
        try {
          const fallback = buildToc(doc.content) || [];
          setTocItems(fallback);
        } catch {
          setTocItems([]);
        }
        setActiveTocId(null);
        return;
      }

      const used = new Map();
      const ensureUniqueId = (base) => {
        const prev = used.get(base) ?? 0;
        used.set(base, prev + 1);
        return prev > 0 ? `${base}-${prev + 1}` : base;
      };

      const items = headings
        .map((el) => {
          const text = (el.textContent || "").trim();
          if (!text) return null;

          let hid = el.getAttribute("id");
          if (!hid) {
            hid = ensureUniqueId(slugify(text));
            el.setAttribute("id", hid);
          } else {
            const unique = ensureUniqueId(hid);
            if (unique !== hid) {
              hid = unique;
              el.setAttribute("id", hid);
            }
          }

          return { id: hid, text };
        })
        .filter(Boolean);

      setTocItems(items);
      setActiveTocId(items[0]?.id ?? null);
    });

    return () => cancelAnimationFrame(raf);
  }, [doc?.id, doc?.content]);

  useEffect(() => {
    const root = mainRef.current;
    const article = articleRef.current;
    if (!root || !article || tocItems.length === 0) return;

    const targets = tocItems
      .map((tci) => article.querySelector(`#${CSS.escape(tci.id)}`))
      .filter(Boolean);

    if (targets.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visible?.target?.id) setActiveTocId(visible.target.id);
      },
      {
        root,
        rootMargin: "-15% 0px -75% 0px",
        threshold: [0.1, 0.2, 0.4, 0.6],
      }
    );

    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [tocItems, doc?.id]);

  const scrollToHeading = (headingId) => {
    const root = mainRef.current;
    const article = articleRef.current;
    if (!root || !article) return;

    const el = article.querySelector(`#${CSS.escape(headingId)}`);
    if (!el) return;

    const HEADER_OFFSET = 88;
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const top = elRect.top - rootRect.top + root.scrollTop - HEADER_OFFSET;

    root.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  if (!doc) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-900">
        <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold">Brak dokumentów do wyświetlenia</h1>
          <p className="mt-2 text-sm text-slate-600">
            Loader nie widzi markdownów w{" "}
            <code className="px-1 py-0.5 bg-slate-100 rounded">/content</code>.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Sprawdź, czy masz pliki np.{" "}
            <code className="px-1 py-0.5 bg-slate-100 rounded">
              content/pl/manifesto.md
            </code>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white text-slate-900 dark:bg-[#0b0f17] dark:text-slate-100">
      <div className="flex h-full">
        <aside
          className={cx(
            "border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0a0e16]",
            sidebarOpen ? "w-80" : "w-0"
          )}
        >
          <div className={cx("h-full", sidebarOpen ? "flex flex-col" : "hidden")}>
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-900 flex items-center justify-between">
              <button
                onClick={() => onGoDoc("manifesto")}
                className="flex items-center gap-2 text-left"
                type="button"
              >
                <div className="h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center dark:border-slate-800 dark:bg-slate-900">
                  <BookOpen size={18} className="text-slate-700 dark:text-slate-200" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">{SITE.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    by {SITE.authorLabel}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="kb-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.search}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-slate-800"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={onSwitchLang}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                  type="button"
                >
                  {safeLang === "pl" ? "EN" : "PL"}
                </button>

                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                  type="button"
                >
                  {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                  {theme === "dark" ? "Light" : "Dark"}
                </button>

                <a
                  href={SITE.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  <Github size={14} /> Repo
                </a>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-6">
              {pinned?.length ? (
                <div className="mb-6">
                  <div className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t.start}
                  </div>

                  <div className="space-y-1">
                    {pinned.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onGoDoc(item.id)}
                        className={cx(
                          "w-full text-left rounded-lg px-3 py-2 border text-sm",
                          item.id === doc.id
                            ? "border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-[#0f1624]"
                            : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-[#0f1624]/60"
                        )}
                        type="button"
                      >
                        <div className="truncate">{item.title}</div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.tags?.length ? item.tags.join(" • ") : ""}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {sectionsList.map((sec) => {
                const gm = teamMeta(sec.team);

                const secIsOpen = isSearching ? true : Boolean(openSections[sec.key]);
                const chevronCls = secIsOpen ? "rotate-90" : "rotate-0";

                return (
                  <div key={sec.key} className="mb-6">
                    <button
                      onClick={() => toggleSection(sec.key)}
                      className="w-full px-2 mb-2 flex items-center justify-between rounded-lg hover:bg-slate-50 dark:hover:bg-[#0f1624]/60"
                      title="Toggle section"
                      type="button"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ChevronRight
                          className={cx(
                            "h-4 w-4 text-slate-400 transition-transform",
                            chevronCls
                          )}
                        />
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 truncate">
                          {sec.sectionLabel}
                        </div>
                      </div>

                      <span
                        className={cx(
                          "rounded-full border px-2 py-0.5 text-[10px] shrink-0",
                          gm.chip
                        )}
                      >
                        {gm.label}
                      </span>
                    </button>

                    {secIsOpen && (
                      <div className="space-y-3">
                        {sec.subsArr?.length ? (
                          <div className="space-y-3">
                            {sec.subsArr.map((sub) => {
                              const subKey = sub.key;

                              const subIsOpen = isSearching
                                ? true
                                : Boolean(openGroups[subKey]);
                              const subChevronCls = subIsOpen ? "rotate-90" : "rotate-0";
                              const isPsWriteups = sub.kind === "portswigger-writeups";

                              return (
                                <div key={sub.key}>
                                  {sub.label ? (
                                    <button
                                      onClick={() => toggleGroup(subKey)}
                                      className="w-full px-2 py-1 flex items-center justify-between rounded-lg hover:bg-slate-50 dark:hover:bg-[#0f1624]/60"
                                      type="button"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <ChevronRight
                                          className={cx(
                                            "h-4 w-4 text-slate-400 transition-transform",
                                            subChevronCls
                                          )}
                                        />
                                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                                          {sub.label}
                                        </div>
                                      </div>
                                      <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                                        {sub.countOverride ?? sub.items.length}
                                      </span>
                                    </button>
                                  ) : null}

                                  {(sub.label ? subIsOpen : true) && (
                                    <div
                                      className={cx(
                                        "space-y-1",
                                        sub.label ? "pl-6 mt-1" : ""
                                      )}
                                    >
                                      {!isPsWriteups &&
                                        sub.items.map((item) => (
                                          <button
                                            key={item.id}
                                            onClick={() => onGoDoc(item.id)}
                                            className={cx(
                                              "w-full text-left rounded-lg px-3 py-2 border text-sm",
                                              item.id === doc.id
                                                ? "border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-[#0f1624]"
                                                : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-[#0f1624]/60"
                                            )}
                                            type="button"
                                          >
                                            <div className="truncate">{item.title}</div>
                                            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                              {item.tags?.length
                                                ? item.tags.join(" • ")
                                                : ""}
                                            </div>
                                          </button>
                                        ))}

                                      {isPsWriteups && sec.writeups?.topicsArr?.length ? (
                                        <div className="space-y-2">
                                          {sec.writeups.topicsArr.map((topic) => {
                                            const topicIsOpen = isSearching
                                              ? true
                                              : Boolean(openGroups[topic.key]);
                                            const topicChevronCls = topicIsOpen
                                              ? "rotate-90"
                                              : "rotate-0";

                                            return (
                                              <div key={topic.key}>
                                                <button
                                                  onClick={() => toggleGroup(topic.key)}
                                                  className="w-full px-2 py-1 flex items-center justify-between rounded-lg hover:bg-slate-50 dark:hover:bg-[#0f1624]/60"
                                                  type="button"
                                                >
                                                  <div className="flex items-center gap-2 min-w-0">
                                                    <ChevronRight
                                                      className={cx(
                                                        "h-4 w-4 text-slate-400 transition-transform",
                                                        topicChevronCls
                                                      )}
                                                    />
                                                    <div className="text-[12px] font-medium text-slate-600 dark:text-slate-300 truncate">
                                                      {topic.label}
                                                    </div>
                                                  </div>
                                                </button>

                                                {topicIsOpen && (
                                                  <div className="mt-1 space-y-2 pl-6">
                                                    {topic.diffsArr?.map((g) => {
                                                      const gIsOpen = isSearching
                                                        ? true
                                                        : Boolean(openGroups[g.key]);
                                                      const gChevronCls = gIsOpen
                                                        ? "rotate-90"
                                                        : "rotate-0";

                                                      return (
                                                        <div key={g.key}>
                                                          <button
                                                            onClick={() =>
                                                              toggleGroup(g.key)
                                                            }
                                                            className="w-full px-2 py-1 flex items-center justify-between rounded-lg hover:bg-slate-50 dark:hover:bg-[#0f1624]/60"
                                                            type="button"
                                                          >
                                                            <div className="flex items-center gap-2 min-w-0">
                                                              <ChevronRight
                                                                className={cx(
                                                                  "h-4 w-4 text-slate-400 transition-transform",
                                                                  gChevronCls
                                                                )}
                                                              />
                                                              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                                                                {g.label}
                                                              </div>
                                                            </div>

                                                            <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                                                              {g.items.length}
                                                            </span>
                                                          </button>

                                                          {gIsOpen && (
                                                            <div className="mt-1 space-y-1 pl-6">
                                                              {g.items.map((item) => (
                                                                <button
                                                                  key={item.id}
                                                                  onClick={() =>
                                                                    onGoDoc(item.id)
                                                                  }
                                                                  className={cx(
                                                                    "w-full text-left rounded-lg px-3 py-2 border text-sm",
                                                                    item.id === doc.id
                                                                      ? "border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-[#0f1624]"
                                                                      : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-[#0f1624]/60"
                                                                  )}
                                                                  type="button"
                                                                >
                                                                  <div className="truncate">
                                                                    {item.title}
                                                                  </div>
                                                                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                                                    {item.tags?.length
                                                                      ? item.tags.join(
                                                                          " • "
                                                                        )
                                                                      : ""}
                                                                  </div>
                                                                </button>
                                                              ))}
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
                                        </div>
                                      ) : null}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : null}

                        {sec.groupsArr?.length ? (
                          <div className="space-y-2">
                            {sec.groupsArr.map((g) => {
                              const gIsOpen = isSearching
                                ? true
                                : Boolean(openGroups[g.key]);
                              const gChevronCls = gIsOpen ? "rotate-90" : "rotate-0";

                              return (
                                <div key={g.key}>
                                  <button
                                    onClick={() => toggleGroup(g.key)}
                                    className="w-full px-2 py-1 flex items-center justify-between rounded-lg hover:bg-slate-50 dark:hover:bg-[#0f1624]/60"
                                    type="button"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <ChevronRight
                                        className={cx(
                                          "h-4 w-4 text-slate-400 transition-transform",
                                          gChevronCls
                                        )}
                                      />
                                      <div className="text-[12px] font-medium text-slate-600 dark:text-slate-300 truncate">
                                        {g.label}
                                      </div>
                                    </div>

                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                                      {g.items.length}
                                    </span>
                                  </button>

                                  {gIsOpen && (
                                    <div className="mt-1 space-y-1 pl-6">
                                      {g.items.map((item) => (
                                        <button
                                          key={item.id}
                                          onClick={() => onGoDoc(item.id)}
                                          className={cx(
                                            "w-full text-left rounded-lg px-3 py-2 border text-sm",
                                            item.id === doc.id
                                              ? "border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-[#0f1624]"
                                              : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-[#0f1624]/60"
                                          )}
                                          type="button"
                                        >
                                          <div className="truncate">{item.title}</div>
                                          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                            {item.tags?.length
                                              ? item.tags.join(" • ")
                                              : ""}
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="px-4 py-4 border-t border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 space-y-2">
              <div className="leading-relaxed">
                Built by{" "}
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  {SITE.authorLabel}
                </span>
                . Field notes for Red/Blue work.
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onGoDoc("about")}
                  className="rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-[#0f1624]"
                  type="button"
                >
                  {safeLang === "pl" ? "O mnie" : "About"}
                </button>

                <a
                  href={SITE.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-[#0f1624]"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </aside>

        <main ref={mainRef} className="flex-1 relative h-full overflow-y-auto min-w-0">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute left-4 top-4 z-10 rounded-lg border border-slate-200 bg-white/80 p-2 text-slate-700 backdrop-blur hover:bg-white dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200"
              type="button"
            >
              <Menu size={18} />
            </button>
          )}

          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0a0e16]">
            <div className="mx-auto max-w-6xl px-4 sm:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cx("rounded-xl border px-2.5 py-1 text-xs", meta.chip)}>
                  <span className="inline-flex items-center gap-2">
                    <meta.Icon size={14} />
                    {meta.label}
                  </span>
                </div>
                <div className="text-sm font-semibold">{doc.title}</div>
              </div>

              <a
                href={editUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                {t.edit} <ExternalLink size={12} />
              </a>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">
            <article ref={articleRef} className="min-w-0">
              {isFallback && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
                  {t.fallback}
                </div>
              )}

              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {doc.updatedAt && (
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 dark:border-slate-800">
                    {t.updated}: {doc.updatedAt}
                  </span>
                )}
                {doc.difficulty && (
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 dark:border-slate-800">
                    {t.difficulty}: {doc.difficulty}
                  </span>
                )}
                {doc.tags?.length ? (
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 dark:border-slate-800">
                    {doc.tags.join(" • ")}
                  </span>
                ) : null}
              </div>

              <Markdown content={doc.content} />

              <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-900 flex items-center justify-between gap-4">
                <button
                  disabled={!prevDoc}
                  onClick={() => prevDoc && onGoDoc(prevDoc.id)}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                    prevDoc
                      ? "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                      : "border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-600 cursor-not-allowed"
                  )}
                  type="button"
                >
                  <ChevronLeft size={16} /> {t.prev}
                </button>

                <button
                  disabled={!nextDoc}
                  onClick={() => nextDoc && onGoDoc(nextDoc.id)}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                    nextDoc
                      ? "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                      : "border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-600 cursor-not-allowed"
                  )}
                  type="button"
                >
                  {t.next} <ChevronRight size={16} />
                </button>
              </div>
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t.onThisPage}
                </div>

                <div className="mt-3 space-y-1">
                  {tocItems.length === 0 ? (
                    <div className="text-sm text-slate-500 dark:text-slate-400">-</div>
                  ) : (
                    tocItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={cx(
                          "w-full text-left rounded-md px-2 py-1 text-sm transition",
                          activeTocId === item.id
                            ? "text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-900/60"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900/40"
                        )}
                        type="button"
                      >
                        {item.text}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
