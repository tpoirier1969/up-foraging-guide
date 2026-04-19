import { state, rememberImageCredit, rememberImageFailure, rememberImageResult } from "../state.js";
import { getCommonsSearchUrl, resolveCommonsImages } from "./commons.js";

function placeholderSvg(label) {
  const text = String(label || 'No image').slice(0, 42);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#eef3ef"/><rect x="40" y="40" width="1120" height="720" rx="28" ry="28" fill="#f8fbf8" stroke="#c9d5cd" stroke-width="6"/><circle cx="290" cy="300" r="70" fill="#dce9df"/><path d="M150 620l210-210 120 110 155-165 210 265H150z" fill="#dce9df"/><text x="600" y="690" text-anchor="middle" font-family="system-ui, sans-serif" font-size="46" fill="#5f6d63">${text}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function setBadge(container, text) {
  const badge = container?.querySelector('[data-image-badge]');
  if (badge) badge.textContent = text;
}

function setSourceLink(container, href, label = 'source') {
  const link = container?.querySelector('[data-image-source-link]');
  if (!link) return;
  if (href) {
    link.href = href;
    link.textContent = label;
    link.hidden = false;
  } else {
    link.hidden = true;
    link.removeAttribute('href');
  }
}

async function ensureGallery(record) {
  const cached = state.imageCache.get(record.slug);
  if (cached?.items?.length) return cached.items;
  try {
    const items = await resolveCommonsImages(record, 3);
    if (!items.length) throw new Error('No Wikimedia photos found');
    rememberImageResult(record.slug, { source: 'wikimedia', items });
    for (const item of items) {
      rememberImageCredit(record.slug, {
        slug: record.slug,
        species: record.display_name || record.common_name || record.slug,
        scientific_name: record.scientific_name || '',
        source: 'wikimedia',
        title: item.title,
        author: item.author,
        credit: item.credit,
        license: item.license,
        licenseUrl: item.licenseUrl,
        sourcePage: item.sourcePage,
        query: item.query
      });
    }
    return items;
  } catch (err) {
    rememberImageFailure(record.slug);
    return [];
  }
}

async function hydrateImage(img, record) {
  const container = img.closest('.record-image-cell') || img.closest('.record-image-slot');
  const alt = img.dataset.alt || record.display_name || record.common_name || record.slug || 'Species photo';
  const index = Number(img.dataset.imageIndex || 0);
  img.alt = alt;
  const items = await ensureGallery(record);
  const item = items[index] || items[0];
  if (item?.src) {
    img.src = item.src;
    img.dataset.resolvedSource = 'wikimedia';
    setBadge(container, index === 0 ? 'Photo 1' : `Photo ${Math.min(index + 1, items.length)}`);
    setSourceLink(container, item.sourcePage, 'Commons');
    return;
  }
  img.src = placeholderSvg(`${record.display_name || record.common_name || record.slug} needs photo`);
  img.dataset.resolvedSource = 'missing';
  setBadge(container, 'Needs photo');
  setSourceLink(container, getCommonsSearchUrl(record), 'Search Commons');
}

export function installLazyImages(root, getRecordBySlug) {
  const images = Array.from(root.querySelectorAll('img[data-record-image]'));
  if (!images.length) return;

  const hydrate = (img) => {
    if (img.dataset.hydrated === '1') return;
    img.dataset.hydrated = '1';
    const record = getRecordBySlug(img.dataset.slug || '');
    if (!record) return;
    hydrateImage(img, record);
  };

  if (typeof IntersectionObserver !== 'function') {
    images.forEach(hydrate);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      hydrate(entry.target);
    });
  }, { rootMargin: '240px 0px' });

  images.forEach(img => observer.observe(img));
}
