const pageRoot = document.getElementById("pageRoot");
const versionBadge = document.getElementById("versionBadge");
const APP_VERSION = "v4.2.29-r2026-04-24-filter-countfix1";

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

async function start() {
  if (versionBadge) {
    versionBadge.replaceChildren(document.createTextNode(APP_VERSION));
  }

  try {
    const mod = await import(`./app-core.js?v=${encodeURIComponent(APP_VERSION)}`);
    if (typeof mod?.startApp !== "function") {
      throw new Error("app-core.js loaded, but startApp was not exported.");
    }
    await mod.startApp();
  } catch (err) {
    renderFatal(
      "The shell loaded, but the app core failed before the first route rendered.",
      err?.message || String(err)
    );
  }
}

start();
