function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeText(str) {
  return String(str ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function unwrapElement(el) {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

function stripPresentationAttrs(root) {
  const allowedClasses = new Set(["export-code-block", "export-code-lang"]);

  root.querySelectorAll("*").forEach((el) => {
    el.removeAttribute("style");

    if (el.classList?.length) {
      const keep = Array.from(el.classList).filter((cls) => allowedClasses.has(cls));
      if (keep.length) {
        el.className = keep.join(" ");
      } else {
        el.removeAttribute("class");
      }
    }
  });
}

function removeTopMetaBar(clone) {
  const first = clone.firstElementChild;
  if (!first || first.tagName !== "DIV") return;

  const spans = first.querySelectorAll("span");
  const hasButtons = first.querySelector("button");
  const hasBadgesLikeRow = spans.length >= 2 && !hasButtons;

  if (hasBadgesLikeRow) {
    first.remove();
  }
}

function removeDuplicateTitle(clone, doc) {
  const firstH1 = clone.querySelector("h1");
  if (!firstH1) return;

  const h1Text = normalizeText(firstH1.textContent);
  const docTitle = normalizeText(doc?.title);

  if (h1Text && docTitle && h1Text === docTitle) {
    firstH1.remove();
  }
}

function removeBottomNav(clone) {
  const topChildren = Array.from(clone.children);
  const lastChild = topChildren[topChildren.length - 1];

  if (lastChild && lastChild.tagName === "DIV" && lastChild.querySelector("button")) {
    lastChild.remove();
  }
}

function normalizeHeadings(clone) {
  clone.querySelectorAll("h2, h3, h4, h5, h6").forEach((heading) => {
    const first = heading.firstElementChild;
    if (!first || first.tagName !== "SPAN") return;

    const txt = first.textContent.trim();
    if (/^#{1,6}$/.test(txt)) {
      first.remove();
    }
  });
}

function normalizeLists(clone) {
  clone.querySelectorAll("li").forEach((li) => {
    const first = li.firstElementChild;

    if (
      first &&
      first.tagName === "SPAN" &&
      ["›", "•", "-", "–", "—"].includes(first.textContent.trim())
    ) {
      first.remove();
    }

    const children = Array.from(li.children);

    if (children.length === 1 && children[0].tagName === "SPAN") {
      unwrapElement(children[0]);
    }
  });
}

function convertCodeBlocks(clone) {
  const pres = Array.from(clone.querySelectorAll("pre"));

  for (const pre of pres) {
    const parent = pre.parentElement;
    if (!parent || !parent.isConnected) continue;
    if (parent.classList?.contains("export-code-block")) continue;

    const directChildren = Array.from(parent.children);
    if (!directChildren.includes(pre)) continue;

    const codeEl = pre.querySelector("code");
    if (!codeEl) continue;

    const siblings = directChildren.filter((el) => el !== pre);
    if (!siblings.length) continue;

    const looksLikeUiCodeBlock = siblings.some((el) => {
      const text = (el.textContent || "").trim();
      return (
        el.querySelector("button") || text.includes("●") || /copy|copied/i.test(text)
      );
    });

    if (!looksLikeUiCodeBlock) continue;

    let lang = "";
    const headerDiv = siblings.find((el) => el.tagName === "DIV");

    if (headerDiv) {
      const possibleLabels = Array.from(headerDiv.querySelectorAll("span, div"))
        .map((el) => el.textContent.trim())
        .filter(Boolean);

      lang =
        possibleLabels.find(
          (txt) =>
            /^[a-z0-9._+-]{1,20}$/i.test(txt) &&
            !["copy", "copied"].includes(txt.toLowerCase()) &&
            !txt.includes("●")
        ) || "";
    }

    const wrapper = document.createElement("div");
    wrapper.className = "export-code-block";

    if (lang && lang.toLowerCase() !== "code") {
      const langDiv = document.createElement("div");
      langDiv.className = "export-code-lang";
      langDiv.textContent = lang;
      wrapper.appendChild(langDiv);
    }

    const newPre = document.createElement("pre");
    const newCode = document.createElement("code");
    newCode.textContent = codeEl.textContent ?? pre.textContent ?? "";
    newPre.appendChild(newCode);
    wrapper.appendChild(newPre);

    parent.replaceWith(wrapper);
  }
}

function unwrapImageButtons(clone) {
  clone.querySelectorAll("button").forEach((btn) => {
    const img = btn.querySelector("img");
    if (img) {
      btn.replaceWith(img.cloneNode(true));
    } else {
      btn.remove();
    }
  });
}

function removeDialogs(clone) {
  clone.querySelectorAll("[role='dialog']").forEach((el) => el.remove());
}

function buildCleanHTML(articleEl, doc) {
  const clone = articleEl.cloneNode(true);

  removeTopMetaBar(clone);
  removeDuplicateTitle(clone, doc);
  removeBottomNav(clone);
  normalizeHeadings(clone);
  normalizeLists(clone);
  convertCodeBlocks(clone);
  unwrapImageButtons(clone);
  removeDialogs(clone);
  stripPresentationAttrs(clone);

  return clone.innerHTML;
}

export function exportAsPDF(doc, articleRef) {
  if (!articleRef?.current || !doc) return;

  const articleHTML = buildCleanHTML(articleRef.current, doc);
  const date = doc.updatedAt || new Date().toISOString().split("T")[0];

  const teamLabel =
    doc.team === "red" ? "Red Team" : doc.team === "blue" ? "Blue Team" : "General";

  const teamColor =
    doc.team === "red" ? "#e11d48" : doc.team === "blue" ? "#0284c7" : "#64748b";

  const badges = [
    doc.team
      ? `<span class="badge" style="border-color:${teamColor}55;background:${teamColor}14;color:${teamColor}">${teamLabel}</span>`
      : "",
    doc.difficulty
      ? `<span class="badge">⚡ ${escapeHtml(String(doc.difficulty))}</span>`
      : "",
    date ? `<span class="badge">📅 ${escapeHtml(date)}</span>` : "",
    ...(doc.tags?.map((tag) => `<span class="badge">${escapeHtml(tag)}</span>`) ?? []),
  ]
    .filter(Boolean)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(doc.title)} - Red/Blue Field Manual</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
      font-size: 14px;
      line-height: 1.75;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }

    body {
      min-height: 100vh;
    }

    .page {
      max-width: 820px;
      margin: 0 auto;
      padding: 2.5rem 3rem;
    }

    .doc-header {
      margin-bottom: 2.5rem;
      padding-bottom: 1.75rem;
      border-bottom: 2px solid #e2e8f0;
      padding-left: 1.25rem;
      border-left: 4px solid ${teamColor};
    }

    .doc-brand {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 0.5rem;
    }

    .doc-title {
      font-size: 1.8rem;
      font-weight: 800;
      line-height: 1.2;
      color: #0f172a;
      margin-bottom: 1rem;
    }

    .doc-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .badge {
      display: inline-block;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 600;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #334155;
    }

    main {
      color: #0f172a;
    }

    main h1, main h2, main h3, main h4, main h5, main h6 {
      color: #0f172a;
      font-weight: 800;
      line-height: 1.3;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
    }

    main h1 {
      font-size: 1.45rem;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 0.4rem;
    }

    main h2 {
      font-size: 1.2rem;
    }

    main h3 {
      font-size: 1rem;
      color: #1e293b;
    }

    main h4 {
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #475569;
    }

    main p {
      margin: 0 0 0.95rem 0;
      color: #334155;
    }

    main span {
      color: inherit;
    }

    main a {
      color: #0369a1;
      text-decoration: underline;
      text-underline-offset: 2px;
      word-break: break-word;
    }

    main strong {
      color: #0f172a;
      font-weight: 700;
    }

    main em {
      color: #334155;
      font-style: italic;
    }

    main ul, main ol {
      margin: 0 0 1rem 0;
      padding-left: 1.5rem;
    }

    main ul {
      list-style: disc;
    }

    main ul ul {
      list-style: circle;
    }

    main ol {
      list-style: decimal;
    }

    main li {
      margin-bottom: 0.3rem;
      color: #334155;
    }

    main li > ul, main li > ol {
      margin-top: 0.3rem;
      margin-bottom: 0;
    }

    main hr {
      border: none;
      border-top: 1px solid #cbd5e1;
      margin: 1.75rem 0;
    }

    :not(pre) > code {
      font-family: "JetBrains Mono", "Cascadia Code", "Fira Code", monospace;
      font-size: 0.82em;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 0.12em 0.42em;
      color: #0f172a;
      word-break: break-word;
    }

    .export-code-block {
      margin: 1.25rem 0;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      overflow: hidden;
      page-break-inside: avoid;
    }

    .export-code-lang {
      display: block;
      padding: 0.35rem 1rem;
      font-size: 0.65rem;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #475569;
      background: #e2e8f0;
      border-bottom: 1px solid #cbd5e1;
      font-weight: 700;
    }

    .export-code-block pre {
      margin: 0;
      padding: 0.95rem 1rem;
      overflow-x: auto;
      background: #f8fafc;
    }

    .export-code-block pre code {
      font-family: "JetBrains Mono", "Cascadia Code", "Fira Code", monospace;
      font-size: 0.82rem;
      line-height: 1.65;
      color: #0f172a;
      background: none;
      border: none;
      padding: 0;
      white-space: pre;
    }

    main table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.25rem 0;
      font-size: 0.875rem;
      page-break-inside: avoid;
    }

    main th {
      background: #e2e8f0;
      color: #334155;
      font-weight: 700;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 0.55rem 0.85rem;
      border: 1px solid #cbd5e1;
      text-align: left;
    }

    main td {
      padding: 0.55rem 0.85rem;
      border: 1px solid #cbd5e1;
      color: #334155;
      vertical-align: top;
      background: #ffffff;
    }

    main tr:nth-child(even) td {
      background: #f8fafc;
    }

    main blockquote {
      border-left: 4px solid #f59e0b;
      background: #fffbeb;
      padding: 0.75rem 1rem;
      margin: 1.25rem 0;
      border-radius: 0 6px 6px 0;
      page-break-inside: avoid;
    }

    main blockquote p {
      color: #78350f;
      margin: 0;
    }

    main img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      display: block;
      margin: 1.25rem auto;
      page-break-inside: avoid;
    }

    .doc-footer {
      margin-top: 3rem;
      padding-top: 1.25rem;
      border-top: 1px solid #e2e8f0;
      font-size: 0.72rem;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    @media print {
      @page {
        margin: 1.5cm 2cm;
        size: A4;
      }

      .page {
        padding: 0;
        max-width: 100%;
      }

      .doc-header, .badge, .export-code-block, .export-code-lang, blockquote,
      th, tr:nth-child(even) td {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      h1, h2, h3 {
        page-break-after: avoid;
      }

      .export-code-block, blockquote, table, img {
        page-break-inside: avoid;
      }
    }

    @media screen {
      .print-hint {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        background: #0f172a;
        color: #f8fafc;
        font-size: 0.75rem;
        padding: 0.65rem 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .print-hint kbd {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 0.1rem 0.4rem;
        font-family: monospace;
        font-size: 0.85em;
      }
    }

    @media print {
      .print-hint {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="doc-header">
      <div class="doc-brand">Red/Blue Field Manual · Bonus1337</div>
      <div class="doc-title">${escapeHtml(doc.title)}</div>
      <div class="doc-badges">${badges}</div>
    </header>

    <main>${articleHTML}</main>

    <footer class="doc-footer">
      <span>Red/Blue Field Manual · Bonus1337</span>
      <span>Eksport: ${new Date().toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</span>
    </footer>
  </div>

  <div class="print-hint">
    <span>Zapisz jako PDF:</span>
    <kbd>Ctrl</kbd>+<kbd>P</kbd> → Drukarka: Zapisz jako PDF
    <button onclick="this.parentElement.remove()" style="margin-left:0.5rem;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:1rem;line-height:1;">×</button>
  </div>

  <script>
    window.addEventListener("load", () => {
      setTimeout(() => window.print(), 400);
    });
  </script>
</body>
</html>`;

  const win = window.open("", "_blank");

  if (!win) {
    alert(
      "Przeglądarka zablokowała popup.\\nZezwól na popupy dla tej strony i spróbuj ponownie."
    );
    return;
  }

  win.document.write(html);
  win.document.close();
}

export function exportAsMD(doc) {
  if (!doc?.content) return;

  const blob = new Blob([doc.content], {
    type: "text/markdown;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.id}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
