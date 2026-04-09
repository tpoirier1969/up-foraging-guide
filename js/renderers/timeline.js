import { MONTHS, MONTH_SHORT, WEEKS } from "../constants.js";
import { isMushroom, isPlant, medicinalRecords } from "../data-model.js";
import { renderResultCard } from "./cards.js";
import { escapeHtml } from "../utils.js";

function recordsForMonth(records, month) {
  return records.filter(record => (record.months_available || []).includes(month));
}

function monthSummary(records, month) {
  const active = recordsForMonth(records, month);
  return {
    active,
    total: active.length,
    plants: active.filter(isPlant).length,
    mushrooms: active.filter(isMushroom).length,
    medicinal: medicinalRecords(active).length
  };
}

export function renderInteractiveTimeline(records, selectedMonth, selectedWeek = 1, paneMode = 'results') {
  const selected = monthSummary(records, selectedMonth);
  const selectedResults = selected.active.slice().sort((a, b) => a.display_name.localeCompare(b.display_name));
  const resultsHtml = selectedResults.length
    ? selectedResults.map(record => renderResultCard(record, 'general')).join('')
    : '<div class="panel empty-state"><h3>No entries in focus</h3><p>This month and week slot do not have imported activity yet.</p></div>';

  return `
    <section class="timeline-compact-shell">
      <article class="panel timeline-selector-card">
        <div class="timeline-toolbar">
          <div>
            <p class="eyebrow subtle">Season rail</p>
            <h3>${escapeHtml(selectedMonth)} · Week ${selectedWeek}</h3>
            <p>The week setting still rides on month-level data until better timing is verified, but the selector itself is finally compact instead of wasting a cornfield of screen space.</p>
          </div>
          <div class="focus-pills timeline-focus-pills">
            <span class="focus-pill plant">${selected.plants} plants</span>
            <span class="focus-pill mushroom">${selected.mushrooms} mushrooms</span>
            <span class="focus-pill medicinal">${selected.medicinal} medicinal</span>
          </div>
        </div>

        <div class="timeline-window" aria-label="Month selector">
          <button class="timeline-shift-btn" type="button" data-action="timeline-shift" data-direction="prev" aria-label="Previous month">‹</button>
          <div class="timeline-pill-viewport">
            <div class="timeline-pill-rail">
              ${MONTHS.map((month, index) => `
                <button class="timeline-pill ${month === selectedMonth ? 'active' : ''}" type="button" data-timeline-month="${escapeHtml(month)}" data-timeline-week="${selectedWeek}" aria-pressed="${month === selectedMonth ? 'true' : 'false'}">
                  <span>${MONTH_SHORT[index]}</span>
                </button>
              `).join('')}
            </div>
          </div>
          <button class="timeline-shift-btn" type="button" data-action="timeline-shift" data-direction="next" aria-label="Next month">›</button>
        </div>

        <div class="week-chip-row timeline-week-row">
          ${WEEKS.map(week => `<button class="week-chip ${week === selectedWeek ? 'active' : ''}" type="button" data-timeline-month="${escapeHtml(selectedMonth)}" data-timeline-week="${week}">Week ${week}</button>`).join('')}
        </div>
      </article>

      ${paneMode === 'filters' ? `
        <article class="panel workspace-pane filter-pane-card timeline-filter-pane">
          <div class="section-heading-block">
            <h3>Timeline filters</h3>
            <p>Pick the month and week above. The focused slot below tells you what that choice currently catches.</p>
          </div>
          <div class="timeline-filter-summary-grid">
            <div><strong>${selected.total}</strong><span>Entries in ${escapeHtml(selectedMonth)}</span></div>
            <div><strong>${selectedWeek}</strong><span>Selected week</span></div>
            <div><strong>${selected.plants}</strong><span>Plant entries</span></div>
            <div><strong>${selected.mushrooms}</strong><span>Mushroom entries</span></div>
          </div>
          <div class="workspace-actions">
            <button type="button" data-timeline-month="${escapeHtml(MONTHS[new Date().getMonth()])}" data-timeline-week="1">Jump to current month</button>
            <a class="buttonish" href="#/review">Needs Review</a>
          </div>
          <p class="filter-note">No bars, no counts welded onto every month tile, no giant block. Just the selector and the focused slot.</p>
        </article>
      ` : `
        <section class="panel workspace-pane results-pane-card timeline-results-panel">
          <div class="result-header compact-result-header">
            <div>
              <h3>${escapeHtml(selectedMonth)} · Week ${selectedWeek}</h3>
              <p class="results-meta">${selected.total} match${selected.total === 1 ? '' : 'es'}</p>
            </div>
            <a class="buttonish" href="#/review">Needs Review</a>
          </div>
          <div class="result-list">${resultsHtml}</div>
        </section>
      `}
    </section>
  `;
}
