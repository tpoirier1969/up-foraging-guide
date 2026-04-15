import { FORAGING_RARE_SIGHTINGS_TABLE } from "./constants-mainfix.js";
import { state } from "./state.js?v=v2.10-rare-watch";

const LOCAL_KEY = "foraging_rare_sightings_local_v1";
let leafletReady = false;
let rareMap = null;
let rareMarkers = [];
let clickMarker = null;

function byName(a, b) {
  return String(a.common_name || a.scientific_name || "").localeCompare(String(b.common_name || b.scientific_name || ""));
}
function esc(v){
  return String(v ?? "").replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
export async function loadRareSpecies() {
  try {
    const response = await fetch("data/rare-species-v1.json", { cache: "no-store" });
    const payload = await response.json();
    return payload.records || [];
  } catch {
    return [];
  }
}
function localSightings() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch { return []; }
}
function saveLocalSightings(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}
async function getSupabaseClient() {
  const cfg = window.FORAGING_APP_CONFIG || {};
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY || !window.supabase?.createClient) return null;
  return window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
}
export async function loadRareSightings() {
  const client = await getSupabaseClient();
  if (!client) return localSightings();
  try {
    const { data, error } = await client.from(FORAGING_RARE_SIGHTINGS_TABLE).select("*").order("seen_on", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return localSightings();
  }
}
export async function saveRareSighting(entry) {
  const client = await getSupabaseClient();
  const payload = {
    species_slug: entry.species_slug,
    species_name: entry.species_name,
    seen_on: entry.seen_on,
    latitude: entry.latitude,
    longitude: entry.longitude,
    notes: entry.notes || "",
    precision_mode: entry.precision_mode || "approximate",
    source_app: "foraging"
  };
  if (!client) {
    const items = localSightings();
    payload.id = crypto.randomUUID();
    items.unshift(payload);
    saveLocalSightings(items);
    return payload;
  }
  const { data, error } = await client.from(FORAGING_RARE_SIGHTINGS_TABLE).insert(payload).select().single();
  if (error) throw error;
  return data;
}
function rounded(lat, lng, precision) {
  if (precision === "hidden") return { lat: null, lng: null, label: "Hidden" };
  if (precision === "approximate") {
    return { lat: Number(Number(lat).toFixed(2)), lng: Number(Number(lng).toFixed(2)), label: `${Number(lat).toFixed(2)}, ${Number(lng).toFixed(2)}` };
  }
  return { lat: Number(Number(lat).toFixed(5)), lng: Number(Number(lng).toFixed(5)), label: `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}` };
}
function renderSpeciesList(records) {
  const officialPlants = records.filter(r => r.group === "plant").sort(byName);
  const fungi = records.filter(r => r.group === "fungus").sort(byName);
  return `
    <section class="panel">
      <div class="result-header compact-result-header">
        <div class="result-title-row">
          <h3>Rare / endangered species list</h3>
          <p class="results-meta">${records.length} entries</p>
        </div>
      </div>
      <div class="rare-columns">
        <section class="panel">
          <h3>Plants</h3>
          <div class="rare-species-list">
            ${officialPlants.map(r => `<article class="rare-species-item"><h4>${esc(r.common_name)}</h4><p class="small-note"><strong>${esc(r.scientific_name)}</strong></p><p class="small-note">${esc(r.status)} · ${esc(r.legal_status)}</p><p>${esc(r.reason || "")}</p><p class="small-note">Habitat: ${esc(r.habitat || "—")}</p></article>`).join("")}
          </div>
        </section>
        <section class="panel">
          <h3>Fungi watchlist</h3>
          <p class="small-note">Non-legal watchlist entries with a reasonable rarity case or habitat-sensitivity case.</p>
          <div class="rare-species-list">
            ${fungi.map(r => `<article class="rare-species-item"><h4>${esc(r.common_name)}</h4><p class="small-note"><strong>${esc(r.scientific_name)}</strong></p><p class="small-note">${esc(r.status)} · ${esc(r.legal_status)}</p><p>${esc(r.reason || "")}</p><p class="small-note">Habitat: ${esc(r.habitat || "—")}</p></article>`).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}
function renderSightingList(sightings) {
  if (!sightings.length) return '<p class="small-note">No sightings saved yet.</p>';
  return sightings.map(item => {
    const view = rounded(item.latitude, item.longitude, item.precision_mode || "approximate");
    return `<article class="rare-sighting-item"><h4>${esc(item.species_name || item.species_slug)}</h4><p class="small-note">${esc(item.seen_on || "")}</p><p>${view.label}</p>${item.notes ? `<p>${esc(item.notes)}</p>` : ""}</article>`;
  }).join("");
}
function renderSightingsPanel(records, sightings) {
  const speciesOptions = records.sort(byName).map(r => `<option value="${esc(r.slug)}">${esc(r.common_name)} — ${esc(r.scientific_name)}</option>`).join("");
  return `
    <section class="panel">
      <div class="result-header compact-result-header">
        <div class="result-title-row">
          <h3>My sightings</h3>
          <p class="results-meta">${sightings.length} saved</p>
        </div>
      </div>
      <div class="rare-sighting-grid">
        <div class="panel">
          <h3>Add sighting</h3>
          <label class="compact-filter"><span>Species</span><select id="rareSpeciesSelect">${speciesOptions}</select></label>
          <label class="compact-filter"><span>Date seen</span><input id="rareSeenOn" type="date"></label>
          <label class="compact-filter"><span>Latitude</span><input id="rareLatitude" type="number" step="0.00001" placeholder="46.5"></label>
          <label class="compact-filter"><span>Longitude</span><input id="rareLongitude" type="number" step="0.00001" placeholder="-87.4"></label>
          <label class="compact-filter"><span>Precision</span><select id="rarePrecision"><option value="approximate">Approximate</option><option value="exact">Exact</option><option value="hidden">Hidden</option></select></label>
          <label class="compact-filter"><span>Notes</span><textarea id="rareNotes" rows="4" placeholder="Habitat, abundance, photo note, weather, etc."></textarea></label>
          <div class="filter-actions"><button class="buttonish" type="button" id="rareUseLocationBtn">Use current location</button><button class="buttonish" type="button" id="rareSaveBtn">Save sighting</button></div>
          <p class="small-note">Map click will also fill latitude and longitude.</p>
        </div>
        <div class="panel"><h3>Map</h3><div id="rareMap" class="rare-map"></div></div>
      </div>
      <div class="rare-sighting-grid" style="margin-top:14px">
        <div class="panel">
          <h3>Shareable export</h3>
          <div class="filter-actions"><button class="buttonish" type="button" id="rareExportBtn">Build export text</button><button class="buttonish" type="button" id="rareCopyBtn">Copy text</button></div>
          <textarea id="rareExportText" rows="10" placeholder="Species — date — location"></textarea>
        </div>
        <div class="panel"><h3>Saved sightings</h3><div id="rareSightingList">${renderSightingList(sightings)}</div></div>
      </div>
    </section>
  `;
}
function exportText(sightings) {
  return sightings.map(item => {
    const view = rounded(item.latitude, item.longitude, item.precision_mode || "approximate");
    return `${item.species_name || item.species_slug} — ${item.seen_on || ""} — ${view.label}`;
  }).join("\\n");
}
async function ensureLeaflet() {
  if (leafletReady && window.L) return;
  if (!document.getElementById("leaflet-css")) {
    const link = document.createElement("link");
    link.id = "leaflet-css";
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }
  await new Promise((resolve, reject) => {
    if (window.L) return resolve();
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  leafletReady = true;
}
function drawMarkers() {
  if (!rareMap || !window.L) return;
  rareMarkers.forEach(m => m.remove());
  rareMarkers = [];
  for (const item of state.rareSightings || []) {
    const view = rounded(item.latitude, item.longitude, item.precision_mode || "approximate");
    if (view.lat == null || view.lng == null) continue;
    const marker = window.L.marker([view.lat, view.lng]).addTo(rareMap);
    marker.bindPopup(`<strong>${esc(item.species_name || item.species_slug)}</strong><br>${esc(item.seen_on || "")}<br>${esc(view.label)}`);
    rareMarkers.push(marker);
  }
}
async function initMap() {
  const mapEl = document.getElementById("rareMap");
  if (!mapEl) return;
  await ensureLeaflet();
  if (rareMap) { rareMap.invalidateSize(); drawMarkers(); return; }
  rareMap = window.L.map(mapEl).setView([46.5, -87.4], 6);
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "&copy; OpenStreetMap contributors" }).addTo(rareMap);
  rareMap.on("click", (e) => {
    document.getElementById("rareLatitude").value = e.latlng.lat.toFixed(5);
    document.getElementById("rareLongitude").value = e.latlng.lng.toFixed(5);
    if (clickMarker) clickMarker.remove();
    clickMarker = window.L.marker(e.latlng).addTo(rareMap);
  });
  drawMarkers();
}
export function renderRarePageHtml(records, sightings) {
  return renderSpeciesList(records) + renderSightingsPanel(records, sightings);
}
export async function wireRarePage() {
  await initMap();
  const useBtn = document.getElementById("rareUseLocationBtn");
  const saveBtn = document.getElementById("rareSaveBtn");
  const exportBtn = document.getElementById("rareExportBtn");
  const copyBtn = document.getElementById("rareCopyBtn");
  const exportBox = document.getElementById("rareExportText");
  const saveList = document.getElementById("rareSightingList");

  if (useBtn) useBtn.onclick = () => {
    navigator.geolocation?.getCurrentPosition?.((pos) => {
      document.getElementById("rareLatitude").value = pos.coords.latitude.toFixed(5);
      document.getElementById("rareLongitude").value = pos.coords.longitude.toFixed(5);
      if (rareMap) rareMap.setView([pos.coords.latitude, pos.coords.longitude], 12);
    });
  };
  if (saveBtn) saveBtn.onclick = async () => {
    const slug = document.getElementById("rareSpeciesSelect").value;
    const species = (state.rareSpecies || []).find(r => r.slug === slug);
    const seen_on = document.getElementById("rareSeenOn").value;
    const latitude = document.getElementById("rareLatitude").value;
    const longitude = document.getElementById("rareLongitude").value;
    const notes = document.getElementById("rareNotes").value;
    const precision_mode = document.getElementById("rarePrecision").value;
    if (!species || !seen_on || !latitude || !longitude) {
      alert("Species, date, latitude, and longitude are required.");
      return;
    }
    const saved = await saveRareSighting({
      species_slug: slug,
      species_name: species.common_name,
      seen_on,
      latitude: Number(latitude),
      longitude: Number(longitude),
      notes,
      precision_mode
    });
    state.rareSightings = [saved, ...(state.rareSightings || [])];
    saveList.innerHTML = renderSightingList(state.rareSightings);
    drawMarkers();
  };
  if (exportBtn) exportBtn.onclick = () => {
    exportBox.value = exportText(state.rareSightings || []);
  };
  if (copyBtn) copyBtn.onclick = async () => {
    if (!exportBox.value) exportBox.value = exportText(state.rareSightings || []);
    await navigator.clipboard.writeText(exportBox.value);
  };
}
