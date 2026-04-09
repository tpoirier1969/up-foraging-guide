import { VOCAB, flattenVocabGroups } from "./vocabulary.js";

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
    broadTypes: [...new Set(matches.map(entry => entry.broadType === 'hardwood' ? 'Hardwood' : entry.broadType === 'conifer' ? 'Conifer' : entry.broadType).filter(Boolean))]
  };
}

function inferMedicinalTerms(text) {
  return inferMulti(text, VOCAB.medicinal.symptoms);
}

export function inferTraits(record) {
  const text = [record.display_name, record.common_name, record.category, record.culinary_uses, record.medicinal_uses, record.notes].join(' ').toLowerCase();
  const hostInfo = inferHostTrees(text);
  const traits = {
    habitat: inferMulti(text, VOCAB.common.habitats),
    observedPart: inferMulti(text, VOCAB.common.observedParts),
    size: inferMulti(text, VOCAB.common.sizes),
    taste: inferMulti(text, VOCAB.common.tastes),
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

  if (record.category === 'Mushroom') {
    traits.substrate = inferMulti(text, VOCAB.mushrooms.substrates);
    const broadWoodTypes = inferMulti(text, VOCAB.mushrooms.woodTypes);
    traits.treeType = [...new Set([...broadWoodTypes, ...hostInfo.broadTypes])];
    traits.hostTree = hostInfo.labels;
    traits.ring = inferMulti(text, VOCAB.mushrooms.ringStates);
    traits.underside = inferMulti(text, VOCAB.mushrooms.undersideTypes);
    traits.texture = inferMulti(text, VOCAB.mushrooms.textures);
    traits.smell = inferMulti(text, VOCAB.mushrooms.odors);
    traits.staining = inferMulti(text, VOCAB.mushrooms.stainingColors);
  }

  const reviewReasons = [];
  reviewReasons.push('week timing needs check');
  if (!record.images?.length) reviewReasons.push('missing image');
  if (!traits.habitat.length) reviewReasons.push('habitat needs detail');
  if (record.category === 'Mushroom' && !traits.substrate.length) reviewReasons.push('substrate needs detail');
  if ((record.medicinal_uses || '').trim() && !traits.medicinalTerms.length && !traits.medicinalAction.length) reviewReasons.push('medicinal tagging needs detail');

  return {
    ...traits,
    reviewReasons,
    weekPrecision: 'month_assumed'
  };
}

export function uniqueTraitValues(records, key) {
  const vals = new Set();
  for (const rec of records) for (const item of rec[key] || []) vals.add(item);
  return [...vals].sort((a,b) => a.localeCompare(b));
}
