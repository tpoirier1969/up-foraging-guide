import { APP_VERSION } from "./config.js";

const pageRoot = document.getElementById("pageRoot");
const versionBadge = document.getElementById("versionBadge");
const ASSET_VERSION = "v4.2.1-r2026-04-21-homefix2";

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
    const mod = await import(`./app-core.js?v=${encodeURIComponent(ASSET_VERSION)}`);
    await mod.startApp();
  } catch (err) {
    renderFatal(
      "The shell loaded, but the app core failed before the first route rendered.",
      err?.message || String(err)
    );
  }
}

start();
