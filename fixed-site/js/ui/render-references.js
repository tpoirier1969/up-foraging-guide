import { esc } from "../lib/escape.js";

const SECTION_ORDER = [
  "Foraging",
  "Plants",
  "Mushrooms",
  "Medicinal",
  "Rare and Endangered",
  "Other"
];

const SUBSECTION_ORDER = ["Articles", "Videos", "Guides & Databases"];

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
  const filtered = (records || []).filter(item => {
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
