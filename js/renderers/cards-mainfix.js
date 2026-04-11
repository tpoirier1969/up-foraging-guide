import { MONTH_SHORT, MONTHS } from "../constants-mainfix.js?v=v2.1-mainfix";
import { escapeHtml } from "../utils.js?v=v2.0";

function seasonStrip(record) {
  const active = new Set(record.months_available || []);
  return MONTHS.map((month, index) => `<span class="month ${active.has(month) ? "on" : ""}">${MONTH_SHORT[index]}</span>`).join("");
}
function iconSvg(type) {
  if (type === 'edible') return `<svg class="badge-icon edible" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2h2v9H4zm4 0h2v9H8zm6 0h2v20h-2zm4 0h2v20h-2zM12 2h10v2H12zm0 4h10v2H12zm0 4h10v2H12z"/></svg>`;
  if (type === 'medicinal') return `<svg class="badge-icon medicinal" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8z"/></svg>`;
  if (type === 'poisonous') return `<svg class="badge-icon poisonous" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 3a2 2 0 1 1-2 2 2 2 0 0 1 2-2Zm0 13c-3 0-5.5-1.6-6.5-4 1.1-.8 2.4-1.3 3.8-1.3h5.4c1.4 0 2.7.5 3.8 1.3-1 2.4-3.5 4-6.5 4Z"/></svg>`;
  return `<svg class="badge-icon neutral" viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="16" text-anchor="middle" font-size="10" font-family="Arial, sans-serif">N/A</text></svg>`;
}
function badgesForRecord(record) {
  const badges = [];
  const edible = record.category === 'Mushroom'
    ? /(choice|edible|good)/i.test(String(record.mushroom_profile?.edibility_status || '')) || /edible|choice/i.test(String(record.non_edible_severity || ''))
    : !!String(record.culinary_uses || '').trim();
  const medicinal = !!String(record.medicinal_uses || '').trim();
  const poisonous = /(deadly|poison|toxic)/i.test(String(record.non_edible_severity || '')) || /(poison|toxic|deadly)/i.test(String(record.effects_on_body || ''));
  if (edible) badges.push(iconSvg('edible'));
  if (medicinal) badges.push(iconSvg('medicinal'));
  if (poisonous) badges.push(iconSvg('poisonous'));
  if (!badges.length) badges.push(iconSvg('neutral'));
  return badges.join('');
}
function mushroomSummary(record) {
  const profile = record.mushroom_profile || {};
  const bits = [
    record.non_edible_severity ? `Risk: ${record.non_edible_severity}` : (profile.edibility_status ? `Edibility: ${profile.edibility_status.replaceAll("_", " ")}` : ""),
    record.substrate?.[0], record.treeType?.[0], record.hostTree?.[0], record.underside?.[0]
  ].filter(Boolean);
  return bits.join(" · ") || profile.summary || record.notes || record.culinary_uses;
}
function summaryForContext(record, context = "general") {
  if (context === "medicinal") return record.medicinal_uses || record.notes || record.culinary_uses;
  if (context === "mushrooms") return mushroomSummary(record);
  if (context === "lookalikes") return record.edibility_detail || record.effects_on_body || (record.look_alikes || []).join(" · ") || record.notes;
  if (context === "review") return (record.reviewReasons || []).join(" · ");
  const bits = [record.habitat?.[0], record.observedPart?.[0], record.taste?.[0]].filter(Boolean);
  return bits.join(" · ") || record.culinary_uses || record.notes || record.medicinal_uses;
}
export function renderResultCard(record, context = "general") {
  const imageHtml = record.images?.[0]
    ? `<a class="thumb thumb-link" href="#detail/${encodeURIComponent(record.slug)}" data-detail-link="${escapeHtml(record.slug)}" aria-label="Open ${escapeHtml(record.display_name)} details"><div class="thumb" style="background-image:url('${encodeURI(record.images[0])}')"></div></a>`
    : `<a class="thumb thumb-link" href="#detail/${encodeURIComponent(record.slug)}" data-detail-link="${escapeHtml(record.slug)}" aria-label="Open ${escapeHtml(record.display_name)} details"><div class="thumb placeholder">No image</div></a>`;
  const tags = [];
  if (context === "mushrooms") {
    if (record.substrate?.[0]) tags.push(record.substrate[0]);
    if (record.treeType?.[0]) tags.push(record.treeType[0]);
    if (record.hostTree?.[0]) tags.push(record.hostTree[0]);
    if (record.underside?.[0]) tags.push(record.underside[0]);
  } else if (context === "medicinal") {
    if (record.medicinalAction?.[0]) tags.push(record.medicinalAction[0]);
    if (record.medicinalSystem?.[0]) tags.push(record.medicinalSystem[0]);
    if (record.medicinalTerms?.[0]) tags.push(record.medicinalTerms[0]);
  } else if (context === "lookalikes") {
    if (record.non_edible_severity) tags.push(record.non_edible_severity);
    if (record.affected_systems?.[0]) tags.push(record.affected_systems[0]);
  } else if (context === "review") {
    tags.push(...(record.reviewReasons || []).slice(0,3));
  } else {
    if (record.habitat?.[0]) tags.push(record.habitat[0]);
    if (record.observedPart?.[0]) tags.push(record.observedPart[0]);
    if (record.size?.[0]) tags.push(record.size[0]);
  }
  return `<article class="result-card ${context === "review" ? "review-card" : ""}">${imageHtml}<div class="card-main"><div class="card-topline"><a class="card-title-link" style="text-decoration:underline; text-underline-offset:2px;" href="#detail/${encodeURIComponent(record.slug)}" data-detail-link="${escapeHtml(record.slug)}">${escapeHtml(record.display_name)}</a><span class="title-badges">${badgesForRecord(record)}</span></div><p class="one-line">${escapeHtml(summaryForContext(record, context) || "No summary imported yet.")}</p><p class="one-line muted-line scientific-line">${escapeHtml(record.scientific_name || record.common_name || "")}</p><div class="tag-row">${tags.filter(Boolean).slice(0,4).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div><div class="month-strip">${seasonStrip(record)}</div></div></article>`;
}
