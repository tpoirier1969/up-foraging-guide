const REPO_CDN_BASE = 'https://cdn.jsdelivr.net/gh/tpoirier1969/up-foraging-guide@main/';
const REPO_BLOB_BASE = 'https://github.com/tpoirier1969/up-foraging-guide/blob/main/';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[’'`]/g, '-')
    .replace(/&/g, ' and ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function scientificStem(record) {
  const raw = String(record?.scientific_name || '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(?:spp?|group|complex|allies|concept|field|entry|var|cf|aff|type)\b/gi, ' ')
    .replace(/[|/,;]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!raw) return '';
  const parts = raw.split(' ').filter(Boolean).slice(0, 2);
  return slugify(parts.join(' '));
}

function baseVariants(record) {
  const variants = new Set();
  const add = (value) => {
    const s = slugify(value);
    if (s) variants.add(s);
  };
  add(record?.slug);
  add(record?.display_name);
  add(record?.common_name);
  add(scientificStem(record));

  const trimmed = Array.from(variants);
  const suffixPatterns = [
    /-caution-group$/,
    /-hardwood-associated-complex$/,
    /-conifer-associated-complex$/,
    /-summer-oyster$/,
    /-cinnabars$/,
    /-birch-aspen-boletes$/,
    /-mild-flexible-gill-russulas$/,
    /-aborted-entoloma$/,
    /-guessowii$/,
    /-viburnum$/,
    /-tea$/,
    /-gum$/,
    /-flowers$/,
    /-berries$/,
    /-bulbs$/,
    /-shoots$/,
    /-rhizomes$/,
    /-root$/,
    /-root-bark$/,
    /-tips$/,
    /-cones$/,
    /-greens$/,
    /-leaves$/,
    /-lichen$/,
    /-wild-onion$/,
    /-winter-purslane$/,
    /-very-similar-to-blackberry$/,
    /-close-cousin-of-lamb-s-quarters$/,
  ];
  for (const item of trimmed) {
    for (const rx of suffixPatterns) {
      const next = item.replace(rx, '');
      if (next && next !== item) variants.add(next.replace(/-+$/,''));
    }
    variants.add(item.replace(/-(group|complex|allies|concept|entry)$/,''));
  }
  return Array.from(variants).filter(Boolean);
}

function likelyDirs(record) {
  const isMushroom = /mushroom|fungus|lichen/i.test(String(record?.category || ''));
  return isMushroom
    ? ['assets/images/mushrooms-2', 'assets/images/mushrooms', 'assets/images-2', 'assets/images']
    : ['assets/images/plants-2', 'assets/images/plants', 'assets/images-2', 'assets/images'];
}

function stemsForVariant(variant) {
  const stems = new Set();
  if (!variant) return [];
  stems.add(variant);
  for (let i = 1; i <= 4; i += 1) stems.add(`${variant}-${i}`);
  for (let i = 1; i <= 4; i += 1) stems.add(`${variant}-v20-${i}`);
  for (let i = 1; i <= 4; i += 1) stems.add(`${variant}-v18-${i}`);
  stems.add(`${variant}-v20`);
  stems.add(`${variant}-v18`);
  stems.add(`${variant}-identification-v18`);
  return Array.from(stems);
}

export function buildRepoCandidateItems(record) {
  const dirs = likelyDirs(record);
  const exts = ['jpg', 'jpeg', 'png', 'webp'];
  const items = [];
  const seen = new Set();
  for (const variant of baseVariants(record)) {
    for (const stem of stemsForVariant(variant)) {
      for (const dir of dirs) {
        for (const ext of exts) {
          const path = `${dir}/${stem}.${ext}`;
          if (seen.has(path)) continue;
          seen.add(path);
          items.push({
            source: 'repo',
            src: `${REPO_CDN_BASE}${path}`,
            sourcePage: `${REPO_BLOB_BASE}${path}`,
            title: path.split('/').pop(),
            author: '',
            credit: 'Original app image asset',
            license: '',
            licenseUrl: '',
            description: `Original repo asset candidate for ${record?.display_name || record?.common_name || record?.slug || ''}`
          });
        }
      }
    }
  }
  return items;
}
