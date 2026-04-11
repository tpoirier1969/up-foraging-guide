import { MONTHS } from "./constants-mainfix.js?v=v2.1-mainfix";
import { medicinalRecords, isPlant, reviewRecords, avoidRecords, isForagingMushroom } from "./data-model-mainfix4.js?v=v2.1-mainfix4";
import { VOCAB } from "./vocabulary.js?v=v2.0";
import { renderResultCard } from "./renderers/cards-mainfix.js?v=v2.1-mainfix";
import { renderInteractiveTimeline } from "./renderers/timeline.js?v=v2.0";
import { escapeHtml } from "./utils.js?v=v2.0";

const FLOWER_COLORS = ["White","Purple","Pink","Yellow","Blue","Red","Green"];
const LEAF_SHAPES = ["Round","Oval","Heart-shaped","Lance-shaped","Pointed","Lobed","Compound","Needle-like"];
const STEM_SURFACES = ["Smooth","Hairy","Rough","Fuzzy","Prickly"];
const LEAF_POINT_COUNTS = ["1-point","3-point","5-point","Many-lobed"];

function optionHtml(values, current, label) { return [`<option value="">${label}</option>`].concat(values.map(v => `<option value="${escapeHtml(v)}" ${current === v ? 'selected' : ''}>${escapeHtml(v)}</option>`)).join(''); }
function vocabLabels(entries) { return (entries || []).map(entry => entry.label); }
function hostTreeLabels(treeType) { const all = VOCAB.mushrooms.hostTrees || []; if (!treeType) return all.map(entry => entry.label); if (treeType === 'Hardwood') return all.filter(entry => entry.broadType === 'hardwood').map(entry => entry.label); if (treeType === 'Conifer / softwood') return all.filter(entry => entry.broadType === 'conifer').map(entry => entry.label); return all.map(entry => entry.label); }
function formatLabelFromSlug(slug) { return String(slug || '').replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase()); }
function renderResultList(records, context = 'general') { return records.length ? records.map(record => renderResultCard(record, context)).join("") : '<div class="panel empty-state"><h3>No matches</h3><p>No records matched the current filters.</p></div>'; }
function currentMonthName() { const d = new Date(); d.setDate(d.getDate() + 14); return MONTHS[d.getMonth()]; }
function inSeasonForagingRecords(allRecords) { const month = currentMonthName(); return allRecords.filter(record => (isPlant(record) || isForagingMushroom(record)) && (record.months_available || []).includes(month)); }
function inSeasonSubset(allRecords, type) { const month = currentMonthName(); return allRecords.filter(record => (type === 'plants' ? isPlant(record) : isForagingMushroom(record)) && (record.months_available || []).includes(month)); }

function compactSeasonPanel(allRecords, type) {
  const month = currentMonthName();
  const records = inSeasonSubset(allRecords, type);
  return `<section class="panel compact-season-panel"><div><p class="eyebrow subtle">In-season</p><h3>${escapeHtml(type === 'plants' ? 'Plants' : 'Mushrooms')} · ${escapeHtml(month)}</h3></div><div class="compact-count-row"><span class="tag">${records.length} in season</span></div></section>`;
}

function filterBlock(title, filters, extraFilters = []) {
  return `<section class="panel filter-stack"><div class="tight-filter-grid">${extraFilters.join('')}</div></section>`;
}
function selectFilter(label, key, values, current, blank) { return `<label class="compact-filter"><span>${escapeHtml(label)}</span><select data-filter="${escapeHtml(key)}">${optionHtml(values, current, blank)}</select></label>`; }
function searchFilter(label, key, current, placeholder) { return `<label class="compact-filter"><span>${escapeHtml(label)}</span><input type="search" data-filter="${escapeHtml(key)}" value="${escapeHtml(current || '')}" placeholder="${escapeHtml(placeholder)}"></label>`; }

function standardPage(title, intro, records, filterHtml, context) {
  return `<section class="panel section-intro-slim"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(intro)}</p></section>${filterHtml}<section class="panel workspace-pane results-pane-card"><div class="result-header compact-result-header"><div><h3>${escapeHtml(title)} results</h3><p class="results-meta">${records.length} match${records.length === 1 ? '' : 'es'}</p></div></div><div class="result-list">${renderResultList(records, context)}</div></section>`;
}
function renderCreditsPage(allRecords, overridePayload) {
  const overrides = overridePayload?.overrides || {};
  const entries = Object.entries(overrides).map(([slug, value]) => {
    const record = allRecords.find(item => item.slug === slug);
    const label = record?.display_name || formatLabelFromSlug(slug);
    const sci = record?.scientific_name || '';
    const links = (value?.images || []).map((url, index) => `<li><a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">Image ${index + 1}</a></li>`).join('');
    return `<article class="panel"><h3>${escapeHtml(label)}</h3><p class="results-meta">${escapeHtml(sci)}</p><ul>${links}</ul></article>`;
  }).join('');
  return `<section class="panel section-intro-slim"><h2>Credits</h2><p>Wikimedia Commons image links used in this build.</p></section>${entries || '<section class="panel empty-state"><h3>No credits loaded</h3></section>'}`;
}

export function renderDashboard({ page, allRecords, currentRecords, filters, selectedMonth, selectedWeek, overridePayload }) {
  if (page === 'home') {
    const seasonRecords = inSeasonForagingRecords(allRecords);
    return `<section class="panel section-intro-slim"><h2>In-Season Species</h2><p>What you can likely find in the woods right now.</p></section><section class="panel workspace-pane results-pane-card"><div class="result-header compact-result-header"><div><h3>In-season species</h3><p class="results-meta">${seasonRecords.length} match${seasonRecords.length === 1 ? '' : 'es'}</p></div></div><div class="result-list">${renderResultList(seasonRecords, 'general')}</div></section>`;
  }
  if (page === 'search') {
    const filterHtml = filterBlock('Search', filters, [searchFilter('Search', 'search', filters.search, 'Search all species')]);
    return standardPage('Search', 'Search across the whole guide from one place.', currentRecords, filterHtml, 'general');
  }
  if (page === 'plants') {
    const filterHtml = filterBlock('Plants', filters, [
      selectFilter('Habitat','habitat',vocabLabels(VOCAB.common.habitats),filters.habitat,'Any habitat'),
      selectFilter('Plant part / trait','part',vocabLabels(VOCAB.common.observedParts),filters.part,'Any part / trait'),
      selectFilter('Flower color','flowerColor',FLOWER_COLORS,filters.flowerColor,'Any flower color'),
      selectFilter('Leaf shape','leafShape',LEAF_SHAPES,filters.leafShape,'Any leaf shape'),
      selectFilter('Leaf points','leafPointCount',LEAF_POINT_COUNTS,filters.leafPointCount,'Any leaf points'),
      selectFilter('Stem surface','stemSurface',STEM_SURFACES,filters.stemSurface,'Any stem surface'),
      selectFilter('Size','size',vocabLabels(VOCAB.common.sizes),filters.size,'Any size'),
      selectFilter('Taste','taste',vocabLabels(VOCAB.common.tastes),filters.taste,'Any taste'),
      selectFilter('Month','month',MONTHS,filters.month,'Any month')
    ]);
    return `${compactSeasonPanel(allRecords,'plants')}${standardPage('Plants','Filters on top, results underneath.', currentRecords, filterHtml, 'general')}`;
  }
  if (page === 'mushrooms') {
    const filterHtml = filterBlock('Mushrooms', filters, [
      selectFilter('Substrate','substrate',vocabLabels(VOCAB.mushrooms.substrates),filters.substrate,'Any substrate'),
      selectFilter('Tree type','treeType',vocabLabels(VOCAB.mushrooms.woodTypes),filters.treeType,'Any tree type'),
      selectFilter('Host tree','hostTree',hostTreeLabels(filters.treeType),filters.hostTree,'Any host tree'),
      selectFilter('Ring','ring',vocabLabels(VOCAB.mushrooms.ringStates),filters.ring,'Any ring'),
      selectFilter('Texture','texture',vocabLabels(VOCAB.mushrooms.textures),filters.texture,'Any texture'),
      selectFilter('Smell','smell',vocabLabels(VOCAB.mushrooms.odors),filters.smell,'Any smell'),
      selectFilter('Staining','staining',vocabLabels(VOCAB.mushrooms.stainingColors),filters.staining,'Any staining'),
      selectFilter('Taste','taste',vocabLabels(VOCAB.common.tastes),filters.taste,'Any taste'),
      selectFilter('Month','month',MONTHS,filters.month,'Any month')
    ]);
    return `${compactSeasonPanel(allRecords,'mushrooms')}${standardPage('Mushrooms','Edible and foraging-relevant mushrooms only.', currentRecords, filterHtml, 'mushrooms')}`;
  }
  if (page === 'medicinal') {
    const filterHtml = filterBlock('Medicinal', filters, [
      selectFilter('Medicinal action','medicinalAction',vocabLabels(VOCAB.medicinal.actions),filters.medicinalAction,'Any action'),
      selectFilter('Body system','medicinalSystem',vocabLabels(VOCAB.medicinal.bodySystems),filters.medicinalSystem,'Any body system'),
      selectFilter('Medical term','medicinalTerm',vocabLabels(VOCAB.medicinal.symptoms),filters.medicinalTerm,'Any medical term'),
      selectFilter('Month','month',MONTHS,filters.month,'Any month')
    ]);
    return standardPage('Medicinal','Medicinal uses and related filters.', currentRecords, filterHtml, 'medicinal');
  }
  if (page === 'lookalikes') {
    const severities = [...new Set(currentRecords.map(r => r.non_edible_severity).filter(Boolean))];
    const filterHtml = filterBlock('Non-edible look-alikes', filters, [selectFilter('Severity','severity',severities,filters.severity,'Any severity'), selectFilter('Month','month',MONTHS,filters.month,'Any month')]);
    return standardPage('Non-edible look-alikes','Non-edible, poisonous, deadly, or otherwise not-for-the-pan entries.', currentRecords, filterHtml, 'lookalikes');
  }
  if (page === 'review') {
    const reviewReasons = [...new Set(currentRecords.flatMap(record => record.reviewReasons || []))].sort((a,b)=>a.localeCompare(b));
    const filterHtml = filterBlock('Needs Review', filters, [selectFilter('Review reason','reviewReason',reviewReasons,filters.reviewReason,'Any review reason')]);
    return standardPage('Needs Review','Internal cleanup queue.', currentRecords, filterHtml, 'review');
  }
  if (page === 'timeline') return `<section class="panel section-intro-slim"><h2>Timeline</h2></section>${renderInteractiveTimeline(allRecords, selectedMonth, selectedWeek, 'results')}`;
  if (page === 'credits') return renderCreditsPage(allRecords, overridePayload);
  return '';
}
