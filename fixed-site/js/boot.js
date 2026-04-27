const pageRoot = document.getElementById("pageRoot");
const versionBadge = document.getElementById("versionBadge");
const APP_VERSION = "v4.2.51-r2026-04-27-mushroom-photo-patch2-cache-sync";

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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
    versionBadge.replaceChildren(document.createTextNode(APP_VERSION));
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
