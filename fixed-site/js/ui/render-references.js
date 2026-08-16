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
    title: "Morels: use a 30-day rainfall history, not a fixed days-after-rain countdown",
    url: "https://pubmed.ncbi.nlm.nih.gov/17363234/",
    source: "Mycological Research / PubMed",
    summary: "A five-year Morchella study found abundance was positively related to rain events over 10 mm during the 30 days before fruiting, while temperature better predicted onset. For practical hunting, check whether the previous month has supplied meaningful moisture rather than assuming morels appear a fixed number of days after one storm.",
    topics: ["mushrooms", "season", "spring", "morels", "rain", "30 days", "temperature"],
    section: "Mushroom Field Rules",
    subsection: "Season",
    resourceType: "Field heuristic"
  },
  {
    title: "Porcini-type boletes: about 10-12 days after a heavy rain is a reasonable watch window, not a guarantee",
    url: "https://italianmycology.unibo.it/article/view/16464",
    source: "Italian Journal of Mycology",
    summary: "A Boletus edulis field study found the strongest positive productivity response about 12 days after intense rainfall of at least 20 mm, with related work reporting community fruiting near day 10. This was European forest research, so use roughly 10-12 days after a soaking rain as a scouting window, not a UP prediction rule.",
    topics: ["mushrooms", "season", "rain", "Boletus edulis", "porcini", "10 days", "12 days"],
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
    title: "Forest interior can beat the edge for ectomycorrhizal fruiting",
    url: "https://nph.onlinelibrary.wiley.com/doi/full/10.1002/ppp3.70008",
    source: "Plants, People, Planet",
    summary: "A long-term postharvest edge study found ectomycorrhizal mushroom fruiting substantially reduced in edge zones and openings compared with intact forest interior. Edges can still hold particular species, but do not assume brighter edge habitat is generally the best place for mycorrhizal mushrooms.",
    topics: ["mushrooms", "forest edge", "forest interior", "mycorrhizal", "fragmentation", "field strategy"],
    section: "Mushroom Field Rules",
    subsection: "Misc Notes",
    resourceType: "Field heuristic"
  },
  {
    title: "Older forest is different, not automatically better",
    url: "https://research.fs.usda.gov/treesearch/5401",
    source: "USDA Forest Service",
    summary: "Forest-age studies show ectomycorrhizal species composition changes strongly among young, rotation-age, and old-growth stands, but total richness does not simply climb with age and above-ground sporocarp biomass can even be greater in younger stands. Use stand age to predict a different fungal community, not as a universal quality score.",
    topics: ["mushrooms", "stand age", "old growth", "young forest", "succession", "mycorrhizal"],
    section: "Mushroom Field Rules",
    subsection: "Misc Notes",
    resourceType: "Field heuristic"
  },
  {
    title: "Jack-pine fungal communities change as the stand ages after fire",
    url: "https://research.fs.usda.gov/treesearch/45330",
    source: "USDA Forest Service",
    summary: "Research in jack-pine stands from 5 to 56 years after wildfire found clear succession in ectomycorrhizal communities as canopy closure and soil nitrogen forms changed. Two jack-pine stands of different ages may therefore support meaningfully different fungi even on similar sandy ground.",
    topics: ["mushrooms", "jack pine", "stand age", "wildfire", "succession", "mycorrhizal"],
    section: "Mushroom Field Rules",
    subsection: "Misc Notes",
    resourceType: "Field heuristic"
  },
  {
    title: "Soil pH and moisture help define the fungal neighborhood",
    url: "https://pubmed.ncbi.nlm.nih.gov/36312934/",
    source: "Peer-reviewed ectomycorrhizal community study",
    summary: "Ectomycorrhizal community composition can change strongly along soil-pH, soil-moisture, slope-aspect, and temperature gradients. Do not expect identical mushroom communities simply because the same tree species occurs on dry acidic sand and on cooler, richer, moister soil.",
    topics: ["mushrooms", "soil pH", "soil moisture", "aspect", "habitat", "mycorrhizal"],
    section: "Mushroom Field Rules",
    subsection: "Misc Notes",
    resourceType: "Field heuristic"
  },
  {
    title: "Near Lake Superior, summer mushroom timing can lag inland sites",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10753639/",
    source: "Ecology and Evolution",
    summary: "Lake Superior measurably cools shoreline and nearby forests during summer, in some settings for kilometers inland. Because mushroom fruiting is temperature-sensitive, nearshore woods may remain cooler and seasonally behind inland sites. Treat this as a microclimate clue rather than a fixed number of days of delay.",
    topics: ["mushrooms", "Lake Superior", "microclimate", "summer", "cooling", "Upper Michigan"],
    section: "Mushroom Field Rules",
    subsection: "Misc Notes",
    resourceType: "Field heuristic"
  },
  {
    title: "Seeing lots of mushrooms means fruiting conditions are active, not that every underground fungus is fruiting",
    url: "https://academic.oup.com/femsre/article/31/4/388/2398987",
    source: "FEMS Microbiology Reviews",
    summary: "Visible fruiting bodies are poor measures of the entire ectomycorrhizal community underground. A flush of Russulas, Amanitas, boletes, or milkcaps is useful evidence that some fungi are fruiting under current conditions, but it does not reliably predict which other species are about to appear.",
    topics: ["mushrooms", "indicator fungi", "fruiting", "mycorrhizal", "field strategy"],
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
