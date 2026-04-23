export const els = {
  pageRoot: document.getElementById("pageRoot"),
  modal: document.getElementById("detailModal"),
  modalContent: document.getElementById("modalContent"),
  closeModalBtn: document.getElementById("closeModalBtn")
};

let lightboxEls = null;
let lightboxEscapeBound = false;

function ensureLightbox() {
  if (lightboxEls) return lightboxEls;

  const shell = document.createElement("div");
  shell.className = "image-lightbox";
  shell.hidden = true;
  shell.innerHTML = `
    <div class="image-lightbox-backdrop" data-lightbox-close></div>
    <div class="image-lightbox-card" role="dialog" aria-modal="true" aria-label="Expanded image">
      <button class="image-lightbox-close" type="button" data-lightbox-close aria-label="Close expanded image">Close</button>
      <div class="image-lightbox-body">
        <img class="image-lightbox-image" alt="">
      </div>
      <div class="image-lightbox-meta">
        <div class="image-lightbox-title" data-lightbox-title></div>
        <div class="image-lightbox-actions">
          <a class="buttonish subtle" hidden data-lightbox-source target="_blank" rel="noreferrer">Open source</a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(shell);

  lightboxEls = {
    shell,
    image: shell.querySelector(".image-lightbox-image"),
    title: shell.querySelector("[data-lightbox-title]"),
    source: shell.querySelector("[data-lightbox-source]")
  };

  shell.querySelectorAll("[data-lightbox-close]").forEach((node) => {
    node.addEventListener("click", closeLightbox);
  });

  if (!lightboxEscapeBound) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightboxEls?.shell?.hidden) {
        event.preventDefault();
        closeLightbox();
      }
    });
    lightboxEscapeBound = true;
  }

  return lightboxEls;
}

export function renderPage(html) {
  els.pageRoot.innerHTML = html;
}

export function openModal(html) {
  els.modalContent.innerHTML = html;
  if (typeof els.modal.showModal === "function") {
    try { els.modal.showModal(); return; } catch {}
  }
  els.modal.setAttribute("open", "open");
}

export function closeModal() {
  if (typeof els.modal.close === "function") {
    try { els.modal.close(); } catch {}
  }
  els.modal.removeAttribute("open");
}

export function openLightbox({ src = "", alt = "", title = "", sourceHref = "", sourceLabel = "Open source" } = {}) {
  if (!src) return;
  const refs = ensureLightbox();
  refs.image.src = src;
  refs.image.alt = alt || title || "Expanded image";
  refs.title.textContent = title || "";
  if (sourceHref) {
    refs.source.href = sourceHref;
    refs.source.textContent = sourceLabel || "Open source";
    refs.source.hidden = false;
  } else {
    refs.source.hidden = true;
    refs.source.removeAttribute("href");
  }
  refs.shell.hidden = false;
  document.body.classList.add("lightbox-open");
}

export function closeLightbox() {
  if (!lightboxEls) return;
  lightboxEls.shell.hidden = true;
  lightboxEls.image.removeAttribute("src");
  lightboxEls.image.alt = "";
  lightboxEls.title.textContent = "";
  lightboxEls.source.hidden = true;
  lightboxEls.source.removeAttribute("href");
  document.body.classList.remove("lightbox-open");
}
