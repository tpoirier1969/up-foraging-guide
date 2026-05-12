function escAttr(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function placeholderSvg(label) {
  const text = String(label || "Loading photo").slice(0, 42);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#eef3ef"/><rect x="40" y="40" width="1120" height="720" rx="28" ry="28" fill="#f8fbf8" stroke="#c9d5cd" stroke-width="6"/><circle cx="290" cy="300" r="70" fill="#dce9df"/><path d="M150 620l210-210 120 110 155-165 210 265H150z" fill="#dce9df"/><text x="600" y="690" text-anchor="middle" font-family="system-ui, sans-serif" font-size="46" fill="#5f6d63">${text}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function normalizeCommonsFileName(value = "") {
  return String(value || "")
    .replace(/^File:/i, "")
    .replace(/^\d+px-/i, "")
    .replace(/\s+/g, "_")
    .toLowerCase();
}

function canonicalImageKey(value = "") {
  const raw = String(value || "").trim();
  if (!raw || raw.startsWith("data:image/svg")) return "";

  try {
    const parsed = new URL(raw, typeof window !== "undefined" ? window.location.href : "https://example.local/");
    const host = parsed.hostname.toLowerCase();
    const path = decodeURIComponent(parsed.pathname);

    const filePathMatch = path.match(/\/Special:FilePath\/([^/?#]+)/i);
    if (filePathMatch) return `commons:${normalizeCommonsFileName(filePathMatch[1])}`;

    const wikiFileMatch = path.match(/\/wiki\/File:([^/?#]+)/i);
    if (wikiFileMatch) return `commons:${normalizeCommonsFileName(wikiFileMatch[1])}`;

    if (host.includes("wikimedia.org") && path.includes("/wikipedia/commons/thumb/")) {
      const parts = path.split("/").filter(Boolean);
      const originalName = parts.length >= 2 ? parts[parts.length - 2] : parts[parts.length - 1];
      if (originalName) return `commons:${normalizeCommonsFileName(originalName)}`;
    }

    if (host.includes("wikimedia.org") && path.includes("/wikipedia/commons/")) {
      const parts = path.split("/").filter(Boolean);
      const fileName = parts[parts.length - 1] || "";
      if (fileName) return `commons:${normalizeCommonsFileName(fileName)}`;
    }

    parsed.search = "";
    parsed.hash = "";
    return `${parsed.hostname.toLowerCase()}${decodeURIComponent(parsed.pathname).toLowerCase()}`;
  } catch {
    return raw.split("?")[0].split("#")[0].toLowerCase();
  }
}

function itemFromStructured(record, item = {}, index = 0) {
  return {
    thumb: item.thumb || item.detail || item.full || record?.list_thumbnail || "",
    detail: item.detail || item.full || item.thumb || record?.detail_images?.[index] || "",
    full: item.full || record?.enlarge_images?.[index] || item.detail || item.thumb || "",
    sourcePage: item.sourcePage || item.source_page || "",
    title: item.title || "",
    partOrStage: item.part_or_stage || item.partOrStage || ""
  };
}

function itemFromUrl(record, value = "", index = 0, role = "image") {
  const url = String(value || "").trim();
  if (!url) return null;
  return {
    thumb: role === "thumb" ? url : (record?.list_thumbnail && index === 0 ? record.list_thumbnail : url),
    detail: role === "detail" ? url : url,
    full: role === "full" ? url : url,
    sourcePage: url,
    title: `Photo ${index + 1}`,
    partOrStage: ""
  };
}

function imageItemKey(item = {}) {
  return canonicalImageKey(item.sourcePage)
    || canonicalImageKey(item.full)
    || canonicalImageKey(item.detail)
    || canonicalImageKey(item.thumb);
}

function mergeImageItems(primary = {}, extra = {}) {
  return {
    ...primary,
    thumb: primary.thumb || extra.thumb || "",
    detail: primary.detail || extra.detail || "",
    full: primary.full || extra.full || "",
    sourcePage: primary.sourcePage || extra.sourcePage || "",
    title: primary.title || extra.title || "",
    partOrStage: primary.partOrStage || extra.partOrStage || ""
  };
}

function pushUnique(map, item) {
  if (!item || !(item.thumb || item.detail || item.full)) return;
  const key = imageItemKey(item);
  if (!key) return;
  if (map.has(key)) {
    map.set(key, mergeImageItems(map.get(key), item));
    return;
  }
  map.set(key, item);
}

function uniqueImageItems(record = {}) {
  const map = new Map();

  asArray(record.images_structured).forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    pushUnique(map, itemFromStructured(record, item, index));
  });

  // Convenience fields are treated as fallback/enrichment. They must never turn
  // thumb/detail/full variants of the same image into three visible gallery cells.
  asArray(record.detail_images).forEach((url, index) => pushUnique(map, itemFromUrl(record, url, index, "detail")));
  asArray(record.enlarge_images).forEach((url, index) => pushUnique(map, itemFromUrl(record, url, index, "full")));
  if (record.list_thumbnail) pushUnique(map, itemFromUrl(record, record.list_thumbnail, 0, "thumb"));

  asArray(record.images).forEach((item, index) => {
    if (typeof item === "string") {
      pushUnique(map, itemFromUrl(record, item, index, "image"));
      return;
    }
    if (!item || typeof item !== "object") return;
    pushUnique(map, {
      thumb: item.thumb || item.src || item.detail || item.full || "",
      detail: item.detail || item.src || item.full || item.thumb || "",
      full: item.full || item.src || item.detail || item.thumb || "",
      sourcePage: item.sourcePage || item.source_page || item.src || item.full || item.detail || item.thumb || "",
      title: item.title || `Photo ${index + 1}`,
      partOrStage: item.part_or_stage || item.partOrStage || ""
    });
  });

  return Array.from(map.values());
}

function initialImageSrc(record, variant, index) {
  const items = uniqueImageItems(record);
  const item = items[index] || items[0];
  if (item) {
    if (variant === "card") return item.thumb || item.detail || item.full || "";
    return item.detail || item.full || item.thumb || "";
  }
  return placeholderSvg(`${record.display_name || record.common_name || record.slug || "Species"} loading`);
}

function buildImageCell(record, variant, index, showMeta) {
  const alt = `${record.display_name || record.common_name || record.slug || "Species photo"} photo ${index + 1}`;
  const src = initialImageSrc(record, variant, index).replace(/"/g, "&quot;");
  return `
    <figure class="record-image-cell ${escAttr(variant)}">
      <img
        class="record-image ${escAttr(variant)}"
        data-record-image
        data-slug="${escAttr(record.slug || "") }"
        data-image-index="${index}"
        data-alt="${escAttr(alt)}"
        alt="${escAttr(alt)}"
        src="${src}"
        loading="lazy"
        decoding="async"
      >
      ${showMeta ? `
        <figcaption class="image-meta-line">
          <span class="image-source-badge" data-image-badge>Loading</span>
          <a hidden data-image-source-link target="_blank" rel="noreferrer">source</a>
        </figcaption>
      ` : ""}
    </figure>
  `;
}

export function renderImageSlot(record, variant = "card", options = {}) {
  const uniqueCount = uniqueImageItems(record).length;
  const count = variant === "detail" ? Math.max(1, Math.min(3, uniqueCount || 1)) : 1;
  const showMeta = options.showMeta !== false;
  return `
    <section class="record-image-slot ${escAttr(variant)} ${count > 1 ? "gallery" : "single"}" data-image-count="${count}">
      ${Array.from({ length: count }, (_, i) => buildImageCell(record, variant, i, showMeta)).join("")}
    </section>
  `;
}
