import { buildToc } from "./toc";

function parseFrontmatter(raw) {
  const fm = { data: {}, content: raw };

  if (!raw.startsWith("---")) return fm;

  const end = raw.indexOf("\n---", 3);
  if (end === -1) return fm;

  const header = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\s*\n/, "");

  const data = {};
  for (const line of header.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    value = value.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");

    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      if (!inner) data[key] = [];
      else {
        data[key] = inner
          .split(",")
          .map((s) =>
            s
              .trim()
              .replace(/^"(.*)"$/, "$1")
              .replace(/^'(.*)'$/, "$1")
          )
          .filter(Boolean);
      }
      continue;
    }

    data[key] = value;
  }

  fm.data = data;
  fm.content = body;
  return fm;
}

const modules = import.meta.glob("../../content/**/*.md", {
  as: "raw",
  eager: true,
});

function normalizePath(p) {
  const idx = p.lastIndexOf("/content/");
  return idx >= 0 ? p.slice(idx) : p;
}

function getNavFromPath(path, localePrefix) {
  const rel = path.startsWith(localePrefix) ? path.slice(localePrefix.length) : path;
  const parts = rel.split("/").filter(Boolean);

  const root = parts[0] || "general";
  const isWriteup = parts[1] === "writeups";
  const topic = isWriteup ? parts[2] || "misc" : null;

  return {
    root,
    isWriteup,
    topic,
    navPath: isWriteup ? [root, "writeups", topic] : [root],
  };
}

function loadLocale(locale) {
  const docs = [];
  const localePrefix = `/content/${locale}/`;

  for (const [rawPath, raw] of Object.entries(modules)) {
    const path = normalizePath(rawPath);
    if (!path.startsWith(localePrefix)) continue;

    const { data, content } = parseFrontmatter(raw);

    const id = data.id || path.split("/").pop().replace(".md", "");
    const nav = getNavFromPath(path, localePrefix);

    const autoCategory = nav.isWriteup
      ? `${nav.root}/writeups/${nav.topic}`
      : nav.root === "general"
        ? "General"
        : nav.root;

    docs.push({
      id,
      locale,
      title: data.title || id,
      team: data.team || "neutral",
      category: data.category || autoCategory,
      tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
      difficulty: data.difficulty || "unknown",
      updatedAt: data.updatedAt || null,
      sourcePath: path.replace("/content/", "content/"),
      content,
      toc: buildToc(content),
      nav,
    });
  }

  return docs;
}

export function loadContentBilingual() {
  const pl = loadLocale("pl");
  const en = loadLocale("en");

  const map = new Map();
  for (const d of pl) map.set(d.id, { ...(map.get(d.id) || {}), pl: d });
  for (const d of en) map.set(d.id, { ...(map.get(d.id) || {}), en: d });

  const canon = Array.from(map.values()).map((pair) => pair.pl || pair.en);

  const order = { neutral: 0, blue: 1, red: 2 };
  canon.sort((a, b) => {
    const t = (order[a.team] ?? 9) - (order[b.team] ?? 9);
    if (t !== 0) return t;
    const c = (a.category || "").localeCompare(b.category || "");
    if (c !== 0) return c;
    return (a.title || "").localeCompare(b.title || "");
  });

  return { map, canon };
}
