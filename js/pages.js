import { MONTHS } from "./constants.js";
import { medicinalRecords, isMushroom, isPlant } from "./data-model.js";
import { renderResultCard } from "./renderers/cards.js";
import { renderTimelineRows } from "./renderers/timeline.js";
import { escapeHtml } from "./utils.js";

function renderFilterPanel({title, intro, categoryOptions, records, route, filters}) {
  const categoriesHtml = ['<option value="">All categories</option>']
    .concat(categoryOptions.map(cat => `<option value="${escapeHtml(cat)}" ${filters.category === cat ? "selected" : ""}>${escapeHtml(cat)}</option>`))
    .join("");
  const resultsHtml = records.length ? records.map(renderResultCard).join("") : '<div class="panel empty-state"><h3>No matches</h3><p>Try a different search or month.</p></div>';
  return `
    <section class="page-grid">
      <aside class="panel">
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
      <section class="panel">
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
  const medicinalCount = medicinalRecords(records).length;
  const mushroomCount = records.filter(isMushroom).length;
  const plantCount = records.filter(isPlant).length;
  return `
    <section class="home-grid">
      <article class="panel">
        <h2>What changed in v0.3</h2>
        <div class="feature-list">
          <div class="feature-item"><strong>Phase 1:</strong> compact cards, clickable titles, detail modal, cleaner phone/tablet behavior, and modular JS files.</div>
          <div class="feature-item"><strong>Phase 2:</strong> separate sections for Home, Plants, Mushrooms, Medicinal Uses, and Timeline.</div>
          <div class="feature-item"><strong>Lists are shorter on purpose:</strong> key facts on the card, longer notes inside the detail view.</div>
        </div>
        <div class="quick-links">
          <a class="buttonish primary" href="#/plants">Browse plants</a>
          <a class="buttonish primary" href="#/mushrooms">Browse mushrooms</a>
          <a class="buttonish" href="#/medicinal">Browse medicinal uses</a>
          <a class="buttonish" href="#/timeline">Open seasonal timeline</a>
        </div>
      </article>
      <article class="panel">
        <h2>Current catalog snapshot</h2>
        <div class="feature-list">
          <div class="feature-item"><strong>${records.length}</strong> total records imported so far.</div>
          <div class="feature-item"><strong>${plantCount}</strong> plant-side entries.</div>
          <div class="feature-item"><strong>${mushroomCount}</strong> mushroom entries.</div>
          <div class="feature-item"><strong>${medicinalCount}</strong> entries carrying medicinal-use text.</div>
        </div>
      </article>
    </section>
  `;
}

export function renderPlants(records, filters) {
  const source = records.filter(isPlant);
  const categories = [...new Set(source.map(r => r.category))].sort((a,b) => a.localeCompare(b));
  return renderFilterPanel({
    title: "Plants",
    intro: "Plants, flowers, fruits, roots, and tree products. This page is compact now so it does not turn into a spreadsheet parade.",
    categoryOptions: categories,
    records: source,
    route: "plants",
    filters
  });
}

export function renderMushrooms(records, filters) {
  return renderFilterPanel({
    title: "Mushrooms",
    intro: "Mushroom results kept concise. Richer ID questions can be layered in later without rebuilding the whole page.",
    categoryOptions: ["Mushroom"],
    records: records.filter(isMushroom),
    route: "mushrooms",
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
    route: "medicinal",
    filters
  });
}

export function renderTimeline(records) {
  return `
    <section class="panel">
      <div class="result-header">
        <div>
          <h2>Seasonal timeline</h2>
          <p class="results-meta">Its own beast, just like requested.</p>
        </div>
        <div class="button-row">
          <a class="buttonish" href="#/plants">Plants</a>
          <a class="buttonish" href="#/mushrooms">Mushrooms</a>
        </div>
      </div>
      <div class="timeline-rows">
        ${renderTimelineRows(records)}
      </div>
    </section>
  `;
}
