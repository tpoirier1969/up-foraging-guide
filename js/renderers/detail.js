import { TABLE_NAME } from "../constants.js";
import { escapeHtml } from "../utils.js";
import { state } from "../state.js";

function tagList(items, emptyText = "None noted") {
  return items?.length
    ? items.map(item => `<span class="tag">${escapeHtml(item)}</span>`).join("")
    : `<span class="tag">${escapeHtml(emptyText)}</span>`;
}

function line(label, value) {
  if (!value) return "";
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function listSection(title, items, emptyText = "Not documented yet") {
  return `
    <section class="detail-card section-block">
      <h3>${escapeHtml(title)}</h3>
      <div class="tag-row">${tagList(items, emptyText)}</div>
    </section>
  `;
}

function renderRelatedMushrooms(record) {
  if (record.category !== "Mushroom") return "";
  const related = (state.allRecords || []).filter(item => item.slug !== record.slug && item.mushroom_family && item.mushroom_family === record.mushroom_family);
  if (!related.length) return "";
  return `
    <section class="detail-card section-block">
      <h3>Related variants in this family</h3>
      <div class="related-link-list">${related.map(item => `<a class="inline-chip-link" href="#detail/${encodeURIComponent(item.slug)}" data-detail-link="${escapeHtml(item.slug)}">${escapeHtml(item.display_name)}</a>`).join("")}</div>
      <p class="small-note">Grouped here on purpose so broad buckets like boletes, russulas, chanterelles, and oysters stop pretending they are each just one mushroom.</p>
    </section>
  `;
}

function renderMushroomResearch(record) {
  const profile = record.mushroom_profile;
  if (!profile) return "";
  const sourceLinks = (record.links || [])
    .map(link => `<li><a href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(link)}</a></li>`)
    .join("");

  return `
    <section class="detail-card section-block">
      <h3>Mushroom research</h3>
      ${line("Scientific name", record.scientific_name || "")}
      ${line("Family grouping", record.mushroom_family || "")}
      ${line("Entry scope", (profile.entry_scope || "").replaceAll("_", " "))}
      ${line("Edibility", (profile.edibility_status || "").replaceAll("_", " "))}
      ${line("Caution level", (profile.caution_level || "").replaceAll("_", " "))}
      ${line("Ecology", profile.ecology || "")}
      ${line("Summary", profile.summary || "")}
      ${line("Spore print", profile.spore_print || "")}
      ${line("Season note", profile.season_note || "")}
      ${line("Image status", (profile.research_notes || []).find(note => note.startsWith("Image status in current repo build:"))?.replace("Image status in current repo build: ", "") || "")}
    </section>

    ${listSection("Substrate and host clues", [
      ...(profile.substrate || []),
      ...(profile.wood_type || []),
      ...(profile.host_trees || []),
      profile.host_certainty ? `Host certainty: ${profile.host_certainty.replaceAll("_", " ")}` : ""
    ].filter(Boolean), "No substrate or host clues added yet")}

    ${listSection("Structure clues", [
      ...(profile.underside ? [profile.underside] : []),
      ...(profile.ring ? [profile.ring] : []),
      ...(profile.texture || []),
      ...(profile.odor ? [profile.odor] : []),
      ...(profile.staining ? [profile.staining] : []),
      ...(profile.taste || [])
    ].filter(Boolean), "No structure clues added yet")}

    ${profile.processing_required?.length ? listSection("Processing / handling", profile.processing_required) : ""}

    <section class="detail-card section-block">
      <h3>Research notes</h3>
      <ul>${(profile.research_notes || []).map(note => `<li>${escapeHtml(note)}</li>`).join("") || "<li>No extra mushroom notes yet.</li>"}</ul>
    </section>

    <section class="detail-card section-block">
      <h3>Sources</h3>
      <ul>${sourceLinks || "<li>No source links imported.</li>"}</ul>
    </section>
  `;
}

export function renderDetail(record) {
  const gallery = record.images?.length
    ? record.images.map(path => `<img src="${encodeURI(path)}" alt="${escapeHtml(record.display_name)}">`).join("")
    : `<div class="thumb placeholder" style="width:100%;height:220px;">No image imported</div>`;

  const genericLinks = !record.mushroom_profile && record.links?.length
    ? `<section class="detail-card section-block"><h3>Source links</h3><ul>${record.links.map(link => `<li><a href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(link)}</a></li>`).join("")}</ul></section>`
    : "";

  return `
    <div class="detail-layout">
      <div class="detail-gallery">${gallery}</div>
      <div class="detail-grid">
        <section class="detail-card">
          <span class="category-pill">${escapeHtml(record.category)}</span>
          <h2 style="margin-top:10px;">${escapeHtml(record.display_name)}</h2>
          <p style="margin-top:8px;">${escapeHtml(record.common_name || "No alternate common name imported.")}</p>
          ${record.scientific_name ? `<p class="small-note"><strong>${escapeHtml(record.scientific_name)}</strong></p>` : ""}
          ${record.mushroom_family ? `<p class="small-note">Mushroom family grouping: <strong>${escapeHtml(record.mushroom_family)}</strong></p>` : ""}
          <p class="small-note">Week precision: <strong>defaults to week 1 of the month until checked</strong></p>
        </section>
        <section class="detail-card section-block"><h3>Culinary uses</h3><p>${escapeHtml(record.culinary_uses || "Not provided in the imported sheet.")}</p></section>
        <section class="detail-card section-block"><h3>Medicinal uses</h3><p>${escapeHtml(record.medicinal_uses || "Not provided in the imported sheet.")}</p></section>
        <section class="detail-card section-block"><h3>Field clues</h3><div class="tag-row">${tagList([...(record.habitat||[]), ...(record.observedPart||[]), ...(record.size||[]), ...(record.taste||[])], "No field traits tagged yet")}</div></section>
        <section class="detail-card section-block"><h3>Mushroom clues</h3><div class="tag-row">${tagList([...(record.substrate||[]), ...(record.treeType||[]), ...(record.hostTree||[]), ...(record.ring||[]), ...(record.underside||[]), ...(record.texture||[]), ...(record.smell||[]), ...(record.staining||[])], "No mushroom traits tagged yet")}</div></section>
        <section class="detail-card section-block"><h3>Medicinal tags</h3><div class="tag-row">${tagList([...(record.medicinalAction||[]), ...(record.medicinalSystem||[]), ...(record.medicinalTerms||[])], "No medicinal tags yet")}</div></section>
        <section class="detail-card section-block"><h3>Seasonality</h3><div class="tag-row">${tagList(record.months_available, "No month data")}</div></section>
        <section class="detail-card section-block"><h3>Needs review</h3><div class="tag-row">${tagList(record.reviewReasons, "Nothing flagged")}</div></section>
        <section class="detail-card section-block"><h3>Notes</h3><p>${escapeHtml(record.notes || "No extra notes imported.")}</p></section>
        ${renderRelatedMushrooms(record)}
        ${renderMushroomResearch(record)}
        ${genericLinks}
        <p class="small-note">Supabase table target: <strong>${TABLE_NAME}</strong></p>
      </div>
    </div>
  `;
}
