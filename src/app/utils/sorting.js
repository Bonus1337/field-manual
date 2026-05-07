import { DIFF_ORDER, DIFF_LABEL } from "../constants/config";
import { titleize } from "./textHelpers";

export function parseSortableDate(doc) {
  const v = doc && typeof doc === "object" ? doc.updatedAt || doc.date : doc;

  if (!v) return 0;
  const t = Date.parse(String(v));
  return Number.isNaN(t) ? 0 : t;
}

export function sortDocsByDateAscThenTitle(a, b) {
  const da = parseSortableDate(a);
  const db = parseSortableDate(b);
  if (da !== db) return da - db;
  return String(a?.title || "").localeCompare(String(b?.title || ""));
}

export function sortDocsByDateDescThenTitle(a, b) {
  const da = parseSortableDate(a);
  const db = parseSortableDate(b);
  if (da !== db) return db - da;
  return String(a?.title || "").localeCompare(String(b?.title || ""));
}

export function sortByDateDesc(a, b) {
  return parseSortableDate(b) - parseSortableDate(a);
}

export function normalizeDifficulty(v) {
  if (!v) return "unrated";
  const s = String(v).trim().toLowerCase();
  return s || "unrated";
}

export function labelDifficulty(v) {
  const k = normalizeDifficulty(v);
  return DIFF_LABEL[k] || titleize(k);
}

export function sortByDifficulty(platform, a, b) {
  const order = DIFF_ORDER[platform] || [];
  const ia = order.indexOf(normalizeDifficulty(a));
  const ib = order.indexOf(normalizeDifficulty(b));
  const idxA = ia === -1 ? 999 : ia;
  const idxB = ib === -1 ? 999 : ib;
  if (idxA !== idxB) return idxA - idxB;
  return String(a || "").localeCompare(String(b || ""));
}
