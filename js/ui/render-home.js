import { classifyRecord } from "../lib/merge.js";
import { esc } from "../lib/escape.js";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function currentMonthName() {
  return MONTHS[new Date().getMonth()] || MONTHS[0];
}

function asLowerArray(values) {
  return (Array.isArray(values) ? values : [])
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean);
}

function isInSeason(record, monthName) {
  const months = asLowerArray(record?.months_available);
  if (!months.length) return false;
  const target = String(monthName || "").trim().toLowerCase();
  return months.includes(target);
}

function isLikelyForagingPlant(record) {
  const caution = String(record?.non_edible_severity || "").trim();
  if (caution) return false;
  if (String(record?.food_role || "").trim() === "medicinal_only") return false;
  return !!String(record?.culinary_uses || "").trim()
    || !!String(record?.category || "").trim();
}

function isLikelyEdibleMushroom(record) {
  if (String(record?.non_edible_severity || "").trim()) return false;
  const culinary = String(record?.culinary_uses || "").trim();
  const edibleStatus = String(record?.mushroom_profile?.edibility_status || "").trim().toLowerCase();
  if (culinary) return true;
  return [
    "choice",
    "excellent",
    "very good",
    "good",
    "edible",
    "edible_with_caution",
    "edible_mediocre",
    "edible_when_young",
    "edible_when_white_inside",
    "choice_cooked_only"
  ].includes(edibleStatus);
}

function pickStructuredImage(record, variant = "thumb", index = 0) {
  const items = Array.isArray(record?.images_structured) ? record.images_structured : [];
  if (!items.length) return "";
  const item = items[index] || items[0] || {};
  return item[variant] || item.detail || item.thumb || item.full || "";
}

function pickArrayImage(record, index = 0) {
  const items = Array.isArray(record?.images) ? record.images : [];
  if (!items.length) return "";
  const item = items[index] || items[0];
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return "";
  return item.thumb || item.src || item.detail || item.full || "";
}

function firstImage(record) {
  return pickStructuredImage(record, "thumb", 0)
    || String(record?.list_thumbnail || "").trim()
    || (Array.isArray(record?.detail_images) ? record.detail_images[0] || "" : "")
    || (Array.isArray(record?.enlarge_images) ? record.enlarge_images[0] || "" : "")
    || pickArrayImage(record, 0)
    || "";
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickHighlights(plantsInSeason, mushroomsInSeason) {
  const withImages = [...mushroomsInSeason, ...plantsInSeason]
    .filter((record) => !!firstImage(record));
  return shuffle(withImages).slice(0, 6);
}

function warningBlock() {
  return `
    <section class="detail-card section-block safety-callout warning">
      <h3>Use this guide carefully</h3>
      <p>This guide was put together by an amateur forager, not a scientist. It is a reminder tool, not a final authority.</p>
      <p>Treat all plants and especially all mushrooms as potentially dangerous until you are certain of the identification and know the proper preparation.</p>
      <p>The guide includes edible plants, mushrooms, medicinal uses, cautionary look-alikes, references, and rare species. Enjoy it, but do not let it do your thinking for you.</p>
    </section>
  `;
}

function highlightCard(record) {
  const image = firstImage(record);
  return `
    <button class="in-focus-card" type="button" data-detail="${esc(record.slug || "")}">
      ${image ? `<img src="${esc(image)}" alt="${esc(record.display_name || record.common_name || record.slug || "Species")}">` : `<div class="in-focus-image-placeholder">No image</div>`}
      <div class="in-focus-caption in-focus-caption-top">
        <strong>${esc(record.display_name || record.common_name || record.slug || "Untitled")}</strong>
        <span>${esc(record.scientific_name || record.category || "")}</span>
      </div>
    </button>
  `;
}

function statCard(value, label) {
  return `<div class="in-focus-stat-card"><strong>${value}</strong><span>${esc(label)}</span></div>`;
}

export function renderHome(species, errors = [], rareSpecies = []) {
  const month = currentMonthName();

  const plants = (species || []).filter((record) => {
    const { isPlant } = classifyRecord(record);
    return !record?.hidden && isPlant && isLikelyForagingPlant(record);
  });

  const mushrooms = (species || []).filter((record) => {
    const { isMushroom } = classifyRecord(record);
    return !record?.hidden && isMushroom && isLikelyEdibleMushroom(record);
  });

  const plantsInSeason = plants.filter((record) => isInSeason(record, month));
  const mushroomsInSeason = mushrooms.filter((record) => isInSeason(record, month));

  const medicinal = (species || []).filter((record) => {
    if (record?.hidden) return false;
    const { medicinal } = classifyRecord(record);
    return medicinal;
  });

  const highlights = pickHighlights(plantsInSeason, mushroomsInSeason);

  return `
    <section class="panel home-hub in-focus-feature">
      <div class="result-header compact-result-header">
        <div class="result-title-row">
          <h3>In Focus Right Now</h3>
          <p class="results-meta">${esc(month)}</p>
        </div>
      </div>

      ${warningBlock()}

      <div class="home-search-row">
        <input id="homeSearch" type="search" placeholder="Search species by common, scientific, notes, or aliases">
        <button id="homeSearchBtn" class="primary" type="button">Search</button>
      </div>

      <div class="in-focus-layout">
        <div class="in-focus-stats">
          ${statCard(plantsInSeason.length, "plants in season")}
          ${statCard(mushroomsInSeason.length, "mushrooms in season")}
          ${statCard(plants.length, "total plants")}
          ${statCard(mushrooms.length, "total mushrooms")}
          ${statCard(medicinal.length, "medicinal entries")}
          ${statCard((rareSpecies || []).length, "rare entries")}
        </div>

        <div class="in-focus-highlights">
          ${highlights.length
            ? highlights.map((record) => highlightCard(record)).join("")
            : `<div class="panel empty-state home-empty-state"><h3>No in-season images yet</h3><p>Add more month tags or images and this panel will wake up.</p></div>`
          }
        </div>
      </div>

      ${errors.length ? `
        <section class="error-box">
          <h3>Core load warnings</h3>
          <ul class="list-tight">
            ${errors.map((item) => `<li><span class="codeish">${esc(item.path || "")}</span> — ${esc(item.error || "")}</li>`).join("")}
          </ul>
        </section>
      ` : ""}
    </section>
  `;
}
