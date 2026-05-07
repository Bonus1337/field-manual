export function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractExplicitId(rawText = "") {
  const m = rawText.match(/\s*\{#([a-z0-9\-_]+)\}\s*$/i);
  if (!m) return { text: rawText.trim(), id: null };
  return {
    text: rawText.replace(m[0], "").trim(),
    id: m[1],
  };
}

export function buildToc(markdown = "", { minLevel = 2, maxLevel = 3 } = {}) {
  const lines = markdown.split("\n");
  const used = new Map();
  const toc = [];
  let inFrontmatter = false;
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (i === 0 && line.trim() === "---") {
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter) {
      if (line.trim() === "---") inFrontmatter = false;
      continue;
    }

    if (line.match(/^\s*(```|~~~)/)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const hMatch = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!hMatch) continue;

    const level = hMatch[1].length;
    const rawText = hMatch[2].trim();

    if (level < minLevel || level > maxLevel) continue;

    const { text, id: explicitId } = extractExplicitId(rawText);
    if (!text) continue;

    let id = explicitId ?? slugify(text);
    if (!id) continue;

    const prev = used.get(id) ?? 0;
    used.set(id, prev + 1);
    if (prev > 0) id = `${id}-${prev + 1}`;

    toc.push({ text, id, level });
  }

  if (toc.length > 0) {
    const baseLevel = Math.min(...toc.map((t) => t.level));
    for (const item of toc) {
      item.depth = item.level - baseLevel;
    }
  }

  return toc;
}
