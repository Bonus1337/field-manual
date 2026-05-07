export const SITE = {
  name: "Red/Blue Field Manual",
  authorLabel: "Bonus1337",
  repoUrl: "https://github.com/Bonus1337/field-manual",
};

export const SECTION_LABELS = {
  vulnerabilities: "Vulnerabilities",
  foundations: "Foundations",
  "auth-security": "Auth Security",
  "client-side": "Client-Side",
  "server-side": "Server-Side",
  "testing-workflows": "Testing Workflows",
  recon: "Recon",
  reporting: "Reporting",
  burp: "Burp Suite",
  scanning: "Scanning",
  enumeration: "Enumeration",
  protocols: "Protocols",
  "email-security": "Email Security",
  "siem-wazuh": "SIEM / Wazuh",
  "incident-response": "Incident Response",
  detection: "Detection",
  "osint-techniques": "OSINT Techniques",
  pivoting: "Pivoting",
  cti: "CTI",
  "cloud-basics": "Cloud Basics",
  iam: "IAM",
  ejpt: "eJPT",
  baw: "BAW",
  writeups: "Writeups",
  ctf: "CTF",
  general: "General",
};

export const TYPE_LABELS = {
  knowledge: "Knowledge",
  workflow: "Workflow",
  writeup: "Writeup",
  playbook: "Playbook",
  reference: "Reference",
  lab: "Lab",
  notes: "Notes",
  tool: "Tool",
};

export const ANGLE_LABELS = {
  "attacker-mindset": "attacker-mindset",
  "defensive-perspective": "defensive-perspective",
  "developer-perspective": "developer-perspective",
  "pentest-workflow": "pentest-workflow",
  "analyst-perspective": "analyst-perspective",
  "both-perspectives": "both-perspectives",
};

export const SOURCE_TRACK_LABELS = {
  baw: "BAW",
  ejpt: "eJPT",
  portswigger: "PortSwigger",
  tryhackme: "TryHackMe",
  htb: "HackTheBox",
  webmaster: "Webmaster",
  original: "Original",
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

    homeView: {
      command: "cat /field-manual/feed.md",
      mode: "operator knowledge base",
      slogan: "Read. Practice. Report. Repeat.",
      title: "Red/Blue Field Manual",
      description:
        "Praktyczna baza wiedzy dla ludzi, którzy chcą rozumieć bezpieczeństwo, a nie tylko kopiować komendy. Web security, pentest workflow, SOC, OSINT, infrastruktura, laby, raportowanie i operatorski mindset.",

      suggestedEntryPoints: "Suggested entry points",
      startHere: "Start here",
      buildProcess: "Build process",
      recentlyUpdated: "Recently updated",

      documents: "Documents",
      redTeam: "Red Team",
      blueTeam: "Blue Team",
      redBlue: "General",
      neutral: "Neutral",
      domains: "Domains",

      team: "Team",
      domain: "Domain",
      all: "All",
      allDomains: "All domains",

      exploreKnowledgeDomains: "Explore knowledge domains",
      chooseYourPath: "Choose your path",

      currentFeed: "Current feed",
      resetFilters: "Reset filters",
      showEverything: "Show everything",

      result: "wynik",
      results: "wyniki",
      noResultsCommand: 'find . -name "*.md"',
      noResults: "0 wyników",

      startFallback: "Najlepszy pierwszy krok do wejścia w manual.",
      workflowFallback: "Materiały, które uczą procesu, a nie tylko pojedynczych komend.",
      freshFallback: "Najnowszy materiał w manualu.",

      domainLabels: {
        "00_start-here": "Start Here",
        "01_web-security": "Web Security",
        "02_web-pentesting": "Web Pentesting",
        "03_network-infrastructure": "Network Infrastructure",
        "04_cloud-security": "Cloud Security",
        "05_osint-cti": "OSINT & CTI",
        "06_soc-defensive-security": "SOC Defensive Security",
        "07_tools": "Tools",
        "08_certifications": "Certifications",
        "09_labs-writeups": "Labs & Writeups",
        "10_career-mindset": "Career & Mindset",
      },

      domainDescriptions: {
        "00_start-here":
          "Punkt wejścia, manifest, ścieżki nauki i najważniejsze fundamenty.",
        "01_web-security": "Mechanizmy, podatności i bezpieczeństwo aplikacji webowych.",
        "02_web-pentesting":
          "Workflow, testowanie ręczne, Burp, rekonesans i raportowanie.",
        "03_network-infrastructure":
          "Hosty, porty, usługi, skanowanie i enumeracja infrastruktury.",
        "04_cloud-security":
          "Podstawy chmury, modele odpowiedzialności i bezpieczeństwo środowisk cloud.",
        "05_osint-cti": "OSINT, CTI, pivotowanie, analiza i techniczny recon.",
        "06_soc-defensive-security": "SOC, phishing, Wazuh, detekcja i defensywa.",
        "07_tools": "Narzędzia, workflow i praktyczne sposoby pracy.",
        "08_certifications": "Notatki i ścieżki pod certyfikacje.",
        "09_labs-writeups": "Writeupy, laby, CTF-y i praktyczne case study.",
        "10_career-mindset":
          "Kariera, mindset, rozwój i praktyczne wejście w cybersecurity.",
      },
    },
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

    homeView: {
      command: "cat /field-manual/feed.md",
      mode: "operator knowledge base",
      slogan: "Read. Practice. Report. Repeat.",
      title: "Red/Blue Field Manual",
      description:
        "A practical knowledge base for people who want to understand security, not just copy commands. Web security, pentest workflow, SOC, OSINT, infrastructure, labs, reporting, and operator mindset.",

      suggestedEntryPoints: "Suggested entry points",
      startHere: "Start here",
      buildProcess: "Build process",
      recentlyUpdated: "Recently updated",

      documents: "Documents",
      redTeam: "Red Team",
      blueTeam: "Blue Team",
      redBlue: "General",
      neutral: "Neutral",
      domains: "Domains",

      team: "Team",
      domain: "Domain",
      all: "All",
      allDomains: "All domains",

      exploreKnowledgeDomains: "Explore knowledge domains",
      chooseYourPath: "Choose your path",

      currentFeed: "Current feed",
      resetFilters: "Reset filters",
      showEverything: "Show everything",

      result: "result",
      results: "results",
      noResultsCommand: 'find . -name "*.md"',
      noResults: "0 results",

      startFallback: "The best first step into the manual.",
      workflowFallback: "Materials that teach the process, not just single commands.",
      freshFallback: "The newest material in the manual.",

      domainLabels: {
        "00_start-here": "Start Here",
        "01_web-security": "Web Security",
        "02_web-pentesting": "Web Pentesting",
        "03_network-infrastructure": "Network Infrastructure",
        "04_cloud-security": "Cloud Security",
        "05_osint-cti": "OSINT & CTI",
        "06_soc-defensive-security": "SOC Defensive Security",
        "07_tools": "Tools",
        "08_certifications": "Certifications",
        "09_labs-writeups": "Labs & Writeups",
        "10_career-mindset": "Career & Mindset",
      },

      domainDescriptions: {
        "00_start-here":
          "Entry point, manifesto, learning paths, and the most important foundations.",
        "01_web-security": "Mechanisms, vulnerabilities, and web application security.",
        "02_web-pentesting":
          "Workflow, manual testing, Burp, reconnaissance, and reporting.",
        "03_network-infrastructure":
          "Hosts, ports, services, scanning, and infrastructure enumeration.",
        "04_cloud-security":
          "Cloud fundamentals, shared responsibility, and cloud environment security.",
        "05_osint-cti": "OSINT, CTI, pivoting, analysis, and technical reconnaissance.",
        "06_soc-defensive-security":
          "SOC, phishing, Wazuh, detection, and defensive security.",
        "07_tools": "Tools, workflows, and practical ways of working.",
        "08_certifications": "Notes and learning paths for certifications.",
        "09_labs-writeups": "Writeups, labs, CTFs, and practical case studies.",
        "10_career-mindset":
          "Career, mindset, growth, and practical entry into cybersecurity.",
      },
    },
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
