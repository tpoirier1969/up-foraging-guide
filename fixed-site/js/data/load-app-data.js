import { fetchJsonFromRepo } from "../lib/fetch-json.js";
import { mergeRecordLayers } from "../lib/merge.js";
import { SPECIES_PATHS, OPTIONAL_PATHS } from "./sources.js";

function asRecords(payload) {
  return Array.isArray(payload?.records) ? payload.records : [];
}

export async function loadAppData(log) {
  const speciesPayloads = [];
  const errors = [];

  for (const path of SPECIES_PATHS) {
    try {
      log(`Loading ${path}`);
      const payload = await fetchJsonFromRepo(path);
      speciesPayloads.push(payload);
      log(`Loaded ${path} (${asRecords(payload).length} records)`);
    } catch (err) {
      errors.push({ path, error: err.message });
      log(`Failed ${path}: ${err.message}`);
    }
  }

  if (!speciesPayloads.length) {
    const detail = errors.map(item => `${item.path}: ${item.error}`).join("\n");
    throw new Error(`No species data layers loaded.\n${detail}`);
  }

  let references = [];
  let rareSpecies = [];

  try {
    log(`Loading ${OPTIONAL_PATHS[0]}`);
    references = await fetchJsonFromRepo(OPTIONAL_PATHS[0]);
    if (!Array.isArray(references)) references = references?.records || [];
    log(`Loaded ${OPTIONAL_PATHS[0]} (${references.length || 0} records)`);
  } catch (err) {
    errors.push({ path: OPTIONAL_PATHS[0], error: err.message });
    log(`Failed ${OPTIONAL_PATHS[0]}: ${err.message}`);
  }

  try {
    log(`Loading ${OPTIONAL_PATHS[1]}`);
    const rarePayload = await fetchJsonFromRepo(OPTIONAL_PATHS[1]);
    rareSpecies = rarePayload?.records || [];
    log(`Loaded ${OPTIONAL_PATHS[1]} (${rareSpecies.length || 0} records)`);
  } catch (err) {
    errors.push({ path: OPTIONAL_PATHS[1], error: err.message });
    log(`Failed ${OPTIONAL_PATHS[1]}: ${err.message}`);
  }

  const species = mergeRecordLayers(...speciesPayloads);
  log(`Merged ${species.length} species records`);

  return { species, rareSpecies, references, errors };
}
