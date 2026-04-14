const COMMONNESS_ORDER = { 'very common': 5, 'common': 4, 'occasional': 3, 'uncommon': 2, 'rare': 1 };

function normText(value) {
  return String(value || '').trim().toLowerCase();
}

export function normalizeCommonness(value) {
  const text = normText(value);
  if (!text) return '';
  if (text === 'very common') return 'very common';
  if (text === 'common') return 'common';
  if (text === 'occasional') return 'occasional';
  if (text === 'uncommon') return 'uncommon';
  if (text === 'rare') return 'rare';
  return '';
}

export function commonnessScore(record) {
  const label = normalizeCommonness(record?.commonness);
  return COMMONNESS_ORDER[label] || 0;
}

export function sortByCommonness(records, direction = 'desc') {
  return [...(records || [])].sort((a, b) => {
    const aScore = commonnessScore(a);
    const bScore = commonnessScore(b);
    const aRated = aScore > 0 ? 1 : 0;
    const bRated = bScore > 0 ? 1 : 0;

    if (aRated !== bRated) return bRated - aRated;

    if (aRated && bRated) {
      if (direction === 'asc') {
        if (aScore !== bScore) return aScore - bScore;
      } else {
        if (aScore !== bScore) return bScore - aScore;
      }
    }

    return String(a?.display_name || '').localeCompare(String(b?.display_name || ''));
  });
}

export function applyCommonnessSort(records, sortValue) {
  if (sortValue === 'common-desc') return sortByCommonness(records, 'desc');
  if (sortValue === 'common-asc') return sortByCommonness(records, 'asc');
  return records;
}

export function sortLabel(sortValue) {
  if (sortValue === 'common-desc') return 'Most common first';
  if (sortValue === 'common-asc') return 'Least common first';
  return 'Default sort';
}
