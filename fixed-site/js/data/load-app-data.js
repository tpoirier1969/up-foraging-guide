import { fetchJsonFromRepo } from "../lib/fetch-json.js";
import { mergeRecordLayers, normalizeRecord } from "../lib/merge.js?v=v4.3.41-r2026-05-13-spring-morels-canonical1";

const APP_VERSION = new URL(import.meta.url).searchParams.get("v") || "v4.3.41-r2026-05-13-spring-morels-canonical1";
let sourcesPromise = null;
let rareCachePromise = null;
let referencesCachePromise = null;
export let lastSourceLoadReport = null;

function versionedPath(path) {
  return path.includes("?") ? path : `${path}?v=${encodeURIComponent(APP_VERSION)}`;
}

async function loadSourcesModule() {
  if (!sourcesPromise) {
    sourcesPromise = import(versionedPath("./sources.js"));
  }
  return sourcesPromise;
}

function asRecords(payload) {
  return Array.isArray(payload?.records) ? payload.records : (Array.isArray(payload) ? payload : []);
}

async function fetchPath(path, log) {
  log?.(`Loading ${path}`);
  const payload = await fetchJsonFromRepo(path);
  const count = asRecords(payload).length;
  log?.(`Loaded ${path} (${count} records)`);
  return payload;
}

function recordSourceSummary(path, payload, ok = true, error = "") {
  return {
    path,
    ok,
    error,
    records: ok ? asRecords(payload).length : 0,
    metadata: ok && payload && typeof payload === "object" && !Array.isArray(payload) ? (payload.metadata || null) : null
  };
}

function canonicalImageUrl(url = "") {
  const raw = String(url || "").trim();
  if (!raw) return "";
  if (raw.startsWith("data:image/")) return "__data_image__";
  const noQuery = raw.split("?")[0];
  return noQuery.replace("/thumb/", "/").replace(/\/\d+px-/, "/");
}

function canonicalStructuredImageKey(image = {}) {
  if (!image || typeof image !== "object") return "";
  return canonicalImageUrl(image.full || image.detail || image.thumb || image.src || "") || String(image.sourcePage || image.source_page || "").trim();
}

function normalizeLoadedRecordImageCoverage(record = {}) {
  const next = { ...record };
  const distinctKeys = new Set();
  for (const image of Array.isArray(next.images_structured) ? next.images_structured : []) {
    const key = canonicalStructuredImageKey(image);
    if (key && key !== "__data_image__") distinctKeys.add(key);
  }
  for (const value of Array.isArray(next.detail_images) ? next.detail_images : []) {
    const key = canonicalImageUrl(value);
    if (key && key !== "__data_image__") distinctKeys.add(key);
  }
  for (const value of Array.isArray(next.enlarge_images) ? next.enlarge_images : []) {
    const key = canonicalImageUrl(value);
    if (key && key !== "__data_image__") distinctKeys.add(key);
  }
  for (const value of Array.isArray(next.images) ? next.images : []) {
    const key = typeof value === "string" ? canonicalImageUrl(value) : canonicalStructuredImageKey(value);
    if (key && key !== "__data_image__") distinctKeys.add(key);
  }
  next.image_distinct_count = distinctKeys.size;
  return next;
}

async function fetchMany(paths = [], log) {
  const errors = [];
  const reports = [];
  const results = await Promise.all(paths.map(async (path) => {
    try {
      const payload = await fetchPath(path, log);
      reports.push(recordSourceSummary(path, payload, true));
      return { path, payload };
    } catch (err) {
      const message = err?.message || String(err);
      errors.push({ path, error: message });
      reports.push(recordSourceSummary(path, null, false, message));
      log?.(`Failed ${path}: ${message}`);
      return { path, payload: null };
    }
  }));
  return { results, errors, reports };
}

export async function loadCoreSpecies(log) {
  const { SPECIES_PATHS = [] } = await loadSourcesModule();
  const { results, errors, reports } = await fetchMany(SPECIES_PATHS, log);
  const speciesPayloads = results.filter(item => item.payload).map(item => item.payload);

  if (!speciesPayloads.length) {
    const detail = errors.map(item => `${item.path}: ${item.error}`).join("\n");
    throw new Error(`No species data layers loaded.\n${detail}`);
  }

  const mergedSpecies = mergeRecordLayers(...speciesPayloads);
  const species = mergedSpecies.map(normalizeRecord).map(normalizeLoadedRecordImageCoverage);
  const slugs = new Set(species.map(record => record.slug).filter(Boolean));
  lastSourceLoadReport = {
    appVersion: APP_VERSION,
    generatedAt: new Date().toISOString(),
    sourceCount: SPECIES_PATHS.length,
    mergedSpeciesCount: species.length,
    reports,
    keyRecords: {
      "white-yellow-morels": slugs.has("white-yellow-morels"),
      "burn-site-morel": slugs.has("burn-site-morel"),
      "galerina": slugs.has("galerina"),
      "jack-o-lantern": slugs.has("jack-o-lantern"),
      "false-morel": slugs.has("false-morel")
    }
  };
  log?.(`Merged ${species.length} species records from ${SPECIES_PATHS.length} active source paths`);
  return { species, errors, sourceReport: lastSourceLoadReport };
}

export async function loadRareSpecies(log) {
  if (!rareCachePromise) {
    rareCachePromise = (async () => {
      const { OPTIONAL_PATHS = [] } = await loadSourcesModule();
      const path = OPTIONAL_PATHS[1];
      if (!path) return [];
      const payload = await fetchPath(path, log);
      return asRecords(payload).map(normalizeRecord).map(normalizeLoadedRecordImageCoverage);
    })();
  }
  return rareCachePromise;
}

export async function loadReferences(log) {
  if (!referencesCachePromise) {
    referencesCachePromise = (async () => {
      const { OPTIONAL_PATHS = [] } = await loadSourcesModule();
      const path = OPTIONAL_PATHS[0];
      if (!path) return [];
      const payload = await fetchPath(path, log);
      return asRecords(payload);
    })();
  }
  return referencesCachePromise;
}
