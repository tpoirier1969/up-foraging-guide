import { esc } from "../lib/escape.js";

const SECTION_ORDER = [
  "Foraging",
  "Plants",
  "Mushrooms",
  "Mushroom Field Rules",
  "Medicinal",
  "Rare and Endangered",
  "Other"
];

const SUBSECTION_ORDER = [
  "Season",
  "Tree Species",
  "Misc Notes",
  "Articles",
  "Videos",
  "Guides & Databases"
];

const MUSHROOM_FIELD_RULES = [
  {
    title: "Early summer: start watching hardwoods and mixed woods",
    url: "https://midwestmycology.org/cantharellus-species/",
    source: "Midwest American Mycological Information",
    summary: "In Michigan, chanterelles can begin in late June and are often most prolific in July. Oak- and beech-dominated woods are especially worthwhile early-summer habitat, but treat this as a search shortcut rather than a rule that excludes other forests.",
    topics: ["mushrooms", "season", "summer", "hardwoods", "oak", "beech", "chanterelles"],
    section: "Mushroom Field Rules",
    subsection: "Season",
    resourceType: "Field heuristic"
  },
  {
    title: "Mid-summer: do not ignore northern conifers",
    url: "https://midwestmycology.org/cantharellus-species/",
    source: "Midwest American Mycological Information",
    summary: "Upper Michigan has chanterelles associated with conifers including spruce and eastern hemlock as well as hardwood-associated forms. In summer, mixed hardwood-conifer woods can therefore be more productive than a hardwood-only search plan suggests.",
    topics: ["mushrooms", "season", "summer", "conifers", "spruce", "hemlock", "mixed woods"],
    section: "Mushroom Field Rules",
    subsection: "Season",
    resourceType: "Field heuristic"
  },
  {
    title: "Late summer and fall: increase attention to conifer stands",
    url: "https://www.mushroomexpert.com/lactarius_affinis_viridilactis.html",
    source: "MushroomExpert.Com",
    summary: "Many northern Great Lakes mycorrhizal mushrooms associated with spruce, eastern hemlock, balsam fir, and pine fruit in late summer and fall. Conifer stands become especially worth checking then, but productive hardwoods should not be abandoned.",
    topics: ["mushrooms", "season", "late summer", "fall", "conifers", "spruce", "hemlock", "balsam fir", "pine"],
    section: "Mushroom Field Rules",
    subsection: "Season",
    resourceType: "Field heuristic"
  },
  {
    title: "Hemlock: do not avoid it",
    url: "https://midwestmycology.org/cantharellus-species/",
    source: "Midwest American Mycological Information",
    summary: "Eastern hemlock is a legitimate host tree for useful mycorrhizal fungi in the region, including northern Michigan chanterelles. A blanket rule to avoid mushrooms around hemlock would discard good habitat.",
    topics: ["mushrooms", "trees", "hemlock", "eastern hemlock", "chanterelles"],
    section: "Mushroom Field Rules",
    subsection: "Tree Species",
    resourceType: "Field heuristic"
  },
  {
    title: "Spruce: high-value northern mushroom habitat",
    url: "https://midwestmycology.org/cantharellus-species/",
    source: "Midwest American Mycological Information",
    summary: "Spruce supports important mycorrhizal fungi in Upper Michigan, including conifer-associated chanterelles. Spruce mixed with moss, balsam, hemlock, birch, or other trees is especially worth slowing down and checking carefully.",
    topics: ["mushrooms", "trees", "spruce", "conifers", "chanterelles"],
    section: "Mushroom Field Rules",
    subsection: "Tree Species",
    resourceType: "Field heuristic"
  },
  {
    title: "Jack pine: worthwhile, especially for pine-associated fungi",
    url: "https://www.mushroomexpert.com/suillus_tomentosus.html",
    source: "MushroomExpert.Com",
    summary: "Jack pine is not generic empty mushroom country. Some fungi are strongly tied to two-needle pines, and Suillus tomentosus is specifically documented from jack pine forests of the upper Midwest. Pine stands are most promising when soil moisture is adequate.",
    topics: ["mushrooms", "trees", "jack pine", "pine", "suillus", "upper midwest"],
    section: "Mushroom Field Rules",
    subsection: "Tree Species",
    resourceType: "Field heuristic"
  },
  {
    title: "Oak and beech: major hardwood hosts",
    url: "https://midwestmycology.org/cantharellus-species/",
    source: "Midwest American Mycological Information",
    summary: "Oak and beech are important mycorrhizal hosts and are especially useful trees to recognize when hunting Michigan chanterelles. Hardwood stands containing these trees deserve attention through the summer mushroom season.",
    topics: ["mushrooms", "trees", "oak", "beech", "hardwoods", "chanterelles"],
    section: "Mushroom Field Rules",
    subsection: "Tree Species",
    resourceType: "Field heuristic"
  },
  {
    title: "Maple: useful forest context, but not an ectomycorrhizal mushroom host",
    url: "https://www.mushroomexpert.com/glossary.html",
    source: "MushroomExpert.Com",
    summary: "Maples do not form the ectomycorrhizal partnerships responsible for many familiar forest mushrooms. A mushroom in maple woods may instead be associated with a nearby oak, pine, beech, birch, hemlock, spruce, or another host, or may be decomposing organic matter.",
    topics: ["mushrooms", "trees", "maple", "mycorrhizal", "host trees"],
    section: "Mushroom Field Rules",
    subsection: "Tree Species",
    resourceType: "Field heuristic"
  },
  {
    title: "Birch: keep it in the search picture",
    url: "https://www.mushroomexpert.com/imleria_badia.html",
    source: "MushroomExpert.Com",
    summary: "Birch participates in mycorrhizal mushroom habitat and is associated with multiple northern fungi. Birch is particularly useful as part of mixed-forest habitat, but its presence alone is not a guarantee of mushroom production.",
    topics: ["mushrooms", "trees", "birch", "mycorrhizal", "mixed woods"],
    section: "Mushroom Field Rules",
    subsection: "Tree Species",
    resourceType: "Field heuristic"
  },
  {
    title: "Learn the trees before trying to memorize every mushroom",
    url: "https://www.mushroomexpert.com/glossary.html",
    source: "MushroomExpert.Com",
    summary: "Many familiar mushroom groups are mycorrhizal, and some species are strongly host-specific. Tree identification can therefore eliminate large amounts of unproductive searching and can materially narrow an identification.",
    topics: ["mushrooms", "mycorrhizal", "tree identification", "host trees", "field strategy"],
    section: "Mushroom Field Rules",
    subsection: "Misc Notes",
    resourceType: "Field heuristic"
  },
  {
    title: "The host tree may be farther away than it looks",
    url: "https://www.mushroomexpert.com/glossary.html",
    source: "MushroomExpert.Com",
    summary: "Mycorrhizal mushrooms can fruit well beyond a tree's drip line because fine roots extend outward through the soil. Do not assume the nearest trunk is automatically the host; scan the surrounding stand before deciding the association.",
    topics: ["mushrooms", "mycorrhizal", "host trees", "roots", "field strategy"],
    section: "Mushroom Field Rules",
    subsection: "Misc Notes",
    resourceType: "Field heuristic"
  },
  {
    title: "In dry weather, hunt moisture refuges rather than a single tree species",
    url: "https://www.mushroomexpert.com/albatrellus_caeruleoporus.html",
    source: "MushroomExpert.Com",
    summary: "Shade, moss, low woods, thicker duff, north-facing slopes, creek terraces, and other places that hold moisture can remain productive while exposed sandy uplands dry out. Spruce, hemlock, and birch often occur in these cooler pockets, but moisture retention is the broader field clue.",
    topics: ["mushrooms", "dry weather", "moisture", "moss", "shade", "microclimate", "field strategy"],
    section: "Mushroom Field Rules",
    subsection: "Misc Notes",
    resourceType: "Field heuristic"
  },
  {
    title: "A productive patch is worth revisiting",
    url: "https://midwestmycology.org/cantharellus-species/",
    source: "Midwest American Mycological Information",
    summary: "Mycorrhizal fungi persist underground, and Michigan chanterelles are documented fruiting in the same places for multiple years. Save productive locations and recheck them under similar seasonal and moisture conditions.",
    topics: ["mushrooms", "repeat locations", "mycelium", "chanterelles", "field strategy"],
    section: "Mushroom Field Rules",
    subsection: "Misc Notes",
    resourceType: "Field heuristic"
  },
  {
    title: "Field rules tell you where to look, not what is safe to eat",
    url: "https://namyco.org/",
    source: "North American Mycological Association",
    summary: "Habitat, season, and tree association are supporting identification evidence only. Never use a field heuristic such as 'under pine' or 'summer hardwood mushroom' as proof of species identity or edibility.",
    topics: ["mushrooms", "safety", "identification", "edibility", "field strategy"],
    section: "Mushroom Field Rules",
    subsection: "Misc Notes",
    resourceType: "Safety rule"
  }
];

function norm(value) {
  return String(value || "").trim().toLowerCase();
}

function slugify(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function renderJumpButton(className, targetId, label) {
  return `<button class="${esc(className)}" type="button" data-ref-jump="${esc(targetId)}">${esc(label)}</button>`;
}

function renderRecord(item) {
  return `
    <article class="record-card ref-card">
      <h4>${item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noreferrer">${esc(item.title || "Untitled reference")}</a>` : esc(item.title || "Untitled reference")}</h4>
      <p class="muted small">${esc([item.source, item.resourceType].filter(Boolean).join(" · "))}</p>
      ${item.summary ? `<p>${esc(item.summary)}</p>` : ""}
    </article>
  `;
}

function installReferenceJumpHandler() {
  if (typeof document === "undefined") return;
  if (document.body?.dataset.refJumpHandlerInstalled === "1") return;
  if (document.body) document.body.dataset.refJumpHandlerInstalled = "1";

  document.addEventListener("click", (event) => {
    const button = event.target?.closest?.("[data-ref-jump]");
    if (!button) return;
    const targetId = button.dataset.refJump || "";
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", "#/references");
  });
}

export function renderReferencesPage(records, search = "") {
  installReferenceJumpHandler();

  const q = norm(search);
  const allRecords = [...(records || []), ...MUSHROOM_FIELD_RULES];
  const filtered = allRecords.filter(item => {
    if (!q) return true;
    return [
      item.title,
      item.source,
      item.summary,
      item.section,
      item.subsection,
      item.resourceType,
      ...(item.topics || [])
    ].join(" ").toLowerCase().includes(q);
  });

  const sections = SECTION_ORDER.map(section => {
    const sectionItems = filtered.filter(item => item.section === section);
    if (!sectionItems.length) return "";
    const sectionId = `ref-${slugify(section)}`;
    const subsectionHtml = SUBSECTION_ORDER.map(subsection => {
      const items = sectionItems.filter(item => item.subsection === subsection);
      if (!items.length) return "";
      const subsectionId = `${sectionId}-${slugify(subsection)}`;
      return `
        <div class="ref-subsection" id="${subsectionId}">
          <h4 class="ref-subsection-title">${esc(subsection)}</h4>
          <div class="record-list compact-record-list">${items.map(renderRecord).join("")}</div>
        </div>
      `;
    }).join("");

    const subsectionButtons = SUBSECTION_ORDER.filter(subsection => sectionItems.some(item => item.subsection === subsection))
      .map(subsection => renderJumpButton("chip-button", `${sectionId}-${slugify(subsection)}`, subsection))
      .join("");

    return `
      <section class="panel ref-section" id="${sectionId}">
        <div class="ref-section-head">
          <h3>${esc(section)}</h3>
        </div>
        ${subsectionButtons ? `<div class="chip-row">${subsectionButtons}</div>` : ""}
        ${subsectionHtml}
      </section>
    `;
  }).join("");

  const topButtons = SECTION_ORDER.filter(section => filtered.some(item => item.section === section))
    .map(section => renderJumpButton("section-jump-button", `ref-${slugify(section)}`, section))
    .join("");

  return `
    <section class="panel">
      <h2>References</h2>
      ${topButtons ? `<div class="section-jump-row">${topButtons}</div>` : ""}
    </section>

    ${sections || `<section class="panel empty-state"><h3>No references found</h3></section>`}
  `;
}
