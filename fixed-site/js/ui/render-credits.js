import { esc } from "../lib/escape.js";

function asList(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function compact(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function pick(...values) {
  for (const value of values) {
    const text = compact(value);
    if (text) return text;
  }
  return "";
}

function normalizeCommonsFileName(value = "") {
  const raw = compact(value);
  if (!raw) return "";
  let text = raw.split("?")[0].split("#")[0];
  try { text = decodeURIComponent(text); } catch {}
  const markers = ["/wiki/File:", "Special:FilePath/", "/commons/", "File:"];
  for (const marker of markers) {
    const index = text.indexOf(marker);
    if (index >= 0) {
      text = text.slice(index + marker.length);
      break;
    }
  }
  text = text.replace(/^thumb\/[0-9a-f]\/[0-9a-f]{2}\//i, "");
  text = text.replace(/^([0-9a-f])\/([0-9a-f]{2})\//i, "");
  text = text.replace(/\/\d+px-[^/]+$/i, "");
  return text.replace(/ /g, "_").trim();
}

function credit(author, license, licenseUrl, source = "Wikimedia Commons", batch = "credits-enrichment-v3", extra = {}) {
  return { author, credit: extra.credit || author, license, licenseUrl, source, creditSource: batch };
}

const ENRICHED_CREDIT_OVERRIDES = new Map([
  // v1 — plants: American beech, Basswood, Cow parsnip.
  ["Fagus_grandifolia.jpg", credit("Raul654", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v1")],
  ["American_Beech_Fagus_grandifolia_Bark.JPG", credit("Derek Ramsey (Ram-Man)", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/", "Wikimedia Commons", "credits-enrichment-v1", { credit: "© Derek Ramsey / derekramsey.com" })],
  ["Fagus_grandifolia_leaf.jpg", credit("Rob Duval", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v1")],
  ["American_Linden_or_Basswood_(34058253263).jpg", credit("Dan Keck from Ohio", "CC0 1.0 Universal Public Domain Dedication", "https://creativecommons.org/publicdomain/zero/1.0/", "Wikimedia Commons / Flickr", "credits-enrichment-v1")],
  ["Tilia_americana_bark.jpg", credit("Rob Duval", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v1")],
  ["Flower_2932.jpg", credit("Chris Light", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/", "Wikimedia Commons", "credits-enrichment-v1")],
  ["Heracleum_maximum_1.jpg", credit("Danielle Langlois / Dlanglois", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v1")],
  ["Cow_Parsnip.jpg", credit("Stephen Lea", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v1")],
  ["Heracleum_maximum_3.jpg", credit("Danielle Langlois / Dlanglois", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v1")],

  // v2 — mushrooms: Artist's conk, Aspen oyster, Chaga.
  ["Ganoderma_applanatum_1259894.jpg", credit("Richard Daniel", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v2")],
  ["Ganoderma_applanatum_(Ganodermataceae).jpg", credit("Filo gèn’", "CC BY-SA 3.0 / GFDL", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v2")],
  ["Artists_conk-Ganoderma_applanatum_(7402107040).jpg", credit("Scott Darbey", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/", "Wikimedia Commons / Flickr", "credits-enrichment-v2")],
  ["Pleurotus_populinus_13996.jpg", credit("Jim Tunney", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v2")],
  ["Pleurotus_populinus_O._Hilber_&_O.K._Mill_742181.jpg", credit("Phil Yeager", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v2")],
  ["Pleurotus_populinus_O._Hilber_&_O.K._Mill_89533.jpg", credit("Robert Sasata", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v2")],
  ["Inonotus_obliquus.jpg", credit("Tocekas / Tomas Čekanavičius", "CC BY-SA 3.0 / GFDL", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v2")],
  ["Chaga_(8237818667).jpg", credit("natureluvr01", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/", "Wikimedia Commons / Flickr", "credits-enrichment-v2")],
  ["Chaga_Mushroom_-_Inonotus_obliquus_(30222675437).jpg", credit("Björn S...", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/", "Wikimedia Commons / Flickr", "credits-enrichment-v2")],

  // v3 batch A — 5 changes: Blewit / cauliflower / hedgehog.
  ["Lepista_nuda.jpg", credit("Archenzo, Italy", "CC BY-SA 3.0 / GFDL", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v3")],
  ["Lepista_nuda_(2).jpg", credit("Thomas Pruß", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v3")],
  ["Lepista_nuda_01.jpg", credit("Σ64", "CC BY 3.0 / GFDL", "https://creativecommons.org/licenses/by/3.0/", "Wikimedia Commons", "credits-enrichment-v3")],
  ["Sparassis_crispa_3.jpg", credit("Puchatech K.", "CC BY-SA 3.0 / GFDL", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v3")],
  ["Hydnum_repandum.jpg", credit("Pau Cabot", "CC BY-SA 3.0 / GFDL", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v3")],

  // v4 batch B — 5 changes: hemlock varnish shelf, hen, honey.
  ["Ganoderma_tsugae.jpg", credit("RattBoy", "CC BY-SA 3.0 / GFDL", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v4")],
  ["Ganoderma_tsugae_123102289.jpg", credit("Will Kuhn", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/", "Wikimedia Commons / iNaturalist", "credits-enrichment-v4")],
  ["Ganoderma_tsugae_Vermont,_USA.jpg", credit("Daniel Josefchak", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/", "Wikimedia Commons", "credits-enrichment-v4")],
  ["Grifola_frondosa.jpg", credit("Sinisa Radic", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/", "Wikimedia Commons", "credits-enrichment-v4")],
  ["Armillaria_mellea.JPG", credit("Quarma~commonswiki", "CC BY-SA 3.0 / GFDL", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v4")],

  // v5 batch C — 5 changes: oyster and yellow fly agaric.
  ["Pleurotus_ostreatus.jpg", credit("Franck Hidvégi", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/", "Wikimedia Commons", "credits-enrichment-v5")],
  ["Pleurotus_pulmonarius.jpg", credit("EpochFail / Aaron Halfaker", "CC BY 3.0", "https://creativecommons.org/licenses/by/3.0/", "Wikimedia Commons", "credits-enrichment-v5")],
  ["Amanita_muscaria_var._guessowii_(2).jpg", credit("Samuel Vaughn D. Duncan", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/", "Wikimedia Commons", "credits-enrichment-v5")],
  ["Amanita_muscaria_var._guessowii,_medium.jpg", credit("Ragesoss", "CC BY-SA 3.0 / GFDL", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v5")],
  ["Amanita_muscaria_var._guessowii,_small.jpg", credit("Ragesoss", "CC BY-SA 3.0 / GFDL", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v5")],

  // v6 batch D — 5 changes: morels, red chanterelle, velvet foot.
  ["Morchella_esculenta_36795275.jpg", credit("Tom Zucker-Scharff", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/", "Wikimedia Commons / iNaturalist", "credits-enrichment-v6")],
  ["Morchella_esculenta_(Twelve_edible_mushrooms_of_the_United_States).jpg", credit("Thomas Taylor / USDA", "Public domain — United States", "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States", "Wikimedia Commons / USDA", "credits-enrichment-v6")],
  ["Cantharellus_cinnabarinus.jpg", credit("S0urLuc1d", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v6")],
  ["Flammulina_velutipes._(53589573202).jpg", credit("Bernard Spragg. NZ", "Public Domain Mark 1.0", "https://creativecommons.org/publicdomain/mark/1.0/", "Wikimedia Commons / Flickr", "credits-enrichment-v6")],
  ["2013-04-15_Morchella_punctipes_Peck_(1903)_322536.jpg", credit("Mike Hopping (AvlMike)", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons / Mushroom Observer", "credits-enrichment-v6")],

  // v7 batch E — 5 changes: morel support and public-domain mushroom illustrations.
  ["Morchella_punctipes_205457.jpg", credit("Jason Hollinger", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons / Mushroom Observer", "credits-enrichment-v7")],
  ["Morchella_punctipes_128110858.jpg", credit("Chase G. Mayers / cgmayers", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/", "Wikimedia Commons / iNaturalist", "credits-enrichment-v7")],
  ["Morchella_punctipes_128111168.jpg", credit("Chase G. Mayers / cgmayers", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/", "Wikimedia Commons / iNaturalist", "credits-enrichment-v7")],
  ["Lactarius_deliciosus_(edible_mushrooms_of_the_United_States).jpg", credit("Thomas Taylor / USDA", "Public domain — United States", "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States", "Wikimedia Commons / USDA", "credits-enrichment-v7")],
  ["Cantharellus_cibarius_(Twelve_edible_mushrooms_of_the_United_States).jpg", credit("Thomas Taylor / USDA", "Public domain — United States", "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States", "Wikimedia Commons / USDA", "credits-enrichment-v7")]

  // v8 batch F — 5 changes: boletes / Suillus / ashtray-style records.
  ["Boletus_subcaerulescens_35861.jpg", credit("Dave in NE PA", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons / Mushroom Observer", "credits-enrichment-v8")],
  ["Tylopilus_alboater_(Schwein.)_Murrill_650766.jpg", credit("walt sturgeon (Mycowalt)", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons / Mushroom Observer", "credits-enrichment-v8")],
  ["Suillus_luteus_(30896753828).jpg", credit("Lukas from London, England", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/", "Wikimedia Commons / Flickr", "credits-enrichment-v8")],
  ["Boletus_rubropunctum_(Peck)_Singer_550957.jpg", credit("Robert(the 3 foragers) (the3foragers)", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons / Mushroom Observer", "credits-enrichment-v8")],
  ["Boletus_miniato-olivaceus_158624.jpg", credit("Dave W (Dave W)", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons / Mushroom Observer", "credits-enrichment-v8")],

  // v9 batch G — 5 changes: birch bolete / Leccinum scabrum active and nearby records.
  ["Leccinum_scabrum_117467.jpg", credit("Ron Pastorino (Ronpast)", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons / Mushroom Observer", "credits-enrichment-v9")],
  ["Leccinum_scabrum_(23691548239).jpg", credit("Dick Culbert from Gibsons, B.C., Canada", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/", "Wikimedia Commons / Flickr", "credits-enrichment-v9")],
  ["LeccinumScabrum.JPG", credit("Julo", "Public domain — author released", "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain", "Wikimedia Commons", "credits-enrichment-v9")],
  ["Leccinum_scabrum_(1).jpg", credit("alexntor / Alexntor", "Public domain — author released", "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain", "Wikimedia Commons / Russian Wikipedia", "credits-enrichment-v9")],
  ["Leccinum_scabrum_(3559705977).jpg", credit("Jason Hollinger", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/", "Wikimedia Commons / Flickr", "credits-enrichment-v9")],

  // v10 batch H — 5 changes: two-colored bolete and nearby verified boletes.
  ["Boletus_bicolor_89542.jpg", credit("Dan Molter (shroomydan)", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons / Mushroom Observer", "credits-enrichment-v10")],
  ["Boletus_bicolor_1.jpg", credit("Dmitry Brant", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/", "Wikimedia Commons", "credits-enrichment-v10")],
  ["BoletusBicolor.jpg", credit("Dmitry Brant", "CC BY-SA 3.0 / GFDL", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v10")],
  ["Boletus_auripes_90459.jpg", credit("Patrick Harvey (pg_harvey)", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons / Mushroom Observer", "credits-enrichment-v10")],
  ["Boletus_auripes_245660.jpg", credit("I. G. Safonov (IGSafonov)", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons / Mushroom Observer", "credits-enrichment-v10")],

  // v11 batch I — 5 changes: additional verified Leccinum / bolete support records.
  ["Boletus_auripes_143801.jpg", credit("Martin Livezey (MLivezey)", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons / Mushroom Observer", "credits-enrichment-v11")],
  ["Leccinum_scabrum_JPG1.jpg", credit("Jean-Pol GRANDMONT", "CC BY 3.0 / GFDL", "https://creativecommons.org/licenses/by/3.0/", "Wikimedia Commons", "credits-enrichment-v11")],
  ["Leccinum_scabrum_LC0108.jpg", credit("Jörg Hempel", "CC BY-SA 2.0 Germany", "https://creativecommons.org/licenses/by-sa/2.0/de/deed.en", "Wikimedia Commons", "credits-enrichment-v11")],
  ["Leccinum_scabrum_JPG7.jpg", credit("Jean-Pol GRANDMONT", "CC BY-SA 3.0 / GFDL", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v11")],
  ["Tylopilus_felleus.jpg", credit("Walter J. Pilsak, Waldsassen", "CC BY-SA 3.0 / GFDL", "https://creativecommons.org/licenses/by-sa/3.0/", "Wikimedia Commons", "credits-enrichment-v11")],

  // v12 batch J — 5 changes: Leccinum / scaber-stalk support records.
  ["Red-capped_Scaberstalk_(5039938978).jpg", credit("Katja Schulz", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/", "Wikimedia Commons / Flickr", "credits-enrichment-v12")],
  ["Leccinum_scabrum_102024512.jpg", credit("Oleg Kosterin", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/", "Wikimedia Commons / iNaturalist", "credits-enrichment-v12")],
  ["Leccinum_scabrum_94748259.jpg", credit("Tatiana / naturalist10224", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/", "Wikimedia Commons / iNaturalist", "credits-enrichment-v12")],
  ["Leccinum_scabrum_(Brown_Birch_Bolete)_(50383440922).jpg", credit("Lukas Large from Stourbridge, United Kingdom", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/", "Wikimedia Commons / Flickr", "credits-enrichment-v12")],
  ["Leccinum_scabrum_(37143449203).jpg", credit("Björn S...", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/", "Wikimedia Commons / Flickr", "credits-enrichment-v12")]

]);

function isGenericCreditValue(value = "") {
  const text = compact(value).toLowerCase();
  if (!text) return true;
  return text === "wikimedia commons"
    || text === "commons-photo-patch"
    || text === "commons-hardwired"
    || text === "see wikimedia commons file page"
    || text.includes("commons uploader")
    || text.includes("local hardwired manifest");
}

function findCreditOverride(entry = {}) {
  const candidates = [
    entry.sourcePage,
    entry.source_page,
    entry.sourceImage,
    entry.full,
    entry.detail,
    entry.thumb,
    entry.src,
    entry.url
  ].map(normalizeCommonsFileName).filter(Boolean);
  for (const fileName of candidates) {
    const exact = ENRICHED_CREDIT_OVERRIDES.get(fileName);
    if (exact) return exact;
  }
  return null;
}

function applyCreditOverride(entry = {}) {
  const override = findCreditOverride(entry);
  if (!override) return entry;
  return {
    ...entry,
    source: override.source || entry.source,
    author: isGenericCreditValue(entry.author) ? (override.author || entry.author) : entry.author,
    credit: isGenericCreditValue(entry.credit) ? (override.credit || override.author || entry.credit) : entry.credit,
    license: isGenericCreditValue(entry.license) ? (override.license || entry.license) : entry.license,
    licenseUrl: entry.licenseUrl || override.licenseUrl || "",
    creditSource: override.creditSource || entry.creditSource || ""
  };
}

function isPlaceholderImage(value = "") {
  const text = compact(value).toLowerCase();
  if (!text) return true;
  return text.startsWith("data:image/svg")
    || text.includes("image%20needed")
    || text.includes("image needed")
    || text.includes("needs%20photo")
    || text.includes("needs photo")
    || text.includes("placeholder image")
    || text.includes("public%20usable%20photo%20not%20yet%20found")
    || text.includes("public usable photo not yet found");
}

function urlFromImageItem(item) {
  if (!item) return "";
  if (typeof item === "string") return compact(item);
  if (typeof item !== "object") return "";
  return pick(item.thumb, item.detail, item.full, item.src, item.url);
}

function sourcePageFromUrl(url = "") {
  const text = compact(url);
  if (!text) return "";
  if (text.includes("commons.wikimedia.org/wiki/File:")) return text.split("?")[0];
  if (text.includes("commons.wikimedia.org/wiki/Special:FilePath/")) {
    const fileName = normalizeCommonsFileName(text);
    return fileName ? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName).replaceAll("%2F", "/")}` : text;
  }
  return text;
}

function sourceLabelFor(entry = {}) {
  const source = compact(entry.source);
  const page = compact(entry.sourcePage || entry.source_page);
  const hay = `${source} ${page}`.toLowerCase();
  if (hay.includes("commons.wikimedia.org") || hay.includes("wikimedia commons") || hay.includes("commons-photo")) return "Wikimedia Commons";
  if (hay.includes("manifest") || hay.includes("hardwired")) return "Local hardwired manifest";
  if (source) return source;
  return "Image source";
}

function normalizeCreditEntry(entry = {}, record = {}) {
  const sourceImage = pick(entry.sourceImage, entry.full, entry.detail, entry.thumb, entry.src, entry.url);
  const sourcePage = pick(entry.sourcePage, entry.source_page, entry.source_page_url, sourcePageFromUrl(sourceImage));
  const licenseUrl = pick(entry.licenseUrl, entry.license_url, entry.license_link);
  const author = pick(entry.author, entry.creator, entry.photographer, entry.credit);
  const title = pick(entry.title, entry.file_title, entry.name, normalizeCommonsFileName(sourcePage || sourceImage), "Image");
  return applyCreditOverride({
    slug: pick(entry.slug, record.slug),
    species: pick(entry.species, record.display_name, record.common_name, record.slug),
    scientific_name: pick(entry.scientific_name, record.scientific_name),
    source: sourceLabelFor({ ...entry, sourcePage }),
    title,
    author,
    credit: pick(entry.credit),
    license: pick(entry.license),
    licenseUrl,
    sourcePage,
    sourceImage
  });
}

function pushEntry(entries, item, record, index, titlePrefix = "Image") {
  const url = urlFromImageItem(item);
  if (isPlaceholderImage(url)) return;
  if (item && typeof item === "object") {
    entries.push(normalizeCreditEntry({
      ...item,
      title: pick(item.title, `${titlePrefix} ${index + 1}`),
      sourceImage: url,
      slug: record.slug,
      species: record.display_name || record.common_name || record.slug,
      scientific_name: record.scientific_name || ""
    }, record));
    return;
  }
  entries.push(normalizeCreditEntry({
    title: `${titlePrefix} ${index + 1}`,
    source: url.includes("commons.wikimedia.org") || url.includes("upload.wikimedia.org") ? "Wikimedia Commons" : "record image",
    sourcePage: sourcePageFromUrl(url),
    sourceImage: url,
    slug: record.slug,
    species: record.display_name || record.common_name || record.slug,
    scientific_name: record.scientific_name || ""
  }, record));
}

function imageEntriesFromRecord(record = {}) {
  const entries = [];
  asList(record.images_structured).forEach((item, index) => pushEntry(entries, item, record, index, "Structured image"));
  asList(record.images).forEach((item, index) => pushEntry(entries, item, record, index, "Legacy image"));
  asList(record.detail_images).forEach((item, index) => pushEntry(entries, item, record, index, "Detail image"));
  asList(record.enlarge_images).forEach((item, index) => pushEntry(entries, item, record, index, "Full-size image"));
  if (record.list_thumbnail) pushEntry(entries, record.list_thumbnail, record, 0, "List thumbnail");
  return dedupeEntries(entries);
}

function entriesFromSessionCredits(imageCredits) {
  return Array.from(imageCredits?.values?.() || [])
    .flat()
    .map((entry) => normalizeCreditEntry(entry));
}

function dedupeEntries(entries = []) {
  const seen = new Set();
  const out = [];
  for (const entry of entries) {
    const key = [entry.slug, normalizeCommonsFileName(entry.sourcePage || entry.sourceImage), entry.title]
      .map((value) => compact(value).toLowerCase()).join("::");
    if (!key.replace(/:/g, "") || seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
  }
  return out;
}

function missingText(value, label) {
  return value ? esc(value) : `<span class="muted">${esc(label)} not recorded yet</span>`;
}

function creditRow(entry) {
  return `
    <article class="credit-card">
      <h3>${esc(entry.species || entry.slug || "Untitled")}</h3>
      ${entry.scientific_name ? `<p class="muted small"><em>${esc(entry.scientific_name)}</em></p>` : ""}
      <p><strong>Title:</strong> ${missingText(entry.title, "Title")}</p>
      <p><strong>Author / creator / photographer:</strong> ${missingText(entry.author, "Creator")}</p>
      ${entry.credit && entry.credit !== entry.author ? `<p><strong>Credit text:</strong> ${esc(entry.credit)}</p>` : ""}
      <p><strong>Source:</strong> ${esc(entry.source || "Image source")}</p>
      <p><strong>License:</strong> ${missingText(entry.license, "License")}</p>
      ${entry.creditSource ? `<p class="muted small"><strong>Credit pass:</strong> ${esc(entry.creditSource)}</p>` : ""}
      <div class="control-row compact">
        ${entry.sourcePage ? `<a class="buttonish" href="${esc(entry.sourcePage)}" target="_blank" rel="noreferrer">Source page</a>` : ""}
        ${entry.licenseUrl ? `<a class="buttonish" href="${esc(entry.licenseUrl)}" target="_blank" rel="noreferrer">License link</a>` : ""}
        ${entry.sourceImage ? `<a class="buttonish" href="${esc(entry.sourceImage)}" target="_blank" rel="noreferrer">Image file</a>` : ""}
      </div>
    </article>
  `;
}

function catalogRow(record) {
  const entries = imageEntriesFromRecord(record);
  const imageCount = entries.length;
  const missingCreator = entries.filter((entry) => !entry.author).length;
  const missingLicense = entries.filter((entry) => !entry.license || !entry.licenseUrl).length;
  const enriched = entries.filter((entry) => entry.creditSource).length;
  const status = imageCount === 0
    ? "No usable image metadata found"
    : (missingCreator || missingLicense ? "Needs credit enrichment" : "TASL-style credit fields present");

  return `
    <article class="credit-card compact-card">
      <h3>${esc(record.display_name || record.common_name || record.slug || "Untitled")}</h3>
      ${record.scientific_name ? `<p class="muted small"><em>${esc(record.scientific_name)}</em></p>` : ""}
      <p><strong>Credit status:</strong> ${esc(status)}</p>
      <p><strong>Usable image records:</strong> ${imageCount}</p>
      ${imageCount ? `<p><strong>Missing creator:</strong> ${missingCreator} · <strong>Missing license/license link:</strong> ${missingLicense} · <strong>Enriched here:</strong> ${enriched}</p>` : ""}
    </article>
  `;
}

export function renderCreditsPage(records, imageCredits, search = "") {
  const q = String(search || "").trim().toLowerCase();
  const recordEntries = (records || []).flatMap(imageEntriesFromRecord);
  const sessionEntries = entriesFromSessionCredits(imageCredits);
  const credits = dedupeEntries([...recordEntries, ...sessionEntries])
    .filter((entry) => {
      if (!q) return true;
      return [entry.species, entry.scientific_name, entry.title, entry.author, entry.credit, entry.license, entry.source, entry.slug, entry.creditSource]
        .join(" ")
        .toLowerCase()
        .includes(q);
    })
    .sort((a, b) => String(a.species || a.slug).localeCompare(String(b.species || b.slug)) || String(a.title).localeCompare(String(b.title)));

  const catalog = (records || [])
    .filter((record) => {
      if (!q) return true;
      return [record.display_name, record.common_name, record.scientific_name, record.slug].join(" ").toLowerCase().includes(q);
    })
    .sort((a, b) => String(a.display_name || a.common_name || a.slug).localeCompare(String(b.display_name || b.common_name || b.slug)));

  const totalImageRecords = recordEntries.length;
  const withCreator = recordEntries.filter((entry) => !!entry.author).length;
  const withLicense = recordEntries.filter((entry) => !!entry.license && !!entry.licenseUrl).length;
  const needsEnrichment = recordEntries.filter((entry) => !entry.author || !entry.license || !entry.licenseUrl).length;
  const enrichedCreditCount = recordEntries.filter((entry) => /^credits-enrichment-v\d+/.test(entry.creditSource || "")).length;

  return `
    <section class="panel">
      <h2>Credits</h2>
      <p>This page reads image-credit fields directly from the loaded species records and from the controlled built-in enrichment table.</p>
      <p class="muted small">Target credit format is TASL-style: title, author / creator / photographer, source page, license, and license link. Records that still say only "Wikimedia Commons" are flagged by missing creator or license details.</p>
      <p class="muted small">This build includes another five mini-batches of five credit enrichments each, focused mainly on boletes, Suillus, and scaber-stalk / Leccinum records. It keeps all earlier enrichment batches and continues auditing legacy image arrays instead of only structured image slots.</p>
    </section>

    <section class="panel">
      <div class="grid-3">
        <div class="stat-card"><div class="num">${records.length}</div><div>Species in catalog</div></div>
        <div class="stat-card"><div class="num">${totalImageRecords}</div><div>Usable image records found</div></div>
        <div class="stat-card"><div class="num">${withCreator}</div><div>With creator / photographer</div></div>
        <div class="stat-card"><div class="num">${withLicense}</div><div>With license + link</div></div>
        <div class="stat-card"><div class="num">${needsEnrichment}</div><div>Need credit enrichment</div></div>
        <div class="stat-card"><div class="num">${enrichedCreditCount}</div><div>Enriched in built-in credit passes</div></div>
        <div class="stat-card"><div class="num">0</div><div>Runtime Commons API calls</div></div>
      </div>
    </section>

    <section class="panel">
      <h3>Image credits</h3>
      ${credits.length ? `<section class="credit-list">${credits.map(creditRow).join("")}</section>` : `<p class="muted">No matching image credit records found.</p>`}
    </section>

    <section class="panel">
      <h3>Species image-credit audit</h3>
      <section class="credit-list">${catalog.map(catalogRow).join("")}</section>
    </section>
  `;
}
