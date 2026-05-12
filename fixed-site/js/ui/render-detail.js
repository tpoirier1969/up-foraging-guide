import { esc } from "../lib/escape.js";
import { state } from "../state.js";
import { getMedicinalData, isBuildNoteText, cleanUserFacingText, classifyRecord } from "../lib/merge.js?v=v4.3.25-r2026-05-12-safety-language-cleanup1";
import { renderImageSlot } from "../lib/image-slot.js";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function clarifyVagueSafetyText(value = "") {
  return String(value || "")
    .replace(/\bedible\s+with\s+caution\b/gi, "Edible only with a confident species-level ID; check look-alikes, preparation limits, and individual tolerance before eating")
    .replace(/\buse\s+with\s+caution\b/gi, "Use only after checking species-specific risk notes, look-alikes, and preparation limits")
    .replace(/\bwith\s+caution\b/gi, "after checking species-specific risk notes")
    .replace(/\bnot\s+recommended\s+for\s+beginners\b/gi, "Not recommended for beginners because the ID or preparation risk is easy to misjudge")
    .replace(/\bnot\s+recommended\b(?!\s+for\s+(?:beginners|eating)\b)/gi, "Not recommended for eating unless a trusted source gives a species-specific reason to use it")
    .replace(/\bexercise\s+caution\b/gi, "Check the specific look-alike, preparation, and poisoning-risk notes before use");
}

function clean(value) {
  return cleanUserFacingText(clarifyVagueSafetyText(value))
    .replace(/\bwhen correctly identified and(?: collected)? in good condition\b/gi, "")
    .replace(/\bwhen correctly identified\b/gi, "")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
}

function lineIf(label, value) {
  const text = clean(value);
  if (!text) return "";
  return `<dt>${esc(label)}</dt><dd>${esc(text)}</dd>`;
}

function slugifyLookup(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleFromSlugOrName(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw)) {
    return raw.replace(/-/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
  }
  return raw;
}

function normalizeForDuplicateCheck(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(value = "") {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map(part => part.trim())
    .filter(Boolean);
}

function uniqueLines(values = []) {
  const seen = new Set();
  const out = [];
  for (const value of values.flatMap(asArray)) {
    for (const sentence of splitSentences(clean(value))) {
      const key = normalizeForDuplicateCheck(sentence);
      if (!key || seen.has(key)) continue;
      if ([...seen].some(existing => existing.includes(key) || key.includes(existing))) continue;
      seen.add(key);
      out.push(sentence);
    }
  }
  return out;
}

function joinClean(values = []) {
  return values.map(clean).filter(Boolean).join(", ");
}

function listBlock(title, values) {
  const cleaned = asArray(values).map(clean).filter(Boolean);
  if (!cleaned.length) return "";
  return `<section class="detail-block"><h4>${esc(title)}</h4><ul class="list-tight">${cleaned.map(v => `<li>${esc(v)}</li>`).join("")}</ul></section>`;
}

function sectionWithParagraphs(title, values) {
  const cleaned = asArray(values).flatMap(value => splitSentences(clean(value))).filter(Boolean);
  if (!cleaned.length) return "";
  return `<section class="detail-block"><h4>${esc(title)}</h4>${cleaned.map(value => `<p>${esc(value)}</p>`).join("")}</section>`;
}

function seasonText(record) {
  if (Array.isArray(record.months_available) && record.months_available.length) return record.months_available.join(", ");
  if (Array.isArray(record.season_months) && record.season_months.length) {
    return record.season_months.map((n) => MONTHS[n - 1] || String(n)).join(", ");
  }
  return "";
}

function profileListValue(profile = {}, key) {
  const value = profile?.[key];
  if (Array.isArray(value)) return value.map(clean).filter(Boolean).join(", ");
  return clean(value);
}

function fieldOrProfile(record = {}, key, profileKey = key) {
  const profile = record.mushroom_profile || {};
  return profileListValue(profile, profileKey) || profileListValue(record, key);
}

function isMushroomRecord(record = {}) {
  const hay = [
    record.category,
    record.group,
    record.type,
    record.foraging_class,
    record.section,
    record.lane,
    record.kingdom
  ].map(value => String(value || "").toLowerCase()).join(" ");
  return Boolean(record.mushroom_profile)
    || /mushroom|fungi|fungus|bolete|chanterelle|morel|polypore|puffball|agaric/.test(hay);
}

function recordLookupSlugs(record = {}) {
  return [
    record.slug,
    record.display_name,
    record.common_name,
    record.scientific_name,
    ...asArray(record.common_names),
    ...asArray(record.search_aliases),
    ...asArray(record.aliases),
    ...asArray(record.look_alike_aliases)
  ]
    .map(slugifyLookup)
    .filter(Boolean);
}

function findLookAlikeRecord(rawName = "") {
  const slug = slugifyLookup(rawName);
  if (!slug) return null;
  const records = [...(state.species || []), ...(state.rareSpecies || [])];
  const direct = records.find((record) => recordLookupSlugs(record).includes(slug));
  if (!direct?.duplicate_of) return direct || null;
  return records.find((record) => record.slug === direct.duplicate_of) || direct;
}

function lookAlikeTextBlob(record = {}) {
  return [
    record.slug,
    record.display_name,
    record.common_name,
    record.scientific_name,
    record.edibility_status,
    record.non_edible_severity,
    record.danger_level,
    record.poisoning_effects,
    record.toxicity_notes,
    record.food_role,
    record.food_quality,
    record.culinary_uses,
    record.edibility_detail,
    record.edibility_notes,
    record.foraging_value,
    ...(asArray(record.common_names)),
    ...(asArray(record.search_aliases)),
    ...(asArray(record.mushroom_profile?.taste)),
    record.mushroom_profile?.edibility_status,
    record.mushroom_profile?.caution_level
  ].join(" ").toLowerCase();
}

function isBitterBoleteComparison(record = null, rawName = "") {
  const hay = `${rawName} ${record ? lookAlikeTextBlob(record) : ""}`.toLowerCase();
  return /\b(true[- ]?)?bitter[- ]bolete\b|\btylopilus felleus\b|\bbitter tylopilus\b|\bpink[- ]pored tylopilus\b/.test(hay)
    || (/\btylopilus\b/.test(hay) && /\bbitter\b/.test(hay) && !/\b(deadly|fatal|lethal|poisonous|toxic)\b/.test(hay));
}

function hasExplicitPoisonSignal(hay = "") {
  const text = String(hay || "").toLowerCase();
  if (/\b(not poisonous|non-poisonous|nonpoisonous|not treated .* poison|not a poison)\b/.test(text)) return false;
  return /\b(poisonous|poisoning|toxic|toxicity|toxin)\b/.test(text);
}

function lookAlikeStatus(record = null, rawName = "") {
  if (!record) return { label: "Status: needs review", className: "review", kind: "review" };
  const info = classifyRecord(record);
  const hay = lookAlikeTextBlob(record);
  const quality = clean(record.food_quality);
  const severity = clean(record.non_edible_severity);
  const bitter = isBitterBoleteComparison(record, rawName);

  if (/\b(deadly|fatal|death|lethal)\b/.test(hay)) {
    return { label: "Deadly", className: "danger", kind: "deadly" };
  }
  if (!bitter && hasExplicitPoisonSignal(hay)) {
    return { label: "Poisonous", className: "danger", kind: "poisonous" };
  }
  if (bitter) {
    return { label: "Bitter / inedible", className: "caution", kind: "bitter" };
  }
  if (/\b(unsafe|avoid|questionable)\b/.test(hay)) {
    return { label: "Unsafe / avoid", className: "caution", kind: "unsafe" };
  }
  if (/\b(inedible|not edible|not recommended|caution)\b/.test(hay) || (info.caution && !info.edible)) {
    return { label: severity || "Not recommended for food", className: "caution", kind: "inedible" };
  }

  if (/choice|excellent/.test(quality.toLowerCase())) return { label: "Choice edible", className: "good", kind: "edible" };
  if (/good/.test(quality.toLowerCase())) return { label: "Good edible", className: "good", kind: "edible" };
  if (/fair/.test(quality.toLowerCase())) return { label: "Fair edible", className: "", kind: "edible" };
  if (/poor/.test(quality.toLowerCase())) return { label: "Poor edible", className: "caution", kind: "poor" };
  if (info.edible) return { label: "Edible", className: "good", kind: "edible" };
  return { label: "Status: needs review", className: "review", kind: "review" };
}

function statusTagHtml(status) {
  const cls = status.className ? `tag ${status.className}` : "tag";
  return `<span class="${cls}">${esc(status.label)}</span>`;
}

function lookAlikeSeparationNote(record = {}, rawName = "") {
  const hay = `${slugifyLookup(rawName)} ${rawName}`.toLowerCase();
  const recordHay = `${record.slug || ""} ${record.display_name || ""} ${record.common_name || ""} ${record.scientific_name || ""}`.toLowerCase();

  if (/bitter|tylopilus|felleus|pink-pored/.test(hay)) {
    return "Check for pores that turn pinkish with age and use only a tiny nibble-and-spit taste test if you know the mushroom is safe to taste; bitter boletes taste distinctly bitter and can ruin the whole pan.";
  }
  if (/red-mouth|lurid|red-pored|blue-staining-red-pored|subvelutipes|sensibilis|frostii|bicolor|baorangia|exsudoporus|caloboletus/.test(hay)) {
    return "Focus on orange/red pore color and speed/strength of blue bruising. Red/orange-pored blue-staining boletes are a caution zone unless the ID is nailed down.";
  }
  if (/king|porcini|boletus-edulis|false-king/.test(hay) || /king|porcini/.test(recordHay)) {
    return "Compare pore color, stem netting, taste, and staining. Porcini-type edibles usually have white-to-yellow pores, firm flesh, mild taste, and no red/orange pore surface.";
  }
  if (/leccinum|scaber|birch-bolete|orange-bolete|aspen/.test(hay)) {
    return "Look for dark scabers on the stalk and match the nearby tree association, especially birch or aspen. Treat Leccinum-type mushrooms cautiously and do not use vague look-alike matches as food IDs.";
  }
  if (/suillus|slippery|butterball|larch|chicken-fat|painted/.test(hay)) {
    return "Look for Suillus traits: sticky or slimy cap, yellow pores, glandular dots or ring on the stalk, and a pine/larch/conifer association.";
  }
  if (/jack-o-lantern|omphalotus/.test(hay)) {
    return "Jack-o'-lanterns have true sharp gills and often grow in clusters from wood or buried wood; chanterelles have blunt ridges, not true gills.";
  }
  if (/false-morel|gyromitra|lorchel/.test(hay)) {
    return "Cut it lengthwise. True morels are hollow from cap through stem with the cap attached; false morels can be chambered, cottony, or irregularly lobed.";
  }
  if (/amanita|death-angel|destroying-angel|death-cap/.test(hay)) {
    return "Check the entire base for a cup/volva, plus free white gills and a ring. Do not identify Amanita look-alikes from cap color alone.";
  }
  if (/galerina/.test(hay)) {
    return "Galerina is a serious/deadly wood-growing look-alike group. Check spore color, ring, cap texture, and growth on wood; do not treat small brown mushrooms as interchangeable.";
  }
  return "Compare the linked page against this one using underside, pore/gill color, bruising, stem clues, host tree/substrate, season, and any taste warning.";
}

function lookAlikeRiskClass(status = {}) {
  if (status.kind === "deadly") return "lookalike-deadly";
  if (status.kind === "poisonous") return "lookalike-danger";
  if (["unsafe", "inedible", "poor"].includes(status.kind)) return "lookalike-caution";
  if (status.kind === "bitter") return "lookalike-bitter";
  if (status.className === "review") return "lookalike-review";
  if (status.className === "good") return "lookalike-good";
  return "";
}

function lookAlikeWarningText(status = {}) {
  if (status.kind === "deadly") {
    return "Deadly look-alike: treat this comparison as a stop sign, not a casual note.";
  }
  if (status.kind === "poisonous") {
    return "Poisonous look-alike: confirm the separating features before considering this species for food.";
  }
  if (status.kind === "bitter") {
    return "Bitter / inedible look-alike: confirm the separating features before this goes anywhere near the pan.";
  }
  if (["unsafe", "inedible", "poor"].includes(status.kind)) {
    return "Unsafe or not-recommended look-alike: confirm the separating features before treating this as food.";
  }
  if (status.className === "review") {
    return "Look-alike status needs review: do not use this comparison as a final ID.";
  }
  return "";
}

function canonicalLookAlikeKey(rawName = "", linkedRecord = null) {
  const hay = `${rawName} ${linkedRecord ? lookAlikeTextBlob(linkedRecord) : ""}`.toLowerCase();
  if (/\b(true[- ]?)?bitter[- ]bolete\b|\btylopilus felleus\b|\bbitter tylopilus\b|\bpink[- ]pored tylopilus\b/.test(hay)) return "bitter-bolete";
  if (/\bfalse[- ]king[- ]bolete\b|\bboletus huronensis\b/.test(hay)) return "false-king-bolete";
  return linkedRecord?.duplicate_of || linkedRecord?.slug || slugifyLookup(rawName);
}

function collectLookAlikeEntries(record = {}) {
  const rawNames = [
    ...asArray(record.look_alikes),
    ...asArray(record.lookalikes),
    ...asArray(record.confused_with)
  ].map(clean).filter(Boolean);
  const seen = new Set();
  const entries = [];

  for (const name of rawNames) {
    const linkedRecord = findLookAlikeRecord(name);
    const key = canonicalLookAlikeKey(name, linkedRecord);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    entries.push({ name, linkedRecord, key });
  }
  return entries;
}

function lookAlikeBlock(record) {
  const entries = collectLookAlikeEntries(record);
  const notes = clean(record.look_alike_notes);
  if (!entries.length && !notes) return "";

  let hasDeadly = false;
  let hasPoison = false;
  let hasCaution = false;
  let hasReview = false;

  const items = entries.map(({ name, linkedRecord, key }) => {
    const slug = linkedRecord?.slug || key || slugifyLookup(name);
    const label = linkedRecord ? (linkedRecord.display_name || linkedRecord.common_name || titleFromSlugOrName(name)) : titleFromSlugOrName(name);
    const status = lookAlikeStatus(linkedRecord, name);
    const riskClass = lookAlikeRiskClass(status);
    const warning = lookAlikeWarningText(status);
    const note = lookAlikeSeparationNote(record, name);

    if (status.kind === "deadly") hasDeadly = true;
    if (status.kind === "poisonous") hasPoison = true;
    if (["unsafe", "inedible", "bitter", "poor"].includes(status.kind)) hasCaution = true;
    if (status.kind === "review") hasReview = true;

    return `<li class="lookalike-cue-item ${esc(riskClass)}">
      <div class="lookalike-title-row">
        <button class="subtle" type="button" data-detail="${esc(slug)}">${esc(label)}</button>
        ${statusTagHtml(status)}
      </div>
      ${warning ? `<div class="lookalike-warning">${esc(warning)}</div>` : ""}
      ${note ? `<div class="muted small">How to tell apart: ${esc(note)}</div>` : ""}
    </li>`;
  }).join("");

  const summary = hasDeadly
    ? "One or more listed look-alikes is flagged as deadly. Slow down and verify the full mushroom, including underside, stem/base, spore color, substrate, and season."
    : (hasPoison
      ? "One or more listed look-alikes is poisonous. Treat that as primary ID information, not trivia."
      : (hasCaution
        ? "One or more listed look-alikes is unsafe, bitter, inedible, or not recommended for food. That is different from poisonous, but it still matters."
        : (hasReview ? "One or more look-alikes still needs review, so this comparison should not be used as a final ID by itself." : "")));

  return `
    <section class="detail-block lookalike-detail-block ${hasDeadly ? "has-deadly-lookalike" : (hasPoison ? "has-danger-lookalike" : (hasCaution ? "has-caution-lookalike" : ""))}">
      <h4>Look-alikes / Easily Confused</h4>
      ${summary ? `<p class="lookalike-summary">${esc(summary)}</p>` : ""}
      ${notes ? `<p>${esc(notes)}</p>` : ""}
      ${items ? `<ul class="list-tight lookalike-cues">${items}</ul>` : ""}
    </section>
  `;
}

function isCautionText(value = "") {
  const text = String(value || "").toLowerCase();
  return /\b(caution|avoid|unsafe|poison|toxic|raw|uncooked|undercooked|cook thoroughly|must be cooked|only when|only if|confident|careful[- ]?id|conservative|correctly identified|properly identified|good condition|look[- ]?alike|bitter|peppery|nibble|spit|not recommended|not a beginner|beginner shortcut|species concepts|shifting|gi distress|stomach|nausea|vomit|diarrhea|local confidence|specialist)\b/.test(text);
}

function isUsefulFoodText(value = "") {
  const text = String(value || "").toLowerCase();
  if (!text || isCautionText(text)) return false;
  return /\b(choice|excellent|good|fair|edible|food|culinary|meal|seasoning|tea|broth|soup|fried|sauté|saute|cook|cooked|dry|dried|powder|occasional|niche|target|table)\b/.test(text);
}

function foodUseBlock(record, title = "Food use") {
  const edibleUse = record.edible_use || null;
  const profile = record.mushroom_profile || {};
  const culinaryUses = clean(record.culinary_uses);
  const edibilityNotes = clean(record.edibility_notes || record.edibility_detail);
  const edibleNotes = clean(edibleUse?.notes || "");
  const processing = joinClean([
    ...asArray(record.processing_required),
    ...asArray(profile.processing_required)
  ]);
  const method = clean(edibleUse?.method || "");
  const taste = joinClean([
    ...asArray(record.taste),
    ...asArray(profile.taste)
  ]);
  const texture = joinClean([
    ...asArray(record.texture),
    ...asArray(profile.texture)
  ]);

  const bestUses = isUsefulFoodText(culinaryUses) ? culinaryUses : "";
  const cautionLines = uniqueLines([
    processing,
    edibilityNotes,
    edibleNotes,
    isCautionText(culinaryUses) ? culinaryUses : ""
  ]);

  const lines = [
    lineIf("Food quality", record.food_quality),
    lineIf("Use form", method && method.toLowerCase() !== "food" ? method : ""),
    lineIf("Taste", taste),
    lineIf("Texture", texture),
    lineIf("Best uses / cooking notes", bestUses),
    lineIf("Caution", cautionLines.join(" "))
  ].join("");

  if (!lines.trim()) return "";
  return `
    <section class="detail-block food-use-block">
      <h4>${esc(title)}</h4>
      <dl class="kv">
        ${lines}
      </dl>
    </section>
  `;
}

function boleteDetailLines(record) {
  if (String(record?.lane || "").toLowerCase() !== "bolete") return "";
  const profile = record.mushroom_profile || {};
  return [
    lineIf("Pore color", profileListValue(profile, "pore_color") || profileListValue(record, "poreColor")),
    lineIf("Bruising / staining", profileListValue(profile, "staining") || profileListValue(record, "staining")),
    lineIf("Stem features", profileListValue(profile, "stem_feature") || profileListValue(record, "stemFeature")),
    lineIf("Cap surface", profileListValue(profile, "cap_surface")),
    lineIf("Growing from / with", profileListValue(profile, "substrate") || profileListValue(record, "substrate")),
    lineIf("Associated trees", profileListValue(profile, "host_trees") || profileListValue(record, "hostTree")),
    lineIf("Tree association", profileListValue(profile, "host_filter_tokens") || profileListValue(record, "host_filter_tokens")),
    lineIf("Taste / warning clue", profileListValue(profile, "taste") || profileListValue(record, "taste"))
  ].join("");
}

function boleteDetailBlock(record) {
  const lines = boleteDetailLines(record);
  if (!lines.trim()) return "";
  return `
    <section class="detail-block bolete-id-block">
      <h4>Pored mushroom field marks</h4>
      <dl class="kv">${lines}${lineIf("Season note", record.mushroom_profile?.season_note)}</dl>
    </section>
  `;
}

function rareBlock(record) {
  const rare = record.rare_profile || {};
  const hasRare = rare.status || rare.legal_status || rare.up_relevance || rare.reason || rare.field_marks || rare.care_note || rare.sensitive_location || (rare.key_features || []).length;
  if (!hasRare) return "";
  return `
    <section class="detail-block">
      <h4>Rare / tracked status</h4>
      <dl class="kv">
        ${lineIf("Status", rare.status)}
        ${lineIf("Legal status", rare.legal_status)}
        ${lineIf("U.P. relevance", rare.up_relevance)}
        ${lineIf("Why tracked", rare.reason)}
        ${lineIf("Field marks", rare.field_marks)}
        ${lineIf("Care note", rare.care_note)}
        ${lineIf("Location caution", rare.sensitive_location ? "Keep exact locations private." : "")}
      </dl>
    </section>
    ${listBlock("Key features", rare.key_features)}
  `;
}

function dangerBlock(record) {
  const ed = String(record.edibility_status || "").trim().toLowerCase();
  const severity = clean(record.non_edible_severity);
  const level = clean(record.danger_level || (ed === "deadly" ? "Deadly" : ed === "poisonous" ? "Poisonous" : severity));
  const effects = clean(record.poisoning_effects || record.toxicity_notes || "");
  const affected = asArray(record.affected_systems).map(clean).filter(Boolean);
  const notes = clean(record.danger_notes || "");
  const hay = `${ed} ${severity} ${level} ${effects} ${notes}`.toLowerCase();
  const isDanger = /poison|deadly|toxic|danger|fatal|liver|kidney|neurolog|gastrointestinal|gi distress|vomit|diarrhea|unsafe/.test(hay);

  if (!isDanger && !effects && !affected.length) return "";
  const fallbackEffects = effects || (ed === "deadly"
    ? "Potentially life-threatening poisoning. Avoid entirely."
    : "Can cause poisoning or serious illness. Treat as unsafe to eat.");
  return `
    <section class="detail-block danger-detail-block">
      <h4>Danger / poisoning</h4>
      <dl class="kv">
        ${lineIf("Danger level", level || (ed === "deadly" ? "Deadly" : "Poisonous / unsafe"))}
        ${lineIf("Expected effects / symptoms", fallbackEffects)}
        ${lineIf("Body systems affected", affected.join(", "))}
        ${lineIf("Notes", notes)}
      </dl>
    </section>
  `;
}

function imageReviewBlock(record = {}) {
  const reasons = asArray(record.image_review_reasons).map(clean).filter(Boolean);
  const status = clean(record.image_review_status);
  const hasPlaceholder = asArray(record.images).some((value) => {
    const text = String(value || "").toLowerCase();
    return text.startsWith("data:image/svg") || text.includes("image%20needed") || text.includes("image needed");
  });
  const lines = [
    lineIf("Photo status", status ? status.replaceAll("_", " ") : (hasPlaceholder ? "Needs field photo" : "")),
    lineIf("Photo notes", reasons.join(" "))
  ].join("");
  if (!lines.trim()) return "";
  return `<section class="detail-block"><h4>Image review</h4><dl class="kv">${lines}</dl></section>`;
}

function linkBlock(record) {
  const links = Array.isArray(record.use_links)
    ? record.use_links
    : (Array.isArray(record.links) ? record.links.map((url) => ({ label: url, url })) : []);
  if (!links.length) return "";
  const items = links.map((item) => {
    const url = typeof item === "string" ? item : item.url;
    const label = clean(typeof item === "string" ? item : (item.label || item.url));
    if (!url || !label) return "";
    return `<li><a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(label)}</a></li>`;
  }).filter(Boolean);
  if (!items.length) return "";
  return `<section class="detail-block"><h4>Links</h4><ul class="list-tight">${items.join("")}</ul></section>`;
}

function mushroomSummaryBlock(record, typeLabel, habitats, overview) {
  const lines = [
    lineIf("Common names", Array.isArray(record.common_names) ? record.common_names.join(", ") : record.common_name),
    lineIf("Scientific name", record.scientific_name),
    lineIf("Species scope", record.species_scope || record.entry_scope),
    lineIf("Type", typeLabel),
    lineIf("Habitat", habitats),
    lineIf("Commonness", record.commonness),
    lineIf("Overview", overview)
  ].join("");
  if (!lines.trim()) return "";
  return `<section class="detail-block"><h4>Mushroom</h4><dl class="kv">${lines}</dl></section>`;
}

function mushroomMedicinalBlock(medicinal) {
  const summary = clean(medicinal.summary || "");
  const warnings = clean(medicinal.warnings || "");
  const actions = joinClean(asArray(medicinal.actions));
  const systems = joinClean(asArray(medicinal.body_systems));
  const terms = joinClean(asArray(medicinal.medical_terms));

  const lines = [
    lineIf("Use notes", summary),
    lineIf("Cautions", warnings),
    lineIf("Actions", actions),
    lineIf("Body systems", systems),
    lineIf("Medical terms", terms)
  ].join("");
  if (!lines.trim()) return "";
  return `<section class="detail-block"><h4>Medicinal Uses</h4><dl class="kv">${lines}</dl></section>`;
}

function mushroomIdentificationBlock(record, fieldIdentification) {
  const profile = record.mushroom_profile || {};
  const clueText = uniqueLines([
    fieldIdentification,
    record.identification_tips,
    record.field_marks,
    record.clues,
    record.field_clues,
    record.identification_clues,
    profile.identification_tips,
    profile.field_marks,
    profile.clues
  ]).join(" ");

  const lines = [
    lineIf("Identification tips", clueText),
    lineIf("Cap", profileListValue(profile, "cap") || profileListValue(record, "cap")),
    lineIf("Underside / fertile surface", profileListValue(profile, "underside") || profileListValue(record, "underside")),
    lineIf("Gills / pores", profileListValue(profile, "gills") || profileListValue(record, "gills")),
    lineIf("Spore print", profileListValue(profile, "spore_print") || profileListValue(record, "spore_print")),
    lineIf("Substrate", profileListValue(profile, "substrate") || profileListValue(record, "substrate")),
    lineIf("Host tree", profileListValue(profile, "host_trees") || profileListValue(record, "hostTree")),
    boleteDetailLines(record)
  ].join("");

  if (!lines.trim()) return "";
  return `<section class="detail-block bolete-id-block"><h4>Identification Tips</h4><dl class="kv">${lines}</dl></section>`;
}

function mushroomNotesBlock(record, notes, generalNotes, otherUses) {
  const values = uniqueLines([
    notes,
    generalNotes,
    otherUses ? `Other uses: ${otherUses}` : ""
  ]);
  if (!values.length) return "";
  return sectionWithParagraphs("Notes", values);
}

function mushroomSeasonalityBlock(record) {
  const profile = record.mushroom_profile || {};
  const lines = [
    lineIf("Season", seasonText(record)),
    lineIf("Season note", profile.season_note || record.season_note),
    lineIf("Harvest timing", record.harvest_timing || record.harvest_stage)
  ].join("");
  if (!lines.trim()) return "";
  return `<section class="detail-block"><h4>Seasonality</h4><dl class="kv">${lines}</dl></section>`;
}

function heroBlock(record, typeLabel, edibleUse) {
  return `
    <section class="detail-block detail-hero">
      ${renderImageSlot(record, "detail")}
      <div>
        <h3>${esc(record.display_name || record.common_name || record.slug || "Untitled")}</h3>
        <p class="muted">${esc(record.scientific_name || "")}</p>
        <div class="record-meta">
          ${record.lane ? `<span class="tag">Type: ${esc(record.lane === "bolete" ? "Pores / spongy underside" : record.lane)}</span>` : (typeLabel ? `<span class="tag">Type: ${esc(typeLabel)}</span>` : "")}
          ${record.commonness ? `<span class="tag">Commonality: ${esc(record.commonness)}</span>` : ""}
          ${seasonText(record) ? `<span class="tag">Season: ${esc(seasonText(record))}</span>` : ""}
          ${record.food_quality ? `<span class="tag ${/not recommended|avoid|poor|inedible/i.test(String(record.food_quality)) ? "danger" : "good"}">Food quality: ${esc(record.food_quality)}</span>` : ""}
          ${record.non_edible_severity && !edibleUse?.has_ingestible_use ? `<span class="tag danger">${esc(record.non_edible_severity)}</span>` : ""}
          ${record.image_review_status ? `<span class="tag review">Photo: ${esc(String(record.image_review_status).replaceAll("_", " "))}</span>` : ""}
          ${record.review_status === "needs_review" ? `<span class="tag review">Needs review</span>` : ""}
        </div>
      </div>
    </section>
  `;
}

function renderMushroomDetail(record, context) {
  const {
    typeLabel,
    medicinal,
    habitats,
    overview,
    fieldIdentification,
    edibleUse,
    otherUses,
    notes,
    generalNotes
  } = context;

  return `
    <article class="detail-grid">
      ${heroBlock(record, typeLabel, edibleUse)}
      ${mushroomSummaryBlock(record, typeLabel, habitats, overview)}
      ${foodUseBlock(record, "Culinary Uses")}
      ${mushroomMedicinalBlock(medicinal)}
      ${mushroomIdentificationBlock(record, fieldIdentification)}
      ${mushroomNotesBlock(record, notes, generalNotes, otherUses)}
      ${mushroomSeasonalityBlock(record)}
      ${lookAlikeBlock(record)}
      ${dangerBlock(record)}
      ${rareBlock(record)}
      ${imageReviewBlock(record)}
      ${linkBlock(record)}
    </article>
  `;
}

export function renderDetail(record) {
  const typeLabel = record.foraging_class ? String(record.foraging_class).replaceAll("_", " ") : (record.category || record.group || "");
  const medicinal = getMedicinalData(record);
  const medicinalUses = clean(medicinal.summary || "");
  const medicinalWarnings = clean(medicinal.warnings || "");
  const habitats = Array.isArray(record.habitats) && record.habitats.length
    ? record.habitats.join(", ")
    : (Array.isArray(record.habitat) ? record.habitat.join(", ") : (record.habitat_detail || ""));
  const otherUses = clean(record.other_uses);
  const notes = !isBuildNoteText(record.notes) ? clean(record.notes) : "";
  const generalNotes = !isBuildNoteText(record.general_notes) ? clean(record.general_notes) : "";
  const overview = clean(record.overview);
  const fieldIdentification = clean(record.field_identification);
  const edibleUse = record.edible_use || null;
  const context = {
    typeLabel,
    medicinal,
    habitats,
    overview,
    fieldIdentification,
    edibleUse,
    otherUses,
    notes,
    generalNotes
  };

  if (isMushroomRecord(record)) return renderMushroomDetail(record, context);

  return `
    <article class="detail-grid">
      ${heroBlock(record, typeLabel, edibleUse)}

      <section class="detail-block">
        <h4>Overview</h4>
        <dl class="kv">
          ${lineIf("Common names", Array.isArray(record.common_names) ? record.common_names.join(", ") : record.common_name)}
          ${lineIf("Scientific name", record.scientific_name)}
          ${lineIf("Species scope", record.species_scope || record.entry_scope)}
          ${lineIf("Type", typeLabel)}
          ${lineIf("Habitat", habitats)}
          ${lineIf("Field identification", fieldIdentification)}
          ${lineIf("Commonness", record.commonness)}
          ${lineIf("Season", seasonText(record))}
          ${lineIf("Overview", overview)}
        </dl>
      </section>

      ${boleteDetailBlock(record)}
      ${foodUseBlock(record)}
      ${medicinalUses ? `<section class="detail-block"><h4>Medicinal uses</h4><p>${esc(medicinalUses)}</p></section>` : ""}
      ${medicinalWarnings ? `<section class="detail-block"><h4>Medicinal cautions</h4><p>${esc(medicinalWarnings)}</p></section>` : ""}
      ${otherUses ? `<section class="detail-block"><h4>Other uses</h4><p>${esc(otherUses)}</p></section>` : ""}
      ${dangerBlock(record)}
      ${rareBlock(record)}
      ${notes ? `<section class="detail-block"><h4>Notes</h4><p>${esc(notes)}</p></section>` : ""}
      ${generalNotes ? `<section class="detail-block"><h4>General notes</h4><p>${esc(generalNotes)}</p></section>` : ""}
      ${lookAlikeBlock(record)}
      ${listBlock("Medicinal actions", medicinal.actions)}
      ${listBlock("Medicinal systems", medicinal.body_systems)}
      ${listBlock("Medicinal terms", medicinal.medical_terms)}
      ${imageReviewBlock(record)}
      ${linkBlock(record)}
    </article>
  `;
}
