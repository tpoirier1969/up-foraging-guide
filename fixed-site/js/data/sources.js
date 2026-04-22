export const RARE_SPECIES_PATH = "data/species/rare/chunk-001.json";

export const SPECIES_SECTION_PATHS = {
  plants: [
    "data/plants.json",
    "data/plants-image-overrides.json"
  ],
  mushrooms: [
    "data/mushrooms.json"
  ],
  medicinal: [],
  rare: [
    RARE_SPECIES_PATH
  ]
};

export const SPECIES_PATHS = Object.entries(SPECIES_SECTION_PATHS).flatMap(([section, paths]) =>
  paths.map(path => ({ section, path }))
);

export const OPTIONAL_PATHS = [
  "data/references-mainfix15.json",
  RARE_SPECIES_PATH
];
