import { loadLocalData, loadSupabaseData } from "./api.js";
import { sortRecords, normalizeRecord, isPlant, isMushroom, medicinalRecords } from "./data-model.js";
import { state } from "./state.js";
import { parseRoute } from "./router.js";
import { MONTHS } from "./constants.js";
import { renderHome, renderPlants, renderMushrooms, renderMedicinal, renderTimeline } from "./pages.js";
import { updateHeaderStats, renderPage, markActiveNav, bindDetailLinks, bindSharedActions, wireModal, openDetail } from "./ui.js";

const filterState = {
  plants: { search: "", category: "", month: "", image: "" },
  mushrooms: { search: "", category: "", month: "", image: "" },
  medicinal: { search: "", category: "", month: "", image: "" }
};

let selectedTimelineMonth = MONTHS[new Date().getMonth()] || MONTHS[0];

function queryMatches(record, filters) {
  const query = (filters.search || "").trim().toLowerCase();
  const haystack = [
    record.display_name,
    record.common_name,
    record.category,
    record.culinary_uses,
    record.medicinal_uses,
    record.notes,
    ...(record.links || [])
  ].join(" ").toLowerCase();
  const categoryMatch = !filters.category || record.category === filters.category;
  const monthMatch = !filters.month || (record.months_available || []).includes(filters.month);
  const imageMatch = !filters.image ||
    (filters.image === "with-images" && record.images?.length) ||
    (filters.image === "without-images" && !record.images?.length);
  const searchMatch = !query || haystack.includes(query);
  return categoryMatch && monthMatch && imageMatch && searchMatch;
}

function filteredForPage(page) {
  if (page === "plants") return state.allRecords.filter(isPlant).filter(record => queryMatches(record, filterState.plants));
  if (page === "mushrooms") return state.allRecords.filter(isMushroom).filter(record => queryMatches(record, filterState.mushrooms));
  if (page === "medicinal") return medicinalRecords(state.allRecords).filter(record => queryMatches(record, filterState.medicinal));
  return state.allRecords;
}

function renderCurrentRoute() {
  const route = parseRoute(location.hash || "#/home");
  state.route = route.page === "detail" ? "home" : route.page;
  markActiveNav(state.route);

  if (route.page === "detail" && route.slug) {
    if (!document.getElementById("pageRoot").innerHTML.trim()) {
      renderPage(renderHome(state.allRecords));
    }
    bindDetailLinks();
    openDetail(route.slug);
    return;
  }

  if (route.page === "plants") {
    renderPage(renderPlants(filteredForPage("plants"), filterState.plants));
  } else if (route.page === "mushrooms") {
    renderPage(renderMushrooms(filteredForPage("mushrooms"), filterState.mushrooms));
  } else if (route.page === "medicinal") {
    renderPage(renderMedicinal(filteredForPage("medicinal"), filterState.medicinal));
  } else if (route.page === "timeline") {
    renderPage(renderTimeline(state.allRecords, selectedTimelineMonth));
  } else {
    renderPage(renderHome(state.allRecords));
    state.route = "home";
    markActiveNav("home");
  }

  bindDetailLinks();
  bindSharedActions({
    onFilterChange: event => {
      const target = event.currentTarget;
      const page = state.route;
      if (!filterState[page]) return;
      filterState[page][target.dataset.filter] = target.value;
      renderCurrentRoute();
    },
    onClearFilters: () => {
      const page = state.route;
      if (!filterState[page]) return;
      filterState[page] = { search: "", category: "", month: "", image: "" };
      renderCurrentRoute();
    },
    onTimelineMonthChange: month => {
      if (!month) return;
      selectedTimelineMonth = month;
      renderCurrentRoute();
    }
  });
}

async function init() {
  wireModal();
  try {
    let payload;
    try {
      payload = await loadSupabaseData();
      state.dataSource = "Supabase live data";
    } catch (supabaseError) {
      payload = await loadLocalData();
      state.dataSource = "Local JSON fallback";
      console.info("Supabase not used for this run:", supabaseError?.message || supabaseError);
    }
    state.allRecords = sortRecords((payload.records || []).map(normalizeRecord));
    updateHeaderStats(state.allRecords);
    renderCurrentRoute();
    window.addEventListener("hashchange", renderCurrentRoute);
  } catch (error) {
    console.error(error);
    renderPage(`<section class="panel empty-state"><h2>Data load failed</h2><p>${String(error.message || error)}</p></section>`);
  }
}
init();
