export function markActiveNav(route) {
  document.querySelectorAll("[data-nav]").forEach(link => {
    link.classList.toggle("active", link.dataset.nav === route);
  });
  const mobileMoreToggle = document.getElementById("mobileMoreToggle");
  if (mobileMoreToggle) {
    mobileMoreToggle.classList.toggle("active", !["home", "plants", "mushrooms", "medicinal"].includes(route));
  }
}
