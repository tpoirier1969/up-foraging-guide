const root = typeof window !== "undefined" ? window : globalThis;

if (!root.__FORAGING_SHARED_STATE__) {
  root.__FORAGING_SHARED_STATE__ = {
    allRecords: [],
    filteredRecords: [],
    references: [],
    credits: {},
    route: "home",
    dataSource: "Local JSON fallback",
    detailSlug: null,
    rareSpecies: [],
    rareSightings: []
  };
}

export const state = root.__FORAGING_SHARED_STATE__;
