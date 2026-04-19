import { state, rememberImageCredit, rememberImageFailure, rememberImageResult } from "../state.js";
import { resolveCommonsImages } from "./commons.js";

const STORAGE_KEY = "foraging-photo-manifest-v1";

function canUseStorage() {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function loadStoredManifest() {
  if (!canUseStorage()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveStoredManifest(manifest) {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(manifest));
  } catch {}
}

export function seedImageCacheFromStorage() {
  const manifest = loadStoredManifest();
  for (const [slug, items] of Object.entries(manifest)) {
    if (!Array.isArray(items) || !items.length) continue;
    rememberImageResult(slug, { source: 'stored-commons', items });
    for (const item of items) {
      rememberImageCredit(slug, {
        slug,
        species: item.species || slug,
        scientific_name: item.scientific_name || '',
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
  }
  return manifest;
}

export async function auditAllSpeciesPhotos(records, onProgress) {
  const manifest = loadStoredManifest();
  let completed = 0;
  for (const record of records) {
    const existing = Array.isArray(manifest[record.slug]) ? manifest[record.slug] : [];
    if (existing.length >= 3) {
      completed += 1;
      onProgress?.({ completed, total: records.length, slug: record.slug, status: 'cached' });
      continue;
    }
    try {
      const items = await resolveCommonsImages(record, 3);
      if (items.length) {
        manifest[record.slug] = items.map(item => ({ ...item, species: record.display_name || record.common_name || record.slug, scientific_name: record.scientific_name || '' }));
        saveStoredManifest(manifest);
        rememberImageResult(record.slug, { source: 'stored-commons', items: manifest[record.slug] });
        for (const item of manifest[record.slug]) {
          rememberImageCredit(record.slug, {
            slug: record.slug,
            species: item.species,
            scientific_name: item.scientific_name,
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
      } else {
        rememberImageFailure(record.slug);
      }
      completed += 1;
      onProgress?.({ completed, total: records.length, slug: record.slug, status: items.length ? `found-${items.length}` : 'none' });
    } catch {
      rememberImageFailure(record.slug);
      completed += 1;
      onProgress?.({ completed, total: records.length, slug: record.slug, status: 'error' });
    }
  }
}
