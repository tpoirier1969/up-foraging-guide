const pageRoot = document.getElementById("pageRoot");
const versionBadge = document.getElementById("versionBadge");
const APP_VERSION = "v4.3.123-r2026-06-07-placeholder-card-cleanup1";
const DISPLAY_VERSION = "V4.3.123-r26-06-07";
window.UP_FORAGING_APP_VERSION = APP_VERSION;
window.UP_FORAGING_DISPLAY_VERSION = DISPLAY_VERSION;

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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
