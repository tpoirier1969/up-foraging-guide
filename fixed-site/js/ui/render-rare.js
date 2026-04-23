import { esc } from "../lib/escape.js";
import { renderImageSlot } from "../lib/image-slot.js";

const SIGHTINGS_STORAGE_KEY = "foraging_rare_sightings_v2";
const SUPABASE_SETTINGS_KEY = "foraging_rare_supabase_v1";
const LEAFLET_CSS_ID = "foraging-rare-leaflet-css";
const LEAFLET_SCRIPT_ID = "foraging-rare-leaflet-script";
const DEFAULT_MAP_CENTER = [46.35, -87.45];
const DEFAULT_MAP_ZOOM = 6;
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

let leafletPromise = null;
let remoteSightingsPromise = null;
let remoteSightingsLoaded = false;
let remoteSightingsAttempted = false;
let remoteSightingsError = "";
let remoteSightingsBySlug = {};
const mapControllers = new Map();

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

function loadLocalSightings() {
  try {
    const payload = JSON.parse(localStorage.getItem(SIGHTINGS_STORAGE_KEY) || "{}");
    return payload && typeof payload === "object" ? payload : {};
  } catch {
    return {};
  }
}

function saveLocalSightings(payload) {
  localStorage.setItem(SIGHTINGS_STORAGE_KEY, JSON.stringify(payload || {}));
}

function defaultSupabaseSettings() {
  return {
    url: "",
    anonKey: "",
    table: "rare_sightings",
    columns: {
      id: "id",
      slug: "species_slug",
      displayName: "species_name",
      scientificName: "scientific_name",
      observedOn: "observed_on",
      latitude: "latitude",
      longitude: "longitude",
      generalArea: "general_area",
      confidence: "confidence",
      notes: "notes",
      sensitiveLocation: "sensitive_location",
      createdAt: "created_at"
    }
  };
}

function loadSupabaseSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem(SUPABASE_SETTINGS_KEY) || "null");
    const base = defaultSupabaseSettings();
    if (!raw || typeof raw !== "object") return base;
    return {
      ...base,
      ...raw,
      columns: {
        ...base.columns,
        ...(raw.columns || {})
      }
    };
  } catch {
    return defaultSupabaseSettings();
  }
}

function saveSupabaseSettings(payload) {
  localStorage.setItem(SUPABASE_SETTINGS_KEY, JSON.stringify(payload || defaultSupabaseSettings()));
}

function hasSupabaseConfig() {
  const settings = loadSupabaseSettings();
  return !!String(settings.url || "").trim() && !!String(settings.anonKey || "").trim() && !!String(settings.table || "").trim();
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

function settingsValue(settings, key) {
  return String(settings?.columns?.[key] || "").trim();
}

function rowValue(row, preferred, fallbacks = []) {
  const names = [preferred, ...fallbacks].filter(Boolean);
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(row, name) && row[name] !== undefined && row[name] !== null) {
      return row[name];
    }
  }
  return undefined;
}

function normalizeRemoteRow(row, settings) {
  const cols = settings.columns || {};
  const rawSlug = rowValue(row, cols.slug, ["species_slug", "slug", "record_slug"]);
  const slug = String(rawSlug || "").trim();
  if (!slug) return null;

  const latitude = Number(rowValue(row, cols.latitude, ["latitude", "lat"]));
  const longitude = Number(rowValue(row, cols.longitude, ["longitude", "lng", "lon"]));

  return {
    id: rowValue(row, cols.id, ["id"]),
    slug,
    displayName: String(rowValue(row, cols.displayName, ["species_name", "display_name", "common_name"]) || "").trim(),
    scientificName: String(rowValue(row, cols.scientificName, ["scientific_name"]) || "").trim(),
    date: String(rowValue(row, cols.observedOn, ["observed_on", "observed_at", "date"]) || "").trim(),
    area: String(rowValue(row, cols.generalArea, ["general_area", "area", "location_name", "location"]) || "").trim(),
    confidence: String(rowValue(row, cols.confidence, ["confidence"]) || "").trim(),
    notes: String(rowValue(row, cols.notes, ["notes"]) || "").trim(),
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
    sensitiveLocation: rowValue(row, cols.sensitiveLocation, ["sensitive_location"]) === true,
    createdAt: String(rowValue(row, cols.createdAt, ["created_at"]) || "").trim(),
    source: "supabase"
  };
}

function groupSightings(list) {
  const bySlug = {};
  (list || []).forEach((item) => {
    if (!item?.slug) return;
    if (!Array.isArray(bySlug[item.slug])) bySlug[item.slug] = [];
    bySlug[item.slug].push(item);
  });
  return bySlug;
}

function sightingFingerprint(item = {}) {
  return [
    item.id || "",
    item.slug || "",
    item.date || "",
    item.area || "",
    item.latitude ?? "",
    item.longitude ?? "",
    item.notes || ""
  ].join("::");
}

function mergeSightingsMaps(primary = {}, secondary = {}) {
  const out = {};
  const slugs = new Set([...Object.keys(primary || {}), ...Object.keys(secondary || {})]);
  slugs.forEach((slug) => {
    const seen = new Set();
    const merged = [];
    [...(primary[slug] || []), ...(secondary[slug] || [])].forEach((item) => {
      const fp = sightingFingerprint(item);
      if (!fp || seen.has(fp)) return;
      seen.add(fp);
      merged.push(item);
    });
    if (merged.length) out[slug] = merged;
  });
  return out;
}

function currentSightingsMap() {
  const local = loadLocalSightings();
  return remoteSightingsLoaded ? mergeSightingsMaps(remoteSightingsBySlug, local) : local;
}

function countSightings(sightingsMap) {
  return Object.values(sightingsMap || {}).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
}

function formatCoords(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "No exact point selected yet.";
  return `Exact point: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
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
            ${item.source ? ` — ${esc(item.source)}` : ""}
            ${(Number.isFinite(item.latitude) && Number.isFinite(item.longitude)) ? `<div class="muted small">${esc(item.latitude.toFixed(6))}, ${esc(item.longitude.toFixed(6))}</div>` : ""}
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

function settingsSummary() {
  if (!hasSupabaseConfig()) {
    return "Supabase rare logging is not configured yet.";
  }
  if (remoteSightingsError) {
    return `Supabase sync issue: ${remoteSightingsError}`;
  }
  if (remoteSightingsLoaded) {
    return "Supabase rare logging is connected.";
  }
  return "Supabase rare logging is configured; loading sightings…";
}

export function renderRarePage(records, filtersOrSearch = {}) {
  const filters = normalizeFilters(filtersOrSearch);
  const sightingsMap = currentSightingsMap();
  const filtered = (records || []).filter((record) => matchesFilters(record, filters));
  const totalSightings = countSightings(sightingsMap);
  const settings = loadSupabaseSettings();

  return `
    <section class="panel">
      <h2>Rare species</h2>
      <p class="muted">Rare and watchlist entries should show why they matter, how to recognize them, and whether location details should stay vague publicly. Your personal logging can still store exact coordinates.</p>

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

      <div class="detail-block" style="margin-top:.85rem">
        <div class="control-row" style="justify-content:space-between;align-items:center;gap:.75rem;flex-wrap:wrap">
          <div>
            <strong>Rare sighting sync</strong>
            <div class="muted small">${esc(settingsSummary())}</div>
          </div>
          <div class="control-row">
            <button type="button" id="rareSupabaseSettingsToggle">Supabase settings</button>
            ${hasSupabaseConfig() ? `<button type="button" id="rareSupabaseRefreshBtn">Refresh sightings</button>` : ""}
          </div>
        </div>

        <section id="rareSupabaseSettingsPanel" hidden style="margin-top:.85rem">
          <div class="control-row" style="flex-wrap:wrap">
            <input id="rareSupabaseUrl" type="text" value="${esc(settings.url || "")}" placeholder="Supabase project URL" style="flex:1;min-width:240px">
            <input id="rareSupabaseAnonKey" type="text" value="${esc(settings.anonKey || "")}" placeholder="Supabase anon key" style="flex:1;min-width:240px">
          </div>
          <div class="control-row" style="flex-wrap:wrap">
            <input id="rareSupabaseTable" type="text" value="${esc(settings.table || "")}" placeholder="Table name" style="min-width:180px">
            <input id="rareSupabaseColSlug" type="text" value="${esc(settings.columns.slug || "")}" placeholder="Slug column" style="min-width:150px">
            <input id="rareSupabaseColDate" type="text" value="${esc(settings.columns.observedOn || "")}" placeholder="Observed date column" style="min-width:170px">
            <input id="rareSupabaseColLat" type="text" value="${esc(settings.columns.latitude || "")}" placeholder="Latitude column" style="min-width:150px">
            <input id="rareSupabaseColLng" type="text" value="${esc(settings.columns.longitude || "")}" placeholder="Longitude column" style="min-width:150px">
            <input id="rareSupabaseColArea" type="text" value="${esc(settings.columns.generalArea || "")}" placeholder="Area column" style="min-width:150px">
          </div>
          <div class="control-row" style="flex-wrap:wrap">
            <input id="rareSupabaseColConfidence" type="text" value="${esc(settings.columns.confidence || "")}" placeholder="Confidence column" style="min-width:170px">
            <input id="rareSupabaseColNotes" type="text" value="${esc(settings.columns.notes || "")}" placeholder="Notes column" style="min-width:150px">
            <input id="rareSupabaseColId" type="text" value="${esc(settings.columns.id || "")}" placeholder="ID column" style="min-width:120px">
          </div>
          <p class="muted small">Use your existing Supabase table and column names here. Only the fields above are required for this logger.</p>
          <div class="control-row">
            <button class="primary" type="button" id="rareSupabaseSaveBtn">Save settings</button>
            <button type="button" id="rareSupabaseTestBtn">Test connection</button>
          </div>
        </section>
      </div>

      <p class="results-meta" style="margin-top:.75rem">${filtered.length} shown • ${records.length} total rare entries • ${totalSightings} saved sightings visible here</p>
    </section>

    ${filtered.length ? `<section class="record-list">${filtered.map(record => {
      const rare = rareData(record);
      const sightings = Array.isArray(sightingsMap[record.slug]) ? sightingsMap[record.slug] : [];
      const lead = rare.reason || record.short_reason || compactList(rare.key_features, 1) || record.habitat || "";
      const fieldMarks = rare.field_marks || compactList(rare.key_features);
      const sensitiveNote = rare.sensitive_location
        ? `<p class="muted small"><strong>Location caution:</strong> Publicly, keep exact locations vague. Your private logger can still store exact coordinates.</p>`
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

            <section class="detail-block" data-rare-log-panel="${esc(record.slug)}" hidden data-rare-sensitive="${rare.sensitive_location ? "1" : "0"}">
              <h4>Log sighting</h4>
              <p class="muted small">Click the map to place an exact marker.${rare.sensitive_location ? " These coordinates are for your private record; do not share them publicly." : ""}</p>
              <div class="control-row" style="flex-wrap:wrap">
                <input type="date" data-rare-log-date="${esc(record.slug)}">
                <input type="text" data-rare-log-area="${esc(record.slug)}" placeholder="General area or site name" style="flex:1;min-width:180px">
                <select data-rare-log-confidence="${esc(record.slug)}">
                  <option value="">Confidence</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div class="control-row" style="flex-wrap:wrap">
                <input type="text" data-rare-log-lat="${esc(record.slug)}" placeholder="Latitude" readonly style="min-width:170px">
                <input type="text" data-rare-log-lng="${esc(record.slug)}" placeholder="Longitude" readonly style="min-width:170px">
                <button type="button" data-rare-log-gps="${esc(record.slug)}">Use GPS</button>
              </div>
              <div data-rare-log-map="${esc(record.slug)}" style="height:280px;border:1px solid rgba(255,255,255,.14);border-radius:12px;overflow:hidden"></div>
              <p class="muted small" data-rare-log-coords="${esc(record.slug)}">No exact point selected yet.</p>
              <textarea data-rare-log-notes="${esc(record.slug)}" rows="3" placeholder="Notes, associated habitat, companions, conditions"></textarea>
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

function extractErrorText(text) {
  if (!text) return "Unknown Supabase error";
  try {
    const payload = JSON.parse(text);
    return payload?.message || payload?.error || text;
  } catch {
    return text;
  }
}

function restBaseUrl(settings) {
  return `${String(settings.url || "").replace(/\/+$/, "")}/rest/v1/${encodeURIComponent(settings.table)}`;
}

function restHeaders(settings, extra = {}) {
  return {
    apikey: settings.anonKey,
    Authorization: `Bearer ${settings.anonKey}`,
    ...extra
  };
}

async function ensureRemoteSightingsLoaded() {
  if (!hasSupabaseConfig()) {
    remoteSightingsLoaded = false;
    remoteSightingsBySlug = {};
    remoteSightingsError = "";
    return {};
  }
  if (remoteSightingsPromise) return remoteSightingsPromise;

  const settings = loadSupabaseSettings();
  remoteSightingsPromise = (async () => {
    try {
      remoteSightingsError = "";
      const createdAtColumn = settingsValue(settings, "createdAt");
      const orderClause = createdAtColumn ? `&order=${encodeURIComponent(createdAtColumn)}.desc.nullslast` : "";
      const response = await fetch(`${restBaseUrl(settings)}?select=*${orderClause}`, {
        headers: restHeaders(settings)
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(extractErrorText(text));
      }
      const payload = text ? JSON.parse(text) : [];
      const normalized = Array.isArray(payload)
        ? payload.map((row) => normalizeRemoteRow(row, settings)).filter(Boolean)
        : [];
      remoteSightingsBySlug = groupSightings(normalized);
      remoteSightingsLoaded = true;
      remoteSightingsAttempted = true;
      return remoteSightingsBySlug;
    } catch (err) {
      remoteSightingsLoaded = false;
      remoteSightingsAttempted = true;
      remoteSightingsBySlug = {};
      remoteSightingsError = err?.message || String(err);
      throw err;
    } finally {
      remoteSightingsPromise = null;
    }
  })();

  return remoteSightingsPromise;
}

function buildInsertRow(record, payload, settings) {
  const cols = settings.columns || {};
  const row = {};
  if (cols.slug) row[cols.slug] = record.slug;
  if (cols.displayName) row[cols.displayName] = record.display_name || record.common_name || record.slug;
  if (cols.scientificName) row[cols.scientificName] = record.scientific_name || "";
  if (cols.observedOn) row[cols.observedOn] = payload.date || null;
  if (cols.latitude) row[cols.latitude] = payload.latitude;
  if (cols.longitude) row[cols.longitude] = payload.longitude;
  if (cols.generalArea) row[cols.generalArea] = payload.area || null;
  if (cols.confidence) row[cols.confidence] = payload.confidence || null;
  if (cols.notes) row[cols.notes] = payload.notes || null;
  if (cols.sensitiveLocation) row[cols.sensitiveLocation] = payload.sensitiveLocation === true;
  return row;
}

async function saveRemoteSighting(record, payload) {
  const settings = loadSupabaseSettings();
  const response = await fetch(restBaseUrl(settings), {
    method: "POST",
    headers: restHeaders(settings, {
      "Content-Type": "application/json",
      Prefer: "return=representation"
    }),
    body: JSON.stringify(buildInsertRow(record, payload, settings))
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(extractErrorText(text));
  }
  const returned = text ? JSON.parse(text) : [];
  const normalized = normalizeRemoteRow(Array.isArray(returned) ? returned[0] : null, settings);
  return normalized || {
    ...payload,
    slug: record.slug,
    source: "supabase"
  };
}

async function deleteRemoteSighting(item) {
  const settings = loadSupabaseSettings();
  const idColumn = settingsValue(settings, "id") || "id";
  if (item?.id === undefined || item?.id === null || item?.id === "") {
    throw new Error("Remote delete requires an ID column.");
  }
  const url = `${restBaseUrl(settings)}?${encodeURIComponent(idColumn)}=eq.${encodeURIComponent(item.id)}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: restHeaders(settings, { Prefer: "return=representation" })
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(extractErrorText(text));
  }
}

function appendLocalSighting(slug, payload) {
  const local = loadLocalSightings();
  const existing = Array.isArray(local[slug]) ? local[slug] : [];
  existing.unshift(payload);
  local[slug] = existing.slice(0, 25);
  saveLocalSightings(local);
}

function deleteLocalSighting(slug, index) {
  const local = loadLocalSightings();
  const existing = Array.isArray(local[slug]) ? local[slug] : [];
  local[slug] = existing.filter((_, i) => i !== index);
  if (!local[slug].length) delete local[slug];
  saveLocalSightings(local);
}

async function ensureLeaflet() {
  if (window.L) return window.L;
  if (leafletPromise) return leafletPromise;

  if (!document.getElementById(LEAFLET_CSS_ID)) {
    const link = document.createElement("link");
    link.id = LEAFLET_CSS_ID;
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }

  leafletPromise = new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }
    const existing = document.getElementById(LEAFLET_SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L));
      existing.addEventListener("error", () => reject(new Error("Leaflet failed to load.")));
      return;
    }
    const script = document.createElement("script");
    script.id = LEAFLET_SCRIPT_ID;
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("Leaflet failed to load."));
    document.head.appendChild(script);
  });

  return leafletPromise;
}

function getPanelFields(slug) {
  return {
    panel: document.querySelector(`[data-rare-log-panel="${slug}"]`),
    lat: document.querySelector(`[data-rare-log-lat="${slug}"]`),
    lng: document.querySelector(`[data-rare-log-lng="${slug}"]`),
    coords: document.querySelector(`[data-rare-log-coords="${slug}"]`),
    map: document.querySelector(`[data-rare-log-map="${slug}"]`),
    date: document.querySelector(`[data-rare-log-date="${slug}"]`),
    area: document.querySelector(`[data-rare-log-area="${slug}"]`),
    confidence: document.querySelector(`[data-rare-log-confidence="${slug}"]`),
    notes: document.querySelector(`[data-rare-log-notes="${slug}"]`)
  };
}

function setCoords(slug, lat, lng, options = {}) {
  const fields = getPanelFields(slug);
  if (fields.lat) fields.lat.value = Number.isFinite(lat) ? String(lat.toFixed(6)) : "";
  if (fields.lng) fields.lng.value = Number.isFinite(lng) ? String(lng.toFixed(6)) : "";
  if (fields.coords) fields.coords.textContent = formatCoords(lat, lng);

  const controller = mapControllers.get(slug);
  if (controller?.map && Number.isFinite(lat) && Number.isFinite(lng)) {
    const target = [lat, lng];
    if (!controller.marker) {
      controller.marker = window.L.marker(target).addTo(controller.map);
    } else {
      controller.marker.setLatLng(target);
    }
    if (options.pan !== false) {
      controller.map.setView(target, options.zoom || 13);
    }
  }
}

async function initMapForSlug(slug) {
  const fields = getPanelFields(slug);
  if (!fields.map) return;
  const L = await ensureLeaflet();
  let controller = mapControllers.get(slug);
  if (!controller) {
    const currentLat = Number(fields.lat?.value);
    const currentLng = Number(fields.lng?.value);
    const hasCurrent = Number.isFinite(currentLat) && Number.isFinite(currentLng);
    const center = hasCurrent ? [currentLat, currentLng] : DEFAULT_MAP_CENTER;
    const zoom = hasCurrent ? 13 : DEFAULT_MAP_ZOOM;
    const map = L.map(fields.map).setView(center, zoom);
    L.tileLayer(TILE_URL, {
      maxZoom: 19,
      attribution: TILE_ATTRIBUTION
    }).addTo(map);
    map.on("click", (event) => {
      setCoords(slug, event.latlng.lat, event.latlng.lng, { zoom: map.getZoom() < 13 ? 13 : map.getZoom() });
    });
    controller = { map, marker: null };
    mapControllers.set(slug, controller);
    if (hasCurrent) {
      setCoords(slug, currentLat, currentLng, { zoom, pan: false });
    }
  }
  setTimeout(() => controller.map.invalidateSize(), 40);
}

function populateCoordsFromExisting(slug) {
  const sightings = currentSightingsMap()[slug] || [];
  const firstWithCoords = sightings.find((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));
  if (firstWithCoords) {
    setCoords(slug, firstWithCoords.latitude, firstWithCoords.longitude, { pan: false, zoom: 13 });
  }
}

async function useGpsForSlug(slug) {
  if (!navigator.geolocation) {
    throw new Error("This browser does not expose GPS location.");
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords(slug, lat, lng, { zoom: 14 });
        resolve({ lat, lng });
      },
      (error) => reject(new Error(error?.message || "Unable to read GPS position.")),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  });
}

function closeAllMapControllers() {
  mapControllers.forEach((controller) => {
    try {
      controller.map?.remove();
    } catch {}
  });
  mapControllers.clear();
}

function updateSettingsFromForm() {
  const settings = defaultSupabaseSettings();
  settings.url = document.getElementById("rareSupabaseUrl")?.value?.trim() || "";
  settings.anonKey = document.getElementById("rareSupabaseAnonKey")?.value?.trim() || "";
  settings.table = document.getElementById("rareSupabaseTable")?.value?.trim() || "rare_sightings";
  settings.columns.slug = document.getElementById("rareSupabaseColSlug")?.value?.trim() || settings.columns.slug;
  settings.columns.observedOn = document.getElementById("rareSupabaseColDate")?.value?.trim() || settings.columns.observedOn;
  settings.columns.latitude = document.getElementById("rareSupabaseColLat")?.value?.trim() || settings.columns.latitude;
  settings.columns.longitude = document.getElementById("rareSupabaseColLng")?.value?.trim() || settings.columns.longitude;
  settings.columns.generalArea = document.getElementById("rareSupabaseColArea")?.value?.trim() || settings.columns.generalArea;
  settings.columns.confidence = document.getElementById("rareSupabaseColConfidence")?.value?.trim() || settings.columns.confidence;
  settings.columns.notes = document.getElementById("rareSupabaseColNotes")?.value?.trim() || settings.columns.notes;
  settings.columns.id = document.getElementById("rareSupabaseColId")?.value?.trim() || settings.columns.id;
  return settings;
}

function resetRemoteCache() {
  remoteSightingsPromise = null;
  remoteSightingsLoaded = false;
  remoteSightingsAttempted = false;
  remoteSightingsError = "";
  remoteSightingsBySlug = {};
}

export function setupRarePage({ setFilters, clearFilters, rerender }) {
  if (hasSupabaseConfig() && !remoteSightingsLoaded && !remoteSightingsPromise && !remoteSightingsAttempted) {
    ensureRemoteSightingsLoaded().then(() => rerender()).catch(() => rerender());
  }

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

  document.getElementById("rareSupabaseSettingsToggle")?.addEventListener("click", () => {
    const panel = document.getElementById("rareSupabaseSettingsPanel");
    if (panel) panel.hidden = !panel.hidden;
  });

  document.getElementById("rareSupabaseSaveBtn")?.addEventListener("click", () => {
    const settings = updateSettingsFromForm();
    saveSupabaseSettings(settings);
    resetRemoteCache();
    rerender();
  });

  document.getElementById("rareSupabaseTestBtn")?.addEventListener("click", async () => {
    try {
      const settings = updateSettingsFromForm();
      saveSupabaseSettings(settings);
      resetRemoteCache();
      await ensureRemoteSightingsLoaded();
      rerender();
      alert("Supabase connection worked and sightings loaded.");
    } catch (err) {
      rerender();
      alert(`Supabase test failed: ${err?.message || String(err)}`);
    }
  });

  document.getElementById("rareSupabaseRefreshBtn")?.addEventListener("click", async () => {
    try {
      resetRemoteCache();
      await ensureRemoteSightingsLoaded();
      rerender();
    } catch (err) {
      rerender();
      alert(`Refresh failed: ${err?.message || String(err)}`);
    }
  });

  document.querySelectorAll("[data-rare-log-toggle]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const slug = btn.dataset.rareLogToggle || "";
      const panel = document.querySelector(`[data-rare-log-panel="${slug}"]`);
      if (!panel) return;
      panel.hidden = !panel.hidden;
      if (!panel.hidden) {
        const fields = getPanelFields(slug);
        if (fields.date && !fields.date.value) {
          fields.date.value = new Date().toISOString().slice(0, 10);
        }
        populateCoordsFromExisting(slug);
        try {
          await initMapForSlug(slug);
        } catch (err) {
          const coordsLabel = fields.coords;
          if (coordsLabel) coordsLabel.textContent = `Map failed to load: ${err?.message || String(err)}`;
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

  document.querySelectorAll("[data-rare-log-gps]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const slug = btn.dataset.rareLogGps || "";
      try {
        await initMapForSlug(slug);
        await useGpsForSlug(slug);
      } catch (err) {
        alert(`GPS failed: ${err?.message || String(err)}`);
      }
    });
  });

  document.querySelectorAll("[data-rare-log-save]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const slug = btn.dataset.rareLogSave || "";
      if (!slug) return;
      const card = btn.closest(".record-card");
      const record = {
        slug,
        display_name: card?.querySelector("h3 .record-title-button")?.textContent?.trim() || slug,
        scientific_name: card?.querySelector(".muted.small")?.textContent?.trim() || "",
        common_name: card?.querySelector("h3 .record-title-button")?.textContent?.trim() || slug
      };
      const fields = getPanelFields(slug);
      const latitude = Number(fields.lat?.value);
      const longitude = Number(fields.lng?.value);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        alert("Pick an exact point on the map first.");
        return;
      }
      const payload = {
        slug,
        date: String(fields.date?.value || "").trim(),
        area: String(fields.area?.value || "").trim(),
        confidence: String(fields.confidence?.value || "").trim(),
        notes: String(fields.notes?.value || "").trim(),
        latitude,
        longitude,
        sensitiveLocation: fields.panel?.dataset.rareSensitive === "1",
        source: hasSupabaseConfig() ? "supabase" : "local"
      };

      try {
        if (hasSupabaseConfig()) {
          const saved = await saveRemoteSighting(record, payload);
          const existing = Array.isArray(remoteSightingsBySlug[slug]) ? remoteSightingsBySlug[slug] : [];
          remoteSightingsBySlug[slug] = [saved, ...existing];
          remoteSightingsLoaded = true;
          appendLocalSighting(slug, saved);
        } else {
          appendLocalSighting(slug, payload);
        }
        rerender();
      } catch (err) {
        appendLocalSighting(slug, { ...payload, source: "local" });
        rerender();
        alert(`Supabase save failed. The sighting was kept locally only.\n\n${err?.message || String(err)}`);
      }
    });
  });

  document.querySelectorAll("[data-rare-log-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const slug = btn.dataset.rareLogDelete || "";
      const index = Number(btn.dataset.rareLogIndex || -1);
      if (!slug || index < 0) return;
      const sightings = currentSightingsMap()[slug] || [];
      const item = sightings[index];
      if (!item) return;
      try {
        if (item.source === "supabase" && hasSupabaseConfig()) {
          await deleteRemoteSighting(item);
          remoteSightingsBySlug[slug] = (remoteSightingsBySlug[slug] || []).filter((entry) => sightingFingerprint(entry) !== sightingFingerprint(item));
          if (!remoteSightingsBySlug[slug]?.length) delete remoteSightingsBySlug[slug];
        }
        const local = loadLocalSightings();
        const localList = Array.isArray(local[slug]) ? local[slug] : [];
        local[slug] = localList.filter((entry) => sightingFingerprint(entry) !== sightingFingerprint(item));
        if (!local[slug].length) delete local[slug];
        saveLocalSightings(local);
        rerender();
      } catch (err) {
        alert(`Delete failed: ${err?.message || String(err)}`);
      }
    });
  });

  const root = document.getElementById("pageRoot") || document;
  root.addEventListener("click", () => {
    // noop placeholder to keep root referenced after rerenders
  }, { once: true });
}

window.addEventListener("hashchange", closeAllMapControllers);
