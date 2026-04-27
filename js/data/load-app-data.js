import { fetchJsonFromRepo } from "../lib/fetch-json.js";
import { mergeRecordLayers, normalizeRecord } from "../lib/merge.js?v=v4.2.39-r2026-04-27-mushroom-dedup1";
import { SPECIES_PATHS, OPTIONAL_PATHS } from "./sources.js";

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

  const species = mergeRecordLayers(...speciesPayloads).map(normalizeRecord);
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
