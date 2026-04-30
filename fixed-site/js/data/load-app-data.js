import { fetchJsonFromRepo } from "../lib/fetch-json.js";
import { mergeRecordLayers, normalizeRecord } from "../lib/merge.js?v=v4.2.89-r2026-04-30-image-distinctness-guard1";
import { SPECIES_PATHS, PHOTO_PATCH_PATHS, OPTIONAL_PATHS } from "./sources.js?v=v4.2.89-r2026-04-30-image-distinctness-guard1";

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

function aliasValuesForRecord(record = {}) {
  return [
    ...(Array.isArray(record.former_slugs) ? record.former_slugs : []),
    ...(Array.isArray(record.aliases) ? record.aliases : []),
    ...(Array.isArray(record.common_names) ? record.common_names : [])
  ]
    .map((value) => String(value || "").trim())
    .filter((value) => value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value));
}

function hasUsableImageFields(record = {}) {
  const structured = Array.isArray(record.images_structured) ? record.images_structured : [];
  if (structured.some((item) => item && (item.thumb || item.detail || item.full))) return true;
  if (String(record.list_thumbnail || "").trim()) return true;
  if (Array.isArray(record.detail_images) && record.detail_images.some(Boolean)) return true;
  if (Array.isArray(record.enlarge_images) && record.enlarge_images.some(Boolean)) return true;
  if (Array.isArray(record.images) && record.images.some((item) => {
    if (typeof item === "string") return item.trim();
    return item && (item.thumb || item.detail || item.full || item.src);
  })) return true;
  return false;
}


function canonicalImageUrl(url = "") {
  const raw = String(url || "").trim();
  if (!raw) return "";
  if (raw.startsWith("data:image/")) return "__data_image__";
  const noQuery = raw.split("?")[0];
  return noQuery
    .replace("/thumb/", "/")
    .replace(/\/\d+px-/, "/");
}

function canonicalStructuredImageKey(image = {}) {
  if (!image || typeof image !== "object") return "";
  return canonicalImageUrl(image.full || image.detail || image.thumb || image.src || "") || String(image.source_page || "").trim();
}

function dedupeStrings(values = [], seen = new Set(), { stripPlaceholders = false } = {}) {
  const out = [];
  for (const value of Array.isArray(values) ? values : []) {
    if (!value) continue;
    const text = String(value || "").trim();
    if (!text) continue;
    if (stripPlaceholders && text.startsWith("data:image/")) continue;
    const key = canonicalImageUrl(text) || text;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
}

function dedupeImageObjects(values = [], seen = new Set(), { stripPlaceholders = false } = {}) {
  const out = [];
  for (const value of Array.isArray(values) ? values : []) {
    if (!value) continue;
    if (typeof value === "string") {
      const deduped = dedupeStrings([value], seen, { stripPlaceholders });
      if (deduped.length) out.push(...deduped);
      continue;
    }
    if (typeof value !== "object") continue;
    const key = canonicalStructuredImageKey(value);
    const sourceString = [value.full, value.detail, value.thumb, value.src].find(Boolean) || "";
    if (stripPlaceholders && String(sourceString).startsWith("data:image/")) continue;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

function normalizeLoadedRecordImageCoverage(record = {}) {
  const next = { ...record };
  const structured = dedupeImageObjects(next.images_structured || [], new Set(), { stripPlaceholders: true });
  const structuredSeen = new Set(structured.map((item) => canonicalStructuredImageKey(item)).filter(Boolean));
  next.images_structured = structured;

  // If structured images exist, treat them as canonical and remove duplicate fallbacks
  // so the UI does not show the same photo multiple times just because it is stored
  // in thumb/detail/full/fallback arrays.
  const stripFallbackPlaceholders = structuredSeen.size > 0;
  next.detail_images = dedupeStrings(next.detail_images || [], new Set(structuredSeen), { stripPlaceholders: stripFallbackPlaceholders });
  next.enlarge_images = dedupeStrings(next.enlarge_images || [], new Set(structuredSeen), { stripPlaceholders: stripFallbackPlaceholders });
  next.images = dedupeImageObjects(next.images || [], new Set(structuredSeen), { stripPlaceholders: stripFallbackPlaceholders });

  if (structured.length) {
    next.list_thumbnail = String(next.list_thumbnail || structured[0]?.thumb || structured[0]?.detail || structured[0]?.full || "").trim() || null;
  }

  const distinctKeys = new Set();
  for (const image of structured) {
    const key = canonicalStructuredImageKey(image);
    if (key) distinctKeys.add(key);
  }
  for (const value of next.detail_images || []) {
    const key = canonicalImageUrl(value);
    if (key && key !== "__data_image__") distinctKeys.add(key);
  }
  for (const value of next.enlarge_images || []) {
    const key = canonicalImageUrl(value);
    if (key && key !== "__data_image__") distinctKeys.add(key);
  }
  for (const value of next.images || []) {
    const key = typeof value === "string" ? canonicalImageUrl(value) : canonicalStructuredImageKey(value);
    if (key && key !== "__data_image__") distinctKeys.add(key);
  }
  next.image_distinct_count = distinctKeys.size;
  return next;
}

const IMAGE_PATCH_FIELDS = new Set([
  "images_structured",
  "list_thumbnail",
  "detail_images",
  "enlarge_images",
  "images",
  "photo_credits",
  "image_audit_status",
  "image_review_status",
  "image_review_reasons"
]);

const IMAGE_REVIEW_PATCH_FIELDS = new Set([
  "needs_review",
  "review_status",
  "review_reasons",
  "reviewReasons",
  "review_note",
  "review_notes"
]);

function sanitizePhotoPatchForRecord(baseRecord = {}, patch = {}) {
  const patchHasUsableImages = hasUsableImageFields(patch);
  const baseHasUsableImages = hasUsableImageFields(baseRecord);
  const clean = { ...patch };

  // Optional photo patch files are now fill-only for images.
  // They may add image coverage to records that have no usable base images,
  // but they must never replace newer, structured base-record image fields.
  // This prevents older Commons redirect/FilePath patch URLs from clobbering
  // newer direct upload.wikimedia.org image URLs.
  if (baseHasUsableImages) {
    for (const field of IMAGE_PATCH_FIELDS) delete clean[field];
    for (const field of IMAGE_REVIEW_PATCH_FIELDS) delete clean[field];
    clean._image_patch_skipped = patchHasUsableImages ? "base_record_images_preserved" : "empty_patch_ignored";
  }

  for (const field of ["images_structured", "detail_images", "enlarge_images", "images", "photo_credits", "image_review_reasons", "review_reasons", "reviewReasons"]) {
    if (Array.isArray(clean[field]) && clean[field].length === 0 && baseRecord[field] !== undefined) {
      delete clean[field];
    }
  }

  for (const field of ["list_thumbnail", "image_audit_status", "image_review_status", "review_note", "review_notes"]) {
    if (clean[field] === "" && baseRecord[field]) delete clean[field];
  }

  return clean;
}

function applyRecordPatches(baseRecords = [], patchPayloads = [], log) {
  const bySlug = new Map(baseRecords.map((record) => [record?.slug, record]).filter(([slug]) => slug));
  const aliasToSlug = new Map();

  for (const record of baseRecords || []) {
    if (!record?.slug) continue;
    for (const alias of aliasValuesForRecord(record)) {
      if (!bySlug.has(alias) && !aliasToSlug.has(alias)) {
        aliasToSlug.set(alias, record.slug);
      }
    }
  }

  let applied = 0;
  let remapped = 0;
  let ignored = 0;
  let protectedImageRecords = 0;
  let imagePatchFillOnlySkips = 0;

  for (const payload of patchPayloads || []) {
    for (const patch of asRecords(payload)) {
      const slug = patch?.slug;
      const targetSlug = bySlug.has(slug) ? slug : aliasToSlug.get(slug);
      if (!slug || !targetSlug || !bySlug.has(targetSlug)) {
        ignored += 1;
        continue;
      }
      const current = bySlug.get(targetSlug);
      const normalizedPatch = targetSlug === slug ? patch : { ...patch, former_patch_slug: slug };
      const sanitizedPatch = sanitizePhotoPatchForRecord(current, normalizedPatch);
      if (hasUsableImageFields(current)) {
        protectedImageRecords += 1;
        if (hasUsableImageFields(normalizedPatch)) imagePatchFillOnlySkips += 1;
      }
      bySlug.set(targetSlug, { ...current, ...sanitizedPatch, slug: targetSlug });
      applied += 1;
      if (targetSlug !== slug) remapped += 1;
    }
  }

  if (patchPayloads?.length) {
    log?.(`Applied ${applied} photo patch records; remapped ${remapped} alias patch records; protected ${protectedImageRecords} existing image records from photo patch overwrite; skipped ${imagePatchFillOnlySkips} older image-bearing patch overrides; ignored ${ignored} unmatched photo patch records`);
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
  const species = patchedSpecies.map(normalizeRecord).map(normalizeLoadedRecordImageCoverage);
  log?.(`Merged ${species.length} species records`);
  return { species, errors };
}

export function loadRareSpecies(log) {
  if (!rareCachePromise) {
    rareCachePromise = (async () => {
      const payload = await fetchPath(OPTIONAL_PATHS[1], log);
      return Array.isArray(payload?.records) ? payload.records.map(normalizeRecord).map(normalizeLoadedRecordImageCoverage) : [];
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
