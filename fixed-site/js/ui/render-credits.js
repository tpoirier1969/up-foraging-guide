import { esc } from "../lib/escape.js";

function catalogRow(record) {
  const photoCount = Array.isArray(record.images) ? record.images.length : 0;
  return `
    <article class="credit-card compact-card">
      <h3>${esc(record.display_name || record.common_name || record.slug || 'Untitled')}</h3>
      <p class="muted small">${esc(record.scientific_name || '')}</p>
      <p><strong>Attached photos:</strong> ${photoCount}</p>
    </article>
  `;
}

export function renderCreditsPage(records, imageCredits, search = '') {
  const q = String(search || '').trim().toLowerCase();
  const credits = Array.from(imageCredits.values()).flat().filter(entry => !q || [entry.species, entry.scientific_name, entry.title, entry.author, entry.license, entry.slug].join(' ').toLowerCase().includes(q));
  const catalog = (records || []).filter(record => !q || [record.display_name, record.common_name, record.scientific_name, record.slug].join(' ').toLowerCase().includes(q));
  return `
    <section class="panel">
      <h2>Credits</h2>
      <div class="control-row">
        <input id="creditsSearch" type="search" value="${esc(search)}" placeholder="Search credits, species, or filenames" style="flex:1;min-width:280px">
        <button id="creditsSearchBtn" class="primary" type="button">Search</button>
      </div>
    </section>
    <section class="panel"><div class="grid-3"><div class="stat-card"><div class="num">${records.length}</div><div>Species in catalog</div></div><div class="stat-card"><div class="num">${credits.length}</div><div>Resolved local image credits this session</div></div><div class="stat-card"><div class="num">${catalog.filter(r => (r.images || []).length).length}</div><div>Species with attached image refs</div></div></div></section>
    <section class="panel"><h3>Species image catalog</h3><section class="credit-list">${catalog.map(catalogRow).join('')}</section></section>
  `;
}
