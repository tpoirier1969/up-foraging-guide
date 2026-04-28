import { fetchJsonFromRepo } from "../lib/fetch-json.js";
import { mergeRecordLayers, normalizeRecord } from "../lib/merge.js?v=v4.2.67-r2026-04-28-mushroom-photo-batchpack5-addendum";
import { SPECIES_PATHS, PHOTO_PATCH_PATHS, OPTIONAL_PATHS } from "./sources.js?v=v4.2.67-r2026-04-28-mushroom-photo-batchpack5-addendum";

let rareCachePromise = null;
let referencesCachePromise = null;

function asRecords(payload) {
  return Array.isArray(payload?.records) ? payload.records : [];
}

async function fetchPath(path, log) {
  log?.(`Loading ${path}`);
  const payload = await fetchJsonFromRepo(path);
  log?.(`Loaded ${path} (${asRecords(payload).length || (Array.isArray(payload) ? payload.length : 0)} records)`);
  return payload;
}

async function fetchOptionalPatchPaths(paths = [], log) {
  const payloads = [];
  for (const path of paths || []) {
    try {
      payloads.push(await fetchPath(path, log));
    } catch (err) {
      log?.(`Skipped optional photo patch ${path}: ${err?.message || String(err)}`);
    }
  }
  return payloads;
}

function applyRecordPatches(baseRecords = [], patchPayloads = [], log) {
  const bySlug = new Map(baseRecords.map((record) => [record?.slug, record]).filter(([slug]) => slug));
  let applied = 0;
  let ignored = 0;

  for (const payload of patchPayloads || []) {
    for (const patch of asRecords(payload)) {
      const slug = patch?.slug;
      if (!slug || !bySlug.has(slug)) {
        ignored += 1;
        continue;
      }
      bySlug.set(slug, { ...bySlug.get(slug), ...patch, slug });
      applied += 1;
    }
  }

  if (patchPayloads?.length) {
    log?.(`Applied ${applied} photo patch records; ignored ${ignored} unmatched photo patch records`);
  }

  return baseRecords.map((record) => bySlug.get(record.slug) || record);
}

export async function loadCoreSpecies(log) {
  const errors = [];
  const results = await Promise.all(SPECIES_PATHS.map(async (path) => {
    try {
      const payload = await fetchPath(path, log);
      return { path, payload };
    } catch (err) {
      const message = err?.message || String(err);
      errors.push({ path, error: message });
      log?.(`Failed ${path}: ${message}`);
      return { path, payload: null };
    }
  }));

  const speciesPayloads = results.filter(item => item.payload).map(item => item.payload);
  if (!speciesPayloads.length) {
    const detail = errors.map(item => `${item.path}: ${item.error}`).join("\n");
    throw new Error(`No species data layers loaded.\n${detail}`);
  }

  const mergedSpecies = mergeRecordLayers(...speciesPayloads);
  const patchPayloads = await fetchOptionalPatchPaths(PHOTO_PATCH_PATHS, log);
  const patchedSpecies = applyRecordPatches(mergedSpecies, patchPayloads, log);
  const species = patchedSpecies.map(normalizeRecord);
  log?.(`Merged ${species.length} species records`);
  return { species, errors };
}

export function loadRareSpecies(log) {
  if (!rareCachePromise) {
    rareCachePromise = (async () => {
      const payload = await fetchPath(OPTIONAL_PATHS[1], log);
      return Array.isArray(payload?.records) ? payload.records.map(normalizeRecord) : [];
    })();
  }
  return rareCachePromise;
}

export function loadReferences(log) {
  if (!referencesCachePromise) {
    referencesCachePromise = (async () => {
      const payload = await fetchPath(OPTIONAL_PATHS[0], log);
      if (Array.isArray(payload)) return payload;
      return Array.isArray(payload?.records) ? payload.records : [];
    })();
  }
  return referencesCachePromise;
}
