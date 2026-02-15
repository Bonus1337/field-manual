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
    fallback: "Brak tej wersji językowej — pokazuję dostępną.",
    onThisPage: "Na tej stronie",
    next: "Następna",
    prev: "Poprzednia",
  },
  en: {
    search: 'Search… ("/")',
    edit: "Edit on GitHub",
    updated: "Updated",
    difficulty: "Difficulty",
    fallback: "No translation available — showing the other language.",
    onThisPage: "On this page",
    next: "Next",
    prev: "Previous",
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

/**
 * ReactMarkdown children mogą być stringami albo elementami.
 * TOC potrzebuje “czystego tekstu”, więc wyciągamy tekst rekurencyjnie.
 */
function nodeToText(node) {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (typeof node === "object" && node.props && node.props.children) {
    return nodeToText(node.props.children);
  }
  return "";
}

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
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1({ children }) {
            const text = nodeToText(children).trim();
            const id = slugify(text);
            return <h1 id={id}>{children}</h1>;
          },
          h2({ children }) {
            const text = nodeToText(children).trim();
            const id = slugify(text);
            return <h2 id={id}>{children}</h2>;
          },
          h3({ children }) {
            const text = nodeToText(children).trim();
            const id = slugify(text);
            return <h3 id={id}>{children}</h3>;
          },

          code({ inline, className, children }) {
            const raw = String(children ?? "");
            const match = /language-(\w+)/.exec(className || "");

            if (inline) {
              return (
                <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.95em] dark:bg-slate-900">
                  {raw}
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
    </div>
  );
}

export default function SecurityGuidebook() {
  const { lang, id } = useParams();
  const navigate = useNavigate();

  const mainRef = useRef(null);
  const [activeTocId, setActiveTocId] = useState(null);

  const safeLang = lang === "en" ? "en" : "pl";
  const t = UI[safeLang];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState(() => getStoredTheme());

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

  const grouped = useMemo(() => {
    const groups = new Map();
    for (const d of filtered) {
      const key = `${d.team}::${d.category}`;
      if (!groups.has(key))
        groups.set(key, { team: d.team, category: d.category, items: [] });
      groups.get(key).items.push(d);
    }
    const order = { neutral: 0, blue: 1, red: 2 };
    return Array.from(groups.values()).sort((a, b) => {
      const t = (order[a.team] ?? 9) - (order[b.team] ?? 9);
      if (t !== 0) return t;
      return a.category.localeCompare(b.category);
    });
  }, [filtered]);

  const toc = useMemo(() => (doc ? buildToc(doc.content) : []), [doc]);

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

  const onGoDoc = (docId) => {
    navigate(`/${safeLang}/doc/${docId}`);
    const root = mainRef.current;
    if (root) root.scrollTo({ top: 0, behavior: "instant" });
  };

  const editUrl = doc ? `${SITE.repoUrl}/blob/main/${doc.sourcePath}` : SITE.repoUrl;
  const meta = teamMeta(doc?.team);

  useEffect(() => {
    const root = mainRef.current;
    if (!root || toc.length === 0) return;

    const targets = toc.map((t) => document.getElementById(t.id)).filter(Boolean);

    if (targets.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

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
  }, [toc, doc?.id, theme, safeLang]);

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
        {/* Sidebar */}
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
                >
                  {safeLang === "pl" ? "EN" : "PL"}
                </button>

                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
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
              {grouped.map((g) => {
                const gm = teamMeta(g.team);
                return (
                  <div key={`${g.team}-${g.category}`} className="mb-6">
                    <div className="px-2 mb-2 flex items-center justify-between">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {g.category}
                      </div>
                      <span
                        className={cx(
                          "rounded-full border px-2 py-0.5 text-[10px]",
                          gm.chip
                        )}
                      >
                        {gm.label}
                      </span>
                    </div>

                    <div className="space-y-1">
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
                        >
                          <div className="truncate">{item.title}</div>
                          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {item.tags?.length ? item.tags.join(" • ") : ""}
                          </div>
                        </button>
                      ))}
                    </div>
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

        {/* Main — IMPORTANT: to jest scroll container */}
        <main ref={mainRef} className="flex-1 relative h-full overflow-y-auto min-w-0">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute left-4 top-4 z-10 rounded-lg border border-slate-200 bg-white/80 p-2 text-slate-700 backdrop-blur hover:bg-white dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200"
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
            <article className="min-w-0">
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
                >
                  {t.next} <ChevronRight size={16} />
                </button>
              </div>
            </article>

            {/* TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t.onThisPage}
                </div>

                <div className="mt-3 space-y-1">
                  {toc.length === 0 ? (
                    <div className="text-sm text-slate-500 dark:text-slate-400">—</div>
                  ) : (
                    toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          const el = document.getElementById(item.id);
                          if (el)
                            el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={cx(
                          "w-full text-left rounded-md px-2 py-1 text-sm transition",
                          activeTocId === item.id
                            ? "text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-900/60"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900/40"
                        )}
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
