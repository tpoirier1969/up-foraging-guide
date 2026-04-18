const APP_VERSION = 'v-clean-import-1.0';
const REPO_OWNER = 'tpoirier1969';
const REPO_NAME = 'up-foraging-guide';
const REPO_BRANCH = 'main';

const DATA_ROOTS = [
  `https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}@${REPO_BRANCH}/`,
  `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/`
];

const NAV_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'plants', label: 'Plants' },
  { key: 'mushrooms', label: 'Mushrooms' },
  { key: 'medicinal', label: 'Medicinal' },
  { key: 'rare', label: 'Rare / Endangered' },
  { key: 'nonedible', label: 'Non-edible' },
  { key: 'search', label: 'Search' },
  { key: 'references', label: 'References' }
];

const PLANT_CATEGORIES = new Set([
  'Fruit',
  'Green',
  'Flower',
  'Root',
  'Tree Product',
  'Green / Tubers'
]);

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const state = {
  version: APP_VERSION,
  records: [],
  rareRecords: [],
  references: [],
  route: 'home',
  filter: {
    search: '',
    month: '',
    subgroup: 'all'
  },
  detailSlug: '',
  loadNotes: [],
  failedPaths: [],
  sourceRoot: ''
};

const els = {
  pageRoot: document.getElementById('pageRoot'),
  mainNav: document.getElementById('mainNav'),
  versionBadge: document.getElementById('versionBadge'),
  detailModal: document.getElementById('detailModal'),
  modalContent: document.getElementById('modalContent'),
  closeModalBtn: document.getElementById('closeModalBtn')
};

if (els.versionBadge) {
  els.versionBadge.textContent = APP_VERSION;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => normalizeText(item)).filter(Boolean))];
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }
  return [];
}

function compactText(value, fallback = '') {
  const text = normalizeText(value);
  return text || fallback;
}

function textValue(value) {
  return normalizeText(value).toLowerCase();
}

function hasRealText(value) {
  const text = textValue(value);
  return !!text && text !== 'not provided' && text !== 'none' && text !== 'n/a';
}

function firstImage(record) {
  const images = Array.isArray(record.images) ? record.images : [];
  return images.find(Boolean) || '';
}

function unionArrays(a, b) {
  return [...new Set([...(normalizeArray(a)), ...(normalizeArray(b))])];
}

function mergeRecords(base, patch) {
  const merged = { ...base, ...patch };
  const arrayKeys = [
    'images', 'links', 'months_available', 'habitat', 'observedPart', 'size', 'taste', 'substrate',
    'treeType', 'hostTree', 'ring', 'texture', 'smell', 'staining', 'boleteGroup', 'boleteSubgroup',
    'poreColor', 'stemFeature', 'medicinalAction', 'medicinalSystem', 'medicinalTerms', 'reviewReasons',
    'flowerColor', 'leafShape', 'leafArrangement', 'stemSurface', 'leafPointCount', 'look_alikes',
    'affected_systems', 'use_tags', 'key_features', 'distinguishing_features', 'lookalikes'
  ];

  for (const key of arrayKeys) {
    const combined = unionArrays(base[key], patch[key]);
    if (combined.length) merged[key] = combined;
    else delete merged[key];
  }

  if (base.mushroom_profile || patch.mushroom_profile) {
    merged.mushroom_profile = { ...(base.mushroom_profile || {}), ...(patch.mushroom_profile || {}) };
  }

  for (const key of ['display_name', 'common_name', 'scientific_name', 'culinary_uses', 'medicinal_uses', 'notes']) {
    const a = compactText(base[key]);
    const b = compactText(patch[key]);
    merged[key] = b.length >= a.length ? (b || a) : (a || b);
  }

  return merged;
}

async function fetchJsonRelative(path, required = false) {
  let lastError = null;

  for (const root of DATA_ROOTS) {
    const url = `${root}${path}`;
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        lastError = new Error(`${response.status} for ${url}`);
        continue;
      }
      const data = await response.json();
      if (!state.sourceRoot) state.sourceRoot = root;
      return { data, url };
    } catch (error) {
      lastError = error;
    }
  }

  if (required) {
    throw new Error(`Required data failed to load: ${path} (${lastError?.message || 'unknown error'})`);
  }

  state.failedPaths.push(path);
  return { data: null, url: '' };
}

function normalizeCategory(record) {
  if (record.group === 'plant') return 'Plant';
  if (record.group === 'fungus') return 'Mushroom';
  return compactText(record.category, 'Uncategorized');
}

function inferFoodRole(record) {
  const explicit = textValue(record.food_role);
  if (explicit) return explicit;

  const severity = textValue(record.non_edible_severity);
  const status = textValue(record.mushroom_profile?.edibility_status);
  const culinary = textValue(record.culinary_uses);
  const medicinal = textValue(record.medicinal_uses);
  const notes = [record.notes, record.edibility_detail, record.effects_on_body].map(textValue).join(' ');

  if (/(deadly|poison|toxic|inedible|do not eat)/.test([severity, culinary, notes].join(' '))) return 'avoid';
  if (['poisonous', 'deadly_poisonous', 'toxic_or_psychoactive', 'toxic_or_dangerous', 'inedible_tough', 'inedible_bitter'].includes(status)) return 'avoid';
  if (status === 'emergency_only') return 'emergency_only';
  if (status === 'nonculinary_tea') return 'tea_extract_only';
  if (medicinal && !culinary) return 'medicinal_only';
  if (culinary && !/(not edible|inedible|ornamental only)/.test(culinary)) return 'food';
  if (/(choice|edible|good|very good|excellent)/.test(status)) return 'food';
  return '';
}

function normalizeRecord(raw) {
  const category = normalizeCategory(raw);
  const foodRole = inferFoodRole(raw);
  return {
    ...raw,
    slug: compactText(raw.slug, slugify(raw.display_name || raw.common_name || raw.scientific_name || 'species')),
    category,
    display_name: compactText(raw.display_name || raw.common_name, 'Untitled species'),
    common_name: compactText(raw.common_name || raw.display_name, ''),
    scientific_name: compactText(raw.scientific_name, ''),
    culinary_uses: compactText(raw.culinary_uses, ''),
    medicinal_uses: compactText(raw.medicinal_uses, ''),
    notes: compactText(raw.notes, ''),
    non_edible_severity: compactText(raw.non_edible_severity, raw.status || ''),
    status: compactText(raw.status, ''),
    habitat: normalizeArray(raw.habitat),
    months_available: normalizeArray(raw.months_available),
    links: normalizeArray(raw.links),
    images: normalizeArray(raw.images),
    look_alikes: unionArrays(raw.look_alikes, raw.lookalikes),
    key_features: unionArrays(raw.key_features, []),
    distinguishing_features: unionArrays(raw.distinguishing_features, []),
    food_role: foodRole
  };
}

function applyImageOverrides(records, payload) {
  const overrides = payload?.overrides || {};
  return records.map((record) => {
    const override = overrides[record.slug];
    if (!override || !Array.isArray(override.images) || !override.images.length) return record;
    return { ...record, images: override.images.slice() };
  });
}

function sortRecords(records) {
  return [...records].sort((a, b) => {
    const aName = (a.display_name || a.common_name || '').toLowerCase();
    const bName = (b.display_name || b.common_name || '').toLowerCase();
    return aName.localeCompare(bName);
  });
}

function isPlant(record) {
  return PLANT_CATEGORIES.has(record.category) || record.group === 'plant' || record.category === 'Plant';
}

function isMushroom(record) {
  return record.category === 'Mushroom' || record.group === 'fungus';
}

function isMedicinal(record) {
  return hasRealText(record.medicinal_uses) || ['medicinal_only'].includes(textValue(record.food_role));
}

function isNonEdible(record) {
  const severity = textValue(record.non_edible_severity);
  const allText = [record.culinary_uses, record.notes, record.edibility_detail, record.effects_on_body].map(textValue).join(' ');
  if (['avoid', 'emergency_only', 'tea_extract_only', 'medicinal_only'].includes(textValue(record.food_role))) return true;
  if (severity) return true;
  return /(deadly|poison|toxic|inedible|hallucinogenic|psychoactive|do not eat)/.test(allText);
}

function recordMatchesMonth(record, month) {
  if (!month) return true;
  return normalizeArray(record.months_available).includes(month);
}

function searchHaystack(record) {
  return [
    record.display_name,
    record.common_name,
    record.scientific_name,
    record.category,
    record.status,
    record.culinary_uses,
    record.medicinal_uses,
    record.notes,
    record.habitat?.join(' '),
    record.look_alikes?.join(' '),
    record.key_features?.join(' '),
    record.distinguishing_features?.join(' ')
  ].filter(Boolean).join(' ').toLowerCase();
}

function recordMatchesSearch(record, query) {
  const q = textValue(query);
  if (!q) return true;
  return searchHaystack(record).includes(q);
}

function filteredRecordsForRoute() {
  const month = state.filter.month;
  const query = state.filter.search;

  let records = state.records.filter((record) => recordMatchesMonth(record, month) && recordMatchesSearch(record, query));

  switch (state.route) {
    case 'plants':
      records = records.filter(isPlant);
      break;
    case 'mushrooms':
      records = records.filter(isMushroom);
      break;
    case 'medicinal':
      records = records.filter(isMedicinal);
      break;
    case 'nonedible':
      records = records.filter(isNonEdible);
      break;
    case 'search':
      break;
    default:
      break;
  }

  if (state.route === 'mushrooms' && state.filter.subgroup !== 'all') {
    records = records.filter((record) => {
      const underside = normalizeArray(record.underside || record.mushroom_profile?.underside).map((item) => textValue(item));
      if (state.filter.subgroup === 'gilled') return underside.includes('gills');
      if (state.filter.subgroup === 'boletes') return underside.includes('pores');
      if (state.filter.subgroup === 'other') return isMushroom(record) && !underside.includes('gills') && !underside.includes('pores');
      return true;
    });
  }

  return sortRecords(records);
}

function filteredRareRecords() {
  return sortRecords(state.rareRecords.filter((record) => {
    return recordMatchesSearch(record, state.filter.search) && recordMatchesMonth(record, state.filter.month);
  }));
}

function allSearchRecords() {
  const main = filteredRecordsForRoute();
  if (state.route !== 'search') return main;

  const rare = filteredRareRecords().map((record) => ({ ...record, __rare: true }));
  const map = new Map();
  for (const record of [...main, ...rare]) {
    map.set(`r:${record.__rare ? '1' : '0'}:${record.slug}`, record);
  }
  return sortRecords([...map.values()]);
}

function stats() {
  return {
    total: state.records.length,
    plants: state.records.filter(isPlant).length,
    mushrooms: state.records.filter(isMushroom).length,
    medicinal: state.records.filter(isMedicinal).length,
    nonedible: state.records.filter(isNonEdible).length,
    rare: state.rareRecords.length
  };
}

function navHtml() {
  return NAV_ITEMS.map((item) => {
    const active = item.key === state.route ? 'active' : '';
    return `<button type="button" class="${active}" data-nav="${escapeHtml(item.key)}">${escapeHtml(item.label)}</button>`;
  }).join('');
}

function recordSummary(record) {
  const bits = [];
  if (record.category) bits.push(record.category);
  if (record.status) bits.push(record.status);
  if (record.months_available?.length) bits.push(record.months_available.join(', '));
  return bits.join(' · ');
}

function recordChips(record) {
  const chips = [];
  if (record.category) chips.push(record.category);
  if (record.status) chips.push(record.status);
  if (isMedicinal(record)) chips.push('Medicinal');
  if (isNonEdible(record)) chips.push('Non-edible');
  return [...new Set(chips)].slice(0, 5);
}

function imageHtml(record, altText) {
  const src = firstImage(record);
  if (!src) return `<div class="thumb-placeholder">No image</div>`;
  return `<img src="${encodeURI(src)}" alt="${escapeHtml(altText)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'thumb-placeholder',textContent:'No image'}))">`;
}

function cardHtml(record) {
  const title = record.display_name || record.common_name || 'Untitled species';
  const summary = recordSummary(record);
  return `
    <article class="species-card">
      <div class="species-thumb">${imageHtml(record, title)}</div>
      <div class="species-body">
        <div class="species-title">
          <h3>${escapeHtml(title)}</h3>
          ${record.scientific_name ? `<div class="sciname">${escapeHtml(record.scientific_name)}</div>` : ''}
        </div>
        <div class="chip-row">${recordChips(record).map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join('')}</div>
        ${summary ? `<div class="muted">${escapeHtml(summary)}</div>` : ''}
        <div class="card-actions">
          <button type="button" class="buttonish primary" data-detail="${escapeHtml(record.slug)}" data-rare="${record.__rare ? '1' : '0'}">Details</button>
        </div>
      </div>
    </article>
  `;
}

function homeHtml() {
  const s = stats();
  const highlights = sortRecords(state.records).slice(0, 8);
  const notes = [];
  notes.push(`Source root: ${state.sourceRoot || 'not established yet'}`);
  notes.push(`Optional files missing: ${state.failedPaths.length ? state.failedPaths.join(', ') : 'none'}`);

  return `
    <section class="panel notice">
      <h2>What this package does</h2>
      <p>This local clean build pulls the current species JSON from your repo at runtime, merges the main set, additions, rescued boletes, audit patches, master additions, rare species, and references, then shows everything in one cleaner interface.</p>
      <p class="footer-note">No repo changes were made by me. This zip is just the local package.</p>
    </section>

    <section class="panel">
      <div class="result-header">
        <div>
          <h2>Species totals</h2>
          <div class="result-meta">Merged from the repo data files</div>
        </div>
      </div>
      <div class="stat-grid">
        <div class="stat-card"><strong>${s.total}</strong><span>Main species records</span></div>
        <div class="stat-card"><strong>${s.plants}</strong><span>Plants</span></div>
        <div class="stat-card"><strong>${s.mushrooms}</strong><span>Mushrooms</span></div>
        <div class="stat-card"><strong>${s.medicinal}</strong><span>Medicinal</span></div>
        <div class="stat-card"><strong>${s.nonedible}</strong><span>Non-edible</span></div>
        <div class="stat-card"><strong>${s.rare}</strong><span>Rare entries</span></div>
      </div>
    </section>

    <section class="panel">
      <div class="result-header">
        <div>
          <h2>Quick notes</h2>
          <div class="result-meta">Runtime merge status</div>
        </div>
      </div>
      <ul class="detail-list">
        ${notes.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </section>

    <section class="panel">
      <div class="result-header">
        <div>
          <h2>First records in the merged set</h2>
          <div class="result-meta">Sanity-check sample</div>
        </div>
      </div>
      <div class="card-grid">
        ${highlights.map(cardHtml).join('')}
      </div>
    </section>
  `;
}

function filtersHtml(routeKey) {
  const isMushrooms = routeKey === 'mushrooms';
  const monthOptions = ['<option value="">Any month</option>']
    .concat(MONTHS.map((month) => `<option value="${escapeHtml(month)}" ${state.filter.month === month ? 'selected' : ''}>${escapeHtml(month)}</option>`))
    .join('');

  return `
    <section class="panel">
      <div class="filter-grid">
        <div class="filter-block">
          <label for="searchInput">Search</label>
          <input id="searchInput" type="search" value="${escapeHtml(state.filter.search)}" placeholder="Type a species, trait, note, or scientific name">
        </div>
        <div class="filter-block">
          <label for="monthSelect">Month</label>
          <select id="monthSelect">${monthOptions}</select>
        </div>
        ${isMushrooms ? `
          <div class="filter-block">
            <label for="subgroupSelect">Mushroom type</label>
            <select id="subgroupSelect">
              <option value="all" ${state.filter.subgroup === 'all' ? 'selected' : ''}>All mushrooms</option>
              <option value="gilled" ${state.filter.subgroup === 'gilled' ? 'selected' : ''}>Gilled</option>
              <option value="boletes" ${state.filter.subgroup === 'boletes' ? 'selected' : ''}>Boletes / pores</option>
              <option value="other" ${state.filter.subgroup === 'other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
        ` : '<div></div>'}
        <div class="filter-actions">
          <button type="button" class="buttonish" id="clearFiltersBtn">Clear filters</button>
        </div>
      </div>
    </section>
  `;
}

function listingHtml(title, records, meta) {
  return `
    <section class="panel">
      <div class="result-header">
        <div>
          <h2>${escapeHtml(title)}</h2>
          <div class="result-meta">${escapeHtml(meta)}</div>
        </div>
      </div>
      ${records.length ? `<div class="card-grid">${records.map(cardHtml).join('')}</div>` : `<div class="empty-state"><h3>No matches</h3><p>Try easing up the filters or search terms.</p></div>`}
    </section>
  `;
}

function referencesHtml() {
  const query = textValue(state.filter.search);
  const refs = (state.references || []).filter((item) => {
    if (!query) return true;
    return [item.title, item.source, item.summary, ...(item.topics || [])].join(' ').toLowerCase().includes(query);
  });

  return `
    ${filtersHtml('references')}
    <section class="panel">
      <div class="result-header">
        <div>
          <h2>References</h2>
          <div class="result-meta">${refs.length} reference${refs.length === 1 ? '' : 's'}</div>
        </div>
      </div>
      ${refs.length ? `<div class="reference-list">${refs.map((item) => `
        <article class="detail-section reference-item">
          <h3>${item.url ? `<a class="app-link" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.title || 'Untitled reference')}</a>` : escapeHtml(item.title || 'Untitled reference')}</h3>
          <div class="muted">${escapeHtml([item.source, item.published, item.resourceType].filter(Boolean).join(' · '))}</div>
          ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ''}
          ${item.topics?.length ? `<div class="chip-row">${item.topics.map((topic) => `<span class="chip">${escapeHtml(topic)}</span>`).join('')}</div>` : ''}
        </article>`).join('')}</div>` : `<div class="empty-state"><h3>No references found</h3></div>`}
    </section>
  `;
}

function detailSectionHtml(title, content) {
  if (!content) return '';
  return `<section class="detail-section"><h3>${escapeHtml(title)}</h3>${content}</section>`;
}

function listHtml(items) {
  const values = normalizeArray(items);
  if (!values.length) return '';
  return `<ul class="detail-list">${values.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function paragraphHtml(value) {
  return hasRealText(value) ? `<p>${escapeHtml(value)}</p>` : '';
}

function detailHtml(record) {
  const title = record.display_name || record.common_name || 'Untitled species';
  const galleryImages = normalizeArray(record.images).slice(0, 6);
  const facts = [];
  if (record.category) facts.push(record.category);
  if (record.scientific_name) facts.push(record.scientific_name);
  if (record.status) facts.push(record.status);
  if (record.months_available?.length) facts.push(`Season: ${record.months_available.join(', ')}`);
  if (record.habitat?.length) facts.push(`Habitat: ${record.habitat.join(', ')}`);

  return `
    <div class="detail-grid">
      <div class="detail-stack">
        <section class="detail-section detail-hero">
          <h2>${escapeHtml(title)}</h2>
          ${record.common_name && record.common_name !== record.display_name ? `<div>${escapeHtml(record.common_name)}</div>` : ''}
          ${record.scientific_name ? `<div class="sciname">${escapeHtml(record.scientific_name)}</div>` : ''}
          ${facts.length ? `<div class="chip-row">${facts.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join('')}</div>` : ''}
        </section>
        ${detailSectionHtml('Culinary uses', paragraphHtml(record.culinary_uses))}
        ${detailSectionHtml('Medicinal uses', paragraphHtml(record.medicinal_uses))}
        ${detailSectionHtml('Notes', paragraphHtml(record.notes))}
        ${detailSectionHtml('Key features', listHtml(record.key_features))}
        ${detailSectionHtml('Distinguishing features', listHtml(record.distinguishing_features))}
        ${detailSectionHtml('Look-alikes', listHtml(record.look_alikes))}
        ${detailSectionHtml('Links', normalizeArray(record.links).length ? `<ul class="detail-list">${normalizeArray(record.links).map((link) => `<li><a class="app-link" href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(link)}</a></li>`).join('')}</ul>` : '')}
      </div>
      <div class="detail-stack">
        <section class="detail-section detail-gallery">
          <h3>Images</h3>
          ${galleryImages.length ? galleryImages.map((src) => `<img src="${encodeURI(src)}" alt="${escapeHtml(title)}" referrerpolicy="no-referrer">`).join('') : '<div class="thumb-placeholder" style="min-height:220px">No imported image</div>'}
        </section>
      </div>
    </div>
  `;
}

function render() {
  if (els.mainNav) els.mainNav.innerHTML = navHtml();

  let html = '';

  if (state.route === 'home') {
    html = homeHtml();
  } else if (state.route === 'references') {
    html = referencesHtml();
  } else if (state.route === 'rare') {
    const rare = filteredRareRecords().map((record) => ({ ...record, __rare: true }));
    html = `${filtersHtml('rare')}${listingHtml('Rare / Endangered', rare, `${rare.length} match${rare.length === 1 ? '' : 'es'}`)}`;
  } else {
    const records = state.route === 'search' ? allSearchRecords() : filteredRecordsForRoute();
    const titles = {
      plants: 'Plants',
      mushrooms: 'Mushrooms',
      medicinal: 'Medicinal species',
      nonedible: 'Non-edible species',
      search: 'Search'
    };
    html = `${filtersHtml(state.route)}${listingHtml(titles[state.route] || 'Records', records, `${records.length} match${records.length === 1 ? '' : 'es'}`)}`;
  }

  els.pageRoot.innerHTML = html;
  bindPageEvents();
}

function findRecordBySlug(slug, isRare = false) {
  if (isRare) return state.rareRecords.find((record) => record.slug === slug) || null;
  return state.records.find((record) => record.slug === slug) || state.rareRecords.find((record) => record.slug === slug) || null;
}

function openDetail(slug, isRare = false) {
  const record = findRecordBySlug(slug, isRare);
  if (!record) return;
  els.modalContent.innerHTML = detailHtml(record);
  try {
    els.detailModal.showModal();
  } catch {
    els.detailModal.setAttribute('open', 'open');
  }
}

function closeDetail() {
  try {
    els.detailModal.close();
  } catch {
    els.detailModal.removeAttribute('open');
  }
}

function bindPageEvents() {
  els.mainNav.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      state.route = button.dataset.nav || 'home';
      state.filter.subgroup = 'all';
      render();
    });
  });

  const searchInput = document.getElementById('searchInput');
  const monthSelect = document.getElementById('monthSelect');
  const subgroupSelect = document.getElementById('subgroupSelect');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      state.filter.search = searchInput.value;
      render();
    });
  }

  if (monthSelect) {
    monthSelect.addEventListener('change', () => {
      state.filter.month = monthSelect.value;
      render();
    });
  }

  if (subgroupSelect) {
    subgroupSelect.addEventListener('change', () => {
      state.filter.subgroup = subgroupSelect.value;
      render();
    });
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      state.filter.search = '';
      state.filter.month = '';
      state.filter.subgroup = 'all';
      render();
    });
  }

  document.querySelectorAll('[data-detail]').forEach((button) => {
    button.addEventListener('click', () => {
      const slug = button.dataset.detail || '';
      const isRare = button.dataset.rare === '1';
      openDetail(slug, isRare);
    });
  });
}

async function loadData() {
  const required = await fetchJsonRelative('data/species.json', true);

  const optionalPaths = [
    'data/species-additions-mainfix13.json',
    'data/boletes-rescued-mainfix40.json',
    'data/species-audit-mainfix35.json',
    'data/species-audit-mainfix37.json',
    'data/species-master-additions-v1.json',
    'data/wikimedia-image-overrides-wm4.json',
    'data/references-mainfix15.json',
    'data/rare-species-v2.json'
  ];

  const optionalResults = await Promise.all(optionalPaths.map((path) => fetchJsonRelative(path, false)));

  const byPath = new Map();
  for (let i = 0; i < optionalPaths.length; i += 1) {
    byPath.set(optionalPaths[i], optionalResults[i].data);
  }

  const mainPayload = required.data || { records: [] };
  const patchPayloads = [
    byPath.get('data/species-additions-mainfix13.json'),
    byPath.get('data/boletes-rescued-mainfix40.json'),
    byPath.get('data/species-audit-mainfix35.json'),
    byPath.get('data/species-audit-mainfix37.json'),
    byPath.get('data/species-master-additions-v1.json')
  ].filter(Boolean);

  const map = new Map();
  for (const raw of (mainPayload.records || [])) {
    const record = normalizeRecord(raw);
    map.set(record.slug, record);
  }

  for (const payload of patchPayloads) {
    for (const raw of (payload.records || [])) {
      const record = normalizeRecord(raw);
      const existing = map.get(record.slug);
      map.set(record.slug, existing ? normalizeRecord(mergeRecords(existing, record)) : record);
    }
  }

  let records = [...map.values()].map(normalizeRecord);
  records = applyImageOverrides(records, byPath.get('data/wikimedia-image-overrides-wm4.json'));
  state.records = sortRecords(records);
  state.references = Array.isArray(byPath.get('data/references-mainfix15.json')) ? byPath.get('data/references-mainfix15.json') : [];

  const rarePayload = byPath.get('data/rare-species-v2.json');
  state.rareRecords = sortRecords((rarePayload?.records || []).map((raw) => normalizeRecord({
    ...raw,
    category: raw.group === 'fungus' ? 'Mushroom' : 'Plant',
    notes: raw.reason || raw.notes || ''
  })));
}

async function init() {
  els.closeModalBtn?.addEventListener('click', closeDetail);
  els.detailModal?.addEventListener('click', (event) => {
    if (event.target === els.detailModal) closeDetail();
  });

  try {
    await loadData();
    render();
  } catch (error) {
    console.error(error);
    els.pageRoot.innerHTML = `
      <section class="panel error-panel">
        <h2>Load failed</h2>
        <p>${escapeHtml(error.message || String(error))}</p>
        <p class="footer-note">This package expects to be able to fetch the current repo data from GitHub or jsDelivr.</p>
      </section>
    `;
  }
}

init();
