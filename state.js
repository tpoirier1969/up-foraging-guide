export const state = {
  loading: true,
  bootLog: [],
  route: "home",
  species: [],
  rareSpecies: [],
  references: [],
  filters: {
    search: ""
  },
  loadErrors: []
};

export function setRoute(route) {
  state.route = route || "home";
}

export function setSpecies(records) {
  state.species = Array.isArray(records) ? records : [];
}

export function setRareSpecies(records) {
  state.rareSpecies = Array.isArray(records) ? records : [];
}

export function setReferences(records) {
  state.references = Array.isArray(records) ? records : [];
}

export function logBoot(message) {
  state.bootLog.push(message);
}
