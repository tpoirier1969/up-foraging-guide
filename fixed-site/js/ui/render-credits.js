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
  },
  {
    "file": "Old_Pinus_strobus.jpg",
    "author": "Chris M",
    "credit": "Chris M",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v33"
  },
  {
    "file": "Pinus_strobus.jpg",
    "author": "MPF / Wikimedia Commons uploader",
    "credit": "MPF / Wikimedia Commons uploader",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v33"
  },
  {
    "file": "NAS-145_Pinus_strobus.png",
    "author": "North American Sylva / public-domain botanical plate",
    "credit": "North American Sylva / public-domain botanical plate",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v33"
  },
  {
    "file": "Betula_papyrifera.jpg",
    "author": "WindBorneListener",
    "credit": "WindBorneListener",
    "license": "CC0 1.0 Universal Public Domain Dedication",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v33"
  },
  {
    "file": "NAS-069_Betula_papyrifera.png",
    "author": "North American Sylva / public-domain botanical plate",
    "credit": "North American Sylva / public-domain botanical plate",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v33"
  },
  {
    "file": "Cornus_canadensis,_Pancake_Bay_PP.jpg",
    "author": "P199 / Wikimedia Commons",
    "credit": "P199 / Wikimedia Commons",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v34"
  },
  {
    "file": "Cornus_canadensis_Rainy_River.jpg",
    "author": "P199 / Wikimedia Commons",
    "credit": "P199 / Wikimedia Commons",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v34"
  },
  {
    "file": "Cornus_canadensis,_Sault_Ste_Marie.JPG",
    "author": "P199 / Wikimedia Commons",
    "credit": "P199 / Wikimedia Commons",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v34"
  },
  {
    "file": "Arctium_lappa_8.JPG",
    "author": "Dalgial",
    "credit": "Dalgial",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v34"
  },
  {
    "file": "Arctium_lappa_(3704272472).jpg",
    "author": "Matt Lavin",
    "credit": "Matt Lavin",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v34"
  },
  {
    "file": "Arctium_lappa_(3704271620).jpg",
    "author": "Matt Lavin",
    "credit": "Matt Lavin",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v35"
  },
  {
    "file": "Typha_latifolia_Finland.jpg",
    "author": "Kristian Peters -- Fabelfroh",
    "credit": "Kristian Peters -- Fabelfroh",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v35"
  },
  {
    "file": "Typha_latifolia_norway.jpg",
    "author": "Bjørn Christian Tørrissen",
    "credit": "Bjørn Christian Tørrissen",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v35"
  },
  {
    "file": "Dunhammer.jpg",
    "author": "Erik Christensen",
    "credit": "Erik Christensen",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v35"
  },
  {
    "file": "Stellaria_media_(2560842443).jpg",
    "author": "Matt Lavin",
    "credit": "Matt Lavin",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v35"
  },
  {
    "file": "Stellaria_media_-_flowers.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v36"
  },
  {
    "file": "Stellaria_media.jpg",
    "author": "Rasbak",
    "credit": "Rasbak",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v36"
  },
  {
    "file": "Calamus_(Acorus_calamus).jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v36"
  },
  {
    "file": "Acorus_calamus.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v36"
  },
  {
    "file": "Acorus_calamus_rhizomes.jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v36"
  },
  {
    "file": "Comptonia_peregrina_BotGardBln1105HabitusFall.JPG",
    "author": "Daderot",
    "credit": "Daderot",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v37"
  },
  {
    "file": "Comptonia_peregrina_HabitusLeavesFall_BotGardBln0906.JPG",
    "author": "Daderot",
    "credit": "Daderot",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v37"
  },
  {
    "file": "Comptonia_peregrina.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v37"
  },
  {
    "file": "Salix_discolor_kz1.jpg",
    "author": "Krzysztof Ziarnek, Kenraiz",
    "credit": "Krzysztof Ziarnek, Kenraiz",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v37"
  },
  {
    "file": "Salix_discolor(01).jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v37"
  },
  {
    "file": "S_discolor_female_flowers_01.JPG",
    "author": "USDA / Wikimedia Commons",
    "credit": "USDA / Wikimedia Commons",
    "license": "Public domain — United States",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v38"
  },
  {
    "file": "Gaultheria-procumbens-habit.JPG",
    "author": "Dcrjsr",
    "credit": "Dcrjsr",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v38"
  },
  {
    "file": "Gaultheria_procumbens.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v38"
  },
  {
    "file": "FountainSpringsWintergreen.png",
    "author": "USGS / Wikimedia Commons",
    "credit": "USGS / Wikimedia Commons",
    "license": "Public domain — United States",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v38"
  },
  {
    "file": "Achillea_millefolium_habito.jpg",
    "author": "Bff",
    "credit": "Bff",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v38"
  },
  {
    "file": "Achillea_millefolium_vallee-de-grace-amiens_80_22062007_1.jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v39"
  },
  {
    "file": "Achillea_millefolium_4.jpg",
    "author": "Isidre blanc",
    "credit": "Isidre blanc",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v39"
  },
  {
    "file": "Oenothera_biennis,_Vic-la-Gardiole_01.jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v39"
  },
  {
    "file": "Oenothera_biennis_Rosette.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v39"
  },
  {
    "file": "Oenothera_biennis002.jpg",
    "author": "Rasbak",
    "credit": "Rasbak",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v39"
  },
  {
    "file": "2013-08-26_11_30_57_Jewelweed_in_the_shade_along_the_shore_of_the_pond_below_the_Mercer_Lake_Dam_in_Mercer_County_Park.jpg",
    "author": "Famartin",
    "credit": "Famartin",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v40"
  },
  {
    "file": "Orange_jewelweed_(Whitefish_Island)_2.JPG",
    "author": "P199 / Wikimedia Commons",
    "credit": "P199 / Wikimedia Commons",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v40"
  },
  {
    "file": "Orange_Balsam_or_Jewelweed_(Impatiens_capensis)_-_geograph.org.uk_-_950225.jpg",
    "author": "Robert Flogaus-Faust",
    "credit": "Robert Flogaus-Faust",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Geograph",
    "creditSource": "credits-enrichment-v40"
  },
  {
    "file": "Ledum_groenlandicum_2-eheep_(5097487541).jpg",
    "author": "eheep",
    "credit": "eheep",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v40"
  },
  {
    "file": "Bog_Labrador-tea_(Orphan_Lk).JPG",
    "author": "P199 / Wikimedia Commons",
    "credit": "P199 / Wikimedia Commons",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v40"
  },
  {
    "file": "Bog_Labrador_Tea_(3816426668).jpg",
    "author": "Joshua Mayer",
    "credit": "Joshua Mayer",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v41"
  },
  {
    "file": "Betula_papyrifera-bark.jpg",
    "author": "Nicholas A. Tonelli",
    "credit": "Nicholas A. Tonelli",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v41"
  },
  {
    "file": "Arctium_lappa_burdock.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v41"
  },
  {
    "file": "Arctium_lappa_003.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v41"
  },
  {
    "file": "Typha_latifolia_01_by_Line1.jpg",
    "author": "Line1",
    "credit": "Line1",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v41"
  },
  {
    "file": "Stellaria_media_flowers.jpg",
    "author": "AnRo0002",
    "credit": "AnRo0002",
    "license": "CC0 1.0 Universal Public Domain Dedication",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v42"
  },
  {
    "file": "Acorus_calamus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v42"
  },
  {
    "file": "Comptonia_peregrina_Kalmia_latifolia_BotGardBln0906Leaves.JPG",
    "author": "Daderot",
    "credit": "Daderot",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v42"
  },
  {
    "file": "Salix_discolor_catkins.jpg",
    "author": "Cephas",
    "credit": "Cephas",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v42"
  },
  {
    "file": "Gaultheria_procumbens_fruits.JPG",
    "author": "Dcrjsr",
    "credit": "Dcrjsr",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v42"
  },
  {
    "file": "Vaccinium_angustifolium_112508547.jpg",
    "author": "David Handley",
    "credit": "David Handley",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "Wikimedia Commons / iNaturalist",
    "creditSource": "credits-enrichment-v43"
  },
  {
    "file": "Vaccinium_angustifolium_berries.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v43"
  },
  {
    "file": "Amelanchier_laevis_flowers.jpg",
    "author": "Plant Image Library",
    "credit": "Plant Image Library",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v43"
  },
  {
    "file": "Amelanchier_laevis_fruit.jpg",
    "author": "Plant Image Library",
    "credit": "Plant Image Library",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v43"
  },
  {
    "file": "Sambucus_canadensis_berries.jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v43"
  },
  {
    "file": "Sambucus_canadensis_flowers.jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v44"
  },
  {
    "file": "Sambucus_canadensis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v44"
  },
  {
    "file": "Rhus_typhina_berries.jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v44"
  },
  {
    "file": "Rhus_typhina_HabitusFruit_BotGardBln0906.JPG",
    "author": "Daderot",
    "credit": "Daderot",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v44"
  },
  {
    "file": "Rubus_parviflorus_fruit.jpg",
    "author": "Walter Siegmund",
    "credit": "Walter Siegmund",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v44"
  },
  {
    "file": "Allium_tricoccum_BW-1979-0521-0532.jpg",
    "author": "James L. Reveal",
    "credit": "James L. Reveal",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v45"
  },
  {
    "file": "Allium_tricoccum_002.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v45"
  },
  {
    "file": "Wild_leeks.jpg",
    "author": "Rachael Brugger",
    "credit": "Rachael Brugger",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v45"
  },
  {
    "file": "Alliaria_petiolata_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v45"
  },
  {
    "file": "Alliaria_petiolata_flowers.jpg",
    "author": "Sannse",
    "credit": "Sannse",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v45"
  },
  {
    "file": "Vitis_riparia_(fruit).jpg",
    "author": "Matt Lavin",
    "credit": "Matt Lavin",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "Wikimedia Commons / Flickr",
    "creditSource": "credits-enrichment-v46"
  },
  {
    "file": "Vitis_riparia_leaves.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v46"
  },
  {
    "file": "Crataegus_punctata_fruit.jpg",
    "author": "Keith Kanoti",
    "credit": "Keith Kanoti",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v46"
  },
  {
    "file": "Crataegus_crus-galli_fruit.jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v46"
  },
  {
    "file": "Quercus_rubra_acorns.jpg",
    "author": "Dcrjsr",
    "credit": "Dcrjsr",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v46"
  },
  {
    "file": "Quercus_alba_acorns.jpg",
    "author": "Bruce Marlin",
    "credit": "Bruce Marlin",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v47"
  },
  {
    "file": "Acer_saccharum_leaves.jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v47"
  },
  {
    "file": "Acer_saccharum_sap_bucket.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v47"
  },
  {
    "file": "Picea_glauca_cones.jpg",
    "author": "USDA / Wikimedia Commons",
    "credit": "USDA / Wikimedia Commons",
    "license": "Public domain — United States",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v47"
  },
  {
    "file": "Picea_mariana_cones.jpg",
    "author": "USDA / Wikimedia Commons",
    "credit": "USDA / Wikimedia Commons",
    "license": "Public domain — United States",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v47"
  },
  {
    "file": "Tsuga_canadensis_branch.jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v48"
  },
  {
    "file": "Tsuga_canadensis_cones.jpg",
    "author": "Dcrjsr",
    "credit": "Dcrjsr",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v48"
  },
  {
    "file": "Tsuga_canadensis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v48"
  },
  {
    "file": "Juniperus_communis_berries.jpg",
    "author": "MPF",
    "credit": "MPF",
    "license": "CC BY-SA 3.0 / GFDL",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v48"
  },
  {
    "file": "Juniperus_communis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v48"
  },
  {
    "file": "Plantago_major_Sturm39.jpg",
    "author": "Johann Georg Sturm",
    "credit": "Johann Georg Sturm",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v49"
  },
  {
    "file": "Plantago_major_2005.06.19_11.31.24.jpg",
    "author": "Rasbak",
    "credit": "Rasbak",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v49"
  },
  {
    "file": "Chenopodium_album_Sturm39.jpg",
    "author": "Johann Georg Sturm",
    "credit": "Johann Georg Sturm",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v49"
  },
  {
    "file": "Chenopodium_album_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v49"
  },
  {
    "file": "Portulaca_oleracea_Sturm39.jpg",
    "author": "Johann Georg Sturm",
    "credit": "Johann Georg Sturm",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v49"
  },
  {
    "file": "Portulaca_oleracea_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v50"
  },
  {
    "file": "Daucus_carota_May_2008-1.jpg",
    "author": "Rasbak",
    "credit": "Rasbak",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v50"
  },
  {
    "file": "Daucus_carota_Sturm40.jpg",
    "author": "Johann Georg Sturm",
    "credit": "Johann Georg Sturm",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v50"
  },
  {
    "file": "Osmorhiza_claytonii_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v50"
  },
  {
    "file": "Osmorhiza_claytonii_flowers.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v50"
  },
  {
    "file": "Cardamine_diphylla_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v51"
  },
  {
    "file": "Cardamine_diphylla_flowers.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v51"
  },
  {
    "file": "Asarum_canadense_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v51"
  },
  {
    "file": "Asarum_canadense_flower.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v51"
  },
  {
    "file": "Nuphar_variegata.jpg",
    "author": "Superior National Forest / USDA",
    "credit": "Superior National Forest / USDA",
    "license": "Public domain — United States",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v51"
  },
  {
    "file": "Fragaria_virginiana_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v52"
  },
  {
    "file": "Fragaria_virginiana_fruit.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v52"
  },
  {
    "file": "Rubus_occidentalis_fruit.jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v52"
  },
  {
    "file": "Rubus_idaeus_fruit.jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v52"
  },
  {
    "file": "Rubus_allegheniensis_fruit.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v52"
  },
  {
    "file": "Arctostaphylos_uva-ursi_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v53"
  },
  {
    "file": "Arctostaphylos_uva-ursi_berries.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v53"
  },
  {
    "file": "Arctostaphylos_uva-ursi_kz01.jpg",
    "author": "Krzysztof Ziarnek, Kenraiz",
    "credit": "Krzysztof Ziarnek, Kenraiz",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v53"
  },
  {
    "file": "Berberis_vulgaris_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v53"
  },
  {
    "file": "Berberis_thunbergii_fruits.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v53"
  },
  {
    "file": "Monarda_fistulosa_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v54"
  },
  {
    "file": "Monarda_fistulosa_flowers.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v54"
  },
  {
    "file": "Monarda_fistulosa,_flower.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v54"
  },
  {
    "file": "Mentha_arvensis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v54"
  },
  {
    "file": "Mentha_canadensis.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v54"
  },
  {
    "file": "Angelica_atropurpurea_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v55"
  },
  {
    "file": "Angelica_atropurpurea.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v55"
  },
  {
    "file": "Conium_maculatum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v55"
  },
  {
    "file": "Cicuta_maculata_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v55"
  },
  {
    "file": "Osmorhiza_longistylis.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v55"
  },
  {
    "file": "Hemerocallis_fulva_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v56"
  },
  {
    "file": "Hemerocallis_fulva_flower.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v56"
  },
  {
    "file": "Hemerocallis_fulva_BotGardBln07122011A.jpg",
    "author": "Daderot",
    "credit": "Daderot",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v56"
  },
  {
    "file": "Urtica_dioica_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v56"
  },
  {
    "file": "Urtica_dioica_stinging_hairs.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v56"
  },
  {
    "file": "Nuphar_lutea_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v57"
  },
  {
    "file": "Nuphar_variegata_flower.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v57"
  },
  {
    "file": "Sagittaria_latifolia_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v57"
  },
  {
    "file": "Sagittaria_latifolia_flowers.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v57"
  },
  {
    "file": "Typha_angustifolia_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v57"
  },
  {
    "file": "Corylus_americana_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v58"
  },
  {
    "file": "Corylus_americana_nuts.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v58"
  },
  {
    "file": "Juglans_nigra_fruit.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v58"
  },
  {
    "file": "Juglans_cinerea_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v58"
  },
  {
    "file": "Prunus_pensylvanica_fruit.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v58"
  },
  {
    "file": "Prunus_virginiana_fruit.jpg",
    "author": "USDA / Wikimedia Commons",
    "credit": "USDA / Wikimedia Commons",
    "license": "Public domain — United States",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v59"
  },
  {
    "file": "Prunus_serotina_fruit.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v59"
  },
  {
    "file": "Asimina_triloba_fruit.jpg",
    "author": "Daderot",
    "credit": "Daderot",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v59"
  },
  {
    "file": "Asimina_triloba_flower.jpg",
    "author": "Daderot",
    "credit": "Daderot",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v59"
  },
  {
    "file": "Diospyros_virginiana_fruit.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v59"
  },
  {
    "file": "Apios_americana_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v60"
  },
  {
    "file": "Apios_americana_tubers.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v60"
  },
  {
    "file": "Helianthus_tuberosus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v60"
  },
  {
    "file": "Helianthus_tuberosus_tubers.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v60"
  },
  {
    "file": "Matteuccia_struthiopteris_fiddleheads.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v60"
  },
  {
    "file": "Matteuccia_struthiopteris_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v61"
  },
  {
    "file": "Claytonia_virginica_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v61"
  },
  {
    "file": "Claytonia_caroliniana.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v61"
  },
  {
    "file": "Erythronium_americanum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v61"
  },
  {
    "file": "Erythronium_americanum_flower.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v61"
  },
  {
    "file": "Hericium_erinaceus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v62"
  },
  {
    "file": "Hericium_americanum_135426.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v62"
  },
  {
    "file": "Laetiporus_sulphureus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v62"
  },
  {
    "file": "Laetiporus_cincinnatus_26074.jpg",
    "author": "Dan Molter (shroomydan)",
    "credit": "Dan Molter (shroomydan)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v62"
  },
  {
    "file": "Coprinus_comatus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v62"
  },
  {
    "file": "Agaricus_arvensis_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v63"
  },
  {
    "file": "Agaricus_silvaticus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v63"
  },
  {
    "file": "Agaricus_augustus_2008_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v63"
  },
  {
    "file": "Agaricus_bisporus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v63"
  },
  {
    "file": "Agaricus_subrufescens_2012_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v63"
  },
  {
    "file": "Coprinus_comatus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v64"
  },
  {
    "file": "Coprinus_comatus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v64"
  },
  {
    "file": "Coprinellus_micaceus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v64"
  },
  {
    "file": "Coprinopsis_atramentaria_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v64"
  },
  {
    "file": "Coprinellus_disseminatus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v64"
  },
  {
    "file": "Russula_brevipes_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v65"
  },
  {
    "file": "Russula_brevipes_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v65"
  },
  {
    "file": "Russula_parvovirescens_361585.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v65"
  },
  {
    "file": "Lactifluus_volemus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v65"
  },
  {
    "file": "Lactarius_corrugis_102781.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v65"
  },
  {
    "file": "Cantharellus_lateritius_120774.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v66"
  },
  {
    "file": "Cantharellus_lateritius_240835.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v66"
  },
  {
    "file": "Craterellus_tubaeformis_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v66"
  },
  {
    "file": "Craterellus_cornucopioides_2008_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v66"
  },
  {
    "file": "Craterellus_ignicolor_101462.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v66"
  },
  {
    "file": "Fomes_fomentarius_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v67"
  },
  {
    "file": "Fomitopsis_betulina_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v67"
  },
  {
    "file": "Trametes_versicolor_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v67"
  },
  {
    "file": "Ganoderma_lucidum_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v67"
  },
  {
    "file": "Ganoderma_sessile_438185.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v67"
  },
  {
    "file": "Hericium_coralloides_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v68"
  },
  {
    "file": "Hericium_coralloides_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v68"
  },
  {
    "file": "Hericium_abietis_66627.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v68"
  },
  {
    "file": "Ramaria_stricta_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v68"
  },
  {
    "file": "Sparassis_spathulata_101065.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v68"
  },
  {
    "file": "Morchella_septentrionalis_344833.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v69"
  },
  {
    "file": "Morchella_angusticeps_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v69"
  },
  {
    "file": "Verpa_bohemica_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v69"
  },
  {
    "file": "Gyromitra_esculenta_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v69"
  },
  {
    "file": "Gyromitra_korfi_301501.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v69"
  },
  {
    "file": "Boletus_edulis_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v70"
  },
  {
    "file": "Boletus_subcaerulescens_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v70"
  },
  {
    "file": "Aureoboletus_projectellus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v70"
  },
  {
    "file": "Tylopilus_badiceps_143807.jpg",
    "author": "Martin Livezey (MLivezey)",
    "credit": "Martin Livezey (MLivezey)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v70"
  },
  {
    "file": "Tylopilus_chromapes_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v70"
  },
  {
    "file": "Suillus_americanus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v71"
  },
  {
    "file": "Suillus_spraguei_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v71"
  },
  {
    "file": "Suillus_granulatus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v71"
  },
  {
    "file": "Leccinum_insigne_50820.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v71"
  },
  {
    "file": "Leccinum_aurantiacum_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v71"
  },
  {
    "file": "Pleurotus_dryinus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v72"
  },
  {
    "file": "Pleurotus_ostreatus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v72"
  },
  {
    "file": "Panellus_stipticus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v72"
  },
  {
    "file": "Flammulina_velutipes_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v72"
  },
  {
    "file": "Hypsizygus_ulmarius_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v72"
  },
  {
    "file": "Boletus_chippewaensis_448604.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v73"
  },
  {
    "file": "Boletus_subglabripes_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v73"
  },
  {
    "file": "Hemileccinum_subglabripes_331619.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v73"
  },
  {
    "file": "Imleria_badia_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v73"
  },
  {
    "file": "Xerocomellus_chrysenteron_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v73"
  },
  {
    "file": "Suillus_pictus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v74"
  },
  {
    "file": "Suillus_punctipes_330177.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v74"
  },
  {
    "file": "Suillus_hirtellus_238445.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v74"
  },
  {
    "file": "Suillus_weaverae_433264.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v74"
  },
  {
    "file": "Suillus_salmonicolor_47452.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v74"
  },
  {
    "file": "Leccinum_pseudoinsigne_477925.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v75"
  },
  {
    "file": "Leccinum_snavelyi_637474.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v75"
  },
  {
    "file": "Leccinum_subglabripes_452940.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v75"
  },
  {
    "file": "Leccinum_variicolor_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v75"
  },
  {
    "file": "Leccinum_versipelle_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v75"
  },
  {
    "file": "Macrolepiota_procera_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v76"
  },
  {
    "file": "Chlorophyllum_rhacodes_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v76"
  },
  {
    "file": "Chlorophyllum_molybdites_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v76"
  },
  {
    "file": "Leucoagaricus_americanus_112750.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v76"
  },
  {
    "file": "Leucoagaricus_leucothites_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v76"
  },
  {
    "file": "Amanita_bisporigera_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v77"
  },
  {
    "file": "Amanita_phalloides_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v77"
  },
  {
    "file": "Amanita_brunnescens_119022.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v77"
  },
  {
    "file": "Amanita_flavoconia_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v77"
  },
  {
    "file": "Amanita_rubescens_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v77"
  },
  {
    "file": "Galerina_marginata_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v78"
  },
  {
    "file": "Galerina_marginata_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v78"
  },
  {
    "file": "Omphalotus_illudens_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v78"
  },
  {
    "file": "Jack-o-lantern_mushroom.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v78"
  },
  {
    "file": "Entoloma_abortivum_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v78"
  },
  {
    "file": "Auricularia_auricula-judae_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v79"
  },
  {
    "file": "Tremella_mesenterica_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v79"
  },
  {
    "file": "Dacrymyces_chrysospermus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v79"
  },
  {
    "file": "Pseudohydnum_gelatinosum_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v79"
  },
  {
    "file": "Exidia_recisa_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v79"
  },
  {
    "file": "Calvatia_cyathiformis_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v80"
  },
  {
    "file": "Calvatia_craniiformis_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v80"
  },
  {
    "file": "Lycoperdon_perlatum_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v80"
  },
  {
    "file": "Scleroderma_citrinum_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v80"
  },
  {
    "file": "Apioperdon_pyriforme_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v80"
  },
  {
    "file": "Picea_rubens_cones.jpg",
    "author": "USDA / Wikimedia Commons",
    "credit": "USDA / Wikimedia Commons",
    "license": "Public domain — United States",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v81"
  },
  {
    "file": "Picea_glauca_needles.jpg",
    "author": "USDA / Wikimedia Commons",
    "credit": "USDA / Wikimedia Commons",
    "license": "Public domain — United States",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v81"
  },
  {
    "file": "Abies_balsamea_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v81"
  },
  {
    "file": "Abies_balsamea_cones.jpg",
    "author": "USDA / Wikimedia Commons",
    "credit": "USDA / Wikimedia Commons",
    "license": "Public domain — United States",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags/Country-specific_tags#United_States",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v81"
  },
  {
    "file": "Pinus_resin.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v81"
  },
  {
    "file": "Taraxacum_officinale_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v82"
  },
  {
    "file": "Taraxacum_officinale_seed_head.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v82"
  },
  {
    "file": "Artemisia_vulgaris_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v82"
  },
  {
    "file": "Achillea_millefolium_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v82"
  },
  {
    "file": "Rumex_crispus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v82"
  },
  {
    "file": "Trillium_grandiflorum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v83"
  },
  {
    "file": "Trillium_erectum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v83"
  },
  {
    "file": "Sanguinaria_canadensis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v83"
  },
  {
    "file": "Podophyllum_peltatum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v83"
  },
  {
    "file": "Maianthemum_canadense_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v83"
  },
  {
    "file": "Tussilago_farfara_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v84"
  },
  {
    "file": "Cichorium_intybus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v84"
  },
  {
    "file": "Cichorium_intybus_flowers.jpg",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v84"
  },
  {
    "file": "Plantago_lanceolata_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v84"
  },
  {
    "file": "Rumex_obtusifolius_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v84"
  },
  {
    "file": "Morus_rubra_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v85"
  },
  {
    "file": "Morus_rubra_fruit.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v85"
  },
  {
    "file": "Ribes_americanum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v85"
  },
  {
    "file": "Ribes_hirtellum_fruit.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v85"
  },
  {
    "file": "Viburnum_trilobum_fruit.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v85"
  },
  {
    "file": "Viburnum_lentago_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v86"
  },
  {
    "file": "Cornus_sericea_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v86"
  },
  {
    "file": "Cornus_racemosa_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v86"
  },
  {
    "file": "Elaeagnus_umbellata_fruit.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v86"
  },
  {
    "file": "Shepherdia_canadensis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v86"
  },
  {
    "file": "Clitocybe_nuda_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v87"
  },
  {
    "file": "Lepista_personata_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v87"
  },
  {
    "file": "Laccaria_laccata_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v87"
  },
  {
    "file": "Laccaria_ochropurpurea_259891.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v87"
  },
  {
    "file": "Marasmius_oreades_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v87"
  },
  {
    "file": "Hygrophorus_russula_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v88"
  },
  {
    "file": "Hygrophorus_eburneus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v88"
  },
  {
    "file": "Hygrocybe_conica_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v88"
  },
  {
    "file": "Hygrocybe_coccinea_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v88"
  },
  {
    "file": "Gliophorus_laetus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v88"
  },
  {
    "file": "Armillaria_gallica_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v89"
  },
  {
    "file": "Armillaria_tabescens_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v89"
  },
  {
    "file": "Armillaria_ostoyae_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v89"
  },
  {
    "file": "Armillaria_solidipes_141333.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v89"
  },
  {
    "file": "Armillaria_mellea_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v89"
  },
  {
    "file": "Pholiota_squarrosa_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v90"
  },
  {
    "file": "Pholiota_adiposa_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v90"
  },
  {
    "file": "Gymnopilus_junonius_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v90"
  },
  {
    "file": "Hypholoma_lateritium_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v90"
  },
  {
    "file": "Hypholoma_fasciculare_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v90"
  },
  {
    "file": "Tricholoma_magnivelare_100899.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v91"
  },
  {
    "file": "Tricholoma_equestre_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v91"
  },
  {
    "file": "Tricholomopsis_rutilans_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v91"
  },
  {
    "file": "Melanoleuca_melaleuca_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v91"
  },
  {
    "file": "Collybia_dryophila_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v91"
  },
  {
    "file": "Cerioporus_squamosus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v92"
  },
  {
    "file": "Polyporus_squamosus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v92"
  },
  {
    "file": "Meripilus_sumstinei_159037.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v92"
  },
  {
    "file": "Bondarzewia_berkeleyi_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v92"
  },
  {
    "file": "Ischnoderma_resinosum_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v92"
  },
  {
    "file": "Daedalea_quercina_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v93"
  },
  {
    "file": "Daedaleopsis_confragosa_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v93"
  },
  {
    "file": "Bjerkandera_adusta_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v93"
  },
  {
    "file": "Stereum_hirsutum_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v93"
  },
  {
    "file": "Schizophyllum_commune_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v93"
  },
  {
    "file": "Clavulina_cristata_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v94"
  },
  {
    "file": "Clavariadelphus_truncatus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v94"
  },
  {
    "file": "Artomyces_pyxidatus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v94"
  },
  {
    "file": "Hydnellum_peckii_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v94"
  },
  {
    "file": "Sarcodon_imbricatus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v94"
  },
  {
    "file": "Sarcoscypha_coccinea_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v95"
  },
  {
    "file": "Peziza_repanda_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v95"
  },
  {
    "file": "Helvella_lacunosa_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v95"
  },
  {
    "file": "Xylaria_polymorpha_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v95"
  },
  {
    "file": "Xylaria_hypoxylon_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v95"
  },
  {
    "file": "Echinacea_purpurea_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v96"
  },
  {
    "file": "Solidago_canadensis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v96"
  },
  {
    "file": "Solidago_gigantea_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v96"
  },
  {
    "file": "Verbascum_thapsus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v96"
  },
  {
    "file": "Althaea_officinalis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v96"
  },
  {
    "file": "Aralia_nudicaulis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v97"
  },
  {
    "file": "Aralia_racemosa_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v97"
  },
  {
    "file": "Panax_quinquefolius_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v97"
  },
  {
    "file": "Actaea_racemosa_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v97"
  },
  {
    "file": "Hydrastis_canadensis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v97"
  },
  {
    "file": "Populus_tremuloides_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v98"
  },
  {
    "file": "Populus_grandidentata_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v98"
  },
  {
    "file": "Alnus_incana_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v98"
  },
  {
    "file": "Betula_alleghaniensis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v98"
  },
  {
    "file": "Fagus_grandifolia_fruit.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v98"
  },
  {
    "file": "Viola_sororia_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v99"
  },
  {
    "file": "Viola_pubescens_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v99"
  },
  {
    "file": "Oxalis_stricta_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v99"
  },
  {
    "file": "Oxalis_montana_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v99"
  },
  {
    "file": "Claytonia_perfoliata_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v99"
  },
  {
    "file": "Typha_latifolia_002.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v100"
  },
  {
    "file": "Typha_latifolia_female_inflorescence.jpg",
    "author": "Wikimedia Commons contributor",
    "credit": "Wikimedia Commons contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v100"
  },
  {
    "file": "Phragmites_australis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v100"
  },
  {
    "file": "Schoenoplectus_acutus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v100"
  },
  {
    "file": "Sparganium_eurycarpum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v100"
  },
  {
    "file": "Cortinarius_iodes_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v101"
  },
  {
    "file": "Cortinarius_caperatus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v101"
  },
  {
    "file": "Cortinarius_violaceus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v101"
  },
  {
    "file": "Inocybe_geophylla_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v101"
  },
  {
    "file": "Clitocybe_dealbata_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v101"
  },
  {
    "file": "Lycoperdon_molle_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v102"
  },
  {
    "file": "Bovista_plumbea_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v102"
  },
  {
    "file": "Geastrum_triplex_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v102"
  },
  {
    "file": "Mutinus_elegans_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v102"
  },
  {
    "file": "Phallus_ravenelii_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v102"
  },
  {
    "file": "Galium_aparine_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v103"
  },
  {
    "file": "Galium_triflorum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v103"
  },
  {
    "file": "Geum_canadense_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v103"
  },
  {
    "file": "Geum_macrophyllum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v103"
  },
  {
    "file": "Agrimonia_gryposepala_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v103"
  },
  {
    "file": "Hypericum_perforatum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v104"
  },
  {
    "file": "Hypericum_punctatum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v104"
  },
  {
    "file": "Lobelia_inflata_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v104"
  },
  {
    "file": "Prunella_vulgaris_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v104"
  },
  {
    "file": "Scutellaria_lateriflora_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v104"
  },
  {
    "file": "Smilax_herbacea_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v105"
  },
  {
    "file": "Smilax_rotundifolia_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v105"
  },
  {
    "file": "Dioscorea_villosa_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v105"
  },
  {
    "file": "Arisaema_triphyllum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v105"
  },
  {
    "file": "Symplocarpus_foetidus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v105"
  },
  {
    "file": "Vaccinium_myrtilloides_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v106"
  },
  {
    "file": "Vaccinium_corymbosum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v106"
  },
  {
    "file": "Vaccinium_oxycoccos_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v106"
  },
  {
    "file": "Gaylussacia_baccata_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v106"
  },
  {
    "file": "Gaultheria_hispidula_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v106"
  },
  {
    "file": "Mycena_haematopus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v107"
  },
  {
    "file": "Mycena_galericulata_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v107"
  },
  {
    "file": "Mycena_leaiana_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v107"
  },
  {
    "file": "Pluteus_cervinus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v107"
  },
  {
    "file": "Volvariella_bombycina_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v107"
  },
  {
    "file": "Clitopilus_prunulus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v108"
  },
  {
    "file": "Entoloma_rhodopolium_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v108"
  },
  {
    "file": "Entoloma_sinuatum_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v108"
  },
  {
    "file": "Entoloma_lividum_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v108"
  },
  {
    "file": "Entoloma_incarnatofuscescens_384934.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v108"
  },
  {
    "file": "Phaeolus_schweinitzii_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v109"
  },
  {
    "file": "Laetiporus_gilbertsonii_194998.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v109"
  },
  {
    "file": "Laetiporus_conifericola_304860.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v109"
  },
  {
    "file": "Piptoporus_betulinus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v109"
  },
  {
    "file": "Fomitopsis_pinicola_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v109"
  },
  {
    "file": "Lysurus_cruciatus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v110"
  },
  {
    "file": "Clathrus_ruber_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v110"
  },
  {
    "file": "Dictyophora_ravenelii_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v110"
  },
  {
    "file": "Geastrum_saccatum_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v110"
  },
  {
    "file": "Astraeus_hygrometricus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v110"
  },
  {
    "file": "Reynoutria_japonica_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v111"
  },
  {
    "file": "Fallopia_japonica_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v111"
  },
  {
    "file": "Hesperis_matronalis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v111"
  },
  {
    "file": "Bunias_orientalis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v111"
  },
  {
    "file": "Barbarea_vulgaris_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v111"
  },
  {
    "file": "Sorbus_americana_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v112"
  },
  {
    "file": "Sorbus_decora_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v112"
  },
  {
    "file": "Amelanchier_arborea_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v112"
  },
  {
    "file": "Amelanchier_canadensis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v112"
  },
  {
    "file": "Celtis_occidentalis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v112"
  },
  {
    "file": "Eupatorium_perfoliatum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v113"
  },
  {
    "file": "Eutrochium_purpureum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v113"
  },
  {
    "file": "Eupatorium_maculatum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v113"
  },
  {
    "file": "Pycnanthemum_virginianum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v113"
  },
  {
    "file": "Pycnanthemum_tenuifolium_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v113"
  },
  {
    "file": "Alisma_plantago-aquatica_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v114"
  },
  {
    "file": "Pontederia_cordata_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v114"
  },
  {
    "file": "Menyanthes_trifoliata_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v114"
  },
  {
    "file": "Decodon_verticillatus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v114"
  },
  {
    "file": "Sium_suave_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v114"
  },
  {
    "file": "Carya_ovata_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v115"
  },
  {
    "file": "Carya_cordiformis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v115"
  },
  {
    "file": "Quercus_macrocarpa_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v115"
  },
  {
    "file": "Quercus_velutina_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v115"
  },
  {
    "file": "Tilia_americana_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v115"
  },
  {
    "file": "Rubus_pubescens_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v116"
  },
  {
    "file": "Rubus_strigosus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v116"
  },
  {
    "file": "Rubus_flagellaris_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v116"
  },
  {
    "file": "Rubus_hispidus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v116"
  },
  {
    "file": "Rubus_odoratus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v116"
  },
  {
    "file": "Psathyrella_candolleana_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v117"
  },
  {
    "file": "Psathyrella_piluliformis_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v117"
  },
  {
    "file": "Agrocybe_praecox_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v117"
  },
  {
    "file": "Kuehneromyces_mutabilis_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v117"
  },
  {
    "file": "Stropharia_rugosoannulata_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v117"
  },
  {
    "file": "Marasmius_rotula_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v118"
  },
  {
    "file": "Marasmius_siccus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v118"
  },
  {
    "file": "Gymnopus_dryophilus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v118"
  },
  {
    "file": "Rhodocollybia_butyracea_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v118"
  },
  {
    "file": "Megacollybia_rodmanii_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v118"
  },
  {
    "file": "Mycetinis_scorodonius_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v119"
  },
  {
    "file": "Xeromphalina_campanella_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v119"
  },
  {
    "file": "Panellus_serotinus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v119"
  },
  {
    "file": "Lentinellus_ursinus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v119"
  },
  {
    "file": "Lentinellus_cochleatus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v119"
  },
  {
    "file": "Boletus_separans_35909.jpg",
    "author": "Dave in NE PA",
    "credit": "Dave in NE PA",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v120"
  },
  {
    "file": "Boletus_nobilis_473604.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v120"
  },
  {
    "file": "Xerocomus_subtomentosus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v120"
  },
  {
    "file": "Xerocomellus_zelleri_361526.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v120"
  },
  {
    "file": "Gyroporus_castaneus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v120"
  },
  {
    "file": "Lactarius_lignyotus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v121"
  },
  {
    "file": "Lactarius_deterrimus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v121"
  },
  {
    "file": "Lactarius_torminosus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v121"
  },
  {
    "file": "Russula_emetica_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v121"
  },
  {
    "file": "Russula_virescens_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v121"
  },
  {
    "file": "Grifola_frondosa_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v122"
  },
  {
    "file": "Polyporus_umbellatus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v122"
  },
  {
    "file": "Albatrellus_ovinus_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v122"
  },
  {
    "file": "Gomphus_clavatus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v122"
  },
  {
    "file": "Thelephora_terrestris_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v122"
  },
  {
    "file": "Symphyotrichum_novae-angliae_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v123"
  },
  {
    "file": "Symphyotrichum_lateriflorum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v123"
  },
  {
    "file": "Doellingeria_umbellata_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v123"
  },
  {
    "file": "Solidago_flexicaulis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v123"
  },
  {
    "file": "Solidago_graminifolia_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v123"
  },
  {
    "file": "Lycopus_uniflorus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v124"
  },
  {
    "file": "Lycopus_americanus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v124"
  },
  {
    "file": "Clinopodium_vulgare_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v124"
  },
  {
    "file": "Agastache_foeniculum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v124"
  },
  {
    "file": "Blephilia_hirsuta_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v124"
  },
  {
    "file": "Amaranthus_retroflexus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v125"
  },
  {
    "file": "Amaranthus_hybridus_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v125"
  },
  {
    "file": "Persicaria_maculosa_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v125"
  },
  {
    "file": "Persicaria_pensylvanica_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v125"
  },
  {
    "file": "Polygonum_aviculare_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v125"
  },
  {
    "file": "Mitchella_repens_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v126"
  },
  {
    "file": "Chimaphila_umbellata_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v126"
  },
  {
    "file": "Pyrola_americana_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v126"
  },
  {
    "file": "Moneses_uniflora_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v126"
  },
  {
    "file": "Orthilia_secunda_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v126"
  },
  {
    "file": "Hygrocybe_chlorophana_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v127"
  },
  {
    "file": "Hygrocybe_punicea_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v127"
  },
  {
    "file": "Hygrocybe_miniata_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v127"
  },
  {
    "file": "Cuphophyllus_pratensis_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v127"
  },
  {
    "file": "Cuphophyllus_virgineus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v127"
  },
  {
    "file": "Amanita_muscaria_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v128"
  },
  {
    "file": "Amanita_pantherina_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v128"
  },
  {
    "file": "Russula_fragilis_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v128"
  },
  {
    "file": "Russula_claroflava_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v128"
  },
  {
    "file": "Lactarius_rufus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v128"
  },
  {
    "file": "Boletus_pallidus_47673.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v129"
  },
  {
    "file": "Boletus_ornatipes_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v129"
  },
  {
    "file": "Caloboletus_calopus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v129"
  },
  {
    "file": "Boletus_sensibilis_384173.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v129"
  },
  {
    "file": "Lanmaoa_pseudosensibilis_584499.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v129"
  },
  {
    "file": "Morchella_importuna_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v130"
  },
  {
    "file": "Morchella_elata_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v130"
  },
  {
    "file": "Morchella_semilibera_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v130"
  },
  {
    "file": "Gyromitra_caroliniana_349864.jpg",
    "author": "Mushroom Observer contributor",
    "credit": "Mushroom Observer contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons / Mushroom Observer",
    "creditSource": "credits-enrichment-v130"
  },
  {
    "file": "Gyromitra_brunnea_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v130"
  },
  {
    "file": "Pleurotus_citrinopileatus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v131"
  },
  {
    "file": "Phyllotopsis_nidulans_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v131"
  },
  {
    "file": "Tapinella_atrotomentosa_2009_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v131"
  },
  {
    "file": "Panus_conchatus_2011_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v131"
  },
  {
    "file": "Lentinus_tigrinus_2010_G1.jpg",
    "author": "George Chernilevsky",
    "credit": "George Chernilevsky",
    "license": "Public domain — author released",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v131"
  },
  {
    "file": "Osmunda_regalis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v132"
  },
  {
    "file": "Onoclea_sensibilis_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v132"
  },
  {
    "file": "Dryopteris_intermedia_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v132"
  },
  {
    "file": "Equisetum_arvense_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v132"
  },
  {
    "file": "Lycopodium_clavatum_001.JPG",
    "author": "H. Zell",
    "credit": "H. Zell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "Wikimedia Commons",
    "creditSource": "credits-enrichment-v132"
  }
];

const DEFAULT_CREDIT_CARD_LIMIT = 260;
const SEARCH_CREDIT_CARD_LIMIT = 600;
const DEFAULT_AUDIT_CARD_LIMIT = 80;
const SEARCH_AUDIT_CARD_LIMIT = 300;

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

function inlinePair(label, value, missingLabel = "") {
  return `<span><strong>${esc(label)}:</strong> ${value ? esc(value) : `<em class="muted">${esc(missingLabel || label)} missing</em>`}</span>`;
}

function linkButton(entry, href, label) {
  return href ? `<a class="buttonish credit-link" href="${esc(href)}" target="_blank" rel="noreferrer">${esc(label)}</a>` : "";
}

function creditRow(entry) {
  const creditText = entry.credit && entry.credit !== entry.author
    ? `<div class="credit-note"><strong>Credit:</strong> ${esc(entry.credit)}</div>`
    : "";

  return `
    <article class="credit-card compact-credit-card">
      <h3>${esc(entry.species || entry.slug || "Untitled")}</h3>
      ${entry.scientific_name ? `<p class="muted small credit-sci"><em>${esc(entry.scientific_name)}</em></p>` : ""}
      <div class="credit-meta-line">
        ${inlinePair("Title", entry.title, "title")}
        ${inlinePair("Creator", entry.author, "creator")}
      </div>
      <div class="credit-meta-line">
        ${inlinePair("License", entry.license, "license")}
        ${inlinePair("Source", entry.source || "Image source")}
      </div>
      ${entry.creditSource ? `<div class="credit-meta-line credit-pass-line">${inlinePair("Pass", entry.creditSource)}</div>` : ""}
      ${creditText}
      <div class="credit-actions">
        ${linkButton(entry, entry.sourcePage, "Source page")}
        ${linkButton(entry, entry.licenseUrl, "License")}
        ${linkButton(entry, entry.sourceImage, "Image file")}
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
    <article class="credit-card compact-card compact-credit-card">
      <h3>${esc(record.display_name || record.common_name || record.slug || "Untitled")}</h3>
      ${record.scientific_name ? `<p class="muted small credit-sci"><em>${esc(record.scientific_name)}</em></p>` : ""}
      <div class="credit-meta-line">
        ${inlinePair("Status", status)}
        ${inlinePair("Images", String(imageCount))}
      </div>
      ${imageCount ? `<div class="credit-meta-line">${inlinePair("Missing creator", String(missingCreator))} ${inlinePair("Missing license", String(missingLicense))} ${inlinePair("Enriched", String(enriched))}</div>` : ""}
    </article>
  `;
}

function limitedList(list, hasSearch, defaultLimit, searchLimit) {
  const limit = hasSearch ? searchLimit : defaultLimit;
  return {
    visible: list.slice(0, limit),
    hiddenCount: Math.max(0, list.length - limit),
    limit
  };
}

function limitNotice(kind, hiddenCount, limit, hasSearch) {
  if (!hiddenCount) return "";
  return `
    <p class="muted small credit-limit-note">
      Showing first ${limit} ${esc(kind)} to keep this page responsive. ${hiddenCount} more match the current view.
      ${hasSearch ? "Narrow the search further to reduce the list." : "Use the Credits search/filter to narrow the list if you need a specific species or file."}
    </p>
  `;
}

function creditsPageStyle() {
  return `
    <style>
      .credits-page .credit-list{display:grid;gap:10px;}
      @media (min-width: 980px){
        .credits-page .credit-list.credit-list-compact{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;}
      }
      .credits-page .compact-credit-card{padding:10px 12px;}
      .credits-page .compact-credit-card h3{font-size:1rem;line-height:1.18;margin:0 0 2px;}
      .credits-page .credit-sci{margin:.05rem 0 .35rem;}
      .credits-page .credit-meta-line{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline;margin:3px 0;font-size:.86rem;line-height:1.25;}
      .credits-page .credit-meta-line span{min-width:0;max-width:100%;overflow-wrap:anywhere;}
      .credits-page .credit-pass-line{font-size:.78rem;}
      .credits-page .credit-note{font-size:.82rem;line-height:1.25;margin:4px 0;color:#536257;overflow-wrap:anywhere;}
      .credits-page .credit-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px;}
      .credits-page .credit-link{font-size:.78rem;padding:5px 8px;}
      .credits-page .credit-limit-note{margin-top:10px;}
      @media (max-width: 700px){
        .credits-page .credit-meta-line{font-size:.84rem;gap:3px 9px;}
        .credits-page .credit-actions{display:grid;grid-template-columns:minmax(0,1fr);}
        .credits-page .credit-link{width:100%;text-align:center;}
      }
    </style>
  `;
}

export function renderCreditsPage(records, imageCredits, search = "") {
  const q = String(search || "").trim().toLowerCase();
  const hasSearch = !!q;
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

  const creditWindow = limitedList(credits, hasSearch, DEFAULT_CREDIT_CARD_LIMIT, SEARCH_CREDIT_CARD_LIMIT);
  const catalogWindow = limitedList(catalog, hasSearch, DEFAULT_AUDIT_CARD_LIMIT, SEARCH_AUDIT_CARD_LIMIT);

  const totalImageRecords = recordEntries.length;
  const withCreator = recordEntries.filter((entry) => !!entry.author).length;
  const withLicense = recordEntries.filter((entry) => !!entry.license && !!entry.licenseUrl).length;
  const needsEnrichment = recordEntries.filter((entry) => !entry.author || !entry.license || !entry.licenseUrl).length;
  const enrichedCreditCount = recordEntries.filter((entry) => /^credits-enrichment-v\d+/.test(entry.creditSource || "")).length;
  const overrideCount = ENRICHED_CREDIT_OVERRIDES.size;

  return `
    ${creditsPageStyle()}
    <section class="credits-page">
      <section class="panel">
        <h2>Credits</h2>
        <p>This page reads image-credit fields directly from the loaded species records and from the controlled built-in enrichment table.</p>
        <p class="muted small">Desktop layout uses a two-column credit grid with compact inline metadata. The page also limits how many credit/audit cards render at once so the browser does not have to build a giant DOM every time the Credits tab opens. This build adds another support credit batch. Exact filename matches apply automatically when those Commons filenames appear in loaded records; support entries remain harmless until a matching filename is present.</p>
      </section>

      <section class="panel">
        <div class="grid-3">
          <div class="stat-card"><div class="num">${records.length}</div><div>Species in catalog</div></div>
          <div class="stat-card"><div class="num">${totalImageRecords}</div><div>Usable image records found</div></div>
          <div class="stat-card"><div class="num">${withCreator}</div><div>With creator / photographer</div></div>
          <div class="stat-card"><div class="num">${withLicense}</div><div>With license + link</div></div>
          <div class="stat-card"><div class="num">${enrichedCreditCount}</div><div>Matched by built-in credit passes</div></div>
          <div class="stat-card"><div class="num">${overrideCount}</div><div>Total built-in credit overrides</div></div>
          <div class="stat-card"><div class="num">0</div><div>Runtime Commons API calls</div></div>
        </div>
      </section>

      <section class="panel">
        <h3>Image credits</h3>
        ${limitNotice("image credits", creditWindow.hiddenCount, creditWindow.limit, hasSearch)}
        ${creditWindow.visible.length ? `<section class="credit-list credit-list-compact">${creditWindow.visible.map(creditRow).join("")}</section>` : `<p class="muted">No matching image credit records found.</p>`}
      </section>

      <section class="panel">
        <h3>Species image-credit audit</h3>
        ${limitNotice("species audit cards", catalogWindow.hiddenCount, catalogWindow.limit, hasSearch)}
        <section class="credit-list credit-list-compact">${catalogWindow.visible.map(catalogRow).join("")}</section>
      </section>
    </section>
  `;
}
