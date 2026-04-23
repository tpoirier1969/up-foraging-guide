import { esc } from "../lib/escape.js";
import { renderImageSlot } from "../lib/image-slot.js";

const SIGHTINGS_STORAGE_KEY = "foraging_rare_sightings_v1";

function normalizeGroup(value) {
  const text = String(value || "").trim().toLowerCase();
  if (text === "fungus") return "fungus";
  if (text === "mushroom") return "fungus";
  if (text === "plant") return "plant";
  return "";
}

function rareData(record) {
  return record.rare_profile || {
    status: record.status || "",
    legal_status: record.legal_status || "",
    up_relevance: record.up_relevance || "",
    sensitive_location: record.sensitive_location === true,
    reason: record.reason || "",
    field_marks: record.field_marks || "",
    care_note: record.care_note || "",
    key_features: Array.isArray(record.key_features) ? record.key_features : []
  };
}

function loadSightings() {
  try {
    const payload = JSON.parse(localStorage.getItem(SIGHTINGS_STORAGE_KEY) || "{}");
    return payload && typeof payload === "object" ? payload : {};
  } catch {
    return {};
  }
}

function saveSightings(payload) {
  localStorage.setItem(SIGHTINGS_STORAGE_KEY, JSON.stringify(payload || {}));
}

function compactList(values, max = 2) {
  const list = Array.isArray(values) ? values.filter(Boolean) : [];
  if (!list.length) return "";
  return list.slice(0, max).join(" • ");
}

function normalizeFilters(filters = {}) {
  return {
    search: String(filters.search || "").trim().toLowerCase(),
    rareGroup: String(filters.rareGroup || "").trim().toLowerCase(),
    rareLegalStatus: String(filters.rareLegalStatus || "").trim().toLowerCase(),
    rareUpRelevance: String(filters.rareUpRelevance || "").trim().toLowerCase(),
    rareSensitiveOnly: String(filters.rareSensitiveOnly || "").trim().toLowerCase()
  };
}

function matchesFilters(record, filters) {
  const rare = rareData(record);
  const q = filters.search;
  if (filters.rareGroup && normalizeGroup(record.group || record.kingdom_type || record.record_type) !== filters.rareGroup) {
    return false;
  }
  if (filters.rareLegalStatus && String(rare.legal_status || "").trim().toLowerCase() !== filters.rareLegalStatus) {
    return false;
  }
  if (filters.rareUpRelevance && String(rare.up_relevance || "").trim().toLowerCase() !== filters.rareUpRelevance) {
    return false;
  }
  if (filters.rareSensitiveOnly === "sensitive" && rare.sensitive_location !== true) {
    return false;
  }
  if (!q) return true;

  return [
    record.common_name, record.display_name, record.scientific_name, record.slug,
    rare.status, rare.legal_status, rare.up_relevance, rare.reason, rare.field_marks,
    rare.care_note, ...(rare.key_features || []), ...(record.look_alikes || [])
  ].join(" ").toLowerCase().includes(q);
}

function countSightings(sightingsMap) {
  return Object.values(sightingsMap || {}).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
}

function sightingItemsHtml(slug, sightings = []) {
  if (!Array.isArray(sightings) || !sightings.length) return "";
  return `
    <section class="detail-block">
      <h4>Saved sightings</h4>
      <ul class="list-tight">
        ${sightings.map((item, index) => `
          <li>
            <strong>${esc(item.date || "No date")}</strong>
            ${item.area ? ` — ${esc(item.area)}` : ""}
            ${item.confidence ? ` — ${esc(item.confidence)}` : ""}
            ${item.notes ? `<div class="muted small">${esc(item.notes)}</div>` : ""}
            <div class="control-row" style="margin-top:.35rem">
              <button type="button" class="subtle" data-rare-log-delete="${esc(slug)}" data-rare-log-index="${index}">Delete</button>
            </div>
          </li>
        `).join("")}
      </ul>
    </section>
  `;
}

export function renderRarePage(records, filtersOrSearch = {}) {
  const filters = normalizeFilters(filtersOrSearch);
  const sightingsMap = loadSightings();
  const filtered = (records || []).filter((record) => matchesFilters(record, filters));
  const totalSightings = countSightings(sightingsMap);

  return `
    <section class="panel">
      <h2>Rare species</h2>
      <p class="muted">Rare and watchlist entries should show why they matter, how to recognize them, and whether location details should stay vague.</p>

      <div class="control-row" style="margin-bottom:.75rem">
        <input id="rareSearch" type="search" value="${esc(filtersOrSearch.search || "")}" placeholder="Search rare species" style="flex:1;min-width:240px">
        <button id="rareSearchBtn" class="primary" type="button">Search</button>
        ${(filtersOrSearch.search || filters.rareGroup || filters.rareLegalStatus || filters.rareUpRelevance || filters.rareSensitiveOnly)
          ? `<button id="rareClearBtn" type="button">Clear</button>` : ""}
      </div>

      <div class="control-row" style="flex-wrap:wrap">
        <label class="muted small">Group
          <select id="rareGroupFilter">
            <option value="">Any group</option>
            <option value="plant" ${filters.rareGroup === "plant" ? "selected" : ""}>Plants</option>
            <option value="fungus" ${filters.rareGroup === "fungus" ? "selected" : ""}>Fungi</option>
          </select>
        </label>

        <label class="muted small">Legal status
          <select id="rareLegalStatusFilter">
            <option value="">Any legal status</option>
            <option value="official" ${filters.rareLegalStatus === "official" ? "selected" : ""}>Official / legal</option>
            <option value="non-legal" ${filters.rareLegalStatus === "non-legal" ? "selected" : ""}>Watchlist / non-legal</option>
          </select>
        </label>

        <label class="muted small">U.P. relevance
          <select id="rareUpRelevanceFilter">
            <option value="">Any U.P. relevance</option>
            <option value="confirmed" ${filters.rareUpRelevance === "confirmed" ? "selected" : ""}>Confirmed</option>
            <option value="watchlist" ${filters.rareUpRelevance === "watchlist" ? "selected" : ""}>Watchlist</option>
          </select>
        </label>

        <label class="muted small">Sensitivity
          <select id="rareSensitiveOnlyFilter">
            <option value="">Any sensitivity</option>
            <option value="sensitive" ${filters.rareSensitiveOnly === "sensitive" ? "selected" : ""}>Sensitive only</option>
          </select>
        </label>
      </div>

      <p class="results-meta" style="margin-top:.75rem">${filtered.length} shown • ${records.length} total rare entries • ${totalSightings} saved sightings on this browser</p>
    </section>

    ${filtered.length ? `<section class="record-list">${filtered.map(record => {
      const rare = rareData(record);
      const sightings = Array.isArray(sightingsMap[record.slug]) ? sightingsMap[record.slug] : [];
      const lead = rare.reason || record.short_reason || compactList(rare.key_features, 1) || record.habitat || "";
      const fieldMarks = rare.field_marks || compactList(rare.key_features);
      const sensitiveNote = rare.sensitive_location
        ? `<p class="muted small"><strong>Location caution:</strong> Keep exact locations vague.</p>`
        : "";
      return `
        <article class="record-card with-image">
          ${renderImageSlot(record, "card")}
          <div class="record-card-body">
            <h3><button class="record-title-button" type="button" data-detail="${esc(record.slug)}">${esc(record.common_name || record.display_name || record.slug)}</button></h3>
            <p class="muted small">${esc(record.scientific_name || "")}</p>
            <div class="record-meta">
              ${record.group ? `<span class="tag">${esc(record.group)}</span>` : ""}
              ${rare.status ? `<span class="tag warn">${esc(rare.status)}</span>` : ""}
              ${rare.legal_status ? `<span class="tag">${esc(rare.legal_status)}</span>` : ""}
              ${rare.up_relevance ? `<span class="tag">${esc(rare.up_relevance)}</span>` : ""}
              ${rare.sensitive_location ? `<span class="tag danger">Sensitive location</span>` : ""}
              ${sightings.length ? `<span class="tag">${sightings.length} sighting${sightings.length === 1 ? "" : "s"}</span>` : ""}
            </div>
            ${lead ? `<p>${esc(lead)}</p>` : ""}
            ${fieldMarks ? `<p class="muted small"><strong>Field marks:</strong> ${esc(fieldMarks)}</p>` : ""}
            ${rare.care_note ? `<p class="muted small"><strong>Care note:</strong> ${esc(rare.care_note)}</p>` : ""}
            ${sensitiveNote}

            <div class="control-row">
              <button class="primary" type="button" data-detail="${esc(record.slug)}">Open details</button>
              <button class="subtle" type="button" data-rare-log-toggle="${esc(record.slug)}">Log sighting</button>
            </div>

            <section class="detail-block" data-rare-log-panel="${esc(record.slug)}" hidden>
              <h4>Log sighting</h4>
              <p class="muted small">Saved locally on this browser for now.${rare.sensitive_location ? " Avoid exact coordinates or overly precise directions." : ""}</p>
              <div class="control-row" style="flex-wrap:wrap">
                <input type="date" data-rare-log-date="${esc(record.slug)}">
                <input type="text" data-rare-log-area="${esc(record.slug)}" placeholder="${rare.sensitive_location ? "General area only" : "General area"}" style="flex:1;min-width:180px">
                <select data-rare-log-confidence="${esc(record.slug)}">
                  <option value="">Confidence</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <textarea data-rare-log-notes="${esc(record.slug)}" rows="3" placeholder="Notes, conditions, associated habitat, anything useful"></textarea>
              <div class="control-row">
                <button class="primary" type="button" data-rare-log-save="${esc(record.slug)}">Save sighting</button>
                <button type="button" data-rare-log-cancel="${esc(record.slug)}">Cancel</button>
              </div>
            </section>

            ${sightingItemsHtml(record.slug, sightings)}
          </div>
        </article>
      `;
    }).join("")}</section>` : `<section class="panel empty-state"><h3>No rare species found</h3></section>`}
  `;
}

function closestSelector(el, selector) {
  return el && typeof el.closest === "function" ? el.closest(selector) : null;
}

export function setupRarePage({ setFilters, clearFilters, rerender }) {
  document.getElementById("rareGroupFilter")?.addEventListener("change", (event) => {
    setFilters({ rareGroup: event.currentTarget.value || "" });
    rerender();
  });
  document.getElementById("rareLegalStatusFilter")?.addEventListener("change", (event) => {
    setFilters({ rareLegalStatus: event.currentTarget.value || "" });
    rerender();
  });
  document.getElementById("rareUpRelevanceFilter")?.addEventListener("change", (event) => {
    setFilters({ rareUpRelevance: event.currentTarget.value || "" });
    rerender();
  });
  document.getElementById("rareSensitiveOnlyFilter")?.addEventListener("change", (event) => {
    setFilters({ rareSensitiveOnly: event.currentTarget.value || "" });
    rerender();
  });
  document.getElementById("rareClearBtn")?.addEventListener("click", () => {
    clearFilters();
    rerender();
  });

  document.querySelectorAll("[data-rare-log-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.rareLogToggle || "";
      const panel = document.querySelector(`[data-rare-log-panel="${slug}"]`);
      if (!panel) return;
      panel.hidden = !panel.hidden;
      if (!panel.hidden) {
        const dateInput = panel.querySelector(`[data-rare-log-date="${slug}"]`);
        if (dateInput && !dateInput.value) {
          dateInput.value = new Date().toISOString().slice(0, 10);
        }
      }
    });
  });

  document.querySelectorAll("[data-rare-log-cancel]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.rareLogCancel || "";
      const panel = document.querySelector(`[data-rare-log-panel="${slug}"]`);
      if (panel) panel.hidden = true;
    });
  });

  document.querySelectorAll("[data-rare-log-save]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.rareLogSave || "";
      if (!slug) return;
      const date = document.querySelector(`[data-rare-log-date="${slug}"]`)?.value || "";
      const area = document.querySelector(`[data-rare-log-area="${slug}"]`)?.value || "";
      const confidence = document.querySelector(`[data-rare-log-confidence="${slug}"]`)?.value || "";
      const notes = document.querySelector(`[data-rare-log-notes="${slug}"]`)?.value || "";
      const payload = loadSightings();
      const existing = Array.isArray(payload[slug]) ? payload[slug] : [];
      existing.unshift({
        date: String(date).trim(),
        area: String(area).trim(),
        confidence: String(confidence).trim(),
        notes: String(notes).trim()
      });
      payload[slug] = existing.slice(0, 10);
      saveSightings(payload);
      rerender();
    });
  });

  document.querySelectorAll("[data-rare-log-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.rareLogDelete || "";
      const index = Number(btn.dataset.rareLogIndex || -1);
      if (!slug || index < 0) return;
      const payload = loadSightings();
      const existing = Array.isArray(payload[slug]) ? payload[slug] : [];
      payload[slug] = existing.filter((_, i) => i !== index);
      if (!payload[slug].length) delete payload[slug];
      saveSightings(payload);
      rerender();
    });
  });
}
