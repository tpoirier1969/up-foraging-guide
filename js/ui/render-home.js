import { classifyRecord } from "../lib/merge.js";

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function currentMonthName() {
  return new Date().toLocaleString("en-US", { month: "long" });
}

function currentMonthNumber() {
  return new Date().getMonth() + 1;
}

function isVisible(record) {
  return !record?.hidden;
}

function isInSeason(record, monthName, monthNumber) {
  const names = Array.isArray(record?.months_available) ? record.months_available : [];
  const numbers = Array.isArray(record?.month_numbers) ? record.month_numbers : [];
  return names.includes(monthName) || numbers.includes(monthNumber);
}

function isEdibleMushroomRecord(record) {
  const flags = classifyRecord(record);
  if (!isVisible(record) || !flags.isMushroom) return false;
  if (String(record?.non_edible_severity || "").trim()) return false;
  return !!String(record?.culinary_uses || "").trim() || !flags.lookalike;
}

function isPlantRecord(record) {
  const flags = classifyRecord(record);
  if (!isVisible(record) || !flags.isPlant) return false;
  return !String(record?.non_edible_severity || "").trim();
}

function isMedicinalRecord(record) {
  return isVisible(record) && classifyRecord(record).medicinal;
}

function pickHomeImage(record) {
  const structured = Array.isArray(record?.images_structured) ? record.images_structured : [];
  if (structured.length) {
    const item = structured[0] || {};
    return item.detail || item.thumb || item.full || "";
  }

  if (record?.list_thumbnail) return record.list_thumbnail;

  const details = Array.isArray(record?.detail_images) ? record.detail_images : [];
  if (details[0]) return details[0];

  const enlarge = Array.isArray(record?.enlarge_images) ? record.enlarge_images : [];
  if (enlarge[0]) return enlarge[0];

  const images = Array.isArray(record?.images) ? record.images : [];
  if (!images.length) return "";
  const first = images[0];
  if (typeof first === "string") return first;
  if (!first || typeof first !== "object") return "";
  return first.detail || first.thumb || first.src || first.full || "";
}

function shuffle(items) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function selectHighlights(plantsInSeason, mushroomsInSeason) {
  const plantsWithImages = shuffle(plantsInSeason.filter((record) => !!pickHomeImage(record)));
  const mushroomsWithImages = shuffle(mushroomsInSeason.filter((record) => !!pickHomeImage(record)));

  const picks = [
    ...mushroomsWithImages.slice(0, 3),
    ...plantsWithImages.slice(0, 3)
  ];

  const used = new Set(picks.map((record) => record.slug));
  const fallbackPool = shuffle([
    ...mushroomsWithImages.slice(3),
    ...plantsWithImages.slice(3),
    ...shuffle([...mushroomsInSeason, ...plantsInSeason]).filter((record) => !!pickHomeImage(record) && !used.has(record.slug))
  ]);

  while (picks.length < 6 && fallbackPool.length) {
    const next = fallbackPool.shift();
    if (!next || used.has(next.slug)) continue;
    picks.push(next);
    used.add(next.slug);
  }

  return shuffle(picks).slice(0, 6);
}

function renderHighlightCard(record) {
  const label = record.display_name || record.common_name || record.slug || "Untitled";
  const image = pickHomeImage(record);
  return `
    <button class="home-season-card" type="button" data-detail="${esc(record.slug || "")}">
      <div class="in-focus-caption-top"><strong>${esc(label)}</strong></div>
      <img src="${esc(image)}" alt="${esc(label)}" loading="lazy" decoding="async">
    </button>
  `;
}

export function renderHome(species, errors = []) {
  const monthName = currentMonthName();
  const monthNumber = currentMonthNumber();
  const visibleSpecies = (species || []).filter(isVisible);

  const plants = visibleSpecies.filter(isPlantRecord);
  const mushrooms = visibleSpecies.filter(isEdibleMushroomRecord);
  const medicinal = visibleSpecies.filter(isMedicinalRecord);

  const plantsInSeason = plants.filter((record) => isInSeason(record, monthName, monthNumber));
  const mushroomsInSeason = mushrooms.filter((record) => isInSeason(record, monthName, monthNumber));
  const highlights = selectHighlights(plantsInSeason, mushroomsInSeason);

  return `
    <section class="panel in-focus-feature">
      <div class="result-title-row home-title-row">
        <div>
          <h2>In Focus Right Now</h2>
          <p class="results-meta">${esc(monthName)}</p>
        </div>
      </div>

      <section class="detail-card section-block safety-callout warning">
        <h3>Use this guide carefully</h3>
        <p>This guide was put together by an amateur forager, not a scientist. I made it to be a reminder of things I've known, it is not intended to be a one-stop-app for all things foraging.</p>
        <p>Treat all plants, especially mushrooms, as potentially inedible and dangerous, don't eat anything until you know the species and know how to prepare it. Foraging can be a fun and rewarding way to make some great meals, just do it wisely.</p>
        <p>The guide includes sections on plants, mushrooms, medicinals, and non-edible look alikes to be aware of. There's a timeline that will show you the different species you'll likely find in the woods each month, a sheet of reference materials, and as a bonus there is a Rare section for Upper Michigan species and sightings.</p>
      </section>

      <div class="in-focus-layout">
        <div class="in-focus-stats">
          <div class="in-focus-stat-card"><strong>${plantsInSeason.length}</strong><span>plants in season</span></div>
          <div class="in-focus-stat-card"><strong>${mushroomsInSeason.length}</strong><span>mushrooms in season</span></div>
          <div class="in-focus-stat-card"><strong>${plants.length}</strong><span>total plants</span></div>
          <div class="in-focus-stat-card"><strong>${mushrooms.length}</strong><span>total mushrooms</span></div>
          <div class="in-focus-stat-card"><strong>${medicinal.length}</strong><span>medicinal species</span></div>
          <div class="in-focus-stat-card"><strong>0</strong><span>rare / endangered entries</span></div>
        </div>

        <div class="in-focus-highlights">
          ${highlights.map(renderHighlightCard).join("")}
        </div>
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
  `;
}
