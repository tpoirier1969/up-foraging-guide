import { classifyRecord } from "../lib/merge.js";
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

function monthNumberFromName(month) {
  const index = MONTHS.indexOf(month);
  return index >= 0 ? index + 1 : 0;
}

function normalizeMonthNumber(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 12 ? number : 0;
}

function isInSeason(record, month) {
  const monthNumber = monthNumberFromName(month);
  const namedMonths = Array.isArray(record?.months_available) ? record.months_available : [];
  if (namedMonths.includes(month)) return true;

  const numericMonths = [
    ...(Array.isArray(record?.month_numbers) ? record.month_numbers : []),
    ...(Array.isArray(record?.season_months) ? record.season_months : [])
  ]
    .map(normalizeMonthNumber)
    .filter(Boolean);

  return monthNumber > 0 && numericMonths.includes(monthNumber);
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

function stableSeasonRank(record) {
  const name = String(record?.display_name || record?.common_name || record?.slug || "").toLowerCase();
  const info = classifyRecord(record);
  const cautionScore = info.caution ? 2 : 0;
  const reviewScore = record?.needs_review || record?.review_status === "needs_review" ? 1 : 0;
  const imageScore = hasPreferredImageCandidate(record) ? 0 : 1;
  const plantBonus = info.isPlant ? 0 : 0.1;
  return `${cautionScore}${reviewScore}${imageScore}${plantBonus}-${name}`;
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
  return records
    .filter((record) => isHighlightCandidate(record, month) && matcher(classifyRecord(record)))
    .sort((a, b) => stableSeasonRank(a).localeCompare(stableSeasonRank(b)));
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
  takeUnique(highlights, plantCandidates, 4);
  takeUnique(highlights, mushroomCandidates, 8);
  takeUnique(highlights, allCandidates, 8);
  return highlights.slice(0, 8);
}

function renderHomeImage(record) {
  return renderImageSlot(record, "card", { showMeta: false });
}

function recordTypeLabel(record) {
  const info = classifyRecord(record);
  if (info.isMushroom) return "Mushroom";
  if (info.isPlant) return "Plant";
  return "Species";
}

function recordCautionLabel(record) {
  const info = classifyRecord(record);
  if (info.caution) return "Caution";
  if (record?.edibility_status && String(record.edibility_status).includes("caution")) return "Use caution";
  if (record?.preparation_required || record?.edible_use?.preparation_required) return "Prep required";
  return "In season";
}

function dashboardTile({ value, label, href, icon = "•", tone = "" }) {
  return `
    <a class="home-dashboard-tile ${esc(tone)}" href="${esc(href)}">
      <span class="home-dashboard-icon" aria-hidden="true">${esc(icon)}</span>
      <strong>${esc(value)}</strong>
      <span>${esc(label)}</span>
    </a>
  `;
}

export function renderHome(species, errors = [], rareSpecies = []) {
  const month = currentMonthName();

  const activeRecords = (species || []).filter((record) => !record?.hidden);

  const plants = activeRecords.filter((record) => {
    const info = classifyRecord(record);
    return info.isPlant && info.edible;
  });

  const mushrooms = activeRecords.filter((record) => {
    const info = classifyRecord(record);
    return info.isMushroom && info.edible;
  });

  const plantsInSeason = plants.filter((record) => isInSeason(record, month));
  const mushroomsInSeason = mushrooms.filter((record) => isInSeason(record, month));

  const medicinal = activeRecords.filter((record) => classifyRecord(record).medicinal);
  const otherUses = activeRecords.filter((record) => classifyRecord(record).otherUses);
  const caution = activeRecords.filter((record) => classifyRecord(record).caution);
  const highlights = pickHighlights(species, month);
  const rareCount = Array.isArray(rareSpecies) ? rareSpecies.length : 0;

  return `
    <section class="home-page option-one-home">
      <section class="home-dashboard-panel" aria-label="Foraging guide dashboard">
        <div class="home-dashboard-hero">
          <div>
            <div class="home-section-kicker">Upper Michigan</div>
            <h2>Foraging Guide</h2>
            <p>Plants, mushrooms, medicinal traditions, caution records, and practical uses — organized for safer field reference.</p>
          </div>
          <form class="home-search-form" onsubmit="event.preventDefault();document.getElementById('homeSearchBtn')?.click();">
            <input id="homeSearch" type="search" value="" placeholder="Search plants, mushrooms, uses, cautions" autocomplete="off">
            <button id="homeSearchBtn" class="primary" type="submit" aria-label="Search the guide">Search</button>
          </form>
        </div>

        <div class="home-dashboard-grid" aria-label="Guide sections and counts">
          ${dashboardTile({ value: activeRecords.length, label: "guide records", href: "#/search", icon: "⌕" })}
          ${dashboardTile({ value: plants.length, label: "edible plants", href: "#/plants", icon: "☘" })}
          ${dashboardTile({ value: mushrooms.length, label: "edible mushrooms", href: "#/mushrooms", icon: "△" })}
          ${dashboardTile({ value: medicinal.length, label: "medicinal", href: "#/medicinal", icon: "✚" })}
          ${dashboardTile({ value: caution.length, label: "caution", href: "#/lookalikes", icon: "!", tone: "warn" })}
          ${dashboardTile({ value: otherUses.length, label: "other uses", href: "#/other-uses", icon: "✦" })}
        </div>

        <div class="home-season-heading home-option-heading">
          <div>
            <div class="home-section-kicker">${esc(month)}</div>
            <h3>Likely in season now</h3>
            <p class="results-meta">Edible plant and mushroom records with image coverage. Verify ID, part, season, and preparation before use.</p>
          </div>
          <div class="home-season-actions">
            <a class="buttonish primary" href="#/mushrooms-in-season">Mushrooms in season</a>
            <a class="buttonish" href="#/plants">Browse plants</a>
          </div>
        </div>

        ${highlights.length ? `
          <div class="home-season-grid home-option-card-grid">
            ${highlights.map((record) => `
              <button
                class="home-season-card home-option-species-card"
                type="button"
                data-detail="${esc(record.slug)}"
                aria-label="Open details for ${esc(record.display_name || record.common_name || record.slug || "Untitled")}" 
              >
                ${renderHomeImage(record)}
                <div class="home-season-card-body">
                  <strong>${esc(record.display_name || record.common_name || record.slug || "Untitled")}</strong>
                  <div class="home-season-tags">
                    <span class="tag good">${esc(recordTypeLabel(record))}</span>
                    <span class="tag ${classifyRecord(record).caution ? "warn" : "review"}">${esc(recordCautionLabel(record))}</span>
                  </div>
                </div>
              </button>
            `).join("")}
          </div>
        ` : `
          <div class="empty-state">No image-backed edible records matched ${esc(month)}. Browse the full seasonal lists for more records.</div>
        `}
      </section>

      <section class="home-support-row" aria-label="Safety and quick context">
        <section class="home-safety-card home-safety-compact option-one-safety" aria-label="Foraging safety note">
          <p>Field guide only — verify ID and preparation.</p>
          <button class="home-safety-link" type="button" onclick="document.getElementById('homeSafetyDialog')?.showModal()">Read the full safety note</button>
          <dialog id="homeSafetyDialog" class="home-safety-dialog">
            <article class="home-safety-dialog-card">
              <h3>Use this guide carefully</h3>
              <p>This guide was made as a practical local reference, not a final authority. Treat unknown plants and mushrooms as unsafe until confirmed with multiple trusted sources.</p>
              <p>Foraging mistakes can make you sick or worse, especially with mushrooms and toxic look-alikes. Confirm the exact species, edible part, season, and preparation before using anything.</p>
              <p>Suggestions and corrections are welcome at <a href="mailto:tpoirier@nmu.edu">tpoirier@nmu.edu</a>.</p>
              <form method="dialog">
                <button class="primary" type="submit">Close</button>
              </form>
            </article>
          </dialog>
        </section>
        <section class="panel home-snapshot-panel option-one-snapshot" aria-labelledby="homeSnapshotHeading">
          <div class="home-snapshot-heading">
            <div>
              <div class="home-section-kicker">At a glance</div>
              <h3 id="homeSnapshotHeading">Current guide balance</h3>
            </div>
          </div>
          <div class="home-snapshot-strip" aria-label="Guide counts">
            <div class="home-snapshot-chip"><strong>${plantsInSeason.length}</strong><span>plants in season</span></div>
            <div class="home-snapshot-chip"><strong>${mushroomsInSeason.length}</strong><span>mushrooms in season</span></div>
            <div class="home-snapshot-chip"><strong>${rareCount}</strong><span>rare entries</span></div>
          </div>
        </section>
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
