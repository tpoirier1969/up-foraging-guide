import { COMMONS_API, FETCH_TIMEOUT_MS, IMAGE_SEARCH_LIMIT, WIKIPEDIA_API } from "../config.js";

function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`Timeout after ${ms}ms: ${label}`)), ms);
    promise.then(v => { clearTimeout(id); resolve(v); }, e => { clearTimeout(id); reject(e); });
  });
}

function stripHtml(value) {
  return String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function cleanName(value) {
  return String(value || "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/(?:spp?|group|complex|allies|entry|field|concept|var|cf|aff|type)\.?/gi, " ")
    .replace(/[|/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function basenameHint(record) {
  const first = Array.isArray(record?.images) ? record.images[0] : "";
  const name = String(first || "").split('/').pop() || "";
  return name
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/-[a-f0-9]{6,}$/i, "")
    .replace(/-v\d+(?:-\d+)?$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildCommonsQueries(record) {
  const queries = [];
  const push = (value) => {
    const cleaned = cleanName(value);
    if (!cleaned) return;
    if (!queries.includes(cleaned)) queries.push(cleaned);
  };
  push(record?.scientific_name);
  push(record?.display_name);
  push(record?.common_name);
  push(basenameHint(record));
  return queries.slice(0, 5);
}

const BAD_TERMS = [
  'illustration', 'drawing', 'sketch', 'diagram', 'painting', 'watercolor', 'icon', 'logo', 'seal',
  'coat of arms', 'map', 'herbarium', 'poster', 'flag', 'symbol', 'avatar', 'cartoon', 'engraving',
  'line art', 'line drawing', 'pencil'
];

function hasBadArtWords(text) {
  const hay = String(text || '').toLowerCase();
  return BAD_TERMS.some(term => hay.includes(term));
}

function tokenize(text) {
  return String(text || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function scoreCandidate(page, queries, description = '') {
  const title = String(page?.title || '').toLowerCase();
  const desc = String(description || '').toLowerCase();
  let score = 0;
  for (const q of queries) {
    const query = q.toLowerCase();
    if (!query) continue;
    if (title.includes(query)) score += 8;
    if (desc.includes(query)) score += 4;
    for (const token of tokenize(query)) {
      if (title.includes(token)) score += 2;
      if (desc.includes(token)) score += 1;
    }
  }
  if (/(photo|photograph|photographed)/.test(desc)) score += 3;
  if (hasBadArtWords(title) || hasBadArtWords(desc)) score -= 20;
  return score;
}

async function wikipediaSearch(query) {
  const url = new URL(WIKIPEDIA_API);
  url.searchParams.set('action', 'query');
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatversion', '2');
  url.searchParams.set('origin', '*');
  url.searchParams.set('generator', 'search');
  url.searchParams.set('gsrsearch', query);
  url.searchParams.set('gsrlimit', String(Math.min(IMAGE_SEARCH_LIMIT, 6)));
  url.searchParams.set('prop', 'pageimages|info|description');
  url.searchParams.set('piprop', 'thumbnail|name|original');
  url.searchParams.set('pithumbsize', '1200');
  url.searchParams.set('inprop', 'url');

  const res = await withTimeout(fetch(url.toString(), { cache: 'no-store' }), FETCH_TIMEOUT_MS, query);
  if (!res.ok) throw new Error(`Wikipedia search failed: HTTP ${res.status}`);
  const payload = await res.json();
  return Array.isArray(payload?.query?.pages) ? payload.query.pages : [];
}

function normalizeWikiCandidate(page, query, queries) {
  const src = page?.thumbnail?.source || page?.original?.source || '';
  const description = stripHtml(page?.description || '');
  return {
    source: 'wikipedia',
    src,
    fullImageUrl: page?.original?.source || src,
    sourcePage: page?.fullurl || '',
    title: String(page?.title || ''),
    author: '',
    credit: '',
    license: 'Wikipedia page image',
    licenseUrl: '',
    description,
    mime: '',
    query,
    score: scoreCandidate(page, queries, description) + 5
  };
}

function mediaSearchQuery(query) {
  return `${query} filemime:bitmap -illustration -drawing -sketch -diagram -painting -logo -icon -coat -arms -map -herbarium`;
}

async function mediaWikiSearch(query) {
  const url = new URL(COMMONS_API);
  url.searchParams.set('action', 'query');
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatversion', '2');
  url.searchParams.set('origin', '*');
  url.searchParams.set('generator', 'search');
  url.searchParams.set('gsrnamespace', '6');
  url.searchParams.set('gsrsearch', mediaSearchQuery(query));
  url.searchParams.set('gsrlimit', String(IMAGE_SEARCH_LIMIT));
  url.searchParams.set('prop', 'imageinfo|info');
  url.searchParams.set('iiprop', 'url|extmetadata|mime');
  url.searchParams.set('iiurlwidth', '1200');
  url.searchParams.set('inprop', 'url');

  const res = await withTimeout(fetch(url.toString(), { cache: 'no-store' }), FETCH_TIMEOUT_MS, query);
  if (!res.ok) throw new Error(`Commons search failed: HTTP ${res.status}`);
  const payload = await res.json();
  return Array.isArray(payload?.query?.pages) ? payload.query.pages : [];
}

function normalizeCommonsCandidate(page, query, queries) {
  const info = Array.isArray(page?.imageinfo) ? page.imageinfo[0] || {} : {};
  const meta = info.extmetadata || {};
  const title = String(page?.title || '').replace(/^File:/i, '');
  const description = stripHtml(meta.ImageDescription?.value || meta.ObjectName?.value || '');
  const mime = String(info.mime || '').toLowerCase();
  return {
    source: 'wikimedia',
    src: info.thumburl || info.url || '',
    fullImageUrl: info.url || '',
    sourcePage: page.fullurl || '',
    title,
    author: stripHtml(meta.Artist?.value || meta.Credit?.value || ''),
    credit: stripHtml(meta.Credit?.value || ''),
    license: stripHtml(meta.LicenseShortName?.value || meta.License?.value || ''),
    licenseUrl: stripHtml(meta.LicenseUrl?.value || ''),
    description,
    mime,
    query,
    score: scoreCandidate(page, queries, description)
  };
}

function isAcceptablePhoto(candidate) {
  if (!candidate?.src) return false;
  if (candidate.mime && !/^image\/(jpeg|jpg|png|webp|gif)$/i.test(candidate.mime)) return false;
  if (hasBadArtWords(candidate.title) || hasBadArtWords(candidate.description)) return false;
  return true;
}

export async function resolveCommonsImages(record, count = 3) {
  const queries = buildCommonsQueries(record);
  const seen = new Set();
  const candidates = [];

  for (const query of queries) {
    try {
      const wikiPages = await wikipediaSearch(query);
      for (const page of wikiPages) {
        const candidate = normalizeWikiCandidate(page, query, queries);
        const key = candidate.title || candidate.sourcePage || candidate.src;
        if (!key || seen.has(key) || !isAcceptablePhoto(candidate)) continue;
        seen.add(key);
        candidates.push(candidate);
      }
    } catch {}
  }

  if (candidates.length < count) {
    for (const query of queries) {
      try {
        const pages = await mediaWikiSearch(query);
        for (const page of pages) {
          const candidate = normalizeCommonsCandidate(page, query, queries);
          const key = candidate.title || candidate.sourcePage || candidate.src;
          if (!key || seen.has(key) || !isAcceptablePhoto(candidate)) continue;
          seen.add(key);
          candidates.push(candidate);
        }
      } catch {}
    }
  }

  candidates.sort((a, b) => b.score - a.score || String(a.title).localeCompare(String(b.title)));
  return candidates.slice(0, count);
}

export async function resolveCommonsImage(record) {
  const items = await resolveCommonsImages(record, 1);
  return items[0] || null;
}

export function getCommonsSearchUrl(record) {
  const query = buildCommonsQueries(record)[0] || record?.slug || 'Upper Michigan foraging';
  const url = new URL('https://commons.wikimedia.org/w/index.php');
  url.searchParams.set('search', query);
  url.searchParams.set('title', 'Special:MediaSearch');
  url.searchParams.set('type', 'image');
  return url.toString();
}
