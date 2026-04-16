import { loadLocalData, loadSupabaseData, loadOverridePayload } from "./api-mainfix4.js?v=v3.1.2";
import { loadLocalDataWithMaster } from "./api-masterlist.js?v=v3.1.2";
import { sortRecords, normalizeRecord, isPlant, isForagingMushroom, medicinalRecords, reviewRecords, avoidRecords } from "./data-model-mainfix4.js?v=v3.1.2";
import { state } from "./state.js";
import { parseRoute } from "./router.js";
import { MONTHS } from "./constants-mainfix.js";
import { renderDashboard } from "./pages-mainfix4.js?v=v3.1.2";
import { updateHeaderStats, renderPage, markActiveNav, bindDetailLinks, bindSharedActions, wireModal, openDetail } from "./ui-mainfix.js";
import { loadRareSpecies, loadRareSightings, wireRarePage } from "./rare-watch.js";

const focusDate = new Date();
focusDate.setDate(focusDate.getDate() + 14);
const CURRENT_MONTH = MONTHS[focusDate.getMonth()] || MONTHS[0];

const COMMONNESS_ORDER = {
  "very common": 5,
  "abundant": 5,
  "plentiful": 5,
  "widespread": 5,
  "common": 4,
  "fairly common": 4,
  "locally common": 4,
  "frequent": 4,
  "regular": 4,
  "occasional": 3,
  "scattered": 3,
  "moderately common": 3,
  "uncommon": 2,
  "infrequent": 2,
  "scarce": 2,
  "local": 2,
  "rare": 1,
  "very rare": 1,
  "sparse": 1,
  "isolated": 1
};
const FOOD_QUALITY_ORDER = { "choice": 5, "excellent": 5, "very good": 4, "good": 3, "fair": 2, "poor": 1, "not worth foraging": 0 };

const emptyFilter = (page = '') => ({ search:'', month: page==='home' ? CURRENT_MONTH : '', habitat:'', part:'', size:'', taste:'', substrate:'', treeType:'', hostTree:'', ring:'', texture:'', smell:'', staining:'', medicinalAction:'', medicinalSystem:'', medicinalTerm:'', reviewReason:'', severity:'', flowerColor:'', leafShape:'', leafArrangement:'', stemSurface:'', leafPointCount:'', sort:'' });
const filterState = { home:emptyFilter('home'), search:emptyFilter(), identification:emptyFilter(), plants:emptyFilter(), mushrooms:emptyFilter(), medicinal:emptyFilter(), rare:emptyFilter(), lookalikes:emptyFilter(), timeline:emptyFilter(), review:emptyFilter(), credits:emptyFilter(), references:emptyFilter() };
let selectedTimelineMonth = CURRENT_MONTH;
let overridePayload = { overrides:{}, metadata:{}, references:[], creditsPayload:{credits:{}} };

function arrayFilterMatch(record,key,value){ const hay = Array.isArray(record[key]) ? record[key] : []; if (!value) return true; return hay.includes(value); }
function normSortText(value){ return String(value || '').trim().toLowerCase().replace(/\s+/g,' '); }
function rankCommonness(record){
  const numeric = Number(record.commonness_score ?? record.commonnessScore ?? 0);
  if (Number.isFinite(numeric) && numeric > 0) return numeric;
  const text = normSortText(record.commonness || record.commonness_label || record.commonnessLabel || '');
  if (!text) return 0;
  if (COMMONNESS_ORDER[text]) return COMMONNESS_ORDER[text];
  if (text.includes('very common') || text.includes('abundant') || text.includes('widespread') || text.includes('plentiful')) return 5;
  if (text.includes('common') || text.includes('frequent') || text.includes('regular')) return 4;
  if (text.includes('occasional') || text.includes('scattered') || text.includes('moderate')) return 3;
  if (text.includes('uncommon') || text.includes('scarce') || text.includes('infrequent') || text.includes('local')) return 2;
  if (text.includes('rare') || text.includes('sparse') || text.includes('isolated')) return 1;
  return 0;
}
function rankFoodQuality(record){
  const numeric = Number(record.food_quality_score ?? record.foodQualityScore ?? 0);
  if (Number.isFinite(numeric) && numeric > 0) return numeric;
  const text = normSortText(record.food_quality || record.foodQuality || '');
  return FOOD_QUALITY_ORDER[text] || 0;
}
function alphaName(record){ return String(record.display_name || record.common_name || '').localeCompare(String((arguments[1]||{}).display_name || (arguments[1]||{}).common_name || '')); }
function sortWithRating(records, scoreFn, direction = 'desc'){
  return [...records].sort((a,b)=>{
    const aScore = scoreFn(a);
    const bScore = scoreFn(b);
    const aRated = aScore > 0 ? 1 : 0;
    const bRated = bScore > 0 ? 1 : 0;
    if (aRated !== bRated) return bRated - aRated;
    if (aRated && bRated && aScore !== bScore) return direction === 'asc' ? aScore - bScore : bScore - aScore;
    return String(a.display_name || a.common_name || '').localeCompare(String(b.display_name || b.common_name || ''));
  });
}
function applyCustomSort(records, sortValue){
  const list = [...records];
  if (!sortValue) return list;
  if (sortValue === 'common-desc') return sortWithRating(list, rankCommonness, 'desc');
  if (sortValue === 'common-asc') return sortWithRating(list, rankCommonness, 'asc');
  if (sortValue === 'food-quality-desc') return sortWithRating(list, rankFoodQuality, 'desc');
  if (sortValue === 'food-quality-asc') return sortWithRating(list, rankFoodQuality, 'asc');
  return list;
}
function queryMatches(record,filters){ const query=(filters.search||'').trim().toLowerCase(); const haystack=[record.display_name,record.common_name,record.scientific_name,record.category,record.culinary_uses,record.medicinal_uses,record.notes,record.other_uses,record.changes_over_time,record.edibility_detail,record.effects_on_body,record.use_tags?.join(' '),...(record.links||[]),...(record.reviewReasons||[]),...(record.affected_systems||[]),...(record.look_alikes||[]),...(record.mushroom_profile?.research_notes||[]),record.mushroom_profile?.summary,record.mushroom_profile?.ecology,record.mushroom_profile?.season_note].join(' ').toLowerCase(); return (!query||haystack.includes(query))&&(!filters.month||(record.months_available||[]).includes(filters.month))&&(!filters.severity||(record.non_edible_severity||'')===filters.severity)&&arrayFilterMatch(record,'habitat',filters.habitat)&&arrayFilterMatch(record,'observedPart',filters.part)&&arrayFilterMatch(record,'size',filters.size)&&arrayFilterMatch(record,'taste',filters.taste)&&arrayFilterMatch(record,'substrate',filters.substrate)&&arrayFilterMatch(record,'treeType',filters.treeType)&&arrayFilterMatch(record,'hostTree',filters.hostTree)&&arrayFilterMatch(record,'ring',filters.ring)&&arrayFilterMatch(record,'texture',filters.texture)&&arrayFilterMatch(record,'smell',filters.smell)&&arrayFilterMatch(record,'staining',filters.staining)&&arrayFilterMatch(record,'medicinalAction',filters.medicinalAction)&&arrayFilterMatch(record,'medicinalSystem',filters.medicinalSystem)&&arrayFilterMatch(record,'medicinalTerms',filters.medicinalTerm)&&arrayFilterMatch(record,'flowerColor',filters.flowerColor)&&arrayFilterMatch(record,'leafShape',filters.leafShape)&&arrayFilterMatch(record,'leafArrangement',filters.leafArrangement)&&arrayFilterMatch(record,'stemSurface',filters.stemSurface)&&arrayFilterMatch(record,'leafPointCount',filters.leafPointCount)&&(!filters.reviewReason||(record.reviewReasons||[]).includes(filters.reviewReason)); }
function filteredForPage(page){ let records; if(page==='home'||page==='credits'||page==='references'||page==='identification'||page==='rare') records = state.allRecords.filter((record)=>queryMatches(record, filterState[page]||emptyFilter(page))); else if(page==='search') records = state.allRecords.filter((record)=>queryMatches(record, filterState.search)); else if(page==='plants') records = state.allRecords.filter(isPlant).filter((record)=>queryMatches(record, filterState.plants)); else if(page==='mushrooms') records = state.allRecords.filter(isForagingMushroom).filter((record)=>queryMatches(record, filterState.mushrooms)); else if(page==='medicinal') records = medicinalRecords(state.allRecords).filter((record)=>queryMatches(record, filterState.medicinal)); else if(page==='lookalikes') records = avoidRecords(state.allRecords).filter((record)=>queryMatches(record, filterState.lookalikes)); else if(page==='review') records = reviewRecords(state.allRecords).filter((record)=>queryMatches(record, filterState.review)); else records = state.allRecords; return applyCustomSort(records, (filterState[page] || emptyFilter(page)).sort); }
function renderCurrentRoute(){ const route=parseRoute(location.hash||'#/home'); const allowedPages=['home','search','identification','plants','mushrooms','medicinal','rare','timeline','lookalikes','review','references','credits']; const activePage=route.page==='detail'?(state.route||'home'):(allowedPages.includes(route.page)?route.page:'home'); state.route=activePage; markActiveNav(activePage); if(route.page==='detail'&&route.slug){ if(!document.getElementById('pageRoot').innerHTML.trim()) renderPage(renderDashboard({page:activePage,allRecords:state.allRecords,currentRecords:filteredForPage(activePage),filters:filterState[activePage]||emptyFilter(activePage),selectedMonth:selectedTimelineMonth,overridePayload,references:state.references})); bindDetailLinks(); openDetail(route.slug); return; } renderPage(renderDashboard({page:activePage,allRecords:state.allRecords,currentRecords:filteredForPage(activePage),filters:filterState[activePage]||emptyFilter(activePage),selectedMonth:selectedTimelineMonth,overridePayload,references:state.references})); if (activePage === 'rare') wireRarePage(); bindDetailLinks(); bindSharedActions({ onFilterChange:event=>{ const target=event.currentTarget; const page=state.route; if(!filterState[page]) return; filterState[page][target.dataset.filter]=target.value; if(target.dataset.filter==='treeType') filterState[page].hostTree=''; renderCurrentRoute(); }, onClearFilters:()=>{ const page=state.route; if(!filterState[page]) return; filterState[page]=emptyFilter(page); renderCurrentRoute(); }, onTimelineMonthChange:month=>{ if(!month) return; selectedTimelineMonth=month; renderCurrentRoute(); }, onPaneModeChange:()=>{}, onTimelineShift:direction=>{ const index=MONTHS.indexOf(selectedTimelineMonth); if(index<0) return; const delta=direction==='prev'?-1:1; selectedTimelineMonth=MONTHS[(index+delta+MONTHS.length)%MONTHS.length]; renderCurrentRoute(); }, onToggleInSeason:page=>{ if(!filterState[page]) return; filterState[page].month=filterState[page].month===CURRENT_MONTH?'':CURRENT_MONTH; renderCurrentRoute(); } }); }
async function init(){ wireModal(); try{ overridePayload=await loadOverridePayload(); let payload; try{ payload=await loadSupabaseData(); payload=await loadLocalDataWithMaster(async()=>payload); state.dataSource='Supabase live data + local species additions + master species additions + Wikimedia override'; }catch{ payload=await loadLocalDataWithMaster(loadLocalData); state.dataSource='Local JSON + local species additions + master species additions + Wikimedia override'; } state.allRecords=sortRecords((payload.records||[]).map(normalizeRecord)); state.references=payload.references||overridePayload.references||[]; state.credits=payload.creditsPayload?.credits||overridePayload.creditsPayload?.credits||{}; state.rareSpecies=await loadRareSpecies(); state.rareSightings=await loadRareSightings(); updateHeaderStats(); renderCurrentRoute(); window.addEventListener('hashchange',renderCurrentRoute); }catch(error){ console.error(error); renderPage(`<section class="panel empty-state"><h2>Data load failed</h2><p>${String(error.message||error)}</p></section>`); } }
init();
