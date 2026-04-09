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

function categoryOptions(records, current) {
  const categories = [...new Set((records || []).map(record => record.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  return optionHtml(categories, current, 'Any category');
}

function renderResultList(records, context = 'general') {
  return records.length
    ? records.map(record => renderResultCard(record, context)).join("")
    : '<div class="panel empty-state"><h3>No matches</h3><p>Try a different filter mix.</p></div>';
}

function renderFilterForm({ page, filters, extraFilters = [], scopeRecords, title }) {
  return `
    <section class="panel workspace-pane filter-pane-card">
      <div class="section-heading-block">
        <h3>${escapeHtml(title)} filters</h3>
        <p>Trim the list first, then flip back to results.</p>
      </div>
      <div class="filter-form-grid">
        <label><span>Search</span><input type="search" data-filter="search" value="${escapeHtml(filters.search || '')}" placeholder="Search names, notes, uses"></label>
        <label><span>Month</span><select data-filter="month">${optionHtml(MONTHS, filters.month, 'Any month')}</select></label>
        ${page === 'home' ? `<label><span>Category</span><select data-filter="category">${categoryOptions(scopeRecords, filters.category)}</select></label>` : ''}
        ${extraFilters.join('')}
      </div>
      <div class="workspace-actions">
        <button type="button" data-action="clear-filters">Clear filters</button>
        <a class="buttonish" href="#/review">Needs Review</a>
      </div>
      <p class="filter-note">Timeline week detail still defaults to week 1 until specific week data gets verified.</p>
    </section>
  `;
}

function renderWorkspace({ page, title, intro, records, filters, context = 'general', extraFilters = [], paneMode = 'results', scopeRecords }) {
  const filterHtml = renderFilterForm({ page, filters, extraFilters, scopeRecords, title });
  const resultsHtml = `
    <section class="panel workspace-pane results-pane-card">
      <div class="result-header compact-result-header">
        <div>
          <h3>${escapeHtml(title)} results</h3>
          <p class="results-meta">${records.length} match${records.length === 1 ? '' : 'es'}</p>
        </div>
        <a class="buttonish" href="#/review">Needs Review</a>
      </div>
      <div class="result-list">${renderResultList(records, context)}</div>
    </section>
  `;

  return `
    <section class="workspace-shell">
      <article class="panel workspace-head">
        <div>
          <p class="eyebrow subtle">${escapeHtml(title)}</p>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(intro)}</p>
        </div>
        <div class="workspace-tabs" role="tablist" aria-label="${escapeHtml(title)} panels">
          <button class="workspace-tab ${paneMode === 'filters' ? 'active' : ''}" type="button" data-action="set-pane-mode" data-page="${escapeHtml(page)}" data-pane-mode="filters" aria-pressed="${paneMode === 'filters' ? 'true' : 'false'}">Filters</button>
          <button class="workspace-tab ${paneMode === 'results' ? 'active' : ''}" type="button" data-action="set-pane-mode" data-page="${escapeHtml(page)}" data-pane-mode="results" aria-pressed="${paneMode === 'results' ? 'true' : 'false'}">Results</button>
        </div>
      </article>
      ${paneMode === 'filters' ? filterHtml : resultsHtml}
    </section>
  `;
}

function renderSectionNav(activePage) {
  const items = [
    ['home', 'Home'],
    ['plants', 'Plants'],
    ['mushrooms', 'Mushrooms'],
    ['medicinal', 'Medicinal'],
    ['timeline', 'Timeline'],
    ['review', 'Needs Review']
  ];
  return `
    <div class="section-chip-row" aria-label="Section chooser">
      ${items.map(([slug, label]) => `<a class="section-chip ${activePage === slug ? 'active' : ''}" href="#/${slug}">${escapeHtml(label)}</a>`).join('')}
    </div>
  `;
}

function renderFocusHero(allRecords, activePage) {
  const currentMonth = MONTHS[new Date().getMonth()];
  const activeNow = allRecords.filter(record => (record.months_available || []).includes(currentMonth));
  const plantCount = activeNow.filter(isPlant).length;
  const mushroomCount = activeNow.filter(isMushroom).length;
  const medicinalCount = medicinalRecords(activeNow).length;
  const reviewCount = reviewRecords(allRecords).length;

  return `
    <section class="focus-now-panel panel">
      <div class="focus-now-grid">
        <div class="focus-now-copy">
          <p class="eyebrow subtle">In focus right now</p>
          <h2>${escapeHtml(currentMonth)}</h2>
          <p>${activeNow.length} entries show activity this month. Pick a section and it opens right here instead of sending you on a scavenger hunt.</p>
        </div>
        <div class="focus-stat-strip" aria-label="Current month summary">
          <div><strong>${activeNow.length}</strong><span>active now</span></div>
          <div><strong>${plantCount}</strong><span>plants</span></div>
          <div><strong>${mushroomCount}</strong><span>mushrooms</span></div>
          <div><strong>${medicinalCount}</strong><span>medicinal</span></div>
          <div><strong>${reviewCount}</strong><span>needs review</span></div>
        </div>
      </div>
      ${renderSectionNav(activePage)}
    </section>
  `;
}

export function renderDashboard({ page, allRecords, currentRecords, filters, selectedMonth, selectedWeek, paneMode }) {
  const activePage = ['home','plants','mushrooms','medicinal','timeline','review'].includes(page) ? page : 'home';

  let workspaceHtml = '';

  if (activePage === 'plants') {
    const source = allRecords.filter(isPlant);
    workspaceHtml = renderWorkspace({
      page: 'plants',
      title: 'Plants',
      intro: 'Leaf shape, habitat, size, and taste do the heavy lifting here without wasting half the screen.',
      records: currentRecords,
      filters,
      context: 'general',
      paneMode,
      scopeRecords: source,
      extraFilters: [
        `<label><span>Habitat</span><select data-filter="habitat">${optionHtml(uniqueTraitValues(source,'habitat'), filters.habitat, 'Any habitat')}</select></label>`,
        `<label><span>Part seen</span><select data-filter="part">${optionHtml(uniqueTraitValues(source,'observedPart'), filters.part, 'Any part')}</select></label>`,
        `<label><span>Size</span><select data-filter="size">${optionHtml(uniqueTraitValues(source,'size'), filters.size, 'Any size')}</select></label>`,
        `<label><span>Taste</span><select data-filter="taste">${optionHtml(uniqueTraitValues(source,'taste'), filters.taste, 'Any taste')}</select></label>`
      ]
    });
  } else if (activePage === 'mushrooms') {
    const source = allRecords.filter(isMushroom);
    workspaceHtml = renderWorkspace({
      page: 'mushrooms',
      title: 'Mushrooms',
      intro: 'Substrate, tree type, host tree, texture, smell, staining, and taste now work like a field checklist instead of a wall of shrugging.',
      records: currentRecords,
      filters,
      context: 'mushrooms',
      paneMode,
      scopeRecords: source,
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
  } else if (activePage === 'medicinal') {
    const source = medicinalRecords(allRecords);
    workspaceHtml = renderWorkspace({
      page: 'medicinal',
      title: 'Medicinal',
      intro: 'Search by action, body system, or medicinal terms without the culinary side constantly elbowing into the room.',
      records: currentRecords,
      filters,
      context: 'medicinal',
      paneMode,
      scopeRecords: source,
      extraFilters: [
        `<label><span>Medicinal action</span><select data-filter="medicinalAction">${optionHtml(uniqueTraitValues(source,'medicinalAction'), filters.medicinalAction, 'Any action')}</select></label>`,
        `<label><span>Body system</span><select data-filter="medicinalSystem">${optionHtml(uniqueTraitValues(source,'medicinalSystem'), filters.medicinalSystem, 'Any body system')}</select></label>`,
        `<label><span>Medical term</span><select data-filter="medicinalTerm">${optionHtml(uniqueTraitValues(source,'medicinalTerms'), filters.medicinalTerm, 'Any search term')}</select></label>`,
        `<label><span>Part seen</span><select data-filter="part">${optionHtml(uniqueTraitValues(source,'observedPart'), filters.part, 'Any part')}</select></label>`,
        `<label><span>Taste</span><select data-filter="taste">${optionHtml(uniqueTraitValues(source,'taste'), filters.taste, 'Any taste')}</select></label>`
      ]
    });
  } else if (activePage === 'review') {
    const source = reviewRecords(allRecords);
    workspaceHtml = renderWorkspace({
      page: 'review',
      title: 'Needs Review',
      intro: 'Timing assumptions, habitat gaps, missing images, and medicinal cleanup all land here in one queue.',
      records: currentRecords,
      filters,
      context: 'review',
      paneMode,
      scopeRecords: source,
      extraFilters: [
        `<label><span>Review reason</span><select data-filter="reviewReason">${optionHtml(uniqueTraitValues(source,'reviewReasons'), filters.reviewReason, 'Any review reason')}</select></label>`
      ]
    });
  } else if (activePage === 'timeline') {
    workspaceHtml = `
      <section class="workspace-shell timeline-workspace-shell">
        <article class="panel workspace-head">
          <div>
            <p class="eyebrow subtle">Timeline</p>
            <h2>Season slider</h2>
            <p>The rail is compact now. Move the months, keep the focused month centered, and let the results sit underneath.</p>
          </div>
          <div class="workspace-tabs" role="tablist" aria-label="Timeline panels">
            <button class="workspace-tab ${paneMode === 'filters' ? 'active' : ''}" type="button" data-action="set-pane-mode" data-page="timeline" data-pane-mode="filters" aria-pressed="${paneMode === 'filters' ? 'true' : 'false'}">Filters</button>
            <button class="workspace-tab ${paneMode === 'results' ? 'active' : ''}" type="button" data-action="set-pane-mode" data-page="timeline" data-pane-mode="results" aria-pressed="${paneMode === 'results' ? 'true' : 'false'}">Results</button>
          </div>
        </article>
        ${renderInteractiveTimeline(allRecords, selectedMonth, selectedWeek, paneMode)}
      </section>
    `;
  } else {
    workspaceHtml = renderWorkspace({
      page: 'home',
      title: 'Home',
      intro: 'This is the working page now. Use filters when you need to narrow the field, then flip back to results and keep moving.',
      records: currentRecords,
      filters,
      context: 'general',
      paneMode,
      scopeRecords: allRecords,
      extraFilters: []
    });
  }

  return `
    ${renderFocusHero(allRecords, activePage)}
    ${workspaceHtml}
  `;
}
