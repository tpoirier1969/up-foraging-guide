import { esc } from "../lib/escape.js";

function asList(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function compact(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function pick(...values) {
  for (const value of values) {
    const text = compact(value);
    if (text) return text;
  }
  return "";
}

function isPlaceholderImage(value = "") {
  const text = compact(value).toLowerCase();
  if (!text) return true;
  return text.startsWith("data:image/svg")
    || text.includes("image%20needed")
    || text.includes("image needed")
    || text.includes("needs%20photo")
    || text.includes("needs photo")
    || text.includes("placeholder image")
    || text.includes("public%20usable%20photo%20not%20yet%20found")
    || text.includes("public usable photo not yet found");
}

function urlFromImageItem(item) {
  if (!item) return "";
  if (typeof item === "string") return compact(item);
  if (typeof item !== "object") return "";
  return pick(item.thumb, item.detail, item.full, item.src, item.url);
}

function sourcePageFromUrl(url = "") {
  const text = compact(url);
  if (!text) return "";
  if (text.includes("commons.wikimedia.org/wiki/File:")) return text.split("?")[0];
  return text;
}

function sourceLabelFor(entry = {}) {
  const source = compact(entry.source);
  const page = compact(entry.sourcePage || entry.source_page);
  const hay = `${source} ${page}`.toLowerCase();
  if (hay.includes("commons.wikimedia.org") || hay.includes("wikimedia commons") || hay.includes("commons-photo")) return "Wikimedia Commons";
  if (hay.includes("manifest") || hay.includes("hardwired")) return "Local hardwired manifest";
  if (source) return source;
  return "Image source";
}

function normalizeCreditEntry(entry = {}, record = {}) {
  const sourcePage = pick(entry.sourcePage, entry.source_page, entry.source_page_url, sourcePageFromUrl(entry.full), sourcePageFromUrl(entry.detail), sourcePageFromUrl(entry.thumb), sourcePageFromUrl(entry.src), sourcePageFromUrl(entry.url));
  const licenseUrl = pick(entry.licenseUrl, entry.license_url, entry.license_link);
  const author = pick(entry.author, entry.creator, entry.photographer, entry.credit);
  const title = pick(entry.title, entry.file_title, entry.name, "Image");
  return {
    slug: pick(entry.slug, record.slug),
    species: pick(entry.species, record.display_name, record.common_name, record.slug),
    scientific_name: pick(entry.scientific_name, record.scientific_name),
    source: sourceLabelFor({ ...entry, sourcePage }),
    title,
    author,
    credit: pick(entry.credit),
    license: pick(entry.license),
    licenseUrl,
    sourcePage,
    sourceImage: pick(entry.full, entry.detail, entry.thumb, entry.src, entry.url)
  };
}

function imageEntriesFromRecord(record = {}) {
  const entries = [];
  const structured = asList(record.images_structured);

  structured.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const url = urlFromImageItem(item);
    if (isPlaceholderImage(url)) return;
    entries.push(normalizeCreditEntry({
      ...item,
      title: pick(item.title, `Image ${index + 1}`),
      sourceImage: url,
      slug: record.slug,
      species: record.display_name || record.common_name || record.slug,
      scientific_name: record.scientific_name || ""
    }, record));
  });

  if (entries.length) return entries;

  asList(record.images).forEach((item, index) => {
    const url = urlFromImageItem(item);
    if (isPlaceholderImage(url)) return;
    if (typeof item === "object") {
      entries.push(normalizeCreditEntry({
        ...item,
        title: pick(item.title, `Image ${index + 1}`),
        sourceImage: url,
        slug: record.slug,
        species: record.display_name || record.common_name || record.slug,
        scientific_name: record.scientific_name || ""
      }, record));
      return;
    }
    entries.push(normalizeCreditEntry({
      title: `Image ${index + 1}`,
      source: url.includes("commons.wikimedia.org") ? "Wikimedia Commons" : "record image",
      sourcePage: sourcePageFromUrl(url),
      sourceImage: url,
      slug: record.slug,
      species: record.display_name || record.common_name || record.slug,
      scientific_name: record.scientific_name || ""
    }, record));
  });

  return entries;
}

function entriesFromSessionCredits(imageCredits) {
  return Array.from(imageCredits?.values?.() || [])
    .flat()
    .map((entry) => normalizeCreditEntry(entry));
}

function dedupeEntries(entries = []) {
  const seen = new Set();
  const out = [];
  for (const entry of entries) {
    const key = [entry.slug, entry.title, entry.sourcePage, entry.sourceImage].map((value) => compact(value).toLowerCase()).join("::");
    if (!key.replace(/:/g, "") || seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
  }
  return out;
}

function missingText(value, label) {
  return value ? esc(value) : `<span class="muted">${esc(label)} not recorded yet</span>`;
}

function creditRow(entry) {
  return `
    <article class="credit-card">
      <h3>${esc(entry.species || entry.slug || "Untitled")}</h3>
      ${entry.scientific_name ? `<p class="muted small"><em>${esc(entry.scientific_name)}</em></p>` : ""}
      <p><strong>Title:</strong> ${missingText(entry.title, "Title")}</p>
      <p><strong>Author / creator / photographer:</strong> ${missingText(entry.author, "Creator")}</p>
      ${entry.credit && entry.credit !== entry.author ? `<p><strong>Credit text:</strong> ${esc(entry.credit)}</p>` : ""}
      <p><strong>Source:</strong> ${esc(entry.source || "Image source")}</p>
      <p><strong>License:</strong> ${missingText(entry.license, "License")}</p>
      <div class="control-row compact">
        ${entry.sourcePage ? `<a class="buttonish" href="${esc(entry.sourcePage)}" target="_blank" rel="noreferrer">Source page</a>` : ""}
        ${entry.licenseUrl ? `<a class="buttonish" href="${esc(entry.licenseUrl)}" target="_blank" rel="noreferrer">License link</a>` : ""}
        ${entry.sourceImage ? `<a class="buttonish" href="${esc(entry.sourceImage)}" target="_blank" rel="noreferrer">Image file</a>` : ""}
      </div>
    </article>
  `;
}

function catalogRow(record) {
  const entries = imageEntriesFromRecord(record);
  const imageCount = entries.length;
  const missingCreator = entries.filter((entry) => !entry.author).length;
  const missingLicense = entries.filter((entry) => !entry.license || !entry.licenseUrl).length;
  const status = imageCount === 0
    ? "No usable image metadata found"
    : (missingCreator || missingLicense ? "Needs credit enrichment" : "TASL-style credit fields present");

  return `
    <article class="credit-card compact-card">
      <h3>${esc(record.display_name || record.common_name || record.slug || "Untitled")}</h3>
      ${record.scientific_name ? `<p class="muted small"><em>${esc(record.scientific_name)}</em></p>` : ""}
      <p><strong>Credit status:</strong> ${esc(status)}</p>
      <p><strong>Usable image records:</strong> ${imageCount}</p>
      ${imageCount ? `<p><strong>Missing creator:</strong> ${missingCreator} · <strong>Missing license/license link:</strong> ${missingLicense}</p>` : ""}
    </article>
  `;
}

export function renderCreditsPage(records, imageCredits, search = "") {
  const q = String(search || "").trim().toLowerCase();
  const recordEntries = (records || []).flatMap(imageEntriesFromRecord);
  const sessionEntries = entriesFromSessionCredits(imageCredits);
  const credits = dedupeEntries([...recordEntries, ...sessionEntries])
    .filter((entry) => {
      if (!q) return true;
      return [entry.species, entry.scientific_name, entry.title, entry.author, entry.credit, entry.license, entry.source, entry.slug]
        .join(" ")
        .toLowerCase()
        .includes(q);
    })
    .sort((a, b) => String(a.species || a.slug).localeCompare(String(b.species || b.slug)) || String(a.title).localeCompare(String(b.title)));

  const catalog = (records || [])
    .filter((record) => {
      if (!q) return true;
      return [record.display_name, record.common_name, record.scientific_name, record.slug].join(" ").toLowerCase().includes(q);
    })
    .sort((a, b) => String(a.display_name || a.common_name || a.slug).localeCompare(String(b.display_name || b.common_name || b.slug)));

  const totalImageRecords = recordEntries.length;
  const withCreator = recordEntries.filter((entry) => !!entry.author).length;
  const withLicense = recordEntries.filter((entry) => !!entry.license && !!entry.licenseUrl).length;
  const needsEnrichment = recordEntries.filter((entry) => !entry.author || !entry.license || !entry.licenseUrl).length;

  return `
    <section class="panel">
      <h2>Credits</h2>
      <p>This page now reads image-credit fields directly from the loaded species records, not only from images that happened to render during this browser session.</p>
      <p class="muted small">Target credit format is TASL-style: title, author / creator / photographer, source page, license, and license link. Records that still say only "Wikimedia Commons" are flagged here by missing creator or license details.</p>
    </section>

    <section class="panel">
      <div class="grid-3">
        <div class="stat-card"><div class="num">${records.length}</div><div>Species in catalog</div></div>
        <div class="stat-card"><div class="num">${totalImageRecords}</div><div>Usable image records found</div></div>
        <div class="stat-card"><div class="num">${withCreator}</div><div>With creator / photographer</div></div>
        <div class="stat-card"><div class="num">${withLicense}</div><div>With license + link</div></div>
        <div class="stat-card"><div class="num">${needsEnrichment}</div><div>Need credit enrichment</div></div>
        <div class="stat-card"><div class="num">0</div><div>Runtime Commons API calls</div></div>
      </div>
    </section>

    <section class="panel">
      <h3>Image credits</h3>
      ${credits.length ? `<section class="credit-list">${credits.map(creditRow).join("")}</section>` : `<p class="muted">No matching image credit records found.</p>`}
    </section>

    <section class="panel">
      <h3>Species image-credit audit</h3>
      <section class="credit-list">${catalog.map(catalogRow).join("")}</section>
    </section>
  `;
}
