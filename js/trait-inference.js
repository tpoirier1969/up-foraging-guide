const H = {
  any: {
    habitat: {
      'hardwood forest': ['hardwood forest','hardwood woods'],
      'conifer forest': ['conifer forest','spruce forest','pine forest','cedar swamp'],
      'mixed forest': ['mixed forest','mixed woods'],
      forest: ['forest','woods','woodland'],
      wetland: ['wetland','marsh','swamp','muck','cattail'],
      bog: ['bog'],
      shoreline: ['shoreline','riverbank','streambank','lakeshore','creek'],
      meadow: ['meadow','field','open field'],
      roadside: ['roadside','disturbed ground','disturbed'],
      yard: ['yard','lawn','garden'],
      sandy: ['sand','sandy'],
    },
    observedPart: {
      'whole plant': ['whole plant','whole mushroom'],
      leaf: ['leaf','leaves','foliage'],
      flower: ['flower','flowers','blossom','blossoms'],
      fruit: ['fruit','berry','berries','cherry','plum','apple'],
      seed: ['seed','seeds','nut','nuts','cone','cones'],
      stem: ['stem','stalk'],
      bark: ['bark'],
      root: ['root','roots','rhizome','rhizomes','tuber','tubers'],
      sap: ['sap','resin','gum'],
      pollen: ['pollen'],
      mushroom: ['mushroom','cap','fruiting body']
    },
    taste: {
      sweet: ['sweet','sugary','honeyed'],
      tart: ['tart','sour','acidic'],
      bitter: ['bitter'],
      mild: ['mild'],
      nutty: ['nutty'],
      earthy: ['earthy'],
      spicy: ['spicy','peppery'],
      bland: ['bland'],
      aromatic: ['aromatic','fragrant'],
      cucumber: ['cucumber'],
      mushroomy: ['mushroomy','umami']
    },
    size: {
      tiny: ['tiny','smallest','under 2'],
      small: ['small','2-6','2 to 6'],
      medium: ['medium','6-24','6 to 24'],
      large: ['large','2-6 ft','2 to 6 ft'],
      giant: ['giant','huge','tree-sized']
    }
  },
  mushrooms: {
    substrate: {
      soil: ['soil','ground'],
      'dead wood': ['dead wood','rotting wood','fallen wood'],
      'living tree': ['living tree','living wood'],
      stump: ['stump'],
      'fallen log': ['fallen log','log'],
      moss: ['moss'],
      'leaf litter': ['leaf litter','litter'],
      unknown: []
    },
    treeType: {
      hardwood: ['hardwood','maple','oak','beech','birch','aspen','cherry','elm','ash','basswood','alder','willow'],
      conifer: ['conifer','pine','spruce','fir','hemlock','cedar','tamarack','larch'],
      unknown: []
    },
    hostTree: ['birch','aspen','poplar','cottonwood','maple','oak','beech','cherry','elm','ash','basswood','willow','alder','pine','spruce','fir','hemlock','cedar','tamarack','larch'],
    ring: {
      ringed: ['ring','annulus','skirt'],
      'no ring': ['no ring','ringless'],
      unknown: []
    },
    underside: {
      gills: ['gill','gills'],
      pores: ['pore','pores'],
      teeth: ['teeth','tooth','spines'],
      ridges: ['ridges','false gills'],
      smooth: ['smooth underside']
    },
    texture: {
      smooth: ['smooth'],
      slimy: ['slimy','sticky'],
      dry: ['dry'],
      velvety: ['velvety'],
      scaly: ['scaly','scales'],
      shaggy: ['shaggy'],
      brittle: ['brittle'],
      leathery: ['leathery'],
      gelatinous: ['gelatinous','jelly'],
      fleshy: ['fleshy','firm']
    },
    smell: {
      mild: ['mild odor','little odor','no odor'],
      fruity: ['fruity'],
      anise: ['anise'],
      cucumber: ['cucumber'],
      flour: ['flour','mealy'],
      spicy: ['spicy'],
      foul: ['foul','stink','fetid'],
      fishy: ['fishy'],
      earthy: ['earthy'],
      sweet: ['sweet smell']
    },
    staining: {
      none: ['no staining','does not stain'],
      blue: ['blue stain','blue bruising','stains blue'],
      yellow: ['yellow stain','stains yellow'],
      red: ['red stain','pink stain'],
      brown: ['brown stain','browns when handled'],
      black: ['black stain','blackens'],
      unknown: []
    }
  },
  medicinal: {
    action: {
      astringent: ['astringent'],
      cooling: ['cooling'],
      warming: ['warming'],
      bitter: ['bitter'],
      carminative: ['carminative'],
      diuretic: ['diuretic'],
      expectorant: ['expectorant'],
      tonic: ['tonic'],
      antiinflammatory: ['anti-inflammatory','anti inflammatory','inflammation'],
      antimicrobial: ['antimicrobial','antibacterial','antiseptic'],
      vulnerary: ['wound healing','vulnerary'],
      styptic: ['styptic']
    },
    system: {
      digestive: ['stomach','digestive','nausea','gas','diarrhea','constipation'],
      respiratory: ['cough','cold','respiratory','sore throat'],
      skin: ['skin','rash','wound','burn'],
      oral: ['toothache','mouth','gum','oral'],
      nervous: ['headache','nerves','calming','anxiety'],
      urinary: ['urinary','kidney','bladder'],
      musculoskeletal: ['joint','muscle','pain'],
      immune: ['immune','fever','infection']
    },
    symptom: ['astringent','cooling','stomach','headache','toothache','cough','sore throat','nausea','pain','rash','wound','fever','inflammation']
  }
};

function inferMulti(text, map) {
  const out = [];
  const lower = text.toLowerCase();
  for (const [label, needles] of Object.entries(map)) {
    if (!needles.length) continue;
    if (needles.some(n => lower.includes(n))) out.push(label);
  }
  return [...new Set(out)];
}

export function inferTraits(record) {
  const text = [record.display_name, record.common_name, record.category, record.culinary_uses, record.medicinal_uses, record.notes].join(' ').toLowerCase();
  const traits = {
    habitat: inferMulti(text, H.any.habitat),
    observedPart: inferMulti(text, H.any.observedPart),
    size: inferMulti(text, H.any.size),
    taste: inferMulti(text, H.any.taste),
    substrate: [], treeType: [], hostTree: [], ring: [], underside: [], texture: [], smell: [], staining: [],
    medicinalAction: inferMulti(text, H.medicinal.action),
    medicinalSystem: inferMulti(text, H.medicinal.system),
    medicinalTerms: H.medicinal.symptom.filter(term => text.includes(term))
  };
  if (record.category === 'Mushroom') {
    traits.substrate = inferMulti(text, H.mushrooms.substrate);
    traits.treeType = inferMulti(text, H.mushrooms.treeType);
    traits.hostTree = H.mushrooms.hostTree.filter(term => text.includes(term));
    traits.ring = inferMulti(text, H.mushrooms.ring);
    traits.underside = inferMulti(text, H.mushrooms.underside);
    traits.texture = inferMulti(text, H.mushrooms.texture);
    traits.smell = inferMulti(text, H.mushrooms.smell);
    traits.staining = inferMulti(text, H.mushrooms.staining);
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
