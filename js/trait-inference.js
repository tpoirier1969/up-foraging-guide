
import { VOCAB } from "./vocabulary.js";

function inferMulti(text, entries, { includeUnknown = false } = {}) {
  const out = [];
  const lower = text.toLowerCase();
  for (const entry of entries) {
    const synonyms = entry.synonyms || [];
    if (!synonyms.length && !includeUnknown) continue;
    if (synonyms.some(term => lower.includes(term.toLowerCase()))) out.push(entry.label);
  }
  return [...new Set(out)];
}

function inferHostTrees(text) {
  const lower = text.toLowerCase();
  const matches = VOCAB.mushrooms.hostTrees.filter(entry => (entry.synonyms || []).some(term => lower.includes(term.toLowerCase())));
  return {
    labels: [...new Set(matches.map(entry => entry.label))],
    broadTypes: [...new Set(matches.map(entry => entry.broadType === "hardwood" ? "Hardwood" : entry.broadType === "conifer" ? "Conifer" : entry.broadType).filter(Boolean))]
  };
}

function inferMedicinalTerms(text) {
  return inferMulti(text, VOCAB.medicinal.symptoms);
}

function mergeUnique(...lists) {
  return [...new Set(lists.flat().filter(Boolean))];
}

function explicitList(record, path, fallback = []) {
  const val = path.split(".").reduce((acc, key) => acc?.[key], record);
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string" && val.trim()) return [val.trim()];
  return fallback;
}

export function inferTraits(record) {
  const text = [
    record.display_name,
    record.common_name,
    record.category,
    record.culinary_uses,
    record.medicinal_uses,
    record.notes,
    record.scientific_name,
    record.mushroom_profile?.summary,
    ...(record.mushroom_profile?.research_notes || [])
  ].join(" ").toLowerCase();

  const hostInfo = inferHostTrees(text);
  const explicitHostTree = explicitList(record, "mushroom_profile.host_trees").filter(label => !["Hardwood (general)", "Conifer (general)", "Hardwood litter", "Conifer litter", "Roots of umbellifers in native Eurasian range"].includes(label));
  const explicitWoodTypes = explicitList(record, "mushroom_profile.wood_type").filter(Boolean);
  const explicitSubstrate = explicitList(record, "mushroom_profile.substrate");
  const explicitRing = explicitList(record, "mushroom_profile.ring");
  const explicitUnderside = explicitList(record, "mushroom_profile.underside");
  const explicitTexture = explicitList(record, "mushroom_profile.texture");
  const explicitSmell = explicitList(record, "mushroom_profile.odor");
  const explicitStaining = explicitList(record, "mushroom_profile.staining");
  const explicitTaste = explicitList(record, "mushroom_profile.taste");

  const traits = {
    habitat: inferMulti(text, VOCAB.common.habitats),
    observedPart: inferMulti(text, VOCAB.common.observedParts),
    size: inferMulti(text, VOCAB.common.sizes),
    taste: mergeUnique(explicitTaste, inferMulti(text, VOCAB.common.tastes)),
    substrate: [],
    treeType: [],
    hostTree: [],
    ring: [],
    underside: [],
    texture: [],
    smell: [],
    staining: [],
    medicinalAction: inferMulti(text, VOCAB.medicinal.actions),
    medicinalSystem: inferMulti(text, VOCAB.medicinal.bodySystems),
    medicinalTerms: inferMedicinalTerms(text)
  };

  if (record.category === "Mushroom") {
    // Prefer explicit mushroom research fields, then fall back to text inference.
    traits.substrate = mergeUnique(explicitSubstrate, inferMulti(text, VOCAB.mushrooms.substrates));
    const broadWoodTypes = inferMulti(text, VOCAB.mushrooms.woodTypes);
    const explicitHostBroad = explicitHostTree.map(tree => {
      const found = VOCAB.mushrooms.hostTrees.find(entry => entry.label === tree);
      return found?.broadType === "hardwood" ? "Hardwood" : found?.broadType === "conifer" ? "Conifer" : "";
    }).filter(Boolean);
    traits.treeType = mergeUnique(explicitWoodTypes, broadWoodTypes, hostInfo.broadTypes, explicitHostBroad);
    traits.hostTree = mergeUnique(explicitHostTree, hostInfo.labels);
    traits.ring = mergeUnique(explicitRing, inferMulti(text, VOCAB.mushrooms.ringStates));
    traits.underside = mergeUnique(explicitUnderside, inferMulti(text, VOCAB.mushrooms.undersideTypes));
    traits.texture = mergeUnique(explicitTexture, inferMulti(text, VOCAB.mushrooms.textures));
    traits.smell = mergeUnique(explicitSmell, inferMulti(text, VOCAB.mushrooms.odors));
    traits.staining = mergeUnique(explicitStaining, inferMulti(text, VOCAB.mushrooms.stainingColors));
  }

  const reviewReasons = [];
  reviewReasons.push("week timing needs check");
  if (!record.images?.length) reviewReasons.push("missing image");
  if (!traits.habitat.length && record.category !== "Mushroom") reviewReasons.push("habitat needs detail");
  if (record.category === "Mushroom" && !traits.substrate.length) reviewReasons.push("substrate needs detail");
  if ((record.medicinal_uses || "").trim() && !traits.medicinalTerms.length && !traits.medicinalAction.length) reviewReasons.push("medicinal tagging needs detail");
  for (const reason of (record.manual_review_reasons || [])) reviewReasons.push(reason);

  return {
    ...traits,
    reviewReasons: [...new Set(reviewReasons)],
    weekPrecision: "month_assumed"
  };
}

export function uniqueTraitValues(records, key) {
  const vals = new Set();
  for (const rec of records) for (const item of rec[key] || []) vals.add(item);
  return [...vals].sort((a,b) => a.localeCompare(b));
}
