const pageRoot = document.getElementById("pageRoot");
const versionBadge = document.getElementById("versionBadge");
const APP_VERSION = "v4.2.69-r2026-04-28-needs-review-reasons1";
const DISPLAY_VERSION = "V4.2.69-r26-04-28";

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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
    if (event.target?.closest?.("a") && window.matchMedia("(max-width: 700px)").matches) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 701px)").matches) {
      closeMenu();
    }
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
  if (versionBadge) {
    versionBadge.replaceChildren(document.createTextNode(DISPLAY_VERSION));
  }
}

async function reloadCoreSpeciesWithCurrentPatch(coreModule) {
  try {
    const [stateModule, dataModule] = await Promise.all([
      import("./state.js"),
      import(`./data/load-app-data.js?v=${encodeURIComponent(APP_VERSION)}`)
    ]);

    const { state, setSpecies, logBoot } = stateModule;
    const { species, errors } = await dataModule.loadCoreSpecies((message) => {
      logBoot(`[${APP_VERSION}] ${message}`);
    });

    setSpecies(species);
    state.loadErrors = errors || [];

    if (typeof coreModule?.renderCurrentRoute === "function") {
      await coreModule.renderCurrentRoute();
    }
  } catch (err) {
    console.warn("Current-build species patch reload failed:", err?.message || err);
  } finally {
    showVersion();
  }
}

async function start() {
  setupMobileMenu();
  showVersion();

  try {
    const mod = await import(`./app-core.js?v=${encodeURIComponent(APP_VERSION)}`);
    if (typeof mod?.startApp !== "function") {
      throw new Error("app-core.js loaded, but startApp was not exported.");
    }
    await mod.startApp();
    await reloadCoreSpeciesWithCurrentPatch(mod);
    showVersion();
  } catch (err) {
    renderFatal(
      "The shell loaded, but the app core failed before the first route rendered.",
      err?.message || String(err)
    );
  }
}

start();
