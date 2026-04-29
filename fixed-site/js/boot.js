const pageRoot = document.getElementById("pageRoot");
const versionBadge = document.getElementById("versionBadge");
const APP_VERSION = "v4.2.72-r2026-04-29-plants-quick-lanes2";
const DISPLAY_VERSION = "V4.2.72-r26-04-29";
const STALE_VERSION_PATTERNS = [
  /v4\.2\.47-r2026-04-27-mushroom-photo-fix1/g,
  /V4\.2\.47-r26-04-27/g,
  /v4\.2\.71-r2026-04-29-plants-quick-lanes1/g,
  /V4\.2\.71-r26-04-29/g
];

let staleVersionObserver = null;

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function scrubStaleVersionText(root = document.body) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    let text = node.nodeValue || "";
    const original = text;
    for (const pattern of STALE_VERSION_PATTERNS) {
      text = text.replace(pattern, APP_VERSION);
    }
    if (text !== original) node.nodeValue = text;
  }
  showVersion();
}

function startStaleVersionScrubber() {
  if (staleVersionObserver || !document.body) return;
  staleVersionObserver = new MutationObserver(() => scrubStaleVersionText());
  staleVersionObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
  scrubStaleVersionText();
}

function stopStaleVersionScrubber() {
  scrubStaleVersionText();
  staleVersionObserver?.disconnect();
  staleVersionObserver = null;
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
    scrubStaleVersionText();
  }
}

async function start() {
  setupMobileMenu();
  showVersion();
  startStaleVersionScrubber();

  try {
    const mod = await import(`./app-core.js?v=${encodeURIComponent(APP_VERSION)}`);
    if (typeof mod?.startApp !== "function") {
      throw new Error("app-core.js loaded, but startApp was not exported.");
    }
    await mod.startApp();
    scrubStaleVersionText();
    await reloadCoreSpeciesWithCurrentPatch(mod);
    showVersion();
    stopStaleVersionScrubber();
  } catch (err) {
    stopStaleVersionScrubber();
    renderFatal(
      "The shell loaded, but the app core failed before the first route rendered.",
      err?.message || String(err)
    );
  }
}

start();
