const fallbackData = [
  {
    id: 1,
    common_name: 'Stinging Nettle',
    scientific_name: 'Urtica dioica',
    category: 'plant',
    season: 'early spring',
    use_type: 'culinary, medicinal',
    edible_parts: 'Young shoots and leaves',
    description: 'Harvest very young growth with gloves. Steam, sauté, or dry for tea.',
    notes: 'Traditionally used for inflammation support. Handle carefully before cooking.'
  },
  {
    id: 2,
    common_name: 'Lamb\'s Quarters',
    scientific_name: 'Chenopodium album',
    category: 'plant',
    season: 'late spring',
    use_type: 'culinary',
    edible_parts: 'Leaves and tender tops',
    description: 'Useful spinach substitute with tender leaves in spring and early summer.',
    notes: 'Best collected young.'
  },
  {
    id: 3,
    common_name: 'Dandelion',
    scientific_name: 'Taraxacum officinale',
    category: 'plant',
    season: 'early spring',
    use_type: 'culinary, medicinal',
    edible_parts: 'Leaves, flowers, roots',
    description: 'Leaves for salads, roots for roasting or tea, flowers for fritters or wine.',
    notes: 'Young leaves are less bitter.'
  },
  {
    id: 4,
    common_name: 'Cattail',
    scientific_name: 'Typha spp.',
    category: 'plant',
    season: 'late spring',
    use_type: 'culinary',
    edible_parts: 'Young shoots',
    description: 'Often called “cossack asparagus” when harvested young.',
    notes: 'Harvest only from clean water areas.'
  },
  {
    id: 5,
    common_name: 'Paper Birch',
    scientific_name: 'Betula papyrifera',
    category: 'plant',
    season: 'early spring',
    use_type: 'culinary, medicinal',
    edible_parts: 'Sap',
    description: 'Sap can be tapped before leaf-out and consumed fresh or reduced.',
    notes: 'Use tree-tapping best practices so the tree does not get bullied by bad technique.'
  },
  {
    id: 6,
    common_name: 'Blueberry',
    scientific_name: 'Vaccinium angustifolium',
    category: 'plant',
    season: 'summer',
    use_type: 'culinary',
    edible_parts: 'Berries',
    description: 'A core Upper Michigan wild fruit with fresh and preserved uses.',
    notes: 'One of the cornerstone guide entries from your earlier scope.'
  },
  {
    id: 7,
    common_name: 'Thimbleberry',
    scientific_name: 'Rubus parviflorus',
    category: 'plant',
    season: 'summer',
    use_type: 'culinary',
    edible_parts: 'Berries',
    description: 'Soft red fruits that do not travel well, making them ideal for local field-guide love.',
    notes: 'Best eaten quickly after harvest.'
  },
  {
    id: 8,
    common_name: 'Chokecherry',
    scientific_name: 'Prunus virginiana',
    category: 'plant',
    season: 'fall',
    use_type: 'culinary',
    edible_parts: 'Fruit',
    description: 'Strong, astringent fruit often used in jelly and syrup once fully ripe.',
    notes: 'Processing usually improves flavor.'
  },
  {
    id: 9,
    common_name: 'Morel',
    scientific_name: 'Morchella spp.',
    category: 'mushroom',
    season: 'late spring',
    use_type: 'culinary',
    edible_parts: 'Fruiting body',
    description: 'One of the most sought-after spring mushrooms. Must always be cooked.',
    notes: 'Do not confuse with false morels.'
  },
  {
    id: 10,
    common_name: 'Oyster Mushroom',
    scientific_name: 'Pleurotus ostreatus',
    category: 'mushroom',
    season: 'spring',
    use_type: 'culinary',
    edible_parts: 'Fruiting body',
    description: 'Fan-shaped mushroom often found on hardwood logs.',
    notes: 'Season label here will still show through search text, but later we should normalize all season values.'
  },
  {
    id: 11,
    common_name: 'Chanterelle',
    scientific_name: 'Cantharellus spp.',
    category: 'mushroom',
    season: 'summer',
    use_type: 'culinary',
    edible_parts: 'Fruiting body',
    description: 'Golden, fruity, and worth a respectful frying pan.',
    notes: 'A key mushroom already in your project scope.'
  },
  {
    id: 12,
    common_name: 'Hen of the Woods',
    scientific_name: 'Grifola frondosa',
    category: 'mushroom',
    season: 'fall',
    use_type: 'culinary',
    edible_parts: 'Fruiting body',
    description: 'Clustered mushroom associated with hardwoods and cooler-season hunting.',
    notes: 'Also known as maitake.'
  }
];

const state = {
  entries: [],
  filteredEntries: []
};

const els = {
  searchInput: document.getElementById('searchInput'),
  categoryFilter: document.getElementById('categoryFilter'),
  seasonFilter: document.getElementById('seasonFilter'),
  useFilter: document.getElementById('useFilter'),
  resetFilters: document.getElementById('resetFilters'),
  entryGrid: document.getElementById('entryGrid'),
  entryCardTemplate: document.getElementById('entryCardTemplate'),
  resultsLabel: document.getElementById('resultsLabel'),
  entryCount: document.getElementById('entryCount'),
  plantCount: document.getElementById('plantCount'),
  mushroomCount: document.getElementById('mushroomCount'),
  seasonCount: document.getElementById('seasonCount'),
  connectionStatus: document.getElementById('connectionStatus')
};

function normalizeSeason(value) {
  return String(value || '').toLowerCase().trim();
}

function applyFilters() {
  const search = els.searchInput.value.toLowerCase().trim();
  const category = els.categoryFilter.value;
  const season = els.seasonFilter.value;
  const useType = els.useFilter.value;

  state.filteredEntries = state.entries.filter((entry) => {
    const haystack = [
      entry.common_name,
      entry.scientific_name,
      entry.description,
      entry.notes,
      entry.use_type,
      entry.edible_parts,
      entry.season
    ].join(' ').toLowerCase();

    const categoryMatch = category === 'all' || entry.category === category;
    const seasonMatch = season === 'all' || normalizeSeason(entry.season) === season;
    const useMatch = useType === 'all' || entry.use_type === useType;
    const searchMatch = !search || haystack.includes(search);

    return categoryMatch && seasonMatch && useMatch && searchMatch;
  });

  renderEntries();
  renderSummary();
}

function renderEntries() {
  els.entryGrid.innerHTML = '';
  els.resultsLabel.textContent = `${state.filteredEntries.length} result${state.filteredEntries.length === 1 ? '' : 's'}`;

  if (!state.filteredEntries.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No entries match the current filters. The woods are quiet.';
    els.entryGrid.appendChild(empty);
    return;
  }

  for (const entry of state.filteredEntries) {
    const node = els.entryCardTemplate.content.cloneNode(true);
    const card = node.querySelector('.entry-card');
    const categoryPill = node.querySelector('.category-pill');
    const seasonPill = node.querySelector('.season-pill');

    categoryPill.textContent = entry.category;
    categoryPill.dataset.category = entry.category;
    seasonPill.textContent = entry.season;

    node.querySelector('.entry-name').textContent = entry.common_name;
    node.querySelector('.entry-scientific').textContent = entry.scientific_name || 'Scientific name TBD';
    node.querySelector('.entry-description').textContent = entry.description || '';
    node.querySelector('.entry-use').textContent = entry.use_type || 'TBD';
    node.querySelector('.entry-parts').textContent = entry.edible_parts || 'TBD';
    node.querySelector('.entry-notes').textContent = entry.notes || 'TBD';

    els.entryGrid.appendChild(node);
  }
}

function renderSummary() {
  els.entryCount.textContent = state.filteredEntries.length;
  els.plantCount.textContent = state.filteredEntries.filter(e => e.category === 'plant').length;
  els.mushroomCount.textContent = state.filteredEntries.filter(e => e.category === 'mushroom').length;
  const seasons = new Set(state.filteredEntries.map(e => normalizeSeason(e.season)).filter(Boolean));
  els.seasonCount.textContent = seasons.size;
}

function bindEvents() {
  [els.searchInput, els.categoryFilter, els.seasonFilter, els.useFilter].forEach((el) => {
    el.addEventListener('input', applyFilters);
    el.addEventListener('change', applyFilters);
  });

  els.resetFilters.addEventListener('click', () => {
    els.searchInput.value = '';
    els.categoryFilter.value = 'all';
    els.seasonFilter.value = 'all';
    els.useFilter.value = 'all';
    applyFilters();
  });
}

async function loadEntries() {
  const config = window.FORAGING_APP_CONFIG || {};
  const hasSupabaseConfig = config.supabaseUrl && config.supabaseAnonKey && !config.supabaseUrl.includes('PASTE_');

  if (!hasSupabaseConfig) {
    state.entries = fallbackData;
    els.connectionStatus.textContent = 'Using local starter data. Supabase is not configured yet.';
    state.filteredEntries = [...state.entries];
    renderEntries();
    renderSummary();
    return;
  }

  try {
    const client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    const { data, error } = await client
      .from('foraging_entries')
      .select('*')
      .order('common_name', { ascending: true });

    if (error) throw error;

    state.entries = Array.isArray(data) && data.length ? data : fallbackData;
    els.connectionStatus.textContent = Array.isArray(data) && data.length
      ? 'Connected to Supabase and loaded live data.'
      : 'Connected to Supabase, but table is empty. Showing starter data.';
  } catch (error) {
    console.error(error);
    state.entries = fallbackData;
    els.connectionStatus.textContent = 'Supabase connection failed. Showing starter data instead.';
  }

  state.filteredEntries = [...state.entries];
  renderEntries();
  renderSummary();
}

bindEvents();
loadEntries();
