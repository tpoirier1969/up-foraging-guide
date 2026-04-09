import { loadLocalData, loadSupabaseData } from "./api.js";
import { sortRecords, normalizeRecord, isPlant, isMushroom, medicinalRecords, reviewRecords } from "./data-model.js";
import { state } from "./state.js";
import { parseRoute } from "./router.js";
import { MONTHS } from "./constants.js";
import { renderHome, renderPlants, renderMushrooms, renderMedicinal, renderTimeline, renderReview } from "./pages.js";
import { updateHeaderStats, renderPage, markActiveNav, bindDetailLinks, bindSharedActions, wireModal, openDetail } from "./ui.js";

const emptyFilter = () => ({ search: "", month: "", habitat: "", part: "", size: "", taste: "", substrate: "", treeType: "", hostTree: "", ring: "", texture: "", smell: "", staining: "", medicinalAction: "", medicinalSystem: "", medicinalTerm: "", reviewReason: "" });
const filterState = { plants: emptyFilter(), mushrooms: emptyFilter(), medicinal: emptyFilter(), review: emptyFilter() };
let selectedTimelineMonth = MONTHS[new Date().getMonth()] || MONTHS[0];
let selectedTimelineWeek = 1;

function arrayFilterMatch(record, key, value) {
  if (!value) return true;
  return (record[key] || []).includes(value);
}
function queryMatches(record, filters) {
  const query = (filters.search || "").trim().toLowerCase();
  const haystack = [record.display_name, record.common_name, record.category, record.culinary_uses, record.medicinal_uses, record.notes, ...(record.links || []), ...(record.reviewReasons || [])].join(" ").toLowerCase();
  const monthMatch = !filters.month || (record.months_available || []).includes(filters.month);
  const searchMatch = !query || haystack.includes(query);
  return searchMatch && monthMatch
    && arrayFilterMatch(record, 'habitat', filters.habitat)
    && arrayFilterMatch(record, 'observedPart', filters.part)
    && arrayFilterMatch(record, 'size', filters.size)
    && arrayFilterMatch(record, 'taste', filters.taste)
    && arrayFilterMatch(record, 'substrate', filters.substrate)
    && arrayFilterMatch(record, 'treeType', filters.treeType)
    && arrayFilterMatch(record, 'hostTree', filters.hostTree)
    && arrayFilterMatch(record, 'ring', filters.ring)
    && arrayFilterMatch(record, 'texture', filters.texture)
    && arrayFilterMatch(record, 'smell', filters.smell)
    && arrayFilterMatch(record, 'staining', filters.staining)
    && arrayFilterMatch(record, 'medicinalAction', filters.medicinalAction)
    && arrayFilterMatch(record, 'medicinalSystem', filters.medicinalSystem)
    && arrayFilterMatch(record, 'medicinalTerms', filters.medicinalTerm)
    && (!filters.reviewReason || (record.reviewReasons || []).includes(filters.reviewReason));
}
function filteredForPage(page) {
  if (page === 'plants') return state.allRecords.filter(isPlant).filter(record => queryMatches(record, filterState.plants));
  if (page === 'mushrooms') return state.allRecords.filter(isMushroom).filter(record => queryMatches(record, filterState.mushrooms));
  if (page === 'medicinal') return medicinalRecords(state.allRecords).filter(record => queryMatches(record, filterState.medicinal));
  if (page === 'review') return reviewRecords(state.allRecords).filter(record => queryMatches(record, filterState.review));
  return state.allRecords;
}

function renderCurrentRoute() {
  const route = parseRoute(location.hash || "#/home");
  state.route = route.page === "detail" ? "home" : route.page;
  markActiveNav(state.route);
  if (route.page === "detail" && route.slug) {
    if (!document.getElementById("pageRoot").innerHTML.trim()) renderPage(renderHome(state.allRecords));
    bindDetailLinks();
    openDetail(route.slug);
    return;
  }
  if (route.page === "plants") renderPage(renderPlants(filteredForPage("plants"), filterState.plants));
  else if (route.page === "mushrooms") renderPage(renderMushrooms(filteredForPage("mushrooms"), filterState.mushrooms));
  else if (route.page === "medicinal") renderPage(renderMedicinal(filteredForPage("medicinal"), filterState.medicinal));
  else if (route.page === "timeline") renderPage(renderTimeline(state.allRecords, selectedTimelineMonth, selectedTimelineWeek));
  else if (route.page === "review") renderPage(renderReview(filteredForPage("review"), filterState.review));
  else { renderPage(renderHome(state.allRecords)); state.route = "home"; markActiveNav("home"); }

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
      filterState[page] = emptyFilter();
      renderCurrentRoute();
    },
    onTimelineMonthChange: (month, week) => {
      if (!month) return;
      selectedTimelineMonth = month;
      selectedTimelineWeek = Number(week || 1);
      renderCurrentRoute();
    }
  });
}

async function init() {
  wireModal();
  try {
    let payload;
    try { payload = await loadSupabaseData(); state.dataSource = "Supabase live data"; }
    catch (supabaseError) { payload = await loadLocalData(); state.dataSource = "Local JSON fallback"; console.info("Supabase not used for this run:", supabaseError?.message || supabaseError); }
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
