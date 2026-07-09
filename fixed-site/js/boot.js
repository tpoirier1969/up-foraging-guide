const pageRoot = document.getElementById("pageRoot");
const versionBadge = document.getElementById("versionBadge");
const BUNDLED_VERSION_INFO = Object.freeze({
  version: "v4.3.192-r2026-07-09-option-one-polish1",
  display_version: "V4.3.192-r26-07-09",
  cache_bust: "v4.3.192-r2026-07-09-option-one-polish1"
});
const FALLBACK_VERSION_INFO = BUNDLED_VERSION_INFO;
let APP_VERSION = FALLBACK_VERSION_INFO.version;
let DISPLAY_VERSION = FALLBACK_VERSION_INFO.display_version;
window.UP_FORAGING_APP_VERSION = APP_VERSION;
window.UP_FORAGING_DISPLAY_VERSION = DISPLAY_VERSION;

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function releaseNumber(value) {
  const match = String(value || "").match(/v4\.3\.(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function chooseVersionInfo(info = {}) {
  const loadedVersion = String(info?.version || info?.app_version || "").trim();
  const loadedDisplayVersion = String(info?.display_version || info?.displayVersion || "").trim();
  const loadedRelease = releaseNumber(loadedVersion || loadedDisplayVersion);
  const bundledRelease = releaseNumber(BUNDLED_VERSION_INFO.version);

  // If the server or browser hands back an older version.json, keep the bundled
  // version so the badge cannot regress after first paint.
  if (loadedRelease && bundledRelease && loadedRelease < bundledRelease) {
    console.warn(`Ignoring stale version.json (${loadedVersion || loadedDisplayVersion}); bundled app is ${BUNDLED_VERSION_INFO.version}.`);
    return BUNDLED_VERSION_INFO;
  }

  const version = loadedVersion || BUNDLED_VERSION_INFO.version;
  return {
    ...info,
    version,
    display_version: loadedDisplayVersion || version || BUNDLED_VERSION_INFO.display_version,
    cache_bust: String(info?.cache_bust || info?.cacheBust || version || BUNDLED_VERSION_INFO.cache_bust).trim()
  };
}

async function loadVersionInfo() {
  try {
    const response = await fetch(`version.json?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`version.json returned HTTP ${response.status}`);
    const info = chooseVersionInfo(await response.json());
    APP_VERSION = info.version || FALLBACK_VERSION_INFO.version;
    DISPLAY_VERSION = info.display_version || APP_VERSION || FALLBACK_VERSION_INFO.display_version;
    window.UP_FORAGING_APP_VERSION = APP_VERSION;
    window.UP_FORAGING_DISPLAY_VERSION = DISPLAY_VERSION;
    return info;
  } catch (err) {
    console.warn("Could not load version.json; using fallback version.", err);
    APP_VERSION = FALLBACK_VERSION_INFO.version;
    DISPLAY_VERSION = FALLBACK_VERSION_INFO.display_version;
    window.UP_FORAGING_APP_VERSION = APP_VERSION;
    window.UP_FORAGING_DISPLAY_VERSION = DISPLAY_VERSION;
    return FALLBACK_VERSION_INFO;
  }
}

function versionedHref(href, version) {
  const raw = String(href || "");
  if (!raw || !version) return raw;
  const [withoutHash, hash = ""] = raw.split("#");
  const [path] = withoutHash.split("?");
  return `${path}?v=${encodeURIComponent(version)}${hash ? `#${hash}` : ""}`;
}

function applyStaticAssetVersion(version) {
  document.querySelectorAll("link[data-versioned][href]").forEach((link) => {
    const current = link.getAttribute("href") || "";
    const next = versionedHref(current, version);
    if (next && current !== next) link.setAttribute("href", next);
  });
}

function setupImageAuditMode() {
  const params = new URLSearchParams(window.location.search || "");
  const auditValue = String(params.get("audit") || "").toLowerCase();
  const imageAuditValue = String(params.get("imageAudit") || params.get("imageaudit") || "").toLowerCase();
  const enabled = auditValue === "images" || imageAuditValue === "1" || imageAuditValue === "true" || imageAuditValue === "images";
  window.UP_FORAGING_IMAGE_AUDIT = enabled;
  document.documentElement.classList.toggle("image-audit-mode", enabled);
  document.body?.classList.toggle("image-audit-mode", enabled);
}

function setupMobileMenu() {
  const toggle = document.getElementById("mobileMenuToggle");
  const nav = document.getElementById("primaryNav");
  if (!toggle || !nav) return;
  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = !document.body.classList.contains("nav-open");
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", (event) => {
    if (event.target?.closest?.("a") && window.matchMedia("(max-width: 700px)").matches) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 701px)").matches) closeMenu();
  });
}

function renderFatal(message, detail = "") {
  if (!pageRoot) return;
  pageRoot.innerHTML = `
    <section class="error-box">
      <h2>Startup failed</h2>
      <p>${esc(message)}</p>
      ${detail ? `<p class="codeish">${esc(detail)}</p>` : ""}
    </section>
  `;
}

function showVersion() {
  versionBadge?.replaceChildren(document.createTextNode(DISPLAY_VERSION));
}

async function start() {
  setupImageAuditMode();
  setupMobileMenu();
  showVersion();
  await loadVersionInfo();
  applyStaticAssetVersion(APP_VERSION);
  showVersion();
  try {
    const mod = await import(`./app-core.js?v=${encodeURIComponent(APP_VERSION)}`);
    if (typeof mod?.startApp !== "function") throw new Error("app-core.js loaded, but startApp was not exported.");
    await mod.startApp();
    showVersion();
  } catch (err) {
    renderFatal("The shell loaded, but the app core failed before the first route rendered.", err?.message || String(err));
  }
}

start();
