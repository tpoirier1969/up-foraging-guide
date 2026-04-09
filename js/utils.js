export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
export function compactText(value = "", fallback = "Not listed") {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text || fallback;
}
export function slugifyHash(hashValue = "") {
  return hashValue.replace(/^#\/?/, "").replace(/^\//, "").trim() || "home";
}
export function monthSet(record) {
  return new Set(record.months_available || []);
}
export function hasMedicinal(record) {
  return String(record.medicinal_uses || "").trim().length > 0;
}
