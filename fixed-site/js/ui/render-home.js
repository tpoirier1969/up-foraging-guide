import { classifyRecord } from "../lib/merge.js";

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

function escAttr(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function placeholderSvg(label) {
  const text = String(label || "Loading photo").slice(0, 42);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#eef3ef"/><rect x="40" y="40" width="1120" height="720" rx="28" ry="28" fill="#f8fbf8" stroke="#c9d5cd" stroke-width="6"/><circle cx="290" cy="300" r="70" fill="#dce9df"/><path d="M150 620l210-210 120 110 155-165 210 265H150z" fill="#dce9df"/><text x="600" y="690" text-anchor="middle" font-family="system-ui, sans-serif" font-size="46" fill="#5f6d63">${text}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function currentMonthName() {
  return MONTHS[new Date().getMonth()] || MONTHS[0];
}

function isInSeason(record, month) {
  return Array.isArray(record?.months_available) && record.months_available.includes(month);
}

function isLikelyEdibleMushroom(record) {
  if (String(record?.non_edible_severity || "").trim()) return false;
  if (String(record?.food_role || "").trim() === "medicinal_only") return false;
  return true;
}

function isLikelyForagingPlant(record) {
  if (String(record?.non_edible_severity || "").trim()) return false;
  return true;
}

function hasAnyImageCandidate(record) {
  const structured = Array.isArray(record?.images_structured) ? record.images_structured : [];
  if (structured.length) return true;

  if (record?.list_thumbnail) return true;

  const detailImages = Array.isArray(record?.detail_images) ? record.detail_images : [];
  if (detailImages.length) return true;

  const enlargeImages = Array.isArray(record?.enlarge_images) ? record.enlarge_images : [];
  if (enlargeImages.length) return true;

  const images = Array.isArray(record?.images) ? record.images : [];
  if (!images.length) return false;

  const first = images[0];
  if (typeof first === "string") return !!first;
  if (first && typeof first === "object") {
    return !!(first.thumb || first.src || first.detail || first.full);
  }

  return false;
}

function shuffle(values) {
  const list = [...values];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function pickHighlights(species, month) {
  const candidates = (species || []).filter((record) => {
    if (record?.hidden) return false;
    const { isPlant, isMushroom } = classifyRecord(record);
    if (!isInSeason(record, month)) return false;
    if (!hasAnyImageCandidate(record)) return false;
    if (isPlant) return isLikelyForagingPlant(record);
    if (isMushroom) return isLikelyEdibleMushroom(record);
    return false;
  });

  return shuffle(candidates).slice(0, 6);
}

function renderHomeImage(record) {
  const label = record.display_name || record.common_name || record.slug || "Species";
  const alt = `${label} photo 1`;
  return `
    <img
      class="home-focus-image"
      data-record-image
      data-slug="${escAttr(record.slug || "")}"
      data-image-index="0"
      data-alt="${escAttr(alt)}"
      alt="${escAttr(alt)}"
      src="${placeholderSvg(`${label} loading photo`).replace(/"/g, "&quot;")}"
      loading="lazy"
      decoding="async"
    >
  `;
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

  const highlights = pickHighlights(species, month);

  return `
    <section class="panel home-focus-panel">
      <div class="home-focus-heading">
        <h2>In Focus Right Now</h2>
        <p class="results-meta">${esc(month)}</p>
      </div>

      <section class="home-safety-card">
        <h3>Use this guide carefully</h3>
        <p>This guide was put together by an amateur forager, not a scientist. I made it to be a reminder of things I've known, it is not intended to be a one-stop-app for all things foraging.</p>
        <p>Treat all plants, especially mushrooms, as potentially inedible and dangerous, don't eat anything until you know the species and know how to prepare it. Foraging can be a fun and rewarding way to make some great meals, just do it wisely.</p>
        <p>The guide includes sections on plants, mushrooms, medicinals, and non-edible look alikes to be aware of. There's a timeline that will show you the different species you'll likely find in the woods each month, a sheet of reference materials, and as a bonus I added a section on Rare and Endangered species of Upper Michigan that also enables you to save your sightings.</p>
      </section>

      <div class="home-focus-layout">
        <div class="home-focus-stats">
          <div class="home-focus-stat-card"><strong>${plantsInSeason.length}</strong><span>plants in season</span></div>
          <div class="home-focus-stat-card"><strong>${mushroomsInSeason.length}</strong><span>mushrooms in season</span></div>
          <div class="home-focus-stat-card"><strong>${plants.length}</strong><span>total plants</span></div>
          <div class="home-focus-stat-card"><strong>${mushrooms.length}</strong><span>total mushrooms</span></div>
          <div class="home-focus-stat-card"><strong>${medicinal.length}</strong><span>medicinal species</span></div>
          <div class="home-focus-stat-card"><strong>${Array.isArray(rareSpecies) ? rareSpecies.length : 0}</strong><span>rare / endangered entries</span></div>
        </div>

        <div class="home-focus-highlights">
          ${highlights.map((record) => `
            <button class="home-focus-card" type="button" data-detail="${esc(record.slug)}">
              <div class="home-focus-caption"><strong>${esc(record.display_name || record.common_name || record.slug || "Untitled")}</strong></div>
              ${renderHomeImage(record)}
            </button>
          `).join("")}
        </div>
      </div>

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
