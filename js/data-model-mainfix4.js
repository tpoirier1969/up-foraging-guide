import { PLANT_CATEGORIES } from "./constants-mainfix.js?v=v2.1-mainfix21";
import { compactText, hasMedicinal } from "./utils.js?v=v2.1-medfix1";
import { inferTraits } from "./trait-inference-mainfix4.js?v=v2.1-mainfix14";

const FORAGING_MUSHROOM_STATUSES = new Set(["choice","choice_cooked_only","edible","edible_with_caution","edible_when_young","edible_when_white_inside","edible_mediocre","choice_with_precision","good","edible_young_only"]);
const AVOID_MUSHROOM_STATUSES = new Set(["emergency_only","inedible_tough","inedible_bitter","nonculinary_tea","poisonous","deadly_poisonous","toxic_or_psychoactive","toxic_or_dangerous","review_required","questionable_or_mediocre"]);
function severityText(record) { return String(record?.non_edible_severity || '').trim().toLowerCase(); }
function edibleStatus(record) { return String(record?.mushroom_profile?.edibility_status || '').trim().toLowerCase(); }
function asList(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(v => String(v).trim()).filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}
function mergedReviewReasons(base) {
  const manual = [...asList(base.manual_review_reasons), ...asList(base.manualReviewReasons), ...asList(base.review_reasons), ...asList(base.reviewReasons)];
  return [...new Set(manual)];
}
function uniqueStrings(values) {
  return [...new Set((values || []).filter(Boolean).map(value => String(value).trim()).filter(Boolean))];
}
export function normalizeRecord(record) {
  const base = {
    ...record,
    display_name: compactText(record.display_name || record.common_name, 'Untitled species'),
    common_name: compactText(record.common_name || record.display_name, ''),
    category: compactText(record.category, 'Uncategorized'),
    scientific_name: compactText(record.scientific_name, ''),
    culinary_uses: compactText(record.culinary_uses, ''),
    medicinal_uses: compactText(record.medicinal_uses, ''),
    notes: compactText(record.notes, ''),
    months_available: Array.isArray(record.months_available) ? record.months_available : [],
    links: uniqueStrings(Array.isArray(record.links) ? record.links : []),
    images: uniqueStrings(Array.isArray(record.images) ? record.images : []),
    look_alikes: uniqueStrings(Array.isArray(record.look_alikes) ? record.look_alikes : [])
  };
  const inferred = inferTraits(base);
  return { ...base, ...inferred, reviewReasons: mergedReviewReasons(base) };
}
export function sortRecords(records) { return records.slice().sort((a,b) => a.display_name.localeCompare(b.display_name)); }
export function isPlant(record) { return PLANT_CATEGORIES.has(record.category); }
export function isMushroom(record) { return record.category === 'Mushroom'; }
export function isForagingMushroom(record) {
  if (!isMushroom(record)) return false;
  const status = edibleStatus(record);
  const severity = severityText(record);
  if (FORAGING_MUSHROOM_STATUSES.has(status)) return true;
  if (AVOID_MUSHROOM_STATUSES.has(status)) return false;
  if (severity) {
    if (/(deadly|potentially deadly|inedible|non-culinary|toxic|questionable)/.test(severity)) return false;
    if (/poison/.test(severity) && !/edible|choice/.test(severity)) return false;
    if (/edible|choice/.test(severity)) return true;
  }
  return true;
}
export function medicinalRecords(records) { return records.filter(hasMedicinal); }
export function reviewRecords(records) { return records.filter(r => (r.reviewReasons || []).length); }
export function avoidRecords(records) {
  return records.filter(record => {
    if (isMushroom(record) && !isForagingMushroom(record)) return true;
    if (!isMushroom(record) && !!record.non_edible_severity) return true;
    return (record.look_alikes || []).length > 0;
  });
}
