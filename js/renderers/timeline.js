import { MONTHS, MONTH_SHORT } from "../constants.js";
import { isMushroom, isPlant } from "../data-model.js";
import { renderResultCard } from "./cards.js";
import { escapeHtml } from "../utils.js";

function recordsForMonth(records, month) {
  return records.filter(record => (record.months_available || []).includes(month));
}

function monthStats(records, month) {
  const active = recordsForMonth(records, month);
  const plants = active.filter(isPlant).length;
  const mushrooms = active.filter(isMushroom).length;
  const medicinal = active.filter(record => record.medicinal_uses).length;
  return { total: active.length, plants, mushrooms, medicinal, active };
}

export function renderInteractiveTimeline(records, selectedMonth) {
  const monthData = MONTHS.map(month => ({ month, ...monthStats(records, month) }));
  const maxTotal = Math.max(...monthData.map(m => m.total), 1);
  const selected = monthData.find(item => item.month === selectedMonth) || monthData[0];
  const selectedResults = selected.active.slice().sort((a,b) => a.display_name.localeCompare(b.display_name));
  const resultsHtml = selectedResults.length
    ? selectedResults.map(renderResultCard).join("")
    : '<div class="panel empty-state"><h3>No entries in focus</h3><p>This month has no imported activity yet.</p></div>';

  return `
    <section class="timeline-page">
      <article class="panel timeline-intro">
        <div>
          <p class="eyebrow subtle">Season navigator</p>
          <h2>Move through the year</h2>
          <p>Pick a month first. The list below tightens around that time period and lets the available species come into focus.</p>
        </div>
        <div class="timeline-mini-summary">
          <div><span>${selected.total}</span><small>active entries</small></div>
          <div><span>${selected.plants}</span><small>plants</small></div>
          <div><span>${selected.mushrooms}</span><small>mushrooms</small></div>
          <div><span>${selected.medicinal}</span><small>medicinal</small></div>
        </div>
      </article>

      <section class="timeline-rail" aria-label="Month selector">
        ${monthData.map(({month,total,plants,mushrooms,medicinal}, index) => {
          const activeClass = month === selected.month ? 'active' : '';
          const height = 28 + Math.round((total / maxTotal) * 54);
          return `
            <button class="month-card ${activeClass}" type="button" data-timeline-month="${escapeHtml(month)}" aria-pressed="${month === selected.month ? 'true' : 'false'}">
              <span class="month-card-top">${MONTH_SHORT[index]}</span>
              <span class="month-bar-wrap"><span class="month-bar" style="height:${height}px"></span></span>
              <span class="month-total">${total}</span>
              <span class="month-breakdown">
                <i class="dot plant"></i>${plants}
                <i class="dot mushroom"></i>${mushrooms}
                <i class="dot medicinal"></i>${medicinal}
              </span>
            </button>
          `;
        }).join("")}
      </section>

      <article class="panel timeline-focus-card">
        <div>
          <p class="eyebrow subtle">Focused month</p>
          <h3>${escapeHtml(selected.month)}</h3>
          <p>${selected.total} entries in focus. Plants, mushrooms, and medicinal entries below are limited to this month.</p>
        </div>
        <div class="focus-pills">
          <span class="focus-pill plant">${selected.plants} plants</span>
          <span class="focus-pill mushroom">${selected.mushrooms} mushrooms</span>
          <span class="focus-pill medicinal">${selected.medicinal} medicinal</span>
        </div>
      </article>

      <section class="panel timeline-results-panel">
        <div class="result-header">
          <div>
            <h2>${escapeHtml(selected.month)} in focus</h2>
            <p class="results-meta">Click a different month above to change the season view.</p>
          </div>
          <div class="button-row">
            <a class="buttonish" href="#/plants">Plants</a>
            <a class="buttonish" href="#/mushrooms">Mushrooms</a>
          </div>
        </div>
        <div class="result-list">${resultsHtml}</div>
      </section>
    </section>
  `;
}
