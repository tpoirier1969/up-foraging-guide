function uniq(values) {
  return [...new Set((values || []).filter(v => v !== undefined && v !== null && String(v).trim() !== ""))];
}

function mergeArrays(a, b) {
  return uniq([...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])]);
}

function slugifyFallback(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function derivedName(record) {
  return record.display_name || record.common_name || record.title || record.name || slugifyFallback(record.slug).replace(/-/g, " ");
}

function mergeOne(base, overlay) {
  const out = { ...base, ...overlay };
  const arrayKeys = [
    "months_available","links","images","look_alikes","lookalikes","habitat","observedPart","size","taste",
    "substrate","treeType","hostTree","host_filter_tokens","ring","texture","smell","staining","medicinalAction",
    "medicinalSystem","medicinalTerms","reviewReasons","review_reasons","manual_review_reasons","flowerColor","leafShape","leafArrangement",
    "stemSurface","leafPointCount","boleteGroup","boleteSubgroup","poreColor","stemFeature","affected_systems","search_aliases"
  ];
  for (const key of arrayKeys) {
    if (base[key] || overlay[key]) out[key] = mergeArrays(base[key], overlay[key]);
  }
  if (base.mushroom_profile || overlay.mushroom_profile) {
    out.mushroom_profile = { ...(base.mushroom_profile || {}), ...(overlay.mushroom_profile || {}) };
  }
  if (base.bolete_profile || overlay.bolete_profile) {
    out.bolete_profile = { ...(base.bolete_profile || {}), ...(overlay.bolete_profile || {}) };
  }
  if (!out.slug) {
    out.slug = slugifyFallback(out.display_name || out.common_name || out.scientific_name || out.title || out.name);
  }
  if (!out.display_name) {
    out.display_name = derivedName(out)
      .split(" ")
      .map(word => word ? word[0].toUpperCase() + word.slice(1) : "")
      .join(" ");
  }
  return out;
}

export function mergeRecordLayers(...payloads) {
  const bySlug = new Map();
  for (const payload of payloads) {
    const records = Array.isArray(payload?.records) ? payload.records : [];
    for (const record of records) {
      const slug = record.slug || slugifyFallback(record.display_name || record.common_name || record.scientific_name);
      const existing = bySlug.get(slug) || {};
      bySlug.set(slug, mergeOne(existing, { ...record, slug }));
    }
  }
  return [...bySlug.values()].sort((a, b) => String(a.display_name || "").localeCompare(String(b.display_name || "")));
}

export function normalizeRecord(record) {
  const reviewReasons = uniq([
    ...(record.reviewReasons || []),
    ...(record.review_reasons || []),
    ...(record.manual_review_reasons || [])
  ]);
  const category = String(record.category || "").trim();
  const record_type = record.record_type || record.primary_type || (category.toLowerCase() === 'mushroom' ? 'mushroom' : 'plant');
  const lane = record.mushroom_profile?.lane
    || (record_type === 'mushroom'
      ? ((record.mushroom_profile?.underside || record.underside || []).some(v => String(v).toLowerCase().includes('pore'))
        ? 'bolete'
        : ((record.mushroom_profile?.underside || record.underside || []).some(v => String(v).toLowerCase().includes('gill')) ? 'gilled' : 'other'))
      : '');
  const hostTokens = uniq([
    ...(record.host_filter_tokens || []),
    ...(record.mushroom_profile?.host_filter_tokens || [])
  ]);
  return {
    ...record,
    general_notes: String(record.general_notes || '').trim(),
    notes: String(record.notes || '').trim(),
    record_type,
    lane,
    reviewReasons,
    review_status: record.review_status || (reviewReasons.length ? 'needs_review' : 'ok'),
    search_aliases: uniq(record.search_aliases || []),
    host_filter_tokens: hostTokens,
    commonness: record.commonness || record.status || '',
    food_quality: record.food_quality || '',
    non_edible_severity: record.non_edible_severity || '',
    medicinalAction: uniq(record.medicinalAction || []),
    medicinalSystem: uniq(record.medicinalSystem || []),
    medicinalTerms: uniq(record.medicinalTerms || []),
    months_available: uniq(record.months_available || []),
    habitat: uniq(record.habitat || [])
  };
}

export function classifyRecord(record) {
  const category = String(record.category || '').trim();
  const isMushroom = String(record.record_type || '').toLowerCase() === 'mushroom' || category.toLowerCase() === 'mushroom';
  const plantCategories = new Set(["Fruit","Green","Flower","Root","Tree Product","Green / Tubers"]);
  const isPlant = String(record.record_type || '').toLowerCase() === 'plant' || plantCategories.has(category);
  const medicinal = !!String(record.medicinal_uses || '').trim()
    || (record.medicinalAction || []).length > 0
    || record.primary_use === 'medicinal'
    || record.food_role === 'medicinal_only';
  const lookalike = !!String(record.non_edible_severity || '').trim()
    || ["avoid","emergency_only","tea_extract_only","medicinal_only"].includes(String(record.food_role || '').trim())
    || !!String(record.other_uses || '').trim();
  return { isMushroom, isPlant, medicinal, lookalike };
}
