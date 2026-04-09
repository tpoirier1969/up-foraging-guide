import { MONTH_SHORT, MONTHS } from "../constants.js";
import { escapeHtml } from "../utils.js";

function seasonStrip(record) {
  const active = new Set(record.months_available || []);
  return MONTHS.map((month, index) => `<span class="month ${active.has(month) ? "on" : ""}">${MONTH_SHORT[index]}</span>`).join("");
}
function summaryForContext(record, context = 'general') {
  if (context === 'medicinal') return record.medicinal_uses || record.notes || record.culinary_uses;
  if (context === 'mushrooms') {
    const bits = [record.category, record.substrate?.[0], record.hostTree?.[0], record.texture?.[0], record.smell?.[0]].filter(Boolean);
    return bits.join(' · ') || record.notes || record.culinary_uses;
  }
  if (context === 'review') return (record.reviewReasons || []).join(' · ');
  const bits = [record.category, record.habitat?.[0], record.observedPart?.[0], record.taste?.[0]].filter(Boolean);
  return bits.join(' · ') || record.culinary_uses || record.notes || record.medicinal_uses;
}
export function renderResultCard(record, context = 'general') {
  const thumb = record.images?.[0]
    ? `<div class="thumb" style="background-image:url('${encodeURI(record.images[0])}')"></div>`
    : `<div class="thumb placeholder">No image</div>`;
  const tags = [];
  if (context === 'mushrooms') {
    if (record.substrate?.[0]) tags.push(record.substrate[0]);
    if (record.treeType?.[0]) tags.push(record.treeType[0]);
    if (record.ring?.[0]) tags.push(record.ring[0]);
    if (record.staining?.[0]) tags.push(`staining: ${record.staining[0]}`);
  } else if (context === 'medicinal') {
    if (record.medicinalAction?.[0]) tags.push(record.medicinalAction[0]);
    if (record.medicinalSystem?.[0]) tags.push(record.medicinalSystem[0]);
    if (record.medicinalTerms?.[0]) tags.push(record.medicinalTerms[0]);
  } else if (context === 'review') {
    tags.push(...(record.reviewReasons || []).slice(0,3));
  } else {
    if (record.habitat?.[0]) tags.push(record.habitat[0]);
    if (record.observedPart?.[0]) tags.push(record.observedPart[0]);
    if (record.size?.[0]) tags.push(record.size[0]);
    if (record.taste?.[0]) tags.push(record.taste[0]);
  }
  if (!tags.length) {
    tags.push(record.months_available?.length ? `${record.months_available.length} mo.` : 'No month data');
    if (record.images?.length) tags.push(`${record.images.length} img`);
  }
  return `
    <article class="result-card ${context === 'review' ? 'review-card' : ''}">
      ${thumb}
      <div class="card-main">
        <div class="card-topline">
          <a class="card-title-link" href="#detail/${encodeURIComponent(record.slug)}" data-detail-link="${escapeHtml(record.slug)}">${escapeHtml(record.display_name)}</a>
          <span class="category-pill">${escapeHtml(record.category)}</span>
        </div>
        <p class="one-line">${escapeHtml(summaryForContext(record, context) || 'No summary imported yet.')}</p>
        <p class="one-line muted-line">${escapeHtml(record.common_name || '')}</p>
        <div class="tag-row">${tags.filter(Boolean).slice(0,4).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
        <div class="month-strip">${seasonStrip(record)}</div>
      </div>
    </article>
  `;
}
