export const SPECIES_SECTION_PATHS = {
  plants: [
    "data/plants.json",
    "data/plants-image-overrides.json"
  ],
  mushrooms: [
    "data/mushrooms.json"
  ],
  medicinal: [],
  rare: []
};

export const SPECIES_PATHS = Object.entries(SPECIES_SECTION_PATHS).flatMap(([section, paths]) =>
  paths.map(path => ({ section, path }))
);

export const OPTIONAL_PATHS = [
  "data/references-mainfix15.json",
  "data/rare-species-v2.json"
];
