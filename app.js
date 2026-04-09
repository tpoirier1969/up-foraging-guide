
const APP_VERSION = "v0.2";
const TABLE_NAME = "upper_michigan_foraging_species_v1";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const els = {
  searchInput: document.getElementById("searchInput"),
  categoryFilter: document.getElementById("categoryFilter"),
  monthFilter: document.getElementById("monthFilter"),
  imageFilter: document.getElementById("imageFilter"),
  clearFiltersBtn: document.getElementById("clearFiltersBtn"),
  dataSourceBadge: document.getElementById("dataSourceBadge"),
  resultsSummary: document.getElementById("resultsSummary"),
  speciesGrid: document.getElementById("speciesGrid"),
  emptyState: document.getElementById("emptyState"),
  speciesCount: document.getElementById("speciesCount"),
  imageCount: document.getElementById("imageCount"),
  categoryCount: document.getElementById("categoryCount"),
  monthChips: document.getElementById("monthChips"),
  detailModal: document.getElementById("detailModal"),
  modalContent: document.getElementById("modalContent"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  versionBadge: document.getElementById("versionBadge")
};

const state = {
  allRecords: [],
  filteredRecords: [],
  dataSource: "Local JSON fallback",
  metadata: null
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function categoryClassName(category) {
  return escapeHtml(category || "Uncategorized");
}

function summarizeText(record) {
  return [record.culinary_uses, record.medicinal_uses, record.notes]
    .filter(Boolean)
    .join(" • ");
}

function matchesSearch(record, query) {
  if (!query) return true;
  const haystack = [
    record.display_name,
    record.common_name,
    record.category,
    record.culinary_uses,
    record.medicinal_uses,
    record.notes,
    ...(record.links || [])
  ].join(" ").toLowerCase();
  return haystack.includes(query);
}

function renderStats(records) {
  const imageCount = records.reduce((sum, record) => sum + (record.images?.length || 0), 0);
  const categoryCount = new Set(records.map(record => record.category).filter(Boolean)).size;
  els.speciesCount.textContent = String(records.length);
  els.imageCount.textContent = String(imageCount);
  els.categoryCount.textContent = String(categoryCount);
  els.versionBadge.textContent = APP_VERSION;
}

function populateFilters(records) {
  const categories = [...new Set(records.map(record => record.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  els.categoryFilter.innerHTML = '<option value="">All categories</option>' + categories
    .map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join("");

  els.monthFilter.innerHTML = '<option value="">Any month</option>' + MONTHS
    .map(month => `<option value="${month}">${month}</option>`)
    .join("");

  els.monthChips.innerHTML = MONTHS.map(month => `
    <button class="month-chip" type="button" data-month="${month}">${month.slice(0, 3)}</button>
  `).join("");

  els.monthChips.querySelectorAll("[data-month]").forEach(button => {
    button.addEventListener("click", () => {
      const nextValue = els.monthFilter.value === button.dataset.month ? "" : button.dataset.month;
      els.monthFilter.value = nextValue;
      syncActiveMonthChip();
      applyFilters();
    });
  });
}

function syncActiveMonthChip() {
  els.monthChips.querySelectorAll("[data-month]").forEach(button => {
    button.classList.toggle("active", button.dataset.month === els.monthFilter.value);
  });
}

function applyFilters() {
  const search = els.searchInput.value.trim().toLowerCase();
  const category = els.categoryFilter.value;
  const month = els.monthFilter.value;
  const imageFilter = els.imageFilter.value;

  state.filteredRecords = state.allRecords.filter(record => {
    const categoryMatch = !category || record.category === category;
    const monthMatch = !month || (record.months_available || []).includes(month);
    const imageMatch =
      !imageFilter ||
      (imageFilter === "with-images" && record.images?.length) ||
      (imageFilter === "without-images" && !record.images?.length);
    return categoryMatch && monthMatch && imageMatch && matchesSearch(record, search);
  });

  renderGrid(state.filteredRecords);
  syncActiveMonthChip();

  const monthLabel = month ? ` in ${month}` : "";
  els.resultsSummary.textContent = `${state.filteredRecords.length} match${state.filteredRecords.length === 1 ? "" : "es"}${monthLabel}`;
}

function renderGrid(records) {
  els.emptyState.classList.toggle("hidden", records.length !== 0);

  els.speciesGrid.innerHTML = records.map(record => {
    const imageStyle = record.images?.length
      ? `style="background-image:url('${encodeURI(record.images[0])}')"`
      : "";

    const summary = summarizeText(record);
    const monthBadges = (record.months_available || []).slice(0, 6).map(month => `<span class="month-badge">${month.slice(0,3)}</span>`).join("");
    const overflowBadge = (record.months_available || []).length > 6 ? `<span class="month-badge">+${record.months_available.length - 6}</span>` : "";

    return `
      <article class="species-card">
        <div class="card-image" ${imageStyle}></div>
        <div class="card-body">
          <div class="meta-row">
            <span class="category-pill">${escapeHtml(record.category || "Uncategorized")}</span>
          </div>
          <h2 class="card-title">${escapeHtml(record.display_name)}</h2>
          <p class="card-copy">${escapeHtml(summary || "No description imported yet.")}</p>

          <div class="info-block">
            <h4>Months</h4>
            <div class="month-list">${monthBadges}${overflowBadge || '<span class="month-badge">No month data</span>'}</div>
          </div>

          <button type="button" data-slug="${escapeHtml(record.slug)}">Open details</button>
        </div>
      </article>
    `;
  }).join("");

  els.speciesGrid.querySelectorAll("button[data-slug]").forEach(button => {
    button.addEventListener("click", () => openModal(button.dataset.slug));
  });
}

function openModal(slug) {
  const record = state.allRecords.find(item => item.slug === slug);
  if (!record) return;

  const gallery = record.images?.length
    ? `<div class="modal-gallery">${record.images.map(path => `<img src="${encodeURI(path)}" alt="${escapeHtml(record.display_name)}">`).join("")}</div>`
    : `<div class="modal-gallery"><div class="species-card" style="min-height:220px;justify-content:center;align-items:center;"><div class="card-body"><p class="card-copy">No image was embedded for this entry in the uploaded workbook.</p></div></div></div>`;

  const links = record.links?.length
    ? `<ul>${record.links.map(link => `<li><a href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(link)}</a></li>`).join("")}</ul>`
    : "<p>No source link was imported for this record.</p>";

  const months = record.months_available?.length
    ? `<div class="month-list">${record.months_available.map(month => `<span class="month-badge">${month}</span>`).join("")}</div>`
    : "<p>No seasonal data imported.</p>";

  els.modalContent.innerHTML = `
    <div class="modal-layout">
      ${gallery}
      <div class="modal-copy">
        <span class="category-pill">${escapeHtml(record.category || "Uncategorized")}</span>
        <h2>${escapeHtml(record.display_name)}</h2>

        <div class="section">
          <h3>Culinary uses</h3>
          <p>${escapeHtml(record.culinary_uses || "Not provided in the imported sheet.")}</p>
        </div>

        <div class="section">
          <h3>Medicinal uses</h3>
          <p>${escapeHtml(record.medicinal_uses || "Not provided in the imported sheet.")}</p>
        </div>

        <div class="section">
          <h3>Notes</h3>
          <p>${escapeHtml(record.notes || "No extra notes imported.")}</p>
        </div>

        <div class="section">
          <h3>Seasonality</h3>
          ${months}
        </div>

        <div class="section">
          <h3>Source links</h3>
          ${links}
        </div>

        <p class="footer-note">Supabase table target: <strong>${TABLE_NAME}</strong></p>
      </div>
    </div>
  `;
  els.detailModal.showModal();
}

function closeModal() {
  els.detailModal.close();
}

async function loadLocalData() {
  const response = await fetch("data/species.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Local JSON load failed: ${response.status}`);
  return response.json();
}

async function loadSupabaseData() {
  const cfg = window.FORAGING_APP_CONFIG || {};
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY || !window.supabase?.createClient) {
    throw new Error("Supabase config missing");
  }

  const client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  const { data, error } = await client
    .from(TABLE_NAME)
    .select("species_slug,display_name,common_name,category,culinary_uses,medicinal_uses,notes,months_available,source_links,image_paths")
    .order("display_name", { ascending: true });

  if (error) throw error;

  return {
    metadata: {
      project: "Upper Michigan Foraging Guide",
      version: APP_VERSION,
      source: "Supabase"
    },
    records: (data || []).map(row => ({
      slug: row.species_slug,
      display_name: row.display_name,
      common_name: row.common_name,
      category: row.category,
      culinary_uses: row.culinary_uses || "",
      medicinal_uses: row.medicinal_uses || "",
      notes: row.notes || "",
      months_available: row.months_available || [],
      links: row.source_links || [],
      images: row.image_paths || []
    }))
  };
}

async function initializeApp() {
  try {
    let payload;
    try {
      payload = await loadSupabaseData();
      state.dataSource = "Supabase live data";
    } catch (supabaseError) {
      payload = await loadLocalData();
      state.dataSource = "Local JSON fallback";
      console.info("Supabase not used for this run:", supabaseError?.message || supabaseError);
    }

    state.metadata = payload.metadata || null;
    state.allRecords = (payload.records || []).slice().sort((a, b) => a.display_name.localeCompare(b.display_name));

    renderStats(state.allRecords);
    populateFilters(state.allRecords);
    applyFilters();

    els.dataSourceBadge.textContent = `${state.dataSource} • table: ${TABLE_NAME}`;
  } catch (error) {
    console.error(error);
    els.dataSourceBadge.textContent = "Data load failed";
    els.resultsSummary.textContent = error.message || String(error);
    els.speciesGrid.innerHTML = "";
    els.emptyState.classList.remove("hidden");
    els.emptyState.querySelector("h3").textContent = "Data load failed.";
    els.emptyState.querySelector("p").textContent = error.message || "Check console output for details.";
  }
}

els.searchInput.addEventListener("input", applyFilters);
els.categoryFilter.addEventListener("change", applyFilters);
els.monthFilter.addEventListener("change", applyFilters);
els.imageFilter.addEventListener("change", applyFilters);
els.clearFiltersBtn.addEventListener("click", () => {
  els.searchInput.value = "";
  els.categoryFilter.value = "";
  els.monthFilter.value = "";
  els.imageFilter.value = "";
  applyFilters();
});

els.closeModalBtn.addEventListener("click", closeModal);
els.detailModal.addEventListener("click", event => {
  const rect = els.detailModal.getBoundingClientRect();
  const clickedInside = (
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width
  );
  if (!clickedInside) closeModal();
});

initializeApp();
