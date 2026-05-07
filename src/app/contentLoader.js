import { buildToc } from "./toc";

function stripQuotes(value) {
  return String(value ?? "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1");
}

function parseInlineArray(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return [];
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  return inner.split(",").map(stripQuotes).filter(Boolean);
}

function parseBracketArray(lines) {
  const items = [];
  for (const rawLine of lines) {
    let line = String(rawLine ?? "").trim();
    if (!line || line === "[" || line === "]") continue;
    line = line.replace(/^\[/, "").replace(/\]$/, "").trim();
    line = line.replace(/,$/, "").trim();
    if (!line) continue;
    items.push(stripQuotes(line));
  }
  return items;
}

function parseFrontmatter(raw) {
  const normalizedRaw = String(raw ?? "").replace(/^\uFEFF/, "");
  const fm = { data: {}, content: normalizedRaw };

  if (!/^---\s*(\r?\n|$)/.test(normalizedRaw)) return fm;

  const lines = normalizedRaw.split(/\r?\n/);
  if (lines[0].trim() !== "---") return fm;

  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      endIndex = i;
      break;
    }
  }
  if (endIndex === -1) return fm;

  const headerLines = lines.slice(1, endIndex);
  const body = lines
    .slice(endIndex + 1)
    .join("\n")
    .replace(/^\s*\n/, "");
  const data = {};

  for (let i = 0; i < headerLines.length; i++) {
    const rawLine = headerLines[i];
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = parseInlineArray(value);
      continue;
    }

    if (value === "" && headerLines[i + 1]?.trim().startsWith("[")) {
      const arrayLines = [];
      i += 1;
      while (i < headerLines.length) {
        arrayLines.push(headerLines[i]);
        if (headerLines[i].trim().endsWith("]")) break;
        i += 1;
      }
      data[key] = parseBracketArray(arrayLines);
      continue;
    }

    if (value.startsWith("[") && !value.endsWith("]")) {
      const arrayLines = [value];
      while (i + 1 < headerLines.length) {
        i += 1;
        arrayLines.push(headerLines[i]);
        if (headerLines[i].trim().endsWith("]")) break;
      }
      data[key] = parseBracketArray(arrayLines);
      continue;
    }

    data[key] = stripQuotes(value);
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

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "string") return [value];
  return [];
}

function orNull(value) {
  const s = String(value ?? "").trim();
  return s && s !== "unknown" ? s : null;
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
      content,
      toc: buildToc(content),
      sourcePath: path.replace("/content/", "content/"),

      team: data.team || "neutral",
      category: data.category || autoCategory,

      domain: orNull(data.domain),
      section: orNull(data.section),
      type: orNull(data.type),
      angle: orNull(data.angle),
      sourceTrack: orNull(data.sourceTrack || data.source),

      tags: toArray(data.tags),
      sources: toArray(data.sources),

      difficulty: orNull(data.difficulty),

      updatedAt: orNull(data.updatedAt || data.date),
      date: orNull(data.date || data.updatedAt),

      shortDescription: String(data.shortDescription || "").trim(),

      readingTime: data.readingTime ? parseInt(data.readingTime, 10) || null : null,

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
