import { fetchJsonFromRepo } from "../lib/fetch-json.js";
import { mergeRecordLayers, normalizeRecord } from "../lib/merge.js";
import { SPECIES_SECTION_PATHS, OPTIONAL_PATHS } from "./sources.js";

let rareCachePromise = null;
let referencesCachePromise = null;

function asRecords(payload) {
  return Array.isArray(payload?.records) ? payload.records : [];
}

function getCoreSpeciesPaths() {
  const lazySections = new Set(["rare"]);
  return Object.entries(SPECIES_SECTION_PATHS)
    .filter(([section]) => !lazySections.has(section))
    .flatMap(([section, paths]) =>
      (Array.isArray(paths) ? paths : []).map(path => ({ section, path }))
    );
}

function getRareSpeciesPath() {
  const rarePaths = Array.isArray(SPECIES_SECTION_PATHS?.rare) ? SPECIES_SECTION_PATHS.rare : [];
  return rarePaths[0] || OPTIONAL_PATHS[1];
}

async function fetchPath(path, log, section = "") {
  const label = section ? `${section}: ${path}` : path;
  log?.(`Loading ${label}`);
  const payload = await fetchJsonFromRepo(path);
  log?.(`Loaded ${label} (${asRecords(payload).length || (Array.isArray(payload) ? payload.length : 0)} records)`);
  return payload;
}

export async function loadCoreSpecies(log) {
  const errors = [];
  const corePaths = getCoreSpeciesPaths();
  const results = await Promise.all(corePaths.map(async ({ section, path }) => {
    try {
      const payload = await fetchPath(path, log, section);
      return { section, path, payload };
    } catch (err) {
      const message = err?.message || String(err);
      errors.push({ section, path, error: message });
      log?.(`Failed ${section ? `${section}: ` : ""}${path}: ${message}`);
      return { section, path, payload: null };
    }
  }));

  const speciesPayloads = results.filter(item => item.payload).map(item => item.payload);
  if (!speciesPayloads.length) {
    const detail = errors.map(item => `${item.section ? `${item.section}: ` : ""}${item.path}: ${item.error}`).join("\n");
    throw new Error(`No species data layers loaded.\n${detail}`);
  }

  const species = mergeRecordLayers(...speciesPayloads).map(normalizeRecord);
  log?.(`Merged ${species.length} species records from ${corePaths.length} configured core source path(s)`);
  return { species, errors };
}

export function loadRareSpecies(log) {
  if (!rareCachePromise) {
    rareCachePromise = (async () => {
      const payload = await fetchPath(getRareSpeciesPath(), log, "rare");
      return Array.isArray(payload?.records) ? payload.records.map(normalizeRecord) : [];
    })();
  }
  return rareCachePromise;
}

export function loadReferences(log) {
  if (!referencesCachePromise) {
    referencesCachePromise = (async () => {
      const payload = await fetchPath(OPTIONAL_PATHS[0], log, "references");
      if (Array.isArray(payload)) return payload;
      return Array.isArray(payload?.records) ? payload.records : [];
    })();
  }
  return referencesCachePromise;
}
