import { classifyRecord, cleanUserFacingText, isBuildNoteText } from "../lib/merge.js";
import { esc } from "../lib/escape.js";
import { renderImageSlot } from "../lib/image-slot.js";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];


function isSuppressed(record = {}) {
  if (!record || typeof record !== "object") return false;
  const hidden = record.hidden === true || String(record.hidden || "").toLowerCase() === "true";
  const displayStatus = String(record.display_status || record.displayStatus || "").toLowerCase();
  const listVisibility = String(record.list_visibility || record.listVisibility || "").toLowerCase();
  const suppressionReason = String(record.suppression_reason || record.suppressionReason || "").trim();
  return hidden
    || displayStatus.includes("suppressed")
    || listVisibility.includes("hidden")
    || listVisibility.includes("suppressed")
    || !!suppressionReason;
}

const PLANT_FILTER_DEFS = [
  { key: "plantMonth", label: "Season", blankLabel: "Any season", valueKey: "month" },
  { key: "plantPart", label: "Part / clue", blankLabel: "Any part", valueKey: "plantPart" },
  { key: "plantHabitat", label: "Habitat", blankLabel: "Any habitat", valueKey: "plantHabitat" },
  { key: "plantSize", label: "Size", blankLabel: "Any size", valueKey: "plantSize" },
  { key: "plantTaste", label: "Taste", blankLabel: "Any taste", valueKey: "plantTaste" },
  { key: "plantFlowerColor", label: "Flower color", blankLabel: "Any flower color", valueKey: "plantFlowerColor" },
  { key: "plantFruitColor", label: "Fruit color", blankLabel: "Any fruit color", valueKey: "plantFruitColor" },
  { key: "plantLeafShape", label: "Leaf shape", blankLabel: "Any leaf shape", valueKey: "plantLeafShape" },
  { key: "plantLeafArrangement", label: "Leaf arrangement", blankLabel: "Any leaf arrangement", valueKey: "plantLeafArrangement" },
  { key: "plantStem", label: "Stem / surface", blankLabel: "Any stem clue", valueKey: "plantStem" }
];

const MUSHROOM_CORE_FILTER_DEFS = [
  { key: "mushroomMonth", label: "Season", blankLabel: "Any season", valueKey: "month" },
  { key: "mushroomReviewFlag", label: "Data review", blankLabel: "Any review state", valueKey: "mushroomReviewFlag" },
  { key: "mushroomCapColor", label: "Cap color", blankLabel: "Any cap color", valueKey: "mushroomCapColor" },
  { key: "mushroomUnderside", label: "Underside type", blankLabel: "Any underside type", valueKey: "mushroomUnderside" },
  { key: "mushroomUndersideColor", label: "Underside color", blankLabel: "Any underside color", valueKey: "mushroomUndersideColor" },
  { key: "mushroomStemColor", label: "Stem color", blankLabel: "Any stem color", valueKey: "mushroomStemColor" },
  { key: "mushroomStaining", label: "Bruising / staining", blankLabel: "Any bruising/staining", valueKey: "mushroomStaining" },
  { key: "mushroomFleshColor", label: "Flesh color", blankLabel: "Any flesh color", valueKey: "mushroomFleshColor" },
  { key: "mushroomSporePrintColor", label: "Spore print", blankLabel: "Any spore print color", valueKey: "mushroomSporePrintColor" },
  { key: "mushroomCapSurface", label: "Cap surface", blankLabel: "Any cap surface", valueKey: "mushroomCapSurface" },
  { key: "mushroomStemFeature", label: "Stem feature", blankLabel: "Any stem feature", valueKey: "mushroomStemFeature" },
  { key: "mushroomSmell", label: "Smell", blankLabel: "Any smell", valueKey: "mushroomSmell" },
  { key: "mushroomTaste", label: "Taste clue (spit out)", blankLabel: "Any taste clue", valueKey: "mushroomTaste" },
  { key: "mushroomSubstrate", label: "Substrate / growing from", blankLabel: "Any substrate", valueKey: "mushroomSubstrate" },
  { key: "mushroomHabitat", label: "Habitat / setting", blankLabel: "Any habitat/setting", valueKey: "mushroomHabitat" },
  { key: "mushroomTreeType", label: "Tree type", blankLabel: "Any tree type", valueKey: "mushroomTreeType" },
  { key: "mushroomHost", label: "Host / associated tree", blankLabel: "Any host/associated tree", valueKey: "mushroomHost" },
  { key: "mushroomRing", label: "Ring", blankLabel: "Any ring", valueKey: "mushroomRing" },
  { key: "mushroomTexture", label: "Texture", blankLabel: "Any texture", valueKey: "mushroomTexture" }
];

const BOLETE_EXTRA_FILTER_DEFS = [
  { key: "mushroomBoleteGroup", label: "Quick ID group", blankLabel: "Any quick group", valueKey: "boleteQuickGroup" },
  { key: "mushroomTreeAssociation", label: "Tree association", blankLabel: "Any tree association", valueKey: "boleteTreeAssociation" }
];

const GILLED_MUSHROOM_FILTER_DEFS = MUSHROOM_CORE_FILTER_DEFS;
const BOLETE_FILTER_DEFS = [
  ...MUSHROOM_CORE_FILTER_DEFS,
  ...BOLETE_EXTRA_FILTER_DEFS
];
const OTHER_MUSHROOM_FILTER_DEFS = MUSHROOM_CORE_FILTER_DEFS;


const PLANT_LANES = [
  {
    id: "leaves-greens",
    label: "Leaves / Greens",
    short: "Leaves, shoots, fiddleheads, tender stems",
    patterns: [/\bleaf\b|\bleaves\b|\bgreen\b|\bgreens\b|\bshoot\b|\bshoots\b|\bfiddlehead\b|\bfiddleheads\b|\bstem\b|\bstalk\b|\bstalks\b|\bneedle\b|\bneedles\b/i]
  },
  {
    id: "flowers",
    label: "Flowers",
    short: "Flowers, blossoms, petals, pollen",
    patterns: [/\bflower\b|\bflowers\b|\bblossom\b|\bblossoms\b|\bpetal\b|\bpetals\b|\bpollen\b/i]
  },
  {
    id: "berries-fruits",
    label: "Berries / Fruits",
    short: "Berries, fruits, hips, cherries, pomes",
    patterns: [/\bberry\b|\bberries\b|\bfruit\b|\bfruits\b|\bhip\b|\bhips\b|\bcherry\b|\bcherries\b|\bapple\b|\bcrabapple\b|\bplum\b|\bgrape\b|\bgrapes\b|\bcurrant\b|\bcurrants\b|\bpersimmon\b|\bserviceberry\b|\bserviceberries\b/i]
  },
  {
    id: "roots-tubers",
    label: "Roots / Tubers",
    short: "Roots, rhizomes, bulbs, tubers",
    patterns: [/\broot\b|\broots\b|\brhizome\b|\brhizomes\b|\btuber\b|\btubers\b|\bbulb\b|\bbulbs\b|\bcorm\b|\bcorms\b|\bunderground\b/i]
  },
  {
    id: "nuts-seeds",
    label: "Nuts / Seeds",
    short: "Nuts, seeds, cones, grain-like parts",
    patterns: [/\bnut\b|\bnuts\b|\bseed\b|\bseeds\b|\bacorn\b|\bacorns\b|\bhazelnut\b|\bhazelnuts\b|\bbeechnut\b|\bbeechnuts\b|\bcone\b|\bcones\b|\bcatkin\b|\bcatkins\b/i]
  },
  {
    id: "trees-shrubs-sap",
    label: "Trees / Shrubs / Sap",
    short: "Woody trees and shrubs, including sap or bark uses",
    patterns: [/\btree\b|\btrees\b|\bshrub\b|\bshrubs\b|\bwoody\b|\bbramble\b|\bconifer\b|\bmaple\b|\bbirch\b|\bpine\b|\bspruce\b|\bhemlock\b|\bwillow\b/i]
  },
  {
    id: "tea-infusions",
    label: "Tea / Infusions",
    short: "Leaves, flowers, bark, or needles used as tea",
    patterns: [/\btea\b|\binfusion\b|\binfusions\b|\bsteep\b|\bsteeped\b|\bbrew\b|\bbrewed\b|\btisane\b/i],
    extraMatch(record) {
      const tags = asList(record.use_tags).map((value) => String(value || "").trim().toUpperCase());
      return tags.includes("T");
    }
  }
];

function plantRecordText(record = {}) {
  const profile = record.plant_profile || {};
  return [
    record.slug,
    record.display_name,
    record.common_name,
    record.category,
    record.foraging_class,
    record.food_role,
    record.plant_card_note,
    record.plant_lane_note,
    record.culinary_uses,
    record.edibility_detail,
    record.edibility_notes,
    record.other_uses,
    profile.parts_used,
    profile.useful_parts,
    profile.summary,
    ...asList(record.usable_parts),
    ...asList(record.plant_lanes),
    ...asList(record.use_tags)
  ].join(" ");
}

function plantLanesForRecord(record = {}) {
  const explicitIds = cleanOptionValues(record.plant_lanes).map((value) => value.toLowerCase());
  if (explicitIds.length) {
    const explicit = PLANT_LANES.filter((lane) => explicitIds.includes(lane.id));
    if (explicit.length) return explicit;
  }

  const text = plantRecordText(record);
  const lanes = PLANT_LANES.filter((lane) => {
    const patternHit = lane.patterns.some((pattern) => pattern.test(text));
    const extraHit = typeof lane.extraMatch === "function" && lane.extraMatch(record);
    return patternHit || extraHit;
  });
  return lanes.length ? lanes : [];
}

function plantLaneIdsForRecord(record = {}) {
  return new Set(plantLanesForRecord(record).map((lane) => lane.id));
}

function usablePartsForRecord(record = {}) {
  const explicit = cleanOptionValues(record.usable_parts);
  if (explicit.length) return explicit;
  return cleanOptionValues(collectValues(record, [["observedPart"], ["parts_used"], ["plant_parts"], ["category"], ["foraging_class"]]));
}

export function renderPlantLaneControls(records = [], filters = {}) {
  const selected = String(filters?.plantLane || "");
  const baseRecords = (records || []).filter((record) => !isSuppressed(record) && routeMatch(record, "plants"));
  const counts = new Map(PLANT_LANES.map((lane) => [lane.id, 0]));
  for (const record of baseRecords) {
    for (const lane of plantLanesForRecord(record)) {
      counts.set(lane.id, (counts.get(lane.id) || 0) + 1);
    }
  }
  const buttonHtml = (lane) => {
    const active = selected === lane.id;
    return `<button class="lane-card${active ? " active" : ""}" type="button" data-plant-lane="${esc(lane.id)}" aria-pressed="${active ? "true" : "false"}">
      <span class="lane-card-head">
        <span class="lane-card-title">${esc(lane.label)}</span>
        <span class="plant-lane-count">${counts.get(lane.id) || 0}</span>
      </span>
      <span class="lane-card-desc">${esc(lane.short)}</span>
    </button>`;
  };
  const selectedLabel = PLANT_LANES.find((lane) => lane.id === selected)?.label || "";
  return `
    <section class="panel plant-lane-switcher">
      <div class="home-focus-heading">
        <div>
          <h3>Start with what you see or want</h3>
          <p class="muted small">Pick one edible-plant lane. A plant can belong to several lanes, but this view shows one lane at a time.</p>
        </div>
        ${selected ? `<button id="plantLaneClearBtn" data-plant-lane-clear="1" type="button">Show all edible plants</button>` : ""}
      </div>
      <div class="lane-grid">${PLANT_LANES.map(buttonHtml).join("")}</div>
      <p class="muted small">${selectedLabel ? `Showing lane: ${esc(selectedLabel)}.` : `Showing all edible plant records. Pick a lane to narrow the list.`}</p>
    </section>
  `;
}


const SKIP_OPTION_VALUES = new Set(["", "unknown", "needs-review", "needs review", "review_required", "n/a", "not sure"]);
const MISSING_FILTER_VALUE = "__missing__";
const MISSING_FILTER_LABEL = "Not recorded / needs review";
const REVIEW_FLAG_SEASON = "__review__:season";
const REVIEW_FLAG_SUBSTRATE = "__review__:substrate";
const REVIEW_FLAG_HOST = "__review__:host";
const REVIEW_FLAG_STAINING = "__review__:staining";
const REVIEW_FLAG_FOOD_QUALITY = "__review__:food_quality";
const REVIEW_FLAG_PHOTOS_SOURCES = "__review__:photos_sources";
const REVIEW_FLAG_LABELS = new Map([
  [REVIEW_FLAG_SEASON, "Needs season review"],
  [REVIEW_FLAG_SUBSTRATE, "Needs substrate review"],
  [REVIEW_FLAG_HOST, "Needs host/tree review"],
  [REVIEW_FLAG_STAINING, "Needs bruising/staining review"],
  [REVIEW_FLAG_FOOD_QUALITY, "Needs food-quality review"],
  [REVIEW_FLAG_PHOTOS_SOURCES, "Needs photos/sources"]
]);
const TREE_TYPE_RE = /\b(hardwood|softwood|conifer|coniferous|deciduous|broadleaf|mixed woods?)\b/i;

const MISSING_REVIEW_LABELS_BY_VALUE_KEY = new Map([
  ["mushroomSubstrate", "Needs substrate review"],
  ["mushroomTreeType", "Tree association not recorded / needs review"],
  ["mushroomHost", "Associated tree not recorded / needs review"],
  ["mushroomCapColor", "Cap color not recorded / needs review"],
  ["mushroomUnderside", "Underside type not recorded / needs review"],
  ["mushroomUndersideColor", "Underside color not recorded / needs review"],
  ["mushroomStemColor", "Stem color not recorded / needs review"],
  ["mushroomStaining", "Bruising/staining not recorded / needs review"],
  ["mushroomFleshColor", "Flesh color not recorded / needs review"],
  ["mushroomSporePrintColor", "Spore print color not recorded / needs review"],
  ["mushroomPoreColor", "Pore color not recorded / needs review"],
  ["month", "Season not recorded / needs review"]
]);

function missingLabelForFilter(fieldOrDef = {}) {
  return MISSING_REVIEW_LABELS_BY_VALUE_KEY.get(fieldOrDef.valueKey) || MISSING_FILTER_LABEL;
}

function asList(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  return [value];
}

function nestedValue(source, path) {
  return path.reduce((value, key) => (value && typeof value === "object" ? value[key] : undefined), source);
}

function collectValues(record, paths = []) {
  return paths.flatMap((path) => asList(nestedValue(record, path)));
}

function normalizeOption(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/^\s+|\s+$/g, "");
}

function cleanOptionValues(values = []) {
  return values
    .flatMap((value) => asList(value))
    .map(normalizeOption)
    .filter((value) => value && !SKIP_OPTION_VALUES.has(value.toLowerCase()));
}

function hasLikelyDefaultSeason(record) {
  const precision = String(record.weekPrecision || record.week_precision || record.season_confidence || "").toLowerCase();
  if (precision.includes("needs-review") || precision.includes("needs review")) return true;

  const reviewReasons = [
    ...asList(record.reviewReasons),
    ...asList(record.review_reasons),
    ...asList(record.manual_review_reasons)
  ].join(" ").toLowerCase();
  if (reviewReasons.includes("needs species-level") || reviewReasons.includes("needs source links")) return true;

  const auditText = [
    record.notes,
    record.general_notes,
    record.culinary_uses,
    record.mushroom_profile?.summary,
    ...asList(record.mushroom_profile?.research_notes)
  ].join(" ");
  return isBuildNoteText(auditText);
}

function monthValues(record) {
  if (hasLikelyDefaultSeason(record)) return [];
  const names = cleanOptionValues(record.months_available);
  const fromSeasonMonths = asList(record.season_months)
    .map((value) => MONTHS[Number(value) - 1] || "")
    .filter(Boolean);
  const fromMonthNumbers = asList(record.month_numbers)
    .map((value) => MONTHS[Number(value) - 1] || "")
    .filter(Boolean);
  return cleanOptionValues([...names, ...fromSeasonMonths, ...fromMonthNumbers]);
}

function treeTypeValues(record) {
  const candidates = cleanOptionValues([
    ...collectValues(record, [["treeType"], ["wood_type"], ["mushroom_profile", "wood_type"]]),
    ...collectValues(record, [["host_filter_tokens"], ["mushroom_profile", "host_filter_tokens"]])
  ]);
  return candidates.filter((value) => TREE_TYPE_RE.test(value));
}

function hostTreeValues(record) {
  const candidates = cleanOptionValues([
    ...collectValues(record, [["hostTree"], ["host_trees"], ["mushroom_profile", "host_trees"]]),
    ...collectValues(record, [["host_filter_tokens"], ["mushroom_profile", "host_filter_tokens"]])
  ]);
  return candidates.filter((value) => !TREE_TYPE_RE.test(value));
}

const HARDWOOD_TREE_PATTERNS = [
  [/\bash\b/i, "Hardwood — Ash"],
  [/\baspen\b|\bpoplar\b/i, "Hardwood — Aspen / poplar"],
  [/\bbirch\b/i, "Hardwood — Birch"],
  [/\bbeech\b/i, "Hardwood — Beech"],
  [/\boak\b/i, "Hardwood — Oak"],
  [/\bmaple\b/i, "Hardwood — Maple"],
  [/\bhickory\b/i, "Hardwood — Hickory"]
];

const SOFTWOOD_TREE_PATTERNS = [
  [/\bpine\b/i, "Softwood / conifer — Pine"],
  [/\bhemlock\b/i, "Softwood / conifer — Hemlock"],
  [/\bspruce\b/i, "Softwood / conifer — Spruce"],
  [/\bfir\b/i, "Softwood / conifer — Fir"],
  [/\blarch\b|\btamarack\b/i, "Softwood / conifer — Larch / tamarack"]
];

function anyText(record = {}) {
  return [
    record.slug,
    record.display_name,
    record.common_name,
    record.scientific_name,
    record.mushroom_family,
    ...asList(record.boleteGroup),
    ...asList(record.boleteSubgroup),
    ...collectValues(record, [["pore_color"], ["mushroom_profile", "pore_color"]]),
    ...collectValues(record, [["staining"], ["mushroom_profile", "staining"]]),
    ...collectValues(record, [["cap_surface"], ["mushroom_profile", "cap_surface"]]),
    ...collectValues(record, [["stem_feature"], ["mushroom_profile", "stem_feature"]]),
    ...collectValues(record, [["substrate"], ["mushroom_profile", "substrate"]]),
    ...collectValues(record, [["host_filter_tokens"], ["mushroom_profile", "host_filter_tokens"]])
  ].join(" ").toLowerCase();
}

function hasAny(text, patterns = []) {
  return patterns.some((pattern) => pattern.test(text));
}

function broadValuesFromText(values = [], rules = []) {
  const hay = cleanOptionValues(values).join(" | ").toLowerCase();
  const out = [];
  for (const [pattern, label] of rules) {
    if (pattern.test(hay)) out.push(label);
  }
  return [...new Set(out)];
}

function withoutGenericBoleteDefaults(values = []) {
  return cleanOptionValues(values).filter((value) => {
    const text = value.toLowerCase();
    return text !== "dry to slightly tacky"
      && text !== "smooth to netted stem"
      && text !== "smooth to finely reticulate stem"
      && text !== "whitish to yellow pores"
      && text !== "pores or odd pore surface";
  });
}

function mushroomProfileValues(record = {}, keys = []) {
  const profile = record.mushroom_profile || {};
  const paths = [];
  for (const key of keys) {
    paths.push([key]);
    paths.push([key.replaceAll("_", "")]);
    paths.push(["mushroom_profile", key]);
    paths.push(["mushroom_profile", key.replaceAll("_", "")]);
  }
  return collectValues(record, paths);
}

function broadColorValues(values = []) {
  const hay = cleanOptionValues(values).join(" | ").toLowerCase();
  const out = [];
  const rules = [
    [/\bwhite|whitish|ivory|pale\b|cream|buff/, "White / cream / buff"],
    [/\byellow|gold|golden|lemon|sulphur|sulfur/, "Yellow / golden"],
    [/\borange|apricot|salmon/, "Orange / salmon"],
    [/\bred\b|reddish|scarlet|brick|carmine|rose|pink|pinkish/, "Red / pink"],
    [/\bpurple|violet|lilac|lavender|amethyst/, "Purple / violet"],
    [/\bblue|bluish/, "Blue"],
    [/\bgreen|greenish|olive/, "Green / olive"],
    [/\bbrown|tan|chestnut|cinnamon|rust|rusty|umber|ochre|ocher|beige/, "Brown / tan"],
    [/\bgray|grey|silver|ashy/, "Gray"],
    [/\bblack|blackish|sooty|dark/, "Black / dark"],
    [/\bclear|hyaline/, "Clear / translucent"]
  ];
  for (const [pattern, label] of rules) {
    if (pattern.test(hay)) out.push(label);
  }
  return [...new Set(out)];
}

function mushroomFieldText(record = {}) {
  const profile = record.mushroom_profile || {};
  return [
    record.field_identification,
    record.identification,
    record.overview,
    profile.summary,
    profile.ecology,
    ...asList(profile.research_notes)
  ].join(" | ");
}

function contextSnippets(text = "", terms = []) {
  const source = String(text || "");
  const snippets = [];
  for (const term of terms) {
    const pattern = new RegExp(`[^.;|,]{0,80}\\b${term}\\b[^.;|,]{0,100}`, "gi");
    snippets.push(...(source.match(pattern) || []).map((value) => String(value || "")
      .replace(/\b(?:blue|green|brown|gray|grey|red|pink|yellow|black|dark)\s+(?:bruising|staining|stain|bruise)[^.;|,]*/gi, "")
      .replace(/(?:bruising|staining|stains?|bruises?)\s+(?:blue|green|brown|gray|grey|red|pink|yellow|black|dark)[^.;|,]*/gi, "")
    ));
  }
  return snippets;
}

function mushroomCapColorValues(record = {}) {
  return broadColorValues([
    ...mushroomProfileValues(record, [
      "cap_color", "cap_colours", "cap_colors", "pileus_color", "cap_description"
    ]),
    ...contextSnippets(mushroomFieldText(record), ["cap", "pileus"]),
    record.common_name,
    record.display_name
  ]);
}

function mushroomUndersideTypeValues(record = {}) {
  const explicit = cleanOptionValues(collectValues(record, [
    ["underside"], ["underside_type"], ["fertile_surface"],
    ["mushroom_profile", "underside"], ["mushroom_profile", "underside_type"], ["mushroom_profile", "fertile_surface"]
  ]));
  const hay = [record.lane, ...explicit].join(" | ").toLowerCase();
  const out = [];
  if (/gill|lamella/.test(hay)) out.push("Gills");
  if (/pore|tube|sponge|bolete/.test(hay)) out.push("Pores / tubes");
  if (/tooth|teeth|spine/.test(hay)) out.push("Teeth / spines");
  if (/ridge|false gill|chanterelle/.test(hay)) out.push("Ridges / false gills");
  if (/smooth|crust|cup|jelly|coral|club|puffball|shelf|bracket/.test(hay)) out.push("Other / smooth / irregular");
  return out.length ? [...new Set(out)] : explicit;
}

function mushroomUndersideColorValues(record = {}) {
  return broadColorValues([
    ...mushroomProfileValues(record, [
      "underside_color", "fertile_surface_color", "gill_color", "gill_colours", "pore_color",
      "pore_colours", "tooth_color", "teeth_color", "ridge_color", "hymenium_color"
    ]),
    ...contextSnippets(mushroomFieldText(record), ["underside", "gill", "gills", "pore", "pores", "tooth", "teeth", "ridge", "ridges"])
  ]);
}

function mushroomStemColorValues(record = {}) {
  return broadColorValues([
    ...mushroomProfileValues(record, [
      "stem_color", "stipe_color", "stem_colours", "stem_description"
    ]),
    ...contextSnippets(mushroomFieldText(record), ["stem", "stipe"] )
  ]);
}

function mushroomFleshColorValues(record = {}) {
  return broadColorValues([
    ...mushroomProfileValues(record, [
      "flesh_color", "flesh_colours", "context_color", "cut_flesh_color", "interior_color"
    ]),
    ...contextSnippets(mushroomFieldText(record), ["flesh", "context", "cut"] )
  ]);
}

function mushroomSporePrintColorValues(record = {}) {
  return broadColorValues(mushroomProfileValues(record, [
    "spore_print", "spore_print_color", "spore_color", "spore_deposit_color"
  ]));
}

function mushroomStainingValues(record = {}) {
  return broadValuesFromText(collectValues(record, [["staining"], ["bruising"], ["color_change"], ["mushroom_profile", "staining"], ["mushroom_profile", "bruising"], ["mushroom_profile", "color_change"]]), [
    [/blue/, "Blue bruising"],
    [/green/, "Green staining"],
    [/brown|gray|grey|black|dark/, "Brown / gray / dark staining"],
    [/red|reddish|rose|pink/, "Red / pink staining"],
    [/none|not notable|no notable|does not bruise|unchanging/, "No notable bruising"],
    [/yellow/, "Yellow staining"]
  ]);
}

function mushroomTasteValues(record = {}) {
  return broadValuesFromText(collectValues(record, [["taste"], ["mushroom_profile", "taste"]]), [
    [/bitter/, "Bitter"],
    [/mild|not distinctive|pleasant/, "Mild / not distinctive"],
    [/pepper|acrid|hot|sharp/, "Peppery / acrid"],
    [/sweet|nutty|rich/, "Pleasant / nutty"],
    [/mealy|farinaceous|cucumber/, "Mealy / cucumber-like"],
    [/fishy|seafood/, "Fishy / seafood-like"]
  ]);
}

function boleteQuickGroupValues(record) {
  const text = anyText(record);
  const out = [];
  if (/suillus|slippery jack|butterball|chicken-fat|larch suillus|glandular dots/.test(text)) {
    out.push("Suillus / slippery jacks");
  }
  if (/leccinum|scaber/.test(text)) {
    out.push("Scaber-stalk boletes");
  }
  if (/porcini|king bolete|boletus separans|variipes|auripes|subcaerulescens|boletus atkinsonii/.test(text)) {
    out.push("King / porcini-type boletes");
  }
  if (/tylopilus|bitter|pink-pored|pinkish pores|caloboletus/.test(text)) {
    out.push("Bitter / pink-pored boletes");
  }
  if (/red-pored|red pores|orange-red|red\s*\/\s*orange|red-staining|red staining|lurid|frostii|sensibilis|subvelutipes|bicolor|baorangia|exsudoporus|butyriboletus|blue staining \/ caution/.test(text)) {
    out.push("Red/orange-pored caution boletes");
  }
  if (/parasitic|earthball|ash-tree|ash tree|boletinellus|buchwaldoboletus|wood-inhabiting|dead wood|fungus-associated|old man|strobilomyces|shaggy/.test(text)) {
    out.push("Oddballs / wood / parasitic boletes");
  }
  if (!out.length) out.push("Other brown/yellow-pored boletes");
  return [...new Set(out)];
}

function boleteTreeAssociationValues(record) {
  const values = cleanOptionValues([
    ...collectValues(record, [["wood_type"], ["mushroom_profile", "wood_type"]]),
    ...collectValues(record, [["host_trees"], ["mushroom_profile", "host_trees"]]),
    ...collectValues(record, [["host_filter_tokens"], ["mushroom_profile", "host_filter_tokens"]])
  ]);
  const hay = values.join(" | ").toLowerCase();
  const out = [];
  if (/hardwood|deciduous|broadleaf|ash|aspen|poplar|birch|beech|oak|maple|hickory/.test(hay)) out.push("Hardwood");
  if (/softwood|conifer|pine|hemlock|spruce|fir|larch|tamarack/.test(hay)) out.push("Softwood / conifer");
  for (const [pattern, label] of HARDWOOD_TREE_PATTERNS) {
    if (pattern.test(hay)) out.push(label);
  }
  for (const [pattern, label] of SOFTWOOD_TREE_PATTERNS) {
    if (pattern.test(hay)) out.push(label);
  }
  return [...new Set(out)];
}

function boletePoreColorValues(record) {
  return broadValuesFromText(withoutGenericBoleteDefaults(collectValues(record, [["poreColor"], ["pore_color"], ["mushroom_profile", "pore_color"]])), [
    [/pink|rose/, "Pinkish"],
    [/red|orange/, "Red / orange"],
    [/yellow|white|whitish|cream|pale/, "White / yellow"],
    [/brown|gray|grey|black|dark|olive/, "Gray / brown / dark"]
  ]);
}

function boleteStainingValues(record) {
  return broadValuesFromText(collectValues(record, [["staining"], ["mushroom_profile", "staining"]]), [
    [/blue/, "Blue bruising"],
    [/green/, "Green staining"],
    [/brown|gray|grey|black/, "Brown / gray / dark staining"],
    [/red|reddish|rose|pink/, "Red / pink staining"],
    [/none|not notable|no notable/, "No notable bruising"],
    [/yellow/, "Yellow staining"]
  ]);
}

function boleteCapSurfaceValues(record) {
  return broadValuesFromText(withoutGenericBoleteDefaults(collectValues(record, [["capSurface"], ["cap_surface"], ["mushroom_profile", "cap_surface"]])), [
    [/sticky|slimy|viscid|tacky|glutinous/, "Sticky / slimy"],
    [/dry/, "Dry"],
    [/crack|areolate/, "Cracked"],
    [/velvet|suede|tomentose|hairy/, "Velvety / suede"],
    [/scaly|shaggy|rough/, "Scaly / shaggy"],
    [/smooth/, "Smooth"]
  ]);
}

function boleteStemFeatureValues(record) {
  return broadValuesFromText(withoutGenericBoleteDefaults(collectValues(record, [["stemFeature"], ["stem_feature"], ["mushroom_profile", "stem_feature"]])), [
    [/scaber|rough dots/, "Scabers / rough dots"],
    [/netted|reticulate/, "Netting"],
    [/glandular/, "Glandular dots"],
    [/ring|annulus/, "Ring"],
    [/hollow|brittle/, "Hollow / brittle"],
    [/smooth/, "Smooth"],
    [/no real stem|sessile|no stem/, "No real stem"]
  ]);
}

function boleteTasteValues(record) {
  return broadValuesFromText(collectValues(record, [["taste"], ["mushroom_profile", "taste"]]), [
    [/bitter/, "Bitter"],
    [/mild|not distinctive|pleasant/, "Mild / not distinctive"],
    [/pepper|acrid|hot/, "Peppery / acrid"],
    [/sweet|nutty|rich/, "Pleasant / nutty"]
  ]);
}

function mushroomHabitatValues(record = {}) {
  const values = [
    ...collectValues(record, [["habitats"], ["habitat"], ["habitat_detail"]]),
    ...collectValues(record, [["mushroom_profile", "substrate"], ["mushroom_profile", "season_note"]]),
    record.notes,
    record.general_notes
  ];
  const hay = values.join(" | ").toLowerCase();
  const out = [];
  if (/forest|woods|woodland|hardwood|conifer|pine|oak|birch|aspen|hemlock|mixed woods?/.test(hay)) out.push("Forest / woods");
  if (/lawn|yard|grass|turf/.test(hay)) out.push("Lawn / yard");
  if (/meadow|field|pasture|prairie|open area/.test(hay)) out.push("Meadow / field");
  if (/swamp|bog|marsh|wetland|wet woods|sphagnum/.test(hay)) out.push("Swamp / wetland");
  if (/burn|fire|charred/.test(hay)) out.push("Burn area");
  if (/roadside|disturbed|mulch|wood chips|garden|compost/.test(hay)) out.push("Disturbed / human-influenced");
  if (/dead wood|log|stump|standing dead|wood|branch/.test(hay)) out.push("Dead wood / logs / stumps");
  if (/living tree|wounded|base of|trunk/.test(hay)) out.push("Living or wounded tree");
  return [...new Set(out)];
}

function isPlaceholderImageValue(value = "") {
  const text = String(value || "").toLowerCase();
  return text.startsWith("data:image/svg")
    || text.includes("image%20needed")
    || text.includes("image needed")
    || text.includes("placeholder image");
}

function hasUsableFieldImage(record = {}) {
  const values = [
    ...asList(record.images_structured).map((image) => typeof image === "string" ? image : (image.url || image.src || "")),
    ...asList(record.list_thumbnail),
    ...asList(record.detail_images),
    ...asList(record.enlarge_images),
    ...asList(record.images)
  ].filter(Boolean);
  return values.some((value) => !isPlaceholderImageValue(value));
}

function hasImageCoverage(record = {}) {
  return hasUsableFieldImage(record);
}

function hasSourceLinks(record = {}) {
  return asList(record.links).length > 0 || asList(record.use_links).length > 0;
}

function reviewText(record = {}) {
  return [
    ...asList(record.reviewReasons),
    ...asList(record.review_reasons),
    ...asList(record.manual_review_reasons),
    ...asList(record.image_review_reasons),
    record.image_review_status,
    record.notes,
    record.general_notes,
    record.culinary_uses,
    record.mushroom_profile?.summary,
    ...asList(record.mushroom_profile?.research_notes)
  ].join(" ").toLowerCase();
}

function hasBuildAuditSignals(record = {}) {
  const text = reviewText(record);
  return text.includes("needs species-level")
    || text.includes("needs source links")
    || text.includes("seed entry")
    || text.includes("audit pass")
    || text.includes("clean app")
    || isBuildNoteText(text);
}

function reviewFlagValues(record) {
  const flags = [];
  const substrateValues = cleanOptionValues(collectValues(record, [["substrate"], ["mushroom_profile", "substrate"]]));
  const treeType = treeTypeValues(record);
  const hostTree = hostTreeValues(record);
  const staining = cleanOptionValues(collectValues(record, [["staining"], ["mushroom_profile", "staining"]]));
  const foodQuality = String(record.food_quality || "").trim();

  if (hasLikelyDefaultSeason(record)) flags.push(REVIEW_FLAG_SEASON);
  if (substrateValues.length === 0) flags.push(REVIEW_FLAG_SUBSTRATE);
  if (treeType.length === 0 && hostTree.length === 0) flags.push(REVIEW_FLAG_HOST);
  if (staining.length === 0) flags.push(REVIEW_FLAG_STAINING);
  if (!foodQuality || hasBuildAuditSignals(record)) flags.push(REVIEW_FLAG_FOOD_QUALITY);
  if (!hasImageCoverage(record) || !hasSourceLinks(record) || reviewText(record).includes("needs image coverage")) flags.push(REVIEW_FLAG_PHOTOS_SOURCES);

  return flags;
}

function valuesForFilter(record, valueKey) {
  switch (valueKey) {
    case "month": return monthValues(record);
    case "plantPart": return cleanOptionValues([...usablePartsForRecord(record), ...collectValues(record, [["observedPart"], ["parts_used"], ["plant_parts"], ["category"], ["foraging_class"]])]);
    case "plantHabitat": return cleanOptionValues(collectValues(record, [["habitats"], ["habitat"]]));
    case "plantSize": return cleanOptionValues(collectValues(record, [["size"]]));
    case "plantTaste": return cleanOptionValues(collectValues(record, [["taste"]]));
    case "plantFlowerColor": return cleanOptionValues(collectValues(record, [["flowerColor"], ["flower_color"]]));
    case "plantFruitColor": return cleanOptionValues(collectValues(record, [["fruitColor"], ["fruit_color"], ["berryColor"], ["berry_color"]]));
    case "plantLeafShape": return cleanOptionValues(collectValues(record, [["leafShape"], ["leaf_shape"]]));
    case "plantLeafArrangement": return cleanOptionValues(collectValues(record, [["leafArrangement"], ["leaf_arrangement"]]));
    case "plantStem": return cleanOptionValues(collectValues(record, [["stemSurface"], ["stem_surface"], ["stemShape"], ["stem_shape"], ["leafPointCount"]]));
    case "mushroomReviewFlag": return reviewFlagValues(record);
    case "boleteQuickGroup": return boleteQuickGroupValues(record);
    case "boleteTreeAssociation": return boleteTreeAssociationValues(record);
    case "boletePoreColor": return boletePoreColorValues(record);
    case "boleteStaining": return boleteStainingValues(record);
    case "boleteCapSurface": return boleteCapSurfaceValues(record);
    case "boleteStemFeature": return boleteStemFeatureValues(record);
    case "boleteTaste": return boleteTasteValues(record);
    case "mushroomHabitat": return mushroomHabitatValues(record);
    case "mushroomSubstrate": return cleanOptionValues(collectValues(record, [["substrate"], ["mushroom_profile", "substrate"]]));
    case "mushroomTreeType": return treeTypeValues(record);
    case "mushroomHost": return hostTreeValues(record);
    case "mushroomCapColor": return mushroomCapColorValues(record);
    case "mushroomUnderside": return mushroomUndersideTypeValues(record);
    case "mushroomUndersideColor": return mushroomUndersideColorValues(record);
    case "mushroomStemColor": return mushroomStemColorValues(record);
    case "mushroomFleshColor": return mushroomFleshColorValues(record);
    case "mushroomSporePrintColor": return mushroomSporePrintColorValues(record);
    case "mushroomRing": return cleanOptionValues(collectValues(record, [["ring"], ["mushroom_profile", "ring"]]));
    case "mushroomTexture": return cleanOptionValues(collectValues(record, [["texture"], ["mushroom_profile", "texture"]]));
    case "mushroomSmell": return cleanOptionValues(collectValues(record, [["smell"], ["odor"], ["mushroom_profile", "smell"], ["mushroom_profile", "odor"]]));
    case "mushroomStaining": return mushroomStainingValues(record);
    case "mushroomCapSurface": return cleanOptionValues(collectValues(record, [["capSurface"], ["cap_surface"], ["mushroom_profile", "cap_surface"]]));
    case "mushroomStemFeature": return cleanOptionValues(collectValues(record, [["stemFeature"], ["stem_feature"], ["mushroom_profile", "stem_feature"]]));
    case "mushroomTaste": return mushroomTasteValues(record);
    case "mushroomBoleteGroup": return cleanOptionValues(collectValues(record, [["boleteGroup"], ["mushroom_family"]]));
    case "mushroomBoleteSubgroup": return cleanOptionValues(collectValues(record, [["boleteSubgroup"]]));
    case "mushroomPoreColor": return mushroomUndersideColorValues(record);
    default: return [];
  }
}

function filterDefinitionsForRoute(route) {
  if (route === "plants") return PLANT_FILTER_DEFS;
  if (route === "mushrooms-gilled") return GILLED_MUSHROOM_FILTER_DEFS;
  if (route === "boletes") return BOLETE_FILTER_DEFS;
  if (route === "mushrooms-other") return OTHER_MUSHROOM_FILTER_DEFS;
  return [];
}

function displayOptionValue(value, fieldOrDef = {}) {
  if (value === MISSING_FILTER_VALUE) return missingLabelForFilter(fieldOrDef);
  if (REVIEW_FLAG_LABELS.has(value)) return REVIEW_FLAG_LABELS.get(value);
  return value;
}

function sortOptions(values, valueKey = "") {
  const unique = [...new Set(cleanOptionValues(values))];
  return unique.sort((a, b) => {
    if (REVIEW_FLAG_LABELS.has(a) && !REVIEW_FLAG_LABELS.has(b)) return 1;
    if (REVIEW_FLAG_LABELS.has(b) && !REVIEW_FLAG_LABELS.has(a)) return -1;
    if (a === MISSING_FILTER_VALUE) return 1;
    if (b === MISSING_FILTER_VALUE) return -1;
    if (valueKey === "month") return MONTHS.indexOf(a) - MONTHS.indexOf(b);
    return displayOptionValue(a).localeCompare(displayOptionValue(b));
  });
}

function matchesTraitFiltersExcept(record, route, filters = {}, exceptKey = "") {
  const defs = filterDefinitionsForRoute(route);
  if (!defs.length) return true;
  return defs.every((def) => {
    if (def.key === exceptKey) return true;
    const selected = String(filters?.[def.key] || "").trim();
    if (!selected) return true;
    const values = valuesForFilter(record, def.valueKey);
    if (selected === MISSING_FILTER_VALUE) return values.length === 0;
    return values.includes(selected);
  });
}

export function getFilterFieldsForRoute(records, route, filters = {}) {
  const defs = filterDefinitionsForRoute(route);
  if (!defs.length) return [];
  const baseRecords = (records || []).filter((record) => !isSuppressed(record) && routeMatch(record, route));
  return defs.map((def) => {
    const selected = String(filters?.[def.key] || "").trim();
    const recordsForThisField = baseRecords.filter((record) => matchesTraitFiltersExcept(record, route, filters, def.key));
    const counts = new Map();
    let missingCount = 0;

    for (const record of recordsForThisField) {
      const values = [...new Set(valuesForFilter(record, def.valueKey))];
      if (!values.length) {
        missingCount += 1;
        continue;
      }
      values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
    }

    const values = sortOptions([...counts.keys()], def.valueKey);
    const options = values.map((value) => ({
      value,
      label: `${displayOptionValue(value, def)} (${counts.get(value) || 0})`
    }));

    if (missingCount > 0 && def.valueKey !== "mushroomReviewFlag") {
      options.push({ value: MISSING_FILTER_VALUE, label: `${missingLabelForFilter(def)} (${missingCount})` });
    }

    if (selected && !options.some((option) => option.value === selected)) {
      options.push({
        value: selected,
        label: `${displayOptionValue(selected, def)} (0)`
      });
    }

    return { ...def, options };
  }).filter((field) => field.options.length > 0 || String(filters?.[field.key] || "").trim());
}

export function hasActiveTraitFilters(route, filters = {}) {
  return filterDefinitionsForRoute(route).some((def) => !!filters?.[def.key]) || (route === "plants" && !!filters?.plantLane);
}

function hasFilterValueMissing(record, valueKey) {
  return valuesForFilter(record, valueKey).length === 0;
}

function hasSeasonReviewFlag(record) {
  return hasLikelyDefaultSeason(record);
}

function imageReviewTags(record = {}) {
  if (record.record_type !== "mushroom") return [];
  const reasons = asList(record.image_review_reasons).join(" ").toLowerCase();
  const status = String(record.image_review_status || "").toLowerCase();
  const review = reviewText(record);
  const tags = [];
  if (!hasUsableFieldImage(record) || /needs_field_photo|needs field photo|placeholder/.test(`${status} ${reasons} ${review}`)) {
    tags.push("Needs field photo");
  } else if (/review|subpar|bad|replace|microscope|micrograph|blurry|wrong/.test(`${status} ${reasons}`)) {
    tags.push("Image needs review");
  }
  return [...new Set(tags)];
}

function dataQualityTags(record, route = "general") {
  const tags = [];
  if (route === "boletes") {
    reviewFlagValues(record).forEach((flag) => {
      const label = REVIEW_FLAG_LABELS.get(flag);
      if (label) tags.push(label);
    });
  }
  if (["mushrooms-gilled", "mushrooms-other"].includes(route) && hasSeasonReviewFlag(record)) {
    tags.push("Season needs review");
  }
  if (["mushrooms-gilled", "boletes", "mushrooms-other", "review"].includes(route)) {
    imageReviewTags(record).forEach((label) => tags.push(label));
  }
  return [...new Set(tags)];
}

function labelTag(label, value, className = "") {
  const text = String(value || "").trim();
  if (!text) return "";
  const cls = className ? `tag ${className}` : "tag";
  return `<span class="${cls}">${esc(label)}: ${esc(text)}</span>`;
}

function laneLabel(record = {}) {
  const lane = String(record.lane || "").toLowerCase();
  if (lane === "gilled") return "Gilled";
  if (lane === "bolete") return "Pores / spongy underside";
  if (lane === "other") return "Other form";
  return String(record.lane || "");
}

function seasonSummary(record = {}) {
  const months = monthValues(record);
  if (months.length) {
    if (months.length === 1) return months[0];
    return `${months[0]}–${months[months.length - 1]}`;
  }
  const note = String(record.mushroom_profile?.season_note || record.season_note || "").trim();
  if (/spring/i.test(note)) return "Spring";
  if (/summer.*fall|late summer.*fall/i.test(note)) return "Late summer–fall";
  if (/summer/i.test(note)) return "Summer";
  if (/fall|autumn/i.test(note)) return "Fall";
  if (/year-round|year round|perennial/i.test(note)) return "Year-round";
  return "Needs review";
}

function substrateSummary(record = {}) {
  const substrate = firstCleanListText([
    asList(record.mushroom_profile?.substrate).join(", "),
    asList(record.substrate).join(", ")
  ]);
  return substrate;
}


function isRedundantCautionMeta(record = {}) {
  const severity = String(record.non_edible_severity || "").trim().toLowerCase();
  const foodQuality = String(record.food_quality || "").trim().toLowerCase();
  if (!severity) return true;
  if (severity === "caution" || severity === "caution group") return true;
  if (severity.replace(/\s+/g, " ") === "caution / not recommended as food") return true;
  if (severity.includes("not recommended as food") && foodQuality.includes("not recommended")) return true;
  if (severity.includes("not recommended") && foodQuality.includes("not recommended")) return true;
  return false;
}

function realText(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function hasTeaUse(record = {}) {
  const tags = asList(record.use_tags).map((value) => String(value || "").trim().toUpperCase());
  if (tags.includes("T")) return true;
  if (asList(record.plant_lanes).map((value) => String(value || "").toLowerCase()).includes("tea-infusions")) return true;
  const edibleUse = record.edible_use || {};
  if (/tea|infusion|beverage/i.test(String(edibleUse.method || ""))) return true;
  const text = [
    record.culinary_uses,
    record.medicinal_uses,
    record.plant_card_note,
    record.plant_lane_note,
    record.other_uses,
    ...asList(record.usable_parts)
  ].join(" ");
  return /\btea\b|\binfusion\b|\binfusions\b|\bsteep\b|\bsteeped\b|\btisane\b/i.test(text);
}

function hasRealOtherUse(record = {}, info = {}) {
  if (info.otherUses) return true;
  return !!realText(record.other_uses || record.otherUses || record.practical_uses);
}

function useRoleLabels(record = {}, info = {}) {
  const explicit = cleanOptionValues(record.use_roles);
  const roles = [];
  if (explicit.length) {
    explicit.forEach((role) => roles.push(role));
    const hasFoodRole = roles.some((role) => /\b(food|culinary|edible)\b/i.test(String(role || "")));
    if (info.edible && !hasFoodRole) roles.unshift("Food");
  } else {
    if (info.edible) roles.push("Food");
    if (hasTeaUse(record)) roles.push("Tea");
    if (info.medicinal) roles.push("Medicinal");
    if (hasRealOtherUse(record, info)) roles.push("Other use");
  }
  return [...new Set(roles.map((role) => String(role || "").trim()).filter(Boolean))];
}

function useRoleTag(record = {}, info = {}) {
  const roles = useRoleLabels(record, info);
  if (!roles.length) return "";
  return `<span class="tag good">Uses: ${esc(roles.join(" · "))}</span>`;
}

function isSafetyOnlyValue(value = "") {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return false;
  if (/\b(choice|prime|excellent|very good|good|fair|poor|mediocre|modest|niche|tea|flavoring)\b/.test(text)) return false;
  return /\b(caution|use with caution|edible with caution|expert confirmation|avoid|not recommended|do not eat|poisonous|toxic|deadly|inedible|not food)\b/.test(text);
}

function isQualityValue(value = "") {
  const text = String(value || "").trim();
  if (!text) return false;
  if (/^(food|edible|tea|medicinal|other use|other|yes|true)$/i.test(text)) return false;
  if (isSafetyOnlyValue(text)) return false;
  return /prime|choice|excellent|very good|good|fair|poor|mediocre|modest|occasional|niche|processed|tea|flavoring/i.test(text);
}

function foodSafetyText(record = {}) {
  const edibility = String(record.edibility_status || record.mushroom_profile?.edibility_status || "").trim().toLowerCase();
  const severity = realText(record.non_edible_severity || record.danger_level || "");
  const reason = realText(record.caution_reason || "");
  if (/deadly|fatal|lethal/.test(`${edibility} ${severity}`.toLowerCase())) return severity || "Deadly poisonous";
  if (/poison|toxic/.test(`${edibility} ${severity}`.toLowerCase())) return severity || "Poisonous";
  if (/not_edible|not edible|inedible|avoid|not_recommended|not recommended/.test(`${edibility} ${severity}`.toLowerCase())) return severity || "Not recommended for food";
  if (/edible[_-]with[_-]caution|high_caution|strict/.test(edibility) || reason) return "Edible with caution";
  if (/edible[_-]with[_-]confident[_-]id|confident/.test(edibility)) return "Edible with confident ID";
  if (/edible[_-]with[_-]preparation|preparation/.test(edibility)) return "Needs proper preparation";
  return "";
}

function foodSafetyTag(record = {}) {
  const value = foodSafetyText(record);
  if (!value) return "";
  const cls = /deadly|poison|toxic|avoid|inedible|not recommended/i.test(value) ? "danger" : "caution";
  return labelTag("Safety", value, cls);
}

function lookalikeRiskTag(record = {}) {
  const risk = record.lookalike_risk;
  if (!risk || typeof risk !== "object" || Array.isArray(risk)) return "";
  const level = Number(risk.level);
  if (!Number.isFinite(level)) return "";
  const safeLevel = Math.max(0, Math.min(3, Math.round(level)));
  const fallback = [
    "Low",
    "Moderate",
    "High",
    "Extreme"
  ][safeLevel] || "Needs review";
  const label = realText(risk.short_label || risk.label || fallback);
  const cls = safeLevel >= 3 ? "danger" : (safeLevel === 2 ? "caution" : (safeLevel === 1 ? "review" : "good"));
  return labelTag("Look-alike risk", `${safeLevel} — ${label}`, cls);
}

function lookalikeRiskTitleBadge(record = {}) {
  const risk = record.lookalike_risk;
  if (!risk || typeof risk !== "object" || Array.isArray(risk)) return "";
  const level = Number(risk.level);
  if (!Number.isFinite(level)) return "";
  const safeLevel = Math.max(0, Math.min(3, Math.round(level)));
  const fallback = ["Low", "Moderate", "High", "Extreme"][safeLevel] || "Needs review";
  const label = realText(risk.short_label || risk.label || fallback);
  const cls = `lookalike-title-risk level-${safeLevel}`;
  return `<span class="${cls}" aria-label="Look-alike risk ${safeLevel}: ${esc(label)}"><span class="risk-kicker">Look-alike</span><strong>${safeLevel}</strong><span>${esc(label)}</span></span>`;
}

function isRareCommonality(value = "") {
  return /\brare\b|uncommon|scarce|infrequent/i.test(String(value || ""));
}

function cleanForagingQuality(value = "") {
  return realText(value)
    .replace(/\s*\/\s*caution\b/gi, "")
    .replace(/\bcaution\s*food\b/gi, "")
    .replace(/\bedible\s+with\s+caution\b/gi, "edible")
    .replace(/\badvanced\s+edible[- ]with[- ]caution\b/gi, "Advanced edible")
    .replace(/\bID[- ]learning\s*\/\s*caution\s*food\b/gi, "ID-learning; fair edible")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\s*\/\s*$/g, "")
    .trim();
}

function foragingValueText(record = {}) {
  const explicit = cleanForagingQuality(record.foraging_value || record.food_value || "");
  if (explicit && isQualityValue(explicit)) return explicit;
  const legacy = cleanForagingQuality(record.food_quality || "");
  if (!isQualityValue(legacy)) return "";
  if (isRareCommonality(record.commonness) && /choice|excellent|very good|good|prime/i.test(legacy)) {
    return `${legacy}; low practical value if locally rare`;
  }
  return legacy;
}

function isPrimeForagingValue(value = "") {
  return /\bprime\b|\bchoice\b|\bexcellent\b|\bbest\b|\btop[- ]?tier\b/i.test(value);
}

function foragingValueTag(record = {}) {
  const value = foragingValueText(record);
  if (!value) return "";
  const caution = /poor|low practical value|advanced|expert/i.test(value);
  if (isPrimeForagingValue(value) && !caution) return `<span class="tag good">Food / forage value: Prime</span>`;
  return labelTag("Food / forage value", value, caution ? "caution" : "good");
}

function makeMeta(record, route = "general", options = {}) {
  const info = classifyRecord(record);
  const edibleUse = record.edible_use || null;
  const bits = [];
  const isMushroomList = ["mushrooms-gilled", "boletes", "mushrooms-other"].includes(route) && record.record_type === "mushroom";

  if (!isMushroomList) {
    if (record.record_type === "mushroom") {
      bits.push(labelTag("Type", laneLabel(record)));
    } else if (record.foraging_class) {
      bits.push(labelTag("Type", String(record.foraging_class).replaceAll("_", " ")));
    } else if (record.category) {
      bits.push(labelTag("Type", record.category));
    }
  }

  bits.push(useRoleTag(record, info));
  bits.push(foodSafetyTag(record));
  if (options.includeLookalikeRisk !== false) bits.push(lookalikeRiskTag(record));
  bits.push(foragingValueTag(record));
  bits.push(labelTag("Season", seasonSummary(record)));
  if (record.commonness) bits.push(labelTag("Commonality", record.commonness));
  if (isMushroomList) {
    bits.push(labelTag("Substrate", substrateSummary(record)));
  }

  if (route === "plants") {
    const parts = usablePartsForRecord(record);
    if (parts.length) bits.push(labelTag("Useful parts", parts.slice(0, 4).join(", ")));
  }
  if (edibleUse?.has_ingestible_use && /tea|infusion|beverage/i.test(String(edibleUse.method || "")) && !hasTeaUse(record)) {
    bits.push(`<span class="tag good">Tea / infusion</span>`);
  }
  if (record.non_edible_severity && !edibleUse?.has_ingestible_use && !isRedundantCautionMeta(record) && !foodSafetyText(record)) bits.push(labelTag("Safety", record.non_edible_severity, "danger"));
  if (!isMushroomList) {
    dataQualityTags(record, route).forEach((label) => bits.push(`<span class="tag review">${esc(label)}</span>`));
    if (record.review_status === "needs_review") bits.push(`<span class="tag review">Needs review</span>`);
  }
  return bits.filter(Boolean).join("");
}

function normalizeSearchText(value = "") {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function matchesSearch(record, q) {
  const rare = record.rare_profile || {};
  const medicinal = record.medicinal || {};
  const profile = record.mushroom_profile || {};
  const rawHay = [
    record.display_name,
    record.common_name,
    ...(record.common_names || []),
    ...(record.alternate_names || []),
    ...(record.alt_names || []),
    ...(record.aliases || []),
    ...(record.search_terms || []),
    ...(record.search_aliases || []),
    ...(record.other_names || []),
    ...(profile.common_names || []),
    ...(profile.alternate_names || []),
    ...(profile.aliases || []),
    record.scientific_name,
    profile.scientific_name,
    record.slug,
    record.category,
    record.foraging_class,
    record.overview,
    record.field_identification,
    record.plant_card_note,
    record.plant_lane_note,
    record.culinary_uses,
    record.medicinal_uses,
    medicinal.summary,
    record.other_uses,
    record.notes,
    record.general_notes,
    record.edibility_notes,
    record.edibility_detail,
    record.commonness,
    record.foraging_value,
    record.food_value,
    ...(record.use_roles || []),
    rare.reason,
    rare.field_marks,
    rare.care_note,
    record.danger_level,
    record.poisoning_effects,
    record.toxicity_notes,
    ...(record.usable_parts || []),
    ...(record.plant_lanes || []),
    ...(record.plant_data_flags || []),
    ...(record.reviewReasons || []),
    ...(record.look_alikes || []),
    ...(record.confused_with || []),
    ...(record.medicinalAction || []),
    ...(record.medicinalSystem || []),
    ...(record.medicinalTerms || []),
    ...(record.affected_systems || []),
    ...(rare.key_features || [])
  ].join(" ");
  const query = normalizeSearchText(q);
  if (!query) return true;
  const hay = normalizeSearchText(rawHay);
  return hay.includes(query);
}

function arrayHas(valueList, selected) {
  if (!selected) return true;
  return asList(valueList).includes(selected);
}

function normalizeFilters(filtersOrSearch) {
  if (typeof filtersOrSearch === "string") {
    return {
      search: filtersOrSearch,
      medicinalAction: "",
      medicinalSystem: "",
      medicinalTerm: "",
      cautionCriticalCheck: "",
      cautionSeason: ""
    };
  }
  return {
    search: filtersOrSearch?.search || "",
    medicinalAction: filtersOrSearch?.medicinalAction || "",
    medicinalSystem: filtersOrSearch?.medicinalSystem || "",
    medicinalTerm: filtersOrSearch?.medicinalTerm || "",
    plantMonth: filtersOrSearch?.plantMonth || "",
    plantPart: filtersOrSearch?.plantPart || "",
    plantHabitat: filtersOrSearch?.plantHabitat || "",
    plantSize: filtersOrSearch?.plantSize || "",
    plantTaste: filtersOrSearch?.plantTaste || "",
    plantFlowerColor: filtersOrSearch?.plantFlowerColor || "",
    plantFruitColor: filtersOrSearch?.plantFruitColor || "",
    plantLeafShape: filtersOrSearch?.plantLeafShape || "",
    plantLeafArrangement: filtersOrSearch?.plantLeafArrangement || "",
    plantStem: filtersOrSearch?.plantStem || "",
    plantLane: filtersOrSearch?.plantLane || "",
    mushroomMonth: filtersOrSearch?.mushroomMonth || "",
    mushroomHabitat: filtersOrSearch?.mushroomHabitat || "",
    mushroomSubstrate: filtersOrSearch?.mushroomSubstrate || "",
    mushroomTreeType: filtersOrSearch?.mushroomTreeType || "",
    mushroomHost: filtersOrSearch?.mushroomHost || "",
    mushroomCapColor: filtersOrSearch?.mushroomCapColor || "",
    mushroomUnderside: filtersOrSearch?.mushroomUnderside || "",
    mushroomUndersideColor: filtersOrSearch?.mushroomUndersideColor || "",
    mushroomStemColor: filtersOrSearch?.mushroomStemColor || "",
    mushroomFleshColor: filtersOrSearch?.mushroomFleshColor || "",
    mushroomSporePrintColor: filtersOrSearch?.mushroomSporePrintColor || "",
    mushroomRing: filtersOrSearch?.mushroomRing || "",
    mushroomTexture: filtersOrSearch?.mushroomTexture || "",
    mushroomSmell: filtersOrSearch?.mushroomSmell || "",
    mushroomStaining: filtersOrSearch?.mushroomStaining || "",
    mushroomCapSurface: filtersOrSearch?.mushroomCapSurface || "",
    mushroomStemFeature: filtersOrSearch?.mushroomStemFeature || "",
    mushroomBoleteGroup: filtersOrSearch?.mushroomBoleteGroup || "",
    mushroomBoleteSubgroup: filtersOrSearch?.mushroomBoleteSubgroup || "",
    mushroomPoreColor: filtersOrSearch?.mushroomPoreColor || "",
    mushroomReviewFlag: filtersOrSearch?.mushroomReviewFlag || "",
    mushroomTreeAssociation: filtersOrSearch?.mushroomTreeAssociation || "",
    mushroomTaste: filtersOrSearch?.mushroomTaste || "",
    cautionSeverity: filtersOrSearch?.cautionSeverity || "",
    cautionForm: filtersOrSearch?.cautionForm || "",
    cautionConfusedWith: filtersOrSearch?.cautionConfusedWith || "",
    cautionAffectedSystem: filtersOrSearch?.cautionAffectedSystem || "",
    cautionCriticalCheck: filtersOrSearch?.cautionCriticalCheck || "",
    cautionSeason: filtersOrSearch?.cautionSeason || "",
    sortSpecies: filtersOrSearch?.sortSpecies || "default"
  };
}

function matchesMedicinalFilters(record, filters) {
  return arrayHas(record.medicinalAction, filters.medicinalAction)
    && arrayHas(record.medicinalSystem, filters.medicinalSystem)
    && arrayHas(record.medicinalTerms, filters.medicinalTerm);
}

function matchesTraitFilters(record, route, filters) {
  const defs = filterDefinitionsForRoute(route);
  if (!defs.length) return true;
  return defs.every((def) => {
    const selected = String(filters?.[def.key] || "").trim();
    if (!selected) return true;
    const values = valuesForFilter(record, def.valueKey);
    if (selected === MISSING_FILTER_VALUE) return values.length === 0;
    return values.includes(selected);
  });
}

function mushroomDisplayText(record = {}) {
  return [
    record.display_name,
    record.common_name,
    record.scientific_name,
    record.category,
    record.foraging_class,
    record.mushroom_family,
    record.mushroom_profile?.family,
    record.mushroom_profile?.group
  ].join(" | ").toLowerCase();
}

function mushroomRouteLane(record) {
  const lane = String(record?.lane || "").toLowerCase().trim();
  const explicitUndersideText = [
    ...cleanOptionValues(collectValues(record, [
      ["underside"], ["underside_type"], ["fertile_surface"],
      ["mushroom_profile", "underside"], ["mushroom_profile", "underside_type"], ["mushroom_profile", "fertile_surface"]
    ])),
    ...mushroomProfileValues(record, ["gill_color", "pore_color", "tooth_color", "ridge_color", "hymenium_color"])
  ].join(" | ").toLowerCase();
  const nameText = mushroomDisplayText(record);
  const trueGillText = /gill|lamella/.test(explicitUndersideText) && !/false gill|false-gill|no gill|ridge|fold|chanterelle/.test(explicitUndersideText);
  const boleteNameText = /\b(bolete|boletus|suillus|leccinum|tylopilus|xerocomellus|aureoboletus|butyriboletus|boletellus|chalciporus|gyroporus|caloboletus|cyanoboletus|neoboletus|exsudoporus|baorangia|strobilomyces|boletinellus|buchwaldoboletus|hemileccinum|porphyrellus|i?mleria|xerocomus)\b/.test(nameText);
  const poredText = /pore|tube|sponge|spongy/.test(explicitUndersideText);

  // Explicit lanes win first so gilled boletes (Phylloporus), chanterelles with ridges,
  // morels, tooth fungi, and polypores do not get dragged into the wrong page by text snippets.
  if (["gilled", "true-gilled", "true_gilled"].includes(lane)) return "gilled";
  if (["bolete", "boletes", "pored", "pores", "spongelike", "spongy"].includes(lane)) return "boletes";
  if (["other", "morel", "tooth", "polypore", "chanterelle", "puffball", "coral", "jelly", "crust", "club", "trumpet", "lichen"].includes(lane)) return "other";

  if (poredText || boleteNameText) return "boletes";
  if (trueGillText) return "gilled";
  return "other";
}

function isGilledBoleteRecord(record = {}) {
  const text = [
    record.slug,
    record.display_name,
    record.common_name,
    record.scientific_name,
    record.mushroom_family,
    record.mushroom_profile?.scientific_name,
    record.mushroom_profile?.summary,
    ...asList(record.common_names),
    ...asList(record.search_aliases),
    ...asList(record.boleteGroup),
    ...asList(record.boleteSubgroup)
  ].join(" | ").toLowerCase();
  return /\bphylloporus\b|\bphylloporopsis\b|gilled bolete/.test(text);
}

function mushroomRouteMatch(record, route) {
  const routeLane = mushroomRouteLane(record);
  const gilledBolete = isGilledBoleteRecord(record);
  if (route === "boletes") return routeLane === "boletes" || gilledBolete;
  if (route === "mushrooms-gilled") return routeLane === "gilled" || gilledBolete;
  if (route === "mushrooms-other") return routeLane === "other" && !gilledBolete;
  return true;
}


const CAUTION_CONFUSION_GROUPS = [
  { value: "chanterelles", label: "Chanterelles", re: /chanterelle|jack-o-lantern|omphalotus|false-chanterelle/i },
  { value: "honey-wood", label: "Honey / wood mushrooms", re: /honey|armillaria|velvet|enoki|galerina|pholiota|sulfur|hypholoma|wood/i },
  { value: "puffballs", label: "Puffballs / earthballs", re: /puffball|earthball|scleroderma|amanita egg|egg button/i },
  { value: "morels", label: "Morels / false morels", re: /morel|gyromitra|verpa/i },
  { value: "agaricus-lawns", label: "Agaricus / lawn mushrooms", re: /agaricus|meadow|field mushroom|green-spored|parasol|lepiota|lawn/i },
  { value: "boletes", label: "Boletes", re: /bolete|porcini|red-pored|blue-staining|huronensis|tylopilus|leccinum/i },
  { value: "milkcaps-russulas", label: "Milk caps / Russulas", re: /milkcap|milk cap|lactarius|lactifluus|russula/i }
];

const CAUTION_SYSTEMS = [
  { value: "liver", label: "Liver", re: /liver|hepatic|amatoxin/i },
  { value: "kidneys", label: "Kidneys", re: /kidney|renal|orellanine/i },
  { value: "gi", label: "GI / stomach", re: /gastro|stomach|nausea|vomit|diarrhea|cramp|digestive/i },
  { value: "nervous", label: "Nervous system", re: /nervous|neurolog|seizure|confusion|tremor|muscarine|sweating|salivation/i },
  { value: "blood", label: "Blood / red blood cells", re: /blood|hemolysis|red blood/i },
  { value: "respiratory", label: "Respiratory / cardiovascular", re: /breath|respiratory|pulse|blood pressure|cardio/i }
];

const CAUTION_CRITICAL_CHECKS = [
  { value: "spore-print", label: "Spore print required", re: /spore print|spore color|spores|rusty[- ]brown|white spore|green spore|brown spore|pink spore|purple[- ]brown/i },
  { value: "slice-open", label: "Slice / cut open", re: /slice|cut open|cut every|cut lengthwise|interior|inside|hollow|gleba|uniformly white|dark interior|cap\/stem outline|developing cap/i },
  { value: "base-volva", label: "Dig/check base or volva", re: /volva|cup at the base|sacklike|sack-like|base was not dug|dig up|bulbous base|stem base|base\/volva/i },
  { value: "underside-gills", label: "Underside / gill check", re: /true gills|false gills|blade-like gills|free gills|gill attachment|pores|underside|decurrent/i },
  { value: "host-substrate", label: "Host/substrate check", re: /wood|buried root|stump|ground|soil|host|associated tree|aspen|birch|oak|pine|cedar|hardwood|conifer/i }
];

const CAUTION_SEASONS = [
  { value: "spring", label: "Spring", months: ["March", "April", "May"] },
  { value: "summer", label: "Summer", months: ["June", "July", "August"] },
  { value: "fall", label: "Fall", months: ["September", "October", "November"] },
  { value: "winter", label: "Winter", months: ["December", "January", "February"] },
  { value: "year-round", label: "Year-round / many months", months: [] }
];

function cautionText(record = {}) {
  return [
    record.display_name, record.common_name, record.scientific_name, record.overview,
    record.field_identification, record.edibility_detail, record.caution_reason,
    record.non_edible_severity, record.danger_level, record.toxicity_level,
    record.look_alike_notes, record.symptoms, record.affected_body_systems,
    record.confused_with, record.look_alikes, record.mushroom_profile?.substrate,
    record.mushroom_profile?.underside, record.mushroom_profile?.underside_type,
    record.mushroom_profile?.spore_print
  ].flatMap(asList).join(" ");
}

function cautionSeverityValue(record = {}) {
  const text = cautionText(record).toLowerCase();
  if (/deadly|fatal|lethal|amatoxin|liver failure|kidney failure|orellanine/.test(text)) return "deadly";
  if (/poison|toxic|severe gi|severe gastrointestinal/.test(text)) return "poisonous";
  if (/avoid|not recommended|inedible|muscarine|gi irritant|caution/.test(text)) return "caution";
  return "caution";
}

function cautionFormValue(record = {}) {
  const lane = mushroomRouteLane(record);
  const text = cautionText(record).toLowerCase();
  if (/puffball|earthball|scleroderma|gleba|amanita egg|egg-like/.test(text)) return "puffball-like";
  if (/morel|gyromitra|verpa|brain-like|cup|saddle/.test(text)) return "morel-like";
  if (lane === "boletes") return "spongelike-boletes";
  if (lane === "gilled") return "gilled";
  return "other";
}

function cautionConfusionValues(record = {}) {
  const text = cautionText(record);
  return CAUTION_CONFUSION_GROUPS.filter((group) => group.re.test(text)).map((group) => group.value);
}

function cautionAffectedSystemValues(record = {}) {
  const text = cautionText(record);
  return CAUTION_SYSTEMS.filter((system) => system.re.test(text)).map((system) => system.value);
}

function cautionCriticalCheckValues(record = {}) {
  const text = cautionText(record);
  return CAUTION_CRITICAL_CHECKS.filter((check) => check.re.test(text)).map((check) => check.value);
}

function cautionSeasonValues(record = {}) {
  const months = new Set(monthValues(record));
  if (months.size >= 10) return ["year-round"];
  const values = [];
  for (const season of CAUTION_SEASONS) {
    if (season.value === "year-round") continue;
    if (season.months.some((month) => months.has(month))) values.push(season.value);
  }
  return values.length ? values : [];
}

function matchesCautionFilters(record = {}, filters = {}) {
  if (filters.cautionSeverity && cautionSeverityValue(record) !== filters.cautionSeverity) return false;
  if (filters.cautionForm && cautionFormValue(record) !== filters.cautionForm) return false;
  if (filters.cautionConfusedWith && !cautionConfusionValues(record).includes(filters.cautionConfusedWith)) return false;
  if (filters.cautionAffectedSystem && !cautionAffectedSystemValues(record).includes(filters.cautionAffectedSystem)) return false;
  if (filters.cautionCriticalCheck && !cautionCriticalCheckValues(record).includes(filters.cautionCriticalCheck)) return false;
  if (filters.cautionSeason && !cautionSeasonValues(record).includes(filters.cautionSeason)) return false;
  return true;
}

function countOptions(records = [], getter, labels = {}) {
  const counts = new Map();
  for (const record of records) {
    const values = asList(getter(record)).filter(Boolean);
    values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  }
  return Array.from(counts.keys()).sort((a, b) => String(labels[a] || a).localeCompare(String(labels[b] || b))).map((value) => ({
    value,
    label: `${labels[value] || value} (${counts.get(value) || 0})`
  }));
}

export function getCautionFilterFields(records = [], filters = {}) {
  const baseRecords = (records || []).filter((record) => !isSuppressed(record) && routeMatch(record, "lookalikes"));
  const severityLabels = { deadly: "Deadly / organ damage", poisonous: "Poisonous", caution: "Caution / avoid" };
  const formLabels = { "gilled": "Gilled", "spongelike-boletes": "Spongelike / bolete", "puffball-like": "Puffball / earthball-like", "morel-like": "Morel / cup-like", "other": "Other" };
  const confusionLabels = Object.fromEntries(CAUTION_CONFUSION_GROUPS.map((g) => [g.value, g.label]));
  const systemLabels = Object.fromEntries(CAUTION_SYSTEMS.map((g) => [g.value, g.label]));
  const criticalCheckLabels = Object.fromEntries(CAUTION_CRITICAL_CHECKS.map((g) => [g.value, g.label]));
  const seasonLabels = Object.fromEntries(CAUTION_SEASONS.map((g) => [g.value, g.label]));
  return [
    { key: "cautionSeverity", label: "Risk level", blankLabel: "Any risk level", options: countOptions(baseRecords, cautionSeverityValue, severityLabels) },
    { key: "cautionForm", label: "Mushroom form", blankLabel: "Any form", options: countOptions(baseRecords, cautionFormValue, formLabels) },
    { key: "cautionConfusedWith", label: "Often confused with", blankLabel: "Any confusion group", options: countOptions(baseRecords, cautionConfusionValues, confusionLabels) },
    { key: "cautionAffectedSystem", label: "Affected system", blankLabel: "Any affected system", options: countOptions(baseRecords, cautionAffectedSystemValues, systemLabels) },
    { key: "cautionCriticalCheck", label: "Critical field check", blankLabel: "Any field check", options: countOptions(baseRecords, cautionCriticalCheckValues, criticalCheckLabels) },
    { key: "cautionSeason", label: "Season", blankLabel: "Any season", options: countOptions(baseRecords, cautionSeasonValues, seasonLabels) }
  ].filter((field) => field.options.length > 0 || String(filters?.[field.key] || "").trim());
}

export function hasActiveCautionFilters(filters = {}) {
  return !!(filters.cautionSeverity || filters.cautionForm || filters.cautionConfusedWith || filters.cautionAffectedSystem || filters.cautionCriticalCheck || filters.cautionSeason);
}

function routeMatch(record, route) {
  const info = classifyRecord(record);
  if (route === "plants") return info.isPlant && info.edible;
  if (["mushrooms-gilled", "boletes", "mushrooms-other"].includes(route)) return info.isMushroom && info.edible && mushroomRouteMatch(record, route);
  if (route === "medicinal") return info.medicinal;
  if (route === "lookalikes") return info.caution;
  if (route === "caution") return info.caution;
  if (route === "other-uses") return info.otherUses;
  if (route === "review") return record.review_status === "needs_review";
  return true;
}

export function filterRecords(records, route, filtersOrSearch = "") {
  const filters = normalizeFilters(filtersOrSearch);
  const searchApplies = route === "general" || route === "search";
  const q = searchApplies ? String(filters.search || "").trim().toLowerCase() : "";
  return (records || []).filter((record) => {
    if (isSuppressed(record)) return false;
    const matchRoute = route === "search" ? "general" : route;
    if (!routeMatch(record, matchRoute)) return false;
    if (matchRoute === "plants" && filters.plantLane && !plantLaneIdsForRecord(record).has(filters.plantLane)) return false;
    if (route === "medicinal" && !matchesMedicinalFilters(record, filters)) return false;
    if ((matchRoute === "lookalikes" || matchRoute === "caution") && !matchesCautionFilters(record, filters)) return false;
    if (!matchesTraitFilters(record, matchRoute, filters)) return false;
    if (!q) return true;
    return matchesSearch(record, q);
  });
}

function isUnhelpfulListText(value = "") {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return true;
  if (isBuildNoteText(text)) return true;
  return /^(Food use|Food\/beverage use):\s*Food\.?$/i.test(text)
    || /^Food\.?\s*This entry carried caution/i.test(text)
    || /this entry carried caution, non[- ]edible, or safety significance/i.test(text)
    || /warning species seed/i.test(text)
    || /retained mainly for identification, caution, or curiosity value/i.test(text)
    || /large short-stemmed .* entry/i.test(text)
    || /warning species seed/i.test(text)
    || /safety significance in the original app/i.test(text)
    || /when correctly identified and in good condition/i.test(text)
    || /^a worthwhile edible\.?$/i.test(text)
    || /^potentially edible or useful/i.test(text);
}

function cleanListText(value = "") {
  const text = cleanUserFacingText(value)
    .replace(/\bwhen correctly identified and(?: collected)? in good condition\b/gi, "")
    .replace(/\bwhen correctly identified\b/gi, "")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
  return isUnhelpfulListText(text) ? "" : text;
}

function firstCleanListText(values = []) {
  for (const value of values) {
    const text = cleanListText(value);
    if (text) return text;
  }
  return "";
}

function generatedMushroomSnippet(record = {}) {
  if (record.record_type !== "mushroom") return "";
  const profile = record.mushroom_profile || {};
  const parts = [];
  const substrate = firstCleanListText([
    asList(profile.substrate).join(", "),
    asList(record.substrate).join(", ")
  ]);
  const host = firstCleanListText([
    asList(profile.host_trees).join(", "),
    asList(record.hostTree).join(", "),
    asList(profile.host_filter_tokens).join(", ")
  ]);
  const cap = firstCleanListText([asList(profile.cap_surface).join(", "), asList(record.capSurface).join(", ")]);
  const underside = firstCleanListText([
    asList(profile.pore_color).join(", "),
    asList(record.poreColor).join(", "),
    asList(profile.underside).join(", "),
    asList(profile.fertile_surface).join(", ")
  ]);
  const stem = firstCleanListText([asList(profile.stem_feature).join(", "), asList(record.stemFeature).join(", ")]);
  const staining = firstCleanListText([asList(profile.staining).join(", "), asList(record.staining).join(", ")]);
  if (substrate || host) {
    const where = substrate ? `on/from ${substrate.toLowerCase()}` : "";
    const withTree = host ? `near/with ${host}` : "";
    parts.push(`Grows ${[where, withTree].filter(Boolean).join("; ")}.`);
  }
  if (cap) parts.push("Cap/surface: " + cap + ".");
  if (underside) parts.push("Underside: " + underside + ".");
  if (stem) parts.push("Stem: " + stem + ".");
  if (staining) parts.push("Bruising/staining: " + staining + ".");
  const text = parts.join(" ").replace(/\s+/g, " ").trim();
  return isUnhelpfulListText(text) ? "" : text;
}

function trimBriefText(value = "", maxLength = 180) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text || text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength + 1);
  const sentenceBreak = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  if (sentenceBreak >= 80) return cut.slice(0, sentenceBreak + 1).trim();
  const wordBreak = cut.lastIndexOf(" ");
  return `${cut.slice(0, wordBreak > 80 ? wordBreak : maxLength).replace(/[,. ;:]+$/g, "").trim()}…`;
}

function otherUseListNote(record = {}) {
  const direct = firstCleanListText([
    record.other_uses,
    record.otherUses,
    record.practical_uses,
    record.utility_uses,
    record.craft_uses,
    record.fiber_uses,
    record.tinder_uses
  ]);
  const edibility = String(record.edibility_status || record.mushroom_profile?.edibility_status || "").toLowerCase();
  const foodRole = String(record.food_role || "").toLowerCase();
  const useRoles = asList(record.use_roles).join(" ").toLowerCase();
  const usableParts = asList(record.usable_parts).join(" ").toLowerCase();
  const plantNote = firstCleanListText([record.plant_card_note, record.plant_lane_note]);
  const medicinalSummary = firstCleanListText([record.medicinal?.summary, record.medicinal_uses])
    .replace(/^primarily culinary in this guide\.?$/i, "");
  const fallbackValues = [
    record.overview,
    record.notes,
    record.general_notes,
    record.edibility_notes,
    record.edibility_detail
  ];
  const fallbackText = firstCleanListText(fallbackValues);
  const utilityFallback = firstCleanListText(fallbackValues.filter((value) => /tinder|ember|fire|craft|dye|fiber|cordage|scour|scouring|display|decorative|teaching|ecology/.test(String(value || "").toLowerCase())));

  if (edibility.includes("emergency") || foodRole.includes("emergency") || foodRole.includes("survival")) {
    return trimBriefText(direct ? `Emergency / survival context; ${direct}` : "Emergency / survival context; not a normal food target.");
  }

  if (direct) return trimBriefText(direct.replace(/^(Other uses?|Practical uses?):\s*/i, ""));

  if (/look[- ]?alike|comparison|warning|caution|id/.test(useRoles)) {
    return "Field identification / look-alike comparison.";
  }

  if (/resin|gum|pitch|sap/.test(`${usableParts} ${plantNote} ${fallbackText}`)) {
    return trimBriefText(plantNote || fallbackText || "Resin, gum, pitch, or sap use noted; open details for safe ID and use notes.");
  }

  if (utilityFallback) {
    return trimBriefText(utilityFallback);
  }

  if (medicinalSummary) {
    return trimBriefText(`Traditional / medicinal-use context; ${medicinalSummary}`);
  }

  if (useRoles.includes("other use")) return "Other-use record; open details for the specific use notes.";
  return "Open details for the other-use notes.";
}

function cardSnippet(record, route = "general") {
  if (route === "other-uses") return `Other use: ${otherUseListNote(record)}`;
  const rare = record.rare_profile || {};
  const candidates = [
    record.plant_card_note,
    record.mushroom_card_note,
    record.overview,
    record.field_identification,
    generatedMushroomSnippet(record),
    record.poisoning_effects,
    record.toxicity_notes,
    record.other_uses,
    record.culinary_uses,
    record.edibility_notes,
    record.edibility_detail,
    rare.reason,
    record.notes,
    record.general_notes,
    record.habitat_detail
  ];
  return firstCleanListText(candidates).replace(/^Food\/beverage use:\s*/i, "Food use: ");
}

function cardSnippetHtml(record, route = "general") {
  const snippet = trimBriefText(cardSnippet(record, route), route === "other-uses" ? 220 : 260);
  return snippet ? `<p>${esc(snippet)}</p>` : "";
}

function displayName(record = {}) {
  return String(record.display_name || record.common_name || record.slug || "").toLowerCase();
}

function scoreFromText(value = "", map = new Map()) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return null;
  for (const [needle, score] of map.entries()) {
    if (text.includes(needle)) return score;
  }
  return null;
}

const COMMONNESS_TEXT_SCORES = new Map([
  ["abundant", 5],
  ["very common", 5],
  ["common", 4],
  ["occasional", 3],
  ["uncommon", 2],
  ["rare", 1],
  ["scattered", 2]
]);

const FOOD_QUALITY_TEXT_SCORES = new Map([
  ["choice", 5],
  ["excellent", 5],
  ["very good", 4],
  ["good", 4],
  ["fair", 3],
  ["okay", 3],
  ["poor", 2],
  ["not recommended", 1],
  ["questionable", 1]
]);

function numericScore(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function commonnessScore(record = {}) {
  return numericScore(record.commonness_score)
    ?? scoreFromText(record.commonness, COMMONNESS_TEXT_SCORES)
    ?? -1;
}

function foodQualityScore(record = {}) {
  const explicit = numericScore(record.foraging_value_score)
    ?? numericScore(record.food_quality_score)
    ?? scoreFromText(record.foraging_value, FOOD_QUALITY_TEXT_SCORES)
    ?? scoreFromText(record.food_quality, FOOD_QUALITY_TEXT_SCORES);
  if (explicit !== null) return explicit;

  const tasteText = asList(record.taste).join(" ").toLowerCase();
  if (/sweet|rich|nutty|floral|minty|aromatic|pleasant|mild/.test(tasteText)) return 3;
  if (/bitter|astringent|acrid|mealy|bland|sour/.test(tasteText)) return 2;
  return -1;
}

function earliestSeasonIndex(record = {}) {
  const months = monthValues(record);
  if (!months.length) return 99;
  const positions = months
    .map((month) => MONTHS.indexOf(month))
    .filter((index) => index >= 0);
  return positions.length ? Math.min(...positions) : 99;
}

function seasonLabel(record = {}) {
  const months = monthValues(record);
  if (!months.length) return "zzz";
  return months.join(" ").toLowerCase();
}

function compareByName(a, b) {
  return displayName(a).localeCompare(displayName(b));
}

export function sortRecords(records = [], sortKey = "default") {
  const key = String(sortKey || "default");
  const list = [...records];
  if (key === "default") return list;

  return list.sort((a, b) => {
    if (key === "name") return compareByName(a, b);
    if (key === "commonness") {
      const diff = commonnessScore(b) - commonnessScore(a);
      return diff || compareByName(a, b);
    }
    if (key === "foodQuality") {
      const diff = foodQualityScore(b) - foodQualityScore(a);
      return diff || compareByName(a, b);
    }
    if (key === "season") {
      const diff = earliestSeasonIndex(a) - earliestSeasonIndex(b);
      return diff || seasonLabel(a).localeCompare(seasonLabel(b)) || compareByName(a, b);
    }
    return compareByName(a, b);
  });
}


function normalizeCommonsFileName(value = "") {
  return String(value || "")
    .replace(/^File:/i, "")
    .replace(/^\d+px-/i, "")
    .replace(/\s+/g, "_")
    .toLowerCase();
}

function canonicalImageKey(value = "") {
  const raw = String(value || "").trim();
  if (!raw || raw.startsWith("data:image/svg")) return "";
  try {
    const parsed = new URL(raw, window.location.href);
    const host = parsed.hostname.toLowerCase();
    const path = decodeURIComponent(parsed.pathname || "");
    const filePathMatch = path.match(/\/Special:FilePath\/([^/?#]+)/i);
    if (filePathMatch) return `commons:${normalizeCommonsFileName(filePathMatch[1])}`;
    const wikiFileMatch = path.match(/\/wiki\/File:([^/?#]+)/i);
    if (wikiFileMatch) return `commons:${normalizeCommonsFileName(wikiFileMatch[1])}`;
    if (host.includes("wikimedia.org") && path.includes("/wikipedia/commons/thumb/")) {
      const parts = path.split("/").filter(Boolean);
      const originalName = parts.length >= 2 ? parts[parts.length - 2] : parts[parts.length - 1];
      if (originalName) return `commons:${normalizeCommonsFileName(originalName)}`;
    }
    if (host.includes("wikimedia.org") && path.includes("/wikipedia/commons/")) {
      const parts = path.split("/").filter(Boolean);
      const fileName = parts[parts.length - 1] || "";
      if (fileName) return `commons:${normalizeCommonsFileName(fileName)}`;
    }
    parsed.search = "";
    parsed.hash = "";
    return `${parsed.hostname.toLowerCase()}${decodeURIComponent(parsed.pathname).toLowerCase()}`;
  } catch {
    return raw.split("?")[0].split("#")[0].toLowerCase();
  }
}

function actualImageCount(record = {}) {
  const urls = [
    ...(Array.isArray(record.images_structured) ? record.images_structured.flatMap((item) => [item?.sourcePage, item?.source_page, item?.thumb, item?.detail, item?.full]) : []),
    ...(Array.isArray(record.images) ? record.images.map((item) => typeof item === "string" ? item : (item?.sourcePage || item?.source_page || item?.src || item?.thumb || item?.detail || item?.full)) : []),
    ...(Array.isArray(record.detail_images) ? record.detail_images : []),
    ...(Array.isArray(record.enlarge_images) ? record.enlarge_images : []),
    record.list_thumbnail
  ];
  const seen = new Set();
  for (const url of urls) {
    const key = canonicalImageKey(url);
    if (key) seen.add(key);
  }
  return seen.size;
}

function isImageOnlyReview(record = {}) {
  if (record.review_status === "needs_images" || record.image_status === "needs_images") return true;
  if (record.review_status !== "needs_review") return false;
  const text = [
    record.review_note, record.work_note, record.completion_status, record.completion_notes,
    record.image_status, record.image_needs, record.image_notes, record.missing_fields,
    record.notes, record.overview
  ].flatMap(asList).join(" ").toLowerCase();
  const hasPlaceholder = [
    ...(Array.isArray(record.images) ? record.images : []),
    record.list_thumbnail
  ].some((value) => String(value || "").startsWith("data:image/svg"));
  if (hasPlaceholder && actualImageCount(record) < 2) return true;
  if (actualImageCount(record) === 0) return true;
  return /needs? (photo|image)|image needed|photo needed|public usable photo not yet found|image[- ]poor|missing image/.test(text);
}

function shouldShowReviewOk(record = {}) {
  return record.review_status === "needs_review" && !isImageOnlyReview(record);
}

export function renderRecordCards(records, route = "general") {
  if (!records.length) return `<section class="panel empty-state"><h3>No matches</h3></section>`;
  return `<section class="record-list">${records.map((record) => `
    <article class="record-card with-image">
      ${renderImageSlot(record, "card")}
      <div class="record-card-body">
        <h3 class="record-title-line"><button class="record-title-button" type="button" data-detail="${esc(record.slug)}">${esc(record.display_name || record.common_name || record.slug || "Untitled")}</button>${lookalikeRiskTitleBadge(record)}</h3>
        <p class="muted small">${esc(record.scientific_name || "")}</p>
        <div class="record-meta">${makeMeta(record, route, { includeLookalikeRisk: false })}</div>
        ${cardSnippetHtml(record, route)}
        <div class="control-row">
          <button class="primary" type="button" data-detail="${esc(record.slug)}">Open details</button>
          ${shouldShowReviewOk(record) ? `<button class="warn" type="button" data-review-action="mark-ok" data-slug="${esc(record.slug)}">Mark OK</button>` : ""}
        </div>
      </div>
    </article>
  `).join("")}</section>`;
}
