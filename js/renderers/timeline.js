import { MONTHS, MONTH_SHORT, WEEKS } from "../constants.js";
import { isMushroom, isPlant } from "../data-model.js";
import { renderResultCard } from "./cards.js";
import { escapeHtml } from "../utils.js";

function recordsForMonth(records, month) {
  return records.filter(record => (record.months_available || []).includes(month));
}
function monthStats(records, month) {
  const active = recordsForMonth(records, month);
  return {
    total: active.length,
    plants: active.filter(isPlant).length,
    mushrooms: active.filter(isMushroom).length,
    medicinal: active.filter(record => record.medicinal_uses).length,
    active
  };
}
export function renderInteractiveTimeline(records, selectedMonth, selectedWeek = 1) {
  const monthData = MONTHS.map(month => ({ month, ...monthStats(records, month) }));
  const maxTotal = Math.max(...monthData.map(m => m.total), 1);
  const selected = monthData.find(item => item.month === selectedMonth) || monthData[0];
  const selectedResults = selected.active.slice().sort((a,b) => a.display_name.localeCompare(b.display_name));
  const resultsHtml = selectedResults.length ? selectedResults.map(r => renderResultCard(r, 'general')).join('') : '<div class="panel empty-state"><h3>No entries in focus</h3><p>This time slot has no imported activity yet.</p></div>';

  return `
    <section class="timeline-page">
      <article class="panel timeline-intro">
        <div>
          <p class="eyebrow subtle">Season navigator</p>
          <h2>Move through the year by week</h2>
          <p>Week view is now live. Imported dates still default to week 1 of each month unless better detail gets added, so the app flags that assumption instead of pretending otherwise.</p>
        </div>
        <div class="timeline-mini-summary">
          <div><span>${selected.total}</span><small>active entries</small></div>
          <div><span>${selected.plants}</span><small>plants</small></div>
          <div><span>${selected.mushrooms}</span><small>mushrooms</small></div>
          <div><span>${selected.medicinal}</span><small>medicinal</small></div>
        </div>
      </article>

      <section class="timeline-rail week-rail" aria-label="Week selector by month">
        ${monthData.map(({month,total}, index) => {
          const activeClass = month === selected.month ? 'active' : '';
          const height = 24 + Math.round((total / maxTotal) * 48);
          return `
            <article class="month-week-card ${activeClass}">
              <button class="month-card ${activeClass}" type="button" data-timeline-month="${escapeHtml(month)}" data-timeline-week="1" aria-pressed="${month === selected.month ? 'true' : 'false'}">
                <span class="month-card-top">${MONTH_SHORT[index]}</span>
                <span class="month-bar-wrap"><span class="month-bar" style="height:${height}px"></span></span>
                <span class="month-total">${total}</span>
              </button>
              <div class="week-chip-row">
                ${WEEKS.map(week => `<button class="week-chip ${(month === selected.month && week === selectedWeek) ? 'active' : ''}" type="button" data-timeline-month="${escapeHtml(month)}" data-timeline-week="${week}">W${week}</button>`).join('')}
              </div>
            </article>`;
        }).join('')}
      </section>

      <article class="panel timeline-focus-card">
        <div>
          <p class="eyebrow subtle">Focused slot</p>
          <h3>${escapeHtml(selected.month)} · Week ${selectedWeek}</h3>
          <p>Entries below are still month-based underneath the hood. Week ${selectedWeek} currently uses imported month data and defaults to the first week unless confirmed later.</p>
        </div>
        <div class="focus-pills">
          <span class="focus-pill plant">${selected.plants} plants</span>
          <span class="focus-pill mushroom">${selected.mushrooms} mushrooms</span>
          <span class="focus-pill medicinal">${selected.medicinal} medicinal</span>
          <a class="focus-pill review" href="#/review">needs review</a>
        </div>
      </article>

      <section class="panel timeline-results-panel">
        <div class="result-header">
          <div>
            <h2>${escapeHtml(selected.month)} · Week ${selectedWeek}</h2>
            <p class="results-meta">Week precision is currently assumed from month data until checked.</p>
          </div>
          <div class="button-row">
            <a class="buttonish" href="#/plants">Plants</a>
            <a class="buttonish" href="#/mushrooms">Mushrooms</a>
            <a class="buttonish" href="#/review">Needs Review</a>
          </div>
        </div>
        <div class="result-list">${resultsHtml}</div>
      </section>
    </section>
  `;
}
