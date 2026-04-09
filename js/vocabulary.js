export const VOCAB = {
  version: "v1.2",
  common: {
    habitats: [
      { slug: "forest", label: "Forest", synonyms: ["forest", "woods", "woodland"] },
      { slug: "hardwood_forest", label: "Hardwood forest", synonyms: ["hardwood forest", "hardwood woods"] },
      { slug: "conifer_forest", label: "Conifer forest", synonyms: ["conifer forest", "spruce forest", "pine forest", "cedar swamp"] },
      { slug: "mixed_forest", label: "Mixed forest", synonyms: ["mixed forest", "mixed woods"] },
      { slug: "forest_edge", label: "Forest edge", synonyms: ["forest edge", "edge habitat"] },
      { slug: "meadow", label: "Meadow / field", synonyms: ["meadow", "field", "open field"] },
      { slug: "wetland", label: "Wetland / marsh", synonyms: ["wetland", "marsh", "swamp", "muck", "cattail"] },
      { slug: "bog", label: "Bog", synonyms: ["bog"] },
      { slug: "shoreline", label: "Shoreline / riverbank", synonyms: ["shoreline", "riverbank", "streambank", "lakeshore", "creek"] },
      { slug: "roadside", label: "Roadside / disturbed", synonyms: ["roadside", "disturbed ground", "disturbed"] },
      { slug: "yard", label: "Yard / garden", synonyms: ["yard", "lawn", "garden"] },
      { slug: "sandy_upland", label: "Sandy / dry upland", synonyms: ["sand", "sandy", "dry upland"] }
    ],
    observedParts: [
      { slug: "whole_plant", label: "Whole plant", synonyms: ["whole plant", "whole mushroom"] },
      { slug: "leaf", label: "Leaf", synonyms: ["leaf", "leaves", "foliage"] },
      { slug: "flower", label: "Flower", synonyms: ["flower", "flowers", "blossom", "blossoms"] },
      { slug: "fruit", label: "Fruit / berry", synonyms: ["fruit", "berry", "berries", "cherry", "plum", "apple"] },
      { slug: "seed", label: "Seed / cone / nut", synonyms: ["seed", "seeds", "nut", "nuts", "cone", "cones"] },
      { slug: "stem", label: "Stem", synonyms: ["stem", "stalk"] },
      { slug: "bark", label: "Bark", synonyms: ["bark"] },
      { slug: "root", label: "Root / rhizome", synonyms: ["root", "roots", "rhizome", "rhizomes", "tuber", "tubers"] },
      { slug: "sap", label: "Sap / resin", synonyms: ["sap", "resin", "gum"] },
      { slug: "pollen", label: "Pollen", synonyms: ["pollen"] },
      { slug: "mushroom", label: "Mushroom", synonyms: ["mushroom", "cap", "fruiting body"] }
    ],
    tastes: [
      { slug: "mild", label: "Mild", synonyms: ["mild"] },
      { slug: "sweet", label: "Sweet", synonyms: ["sweet", "sugary", "honeyed"] },
      { slug: "bitter", label: "Bitter", synonyms: ["bitter"] },
      { slug: "sour", label: "Sour / tart", synonyms: ["tart", "sour", "acidic"] },
      { slug: "peppery", label: "Peppery / spicy", synonyms: ["spicy", "peppery"] },
      { slug: "nutty", label: "Nutty", synonyms: ["nutty"] },
      { slug: "earthy", label: "Earthy", synonyms: ["earthy"] },
      { slug: "aromatic", label: "Aromatic", synonyms: ["aromatic", "fragrant"] },
      { slug: "cucumber", label: "Cucumber-like", synonyms: ["cucumber"] },
      { slug: "mushroomy", label: "Mushroomy / umami", synonyms: ["mushroomy", "umami"] },
      { slug: "unpleasant", label: "Unpleasant", synonyms: ["unpleasant", "bad taste"] },
      { slug: "unknown", label: "Unknown", synonyms: [] }
    ],
    sizes: [
      { slug: "tiny", label: "Tiny", synonyms: ["tiny", "smallest", "under 2"] },
      { slug: "small", label: "Small", synonyms: ["small", "2-6", "2 to 6"] },
      { slug: "medium", label: "Medium", synonyms: ["medium", "6-24", "6 to 24"] },
      { slug: "large", label: "Large", synonyms: ["large", "2-6 ft", "2 to 6 ft"] },
      { slug: "giant", label: "Giant", synonyms: ["giant", "huge", "tree-sized"] }
    ]
  },
  mushrooms: {
    substrates: [
      { slug: "soil", label: "Soil", synonyms: ["soil", "ground"] },
      { slug: "wood", label: "Wood", synonyms: ["wood"] },
      { slug: "dead_wood", label: "Dead wood", synonyms: ["dead wood", "rotting wood", "fallen wood"] },
      { slug: "living_tree", label: "Living tree", synonyms: ["living tree", "living wood"] },
      { slug: "stump", label: "Stump", synonyms: ["stump"] },
      { slug: "fallen_log", label: "Fallen log", synonyms: ["fallen log", "log"] },
      { slug: "moss", label: "Moss", synonyms: ["moss"] },
      { slug: "leaf_litter", label: "Leaf litter", synonyms: ["leaf litter", "litter"] },
      { slug: "unknown", label: "Unknown", synonyms: [] }
    ],
    woodTypes: [
      { slug: "hardwood", label: "Hardwood", synonyms: ["hardwood", "deciduous wood"] },
      { slug: "conifer", label: "Conifer", synonyms: ["conifer", "softwood"] },
      { slug: "unknown", label: "Unknown", synonyms: [] }
    ],
    hostTrees: [
      { slug: "birch", label: "Birch", broadType: "hardwood", synonyms: ["birch"] },
      { slug: "aspen", label: "Aspen", broadType: "hardwood", synonyms: ["aspen"] },
      { slug: "poplar", label: "Poplar", broadType: "hardwood", synonyms: ["poplar"] },
      { slug: "cottonwood", label: "Cottonwood", broadType: "hardwood", synonyms: ["cottonwood"] },
      { slug: "maple", label: "Maple", broadType: "hardwood", synonyms: ["maple"] },
      { slug: "oak", label: "Oak", broadType: "hardwood", synonyms: ["oak"] },
      { slug: "beech", label: "Beech", broadType: "hardwood", synonyms: ["beech"] },
      { slug: "cherry", label: "Cherry", broadType: "hardwood", synonyms: ["cherry", "black cherry", "wild cherry"] },
      { slug: "elm", label: "Elm", broadType: "hardwood", synonyms: ["elm"] },
      { slug: "ash", label: "Ash", broadType: "hardwood", synonyms: ["ash"] },
      { slug: "apple", label: "Apple", broadType: "hardwood", synonyms: ["apple", "apple tree", "old orchard"] },
      { slug: "tulip_poplar", label: "Tulip poplar", broadType: "hardwood", synonyms: ["tulip poplar", "tulip tree", "yellow poplar"] },
      { slug: "basswood", label: "Basswood", broadType: "hardwood", synonyms: ["basswood", "linden"] },
      { slug: "willow", label: "Willow", broadType: "hardwood", synonyms: ["willow"] },
      { slug: "alder", label: "Alder", broadType: "hardwood", synonyms: ["alder"] },
      { slug: "pine", label: "Pine", broadType: "conifer", synonyms: ["pine"] },
      { slug: "spruce", label: "Spruce", broadType: "conifer", synonyms: ["spruce"] },
      { slug: "black_spruce", label: "Black spruce", broadType: "conifer", synonyms: ["black spruce"] },
      { slug: "fir", label: "Fir", broadType: "conifer", synonyms: ["fir"] },
      { slug: "hemlock", label: "Hemlock", broadType: "conifer", synonyms: ["hemlock"] },
      { slug: "cedar", label: "Cedar", broadType: "conifer", synonyms: ["cedar"] },
      { slug: "tamarack", label: "Tamarack / larch", broadType: "conifer", synonyms: ["tamarack", "larch"] }
    ],
    hostCertainty: [
      { slug: "confirmed", label: "Confirmed" },
      { slug: "commonly_reported", label: "Commonly reported" },
      { slug: "suspected", label: "Suspected" },
      { slug: "unknown", label: "Unknown" }
    ],
    ringStates: [
      { slug: "ringed", label: "Ringed", synonyms: ["ring", "annulus", "skirt"] },
      { slug: "ringless", label: "No ring", synonyms: ["no ring", "ringless"] },
      { slug: "unknown", label: "Unknown", synonyms: [] }
    ],
    undersideTypes: [
      { slug: "gills", label: "Gills", synonyms: ["gill", "gills"] },
      { slug: "pores", label: "Pores", synonyms: ["pore", "pores"] },
      { slug: "teeth", label: "Teeth", synonyms: ["teeth", "tooth", "spines"] },
      { slug: "ridges", label: "Ridges / false gills", synonyms: ["ridges", "false gills"] },
      { slug: "smooth", label: "Smooth underside", synonyms: ["smooth underside"] }
    ],
    textures: [
      { slug: "smooth", label: "Smooth", synonyms: ["smooth"] },
      { slug: "slimy", label: "Slimy / sticky", synonyms: ["slimy", "sticky"] },
      { slug: "dry", label: "Dry", synonyms: ["dry"] },
      { slug: "velvety", label: "Velvety", synonyms: ["velvety"] },
      { slug: "scaly", label: "Scaly", synonyms: ["scaly", "scales"] },
      { slug: "shaggy", label: "Shaggy", synonyms: ["shaggy"] },
      { slug: "brittle", label: "Brittle", synonyms: ["brittle"] },
      { slug: "leathery", label: "Leathery", synonyms: ["leathery"] },
      { slug: "gelatinous", label: "Gelatinous / jelly", synonyms: ["gelatinous", "jelly"] },
      { slug: "fleshy", label: "Fleshy / firm", synonyms: ["fleshy", "firm"] }
    ],
    odors: [
      { slug: "mild", label: "Mild / none", synonyms: ["mild odor", "little odor", "no odor"] },
      { slug: "fruity", label: "Fruity", synonyms: ["fruity"] },
      { slug: "anise", label: "Anise-like", synonyms: ["anise"] },
      { slug: "cucumber", label: "Cucumber-like", synonyms: ["cucumber"] },
      { slug: "flour", label: "Flour / mealy", synonyms: ["flour", "mealy"] },
      { slug: "spicy", label: "Spicy", synonyms: ["spicy"] },
      { slug: "foul", label: "Foul", synonyms: ["foul", "stink", "fetid"] },
      { slug: "fishy", label: "Fishy", synonyms: ["fishy"] },
      { slug: "earthy", label: "Earthy", synonyms: ["earthy"] },
      { slug: "sweet", label: "Sweet", synonyms: ["sweet smell"] }
    ],
    stainingColors: [
      { slug: "none", label: "No staining", synonyms: ["no staining", "does not stain"] },
      { slug: "blue", label: "Blue staining", synonyms: ["blue stain", "blue bruising", "stains blue"] },
      { slug: "yellow", label: "Yellow staining", synonyms: ["yellow stain", "stains yellow"] },
      { slug: "red", label: "Red / pink staining", synonyms: ["red stain", "pink stain"] },
      { slug: "brown", label: "Brown staining", synonyms: ["brown stain", "browns when handled"] },
      { slug: "black", label: "Black staining", synonyms: ["black stain", "blackens"] },
      { slug: "unknown", label: "Unknown", synonyms: [] }
    ]
  },
  medicinal: {
    actions: [
      { slug: "astringent", label: "Astringent", synonyms: ["astringent"] },
      { slug: "cooling", label: "Cooling", synonyms: ["cooling"] },
      { slug: "warming", label: "Warming", synonyms: ["warming"] },
      { slug: "bitter", label: "Bitter", synonyms: ["bitter"] },
      { slug: "carminative", label: "Carminative", synonyms: ["carminative"] },
      { slug: "diuretic", label: "Diuretic", synonyms: ["diuretic"] },
      { slug: "expectorant", label: "Expectorant", synonyms: ["expectorant"] },
      { slug: "tonic", label: "Tonic", synonyms: ["tonic"] },
      { slug: "antiinflammatory", label: "Anti-inflammatory", synonyms: ["anti-inflammatory", "anti inflammatory", "inflammation"] },
      { slug: "antimicrobial", label: "Antimicrobial", synonyms: ["antimicrobial", "antibacterial", "antiseptic"] },
      { slug: "vulnerary", label: "Vulnerary", synonyms: ["wound healing", "vulnerary"] },
      { slug: "styptic", label: "Styptic", synonyms: ["styptic"] }
    ],
    bodySystems: [
      { slug: "digestive", label: "Digestive", synonyms: ["stomach", "digestive", "nausea", "gas", "diarrhea", "constipation"] },
      { slug: "respiratory", label: "Respiratory", synonyms: ["cough", "cold", "respiratory", "sore throat"] },
      { slug: "skin", label: "Skin", synonyms: ["skin", "rash", "wound", "burn"] },
      { slug: "oral", label: "Oral / dental", synonyms: ["toothache", "mouth", "gum", "oral"] },
      { slug: "nervous", label: "Nervous system", synonyms: ["headache", "nerves", "calming", "anxiety"] },
      { slug: "urinary", label: "Urinary", synonyms: ["urinary", "kidney", "bladder"] },
      { slug: "musculoskeletal", label: "Musculoskeletal", synonyms: ["joint", "muscle", "pain"] },
      { slug: "immune", label: "Immune", synonyms: ["immune", "fever", "infection"] }
    ],
    symptoms: [
      { slug: "stomach", label: "Stomach", synonyms: ["stomach", "upset stomach", "stomach ache", "digestive"] },
      { slug: "headache", label: "Headache", synonyms: ["headache"] },
      { slug: "toothache", label: "Toothache", synonyms: ["toothache"] },
      { slug: "cough", label: "Cough", synonyms: ["cough"] },
      { slug: "sore_throat", label: "Sore throat", synonyms: ["sore throat"] },
      { slug: "nausea", label: "Nausea", synonyms: ["nausea"] },
      { slug: "pain", label: "Pain", synonyms: ["pain"] },
      { slug: "rash", label: "Rash", synonyms: ["rash"] },
      { slug: "wound", label: "Wound care", synonyms: ["wound"] },
      { slug: "fever", label: "Fever", synonyms: ["fever"] },
      { slug: "inflammation", label: "Inflammation", synonyms: ["inflammation"] },
      { slug: "cooling", label: "Cooling", synonyms: ["cooling"] },
      { slug: "astringent", label: "Astringent", synonyms: ["astringent"] }
    ]
  }
};

export function flattenVocabGroups(groups) {
  return groups.flatMap(group => Array.isArray(group) ? group : []);
}
