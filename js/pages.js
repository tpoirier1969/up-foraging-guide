import { MONTHS } from "./constants.js";
import { medicinalRecords, isMushroom, isPlant } from "./data-model.js";
import { renderResultCard } from "./renderers/cards.js";
import { renderInteractiveTimeline } from "./renderers/timeline.js";
import { escapeHtml } from "./utils.js";

function renderFilterPanel({title, intro, categoryOptions, records, filters}) {
  const categoriesHtml = ['<option value="">All categories</option>']
    .concat(categoryOptions.map(cat => `<option value="${escapeHtml(cat)}" ${filters.category === cat ? "selected" : ""}>${escapeHtml(cat)}</option>`))
    .join("");
  const resultsHtml = records.length ? records.map(renderResultCard).join("") : '<div class="panel empty-state"><h3>No matches</h3><p>Try a different search or month.</p></div>';
  return `
    <section class="page-grid">
      <aside class="panel filter-panel">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(intro)}</p>
        <div class="filter-stack" style="margin-top:14px">
          <label><span>Search</span><input type="search" data-filter="search" value="${escapeHtml(filters.search)}" placeholder="Search names, uses, notes"></label>
          <label><span>Category</span><select data-filter="category">${categoriesHtml}</select></label>
          <label><span>Month</span><select data-filter="month">
            <option value="">Any month</option>
            ${MONTHS.map(month => `<option value="${month}" ${filters.month === month ? "selected" : ""}>${month}</option>`).join("")}
          </select></label>
          <label><span>Images</span><select data-filter="image">
            <option value="" ${filters.image === "" ? "selected" : ""}>All entries</option>
            <option value="with-images" ${filters.image === "with-images" ? "selected" : ""}>With images only</option>
            <option value="without-images" ${filters.image === "without-images" ? "selected" : ""}>Without images only</option>
          </select></label>
          <div class="button-row">
            <button type="button" data-action="clear-filters">Clear filters</button>
            <a class="buttonish primary" href="#/timeline">Open timeline</a>
          </div>
        </div>
      </aside>
      <section class="panel results-panel">
        <div class="result-header">
          <div>
            <h2>${escapeHtml(title)} results</h2>
            <p class="results-meta">${records.length} match${records.length === 1 ? "" : "es"}</p>
          </div>
          <a class="buttonish" href="#/home">Home</a>
        </div>
        <div class="result-list">${resultsHtml}</div>
      </section>
    </section>
  `;
}

export function renderHome(records) {
  const currentMonth = MONTHS[new Date().getMonth()];
  const currentCount = records.filter(record => (record.months_available || []).includes(currentMonth)).length;
  return `
    <section class="home-hero panel">
      <div class="hero-copy">
        <p class="eyebrow subtle">Field guide on screen</p>
        <h2>Choose your path</h2>
        <p>Browse known species, open a focused timeline, or jump straight into medicinal entries. The home page should feel like a trailhead, not a list of office links.</p>
        <div class="hero-cta-row">
          <a class="buttonish primary large" href="#/timeline">Open seasonal timeline</a>
          <a class="buttonish large" href="#/plants">Browse plants</a>
        </div>
      </div>
      <div class="hero-now-card">
        <span class="tiny-label">In focus right now</span>
        <strong>${escapeHtml(currentMonth)}</strong>
        <p>${currentCount} imported entries show activity in this month.</p>
        <a class="buttonish" href="#/timeline">See what comes into focus</a>
      </div>
    </section>

    <section class="home-card-grid">
      <a class="nav-card plants-card" href="#/plants">
        <span class="nav-kicker">Plants</span>
        <h3>Greens, flowers, fruits, roots, and tree products</h3>
        <p>Compact cards, thumbnails, and quick filters for the plant side of the guide.</p>
        <span class="nav-action">Open Plants</span>
      </a>
      <a class="nav-card mushroom-card" href="#/mushrooms">
        <span class="nav-kicker">Mushrooms</span>
        <h3>Browse the mushroom catalog without the spreadsheet sprawl</h3>
        <p>Short list cards now, richer ID questions later when the trait schema lands.</p>
        <span class="nav-action">Open Mushrooms</span>
      </a>
      <a class="nav-card medicinal-card" href="#/medicinal">
        <span class="nav-kicker">Medicinal Uses</span>
        <h3>Entries carrying medicinal-use text gathered into one lane</h3>
        <p>Useful when you want the medicinal angle without wading through everything else.</p>
        <span class="nav-action">Open Medicinal</span>
      </a>
      <a class="nav-card timeline-card" href="#/timeline">
        <span class="nav-kicker">Timeline</span>
        <h3>Time first. Species second.</h3>
        <p>Choose a month, let the season lead, and watch the available entries sharpen underneath.</p>
        <span class="nav-action">Open Timeline</span>
      </a>
    </section>
  `;
}

export function renderPlants(records, filters) {
  const source = records.filter(isPlant);
  const categories = [...new Set(source.map(r => r.category))].sort((a,b) => a.localeCompare(b));
  return renderFilterPanel({
    title: "Plants",
    intro: "Plants, flowers, fruits, roots, and tree products. Kept concise so the page scans fast on phone or tablet.",
    categoryOptions: categories,
    records: source,
    filters
  });
}

export function renderMushrooms(records, filters) {
  return renderFilterPanel({
    title: "Mushrooms",
    intro: "The mushroom lane stays compact for now. Trait-driven identification can layer in later without tearing the page apart.",
    categoryOptions: ["Mushroom"],
    records: records.filter(isMushroom),
    filters
  });
}

export function renderMedicinal(records, filters) {
  const source = medicinalRecords(records);
  const categories = [...new Set(source.map(r => r.category))].sort((a,b) => a.localeCompare(b));
  return renderFilterPanel({
    title: "Medicinal Uses",
    intro: "Entries with medicinal-use text imported from the source sheets.",
    categoryOptions: categories,
    records: source,
    filters
  });
}

export function renderTimeline(records, selectedMonth) {
  return renderInteractiveTimeline(records, selectedMonth);
}
