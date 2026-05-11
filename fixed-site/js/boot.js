const pageRoot = document.getElementById("pageRoot");
const versionBadge = document.getElementById("versionBadge");
const APP_VERSION = "v4.2.98-r2026-05-11-home-mushroom-lane-cleanup1";
const DISPLAY_VERSION = "V4.2.98-r26-05-11";

let mushroomLaneRelabelObserver = null;

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
    if (event.target?.closest?.("a") && window.matchMedia("(max-width: 700px)").matches) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 701px)").matches) closeMenu();
  });
}

function relabelMushroomLaneCards(root = document) {
  const laneLinks = root.querySelectorAll?.('a[href="#/boletes"] strong, a[href="#/boletes"] span, a[href="#/boletes"], a[href="#/boletes"]') || [];
  laneLinks.forEach((node) => {
    if (node.childElementCount) return;
    const text = node.textContent || "";
    if (text.trim() === "Boletes") node.textContent = "Spongelike";
    if (text.includes("Pores or sponge-like underside.")) node.textContent = text.replace("Pores or sponge-like underside.", "Pores, tubes, or sponge-like underside.");
  });

  const headings = root.querySelectorAll?.("h2, h3") || [];
  headings.forEach((heading) => {
    const text = heading.textContent || "";
    if (text === "Boletes") heading.textContent = "Spongelike";
    if (/^Boletes \(\d+\)$/.test(text)) heading.textContent = text.replace(/^Boletes/, "Spongelike");
    if (text === "Bolete filters") heading.textContent = "Spongelike mushroom filters";
  });
}

function installMushroomLaneRelabeler() {
  if (!pageRoot || mushroomLaneRelabelObserver) return;
  relabelMushroomLaneCards(document);
  mushroomLaneRelabelObserver = new MutationObserver(() => relabelMushroomLaneCards(pageRoot));
  mushroomLaneRelabelObserver.observe(pageRoot, { childList: true, subtree: true });
  window.addEventListener("hashchange", () => relabelMushroomLaneCards(document));
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
  setupMobileMenu();
  installMushroomLaneRelabeler();
  showVersion();
  try {
    const mod = await import(`./app-core.js?v=${encodeURIComponent(APP_VERSION)}`);
    if (typeof mod?.startApp !== "function") throw new Error("app-core.js loaded, but startApp was not exported.");
    await mod.startApp();
    relabelMushroomLaneCards(document);
    showVersion();
  } catch (err) {
    renderFatal("The shell loaded, but the app core failed before the first route rendered.", err?.message || String(err));
  }
}

start();
