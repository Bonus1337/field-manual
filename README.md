# Red/Blue Field Manual

Praktyczne notatki (PL/EN) dla ludzi, którzy chcą mieć pod ręką:

- workflow (recon → enum → exploit → post → report)
- defensywę (hardening / log hunting)
- krótkie “field notes” zamiast encyklopedii

**Maintained by Bonus1337.** PRs welcome.

## Live

## Local dev

```bash
npm install
npm run dev
```

## Add a new note

1. Dodaj markdown do:

- `content/pl/<topic>/<name>.md`
- `content/en/<topic>/<name>.md`

2. Frontmatter (minimum):

---

id: unique-id
title: "Human title"
team: red|blue|neutral
category: General|Reconnaissance|Hardening|Threat Hunting|...
tags: ["tag1","tag2"]
difficulty: easy|medium|hard
updatedAt: "YYYY-MM-DD"

---

## Contributing

- Fix typo / improve procedure → PR
- Keep it short, actionable, with “gotchas” when relevant

## License

MIT
