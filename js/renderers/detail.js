import { TABLE_NAME } from "../constants.js";
import { escapeHtml } from "../utils.js";

function tagList(items, emptyText) {
  return items?.length ? items.map(item => `<span class="tag">${escapeHtml(item)}</span>`).join('') : `<span class="tag">${escapeHtml(emptyText)}</span>`;
}

export function renderDetail(record) {
  const gallery = record.images?.length ? record.images.map(path => `<img src="${encodeURI(path)}" alt="${escapeHtml(record.display_name)}">`).join("") : `<div class="thumb placeholder" style="width:100%;height:220px;">No image imported</div>`;
  const links = record.links?.length ? record.links.map(link => `<li><a href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(link)}</a></li>`).join("") : "<li>No source links imported.</li>";
  return `
    <div class="detail-layout">
      <div class="detail-gallery">${gallery}</div>
      <div class="detail-grid">
        <section class="detail-card">
          <span class="category-pill">${escapeHtml(record.category)}</span>
          <h2 style="margin-top:10px;">${escapeHtml(record.display_name)}</h2>
          <p style="margin-top:8px;">${escapeHtml(record.common_name || "No alternate common name imported.")}</p>
          <p class="small-note">Week precision: <strong>defaults to week 1 of the month until checked</strong></p>
        </section>
        <section class="detail-card section-block"><h3>Culinary uses</h3><p>${escapeHtml(record.culinary_uses || "Not provided in the imported sheet.")}</p></section>
        <section class="detail-card section-block"><h3>Medicinal uses</h3><p>${escapeHtml(record.medicinal_uses || "Not provided in the imported sheet.")}</p></section>
        <section class="detail-card section-block"><h3>Field clues</h3><div class="tag-row">${tagList([...(record.habitat||[]), ...(record.observedPart||[]), ...(record.size||[]), ...(record.taste||[])], 'No field traits tagged yet')}</div></section>
        <section class="detail-card section-block"><h3>Mushroom clues</h3><div class="tag-row">${tagList([...(record.substrate||[]), ...(record.treeType||[]), ...(record.hostTree||[]), ...(record.ring||[]), ...(record.texture||[]), ...(record.smell||[]), ...(record.staining||[])], 'No mushroom traits tagged yet')}</div></section>
        <section class="detail-card section-block"><h3>Medicinal tags</h3><div class="tag-row">${tagList([...(record.medicinalAction||[]), ...(record.medicinalSystem||[]), ...(record.medicinalTerms||[])], 'No medicinal tags yet')}</div></section>
        <section class="detail-card section-block"><h3>Seasonality</h3><div class="tag-row">${tagList(record.months_available, 'No month data')}</div></section>
        <section class="detail-card section-block"><h3>Needs review</h3><div class="tag-row">${tagList(record.reviewReasons, 'Nothing flagged')}</div></section>
        <section class="detail-card section-block"><h3>Notes</h3><p>${escapeHtml(record.notes || "No extra notes imported.")}</p></section>
        <section class="detail-card section-block"><h3>Source links</h3><ul>${links}</ul></section>
        <p class="small-note">Supabase table target: <strong>${TABLE_NAME}</strong></p>
      </div>
    </div>
  `;
}
