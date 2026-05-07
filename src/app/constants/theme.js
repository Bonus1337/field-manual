import { Crosshair, Shield, Hash, Radar } from "lucide-react";

export const T = {
  bg: "#070c10",
  bgSidebar: "#04080c",
  bgCard: "#0b1218",
  bgCardHover: "#111c24",
  bgHeader: "#050a0e",
  bgHighlight: "#0f1c26",

  border: "#1a2830",
  borderHover: "#243848",
  borderFocus: "#2e4a60",

  acc: "#14d4c8",
  accDim: "rgba(20,212,200,0.08)",
  accBorder: "rgba(20,212,200,0.22)",
  accGlow: "0 0 12px rgba(20,212,200,0.15)",

  red: "#d95060",
  redDim: "rgba(217,80,96,0.08)",
  redBorder: "rgba(217,80,96,0.22)",
  redGlow: "0 0 12px rgba(217,80,96,0.15)",

  blue: "#4880b8",
  blueDim: "rgba(72,128,184,0.08)",
  blueBorder: "rgba(72,128,184,0.22)",
  blueGlow: "0 0 12px rgba(72,128,184,0.15)",

  gen: "#14d4c8",
  genDim: "rgba(20,212,200,0.08)",
  genBorder: "rgba(20,212,200,0.22)",
  genGlow: "0 0 12px rgba(20,212,200,0.12)",

  neutral: "#506070",
  neutralDim: "rgba(80,96,112,0.08)",
  neutralBorder: "rgba(80,96,112,0.22)",
  neutralGlow: "0 0 12px rgba(80,96,112,0.12)",

  amber: "#c89040",
  amberDim: "rgba(200,144,64,0.08)",
  amberBorder: "rgba(200,144,64,0.22)",
  amberGlow: "0 0 12px rgba(200,144,64,0.12)",

  cyan: "#14d4c8",
  cyanDim: "rgba(20,212,200,0.08)",
  cyanBorder: "rgba(20,212,200,0.22)",
  cyanGlow: "0 0 12px rgba(20,212,200,0.12)",

  textBright: "#d4e8f0",
  text: "#8ab0c8",
  textMuted: "#506a80",
  textDim: "#283c50",

  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "system-ui, -apple-system, sans-serif",
  radiusSm: "3px",
  radiusMd: "6px",
  radiusLg: "10px",
  transition: "all 0.15s cubic-bezier(0.4,0,0.2,1)",
};

export function normalizeTeam(team) {
  const s = String(team || "")
    .toLowerCase()
    .trim();
  if (s === "red") return "red";
  if (s === "blue") return "blue";
  if (s === "red-blue" || s === "redblue" || s === "purple") return "red-blue";
  if (s === "neutral" || s === "gen" || s === "general") return "neutral";
  return "neutral";
}

export function ts(team) {
  const t = normalizeTeam(team);

  if (t === "red")
    return {
      key: "red",
      color: T.red,
      dim: T.redDim,
      border: T.redBorder,
      glow: T.redGlow,
      label: "RED",
      Icon: Crosshair,
    };

  if (t === "blue")
    return {
      key: "blue",
      color: T.blue,
      dim: T.blueDim,
      border: T.blueBorder,
      glow: T.blueGlow,
      label: "BLUE",
      Icon: Shield,
    };

  if (t === "red-blue")
    return {
      key: "red-blue",
      color: T.acc,
      dim: T.accDim,
      border: T.accBorder,
      glow: T.accGlow,
      label: "General",
      Icon: Radar,
    };

  return {
    key: "neutral",
    color: T.neutral,
    dim: T.neutralDim,
    border: T.neutralBorder,
    glow: T.neutralGlow,
    label: "NEUTRAL",
    Icon: Hash,
  };
}

export function getAccentByDomain(domain) {
  const d = String(domain || "").toLowerCase();
  if (d.includes("web-pentesting")) return T.red;
  if (d.includes("web-security")) return T.red;
  if (d.includes("labs")) return T.amber;
  if (d.includes("soc") || d.includes("defensive")) return T.blue;
  if (d.includes("cloud")) return T.blue;
  if (d.includes("network") || d.includes("infrastructure")) return T.acc;
  if (d.includes("osint") || d.includes("cti")) return T.amber;
  if (d.includes("tools")) return T.acc;
  if (d.includes("start")) return T.acc;
  if (d.includes("certifications")) return T.acc;
  if (d.includes("career") || d.includes("mindset")) return T.neutral;
  return T.acc;
}

export function getAccentByTeamOrDomain(team, domain) {
  const t = normalizeTeam(team);
  if (t === "red") return T.red;
  if (t === "blue") return T.blue;
  if (t === "red-blue") return T.acc;
  return getAccentByDomain(domain);
}
