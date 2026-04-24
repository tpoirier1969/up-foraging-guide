import { esc } from "../lib/escape.js";

function creditRow(entry) {
  const sourceLabel = entry.source?.includes('manifest') || entry.source?.includes('hardwired') ? 'Local hardwired manifest' : 'Local image source';
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
  const photoCount = Array.isArray(record.images) ? record.images.length : 0;
  return `
    <article class="credit-card compact-card">
      <h3>${esc(record.display_name || record.common_name || record.slug || 'Untitled')}</h3>
      <p class="muted small">${esc(record.scientific_name || '')}</p>
      <p><strong>Photo rule:</strong> Hardwired local manifest only. No runtime Commons search.</p>
      <p><strong>Attached photos:</strong> ${photoCount}</p>
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

  const hardwiredResolved = credits.length;

  return `
    <section class="panel">
      <h2>Credits</h2>
      <p>This build uses a local hardwired image manifest. Runtime Commons searching is disabled.</p>
    </section>

    <section class="panel">
      <div class="grid-3">
        <div class="stat-card"><div class="num">${records.length}</div><div>Species in catalog</div></div>
        <div class="stat-card"><div class="num">0</div><div>Runtime Commons API calls</div></div>
        <div class="stat-card"><div class="num">${hardwiredResolved}</div><div>Resolved local image credits this session</div></div>
      </div>
    </section>

    <section class="panel">
      <h3>Resolved image credits</h3>
      ${credits.length ? `<section class="credit-list">${credits.map(creditRow).join('')}</section>` : `<p class="muted">No hardwired image credits have been displayed yet in this session.</p>`}
    </section>

    <section class="panel">
      <h3>Species image catalog</h3>
      <section class="credit-list">${catalog.map(catalogRow).join('')}</section>
    </section>
  `;
}
