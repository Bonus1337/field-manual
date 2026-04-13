import { Crosshair, Shield, Hash } from "lucide-react";

export const T = {
  bg: "#07090f",
  bgSidebar: "#04060a",
  bgCard: "#0c1018",
  bgCardHover: "#111827",
  bgHeader: "#05070c",
  border: "#1a2636",
  borderHover: "#253850",
  red: "#ff3a5c",
  redDim: "rgba(255,58,92,0.10)",
  redBorder: "rgba(255,58,92,0.35)",
  redGlow: "0 0 16px rgba(255,58,92,0.18), 0 0 4px rgba(255,58,92,0.12)",
  blue: "#38bdf8",
  blueDim: "rgba(56,189,248,0.08)",
  blueBorder: "rgba(56,189,248,0.30)",
  blueGlow: "0 0 16px rgba(56,189,248,0.15), 0 0 4px rgba(56,189,248,0.10)",
  gen: "#22c55e",
  genDim: "rgba(34,197,94,0.07)",
  genBorder: "rgba(34,197,94,0.25)",
  genGlow: "0 0 16px rgba(34,197,94,0.12)",
  amber: "#f59e0b",
  cyan: "#a5f3fc",
  text: "#8b9cb5",
  textBright: "#e2e8f0",
  textMuted: "#3d5068",
  textDim: "#1e2d3d",
  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
};

export function ts(team) {
  if (team === "red") {
    return {
      color: T.red,
      dim: T.redDim,
      border: T.redBorder,
      glow: T.redGlow,
      label: "RED",
      Icon: Crosshair,
    };
  }
  if (team === "blue") {
    return {
      color: T.blue,
      dim: T.blueDim,
      border: T.blueBorder,
      glow: T.blueGlow,
      label: "BLUE",
      Icon: Shield,
    };
  }
  return {
    color: T.gen,
    dim: T.genDim,
    border: T.genBorder,
    glow: T.genGlow,
    label: "GEN",
    Icon: Hash,
  };
}
