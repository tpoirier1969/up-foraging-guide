import { esc } from "../lib/escape.js";

const RAW_CREDIT_OVERRIDES = [
  {
    "file": "Fagus_grandifolia.jpg",
    "author": "Raul654",
    "credit": "Raul654",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v1"
  },
  {
    "file": "American_Beech_Fagus_grandifolia_Bark.JPG",
    "author": "Derek Ramsey (Ram-Man)",
    "credit": "© Derek Ramsey / derekramsey.com",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v1"
  },
  {
    "file": "Fagus_grandifolia_leaf.jpg",
    "author": "Rob Duval",
    "credit": "Rob Duval",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v1"
  },
  {
    "file": "American_Linden_or_Basswood_(34058253263).jpg",
    "author": "Dan Keck from Ohio",
    "credit": "Dan Keck from Ohio",
    "license": "CC0 1.0 Universal Public Domain Dedication",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v1"
  },
  {
    "file": "Tilia_americana_bark.jpg",
    "author": "Rob Duval",
    "credit": "Rob Duval",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v1"
  },
  {
    "file": "Flower_2932.jpg",
    "author": "Chris Light",
    "credit": "Chris Light",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v1"
  },
  {
    "file": "Heracleum_maximum_1.jpg",
    "author": "Danielle Langlois / Dlanglois",
    "credit": "Danielle Langlois / Dlanglois",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v1"
  },
  {
    "file": "Cow_Parsnip.jpg",
    "author": "Stephen Lea",
    "credit": "Stephen Lea",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v1"
  },
  {
    "file": "Heracleum_maximum_3.jpg",
    "author": "Danielle Langlois / Dlanglois",
    "credit": "Danielle Langlois / Dlanglois",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v1"
  },
  {
    "file": "Ganoderma_applanatum_1259894.jpg",
    "author": "Richard Daniel",
    "credit": "Richard Daniel",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v2"
  },
  {
    "file": "Ganoderma_applanatum_(Ganodermataceae).jpg",
    "author": "Filo gèn’",
    "credit": "Filo gèn’",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v2"
  },
  {
    "file": "Artists_conk-Ganoderma_applanatum_(7402107040).jpg",
    "author": "Scott Darbey",
    "credit": "Scott Darbey",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v2"
  },
  {
    "file": "Pleurotus_populinus_13996.jpg",
    "author": "Jim Tunney",
    "credit": "Jim Tunney",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v2"
  },
  {
    "file": "Pleurotus_populinus_O._Hilber_&_O.K._Mill_742181.jpg",
    "author": "Phil Yeager",
    "credit": "Phil Yeager",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v2"
  },
  {
    "file": "Pleurotus_populinus_O._Hilber_&_O.K._Mill_89533.jpg",
    "author": "Robert Sasata",
    "credit": "Robert Sasata",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v2"
  },
  {
    "file": "Inonotus_obliquus.jpg",
    "author": "Tocekas / Tomas Čekanavičius",
    "credit": "Tocekas / Tomas Čekanavičius",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v2"
  },
  {
    "file": "Chaga_(8237818667).jpg",
    "author": "natureluvr01",
    "credit": "natureluvr01",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v2"
  },
  {
    "file": "Chaga_Mushroom_-_Inonotus_obliquus_(30222675437).jpg",
    "author": "Björn S...",
    "credit": "Björn S...",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v2"
  },
  {
    "file": "Lepista_nuda.jpg",
    "author": "Archenzo, Italy",
    "credit": "Archenzo, Italy",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v3"
  },
  {
    "file": "Lepista_nuda_(2).jpg",
    "author": "Thomas Pruß",
    "credit": "Thomas Pruß",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v3"
  },
  {
    "file": "Lepista_nuda_01.jpg",
    "author": "Σ64",
    "credit": "Σ64",
    "license": "CC BY 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v3"
  },
  {
    "file": "Sparassis_crispa_3.jpg",
    "author": "Puchatech K.",
    "credit": "Puchatech K.",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v3"
  },
  {
    "file": "Hydnum_repandum.jpg",
    "author": "Pau Cabot",
    "credit": "Pau Cabot",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v3"
  },
  {
    "file": "Ganoderma_tsugae.jpg",
    "author": "RattBoy",
    "credit": "RattBoy",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v4"
  },
  {
    "file": "Ganoderma_tsugae_123102289.jpg",
    "author": "Will Kuhn",
    "credit": "Will Kuhn",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "Wikimedia Commons / iNaturalist",
    "creditSource": "credits-enrichment-v4"
  },
  {
    "file": "Ganoderma_tsugae_Vermont,_USA.jpg",
    "author": "Daniel Josefchak",
    "credit": "Daniel Josefchak",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v4"
  },
  {
    "file": "Grifola_frondosa.jpg",
    "author": "Sinisa Radic",
    "credit": "Sinisa Radic",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v4"
  },
  {
    "file": "Armillaria_mellea.JPG",
    "author": "Quarma~commonswiki",
    "credit": "Quarma~commonswiki",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v4"
  },
  {
    "file": "Pleurotus_ostreatus.jpg",
    "author": "Franck Hidvégi",
    "credit": "Franck Hidvégi",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v5"
  },
  {
    "file": "Pleurotus_pulmonarius.jpg",
    "author": "EpochFail / Aaron Halfaker",
    "credit": "EpochFail / Aaron Halfaker",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v5"
  },
  {
    "file": "Amanita_muscaria_var._guessowii_(2).jpg",
    "author": "Samuel Vaughn D. Duncan",
    "credit": "Samuel Vaughn D. Duncan",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v5"
  },
  {
    "file": "Amanita_muscaria_var._guessowii,_medium.jpg",
    "author": "Ragesoss",
    "credit": "Ragesoss",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v5"
  },
  {
    "file": "Amanita_muscaria_var._guessowii,_small.jpg",
    "author": "Ragesoss",
    "credit": "Ragesoss",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v5"
  },
  {
    "file": "Morchella_esculenta_36795275.jpg",
    "author": "Tom Zucker-Scharff",
    "credit": "Tom Zucker-Scharff",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "Wikimedia Commons / iNaturalist",
    "creditSource": "credits-enrichment-v6"
  },
  {
    "file": "Morchella_esculenta_(Twelve_edible_mushrooms_of_the_United_States).jpg",
    "author": "Thomas Taylor / USDA",
    "credit": "Thomas Taylor / USDA",
    "license": "Public domain — United States",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States",
    "source": "Wikimedia Commons / USDA",
    "creditSource": "credits-enrichment-v6"
  },
  {
    "file": "Cantharellus_cinnabarinus.jpg",
    "author": "S0urLuc1d",
    "credit": "S0urLuc1d",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v6"
  },
  {
    "file": "Flammulina_velutipes._(53589573202).jpg",
    "author": "Bernard Spragg. NZ",
    "credit": "Bernard Spragg. NZ",
    "license": "Public Domain Mark 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v6"
  },
  {
    "file": "2013-04-15_Morchella_punctipes_Peck_(1903)_322536.jpg",
    "author": "Mike Hopping (AvlMike)",
    "credit": "Mike Hopping (AvlMike)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v6"
  },
  {
    "file": "Morchella_punctipes_205457.jpg",
    "author": "Jason Hollinger",
    "credit": "Jason Hollinger",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v7"
  },
  {
    "file": "Morchella_punctipes_128110858.jpg",
    "author": "Chase G. Mayers / cgmayers",
    "credit": "Chase G. Mayers / cgmayers",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "Wikimedia Commons / iNaturalist",
    "creditSource": "credits-enrichment-v7"
  },
  {
    "file": "Morchella_punctipes_128111168.jpg",
    "author": "Chase G. Mayers / cgmayers",
    "credit": "Chase G. Mayers / cgmayers",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "Wikimedia Commons / iNaturalist",
    "creditSource": "credits-enrichment-v7"
  },
  {
    "file": "Lactarius_deliciosus_(edible_mushrooms_of_the_United_States).jpg",
    "author": "Thomas Taylor / USDA",
    "credit": "Thomas Taylor / USDA",
    "license": "Public domain — United States",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States",
    "source": "Wikimedia Commons / USDA",
    "creditSource": "credits-enrichment-v7"
  },
  {
    "file": "Cantharellus_cibarius_(Twelve_edible_mushrooms_of_the_United_States).jpg",
    "author": "Thomas Taylor / USDA",
    "credit": "Thomas Taylor / USDA",
    "license": "Public domain — United States",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States",
    "source": "Wikimedia Commons / USDA",
    "creditSource": "credits-enrichment-v7"
  },
  {
    "file": "Boletus_subcaerulescens_35861.jpg",
    "author": "Dave in NE PA",
    "credit": "Dave in NE PA",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v8"
  },
  {
    "file": "Tylopilus_alboater_(Schwein.)_Murrill_650766.jpg",
    "author": "walt sturgeon (Mycowalt)",
    "credit": "walt sturgeon (Mycowalt)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v8"
  },
  {
    "file": "Suillus_luteus_(30896753828).jpg",
    "author": "Lukas from London, England",
    "credit": "Lukas from London, England",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v8"
  },
  {
    "file": "Boletus_rubropunctum_(Peck)_Singer_550957.jpg",
    "author": "Robert(the 3 foragers) (the3foragers)",
    "credit": "Robert(the 3 foragers) (the3foragers)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v8"
  },
  {
    "file": "Boletus_miniato-olivaceus_158624.jpg",
    "author": "Dave W (Dave W)",
    "credit": "Dave W (Dave W)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v8"
  },
  {
    "file": "Leccinum_scabrum_117467.jpg",
    "author": "Ron Pastorino (Ronpast)",
    "credit": "Ron Pastorino (Ronpast)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v9"
  },
  {
    "file": "Leccinum_scabrum_(23691548239).jpg",
    "author": "Dick Culbert from Gibsons, B.C., Canada",
    "credit": "Dick Culbert from Gibsons, B.C., Canada",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v9"
  },
  {
    "file": "LeccinumScabrum.JPG",
    "author": "Julo",
    "credit": "Julo",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v9"
  },
  {
    "file": "Leccinum_scabrum_(1).jpg",
    "author": "alexntor / Alexntor",
    "credit": "alexntor / Alexntor",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons / Russian Wikipedia",
    "creditSource": "credits-enrichment-v9"
  },
  {
    "file": "Leccinum_scabrum_(3559705977).jpg",
    "author": "Jason Hollinger",
    "credit": "Jason Hollinger",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v9"
  },
  {
    "file": "Boletus_bicolor_89542.jpg",
    "author": "Dan Molter (shroomydan)",
    "credit": "Dan Molter (shroomydan)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v10"
  },
  {
    "file": "Boletus_bicolor_1.jpg",
    "author": "Dmitry Brant",
    "credit": "Dmitry Brant",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v10"
  },
  {
    "file": "BoletusBicolor.jpg",
    "author": "Dmitry Brant",
    "credit": "Dmitry Brant",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v10"
  },
  {
    "file": "Boletus_auripes_90459.jpg",
    "author": "Patrick Harvey (pg_harvey)",
    "credit": "Patrick Harvey (pg_harvey)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v10"
  },
  {
    "file": "Boletus_auripes_245660.jpg",
    "author": "I. G. Safonov (IGSafonov)",
    "credit": "I. G. Safonov (IGSafonov)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v10"
  },
  {
    "file": "Boletus_auripes_143801.jpg",
    "author": "Martin Livezey (MLivezey)",
    "credit": "Martin Livezey (MLivezey)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v11"
  },
  {
    "file": "Leccinum_scabrum_JPG1.jpg",
    "author": "Jean-Pol GRANDMONT",
    "credit": "Jean-Pol GRANDMONT",
    "license": "CC BY 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v11"
  },
  {
    "file": "Leccinum_scabrum_LC0108.jpg",
    "author": "Jörg Hempel",
    "credit": "Jörg Hempel",
    "license": "CC BY-SA 2.0 Germany",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/de/deed.en",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v11"
  },
  {
    "file": "Leccinum_scabrum_JPG7.jpg",
    "author": "Jean-Pol GRANDMONT",
    "credit": "Jean-Pol GRANDMONT",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v11"
  },
  {
    "file": "Tylopilus_felleus.jpg",
    "author": "Walter J. Pilsak, Waldsassen",
    "credit": "Walter J. Pilsak, Waldsassen",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v11"
  },
  {
    "file": "Red-capped_Scaberstalk_(5039938978).jpg",
    "author": "Katja Schulz",
    "credit": "Katja Schulz",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v12"
  },
  {
    "file": "Leccinum_scabrum_102024512.jpg",
    "author": "Oleg Kosterin",
    "credit": "Oleg Kosterin",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "Wikimedia Commons / iNaturalist",
    "creditSource": "credits-enrichment-v12"
  },
  {
    "file": "Leccinum_scabrum_94748259.jpg",
    "author": "Tatiana / naturalist10224",
    "credit": "Tatiana / naturalist10224",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "Wikimedia Commons / iNaturalist",
    "creditSource": "credits-enrichment-v12"
  },
  {
    "file": "Leccinum_scabrum_(Brown_Birch_Bolete)_(50383440922).jpg",
    "author": "Lukas Large from Stourbridge, United Kingdom",
    "credit": "Lukas Large from Stourbridge, United Kingdom",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v12"
  },
  {
    "file": "Leccinum_scabrum_(37143449203).jpg",
    "author": "Björn S...",
    "credit": "Björn S...",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v12"
  },
  {
    "file": "Armillaria_mellea_7724.jpg",
    "author": "Nathan Wilson (nathan)",
    "credit": "Nathan Wilson (nathan)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v13"
  },
  {
    "file": "2010-09-30_Armillaria_mellea_s.str._cropped.jpg",
    "author": "Stu's Images; derivative work by Ak ccm",
    "credit": "Stu's Images; derivative work by Ak ccm",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v13"
  },
  {
    "file": "2015.10.10.-01-Viernheim--Honiggelber_Hallimasch.jpg",
    "author": "Gerhard Koller",
    "credit": "Gerhard Koller",
    "license": "CC BY-SA 3.0 Germany",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v13"
  },
  {
    "file": "Armillaria_mellea_-_honey_fungus_UK.jpg",
    "author": "Stu's Images",
    "credit": "Stu's Images",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v13"
  },
  {
    "file": "Armillaria_mellea,_Honey_Fungus,_UK_1.jpg",
    "author": "Stu's Images",
    "credit": "Stu's Images",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v13"
  },
  {
    "file": "2012-08-10_Boletinellus_merulioides_(Schwein.)_Murrill_247593.jpg",
    "author": "Christian Schwarz (Amanita virosa)",
    "credit": "Christian Schwarz (Amanita virosa)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v14"
  },
  {
    "file": "Boletinellus_merulioides_95348.jpg",
    "author": "Dan Molter (shroomydan)",
    "credit": "Dan Molter (shroomydan)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v14"
  },
  {
    "file": "Boletinellus.merulioides.vermont1.jpg",
    "author": "Jason Hollinger",
    "credit": "Jason Hollinger",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v14"
  },
  {
    "file": "Boletinellus.merulioides.vermont2.jpg",
    "author": "Jason Hollinger",
    "credit": "Jason Hollinger",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v14"
  },
  {
    "file": "Boletinellus.merulioides.vermont3.jpg",
    "author": "Jason Hollinger",
    "credit": "Jason Hollinger",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v14"
  },
  {
    "file": "Morchella_punctipes_202600.jpg",
    "author": "Danny Newman",
    "credit": "Danny Newman",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v15"
  },
  {
    "file": "Morchella_punctipes_121362.jpg",
    "author": "Alan Rockefeller",
    "credit": "Alan Rockefeller",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v15"
  },
  {
    "file": "Morchella_americana_70966.jpg",
    "author": "Ron Pastorino (Ronpast)",
    "credit": "Ron Pastorino (Ronpast)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v15"
  },
  {
    "file": "Morchella_esculenta_2010_G2.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v15"
  },
  {
    "file": "Morchella_esculenta_08042013.jpg",
    "author": "H. Krisp",
    "credit": "H. Krisp",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v15"
  },
  {
    "file": "Suillus_luteus_041031w.jpg",
    "author": "Walter J. Pilsak",
    "credit": "Walter J. Pilsak",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v16"
  },
  {
    "file": "Suillus_luteus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v16"
  },
  {
    "file": "Suillus_luteus_(15796444291).jpg",
    "author": "Björn S...",
    "credit": "Björn S...",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v16"
  },
  {
    "file": "Suillus_luteus_23.jpg",
    "author": "H. Krisp",
    "credit": "H. Krisp",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v16"
  },
  {
    "file": "Suillus_luteus_3.jpg",
    "author": "H. Krisp",
    "credit": "H. Krisp",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v16"
  },
  {
    "file": "Baorangia_bicolor_(Kuntze)_G._Wu,_Halling_&_Zhu_L._Yang_635236_2016-07-13.jpg",
    "author": "Scott Pavelle (Scott Pavelle)",
    "credit": "Scott Pavelle (Scott Pavelle)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v17"
  },
  {
    "file": "Baorangia_bicolor_(Kuntze)_G._Wu,_Halling_&_Zhu_L._Yang_635554_2016-07-13.jpg",
    "author": "Dave W (Dave W)",
    "credit": "Dave W (Dave W)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v17"
  },
  {
    "file": "2017-08-26_Baorangia_bicolor_group_794687.jpg",
    "author": "Christian Schwarz (Amanita virosa)",
    "credit": "Christian Schwarz (Amanita virosa)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v17"
  },
  {
    "file": "Baorangia_bicolor_2.jpg",
    "author": "Derek Ramsey (Ram-Man)",
    "credit": "Derek Ramsey (Ram-Man)",
    "license": "GFDL 1.2 or later",
    "licenseUrl": "https://www.gnu.org/licenses/old-licenses/fdl-1.2.html",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v17"
  },
  {
    "file": "Red-and-yellow_bolete_Boletus_bicolor_nibbled.jpg",
    "author": "Mason Brock",
    "credit": "Mason Brock",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v17"
  },
  {
    "file": "Boletus_bicoloroides_A.H._Sm._&_Thiers_354793.jpg",
    "author": "Dario Taraborelli (dariotaraborelli)",
    "credit": "Dario Taraborelli (dariotaraborelli)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v18"
  },
  {
    "file": "2013-08-04_Boletus_bicoloroides_A.H._Sm._&_Thiers_354793.jpg",
    "author": "Dario Taraborelli (dariotaraborelli)",
    "credit": "Dario Taraborelli (dariotaraborelli)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v18"
  },
  {
    "file": "Boletus_rubropunctum_(Peck)_Singer_875702.jpg",
    "author": "Richard Nadon (Richard Nadon)",
    "credit": "Richard Nadon (Richard Nadon)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v18"
  },
  {
    "file": "Boletus_rubissimus_366160.jpg",
    "author": "Noah Siegel (NoahSiegel)",
    "credit": "Noah Siegel (NoahSiegel)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v18"
  },
  {
    "file": "Exsudoporus_frostii_43854.jpg",
    "author": "Nathan Wilson (nathan)",
    "credit": "Nathan Wilson (nathan)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v18"
  },
  {
    "file": "Strobilomyces_strobilaceus_5.jpg",
    "author": "Jörg Hempel",
    "credit": "Jörg Hempel",
    "license": "CC BY-SA 2.0 Germany",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/de/deed.en",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v19"
  },
  {
    "file": "2006-09-03_Strobilomyces_strobilaceus_1.jpg",
    "author": "Jörg Hempel",
    "credit": "Jörg Hempel",
    "license": "CC BY-SA 2.0 Germany",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/de/deed.en",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v19"
  },
  {
    "file": "2006-09-03_Strobilomyces_strobilaceus_2.jpg",
    "author": "Jörg Hempel",
    "credit": "Jörg Hempel",
    "license": "CC BY-SA 2.0 Germany",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/de/deed.en",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v19"
  },
  {
    "file": "Strobilomyces_strobilaceus_110920wc.JPG",
    "author": "Walter J. Pilsak",
    "credit": "Walter J. Pilsak",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v19"
  },
  {
    "file": "Strobilomyces_strobilaceus_(23682362208).jpg",
    "author": "Dick Culbert from Gibsons, B.C., Canada",
    "credit": "Dick Culbert from Gibsons, B.C., Canada",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v19"
  },
  {
    "file": "Pleurotus_ostreatus_2511.jpg",
    "author": "Andreas Kunze",
    "credit": "Andreas Kunze",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v20"
  },
  {
    "file": "Pleurotus_ostreatus_JPG1.jpg",
    "author": "Jean-Pol GRANDMONT",
    "credit": "Jean-Pol GRANDMONT",
    "license": "CC BY 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v20"
  },
  {
    "file": "Pleurotus_pulmonarius_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v20"
  },
  {
    "file": "Pleurotus_pulmonarius_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v20"
  },
  {
    "file": "Pleurotus_populinus_824234.jpg",
    "author": "Ron Pastorino (Ronpast)",
    "credit": "Ron Pastorino (Ronpast)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v20"
  },
  {
    "file": "Hedgehog_fungi.jpg",
    "author": "Sannse",
    "credit": "Sannse",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v21"
  },
  {
    "file": "2012-08-29_Hydnum_repandum_L_256175.jpg",
    "author": "Jean-Pol GRANDMONT",
    "credit": "Jean-Pol GRANDMONT",
    "license": "CC BY 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v21"
  },
  {
    "file": "Cantharellus_cinnabarinus_377769.jpg",
    "author": "Alan Rockefeller",
    "credit": "Alan Rockefeller",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v21"
  },
  {
    "file": "Cantharellus_cinnabarinus_129003.jpg",
    "author": "Aynia Brennan (aynia)",
    "credit": "Aynia Brennan (aynia)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v21"
  },
  {
    "file": "Cantharellus_cibarius_2008_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v21"
  },
  {
    "file": "Amanita_muscaria_var._guessowii.jpg",
    "author": "Ryan Hodnett",
    "credit": "Ryan Hodnett",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v22"
  },
  {
    "file": "Amanita_muscaria_var._guessowii_(1).jpg",
    "author": "Ryan Hodnett",
    "credit": "Ryan Hodnett",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v22"
  },
  {
    "file": "Flammulina_velutipes_(42284743332).jpg",
    "author": "Björn S...",
    "credit": "Björn S...",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v22"
  },
  {
    "file": "Flammulina_velutipes_106827706.jpg",
    "author": "Austin Lippincott",
    "credit": "Austin Lippincott",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "Wikimedia Commons / iNaturalist",
    "creditSource": "credits-enrichment-v22"
  },
  {
    "file": "Flammulina_velutipes_2007_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v22"
  },
  {
    "file": "Tylopilus-felleus-010.jpg",
    "author": "Danny S.",
    "credit": "Danny S.",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v23"
  },
  {
    "file": "Tylopilus_felleus_14.jpg",
    "author": "Morten Pettersen",
    "credit": "Morten Pettersen",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "Wikimedia Commons / GBIF",
    "creditSource": "credits-enrichment-v23"
  },
  {
    "file": "Tylopilus_felleus_(36999913742).jpg",
    "author": "Björn S...",
    "credit": "Björn S...",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v23"
  },
  {
    "file": "Tylopilus_felleus_(37154732850).jpg",
    "author": "Björn S...",
    "credit": "Björn S...",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v23"
  },
  {
    "file": "Tylopilus_felleus_6.jpg",
    "author": "peter_gabler",
    "credit": "peter_gabler",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "Wikimedia Commons / iNaturalist",
    "creditSource": "credits-enrichment-v23"
  },
  {
    "file": "Tylopilus_alboater_54698.jpg",
    "author": "Dan Molter (shroomydan)",
    "credit": "Dan Molter (shroomydan)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v24"
  },
  {
    "file": "Tylopilus_alboater_(Schwein.)_Murrill_532904.jpg",
    "author": "walt sturgeon (Mycowalt)",
    "credit": "walt sturgeon (Mycowalt)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v24"
  },
  {
    "file": "Tylopilus_alboater_(Schwein.)_Murrill_532905.jpg",
    "author": "walt sturgeon (Mycowalt)",
    "credit": "walt sturgeon (Mycowalt)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v24"
  },
  {
    "file": "Tylopilus_alboater_(Schwein.)_Murrill_650767.jpg",
    "author": "walt sturgeon (Mycowalt)",
    "credit": "walt sturgeon (Mycowalt)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v24"
  },
  {
    "file": "Tylopilus_alboater_(Schwein.)_Murrill_650768.jpg",
    "author": "walt sturgeon (Mycowalt)",
    "credit": "walt sturgeon (Mycowalt)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v24"
  },
  {
    "file": "Tylopilus_alboater_(Schwein.)_Murrill_650769.jpg",
    "author": "walt sturgeon (Mycowalt)",
    "credit": "walt sturgeon (Mycowalt)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v25"
  },
  {
    "file": "Tylopilus_alboater_(Schwein.)_Murrill_260436.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v25"
  },
  {
    "file": "Tylopilus_alboater_(Schwein.)_Murrill_260439.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v25"
  },
  {
    "file": "Tylopilus_alboater_(Schwein.)_Murrill_74316.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v25"
  },
  {
    "file": "Tylopilus_alboater_159340.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v25"
  },
  {
    "file": "Exsudoporus_frostii.jpg",
    "author": "Dmitry Brant",
    "credit": "Dmitry Brant",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v26"
  },
  {
    "file": "Exsudoporus_frostii_15406.jpg",
    "author": "Kamenko Pajic",
    "credit": "Kamenko Pajic",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v26"
  },
  {
    "file": "Exsudoporus_frostii_100632.jpg",
    "author": "Dan Molter",
    "credit": "Dan Molter",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v26"
  },
  {
    "file": "Exsudoporus_frostii_95289.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v26"
  },
  {
    "file": "Frost's_Bolete_(Exsudoporus_frostii)_(23e804aa-5edc-4ca7-b1b0-c141804d9c3f).jpg",
    "author": "iNaturalist contributor",
    "credit": "iNaturalist contributor",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "Wikimedia Commons / iNaturalist",
    "creditSource": "credits-enrichment-v26"
  },
  {
    "file": "Boletus_rubellus.jpg",
    "author": "Petru Damsa",
    "credit": "Petru Damsa",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v27"
  },
  {
    "file": "Ruby_Bolete_(Boletus_rubellus).jpg",
    "author": "Trachemys",
    "credit": "Trachemys",
    "license": "CC BY-SA 3.0 / 2.5 / 2.0 / 1.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v27"
  },
  {
    "file": "Hortiboletus_rubellus_550076.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v27"
  },
  {
    "file": "Hortiboletus_rubellus_655893.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v27"
  },
  {
    "file": "Hortiboletus_rubellus_2015_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v27"
  },
  {
    "file": "2010-07-11_Leucoagaricus_rubrotinctus_(Peck)_Singer_96981.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v28"
  },
  {
    "file": "2010-07-11_Leucoagaricus_rubrotinctus_(Peck)_Singer_96983.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v28"
  },
  {
    "file": "2011-09-03_Leucoagaricus_rubrotinctus_(Peck)_Singer_166243.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v28"
  },
  {
    "file": "2012-09-08_Leucoagaricus_rubrotinctus_(Peck)_Singer_260218.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v28"
  },
  {
    "file": "2012-09-08_Leucoagaricus_rubrotinctus_(Peck)_Singer_260219.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v28"
  },
  {
    "file": "Lactarius_intermedius_341980611.jpg",
    "author": "Matej Frančeškin",
    "credit": "Matej Frančeškin",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "Wikimedia Commons / iNaturalist",
    "creditSource": "credits-enrichment-v29"
  },
  {
    "file": "Lactarius_deliciosus_20070819wa.JPG",
    "author": "Walter J. Pilsak",
    "credit": "Walter J. Pilsak",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v29"
  },
  {
    "file": "Lactarius_deliciosus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v29"
  },
  {
    "file": "Lactarius_deliciosus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v29"
  },
  {
    "file": "Lactarius_indigo_48568.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v29"
  },
  {
    "file": "Chroogomphus_rutilus_(1).jpg",
    "author": "B.gliwa",
    "credit": "B.gliwa",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v30"
  },
  {
    "file": "Chroogomphus_rutilus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v30"
  },
  {
    "file": "Chroogomphus_rutilus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v30"
  },
  {
    "file": "Gomphidius_glutinosus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v30"
  },
  {
    "file": "Gomphidius_glutinosus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v30"
  },
  {
    "file": "Agaricus_campestris_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v31"
  },
  {
    "file": "Agaricus_campestris_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v31"
  },
  {
    "file": "Agaricus_campestris_091024.jpg",
    "author": "H. Krisp",
    "credit": "H. Krisp",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v31"
  },
  {
    "file": "Agaricus_campestris_2012-10-14.JPG",
    "author": "AnRo0002",
    "credit": "AnRo0002",
    "license": "CC0 1.0 Universal Public Domain Dedication",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v31"
  },
  {
    "file": "Agaricus_silvicola_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v31"
  },
  {
    "file": "Lycoperdon_perlatum_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v32"
  },
  {
    "file": "Lycoperdon_perlatum_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v32"
  },
  {
    "file": "Lycoperdon_pyriforme_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v32"
  },
  {
    "file": "Calvatia_gigantea_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v32"
  },
  {
    "file": "Calvatia_gigantea_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v32"
  }
];

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

const ENRICHED_CREDIT_OVERRIDES = new Map(
  RAW_CREDIT_OVERRIDES.map((entry) => [entry.file, {
    author: entry.author,
    credit: entry.credit || entry.author,
    license: entry.license,
    licenseUrl: entry.licenseUrl,
    source: entry.source || "Wikimedia Commons",
    creditSource: entry.creditSource
  }])
);

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
  const overrideCount = ENRICHED_CREDIT_OVERRIDES.size;

  return `
    <section class="panel">
      <h2>Credits</h2>
      <p>This page reads image-credit fields directly from the loaded species records and from the controlled built-in enrichment table.</p>
      <p class="muted small">Target credit format is TASL-style: title, author / creator / photographer, source page, license, and license link. Records that still say only "Wikimedia Commons" are flagged by missing creator or license details.</p>
      <p class="muted small">This build adds another ten mini-batches of five credit enrichments each (50 total new overrides), bringing the built-in override table to 168 entries.</p>
    </section>

    <section class="panel">
      <div class="grid-3">
        <div class="stat-card"><div class="num">${records.length}</div><div>Species in catalog</div></div>
        <div class="stat-card"><div class="num">${totalImageRecords}</div><div>Usable image records found</div></div>
        <div class="stat-card"><div class="num">${withCreator}</div><div>With creator / photographer</div></div>
        <div class="stat-card"><div class="num">${withLicense}</div><div>With license + link</div></div>
        <div class="stat-card"><div class="num">${needsEnrichment}</div><div>Need credit enrichment</div></div>
        <div class="stat-card"><div class="num">${enrichedCreditCount}</div><div>Enriched in built-in credit passes</div></div>
        <div class="stat-card"><div class="num">${overrideCount}</div><div>Total built-in credit overrides</div></div>
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
