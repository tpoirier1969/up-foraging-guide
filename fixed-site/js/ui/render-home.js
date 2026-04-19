import { classifyRecord } from "../lib/merge.js";

export function renderHome(species, errors) {
  const plants = species.filter(r => classifyRecord(r).isPlant).length;
  const mushrooms = species.filter(r => classifyRecord(r).isMushroom).length;
  const medicinal = species.filter(r => classifyRecord(r).medicinal).length;
  const caution = species.filter(r => classifyRecord(r).lookalike).length;
  const review = species.filter(r => r.review_status === 'needs_review').length;

  return `
    <section class="panel">
      <h2>Phase 1 framework</h2>
      <p>This build wires the clean app to the split plant and mushroom files, restores the mushroom lane split, and adds a real review workflow without waiting for every species record to be finished.</p>
      <div class="grid-4">
        <div class="stat-card"><div class="num">${species.length}</div><div>Total records</div></div>
        <div class="stat-card"><div class="num">${plants}</div><div>Plants</div></div>
        <div class="stat-card"><div class="num">${mushrooms}</div><div>Mushrooms</div></div>
        <div class="stat-card"><div class="num">${review}</div><div>Needs review</div></div>
      </div>
    </section>

    <section class="panel">
      <div class="grid-3">
        <div class="stat-card"><div class="num">${medicinal}</div><div>Medicinal entries</div></div>
        <div class="stat-card"><div class="num">${caution}</div><div>Caution / other-use entries</div></div>
        <div class="stat-card"><div class="num">${errors.length}</div><div>Core load warnings</div></div>
      </div>
    </section>

    <section class="panel">
      <h3>Quick search</h3>
      <div class="controls">
        <div class="control-row">
          <input id="homeSearch" type="search" placeholder="Search species by common, scientific, notes, or aliases" style="flex:1;min-width:280px">
          <button id="homeSearchBtn" class="primary" type="button">Search</button>
        </div>
      </div>
    </section>

    <section class="panel">
      <h3>Mushroom lanes</h3>
      <div class="lane-grid">
        <a class="lane-card" href="#/mushrooms-gilled"><strong>Gilled</strong><span>Blade-like gills under the cap.</span></a>
        <a class="lane-card" href="#/boletes"><strong>Boletes</strong><span>Pores or sponge-like underside.</span></a>
        <a class="lane-card" href="#/mushrooms-other"><strong>Other</strong><span>Teeth, ridges, shelves, coral, jelly, and oddballs.</span></a>
      </div>
    </section>

    ${errors.length ? `
      <section class="error-box">
        <h3>Core load warnings</h3>
        <ul class="list-tight">
          ${errors.map(item => `<li><span class="codeish">${item.path}</span> — ${item.error}</li>`).join("")}
        </ul>
      </section>
    ` : ""}
  `;
}
