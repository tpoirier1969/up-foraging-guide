import { MONTHS, MONTH_SHORT } from "../constants.js";
import { escapeHtml } from "../utils.js";

export function renderTimelineRows(records) {
  return records.map(record => {
    const active = new Set(record.months_available || []);
    const cells = MONTHS.map((month, i) => `<div class="timeline-cell ${active.has(month) ? "on" : ""}">${MONTH_SHORT[i]}</div>`).join("");
    return `
      <article class="timeline-row">
        <div class="timeline-head">
          <div>
            <h3>${escapeHtml(record.display_name)}</h3>
            <p class="small-note">${escapeHtml(record.category)}</p>
          </div>
          <a class="buttonish" href="#detail/${encodeURIComponent(record.slug)}" data-detail-link="${escapeHtml(record.slug)}">Details</a>
        </div>
        <div class="timeline-grid">${cells}</div>
      </article>
    `;
  }).join("");
}
