export const ABOUT_COPY = {
  pl: {
    terminal: "cat operator-profile.md",
    terminalSub: "BONUS1337 · cyber field manual",
    sectionLabel: "operator profile",
    location: "Warszawa, PL",

    headline1: "Cybersecurity Operator.",
    headline2: "SOC, Offensive Security & AI Automation.",

    bio: "Buduję swoje kompetencje na przecięciu SOC, ofensywnego testowania bezpieczeństwa, software engineeringu, AI security i automatyzacji. Na co dzień patrzę na systemy jak operator bezpieczeństwa: analizuję incydenty, rozumiem detekcję, pracuję z SIEM oraz IDS/IPS i potrafię przełożyć techniczne zdarzenia na dokumentację zrozumiałą dla osób decyzyjnych. Równolegle rozwijam ofensywne podejście do aplikacji i infrastruktury - od rekonesansu, przez exploitację, po raportowanie realnego wpływu biznesowego. Dzięki doświadczeniu developerskiemu i pracy z AI/automation, w tym n8n oraz IBM WatsonX, nie patrzę na bezpieczeństwo jak na checklistę. Patrzę na nie jak na system zależności: kod, dane, procesy, ludzie, detekcja, automatyzacja i ryzyko.",

    pills: {
      soc: "SOC · Detection · Response",
      insider: "Sekurak Insider",
      certs: "eJPT · ICCA",
      ai: "AI Security · Automation",
    },

    insider: {
      title: "Sekurak Insider",
      badge: "selected · active",
      descBefore: "Wybrany do współpracy z ",
      descLinkLabel: "Sekurak",
      descLinkHref: "https://sekurak.pl",
      descAfter:
        " - jednym z najważniejszych polskich projektów edukacyjnych w cyberbezpieczeństwie. W ramach tej ścieżki tworzę materiały, porządkuję wiedzę techniczną i rozwijam podejście, które łączy praktyczne testowanie bezpieczeństwa z komunikacją zrozumiałą dla ludzi spoza zespołu technicznego.",
      sub: "education · community · practical security · content creation",
    },

    sections: {
      certs: "certifications · proof of practice",
      certNote:
        "certyfikaty i szkolenia traktuję jako potwierdzenie praktyki, nie jako substytut realnego myślenia technicznego",
      experience: "doświadczenie zawodowe",
      skills: "obszary techniczne",
      philosophy: "operator philosophy",
      contact: "contact · external channels",
    },

    skills: {
      red: "offensive security",
      blue: "SOC · detection · response",
      dev: "software engineering",
      ai: "AI security",
      automation: "automation · AI workflows",
    },

    ui: {
      expand: "szczegóły",
      collapse: "zwiń",
      finalPrompt: '$ echo "final_note"',
      finalNote:
        "Ten Field Manual jest moim publicznym śladem pracy: miejscem, w którym porządkuję praktyczne doświadczenia z SOC, pentestingu, developmentu, AI security i automatyzacji. Nie buduję go po to, żeby wyglądać jak ktoś, kto zna każdą odpowiedź. Buduję go po to, żeby pokazać coś znacznie ważniejszego: sposób myślenia. W cyberbezpieczeństwie narzędzia, payloady i certyfikaty mają znaczenie, ale dopiero proces robi różnicę - obserwacja, hipoteza, test, dowód, wpływ, rekomendacja. To jest podejście, które chcę rozwijać i wnosić do zespołów, projektów oraz społeczności security.",
    },

    philosophy: [
      {
        prefix: "$ observe",
        text: "Najpierw patrzę na system. Jak jest zbudowany, co ujawnia, gdzie zachowuje się inaczej niż powinien. Dobra analiza zaczyna się od obserwacji, nie od odpalania narzędzi.",
        team: "blue",
      },
      {
        prefix: "$ connect",
        text: "Łączę perspektywę SOC, developera, pentestera i osoby budującej automatyzacje. Dzięki temu widzę nie tylko pojedynczą podatność, ale cały kontekst: kod, dane, proces, detekcję i wpływ na organizację.",
        team: "acc",
      },
      {
        prefix: "$ exploit",
        text: "Eksploitacja nie jest dla mnie sztuczką z payloadem. To kontrolowany proces udowodnienia, że dana luka ma realny wpływ na poufność, integralność albo dostępność systemu.",
        team: "red",
      },
      {
        prefix: "$ automate",
        text: "Automatyzacja ma sens wtedy, gdy porządkuje proces, zmniejsza liczbę błędów i przyspiesza decyzje. n8n, API, AI pipeline'y i Python traktuję jako narzędzia do budowania przewagi operacyjnej, nie jako zabawki do demo.",
        team: "acc",
      },
      {
        prefix: "$ communicate",
        text: "Podatność bez dobrego opisu jest tylko ciekawostką techniczną. Wartość pojawia się dopiero wtedy, gdy potrafię pokazać wpływ, dowód działania, ryzyko i konkretną drogę naprawy.",
        team: "neutral",
      },
    ],
  },

  en: {
    terminal: "cat operator-profile.md",
    terminalSub: "BONUS1337 · cyber field manual",
    sectionLabel: "operator profile",
    location: "Warsaw, PL",

    headline1: "Cybersecurity Operator.",
    headline2: "SOC, Offensive Security & AI Automation.",

    bio: "I build my skills at the intersection of SOC operations, offensive security testing, software engineering, AI security and automation. My day-to-day work is rooted in operational security: incident analysis, detection, SIEM, IDS/IPS and documentation understandable to decision-makers. In parallel, I develop an offensive approach to testing applications and infrastructure - from reconnaissance and exploitation to reporting real business impact. Thanks to my developer background and experience with AI/automation, including n8n and IBM WatsonX, I do not look at security as a checklist. I look at it as a system of dependencies: code, data, processes, people, detection, automation and risk.",

    pills: {
      soc: "SOC · Detection · Response",
      insider: "Sekurak Insider",
      certs: "eJPT · ICCA",
      ai: "AI Security · Automation",
    },

    insider: {
      title: "Sekurak Insider",
      badge: "selected · active",
      descBefore: "Selected to collaborate with ",
      descLinkLabel: "Sekurak",
      descLinkHref: "https://sekurak.pl",
      descAfter:
        " - one of Poland's most important cybersecurity education projects. Through this path, I create educational content, structure technical knowledge and develop an approach that combines practical security testing with communication understandable to people outside purely technical teams.",
      sub: "education · community · practical security · content creation",
    },

    sections: {
      certs: "certifications · proof of practice",
      certNote:
        "I treat certifications and training as proof of practice, not as a replacement for real technical thinking",
      experience: "work experience",
      skills: "technical domains",
      philosophy: "operator philosophy",
      contact: "contact · external channels",
    },

    skills: {
      red: "offensive security",
      blue: "SOC · detection · response",
      dev: "software engineering",
      ai: "AI security",
      automation: "automation · AI workflows",
    },

    ui: {
      expand: "details",
      collapse: "collapse",
      finalPrompt: '$ echo "final_note"',
      finalNote:
        "This Field Manual is my public trace of work: a place where I structure practical experience from SOC operations, pentesting, development, AI security and automation. I am not building it to look like someone who knows every answer. I am building it to show something much more important: a way of thinking. In cybersecurity, tools, payloads and certifications matter, but process is what makes the difference - observation, hypothesis, test, proof, impact, recommendation. This is the approach I want to keep developing and bring into teams, projects and the security community.",
    },

    philosophy: [
      {
        prefix: "$ observe",
        text: "I start by observing the system: how it is built, what it exposes and where it behaves differently than expected. Good analysis starts with observation, not with running tools.",
        team: "blue",
      },
      {
        prefix: "$ connect",
        text: "I combine the perspective of a SOC analyst, developer, pentester and automation builder. This helps me see not only a single vulnerability, but the full context: code, data, process, detection and organizational impact.",
        team: "acc",
      },
      {
        prefix: "$ exploit",
        text: "Exploitation is not a payload trick. It is a controlled process of proving that a vulnerability has real impact on confidentiality, integrity or availability.",
        team: "red",
      },
      {
        prefix: "$ automate",
        text: "Automation makes sense when it structures a process, reduces mistakes and speeds up decisions. I treat n8n, APIs, AI pipelines and Python as tools for building operational advantage, not as demo toys.",
        team: "acc",
      },
      {
        prefix: "$ communicate",
        text: "A vulnerability without a clear explanation is just a technical curiosity. Value appears when I can show impact, proof of concept, risk and a concrete path to remediation.",
        team: "neutral",
      },
    ],
  },
};

export function getAboutCopy(safeLang) {
  return ABOUT_COPY[safeLang] ?? ABOUT_COPY.pl;
}
