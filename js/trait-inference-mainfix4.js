import { VOCAB } from "./vocabulary.js?v=v2.0";

const PLANT_ID = {
  flowerColors: ["White","Purple","Pink","Yellow","Blue","Red","Green"],
  leafShapes: ["Round","Oval","Heart-shaped","Lance-shaped","Pointed","Lobed","Compound","Needle-like"],
  stemSurfaces: ["Smooth","Hairy","Rough","Fuzzy","Prickly"],
  leafPointCounts: ["1-point","3-point","5-point","Many-lobed"]
};

const EXPLICIT_FLOWER_COLOR_MAP = {
  'dandelion-flowers':['Yellow'],
  'violet-flowers':['Purple','Blue'],
  'clover-flowers':['Pink','White'],
  'honeysuckle-flowers':['White','Yellow','Pink'],
  'elderflowers':['White'],
  'chicory-flowers':['Blue'],
  'basswood-linden-flowers':['Yellow','White'],
  'daylily-flowers':['Yellow'],
  'bee-balm-wild-bergamot':['Pink','Purple'],
  'goldenrod-flowers':['Yellow'],
  'cattail-pollen':['Yellow'],
  'wild-hop-cones':['Green'],
  'wood-sorrel-yellow-woodsorrel':['Yellow'],
  'yellow-pond-lily-bulbs':['Yellow'],
  'jerusalem-artichoke':['Yellow'],
  'wild-carrot':['White'],
  'garlic-mustard':['White'],
  'wild-mustard-greens':['Yellow'],
  'chickweed':['White'],
  'wood-sorrel':['Yellow'],
  'red-sorrel':['Red'],
  'miner-s-lettuce-winter-purslane':['White'],
  'wild-ginger':['Red','Brown'],
  'sweet-cicely':['White'],
  'fiddlehead-ferns':[],
  'plantain-broadleaf':['Green'],
  'ramps-wild-onion':['White'],
  'wild-leek-ramp':['White']
};

function inferMulti(text, entries) {
  const out = [];
  const lower = text.toLowerCase();
  for (const entry of entries) {
    const terms = [entry.label, ...(entry.synonyms || [])].filter(Boolean).map(term => term.toLowerCase());
    if (terms.some(term => lower.includes(term))) out.push(entry.label);
  }
  return [...new Set(out)];
}
function canonicalizeList(values, entries, { keepUnknown = false } = {}) {
  const out = [];
  for (const raw of values || []) {
    const lower = String(raw || '').trim().toLowerCase();
    if (!lower) continue;
    let matched = false;
    for (const entry of entries) {
      const terms = [entry.label, ...(entry.synonyms || [])].filter(Boolean).map(term => term.toLowerCase());
      if (terms.some(term => lower === term || lower.includes(term) || term.includes(lower))) {
        out.push(entry.label); matched = true;
      }
    }
    if (!matched && keepUnknown) out.push(String(raw).trim());
  }
  return [...new Set(out)];
}
function inferHostTrees(text) {
  const lower = text.toLowerCase();
  const matches = VOCAB.mushrooms.hostTrees.filter(entry => {
    const terms = [entry.label, ...(entry.synonyms || [])].filter(Boolean).map(term => term.toLowerCase());
    return terms.some(term => lower.includes(term));
  });
  return {
    labels: [...new Set(matches.map(entry => entry.label))],
    broadTypes: [...new Set(matches.map(entry => entry.broadType === 'hardwood' ? 'Hardwood' : entry.broadType === 'conifer' ? 'Conifer / softwood' : 'Mixed / unknown wood').filter(Boolean))]
  };
}
function inferMedicinalTerms(text) { return inferMulti(text, VOCAB.medicinal.symptoms); }
function mergeUnique(...lists) { return [...new Set(lists.flat().filter(Boolean))]; }
function explicitList(record, path, fallback = []) {
  const val = path.split('.').reduce((acc, key) => acc?.[key], record);
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === 'string' && val.trim()) return [val.trim()];
  return fallback;
}
function inferSimpleLabels(text, labels) {
  const lower = text.toLowerCase();
  return labels.filter(label => lower.includes(label.toLowerCase()) || lower.includes(label.toLowerCase().replace(/-/g,' ')));
}
function inferLeafPointCounts(text) {
  const lower = text.toLowerCase();
  const out = [];
  if (/(five-point|5 point|five lobed|five-lobed|five pointed)/.test(lower)) out.push('5-point');
  if (/(three-point|3 point|three lobed|three-lobed|three pointed)/.test(lower)) out.push('3-point');
  if (/(single point|one point|1 point|pointed leaf)/.test(lower)) out.push('1-point');
  if (/(many lobed|deeply lobed|several lobes)/.test(lower)) out.push('Many-lobed');
  return out;
}
function inferFlowerColors(record, text) {
  const lower = text.toLowerCase();
  const out = [];
  const slugMap = EXPLICIT_FLOWER_COLOR_MAP[record.slug] || [];
  out.push(...slugMap);
  const cues = [
    ['Yellow', /(yellow|golden|gold|daylily|dandelion|mustard|woodsorrel|goldenrod|linden)/],
    ['Pink', /(pink|rose|clover|bee balm|bergamot|honeysuckle)/],
    ['Blue', /(blue|azure|chicory|violet)/],
    ['Purple', /(purple|violet|bergamot|bee balm|lavender)/],
    ['White', /(white|elderflower|elderflowers|chickweed|wild carrot|queen anne|garlic mustard|basswood)/],
    ['Red', /(red|scarlet|crimson|ginger flower|red sorrel)/],
    ['Green', /(green flower|greenish|hop cones|catkin)/]
  ];
  for (const [label, pattern] of cues) {
    if (pattern.test(lower)) out.push(label);
  }
  return [...new Set(out.filter(Boolean))];
}

export function inferTraits(record) {
  const text = [
    record.slug,
    record.display_name,
    record.common_name,
    record.category,
    record.culinary_uses,
    record.medicinal_uses,
    record.notes,
    record.scientific_name,
    ...(record.images || []),
    record.mushroom_profile?.summary,
    ...(record.mushroom_profile?.research_notes || [])
  ].join(' ').toLowerCase();
  const hostInfo = inferHostTrees(text);
  const explicitHabitat = canonicalizeList(explicitList(record,'habitat'), VOCAB.common.habitats, {keepUnknown:true});
  const explicitObservedPart = canonicalizeList(explicitList(record,'observedPart'), VOCAB.common.observedParts, {keepUnknown:true});
  const explicitSize = canonicalizeList(explicitList(record,'size'), VOCAB.common.sizes, {keepUnknown:true});
  const explicitTasteCommon = canonicalizeList(explicitList(record,'taste'), VOCAB.common.tastes, {keepUnknown:true});
  const explicitMedicinalAction = canonicalizeList(explicitList(record,'medicinalAction'), VOCAB.medicinal.actions, {keepUnknown:true});
  const explicitMedicinalSystem = canonicalizeList(explicitList(record,'medicinalSystem'), VOCAB.medicinal.bodySystems, {keepUnknown:true});
  const explicitMedicinalTerms = canonicalizeList(explicitList(record,'medicinalTerms'), VOCAB.medicinal.symptoms, {keepUnknown:true});
  const explicitHostTree = canonicalizeList(explicitList(record,'mushroom_profile.host_trees').filter(label => !['Hardwood (general)','Conifer (general)','Hardwood litter','Conifer litter'].includes(label)), VOCAB.mushrooms.hostTrees);
  const explicitWoodTypes = canonicalizeList(explicitList(record,'mushroom_profile.wood_type'), VOCAB.mushrooms.woodTypes);
  const explicitSubstrate = canonicalizeList(explicitList(record,'mushroom_profile.substrate'), VOCAB.mushrooms.substrates);
  const explicitRing = canonicalizeList(explicitList(record,'mushroom_profile.ring'), VOCAB.mushrooms.ringStates);
  const explicitUnderside = canonicalizeList(explicitList(record,'mushroom_profile.underside'), VOCAB.mushrooms.undersideTypes);
  const explicitTexture = canonicalizeList(explicitList(record,'mushroom_profile.texture'), VOCAB.mushrooms.textures);
  const explicitSmell = canonicalizeList(explicitList(record,'mushroom_profile.odor'), VOCAB.mushrooms.odors);
  const explicitStaining = canonicalizeList(explicitList(record,'mushroom_profile.staining'), VOCAB.mushrooms.stainingColors);
  const explicitTasteMushroom = canonicalizeList(explicitList(record,'mushroom_profile.taste'), VOCAB.common.tastes);

  const traits = {
    habitat: mergeUnique(explicitHabitat, inferMulti(text, VOCAB.common.habitats)),
    observedPart: mergeUnique(explicitObservedPart, inferMulti(text, VOCAB.common.observedParts)),
    size: mergeUnique(explicitSize, inferMulti(text, VOCAB.common.sizes)),
    taste: mergeUnique(explicitTasteCommon, explicitTasteMushroom, inferMulti(text, VOCAB.common.tastes)),
    substrate: [], treeType: [], hostTree: [], ring: [], underside: [], texture: [], smell: [], staining: [],
    medicinalAction: mergeUnique(explicitMedicinalAction, inferMulti(text, VOCAB.medicinal.actions)),
    medicinalSystem: mergeUnique(explicitMedicinalSystem, inferMulti(text, VOCAB.medicinal.bodySystems)),
    medicinalTerms: mergeUnique(explicitMedicinalTerms, inferMedicinalTerms(text)),
    flowerColor: inferFlowerColors(record, text),
    leafShape: inferSimpleLabels(text, PLANT_ID.leafShapes),
    stemSurface: inferSimpleLabels(text, PLANT_ID.stemSurfaces),
    leafPointCount: inferLeafPointCounts(text)
  };
  if (record.category === 'Mushroom') {
    traits.substrate = mergeUnique(explicitSubstrate, inferMulti(text, VOCAB.mushrooms.substrates));
    traits.treeType = mergeUnique(explicitWoodTypes, inferMulti(text, VOCAB.mushrooms.woodTypes), hostInfo.broadTypes);
    traits.hostTree = mergeUnique(explicitHostTree, hostInfo.labels);
    traits.ring = mergeUnique(explicitRing, inferMulti(text, VOCAB.mushrooms.ringStates));
    traits.underside = mergeUnique(explicitUnderside, inferMulti(text, VOCAB.mushrooms.undersideTypes));
    traits.texture = mergeUnique(explicitTexture, inferMulti(text, VOCAB.mushrooms.textures));
    traits.smell = mergeUnique(explicitSmell, inferMulti(text, VOCAB.mushrooms.odors));
    traits.staining = mergeUnique(explicitStaining, inferMulti(text, VOCAB.mushrooms.stainingColors));
  }
  const reviewReasons = [];
  if (!record.images?.length) reviewReasons.push('missing image');
  if (!traits.habitat.length && record.category !== 'Mushroom') reviewReasons.push('habitat needs detail');
  if (record.category === 'Mushroom' && !traits.substrate.length) reviewReasons.push('substrate needs detail');
  return {...traits, reviewReasons:[...new Set(reviewReasons)], weekPrecision: record.weekPrecision || 'month-window-reviewed'};
}
