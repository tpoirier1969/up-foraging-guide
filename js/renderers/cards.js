import { MONTH_SHORT, MONTHS } from "../constants.js";
import { escapeHtml } from "../utils.js";

function seasonStrip(record) {
  const active = new Set(record.months_available || []);
  return MONTHS.map((month, index) => `<span class="month ${active.has(month) ? "on" : ""}">${MONTH_SHORT[index]}</span>`).join("");
}
function conciseSummary(record) {
  const chunks = [record.category, record.culinary_uses || record.medicinal_uses || record.notes].filter(Boolean);
  return chunks.slice(0,2).join(" · ");
}
export function renderResultCard(record) {
  const thumb = record.images?.[0]
    ? `<div class="thumb" style="background-image:url('${encodeURI(record.images[0])}')"></div>`
    : `<div class="thumb placeholder">No image</div>`;
  const tags = [
    record.months_available?.length ? `${record.months_available.length} mo.` : "No month data",
    record.images?.length ? `${record.images.length} img` : "No img",
    record.medicinal_uses ? "Medicinal" : null
  ].filter(Boolean).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  return `
    <article class="result-card">
      ${thumb}
      <div class="card-main">
        <div class="card-topline">
          <a class="card-title-link" href="#detail/${encodeURIComponent(record.slug)}" data-detail-link="${escapeHtml(record.slug)}">${escapeHtml(record.display_name)}</a>
          <span class="category-pill">${escapeHtml(record.category)}</span>
        </div>
        <p class="one-line">${escapeHtml(conciseSummary(record) || "No summary imported yet.")}</p>
        <p class="one-line">${escapeHtml(record.common_name || record.notes || "")}</p>
        <div class="tag-row">${tags}</div>
        <div class="month-strip">${seasonStrip(record)}</div>
      </div>
    </article>
  `;
}
