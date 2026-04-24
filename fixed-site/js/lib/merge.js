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

const CURATION_NOTE_PATTERNS = [
  /original app (?:species|mushroom|plant)? ?(?:entry )?restored/i,
  /restored into the standalone/i,
  /standalone(?: modular)? build/i,
  /detailed .* still (?:being copied back|need(?:s)? copied back|pending)/i,
  /consolidated to one .* entry/i,
  /merged under .* current build/i,
  /seed entry only/i,
  /minimal species seed/i,
  /species seed added/i,
  /added during .* audit/i,
  /added during .* pass/i,
  /added from .* audit/i,
  /added in the .* pass/i,
  /added as .* clean app/i,
  /added as .* species page/i,
  /added as the true .* record/i,
  /audit pass/i,
  /audited batch/i,
  /baseline audit/i,
  /clean app/i,
  /copyback .* pending/i,
  /current build/i,
  /needs image coverage/i,
  /needs source links/i,
  /needs species-level/i,
  /still needs species-level/i,
  /still need(?:s)? (?:a )?later review/i,
  /still need(?:s)? review/i,
  /still need(?:s)? fuller/i,
  /details, seasonality, and images still need/i,
  /fuller id notes, sources, and images still need/i,
  /core field-guide traits are now scaffolded/i,
  /scaffolded for sorting/i,
  /placeholder/i,
  /review text/i,
  /being copied back/i,
  /true .* page rather than/i,
  /baseline .* commonness, food quality/i,
  /migration/i,
  /sidecar/i,
  /copyback/i,
  /curation/i,
  /build-process/i,
  /admin/i
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

const OTHER_USE_KEYWORDS = /\b(artist|art|draw|drawing|scratch|scratched|tinder|fire ?starter|kindling|dye|dyestuff|pigment|ink|fiber|fibre|cordage|rope|twine|basket|weav|craft|tool|utility|polish|stain|smudge|resin|pitch|glue|adhesive|soap|container|whistle|broom|brush|mat|thatch|fungus paper|amadou)\b/i;

const INGESTIBLE_USE_KEYWORDS = /\b(tea|infusion|decoction|beverage|drink|drunk|steep|steeped|brew|brewed|broth|soup|syrup|sap|tincture|extract|edible|eat|eaten|food|culinary|ingest|ingested|consume|consumed|chew|chewed)\b/i;
const DIRECT_INGESTION_DANGER = /\b(do not|don't|never|avoid|unsafe|toxic|poisonous|poison|deadly|fatal|dangerous)\b[^.!?]{0,60}\b(ingest|consume|eat|drink|tea|infusion|decoction|tincture|extract|chew)\b|\b(ingest|consume|eat|drink|tea|infusion|decoction|tincture|extract|chew)\b[^.!?]{0,60}\b(do not|don't|never|avoid|unsafe|toxic|poisonous|poison|deadly|fatal|dangerous)\b/i;

export function isPlaceholderMedicinalText(value) {
  const normalized = normalizeMedicinalText(value);
  return !!normalized && PLACEHOLDER_MEDICINAL_PATTERNS.some(pattern => pattern.test(normalized));
}

export function hasRealMedicinalText(value) {
  const normalized = normalizeMedicinalText(value);
  return !!normalized && !isPlaceholderMedicinalText(normalized);
}

export function isBuildNoteText(value) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  return !!normalized && CURATION_NOTE_PATTERNS.some((pattern) => pattern.test(normalized));
}

function splitIntoSentences(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map(part => part.trim())
    .filter(Boolean);
}

export function cleanUserFacingText(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  if (!isBuildNoteText(text)) return text;
  const cleaned = splitIntoSentences(text)
    .filter(sentence => !isBuildNoteText(sentence))
    .join(" ")
    .trim();
  return cleaned && !isBuildNoteText(cleaned) ? cleaned : "";
}

function firstUserFacingText(...values) {
  for (const value of values) {
    const text = cleanUserFacingText(value);
    if (text) return text;
  }
  return '';
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
      status: cleanUserFacingText(record.rare_profile.status),
      legal_status: cleanUserFacingText(record.rare_profile.legal_status),
      up_relevance: cleanUserFacingText(record.rare_profile.up_relevance),
      sensitive_location: record.rare_profile.sensitive_location === true,
      reason: cleanUserFacingText(record.rare_profile.reason),
      field_marks: cleanUserFacingText(record.rare_profile.field_marks),
      care_note: cleanUserFacingText(record.rare_profile.care_note),
      key_features: uniq(record.rare_profile.key_features).map(cleanUserFacingText).filter(Boolean)
    };
  }

  const profile = {
    status: cleanUserFacingText(record.status),
    legal_status: cleanUserFacingText(record.legal_status),
    up_relevance: cleanUserFacingText(record.up_relevance),
    sensitive_location: record.sensitive_location === true,
    reason: cleanUserFacingText(record.reason),
    field_marks: cleanUserFacingText(record.field_marks),
    care_note: cleanUserFacingText(record.care_note),
    key_features: uniq(record.key_features).map(cleanUserFacingText).filter(Boolean)
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
    const summary = hasRealMedicinalText(existing.summary) ? cleanUserFacingText(existing.summary) : "";
    const preparationNotes = cleanUserFacingText(existing.preparation_notes);
    const warnings = cleanUserFacingText(existing.warnings);
    const hasMeaningful = existing.has_meaningful_content === true
      || !!summary
      || actions.length > 0
      || bodySystems.length > 0
      || medicalTerms.length > 0
      || claims.length > 0
      || !!preparationNotes
      || !!warnings;

    return {
      has_meaningful_content: hasMeaningful,
      summary,
      evidence_tier: String(existing.evidence_tier || "").trim(),
      actions,
      body_systems: bodySystems,
      medical_terms: medicalTerms,
      parts_used: uniq(existing.parts_used),
      preparation_notes: preparationNotes,
      warnings,
      claims
    };
  }

  const actions = uniq(record.medicinalAction);
  const bodySystems = uniq(record.medicinalSystem);
  const medicalTerms = uniq(record.medicinalTerms);
  const summary = hasRealMedicinalText(record.medicinal_uses) ? cleanUserFacingText(record.medicinal_uses) : "";
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

function isCandyAppleBolete(record = {}) {
  const hay = [record.slug, record.display_name, record.common_name, record.scientific_name, ...(record.common_names || [])]
    .join(" ")
    .toLowerCase();
  return (hay.includes("candy") && hay.includes("apple") && hay.includes("bolete"))
    || hay.includes("butyriboletus frostii")
    || hay.includes("exsudoporus frostii")
    || hay.includes("boletus frostii");
}

function isBitterBoleteRecord(record = {}) {
  const hay = [record.slug, record.display_name, record.common_name, record.scientific_name, ...(record.common_names || []), ...(record.taste || [])]
    .join(" ")
    .toLowerCase();
  return hay.includes("bitter bolete") || hay.includes("tylopilus felleus") || hay.includes("false porcini") || hay.includes("gall fungus");
}

function applyKnownRecordFixes(record = {}) {
  if (isCandyAppleBolete(record)) {
    const commonNames = uniq(["Candy Apple Bolete", "Frost's Bolete", "Apple Bolete", ...(record.common_names || [])]);
    return {
      ...record,
      display_name: "Candy Apple Bolete",
      common_name: "Candy Apple Bolete",
      common_names: commonNames,
      scientific_name: /frostii/i.test(String(record.scientific_name || "")) ? record.scientific_name : "Butyriboletus frostii",
      record_type: "mushroom",
      primary_type: "mushroom",
      category: record.category || "Mushroom",
      lane: "bolete",
      food_role: "food",
      edibility_status: record.edibility_status || "edible_with_caution",
      non_edible_severity: "",
      food_quality: record.food_quality || "Edible with caution",
      culinary_uses: cleanUserFacingText(record.culinary_uses) || "Edible by some experienced foragers, but not a beginner mushroom. Treat red-pored, blue-staining boletes cautiously and use only after confident species-level identification.",
      field_identification: cleanUserFacingText(record.field_identification) || "Bright candy-apple red cap, red pore surface, coarse raised red netting on the stem, blue bruising, and association with oak or other hardwoods.",
      edibility_detail: cleanUserFacingText(record.edibility_detail) || "Edible reports exist, but red-pored boletes are a caution group. Confirm the red cap, red pores, coarse reticulation, blue staining, and hardwood/oak habitat before considering it.",
      look_alike_risk: "",
      images: [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Exsudoporus%20frostii%20100632.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Exsudoporus%20frostii%2050214.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Exsudoporus%20frostii.jpg"
      ],
      links: mergeArrays(record.links, [
        "https://commons.wikimedia.org/wiki/Butyriboletus_frostii",
        "https://boletes.wpamushroomclub.org/product/boletus-frostii/"
      ]),
      mushroom_profile: {
        ...(record.mushroom_profile || {}),
        scientific_name: /frostii/i.test(String(record.scientific_name || "")) ? record.scientific_name : "Butyriboletus frostii",
        underside: mergeArrays(record.mushroom_profile?.underside, ["Pores"]),
        substrate: mergeArrays(record.mushroom_profile?.substrate, ["Forest soil"]),
        host_filter_tokens: mergeArrays(record.mushroom_profile?.host_filter_tokens || record.host_filter_tokens, ["Hardwood", "Oak"]),
        texture: mergeArrays(record.mushroom_profile?.texture, ["Fleshy / firm"]),
        staining: mergeArrays(record.mushroom_profile?.staining, ["Blue bruising"]),
        cap_surface: mergeArrays(record.mushroom_profile?.cap_surface, ["Sticky / viscid when fresh", "Bright red cap"]),
        stem_feature: mergeArrays(record.mushroom_profile?.stem_feature, ["Coarse raised reticulation"]),
        pore_color: mergeArrays(record.mushroom_profile?.pore_color, ["Red pores"]),
        growth_form: mergeArrays(record.mushroom_profile?.growth_form, ["Cap and stem"]),
        fertile_surface: mergeArrays(record.mushroom_profile?.fertile_surface, ["Pores"])
      },
      host_filter_tokens: mergeArrays(record.host_filter_tokens, ["Hardwood", "Oak"]),
      boleteGroup: mergeArrays(record.boleteGroup, ["Red-pored boletes"]),
      boleteSubgroup: mergeArrays(record.boleteSubgroup, ["Candy apple / Frost's bolete"])
    };
  }

  if (isBitterBoleteRecord(record)) {
    const commonNames = uniq(["Bitter Bolete", "False Porcini", ...(record.common_names || [])]);
    return {
      ...record,
      display_name: "Bitter Bolete",
      common_name: "Bitter Bolete",
      common_names: commonNames,
      scientific_name: record.scientific_name || "Tylopilus felleus",
      food_role: "avoid",
      edibility_status: "not_edible",
      non_edible_severity: "Inedible — bitter, not poisonous",
      food_quality: "Not recommended",
      culinary_uses: "Not used as food; its extreme bitterness can ruin a whole pan of otherwise edible mushrooms.",
      edibility_detail: "Inedible because of intense bitterness rather than dangerous poisoning. Keep it out of the Caution page unless a future record adds a real toxicity concern.",
      look_alike_risk: "",
      danger_level: "Not poisonous; bitter inedible",
      poisoning_effects: "Not treated here as a poisonous species. Large amounts may cause stomach upset, but the practical problem is extreme bitterness and confusion with edible porcini-type boletes.",
      affected_systems: []
    };
  }

  return record;
}

export function getMedicinalData(record = {}) {
  return deriveMedicinal(record);
}

function isTeaOnlyUseText(value = "") {
  const normalized = String(value || "").trim().toLowerCase().replace(/[^a-z/ ]+/g, "");
  return ["tea", "tea only", "nonculinary/tea", "non culinary/tea", "beverage tea"].includes(normalized);
}

function textHasIngestibleUse(value = "") {
  const text = cleanUserFacingText(value);
  if (!text) return false;
  if (isTeaOnlyUseText(text)) return true;

  return splitIntoSentences(text).some((sentence) => {
    if (!INGESTIBLE_USE_KEYWORDS.test(sentence)) return false;
    if (DIRECT_INGESTION_DANGER.test(sentence)) return false;
    return true;
  });
}

export function hasIngestibleUseContent(record = {}) {
  const foodRole = normalizedFoodRole(record);
  if (foodRole === "tea_extract_only" || foodRole === "food") return true;

  const useTags = ensureArray(record.use_tags).map((tag) => String(tag || "").trim().toUpperCase());
  if (useTags.includes("E") || useTags.includes("T") || useTags.includes("TEA")) return true;

  const medicinal = getMedicinalData(record);
  const fieldTexts = [
    record.culinary_uses,
    record.edibility_notes,
    record.edibility_detail,
    record.other_uses,
    record.medicinal_uses,
    medicinal.summary,
    medicinal.preparation_notes,
    record.notes,
    record.general_notes,
    record.overview
  ];

  return fieldTexts.some(textHasIngestibleUse);
}

export function hasMeaningfulOtherUses(record = {}) {
  const direct = cleanUserFacingText(record.other_uses);
  if (direct && !isTeaOnlyUseText(direct)) return true;

  const explicit = [record.practical_uses, record.utility_uses, record.craft_uses, record.fiber_uses, record.tinder_uses]
    .map(cleanUserFacingText)
    .filter(Boolean)
    .join(" ");
  if (explicit && !isTeaOnlyUseText(explicit)) return true;

  const inferredText = [
    cleanUserFacingText(record.overview),
    cleanUserFacingText(record.notes),
    cleanUserFacingText(record.general_notes),
    cleanUserFacingText(record.edibility_notes),
    cleanUserFacingText(record.edibility_detail),
    cleanUserFacingText(record.habitat_detail)
  ].join(" ");

  return OTHER_USE_KEYWORDS.test(inferredText);
}

function normalizedEdibilityStatus(record = {}) {
  return String(record.edibility_status || record.mushroom_profile?.edibility_status || "").trim().toLowerCase();
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
  if (value.includes("not poisonous") || value.includes("non-poisonous") || value.includes("nonpoisonous")) return false;
  return [
    "poisonous",
    "deadly",
    "toxic",
    "dangerous",
    "fatal",
    "harmful"
  ].some(token => value.includes(token));
}

function isBenignNonCulinarySeverity(severity = "") {
  const value = String(severity || "").trim().toLowerCase();
  if (!value) return false;
  return value.includes("tea") || value.includes("bitter") || value.includes("not poisonous") || value.includes("non-poisonous");
}

export function hasMeaningfulFoodContent(record = {}) {
  const culinary = cleanUserFacingText(record.culinary_uses);
  const notes = cleanUserFacingText(record.edibility_notes || record.edibility_detail);
  const foodQuality = String(record.food_quality || "").trim();
  return !!(culinary || foodQuality || notes || hasIngestibleUseContent(record));
}

export function isEdibleForSection(record = {}) {
  const edibility = normalizedEdibilityStatus(record);
  const foodRole = normalizedFoodRole(record);
  const severity = normalizedNonEdibleSeverity(record);
  const dangerText = [record.danger_level, record.poisoning_effects, record.toxicity_notes].join(" ");

  // True danger beats everything. A poisonous/deadly/toxic record should not become edible
  // just because the description mentions tea, ingestion, or treatment history.
  if (["poisonous", "deadly"].includes(edibility)) return false;
  if (isDangerSeverity(severity)) return false;
  if (isDangerSeverity(dangerText)) return false;

  // App rule: any positive ingestible use counts for the edible/ingestible sections.
  // Tea, infusion, decoction, tincture, sap, syrup, broth, etc. are all ingested.
  // This intentionally overrides weak food labels like avoid/not_edible/inedible when
  // the record is really saying "not a meal, but usable as tea/extract."
  if (hasIngestibleUseContent(record)) return true;

  if (["not_edible"].includes(edibility)) return false;
  if (["avoid", "emergency_only", "medicinal_only"].includes(foodRole)) return false;

  if (["edible", "good", "choice", "edible_with_caution"].includes(edibility)) return true;

  if (isBenignNonCulinarySeverity(severity)) {
    return hasMeaningfulFoodContent(record)
      || hasRealMedicinalText(record.medicinal_uses)
      || hasMeaningfulOtherUses(record);
  }

  return hasMeaningfulFoodContent(record);
}

export function isCautionRecord(record = {}) {
  const edibility = normalizedEdibilityStatus(record);
  const foodRole = normalizedFoodRole(record);
  const severity = normalizedNonEdibleSeverity(record);
  const risk = String(record.look_alike_risk || "").trim().toLowerCase();
  const dangerText = [record.danger_level, record.poisoning_effects, record.toxicity_notes].join(" ");

  // The Caution page is for genuinely unsafe look-alikes / poisonous entries, not edible records with notes.
  if (isEdibleForSection(record)) return false;
  if (foodRole === "tea_extract_only") return false;
  if (isTeaOnlyUseText(record.other_uses)) return false;
  if (isBitterBoleteRecord(record) && !isDangerSeverity(`${severity} ${dangerText}`)) return false;
  if (isBenignNonCulinarySeverity(severity) && !isDangerSeverity(dangerText)) return false;

  if (risk === "serious") return true;
  if (isDangerSeverity(severity)) return true;
  if (isDangerSeverity(dangerText)) return true;
  if (["poisonous", "deadly"].includes(edibility)) return true;
  if (["emergency_only"].includes(foodRole)) return true;

  return false;
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
  const fixed = applyKnownRecordFixes(record || {});
  const reviewReasons = uniq([
    ...ensureArray(fixed.reviewReasons),
    ...ensureArray(fixed.review_reasons),
    ...ensureArray(fixed.manual_review_reasons)
  ]);
  const category = String(fixed.category || "").trim();
  const kingdom_type = deriveKingdomType(fixed, category);
  const record_type = kingdom_type;
  const underside = uniq([
    ...ensureArray(fixed.mushroom_profile?.underside_type),
    ...ensureArray(fixed.mushroom_profile?.underside),
    ...ensureArray(fixed.underside)
  ]);
  const lane = fixed.mushroom_profile?.lane
    || fixed.lane
    || (record_type === "mushroom"
      ? (underside.some(v => String(v).toLowerCase().includes("pore"))
        ? "bolete"
        : (underside.some(v => String(v).toLowerCase().includes("gill")) ? "gilled" : "other"))
      : "");
  const hostTokens = uniq([
    ...ensureArray(fixed.host_filter_tokens),
    ...ensureArray(fixed.mushroom_profile?.host_filter_tokens)
  ]);
  const commonNames = deriveCommonNames(fixed);
  const rareProfile = deriveRareProfile(fixed);
  const medicinal = deriveMedicinal(fixed);
  const cleanedNotes = cleanUserFacingText(fixed.notes);
  const cleanedGeneralNotes = cleanUserFacingText(fixed.general_notes);
  const cleanedCulinary = cleanUserFacingText(fixed.culinary_uses);
  const cleanedOtherUses = cleanUserFacingText(fixed.other_uses);
  const cleanedEdibility = cleanUserFacingText(fixed.edibility_notes || fixed.edibility_detail);

  return {
    ...fixed,
    common_names: commonNames,
    common_name: fixed.common_name || commonNames[0] || "",
    kingdom_type,
    record_type,
    species_scope: String(fixed.species_scope || fixed.entry_scope || "").trim() || "species",
    foraging_class: deriveForagingClass(fixed, category),
    field_identification: firstUserFacingText(fixed.field_identification, fixed.identification_tips, fixed.field_marks),
    season_months: deriveSeasonMonths(fixed),
    habitats: deriveHabitats(fixed),
    look_alikes: deriveLookAlikes(fixed),
    look_alike_risk: String(fixed.look_alike_risk || "").trim(),
    look_alike_notes: cleanUserFacingText(fixed.look_alike_notes),
    rare_profile: rareProfile,
    overview: firstUserFacingText(fixed.overview, fixed.short_reason, rareProfile?.reason),
    culinary_uses: cleanedCulinary,
    other_uses: cleanedOtherUses,
    edibility_notes: cleanedEdibility,
    curation_notes: uniq([
      isBuildNoteText(fixed.short_reason) ? fixed.short_reason : "",
      isBuildNoteText(fixed.notes) ? fixed.notes : "",
      isBuildNoteText(fixed.general_notes) ? fixed.general_notes : "",
      isBuildNoteText(fixed.culinary_uses) ? fixed.culinary_uses : "",
      isBuildNoteText(fixed.other_uses) ? fixed.other_uses : ""
    ]),
    general_notes: cleanedGeneralNotes,
    notes: cleanedNotes,
    lane,
    reviewReasons,
    review_reasons: reviewReasons,
    review_status: fixed.review_status || (reviewReasons.length ? "needs_review" : "ok"),
    search_aliases: uniq(fixed.search_aliases),
    host_filter_tokens: hostTokens,
    commonness: fixed.commonness || fixed.status || "",
    food_quality: fixed.food_quality || "",
    non_edible_severity: fixed.non_edible_severity || "",
    medicinal,
    medicinalAction: medicinal.actions,
    medicinalSystem: medicinal.body_systems,
    medicinalTerms: medicinal.medical_terms,
    use_links: deriveUseLinks(fixed),
    months_available: uniq(fixed.months_available),
    habitat: uniq(fixed.habitat)
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
