import { fetchJsonFromRepo } from "../lib/fetch-json.js";
import { mergeRecordLayers } from "../lib/merge.js";
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
  const speciesPayloads = [];

  for (const path of SPECIES_PATHS) {
    try {
      const payload = await fetchPath(path, log);
      speciesPayloads.push(payload);
    } catch (err) {
      const message = err?.message || String(err);
      errors.push({ path, error: message });
      log?.(`Failed ${path}: ${message}`);
    }
  }

  if (!speciesPayloads.length) {
    const detail = errors.map(item => `${item.path}: ${item.error}`).join("\n");
    throw new Error(`No species data layers loaded.\n${detail}`);
  }

  const species = mergeRecordLayers(...speciesPayloads);
  log?.(`Merged ${species.length} species records`);
  return { species, errors };
}

export function loadRareSpecies(log) {
  if (!rareCachePromise) {
    rareCachePromise = (async () => {
      const payload = await fetchPath(OPTIONAL_PATHS[1], log);
      return Array.isArray(payload?.records) ? payload.records : [];
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

export async function loadAppData(log) {
  const core = await loadCoreSpecies(log);
  const errors = [...(core.errors || [])];

  let references = [];
  let rareSpecies = [];

  try {
    references = await loadReferences(log);
  } catch (err) {
    const message = err?.message || String(err);
    errors.push({ path: OPTIONAL_PATHS[0], error: message });
    log?.(`Failed ${OPTIONAL_PATHS[0]}: ${message}`);
  }

  try {
    rareSpecies = await loadRareSpecies(log);
  } catch (err) {
    const message = err?.message || String(err);
    errors.push({ path: OPTIONAL_PATHS[1], error: message });
    log?.(`Failed ${OPTIONAL_PATHS[1]}: ${message}`);
  }

  return {
    species: core.species || [],
    rareSpecies,
    references,
    errors
  };
}
