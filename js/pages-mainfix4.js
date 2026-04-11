import { MONTHS } from "./constants-mainfix.js?v=v2.1-mainfix";
import { medicinalRecords, isPlant, reviewRecords, avoidRecords, isForagingMushroom } from "./data-model-mainfix4.js?v=v2.1-mainfix5";
import { VOCAB } from "./vocabulary.js?v=v2.0";
import { renderResultCard } from "./renderers/cards-mainfix.js?v=v2.1-mainfix5";
import { renderInteractiveTimeline } from "./renderers/timeline.js?v=v2.0";
import { escapeHtml } from "./utils.js?v=v2.0";

const FLOWER_COLORS = ["White","Purple","Pink","Yellow","Blue","Red","Green"];
const LEAF_SHAPES = ["Round","Oval","Heart-shaped","Lance-shaped","Pointed","Lobed","Compound","Needle-like"];
const STEM_SURFACES = ["Smooth","Hairy","Rough","Fuzzy","Prickly"];
const LEAF_POINT_COUNTS = ["1-point","3-point","5-point","Many-lobed"];

function optionHtml(values, current, label) {
  return [`<option value="">${label}</option>`].concat(values.map(v => `<option value="${escapeHtml(v)}" ${current === v ? 'selected' : ''}>${escapeHtml(v)}</option>`)).join('');
}
function vocabLabels(entries) { return (entries || []).map(entry => entry.label); }
function hostTreeLabels(treeType) {
  const all = VOCAB.mushrooms.hostTrees || [];
  if (!treeType) return all.map(entry => entry.label);
  if (treeType === 'Hardwood') return all.filter(entry => entry.broadType === 'hardwood').map(entry => entry.label);
  if (treeType === 'Conifer / softwood') return all.filter(entry => entry.broadType === 'conifer').map(entry => entry.label);
  return all.map(entry => entry.label);
}
function formatLabelFromSlug(slug) { return String(slug || '').replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase()); }
function renderResultList(records, context = 'general') { return records.length ? records.map(record => renderResultCard(record, context)).join("") : '<div class="panel empty-state"><h3>No matches</h3></div>'; }
function currentMonthName() { const d = new Date(); d.setDate(d.getDate() + 14); return MONTHS[d.getMonth()]; }
function inSeasonForagingRecords(allRecords) { const month = currentMonthName(); return allRecords.filter(record => (isPlant(record) || isForagingMushroom(record)) && (record.months_available || []).includes(month)); }
function inSeasonSubset(allRecords, type) {
  const month = currentMonthName();
  if (type === 'plants') return allRecords.filter(record => isPlant(record) && (record.months_available || []).includes(month));
  if (type === 'mushrooms') return allRecords.filter(record => isForagingMushroom(record) && (record.months_available || []).includes(month));
  return avoidRecords(allRecords).filter(record => (record.months_available || []).includes(month));
}
function compactSeasonPanel(allRecords, type, activeMonth = '') {
  const month = currentMonthName();
  const records = inSeasonSubset(allRecords, type);
  const active = activeMonth === month;
  const label = type === 'lookalikes' ? 'Non-edible look-alikes' : (type === 'plants' ? 'Plants' : 'Mushrooms');
  return `<section class="panel compact-season-panel"><div class="compact-season-head"><strong>${escapeHtml(label)}</strong><button class="buttonish compact-quick-filter ${active ? 'active' : ''}" type="button" data-action="toggle-in-season" data-page="${escapeHtml(type === 'lookalikes' ? 'lookalikes' : type)}">In-season (${records.length})</button><span class="compact-month">${escapeHtml(month)}</span></div></section>`;
}
function selectFilter(label, key, values, current, blank) { return `<label class="compact-filter"><span>${escapeHtml(label)}</span><select data-filter="${escapeHtml(key)}">${optionHtml(values, current, blank)}</select></label>`; }
function searchFilter(key, current, placeholder) { return `<label class="compact-filter compact-search"><input type="search" data-filter="${escapeHtml(key)}" value="${escapeHtml(current || '')}" placeholder="${escapeHtml(placeholder)}"></label>`; }
function filterBlock(extraFilters = []) { return `<section class="panel filter-stack"><div class="tight-filter-grid">${extraFilters.join('')}</div></section>`; }
function resultSection(title, records, context) { return `<section class="panel workspace-pane results-pane-card"><div class="result-header compact-result-header"><div><h3>${escapeHtml(title)}</h3><p class="results-meta">${records.length} match${records.length === 1 ? '' : 'es'}</p></div></div><div class="result-list">${renderResultList(records, context)}</div></section>`; }
function renderCreditsPage(allRecords, overridePayload) {
  const overrides = overridePayload?.overrides || {};
  const creditsBySlug = overridePayload?.creditsPayload?.credits || {};
  const allSlugs = [...new Set([...Object.keys(overrides), ...Object.keys(creditsBySlug)])];
  const entries = allSlugs.map(slug => {
    const record = allRecords.find(item => item.slug === slug);
    const label = record?.display_name || formatLabelFromSlug(slug);
    const credits = creditsBySlug[slug] || [];
    const imageLinks = (overrides[slug]?.images || []).map((url, index) => `<li><a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">Image ${index + 1}</a></li>`).join('');
    const creditDetails = credits.map(item => `<div class="credit-detail-block"><p><strong>${escapeHtml(item.filename || 'Image file')}</strong></p>${item.title ? `<p>${escapeHtml(item.title)}</p>` : ''}${item.creator ? `<p>Creator: ${escapeHtml(item.creator)}</p>` : ''}${item.license ? `<p>License: ${escapeHtml(item.license)}</p>` : ''}${item.date ? `<p>Date: ${escapeHtml(item.date)}</p>` : ''}${item.dimensions ? `<p>Dimensions: ${escapeHtml(item.dimensions)}</p>` : ''}${item.mime_type ? `<p>Type: ${escapeHtml(item.mime_type)}</p>` : ''}${item.quality_note ? `<p>${escapeHtml(item.quality_note)}</p>` : ''}</div>`).join('');
    return `<article class="panel"><h3>${escapeHtml(label)}</h3>${creditDetails || ''}${imageLinks ? `<ul>${imageLinks}</ul>` : ''}</article>`;
  }).join('');
  return entries || '<section class="panel empty-state"><h3>No credits loaded</h3></section>';
}

export function renderDashboard({ page, allRecords, currentRecords, filters, selectedMonth, selectedWeek, overridePayload }) {
  if (page === 'home') return `${resultSection('In-Season Species', inSeasonForagingRecords(allRecords), 'general')}`;
  if (page === 'search') return `${filterBlock([searchFilter('search', filters.search, 'Search all species'), `<div class="filter-hint">Press Enter to search</div>`])}${resultSection('Search', currentRecords, 'general')}`;
  if (page === 'identification') {
    const part = String(filters.part || '').toLowerCase();
    const controls = [selectFilter('Part','part',vocabLabels(VOCAB.common.observedParts),filters.part,'Any part'), selectFilter('Habitat','habitat',vocabLabels(VOCAB.common.habitats),filters.habitat,'Any habitat'), selectFilter('Month','month',MONTHS,filters.month,'Any month')];
    if (part.includes('leaf')) controls.push(selectFilter('Leaf shape','leafShape',LEAF_SHAPES,filters.leafShape,'Any leaf shape'), selectFilter('Leaf points','leafPointCount',LEAF_POINT_COUNTS,filters.leafPointCount,'Any leaf points'));
    if (part.includes('flower')) controls.push(selectFilter('Flower color','flowerColor',FLOWER_COLORS,filters.flowerColor,'Any flower color'));
    if (part.includes('stem')) controls.push(selectFilter('Stem surface','stemSurface',STEM_SURFACES,filters.stemSurface,'Any stem surface'));
    return `${filterBlock(controls)}${resultSection('Identification', currentRecords, 'general')}`;
  }
  if (page === 'plants') return `${compactSeasonPanel(allRecords,'plants',filters.month)}${filterBlock([selectFilter('Habitat','habitat',vocabLabels(VOCAB.common.habitats),filters.habitat,'Any habitat'), selectFilter('Part / trait','part',vocabLabels(VOCAB.common.observedParts),filters.part,'Any part / trait'), selectFilter('Flower color','flowerColor',FLOWER_COLORS,filters.flowerColor,'Any flower color'), selectFilter('Leaf shape','leafShape',LEAF_SHAPES,filters.leafShape,'Any leaf shape'), selectFilter('Leaf points','leafPointCount',LEAF_POINT_COUNTS,filters.leafPointCount,'Any leaf points'), selectFilter('Stem surface','stemSurface',STEM_SURFACES,filters.stemSurface,'Any stem surface'), selectFilter('Size','size',vocabLabels(VOCAB.common.sizes),filters.size,'Any size'), selectFilter('Taste','taste',vocabLabels(VOCAB.common.tastes),filters.taste,'Any taste'), selectFilter('Month','month',MONTHS,filters.month,'Any month')])}${resultSection('Plants', currentRecords, 'general')}`;
  if (page === 'mushrooms') return `${compactSeasonPanel(allRecords,'mushrooms',filters.month)}${filterBlock([selectFilter('Substrate','substrate',vocabLabels(VOCAB.mushrooms.substrates),filters.substrate,'Any substrate'), selectFilter('Tree type','treeType',vocabLabels(VOCAB.mushrooms.woodTypes),filters.treeType,'Any tree type'), selectFilter('Host tree','hostTree',hostTreeLabels(filters.treeType),filters.hostTree,'Any host tree'), selectFilter('Ring','ring',vocabLabels(VOCAB.mushrooms.ringStates),filters.ring,'Any ring'), selectFilter('Texture','texture',vocabLabels(VOCAB.mushrooms.textures),filters.texture,'Any texture'), selectFilter('Smell','smell',vocabLabels(VOCAB.mushrooms.odors),filters.smell,'Any smell'), selectFilter('Staining','staining',vocabLabels(VOCAB.mushrooms.stainingColors),filters.staining,'Any staining'), selectFilter('Taste','taste',vocabLabels(VOCAB.common.tastes),filters.taste,'Any taste'), selectFilter('Month','month',MONTHS,filters.month,'Any month')])}${resultSection('Mushrooms', currentRecords, 'mushrooms')}`;
  if (page === 'medicinal') return `${filterBlock([selectFilter('Action','medicinalAction',vocabLabels(VOCAB.medicinal.actions),filters.medicinalAction,'Any action'), selectFilter('Body system','medicinalSystem',vocabLabels(VOCAB.medicinal.bodySystems),filters.medicinalSystem,'Any body system'), selectFilter('Medical term','medicinalTerm',vocabLabels(VOCAB.medicinal.symptoms),filters.medicinalTerm,'Any medical term'), selectFilter('Month','month',MONTHS,filters.month,'Any month')])}${resultSection('Medicinal', currentRecords, 'medicinal')}`;
  if (page === 'lookalikes') { const severities = [...new Set(currentRecords.map(r => r.non_edible_severity).filter(Boolean))]; return `${compactSeasonPanel(allRecords,'lookalikes',filters.month)}${filterBlock([selectFilter('Severity','severity',severities,filters.severity,'Any severity'), selectFilter('Month','month',MONTHS,filters.month,'Any month')])}${resultSection('Non-edible look-alikes', currentRecords, 'lookalikes')}`; }
  if (page === 'review') { const reviewReasons = [...new Set(currentRecords.flatMap(record => record.reviewReasons || []))].sort((a,b)=>a.localeCompare(b)); return `${filterBlock([selectFilter('Review reason','reviewReason',reviewReasons,filters.reviewReason,'Any review reason')])}${resultSection('Needs Review', currentRecords, 'review')}`; }
  if (page === 'timeline') {
    const eligible = allRecords.filter(record => !!String(record.medicinal_uses || '').trim() || isForagingMushroom(record) || (isPlant(record) && !!String(record.culinary_uses || '').trim()));
    return `${renderInteractiveTimeline(eligible, selectedMonth, selectedWeek, 'results')}`;
  }
  if (page === 'credits') return renderCreditsPage(allRecords, overridePayload);
  return '';
}
