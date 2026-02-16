export function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractExplicitId(rawHeadingText = "") {
  const m = rawHeadingText.match(/\s*\{#([a-z0-9\-_]+)\}\s*$/i);
  if (!m) return { text: rawHeadingText.trim(), id: null };
  return {
    text: rawHeadingText.replace(m[0], "").trim(),
    id: m[1],
  };
}

export function buildToc(markdown = "", { minLevel = 2, maxLevel = 3 } = {}) {
  const lines = markdown.split("\n");

  let inFrontmatter = false;
  let inFence = false;

  const used = new Map();
  const toc = [];

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

    const fenceMatch = line.match(/^\s*(```|~~~)/);
    if (fenceMatch) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const hMatch = line.match(/^(#{2,6})\s+(.+?)\s*$/);
    if (!hMatch) continue;

    const level = hMatch[1].length;
    if (level < minLevel || level > maxLevel) continue;

    const rawText = hMatch[2].trim();
    const { text, id: explicitId } = extractExplicitId(rawText);

    let id = explicitId ?? slugify(text);

    if (!id) continue;

    const prev = used.get(id) ?? 0;
    used.set(id, prev + 1);
    if (prev > 0) id = `${id}-${prev + 1}`;

    toc.push({ text, id, level });
  }

  return toc;
}
