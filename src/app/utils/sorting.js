import { DIFF_ORDER, DIFF_LABEL } from "../constants/config";
import { titleize } from "./textHelpers";

export function parseSortableDate(v) {
  if (!v) return 0;
  const t = Date.parse(String(v));
  return Number.isNaN(t) ? 0 : t;
}

export function sortDocsByDateAscThenTitle(a, b) {
  const da = parseSortableDate(a?.updatedAt);
  const db = parseSortableDate(b?.updatedAt);
  if (da !== db) return da - db;
  return String(a?.title || "").localeCompare(String(b?.title || ""));
}

export function sortByDateDesc(a, b) {
  return parseSortableDate(b?.updatedAt) - parseSortableDate(a?.updatedAt);
}

export function normalizeDifficulty(v) {
  return v ? String(v).trim().toLowerCase() : "unrated";
}

export function labelDifficulty(v) {
  const k = normalizeDifficulty(v);
  return DIFF_LABEL[k] || titleize(k);
}

export function sortByDifficulty(platform, a, b) {
  const order = DIFF_ORDER[platform] || [];
  const va = order.indexOf(normalizeDifficulty(a));
  const vb = order.indexOf(normalizeDifficulty(b));
  const idxA = va === -1 ? 999 : va;
  const idxB = vb === -1 ? 999 : vb;

  if (idxA !== idxB) return idxA - idxB;
  return String(a || "").localeCompare(String(b || ""));
}
