import { getCommonsSearchUrl } from "../lib/commons.js";
import { esc } from "../lib/escape.js";

function creditRow(entry) {
  const sourceLabel = entry.source === 'wikimedia' ? 'Wikimedia Commons' : 'Local image path';
  return `
    <article class="credit-card">
      <h3>${esc(entry.species || entry.slug || 'Untitled')}</h3>
      <p class="muted small">${esc(entry.scientific_name || '')}</p>
      <p><strong>Source:</strong> ${esc(sourceLabel)}</p>
      ${entry.title ? `<p><strong>File:</strong> ${esc(entry.title)}</p>` : ''}
      ${entry.author ? `<p><strong>Author / credit:</strong> ${esc(entry.author)}</p>` : ''}
      ${entry.credit ? `<p><strong>Credit text:</strong> ${esc(entry.credit)}</p>` : ''}
      ${entry.license ? `<p><strong>License:</strong> ${esc(entry.license)}</p>` : ''}
      <div class="control-row compact">
        ${entry.sourcePage ? `<a class="buttonish" href="${esc(entry.sourcePage)}" target="_blank" rel="noreferrer">Open source</a>` : ''}
        ${entry.licenseUrl ? `<a class="buttonish" href="${esc(entry.licenseUrl)}" target="_blank" rel="noreferrer">License</a>` : ''}
      </div>
    </article>
  `;
}

function catalogRow(record) {
  return `
    <article class="credit-card compact-card">
      <h3>${esc(record.display_name || record.common_name || record.slug || 'Untitled')}</h3>
      <p class="muted small">${esc(record.scientific_name || '')}</p>
      <p><strong>Photo rule:</strong> 2-3 real photographs required. No sketches, drawings, or paintings.</p>
      <div class="control-row compact">
        <a class="buttonish" href="${esc(getCommonsSearchUrl(record))}" target="_blank" rel="noreferrer">Search Commons</a>
      </div>
    </article>
  `;
}

export function renderCreditsPage(records, imageCredits, search = '') {
  const q = String(search || '').trim().toLowerCase();
  const credits = Array.from(imageCredits.values())
    .flat()
    .filter(entry => {
      if (!q) return true;
      return [entry.species, entry.scientific_name, entry.title, entry.author, entry.license, entry.slug].join(' ').toLowerCase().includes(q);
    })
    .sort((a,b) => String(a.species || a.slug).localeCompare(String(b.species || b.slug)));

  const catalog = (records || []).filter(record => {
    if (!q) return true;
    return [record.display_name, record.common_name, record.scientific_name, record.slug].join(' ').toLowerCase().includes(q);
  }).sort((a,b) => String(a.display_name || a.common_name || a.slug).localeCompare(String(b.display_name || b.common_name || b.slug)));

  const wikimediaResolved = credits.filter(entry => entry.source === 'wikimedia').length;

  return `
    <section class="panel">
      <h2>Credits</h2>
      <p>This build resolves Commons photographs and rejects obvious sketches, drawings, paintings, diagrams, and similar non-photo assets. The target is 2-3 real photos per species.</p>
      <div class="control-row">
        <input id="creditsSearch" type="search" value="${esc(search)}" placeholder="Search credits, species, filenames, or licenses" style="flex:1;min-width:280px">
        <button id="creditsSearchBtn" class="primary" type="button">Search</button>
      </div>
    </section>

    <section class="panel">
      <div class="grid-3">
        <div class="stat-card"><div class="num">${records.length}</div><div>Species in catalog</div></div>
        <div class="stat-card"><div class="num">2-3</div><div>Target photos per species</div></div>
        <div class="stat-card"><div class="num">${wikimediaResolved}</div><div>Resolved Commons credits this session</div></div>
      </div>
    </section>

    <section class="panel">
      <h3>Resolved image credits</h3>
      <p class="muted">This fills in as species images resolve during use.</p>
      ${credits.length ? `<section class="credit-list">${credits.map(creditRow).join('')}</section>` : `<p class="muted">No image credits have been resolved yet in this session. Browse the species pages and open details; this list will populate.</p>`}
    </section>

    <section class="panel">
      <h3>Species image catalog</h3>
      <section class="credit-list">${catalog.map(catalogRow).join('')}</section>
    </section>
  `;
}
