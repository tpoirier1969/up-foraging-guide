function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }
  return [value];
}

function uniq(values) {
  return [...new Set(ensureArray(values).filter(v => v !== undefined && v !== null && String(v).trim() !== ""))];
}

function mergeArrays(a, b) {
  return uniq([...ensureArray(a), ...ensureArray(b)]);
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

function normalizeMedicinalText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const PLACEHOLDER_MEDICINAL_PATTERNS = [
  /^primarily culinary\.?$/,
  /^mostly culinary\.?$/,
  /^mainly culinary\.?$/,
  /^primarily culinary curiosity\.?$/,
  /^minimal food-medicine importance(?: in this context)?\.?$/,
  /^mostly of curiosity or minor traditional interest rather than a major local food species\.?$/,
  /^mostly culinary, though related species are used in traditional food-medicine contexts\.?$/,
  /traditional interest still being compiled/,
  /detailed copyback is still pending/,
  /related use context/
];

const FORAGING_CLASS_MAP = new Map([
  ["fruit", "fruit"],
  ["green", "green"],
  ["flower", "flower"],
  ["root", "root"],
  ["seed", "seed"],
  ["tree product", "tree_product"],
  ["green / tubers", "green"],
  ["mushroom", "mushroom"]
]);

export function isPlaceholderMedicinalText(value) {
  const normalized = normalizeMedicinalText(value);
  return !!normalized && PLACEHOLDER_MEDICINAL_PATTERNS.some(pattern => pattern.test(normalized));
}

export function hasRealMedicinalText(value) {
  const normalized = normalizeMedicinalText(value);
  return !!normalized && !isPlaceholderMedicinalText(normalized);
}

function deriveKingdomType(record, category = "") {
  const explicit = String(record.kingdom_type || record.record_type || record.primary_type || "").trim().toLowerCase();
  if (explicit === "plant" || explicit === "mushroom") return explicit;
  return category.toLowerCase() === "mushroom" ? "mushroom" : "plant";
}

function deriveForagingClass(record, category = "") {
  const explicit = String(record.foraging_class || "").trim().toLowerCase();
  if (explicit) return explicit.replace(/\s+/g, "_");
  const mapped = FORAGING_CLASS_MAP.get(category.toLowerCase());
  return mapped || "";
}

function deriveCommonNames(record) {
  return uniq([
    ...ensureArray(record.common_names),
    ...ensureArray(record.common_name),
    ...ensureArray(record.display_name)
  ]);
}

function deriveSeasonMonths(record) {
  const explicit = uniq(record.season_months)
    .map(value => Number(value))
    .filter(value => Number.isInteger(value) && value >= 1 && value <= 12);
  if (explicit.length) return explicit;

  const legacy = uniq(record.month_numbers)
    .map(value => Number(value))
    .filter(value => Number.isInteger(value) && value >= 1 && value <= 12);
  if (legacy.length) return legacy;

  return [];
}

function deriveHabitats(record) {
  return uniq(record.habitats?.length ? record.habitats : record.habitat);
}

function deriveLookAlikes(record) {
  return uniq([
    ...ensureArray(record.look_alikes),
    ...ensureArray(record.lookalikes),
    ...ensureArray(record.confused_with)
  ]);
}

function deriveRareProfile(record) {
  if (record.rare_profile && typeof record.rare_profile === "object") {
    return {
      status: String(record.rare_profile.status || "").trim(),
      legal_status: String(record.rare_profile.legal_status || "").trim(),
      up_relevance: String(record.rare_profile.up_relevance || "").trim(),
      sensitive_location: record.rare_profile.sensitive_location === true,
      reason: String(record.rare_profile.reason || "").trim(),
      field_marks: String(record.rare_profile.field_marks || "").trim(),
      care_note: String(record.rare_profile.care_note || "").trim(),
      key_features: uniq(record.rare_profile.key_features)
    };
  }

  const profile = {
    status: String(record.status || "").trim(),
    legal_status: String(record.legal_status || "").trim(),
    up_relevance: String(record.up_relevance || "").trim(),
    sensitive_location: record.sensitive_location === true,
    reason: String(record.reason || "").trim(),
    field_marks: String(record.field_marks || "").trim(),
    care_note: String(record.care_note || "").trim(),
    key_features: uniq(record.key_features)
  };

  const hasAny = profile.status || profile.legal_status || profile.up_relevance || profile.sensitive_location
    || profile.reason || profile.field_marks || profile.care_note || profile.key_features.length;
  return hasAny ? profile : null;
}

function deriveMedicinal(record) {
  if (record.medicinal && typeof record.medicinal === "object") {
    const existing = record.medicinal;
    const actions = uniq(existing.actions);
    const bodySystems = uniq(existing.body_systems);
    const medicalTerms = uniq(existing.medical_terms);
    const claims = Array.isArray(existing.claims) ? existing.claims : [];
    const summary = String(existing.summary || "").trim();
    const hasMeaningful = existing.has_meaningful_content === true
      || !!summary
      || actions.length > 0
      || bodySystems.length > 0
      || medicalTerms.length > 0
      || claims.length > 0;

    return {
      has_meaningful_content: hasMeaningful,
      summary,
      evidence_tier: String(existing.evidence_tier || "").trim(),
      actions,
      body_systems: bodySystems,
      medical_terms: medicalTerms,
      parts_used: uniq(existing.parts_used),
      preparation_notes: String(existing.preparation_notes || "").trim(),
      warnings: String(existing.warnings || "").trim(),
      claims
    };
  }

  const actions = uniq(record.medicinalAction);
  const bodySystems = uniq(record.medicinalSystem);
  const medicalTerms = uniq(record.medicinalTerms);
  const summary = hasRealMedicinalText(record.medicinal_uses) ? String(record.medicinal_uses || "").trim() : "";
  const hasMeaningful = !!summary
    || actions.length > 0
    || bodySystems.length > 0
    || medicalTerms.length > 0
    || record.primary_use === "medicinal"
    || record.food_role === "medicinal_only";

  return {
    has_meaningful_content: hasMeaningful,
    summary,
    evidence_tier: "",
    actions,
    body_systems: bodySystems,
    medical_terms: medicalTerms,
    parts_used: [],
    preparation_notes: "",
    warnings: "",
    claims: []
  };
}

function deriveUseLinks(record) {
  if (Array.isArray(record.use_links)) return record.use_links;
  const links = Array.isArray(record.links) ? record.links : [];
  return links
    .map((item) => {
      if (typeof item === "string") {
        const url = item.trim();
        if (!url) return null;
        return {
          label: url,
          url,
          link_type: "general_reference",
          applies_to_part: "",
          source_quality: "",
          notes: ""
        };
      }
      if (!item || typeof item !== "object") return null;
      const url = String(item.url || item.href || "").trim();
      if (!url) return null;
      return {
        label: String(item.label || item.title || url).trim(),
        url,
        link_type: String(item.link_type || "general_reference").trim(),
        applies_to_part: String(item.applies_to_part || "").trim(),
        source_quality: String(item.source_quality || "").trim(),
        notes: String(item.notes || "").trim()
      };
    })
    .filter(Boolean);
}

export function getMedicinalData(record = {}) {
  return deriveMedicinal(record);
}

export function hasMeaningfulOtherUses(record = {}) {
  const text = String(record.other_uses || "").trim();
  if (!text) return false;
  const normalized = text.toLowerCase();
  if (normalized === "tea" || normalized === "non-culinary/tea") return false;
  return true;
}

function normalizedEdibilityStatus(record = {}) {
  return String(record.edibility_status || "").trim().toLowerCase();
}

function normalizedFoodRole(record = {}) {
  return String(record.food_role || "").trim().toLowerCase();
}

function normalizedNonEdibleSeverity(record = {}) {
  return String(record.non_edible_severity || "").trim().toLowerCase();
}
function isDangerSeverity(severity = "") {
  const value = String(severity || "").trim().toLowerCase();
  if (!value) return false;
  return [
    "poisonous",
    "deadly",
    "toxic",
    "not edible",
    "inedible",
    "questionable",
    "unsafe"
  ].some(token => value.includes(token));
}

function isBenignNonCulinarySeverity(severity = "") {
  const value = String(severity || "").trim().toLowerCase();
  if (!value) return false;
  return value.includes("tea") || value.includes("bitter");
}


export function hasMeaningfulFoodContent(record = {}) {
  const culinary = String(record.culinary_uses || "").trim();
  const notes = String(record.edibility_notes || record.edibility_detail || "").trim();
  const foodQuality = String(record.food_quality || "").trim();
  return !!(culinary || foodQuality || notes);
}

export function isEdibleForSection(record = {}) {
  const edibility = normalizedEdibilityStatus(record);
  const foodRole = normalizedFoodRole(record);
  const severity = normalizedNonEdibleSeverity(record);

  if (["poisonous", "deadly", "not_edible"].includes(edibility)) return false;
  if (isDangerSeverity(severity)) return false;
  if (["avoid", "emergency_only", "medicinal_only"].includes(foodRole)) return false;
  if (["edible", "edible_with_caution"].includes(edibility)) return true;
  if (foodRole === "tea_extract_only" && !hasMeaningfulFoodContent(record)) return false;
  if (isBenignNonCulinarySeverity(severity) && hasMeaningfulFoodContent(record)) return true;
  return hasMeaningfulFoodContent(record);
}

export function isCautionRecord(record = {}) {
  const edibility = normalizedEdibilityStatus(record);
  const foodRole = normalizedFoodRole(record);
  const severity = normalizedNonEdibleSeverity(record);
  const risk = String(record.look_alike_risk || "").trim().toLowerCase();

  return isDangerSeverity(severity)
    || ["not_edible", "poisonous", "deadly"].includes(edibility)
    || ["avoid", "emergency_only"].includes(foodRole)
    || ["serious", "moderate"].includes(risk);
}

function mergeOne(base, overlay) {
  const out = { ...base, ...overlay };
  const arrayKeys = [
    "months_available","links","images","look_alikes","lookalikes","habitat","observedPart","size","taste",
    "substrate","treeType","hostTree","host_filter_tokens","ring","texture","smell","staining","medicinalAction",
    "medicinalSystem","medicinalTerms","reviewReasons","review_reasons","manual_review_reasons","flowerColor","leafShape","leafArrangement",
    "stemSurface","leafPointCount","boleteGroup","boleteSubgroup","poreColor","stemFeature","affected_systems","search_aliases","underside",
    "key_features","common_names","season_months","habitats"
  ];
  for (const key of arrayKeys) {
    if (base[key] !== undefined || overlay[key] !== undefined) out[key] = mergeArrays(base[key], overlay[key]);
  }
  if (base.mushroom_profile || overlay.mushroom_profile) {
    const mergedProfile = { ...(base.mushroom_profile || {}), ...(overlay.mushroom_profile || {}) };
    if (base.mushroom_profile?.underside !== undefined || overlay.mushroom_profile?.underside !== undefined) {
      mergedProfile.underside = mergeArrays(base.mushroom_profile?.underside, overlay.mushroom_profile?.underside);
    }
    if (base.mushroom_profile?.host_filter_tokens !== undefined || overlay.mushroom_profile?.host_filter_tokens !== undefined) {
      mergedProfile.host_filter_tokens = mergeArrays(base.mushroom_profile?.host_filter_tokens, overlay.mushroom_profile?.host_filter_tokens);
    }
    out.mushroom_profile = mergedProfile;
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
    ...ensureArray(record.reviewReasons),
    ...ensureArray(record.review_reasons),
    ...ensureArray(record.manual_review_reasons)
  ]);
  const category = String(record.category || "").trim();
  const kingdom_type = deriveKingdomType(record, category);
  const record_type = kingdom_type;
  const underside = uniq([
    ...ensureArray(record.mushroom_profile?.underside_type),
    ...ensureArray(record.mushroom_profile?.underside),
    ...ensureArray(record.underside)
  ]);
  const lane = record.mushroom_profile?.lane
    || (record_type === "mushroom"
      ? (underside.some(v => String(v).toLowerCase().includes("pore"))
        ? "bolete"
        : (underside.some(v => String(v).toLowerCase().includes("gill")) ? "gilled" : "other"))
      : "");
  const hostTokens = uniq([
    ...ensureArray(record.host_filter_tokens),
    ...ensureArray(record.mushroom_profile?.host_filter_tokens)
  ]);
  const commonNames = deriveCommonNames(record);
  const rareProfile = deriveRareProfile(record);
  const medicinal = deriveMedicinal(record);

  return {
    ...record,
    common_names: commonNames,
    common_name: record.common_name || commonNames[0] || "",
    kingdom_type,
    record_type,
    species_scope: String(record.species_scope || record.entry_scope || "").trim() || "species",
    foraging_class: deriveForagingClass(record, category),
    field_identification: String(record.field_identification || record.identification_tips || record.field_marks || "").trim(),
    season_months: deriveSeasonMonths(record),
    habitats: deriveHabitats(record),
    look_alikes: deriveLookAlikes(record),
    look_alike_risk: String(record.look_alike_risk || "").trim(),
    look_alike_notes: String(record.look_alike_notes || "").trim(),
    rare_profile: rareProfile,
    overview: String(record.overview || record.short_reason || rareProfile?.reason || "").trim(),
    edibility_notes: String(record.edibility_notes || record.edibility_detail || "").trim(),
    general_notes: String(record.general_notes || "").trim(),
    notes: String(record.notes || "").trim(),
    lane,
    reviewReasons,
    review_reasons: reviewReasons,
    review_status: record.review_status || (reviewReasons.length ? "needs_review" : "ok"),
    search_aliases: uniq(record.search_aliases),
    host_filter_tokens: hostTokens,
    commonness: record.commonness || record.status || "",
    food_quality: record.food_quality || "",
    non_edible_severity: record.non_edible_severity || "",
    medicinal,
    medicinalAction: medicinal.actions,
    medicinalSystem: medicinal.body_systems,
    medicinalTerms: medicinal.medical_terms,
    use_links: deriveUseLinks(record),
    months_available: uniq(record.months_available),
    habitat: uniq(record.habitat)
  };
}

export function classifyRecord(record) {
  const category = String(record.category || "").trim();
  const type = String(record.kingdom_type || record.record_type || "").toLowerCase();
  const isMushroom = type === "mushroom" || category.toLowerCase() === "mushroom";
  const plantCategories = new Set(["Fruit","Green","Flower","Root","Tree Product","Green / Tubers","Seed"]);
  const isPlant = type === "plant" || plantCategories.has(category);
  const medicinalData = getMedicinalData(record);
  const medicinal = medicinalData.has_meaningful_content === true
    || !!String(medicinalData.summary || "").trim()
    || ensureArray(medicinalData.actions).length > 0
    || ensureArray(medicinalData.body_systems).length > 0
    || ensureArray(medicinalData.medical_terms).length > 0;

  const caution = isCautionRecord(record);
  const edible = isEdibleForSection(record);
  const otherUses = hasMeaningfulOtherUses(record);

  return { isMushroom, isPlant, medicinal, lookalike: caution, caution, edible, otherUses };
}
