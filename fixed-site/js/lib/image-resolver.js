import { openLightbox } from "../ui/dom.js";
import { state, rememberImageCredit, rememberImageFailure, rememberImageResult } from "../state.js";

let manifestPromise = null;

function placeholderSvg(label) {
  const text = String(label || "No image").slice(0, 42);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#eef3ef"/><rect x="40" y="40" width="1120" height="720" rx="28" ry="28" fill="#f8fbf8" stroke="#c9d5cd" stroke-width="6"/><circle cx="290" cy="300" r="70" fill="#dce9df"/><path d="M150 620l210-210 120 110 155-165 210 265H150z" fill="#dce9df"/><text x="600" y="690" text-anchor="middle" font-family="system-ui, sans-serif" font-size="46" fill="#5f6d63">${text}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function setBadge(container, text) {
  const badge = container?.querySelector("[data-image-badge]");
  if (badge) badge.textContent = text;
}

function setSourceLink(container, href, label = "source") {
  const link = container?.querySelector("[data-image-source-link]");
  if (!link) return;
  if (href) {
    link.href = href;
    link.textContent = label;
    link.hidden = false;
  } else {
    link.hidden = true;
    link.removeAttribute("href");
  }
}

function titleizeStage(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return text
    .replaceAll(/[_-]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function normalizeStructuredImages(record) {
  const structured = Array.isArray(record?.images_structured) ? record.images_structured : [];
  if (structured.length) {
    return structured
      .map((item, index) => {
        if (!item || typeof item !== "object") return null;
        return {
          thumb: item.thumb || item.detail || item.full || record?.list_thumbnail || "",
          detail: item.detail || item.full || item.thumb || record?.detail_images?.[index] || "",
          full: item.full || record?.enlarge_images?.[index] || item.detail || item.thumb || "",
          source: item.source || "record-structured",
          title: item.title || "",
          partOrStage: item.part_or_stage || item.partOrStage || "",
          sourcePage: item.source_page || item.sourcePage || "",
          author: item.author,
          credit: item.credit,
          license: item.license,
          licenseUrl: item.licenseUrl
        };
      })
      .filter(Boolean);
  }

  const detail = Array.isArray(record?.detail_images) ? record.detail_images : [];
  const enlarge = Array.isArray(record?.enlarge_images) ? record.enlarge_images : [];
  const count = Math.max(detail.length, enlarge.length, record?.list_thumbnail ? 1 : 0);
  if (!count) return [];

  return Array.from({ length: count }, (_, index) => ({
    thumb: index === 0
      ? (record?.list_thumbnail || detail[0] || enlarge[0] || "")
      : (detail[index] || enlarge[index] || detail[0] || record?.list_thumbnail || ""),
    detail: detail[index] || enlarge[index] || detail[0] || record?.list_thumbnail || "",
    full: enlarge[index] || detail[index] || enlarge[0] || detail[0] || record?.list_thumbnail || "",
    source: "record-structured",
    title: `Photo ${index + 1}`,
    partOrStage: "",
    sourcePage: ""
  })).filter((item) => item.thumb || item.detail || item.full);
}

function normalizeHardwiredImages(record) {
  const list = Array.isArray(record?.images) ? record.images : [];
  return list
    .map((item) => {
      if (typeof item === "string") {
        return {
          thumb: item,
          detail: item,
          full: item,
          source: "manifest-hardwired",
          title: record.display_name || record.common_name || record.slug,
          sourcePage: item
        };
      }
      if (!item || typeof item !== "object") return null;
      return {
        thumb: item.thumb || item.src || item.detail || item.full || "",
        detail: item.detail || item.src || item.full || item.thumb || "",
        full: item.full || item.src || item.detail || item.thumb || "",
        source: item.source || "manifest-hardwired",
        title: item.title || record.display_name || record.common_name || record.slug,
        partOrStage: item.part_or_stage || item.partOrStage || "",
        sourcePage: item.sourcePage || item.source_page || item.src || "",
        author: item.author,
        credit: item.credit,
        license: item.license,
        licenseUrl: item.licenseUrl
      };
    })
    .filter(Boolean);
}

async function loadLocalManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch("./fixed-site/data/species-images.json", { cache: "no-cache" })
      .then((res) => {
        if (!res.ok) throw new Error(`species-images.json ${res.status}`);
        return res.json();
      })
      .then((payload) => payload?.records || {})
      .catch(() => ({}));
  }
  return manifestPromise;
}

function creditAll(record, items, sourceLabel) {
  for (const item of items) {
    rememberImageCredit(record.slug, {
      slug: record.slug,
      species: record.display_name || record.common_name || record.slug,
      scientific_name: record.scientific_name || "",
      source: item.source || sourceLabel,
      title: item.title,
      author: item.author,
      credit: item.credit,
      license: item.license,
      licenseUrl: item.licenseUrl,
      sourcePage: item.sourcePage,
      query: item.query
    });
  }
}

async function ensureGallery(record) {
  const cached = state.imageCache.get(record.slug);
  if (cached?.items?.length) return cached.items;

  const structured = normalizeStructuredImages(record);
  if (structured.length) {
    rememberImageResult(record.slug, { source: "record-structured", items: structured });
    creditAll(record, structured, "record-structured");
    return structured;
  }

  const manifest = await loadLocalManifest();
  const localManifestItems = Array.isArray(manifest[record.slug]) ? manifest[record.slug] : [];
  if (localManifestItems.length) {
    const normalizedManifestItems = localManifestItems
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        return {
          thumb: item.thumb || item.src || item.detail || item.full || "",
          detail: item.detail || item.src || item.full || item.thumb || "",
          full: item.full || item.src || item.detail || item.thumb || "",
          source: item.source || "local-manifest",
          title: item.title || "",
          partOrStage: item.partOrStage || item.part_or_stage || "",
          sourcePage: item.sourcePage || item.source_page || "",
          author: item.author,
          credit: item.credit,
          license: item.license,
          licenseUrl: item.licenseUrl
        };
      })
      .filter(Boolean);

    rememberImageResult(record.slug, { source: "local-manifest", items: normalizedManifestItems });
    creditAll(record, normalizedManifestItems, "local-manifest");
    return normalizedManifestItems;
  }

  const hardwired = normalizeHardwiredImages(record);
  if (hardwired.length) {
    rememberImageResult(record.slug, { source: "embedded-hardwired", items: hardwired });
    creditAll(record, hardwired, "embedded-hardwired");
    return hardwired;
  }

  rememberImageFailure(record.slug);
  return [];
}

function describeItem(item, index) {
  return titleizeStage(item?.partOrStage) || item?.title || `Photo ${index + 1}`;
}

function candidateSourcesForVariant(item, variant) {
  const values = variant === "detail"
    ? [item?.detail, item?.full, item?.thumb]
    : [item?.thumb, item?.detail, item?.full];

  const seen = new Set();
  return values.filter((value) => {
    const key = String(value || "").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildCandidateQueue(items, variant) {
  return (items || []).flatMap((item) =>
    candidateSourcesForVariant(item, variant).map((src) => ({
      ...item,
      src
    }))
  );
}

function bindEnlarge(img, item, record, index) {
  const lightboxSrc = item?.full || item?.detail || item?.thumb || "";
  if (!lightboxSrc) return;

  img._lightboxPayload = {
    src: lightboxSrc,
    alt: img.alt,
    title: `${record.display_name || record.common_name || record.slug || "Species"} — ${describeItem(item, index)}`,
    sourceHref: item?.sourcePage || item?.full || item?.detail || item?.thumb || "",
    sourceLabel: item?.sourcePage ? "Open source" : "Open full image"
  };

  if (img.dataset.enlargeBound === "1") return;

  img.dataset.enlargeBound = "1";
  img.style.cursor = "zoom-in";
  img.title = "View larger image";
  img.addEventListener("click", (event) => {
    const payload = img._lightboxPayload;
    if (!payload?.src) return;
    event.preventDefault();
    event.stopPropagation();
    openLightbox(payload);
  });
}

function loadCandidateSequence(img, container, orderedItems, record, index, variant) {
  const queue = buildCandidateQueue(orderedItems, variant);
  let pos = 0;

  const tryNext = () => {
    const item = queue[pos++];
    const src = item?.src || "";
    if (!src) {
      img.onload = null;
      img.onerror = null;
      img.src = placeholderSvg(`${record.display_name || record.common_name || record.slug} needs photo`);
      img.dataset.resolvedSource = "missing";
      setBadge(container, "Needs photo");
      setSourceLink(container, "", "");
      return;
    }
    img.onload = () => {
      img.dataset.resolvedSource = item.source || "local-manifest";
      setBadge(container, describeItem(item, index));
      setSourceLink(container, item.sourcePage || item.full || "", item.sourcePage ? "Source" : "Full image");
      bindEnlarge(img, item, record, index);
    };
    img.onerror = () => { tryNext(); };
    img.src = src;
  };

  tryNext();
}

function variantForImage(img) {
  const slot = img.closest(".record-image-slot");
  if (slot?.classList.contains("detail")) return "detail";
  return "card";
}

async function hydrateImage(img, record) {
  const container = img.closest(".record-image-cell") || img.closest(".record-image-slot");
  const alt = img.dataset.alt || record.display_name || record.common_name || record.slug || "Species photo";
  const index = Number(img.dataset.imageIndex || 0);
  const variant = variantForImage(img);
  img.alt = alt;

  const items = await ensureGallery(record);
  const variantItems = (variant === "card" ? items.slice(0, 1) : items).filter(Boolean);

  const orderedItems = variant === "card"
    ? variantItems
    : [...variantItems.slice(index), ...variantItems.slice(0, index)];

  loadCandidateSequence(img, container, orderedItems, record, index, variant);
}

export function installLazyImages(root, getRecordBySlug) {
  const images = Array.from(root.querySelectorAll("img[data-record-image]"));
  if (!images.length) return;

  const hydrate = (img) => {
    if (img.dataset.hydrated === "1") return;
    img.dataset.hydrated = "1";
    const record = getRecordBySlug(img.dataset.slug || "");
    if (!record) return;
    if (!img.getAttribute("src") || img.getAttribute("src").startsWith("data:image/svg+xml")) {
      img.src = placeholderSvg(`${record.display_name || record.common_name || record.slug} loading photo`);
    }
    hydrateImage(img, record);
  };

  if (typeof IntersectionObserver !== "function") {
    images.forEach(hydrate);
    return;
  }

  images.slice(0, 18).forEach(hydrate);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      hydrate(entry.target);
    });
  }, { rootMargin: "240px 0px" });

  images.forEach((img) => {
    if (img.dataset.hydrated !== "1") observer.observe(img);
  });
}
