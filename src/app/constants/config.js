export const SITE = {
  name: "Red/Blue Field Manual",
  authorLabel: "Bonus1337",
  repoUrl: "https://github.com/Bonus1337/field-manual",
};

export const UI = {
  pl: {
    search: 'szukaj… ("/")',
    edit: "Edytuj",
    updated: "Updated",
    difficulty: "Lvl",
    fallback: "Brak tej wersji językowej - pokazuję dostępną.",
    onThisPage: "NA TEJ STRONIE",
    next: "next",
    prev: "prev",
    start: "PINNED",
    home: "HOME",
  },
  en: {
    search: 'search… ("/")',
    edit: "Edit",
    updated: "Updated",
    difficulty: "Lvl",
    fallback: "No translation available - showing other language.",
    onThisPage: "ON THIS PAGE",
    next: "next",
    prev: "prev",
    start: "PINNED",
    home: "HOME",
  },
};

export const DIFF_ORDER = {
  portswigger: ["apprentice", "practitioner", "expert"],
  tryhackme: ["easy", "medium", "hard"],
};

export const DIFF_LABEL = {
  apprentice: "Apprentice",
  practitioner: "Practitioner",
  expert: "Expert",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const PINNED_ORDER = ["manifesto", "about"];
export const PINNED_SET = new Set(PINNED_ORDER);
