import { state, rememberImageCredit, rememberImageFailure, rememberImageResult } from "../state.js";

let manifestPromise = null;

function placeholderSvg(label) {
  const text = String(label || 'No image').slice(0, 42);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#eef3ef"/><rect x="40" y="40" width="1120" height="720" rx="28" ry="28" fill="#f8fbf8" stroke="#c9d5cd" stroke-width="6"/><circle cx="290" cy="300" r="70" fill="#dce9df"/><path d="M150 620l210-210 120 110 155-165 210 265H150z" fill="#dce9df"/><text x="600" y="690" text-anchor="middle" font-family="system-ui, sans-serif" font-size="46" fill="#5f6d63">${text}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function setBadge(container, text) { const badge = container?.querySelector('[data-image-badge]'); if (badge) badge.textContent = text; }
function setSourceLink(container, href, label = 'source') {
  const link = container?.querySelector('[data-image-source-link]');
  if (!link) return;
  if (href) { link.href = href; link.textContent = label; link.hidden = false; }
  else { link.hidden = true; link.removeAttribute('href'); }
}
function normalizeHardwiredImages(record) {
  const list = Array.isArray(record?.images) ? record.images : [];
  return list.map((item) => typeof item === 'string' ? { src: item, source: 'embedded-hardwired', title: record.display_name || record.common_name || record.slug, sourcePage: item } : (item && typeof item === 'object' ? item : null)).filter(Boolean);
}
async function loadLocalManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch('./data/species-images.json', { cache: 'no-cache' }).then((res) => {
      if (!res.ok) throw new Error(`species-images.json ${res.status}`);
      return res.json();
    }).then((payload) => payload?.records || {}).catch(() => ({}));
  }
  return manifestPromise;
}
function creditAll(record, items, sourceLabel) {
  for (const item of items) {
    rememberImageCredit(record.slug, { slug: record.slug, species: record.display_name || record.common_name || record.slug, scientific_name: record.scientific_name || '', source: item.source || sourceLabel, title: item.title, author: item.author, credit: item.credit, license: item.license, licenseUrl: item.licenseUrl, sourcePage: item.sourcePage, query: item.query });
  }
}
async function ensureGallery(record) {
  const cached = state.imageCache.get(record.slug);
  if (cached?.items?.length) return cached.items;
  const manifest = await loadLocalManifest();
  const localManifestItems = Array.isArray(manifest[record.slug]) ? manifest[record.slug] : [];
  if (localManifestItems.length) { rememberImageResult(record.slug, { source: 'local-manifest', items: localManifestItems }); creditAll(record, localManifestItems, 'local-manifest'); return localManifestItems; }
  const hardwired = normalizeHardwiredImages(record);
  if (hardwired.length) { rememberImageResult(record.slug, { source: 'embedded-hardwired', items: hardwired }); creditAll(record, hardwired, 'embedded-hardwired'); return hardwired; }
  rememberImageFailure(record.slug); return [];
}
function loadCandidateSequence(img, container, orderedItems, record, index) {
  let pos = 0;
  const tryNext = () => {
    const item = orderedItems[pos++];
    if (!item?.src) {
      img.onload = null; img.onerror = null;
      img.src = placeholderSvg(`${record.display_name || record.common_name || record.slug} needs photo`);
      img.dataset.resolvedSource = 'missing'; setBadge(container, 'Needs photo'); setSourceLink(container, '', ''); return;
    }
    img.onload = () => { img.dataset.resolvedSource = item.source || 'local-manifest'; setBadge(container, `Photo ${index + 1}`); setSourceLink(container, item.sourcePage, 'Source'); };
    img.onerror = () => { tryNext(); };
    img.src = item.src;
  };
  tryNext();
}
async function hydrateImage(img, record) {
  const container = img.closest('.record-image-cell') || img.closest('.record-image-slot');
  const alt = img.dataset.alt || record.display_name || record.common_name || record.slug || 'Species photo';
  const index = Number(img.dataset.imageIndex || 0);
  img.alt = alt;
  const items = await ensureGallery(record);
  const orderedItems = [...items.slice(index), ...items.slice(0, index)];
  loadCandidateSequence(img, container, orderedItems, record, index);
}
export function installLazyImages(root, getRecordBySlug) {
  const images = Array.from(root.querySelectorAll('img[data-record-image]'));
  if (!images.length) return;
  const hydrate = (img) => {
    if (img.dataset.hydrated === '1') return;
    img.dataset.hydrated = '1';
    const record = getRecordBySlug(img.dataset.slug || '');
    if (!record) return;
    if (!img.getAttribute('src') || img.getAttribute('src').startsWith('data:image/svg+xml')) {
      img.src = placeholderSvg(`${record.display_name || record.common_name || record.slug} loading photo`);
    }
    hydrateImage(img, record);
  };
  if (typeof IntersectionObserver !== 'function') { images.forEach(hydrate); return; }
  images.slice(0, 18).forEach(hydrate);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (!entry.isIntersecting) return; observer.unobserve(entry.target); hydrate(entry.target); });
  }, { rootMargin: '240px 0px' });
  images.forEach(img => { if (img.dataset.hydrated !== '1') observer.observe(img); });
}
