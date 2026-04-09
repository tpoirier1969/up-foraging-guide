import { MONTHS } from "./constants.js";
import { medicinalRecords, isMushroom, isPlant, reviewRecords } from "./data-model.js";
import { uniqueTraitValues } from "./trait-inference.js";
import { renderResultCard } from "./renderers/cards.js";
import { renderInteractiveTimeline } from "./renderers/timeline.js";
import { escapeHtml } from "./utils.js";

function optionHtml(values, current, label) {
  return [`<option value="">${label}</option>`]
    .concat(values.map(v => `<option value="${escapeHtml(v)}" ${current === v ? 'selected' : ''}>${escapeHtml(v)}</option>`)).join('');
}

function renderFilterPanel({title, intro, records, filters, context='general', extraFilters=[]}) {
  const resultsHtml = records.length ? records.map(r => renderResultCard(r, context)).join("") : '<div class="panel empty-state"><h3>No matches</h3><p>Try a different filter mix.</p></div>';
  return `
    <section class="page-grid">
      <aside class="panel filter-panel">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(intro)}</p>
        <div class="filter-stack" style="margin-top:14px">
          <label><span>Search</span><input type="search" data-filter="search" value="${escapeHtml(filters.search)}" placeholder="Search names, notes, uses"></label>
          <label><span>Month</span><select data-filter="month">${optionHtml(MONTHS, filters.month, 'Any month')}</select></label>
          ${extraFilters.join('')}
          <div class="button-row">
            <button type="button" data-action="clear-filters">Clear filters</button>
            <a class="buttonish primary" href="#/timeline">Open timeline</a>
          </div>
          <p class="filter-note">Week-level timing still defaults to the 1st week of each month unless verified later.</p>
        </div>
      </aside>
      <section class="panel results-panel">
        <div class="result-header">
          <div>
            <h2>${escapeHtml(title)} results</h2>
            <p class="results-meta">${records.length} match${records.length === 1 ? '' : 'es'}</p>
          </div>
          <a class="buttonish" href="#/review">Needs Review</a>
        </div>
        <div class="result-list">${resultsHtml}</div>
      </section>
    </section>
  `;
}

export function renderHome(records) {
  const currentMonth = MONTHS[new Date().getMonth()];
  const currentCount = records.filter(record => (record.months_available || []).includes(currentMonth)).length;
  const reviewCount = reviewRecords(records).length;
  return `
    <section class="home-hero panel">
      <div class="hero-copy">
        <p class="eyebrow subtle">Field guide on screen</p>
        <h2>Choose your path</h2>
        <p>Browse known species, dive into deeper field filters, or move through a week-based timeline and let the season drive the list.</p>
        <div class="hero-cta-row">
          <a class="buttonish primary large" href="#/timeline">Open seasonal timeline</a>
          <a class="buttonish large" href="#/review">Check needs-review queue</a>
        </div>
      </div>
      <div class="hero-now-card">
        <span class="tiny-label">In focus right now</span>
        <strong>${escapeHtml(currentMonth)}</strong>
        <p>${currentCount} imported entries show activity this month. ${reviewCount} still need more detail checked.</p>
        <a class="buttonish" href="#/timeline">See weekly focus</a>
      </div>
    </section>

    <section class="home-card-grid five-up-grid">
      <a class="nav-card plants-card" href="#/plants"><span class="nav-kicker">Plants</span><h3>Broader plant filters</h3><p>Habitat, part seen, size, and taste start narrowing the field.</p><span class="nav-action">Open Plants</span></a>
      <a class="nav-card mushroom-card" href="#/mushrooms"><span class="nav-kicker">Mushrooms</span><h3>Host trees, rings, smell, texture, staining</h3><p>The mushroom lane now starts asking much smarter field questions.</p><span class="nav-action">Open Mushrooms</span></a>
      <a class="nav-card medicinal-card" href="#/medicinal"><span class="nav-kicker">Medicinal Uses</span><h3>Search by terms like astringent, stomach, headache</h3><p>Medicinal entries now bias the descriptive text toward medicinal use instead of culinary use.</p><span class="nav-action">Open Medicinal</span></a>
      <a class="nav-card timeline-card" href="#/timeline"><span class="nav-kicker">Timeline</span><h3>Weeks now sit inside each month</h3><p>Week 1 is the default assumption until better timing gets checked.</p><span class="nav-action">Open Timeline</span></a>
      <a class="nav-card review-card-home" href="#/review"><span class="nav-kicker">Needs Review</span><h3>Data that needs more checking or more detail</h3><p>A working queue for timing assumptions, missing images, habitat gaps, and medicinal tagging cleanup.</p><span class="nav-action">Open Review</span></a>
    </section>
  `;
}

export function renderPlants(records, filters) {
  const source = records.filter(isPlant);
  return renderFilterPanel({
    title: "Plants",
    intro: "Plants here means the green and woody side of the guide. Habitat, observed part, size, and taste are now filterable wherever the imported text gives us enough clues.",
    records: source,
    filters,
    context: 'general',
    extraFilters: [
      `<label><span>Habitat</span><select data-filter="habitat">${optionHtml(uniqueTraitValues(source,'habitat'), filters.habitat, 'Any habitat')}</select></label>`,
      `<label><span>Part seen</span><select data-filter="part">${optionHtml(uniqueTraitValues(source,'observedPart'), filters.part, 'Any part')}</select></label>`,
      `<label><span>Size</span><select data-filter="size">${optionHtml(uniqueTraitValues(source,'size'), filters.size, 'Any size')}</select></label>`,
      `<label><span>Taste</span><select data-filter="taste">${optionHtml(uniqueTraitValues(source,'taste'), filters.taste, 'Any taste')}</select></label>`
    ]
  });
}

export function renderMushrooms(records, filters) {
  const source = records.filter(isMushroom);
  return renderFilterPanel({
    title: "Mushrooms",
    intro: "Deeper mushroom filters now include substrate, broad tree type for people who cannot name the tree yet, host tree when known, plus ring, texture, smell, staining, and taste.",
    records: source,
    filters,
    context: 'mushrooms',
    extraFilters: [
      `<label><span>Growing on</span><select data-filter="substrate">${optionHtml(uniqueTraitValues(source,'substrate'), filters.substrate, 'Any substrate')}</select></label>`,
      `<label><span>Tree type</span><select data-filter="treeType">${optionHtml(uniqueTraitValues(source,'treeType'), filters.treeType, 'Any tree type')}</select></label>`,
      `<label><span>Host tree</span><select data-filter="hostTree">${optionHtml(uniqueTraitValues(source,'hostTree'), filters.hostTree, 'Any host tree')}</select></label>`,
      `<label><span>Ring</span><select data-filter="ring">${optionHtml(uniqueTraitValues(source,'ring'), filters.ring, 'Any ring state')}</select></label>`,
      `<label><span>Texture</span><select data-filter="texture">${optionHtml(uniqueTraitValues(source,'texture'), filters.texture, 'Any texture')}</select></label>`,
      `<label><span>Smell</span><select data-filter="smell">${optionHtml(uniqueTraitValues(source,'smell'), filters.smell, 'Any smell')}</select></label>`,
      `<label><span>Staining</span><select data-filter="staining">${optionHtml(uniqueTraitValues(source,'staining'), filters.staining, 'Any staining')}</select></label>`,
      `<label><span>Taste</span><select data-filter="taste">${optionHtml(uniqueTraitValues(source,'taste'), filters.taste, 'Any taste')}</select></label>`
    ]
  });
}

export function renderMedicinal(records, filters) {
  const source = medicinalRecords(records);
  return renderFilterPanel({
    title: "Medicinal Uses",
    intro: "Medicinal entries now filter by medicinal action, body system, symptom-style search terms, part seen, and taste where the imported text gives us something to work with.",
    records: source,
    filters,
    context: 'medicinal',
    extraFilters: [
      `<label><span>Medicinal action</span><select data-filter="medicinalAction">${optionHtml(uniqueTraitValues(source,'medicinalAction'), filters.medicinalAction, 'Any action')}</select></label>`,
      `<label><span>Body system</span><select data-filter="medicinalSystem">${optionHtml(uniqueTraitValues(source,'medicinalSystem'), filters.medicinalSystem, 'Any body system')}</select></label>`,
      `<label><span>Medical term</span><select data-filter="medicinalTerm">${optionHtml(uniqueTraitValues(source,'medicinalTerms'), filters.medicinalTerm, 'Any search term')}</select></label>`,
      `<label><span>Part seen</span><select data-filter="part">${optionHtml(uniqueTraitValues(source,'observedPart'), filters.part, 'Any part')}</select></label>`,
      `<label><span>Taste</span><select data-filter="taste">${optionHtml(uniqueTraitValues(source,'taste'), filters.taste, 'Any taste')}</select></label>`
    ]
  });
}

export function renderReview(records, filters) {
  const source = reviewRecords(records);
  return renderFilterPanel({
    title: "Needs Review",
    intro: "This is the working queue for data that still needs checking, especially week timing, habitat detail, substrate detail, medicinal tagging, and missing images.",
    records: source.filter(r => !filters.reviewReason || (r.reviewReasons || []).includes(filters.reviewReason)),
    filters,
    context: 'review',
    extraFilters: [
      `<label><span>Review reason</span><select data-filter="reviewReason">${optionHtml(uniqueTraitValues(source,'reviewReasons'), filters.reviewReason, 'Any review reason')}</select></label>`
    ]
  });
}

export function renderTimeline(records, selectedMonth, selectedWeek) {
  return renderInteractiveTimeline(records, selectedMonth, selectedWeek);
}
