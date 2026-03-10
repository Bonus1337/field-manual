function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function buildCleanHTML(articleEl) {
  const clone = articleEl.cloneNode(true);

  clone.querySelectorAll("div").forEach((div) => {
    if (
      div.className &&
      typeof div.className === "string" &&
      div.className.includes("amber")
    ) {
      div.remove();
    }
  });

  const firstDiv = clone.querySelector("div");
  if (firstDiv && firstDiv.className && firstDiv.className.includes("mb-4")) {
    firstDiv.remove();
  }

  const topChildren = Array.from(clone.children);
  const lastChild = topChildren[topChildren.length - 1];
  if (lastChild && lastChild.tagName === "DIV" && lastChild.querySelector("button")) {
    lastChild.remove();
  }

  const outerDivs = Array.from(clone.querySelectorAll("div"));
  for (const div of outerDivs) {
    if (!div.isConnected) continue;

    const pre = div.querySelector(":scope > pre");
    if (!pre) continue;

    const headerDiv = Array.from(div.children).find(
      (el) => el !== pre && el.tagName === "DIV" && el.querySelector("button")
    );
    if (!headerDiv) continue;

    const langEl = headerDiv.querySelector("div");
    const lang = langEl ? langEl.textContent.trim() : "";

    const codeEl = pre.querySelector("code");
    const codeText = codeEl ? codeEl.textContent : pre.textContent;

    const wrapper = document.createElement("div");
    wrapper.className = "export-code-block";

    if (lang && lang !== "code") {
      const langDiv = document.createElement("div");
      langDiv.className = "export-code-lang";
      langDiv.textContent = lang;
      wrapper.appendChild(langDiv);
    }

    const newPre = document.createElement("pre");
    const newCode = document.createElement("code");
    newCode.textContent = codeText;
    newPre.appendChild(newCode);
    wrapper.appendChild(newPre);

    div.replaceWith(wrapper);
  }

  clone.querySelectorAll("button").forEach((btn) => {
    const img = btn.querySelector("img");
    if (img) {
      btn.replaceWith(img.cloneNode(true));
    } else {
      btn.remove();
    }
  });

  clone.querySelectorAll("[role='dialog']").forEach((el) => el.remove());

  return clone.innerHTML;
}

export function exportAsPDF(doc, articleRef) {
  if (!articleRef?.current || !doc) return;

  const articleHTML = buildCleanHTML(articleRef.current);
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
  <title>${escapeHtml(doc.title)} — Red/Blue Field Manual</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
      font-size: 14px;
      line-height: 1.75;
      color: #1e293b;
      background: #ffffff;
    }

    .page {
      max-width: 820px;
      margin: 0 auto;
      padding: 2.5rem 3rem;
    }

    .doc-header {
      margin-bottom: 2.5rem;
      padding-bottom: 1.75rem;
      border-bottom: 2px solid #f1f5f9;
      padding-left: 1.25rem;
      border-left: 4px solid ${teamColor};
    }

    .doc-brand {
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #94a3b8;
      margin-bottom: 0.5rem;
    }

    .doc-title {
      font-size: 1.8rem;
      font-weight: 700;
      line-height: 1.2;
      color: #0f172a;
      margin-bottom: 1rem;
    }

    .doc-badges { display: flex; flex-wrap: wrap; gap: 0.4rem; }

    .badge {
      display: inline-block;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 500;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      color: #475569;
    }

    h1, h2, h3, h4, h5, h6 {
      color: #0f172a;
      font-weight: 700;
      line-height: 1.3;
      margin-top: 2rem;
      margin-bottom: 0.6rem;
    }
    h1 { font-size: 1.45rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.4rem; }
    h2 { font-size: 1.2rem; }
    h3 { font-size: 1rem; color: #334155; }
    h4 { font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.07em; color: #64748b; }

    p { margin-bottom: 0.85rem; color: #334155; }

    a { color: #0284c7; text-decoration: underline; text-underline-offset: 2px; }
    strong { color: #0f172a; font-weight: 600; }
    em { color: #475569; }

    ul, ol { padding-left: 1.5rem; margin-bottom: 1rem; }
    li { margin-bottom: 0.3rem; color: #334155; }
    li > ul, li > ol { margin-top: 0.3rem; margin-bottom: 0; }

    :not(pre) > code, code.inline-flex {
      font-family: "JetBrains Mono", "Cascadia Code", "Fira Code", monospace;
      font-size: 0.82em;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 0.12em 0.42em;
      color: #0f172a;
      word-break: break-all;
    }

    .export-code-block {
      margin: 1.25rem 0;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      overflow: hidden;
      page-break-inside: avoid;
    }

    .export-code-lang {
      display: block;
      padding: 0.3rem 1rem;
      font-size: 0.65rem;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #94a3b8;
      background: #f1f5f9;
      border-bottom: 1px solid #e2e8f0;
    }

    .export-code-block pre {
      margin: 0;
      padding: 0.9rem 1rem;
      overflow-x: auto;
    }

    .export-code-block pre code {
      font-family: "JetBrains Mono", "Cascadia Code", "Fira Code", monospace;
      font-size: 0.8rem;
      line-height: 1.65;
      color: #1e293b;
      background: none;
      border: none;
      padding: 0;
      white-space: pre;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.25rem 0;
      font-size: 0.875rem;
      page-break-inside: avoid;
    }
    th {
      background: #f1f5f9;
      color: #475569;
      font-weight: 600;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 0.5rem 0.85rem;
      border: 1px solid #e2e8f0;
      text-align: left;
    }
    td {
      padding: 0.5rem 0.85rem;
      border: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: top;
    }
    tr:nth-child(even) td { background: #f8fafc; }

    blockquote {
      border-left: 4px solid #f59e0b;
      background: #fffbeb;
      padding: 0.75rem 1rem;
      margin: 1.25rem 0;
      border-radius: 0 6px 6px 0;
      page-break-inside: avoid;
    }
    blockquote p { color: #92400e; margin: 0; }

    img {
      max-width: 100%;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      display: block;
      margin: 1.25rem auto;
      page-break-inside: avoid;
    }

    hr { border: none; border-top: 1px solid #f1f5f9; margin: 1.75rem 0; }

    .doc-footer {
      margin-top: 3rem;
      padding-top: 1.25rem;
      border-top: 1px solid #f1f5f9;
      font-size: 0.7rem;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    @media print {
      @page { margin: 1.5cm 2cm; size: A4; }
      .page { padding: 0; max-width: 100%; }

      .doc-header, .badge, .export-code-block, .export-code-lang, blockquote,
      th, tr:nth-child(even) td {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      h1, h2, h3 { page-break-after: avoid; }
      .export-code-block, blockquote, table { page-break-inside: avoid; }
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
    @media print { .print-hint { display: none; } }
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
      <span>Eksport: ${new Date().toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })}</span>
    </footer>
  </div>

  <div class="print-hint">
    <span>Zapisz jako PDF:</span>
    <kbd>Ctrl</kbd>+<kbd>P</kbd> → Drukarka: Zapisz jako PDF
    <button onclick="this.parentElement.remove()" style="margin-left:0.5rem;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:1rem;line-height:1;">×</button>
  </div>

  <script>
    window.addEventListener('load', () => {
      setTimeout(() => window.print(), 400);
    });
  </script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    alert(
      "Przeglądarka zablokowała popup.\nZezwól na popupy dla tej strony i spróbuj ponownie."
    );
    return;
  }
  win.document.write(html);
  win.document.close();
}

export function exportAsMD(doc) {
  if (!doc?.content) return;
  const blob = new Blob([doc.content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.id}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
