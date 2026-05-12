export const SPECIES_PATHS = [
  "data/plants.json",
  "data/plants-image-overrides.json",

  // Mushroom base file plus verified split chunks from the v4.3.0 size cleanup.
  // The loader does not follow mushrooms.json metadata.split_manifest automatically,
  // so these chunk paths must be listed explicitly.
  "data/mushrooms.json",
  "data/mushrooms/mushrooms-boletes-porcini-tylopilus.json",
  "data/mushrooms/mushrooms-boletes-porcini-tylopilus-2.json",
  "data/mushrooms/mushrooms-boletes-porcini-tylopilus-3.json",
  "data/mushrooms/mushrooms-boletes-porcini-tylopilus-4.json",
  "data/mushrooms/mushrooms-boletes-red-caution.json",
  "data/mushrooms/mushrooms-boletes-red-caution-2.json",
  "data/mushrooms/mushrooms-boletes-suillus-leccinum.json",
  "data/mushrooms/mushrooms-boletes-suillus-leccinum-2.json",
  "data/mushrooms/mushrooms-boletes-suillus-leccinum-3.json",
  "data/mushrooms/mushrooms-boletes-suillus-leccinum-4.json",
  "data/mushrooms/mushrooms-boletes-suillus-leccinum-5.json",

  // Caution look-alike overlay added after the mushroom split work.
  "data/mushroom-lookalike-stubs-v4.3.27.json"
];

export const OPTIONAL_PATHS = [
  "data/references-mainfix15.json",
  "data/rare-species-v2.json"
];
