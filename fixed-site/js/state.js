export const state = {
  loading: true,
  bootLog: [],
  route: "home",
  species: [],
  rareSpecies: [],
  references: [],
  filters: { search: "" },
  loadErrors: [],
  imageCache: new Map(),
  imageCredits: new Map(),
  imageFailures: new Set(),
  coreReady: false,
  rareReady: false,
  referencesReady: false,
  rarePromise: null,
  referencesPromise: null,
  modulePrefetchStarted: false,
  reviewOverlay: {}
};

export function setRoute(route) { state.route = route || "home"; }
export function setSpecies(records) { state.species = Array.isArray(records) ? records : []; state.coreReady = true; }
export function setRareSpecies(records) { state.rareSpecies = Array.isArray(records) ? records : []; state.rareReady = true; }
export function setReferences(records) { state.references = Array.isArray(records) ? records : []; state.referencesReady = true; }
export function logBoot(message) { state.bootLog.push(message); }
export function rememberImageResult(slug, result) { if (slug) state.imageCache.set(slug, result); }
export function rememberImageCredit(slug, credit) {
  if (!slug || !credit) return;
  const list = state.imageCredits.get(slug) || [];
  const key = `${credit.title || ''}::${credit.sourcePage || ''}`;
  if (!list.some(item => `${item.title || ''}::${item.sourcePage || ''}` === key)) {
    list.push(credit);
    state.imageCredits.set(slug, list);
  }
}
export function rememberImageFailure(slug) { if (slug) state.imageFailures.add(slug); }
