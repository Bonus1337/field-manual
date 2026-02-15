export function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // działa też dla PL
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function buildToc(markdown = "") {
  return markdown
    .split("\n")
    .filter((l) => l.startsWith("## ") || l.startsWith("### "))
    .map((l) => {
      const level = l.startsWith("### ") ? 3 : 2;
      const text = l.replace(/^###?\s+/, "").trim();
      return { text, id: slugify(text), level };
    });
}
