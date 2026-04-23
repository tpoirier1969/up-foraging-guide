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

function pickFromStructured(record, variant, index) {
  const items = Array.isArray(record?.images_structured) ? record.images_structured : [];
  if (!items.length) return "";
  const item = items[index] || items[0] || {};
  if (variant === "card") {
    return item.thumb || item.detail || item.full || "";
  }
  return item.detail || item.thumb || item.full || "";
}

function pickFromConvenience(record, variant, index) {
  const listThumb = record?.list_thumbnail || "";
  const details = Array.isArray(record?.detail_images) ? record.detail_images : [];
  const fulls = Array.isArray(record?.enlarge_images) ? record.enlarge_images : [];
  if (variant === "card") {
    return listThumb || details[0] || fulls[0] || "";
  }
  return details[index] || fulls[index] || details[0] || fulls[0] || listThumb || "";
}

function pickFromImagesArray(record, variant, index) {
  const items = Array.isArray(record?.images) ? record.images : [];
  if (!items.length) return "";
  const item = items[index] || items[0];
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return "";
  if (variant === "card") {
    return item.thumb || item.src || item.detail || item.full || "";
  }
  return item.detail || item.src || item.full || item.thumb || "";
}

function initialImageSrc(record, variant, index) {
  return (
    pickFromStructured(record, variant, index) ||
    pickFromConvenience(record, variant, index) ||
    pickFromImagesArray(record, variant, index) ||
    placeholderSvg(`${record.display_name || record.common_name || record.slug || "Species"} loading`)
  );
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
  const count = variant === "detail" ? 3 : 1;
  const showMeta = options.showMeta !== false;
  return `
    <section class="record-image-slot ${escAttr(variant)} ${count > 1 ? "gallery" : "single"}" data-image-count="${count}">
      ${Array.from({ length: count }, (_, i) => buildImageCell(record, variant, i, showMeta)).join("")}
    </section>
  `;
}
