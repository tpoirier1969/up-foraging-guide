import { classifyRecord } from "../lib/merge.js?v=v4.2.47-r2026-04-27-mushroom-photo-fix1";
import { renderImageSlot } from "../lib/image-slot.js";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function currentMonthName() {
  return MONTHS[new Date().getMonth()] || MONTHS[0];
}

function isInSeason(record, month) {
  return Array.isArray(record?.months_available) && record.months_available.includes(month);
}

function asList(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function imageUrlFromCandidate(value) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value !== "object") return "";
  return String(value.thumb || value.detail || value.full || value.src || value.url || "").trim();
}

function isPlaceholderImageUrl(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return true;
  return text.startsWith("data:image/svg")
    || text.includes("image%20needed")
    || text.includes("image needed")
    || text.includes("needs%20photo")
    || text.includes("needs photo")
    || text.includes("placeholder image")
    || text.includes("public%20usable%20photo%20not%20yet%20found")
    || text.includes("public usable photo not yet found");
}

function collectImageCandidates(record = {}) {
  const candidates = [];
  const push = (value) => {
    const url = imageUrlFromCandidate(value);
    if (url) candidates.push(url);
  };

  asList(record.images_structured).forEach((item) => {
    if (item && typeof item === "object") {
      push(item.thumb);
      push(item.detail);
      push(item.full);
    } else {
      push(item);
    }
  });
  push(record.list_thumbnail);
  asList(record.detail_images).forEach(push);
  asList(record.enlarge_images).forEach(push);
  asList(record.images).forEach(push);
  return candidates;
}

function hasUsableImageCandidate(record) {
  return collectImageCandidates(record).some((url) => !isPlaceholderImageUrl(url));
}

function hasPreferredImageCandidate(record) {
  const structured = asList(record?.images_structured)
    .flatMap((item) => item && typeof item === "object" ? [item.thumb, item.detail, item.full] : [item])
    .filter(Boolean);
  if (structured.some((url) => !isPlaceholderImageUrl(url))) return true;

  const convenience = [record?.list_thumbnail, ...asList(record?.detail_images), ...asList(record?.enlarge_images)].filter(Boolean);
  return convenience.some((url) => !isPlaceholderImageUrl(url));
}

function shuffle(values) {
  const list = [...values];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function isHighlightCandidate(record, month) {
  if (record?.hidden) return false;
  const info = classifyRecord(record);
  if (!info.edible) return false;
  if (!isInSeason(record, month)) return false;
  if (!hasUsableImageCandidate(record)) return false;
  return info.isPlant || info.isMushroom;
}

function rankedHighlightCandidates(records = [], month, matcher = () => true) {
  const candidates = records.filter((record) => isHighlightCandidate(record, month) && matcher(classifyRecord(record)));
  const preferred = candidates.filter(hasPreferredImageCandidate);
  const fallback = candidates.filter((record) => !hasPreferredImageCandidate(record));
  return [...shuffle(preferred), ...shuffle(fallback)];
}

function takeUnique(target, candidates, count) {
  const seen = new Set(target.map((record) => record?.slug).filter(Boolean));
  for (const record of candidates) {
    if (!record?.slug || seen.has(record.slug)) continue;
    target.push(record);
    seen.add(record.slug);
    if (target.length >= count) break;
  }
  return target;
}

function pickHighlights(species, month) {
  const records = species || [];
  const plantCandidates = rankedHighlightCandidates(records, month, (info) => info.isPlant);
  const mushroomCandidates = rankedHighlightCandidates(records, month, (info) => info.isMushroom);
  const allCandidates = rankedHighlightCandidates(records, month, (info) => info.isPlant || info.isMushroom);

  const highlights = [];
  takeUnique(highlights, plantCandidates, 3);
  takeUnique(highlights, mushroomCandidates, 6);
  takeUnique(highlights, plantCandidates, 6);
  takeUnique(highlights, allCandidates, 6);
  return highlights.slice(0, 6);
}

function renderHomeImage(record) {
  return renderImageSlot(record, "card", { showMeta: false });
}

export function renderHome(species, errors = [], rareSpecies = []) {
  const month = currentMonthName();

  const plants = (species || []).filter((record) => {
    const info = classifyRecord(record);
    return !record?.hidden && info.isPlant && info.edible;
  });

  const mushrooms = (species || []).filter((record) => {
    const info = classifyRecord(record);
    return !record?.hidden && info.isMushroom && info.edible;
  });

  const plantsInSeason = plants.filter((record) => isInSeason(record, month));
  const mushroomsInSeason = mushrooms.filter((record) => isInSeason(record, month));

  const medicinal = (species || []).filter((record) => {
    if (record?.hidden) return false;
    return classifyRecord(record).medicinal;
  });

  const otherUses = (species || []).filter((record) => {
    if (record?.hidden) return false;
    return classifyRecord(record).otherUses;
  });

  const caution = (species || []).filter((record) => {
    if (record?.hidden) return false;
    return classifyRecord(record).caution;
  });

  const highlights = pickHighlights(species, month);

  return `
    <section class="panel home-focus-panel">
      <section class="home-safety-card">
        <h3>Use this guide carefully</h3>
        <p>This guide was put together by an amateur forager, not a scientist. I made it to be a reminder of things I've known, and it is not intended to be a one-stop app for all things foraging. It is also still very much being developed, with species records, images, filters, credits, and safety notes still being improved.</p>
        <p>Treat all plants, especially mushrooms, as potentially inedible and dangerous. Do not eat anything until you know the species and know how to prepare it. Foraging can be a fun and rewarding way to make some great meals, just do it wisely.</p>
        <p>The guide includes sections on plants, mushrooms, medicinals, other uses, rare species, and cautionary look-alikes. There's a timeline that will show you the species you'll likely find in the woods each month, plus references and credits. I am very open to suggestions, corrections, better local observations, and anything I should fix or improve; email me at <a href="mailto:tpoirier@nmu.edu">tpoirier@nmu.edu</a>.</p>
      </section>

      <section class="panel">
        <div class="control-row">
          <input id="homeSearch" type="search" value="" placeholder="Search the guide" style="flex:1;min-width:280px">
          <button id="homeSearchBtn" class="primary" type="button">Search</button>
        </div>
      </section>

      <div class="home-focus-heading">
        <h2>In Focus Right Now</h2>
        <p class="results-meta">${esc(month)}</p>
      </div>

      <section class="panel">
        <div class="home-focus-stats">
          <div class="home-focus-stat-card"><strong>${plantsInSeason.length}</strong><span>plants in season</span></div>
          <div class="home-focus-stat-card"><strong>${mushroomsInSeason.length}</strong><span>mushrooms in season</span></div>
          <div class="home-focus-stat-card"><strong>${plants.length}</strong><span>edible plants</span></div>
          <div class="home-focus-stat-card"><strong>${mushrooms.length}</strong><span>edible mushrooms</span></div>
          <div class="home-focus-stat-card"><strong>${medicinal.length}</strong><span>medicinal species</span></div>
          <div class="home-focus-stat-card"><strong>${otherUses.length}</strong><span>other uses</span></div>
          <div class="home-focus-stat-card"><strong>${caution.length}</strong><span>caution species</span></div>
          <div class="home-focus-stat-card"><strong>${Array.isArray(rareSpecies) ? rareSpecies.length : 0}</strong><span>rare / endangered entries</span></div>
        </div>
      </section>

      <section class="panel">
        <h3>Some Species In Season</h3>
        <div class="home-focus-highlights">
          ${highlights.map((record) => `
            <button
              class="home-focus-card"
              type="button"
              data-detail="${esc(record.slug)}"
              aria-label="Open details for ${esc(record.display_name || record.common_name || record.slug || "Untitled")}" 
            >
              <div class="home-focus-caption"><strong>${esc(record.display_name || record.common_name || record.slug || "Untitled")}</strong></div>
              ${renderHomeImage(record)}
            </button>
          `).join("")}
        </div>
      </section>

      ${errors.length ? `
        <section class="error-box">
          <h3>Core load warnings</h3>
          <ul class="list-tight">
            ${errors.map((item) => `<li><span class="codeish">${esc(item.path)}</span> — ${esc(item.error)}</li>`).join("")}
          </ul>
        </section>
      ` : ""}
    </section>
  `;
}
