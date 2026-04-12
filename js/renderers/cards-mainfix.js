import { MONTH_SHORT, MONTHS } from "../constants-mainfix.js?v=v2.1-mainfix22";
import { escapeHtml } from "../utils.js?v=v2.0";

function seasonStrip(record) {
  const active = new Set(record.months_available || []);
  return MONTHS.map((month, index) => `<span class="month ${active.has(month) ? "on" : ""}">${MONTH_SHORT[index]}</span>`).join("");
}
function statusPill(label, type) { return `<span class="status-pill ${escapeHtml(type)}">${escapeHtml(label)}</span>`; }
function badgesForRecord(record) {
  const badges = [];
  const edible = record.category === 'Mushroom' ? /(choice|edible|good)/i.test(String(record.mushroom_profile?.edibility_status || '')) || /edible|choice/i.test(String(record.non_edible_severity || '')) : !!String(record.culinary_uses || '').trim();
  const medicinal = !!String(record.medicinal_uses || '').trim();
  const poisonous = /(deadly|poison|toxic)/i.test(String(record.non_edible_severity || '')) || /(poison|toxic|deadly)/i.test(String(record.effects_on_body || ''));
  if (edible) badges.push(statusPill('Edible', 'edible'));
  if (medicinal) badges.push(statusPill('Medicinal', 'medicinal'));
  if (poisonous) badges.push(statusPill('Poisonous', 'poisonous'));
  return badges.join('');
}
function mushroomSummary(record) {
  const profile = record.mushroom_profile || {};
  const bits = [record.non_edible_severity ? `Risk: ${record.non_edible_severity}` : (profile.edibility_status ? `Edibility: ${profile.edibility_status.replaceAll("_", " ")}` : ""), record.substrate?.[0], record.treeType?.[0], record.hostTree?.[0], record.underside?.[0]].filter(Boolean);
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
function canonicalImageKey(url) {
  const raw = String(url || '').trim();
  if (!raw) return '';
  const noQuery = raw.split('?')[0].split('#')[0];
  const decoded = decodeURIComponent(noQuery);
  const specialFile = decoded.match(/Special:FilePath\/(.+)$/i);
  const tail = specialFile ? specialFile[1] : decoded.split('/').pop();
  return String(tail || decoded).trim().toLowerCase();
}
function uniqueImages(images) {
  const seen = new Set();
  const out = [];
  for (const image of images || []) {
    const key = canonicalImageKey(image);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(image);
  }
  return out;
}
export function renderResultCard(record, context = "general") {
  const firstImage = uniqueImages(record.images || [])[0];
  const imageHtml = firstImage ? `<a class="thumb thumb-link" href="#detail/${encodeURIComponent(record.slug)}" data-detail-link="${escapeHtml(record.slug)}" aria-label="Open ${escapeHtml(record.display_name)} details"><div class="thumb" style="background-image:url('${encodeURI(firstImage)}')"></div></a>` : `<a class="thumb thumb-link" href="#detail/${encodeURIComponent(record.slug)}" data-detail-link="${escapeHtml(record.slug)}" aria-label="Open ${escapeHtml(record.display_name)} details"><div class="thumb placeholder">No image</div></a>`;
  const tags = [];
  if (context === "mushrooms") { if (record.substrate?.[0]) tags.push(record.substrate[0]); if (record.treeType?.[0]) tags.push(record.treeType[0]); if (record.hostTree?.[0]) tags.push(record.hostTree[0]); if (record.underside?.[0]) tags.push(record.underside[0]); }
  else if (context === "medicinal") { if (record.medicinalAction?.[0]) tags.push(record.medicinalAction[0]); if (record.medicinalSystem?.[0]) tags.push(record.medicinalSystem[0]); if (record.medicinalTerms?.[0]) tags.push(record.medicinalTerms[0]); }
  else if (context === "lookalikes") { if (record.non_edible_severity) tags.push(record.non_edible_severity); if (record.affected_systems?.[0]) tags.push(record.affected_systems[0]); }
  else if (context === "review") { tags.push(...(record.reviewReasons || []).slice(0,3)); }
  else { if (record.habitat?.[0]) tags.push(record.habitat[0]); if (record.observedPart?.[0]) tags.push(record.observedPart[0]); if (record.size?.[0]) tags.push(record.size[0]); }
  const badgeHtml = badgesForRecord(record);
  return `<article class="result-card ${context === "review" ? "review-card" : ""}">${imageHtml}<div class="card-main"><div class="card-topline"><a class="card-title-link" style="text-decoration:underline; text-underline-offset:2px;" href="#detail/${encodeURIComponent(record.slug)}" data-detail-link="${escapeHtml(record.slug)}">${escapeHtml(record.display_name)}</a>${badgeHtml ? `<span class="title-badges">${badgeHtml}</span>` : ''}</div><p class="one-line">${escapeHtml(summaryForContext(record, context) || "No summary imported yet.")}</p><p class="one-line muted-line scientific-line">${escapeHtml(record.scientific_name || record.common_name || "")}</p><div class="tag-row">${tags.filter(Boolean).slice(0,4).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div><div class="month-strip">${seasonStrip(record)}</div></div></article>`;
}
