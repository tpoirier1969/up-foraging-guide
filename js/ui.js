import { APP_VERSION } from "./constants.js";
import { state } from "./state.js";
import { renderDetail } from "./renderers/detail.js";

const els = {
  pageRoot: document.getElementById("pageRoot"),
  topSummary: document.getElementById("topSummary"),
  versionBadge: document.getElementById("versionBadge"),
  detailModal: document.getElementById("detailModal"),
  modalContent: document.getElementById("modalContent"),
  closeModalBtn: document.getElementById("closeModalBtn")
};

export function updateHeaderStats(records) {
  const images = records.reduce((sum, record) => sum + (record.images?.length || 0), 0);
  const categories = new Set(records.map(record => record.category)).size;
  const medicinal = records.filter(record => record.medicinal_uses).length;
  els.versionBadge.textContent = APP_VERSION;
  els.topSummary.innerHTML = `
    <div class="summary-stat"><span class="num">${records.length}</span><span class="label">species entries</span></div>
    <div class="summary-stat"><span class="num">${images}</span><span class="label">images</span></div>
    <div class="summary-stat"><span class="num">${categories}</span><span class="label">categories</span></div>
    <div class="summary-stat"><span class="num">${medicinal}</span><span class="label">medicinal entries</span></div>
  `;
}

export function renderPage(html) {
  els.pageRoot.innerHTML = html;
}

export function markActiveNav(route) {
  document.querySelectorAll("[data-nav]").forEach(link => {
    link.classList.toggle("active", link.dataset.nav === route);
  });
}

export function bindDetailLinks() {
  document.querySelectorAll("[data-detail-link]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const slug = link.dataset.detailLink;
      openDetail(slug);
    });
  });
}

export function bindSharedActions({ onFilterChange, onClearFilters }) {
  document.querySelectorAll("[data-filter]").forEach(el => {
    const eventName = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(eventName, onFilterChange);
  });
  document.querySelectorAll('[data-action="clear-filters"]').forEach(btn => {
    btn.addEventListener("click", onClearFilters);
  });
}

export function openDetail(slug) {
  const record = state.allRecords.find(item => item.slug === slug);
  if (!record) return;
  els.modalContent.innerHTML = renderDetail(record);
  els.detailModal.showModal();
}

export function closeDetail() {
  els.detailModal.close();
}

export function wireModal() {
  els.closeModalBtn.addEventListener("click", closeDetail);
  els.detailModal.addEventListener("click", event => {
    const rect = els.detailModal.getBoundingClientRect();
    const clickedInside = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!clickedInside) closeDetail();
  });
}
