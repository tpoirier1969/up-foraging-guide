import { state } from "../state.js";

const ROUTE_HASH = "#/plants";
const PANEL_ID = "plantLaneQuickPanel";
const SUMMARY_ID = "plantLaneQuickSummary";
const STYLE_ID = "plantLaneQuickStyles";

const PLANT_LANES = [
  {
    id: "leaves-greens",
    label: "Leaves / Greens",
    short: "Leaves, shoots, fiddleheads, tender stems",
    patterns: [
      /\bleaf\b|\bleaves\b|\bgreen\b|\bgreens\b|\bshoot\b|\bshoots\b|\bfiddlehead\b|\bfiddleheads\b|\bstem\b|\bstalk\b|\bstalks\b|\bneedle\b|\bneedles\b/i
    ]
  },
  {
    id: "flowers",
    label: "Flowers",
    short: "Flowers, blossoms, petals, pollen",
    patterns: [
      /\bflower\b|\bflowers\b|\bblossom\b|\bblossoms\b|\bpetal\b|\bpetals\b|\bpollen\b/i
    ]
  },
  {
    id: "berries-fruits",
    label: "Berries / Fruits",
    short: "Berries, fruits, hips, cherries, pomes",
    patterns: [
      /\bberry\b|\bberries\b|\bfruit\b|\bfruits\b|\bhip\b|\bhips\b|\bcherry\b|\bcherries\b|\bapple\b|\bcrabapple\b|\bplum\b|\bgrape\b|\bgrapes\b|\bcurrant\b|\bcurrants\b|\bpersimmon\b|\bserviceberry\b|\bserviceberries\b/i
    ]
  },
  {
    id: "roots-tubers",
    label: "Roots / Tubers",
    short: "Roots, rhizomes, bulbs, tubers",
    patterns: [
      /\broot\b|\broots\b|\brhizome\b|\brhizomes\b|\btuber\b|\btubers\b|\bbulb\b|\bbulbs\b|\bcorm\b|\bcorms\b|\bunderground\b/i
    ]
  },
  {
    id: "nuts-seeds",
    label: "Nuts / Seeds",
    short: "Nuts, seeds, cones, grain-like parts",
    patterns: [
      /\bnut\b|\bnuts\b|\bseed\b|\bseeds\b|\bacorn\b|\bacorns\b|\bhazelnut\b|\bhazelnuts\b|\bbeechnut\b|\bbeechnuts\b|\bcone\b|\bcones\b|\bcatkin\b|\bcatkins\b/i
    ]
  },
  {
    id: "trees-shrubs-sap",
    label: "Trees / Shrubs / Sap",
    short: "Trees, shrubs, sap, bark, twigs",
    patterns: [
      /\btree\b|\btrees\b|\bshrub\b|\bshrubs\b|\bsap\b|\bsyrup\b|\bbark\b|\bcambium\b|\btwig\b|\btwigs\b|\bcatkin\b|\bcatkins\b|\bmaple\b|\bbirch\b|\bpine\b|\bspruce\b|\bhemlock\b|\bwillow\b/i
    ]
  },
  {
    id: "tea-infusions",
    label: "Tea / Infusions",
    short: "Leaves, flowers, bark, or needles used as tea",
    patterns: [
      /\btea\b|\binfusion\b|\binfusions\b|\bsteep\b|\bsteeped\b|\bbrew\b|\bbrewed\b|\btisane\b/i
    ],
    extraMatch(record) {
      const tags = asList(record.use_tags).map((value) => String(value || "").trim().toUpperCase());
      return tags.includes("T");
    }
  }
];

let selectedLaneId = "";
let observerInstalled = false;
let lastAppliedSignature = "";

function asList(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function normalize(value = "") {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function readable(value = "") {
  return String(value || "").toLowerCase().replace(/[_-]+/g, " ");
}

function isPlantsRoute() {
  return String(window.location.hash || "") === ROUTE_HASH || String(window.location.hash || "") === "#plants";
}

function plantRecords() {
  return (state.species || []).filter((record) => {
    const type = String(record.record_type || record.primary_type || record.kingdom_type || "").toLowerCase();
    if (type === "plant") return true;
    if (type === "mushroom") return false;
    return String(record.category || "").toLowerCase() !== "mushroom";
  });
}

function hasPositiveFoodSignal(record = {}) {
  const text = [
    record.food_role,
    record.category,
    record.foraging_class,
    record.culinary_uses,
    record.edibility_detail,
    record.edibility_notes,
    ...asList(record.use_tags)
  ].join(" ").toLowerCase();
  if (/\b(eat|edible|food|culinary|tea|infusion|sap|syrup|berry|fruit|green|root|nut|seed|flower|cook|cooked|fresh|jam|jelly|preserve|preserves|beverage)\b/.test(text)) return true;
  return /\bE\b|\bT\b/.test(asList(record.use_tags).join(" ").toUpperCase());
}

function isEdiblePlantRecord(record = {}) {
  const edibility = readable(record.edibility_status);
  const foodRole = readable(record.food_role);
  const severity = readable(record.non_edible_severity);
  const danger = readable([record.danger_level, record.poisoning_effects, record.toxicity_notes].join(" "));
  const notes = readable([record.edibility_detail, record.edibility_notes, record.culinary_uses].join(" "));
  const hay = `${edibility} ${foodRole} ${severity} ${danger} ${notes}`;

  const explicitlyAvoidOnly = /\b(deadly|fatal|poisonous|toxic|not edible|not_edible|inedible|avoid|unsafe|not recommended as food|not treated as food|not treated as an edible|look alike \/ not a food entry)\b/.test(hay);
  const conditionalFood = /\b(edible|food|culinary|tea|infusion|sap|syrup|ripe fruit|young leaves|cooked|properly prepared|with preparation|requires preparation)\b/.test(hay)
    || hasPositiveFoodSignal(record);

  if (explicitlyAvoidOnly && !conditionalFood) return false;
  if (foodRole === "avoid") return false;
  return conditionalFood || !explicitlyAvoidOnly;
}

function recordText(record = {}) {
  const profile = record.plant_profile || {};
  return [
    record.slug,
    record.display_name,
    record.common_name,
    record.category,
    record.foraging_class,
    record.food_role,
    record.notes,
    record.general_notes,
    record.overview,
    record.short_reason,
    record.culinary_uses,
    record.edibility_detail,
    record.edibility_notes,
    record.other_uses,
    ...asList(record.observedPart),
    ...asList(record.parts_used),
    ...asList(record.plant_parts),
    ...asList(record.use_tags),
    ...asList(record.size),
    ...asList(record.habitat),
    ...asList(record.habitats),
    ...asList(record.flowerColor),
    ...asList(record.fruitColor),
    profile.parts_used,
    profile.useful_parts,
    profile.summary
  ].join(" ");
}

function lanesForRecord(record = {}) {
  const text = recordText(record);
  const lanes = PLANT_LANES.filter((lane) => {
    const patternHit = lane.patterns.some((pattern) => pattern.test(text));
    const extraHit = typeof lane.extraMatch === "function" && lane.extraMatch(record);
    return patternHit || extraHit;
  });
  return lanes.length ? lanes : [{ id: "other", label: "Other", short: "Other edible plant use" }];
}

function countByLane(records = []) {
  const counts = new Map(PLANT_LANES.map((lane) => [lane.id, 0]));
  for (const record of records.filter(isEdiblePlantRecord)) {
    const lanes = lanesForRecord(record).filter((lane) => lane.id !== "other");
    for (const lane of lanes) counts.set(lane.id, (counts.get(lane.id) || 0) + 1);
  }
  return counts;
}

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .plant-lane-panel{border:1px solid rgba(47,93,70,.18);background:linear-gradient(135deg,rgba(244,248,241,.96),rgba(255,253,249,.96));}
    .plant-lane-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:12px;}
    .plant-lane-button{display:grid;gap:4px;text-align:left;border:1px solid var(--line,#d7dfd6);background:#fff;border-radius:16px;padding:12px 13px;cursor:pointer;box-shadow:0 1px 0 rgba(0,0,0,.02);}
    .plant-lane-button strong{font-size:.96rem;color:var(--accent,#2f5d46);}
    .plant-lane-button span{font-size:.78rem;color:#536257;line-height:1.25;}
    .plant-lane-button .plant-lane-count{font-weight:800;color:#28382e;}
    .plant-lane-button.active{border-color:var(--accent,#2f5d46);box-shadow:0 0 0 2px rgba(47,93,70,.14);background:#f6fbf5;}
    .plant-lane-toolbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin-top:12px;}
    .plant-lane-summary{font-size:.88rem;color:#4a594e;margin:0;}
    .plant-lane-card-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
    .plant-lane-card-tags .tag{font-size:.72rem;}
    @media (max-width:700px){.plant-lane-grid{grid-template-columns:minmax(0,1fr);}.plant-lane-toolbar{display:grid;grid-template-columns:1fr;}.plant-lane-toolbar button{width:100%;}}
  `;
  document.head.appendChild(style);
}

function buttonHtml(lane, count, active) {
  return `
    <button class="plant-lane-button${active ? " active" : ""}" type="button" data-plant-lane="${lane.id}" aria-pressed="${active ? "true" : "false"}">
      <strong>${escapeHtml(lane.label)} <span class="plant-lane-count">${count}</span></strong>
      <span>${escapeHtml(lane.short)}</span>
    </button>
  `;
}

function escapeHtml(value = "") {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function findPlantCards() {
  const cards = Array.from(document.querySelectorAll(".record-card"));
  if (cards.length) return cards;
  const nodes = Array.from(document.querySelectorAll("[data-detail]"));
  const seen = new Set();
  return nodes
    .map((node) => node.closest("article, section, .panel, .card, li, div"))
    .filter((node) => {
      if (!node || node.id === PANEL_ID || seen.has(node)) return false;
      seen.add(node);
      return true;
    });
}

function recordForCard(card) {
  const detail = card?.querySelector?.("[data-detail]");
  const slug = detail?.dataset?.detail || card?.dataset?.slug || "";
  if (slug) {
    const found = plantRecords().find((record) => record.slug === slug);
    if (found) return found;
  }

  const headingText = card?.querySelector?.("h2,h3,h4,strong")?.textContent || "";
  const key = normalize(headingText);
  if (!key) return null;
  return plantRecords().find((record) => {
    return normalize(record.display_name || record.common_name || record.slug) === key
      || normalize(record.common_name || "") === key
      || normalize(record.slug || "") === key;
  }) || null;
}

function currentRenderedPlantRecords() {
  return findPlantCards().map(recordForCard).filter(Boolean);
}

function ensurePanel() {
  if (!isPlantsRoute()) return null;
  injectStyles();

  const existing = document.getElementById(PANEL_ID);
  if (existing) return existing;

  const firstPanel = document.querySelector("main .panel");
  const pageRoot = document.getElementById("pageRoot") || document.querySelector("main");
  if (!pageRoot) return null;

  const panel = document.createElement("section");
  panel.id = PANEL_ID;
  panel.className = "panel plant-lane-panel";
  panel.innerHTML = `
    <div class="home-focus-heading">
      <div>
        <h3>Start with what you see or what you want</h3>
        <p class="muted small">Pick one edible-plant lane. Plants with multiple useful parts can appear in more than one lane, but lane selection is single-choice so the list does not turn into filter soup.</p>
      </div>
    </div>
    <div class="plant-lane-grid" data-plant-lane-grid></div>
    <div class="plant-lane-toolbar">
      <p id="${SUMMARY_ID}" class="plant-lane-summary">Showing all edible plant records.</p>
      <button id="plantLaneClearBtn" type="button">Show all edible plants</button>
    </div>
  `;

  if (firstPanel && firstPanel.parentNode === pageRoot) {
    pageRoot.insertBefore(panel, firstPanel);
  } else {
    pageRoot.prepend(panel);
  }

  panel.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-plant-lane]");
    if (button) {
      const laneId = button.dataset.plantLane;
      selectedLaneId = selectedLaneId === laneId ? "" : laneId;
      lastAppliedSignature = "";
      renderPanelAndApply();
      return;
    }
    if (event.target.closest?.("#plantLaneClearBtn")) {
      selectedLaneId = "";
      lastAppliedSignature = "";
      renderPanelAndApply();
    }
  });

  return panel;
}

function updateCardLaneTags(card, lanes) {
  let row = card.querySelector(".plant-lane-card-tags");
  if (!row) {
    row = document.createElement("div");
    row.className = "plant-lane-card-tags";
    const target = card.querySelector(".record-meta") || card.querySelector("h3,h4,h2")?.parentElement || card;
    target.appendChild(row);
  }
  row.innerHTML = lanes
    .filter((lane) => lane.id !== "other")
    .slice(0, 4)
    .map((lane) => `<span class="tag">${escapeHtml(lane.label)}</span>`)
    .join("");
}

function setCardVisible(card, show) {
  card.hidden = !show;
  if (show) {
    card.style.removeProperty("display");
  } else {
    card.style.setProperty("display", "none", "important");
  }
}

function updateVisiblePlantHeading(visible, totalEligible) {
  const headings = Array.from(document.querySelectorAll("main .panel h2"));
  const plantsHeading = headings.find((heading) => /^Plants\s*\(/i.test(heading.textContent || ""));
  if (!plantsHeading) return;
  const lane = PLANT_LANES.find((item) => item.id === selectedLaneId);
  plantsHeading.textContent = lane
    ? `Plants — ${lane.label} (${visible})`
    : `Plants (${totalEligible})`;
}

function renderPanelAndApply() {
  if (!isPlantsRoute()) {
    selectedLaneId = "";
    lastAppliedSignature = "";
    return;
  }

  const panel = ensurePanel();
  if (!panel) return;

  const renderedRecords = currentRenderedPlantRecords();
  const baseRecords = renderedRecords.length ? renderedRecords : plantRecords();
  const eligibleRecords = baseRecords.filter(isEdiblePlantRecord);
  const counts = countByLane(eligibleRecords);
  const grid = panel.querySelector("[data-plant-lane-grid]");
  if (grid) {
    grid.innerHTML = PLANT_LANES
      .map((lane) => buttonHtml(lane, counts.get(lane.id) || 0, selectedLaneId === lane.id))
      .join("");
  }

  const cards = findPlantCards();
  let visible = 0;
  let totalEligibleCards = 0;
  for (const card of cards) {
    const record = recordForCard(card);
    if (!record) continue;
    const isEligible = isEdiblePlantRecord(record);
    const lanes = lanesForRecord(record);
    updateCardLaneTags(card, lanes);
    const laneIds = new Set(lanes.map((lane) => lane.id));
    const laneMatch = !selectedLaneId || laneIds.has(selectedLaneId);
    const show = isEligible && laneMatch;
    card.dataset.plantLanes = lanes.map((lane) => lane.id).join(",");
    card.dataset.plantEdibleQuickLane = isEligible ? "1" : "0";
    setCardVisible(card, show);
    if (isEligible) totalEligibleCards += 1;
    if (show) visible += 1;
  }

  updateVisiblePlantHeading(visible, totalEligibleCards || eligibleRecords.length);

  const selectedLabel = PLANT_LANES.find((lane) => lane.id === selectedLaneId)?.label || "";
  const summary = document.getElementById(SUMMARY_ID);
  if (summary) {
    summary.textContent = selectedLabel
      ? `Showing ${visible} edible plant records in: ${selectedLabel}.`
      : `Showing all ${totalEligibleCards || eligibleRecords.length} edible plant records.`;
  }

  lastAppliedSignature = `${window.location.hash}|${cards.length}|${selectedLaneId}`;
}

function scheduleApply() {
  window.requestAnimationFrame(() => {
    const cards = findPlantCards();
    const signature = `${window.location.hash}|${cards.length}|${selectedLaneId}`;
    if (signature === lastAppliedSignature && document.getElementById(PANEL_ID)) return;
    renderPanelAndApply();
  });
}

function installObserver() {
  if (observerInstalled) return;
  observerInstalled = true;
  window.addEventListener("hashchange", () => {
    if (!isPlantsRoute()) selectedLaneId = "";
    lastAppliedSignature = "";
    scheduleApply();
  });
  const root = document.getElementById("pageRoot") || document.body;
  const observer = new MutationObserver(() => scheduleApply());
  observer.observe(root, { childList: true, subtree: true });
  scheduleApply();
}

installObserver();
