{
  "metadata": {
    "project": "Upper Michigan Foraging Guide",
    "build": "v4.2.80-r2026-04-29-mushroom-core-credibility1",
    "primary_type": "mushroom",
    "split_version": "mushroom-data-split-v1",
    "split_file": "data/mushrooms.json",
    "split_role": "Core/restored baseline mushroom records kept at the original path.",
    "source_mushrooms_build": "pre-split uploaded mushrooms baseline",
    "source_record_count_before_split": 209,
    "record_count": 54,
    "notes": "Core/restored mushroom records retained at the original mushrooms.json path. Expanded mushroom records now load from smaller grouped files listed in split_manifest. v4.2.80 adds a core mushroom credibility pass: source links, use roles, foraging values, card notes, and cleaned placeholder use text for high-visibility mushrooms.",
    "split_manifest": [
      {
        "path": "data/mushrooms.json",
        "record_count": 55,
        "role": "Core/restored baseline mushroom records kept at the original path."
      },
      {
        "path": "data/mushrooms/mushrooms-boletes-porcini-tylopilus.json",
        "record_count": 41,
        "role": "Expanded porcini, Tylopilus, dark-pored, and brown bolete records."
      },
      {
        "path": "data/mushrooms/mushrooms-boletes-red-caution.json",
        "record_count": 39,
        "role": "Expanded red/yellow, blue-staining, red-pored, and caution-lane bolete records."
      },
      {
        "path": "data/mushrooms/mushrooms-boletes-suillus-leccinum.json",
        "record_count": 50,
        "role": "Expanded Suillus and Leccinum/scaber-stalk bolete records."
      },
      {
        "path": "data/mushrooms/mushrooms-boletes-other.json",
        "record_count": 24,
        "role": "Expanded long-stemmed, peppery, gilled-bolete, wood-inhabiting, and oddball bolete records."
      }
    ],
    "last_review_reason_audit": "v4.2.69-r2026-04-28-needs-review-reasons1",
    "review_reason_audit": {
      "audited_on": "2026-04-28",
      "rule": "Normalize explicit review signals into review_reasons/review_note and prefix notes for Needs Review list visibility.",
      "review_records_in_file": 8,
      "cleared_image_only_slugs_not_reopened": [
        "slippery-jack"
      ]
    },
    "last_duplicate_cleanup": "v4.2.70-r2026-04-29-slippery-jack-merge1"
  },
  "records": [
    {
      "slug": "artist-s-conk",
      "display_name": "Artist's conk",
      "common_name": "Artist's conk",
      "category": "Mushroom",
      "notes": "Hard woody bracket fungus with a white pore surface that bruises brown and can be scratched for drawing.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      "links": [
        "https://www.mushroomexpert.com/fungionwood/poroid%20fungi/species%20pages/Ganoderma%20applanatum.htm"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ganoderma%20applanatum%201259894.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ganoderma%20applanatum%20%28Ganodermataceae%29.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Artists%20conk-Ganoderma%20applanatum%20%287402107040%29.jpg"
      ],
      "medicinal_uses": "Traditional/reishi-adjacent interest exists in some sources, but this app treats it mainly as a non-food identification and practical-use species.",
      "culinary_uses": "Not a food mushroom; woody, perennial bracket.",
      "non_edible_severity": "Inedible",
      "edibility_detail": "Avoid for food in this guide; keep as an identification/caution record.",
      "general_notes": "Best treated as a shelf fungus ID entry rather than a food species.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Common",
      "food_quality": "Not recommended",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "food_role": "avoid",
      "look_alikes": [
        "tinder-conk-hoof-fungus",
        "birch-polypore"
      ],
      "confused_with": [
        "tinder-conk-hoof-fungus"
      ],
      "mushroom_profile": {
        "underside": [
          "Pores"
        ],
        "substrate": [
          "Dead hardwood",
          "Standing dead wood",
          "Logs / stumps"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "ring": [],
        "texture": [
          "Woody / tough"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None"
        ],
        "cap_surface": [
          "Hard crust",
          "Concentric zoning"
        ],
        "stem_feature": [
          "Sessile / no stem"
        ],
        "spore_print": "White",
        "growth_form": [
          "Shelf / bracket"
        ],
        "fertile_surface": [
          "Pored underside"
        ],
        "branching_form": [
          "Single shelves or overlapping brackets"
        ],
        "season_note": "Perennial bracket visible year-round."
      },
      "commonness_score": 4,
      "food_quality_score": 1,
      "edibility_status": "not_edible",
      "edible_use": {
        "has_ingestible_use": false,
        "method": "",
        "preparation_required": false,
        "notes": ""
      },
      "scientific_name": "Ganoderma applanatum",
      "use_roles": [
        "Other use"
      ],
      "foraging_value": "Other use — excellent craft/tinder curiosity; not food",
      "foraging_value_score": 2,
      "other_uses": "Classic artist's conk: the fresh white pore surface bruises brown and can be scratched to make durable drawings. Hard dried brackets are also useful as teaching/display specimens.",
      "field_identification": "Hard woody shelf on hardwoods; dull zoned upper surface; white pore surface stains brown where scratched.",
      "mushroom_card_note": "Useful as an artist's conk, not as food: scratch the white pore surface to make brown drawings."
    },
    {
      "slug": "ash-tree-bolete",
      "display_name": "Ash-tree Bolete",
      "common_name": "Ash-tree Bolete",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September",
        "June",
        "October"
      ],
      "links": [
        "https://www.mushroomexpert.com/boletinellus_merulioides.html",
        "https://mdc.mo.gov/discover-nature/field-guide/ash-tree-bolete"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/2012-08-10%20Boletinellus%20merulioides%20%28Schwein.%29%20Murrill%20247593.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Boletinellus%20merulioides%2095348.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Boletinellus.merulioides.vermont1.jpg"
      ],
      "medicinal_uses": "",
      "culinary_uses": "Edible but not usually ranked with choice boletes; use only young, firm specimens after confident ID near ash.",
      "non_edible_severity": "",
      "edibility_detail": "A recognizable ash-associated bolete. Quality is modest; older specimens soften quickly.",
      "month_numbers": [
        7,
        8,
        9,
        6,
        10
      ],
      "scientific_name": "Boletinellus merulioides",
      "mushroom_profile": {
        "scientific_name": "Boletinellus merulioides",
        "entry_scope": "species",
        "edibility_status": "review_required",
        "caution_level": "medium",
        "summary": "Minimal bolete seed entry for Ash-tree Bolete. Added in the Michigan / Upper Midwest bolete pass; fuller ID notes, sources, and images still need review.",
        "ecology": "bolete",
        "substrate": [
          "Forest soil",
          "Near ash"
        ],
        "wood_type": [],
        "host_trees": [
          "Ash"
        ],
        "host_certainty": "low",
        "underside": [
          "Pores"
        ],
        "ring": "None",
        "texture": [
          "Soft / fleshy",
          "Soft / leathery"
        ],
        "odor": "Unknown",
        "staining": [
          "Unknown",
          "Pores bruise brownish to olive; flesh may show blue-green tones"
        ],
        "taste": [
          "Mild / not distinctive"
        ],
        "spore_print": "",
        "season_note": "June through October; summer and fall near ash.",
        "processing_required": [],
        "research_notes": [
          "Species seed added from the Michigan / Upper Midwest bolete pass.",
          "Needs image coverage.",
          "Needs source links and fuller field notes."
        ],
        "cap_surface": [
          "Dry to slightly tacky",
          "Dry to tacky",
          "Wavy yellowish-brown cap"
        ],
        "stem_feature": [
          "Variable; often odd-textured",
          "Off-center stem",
          "Sometimes nearly lateral stem"
        ],
        "pore_color": [
          "Pores or odd pore surface",
          "Yellow to olive pores"
        ],
        "growth_form": [
          "Cap and stem"
        ],
        "fertile_surface": [
          "Pores"
        ],
        "fruitbody_shape": [
          "Convex cap with central stem"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Ash"
        ],
        "lane": "bolete",
        "smell": [
          "Mild / sometimes fragrant"
        ]
      },
      "manual_review_reasons": [],
      "mushroom_family": "Oddballs / veined / shaggy boletes",
      "boleteGroup": [
        "Oddballs / veined / shaggy boletes"
      ],
      "boleteSubgroup": [
        "Veined pores",
        "Ash associates"
      ],
      "weekPrecision": "species-level-reviewed",
      "primary_type": "mushroom",
      "is_medicinal": false,
      "is_non_edible": false,
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "bolete",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Ash"
      ],
      "commonness": "Occasional",
      "food_quality": "Fair",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "commonness_score": 3,
      "food_quality_score": 2,
      "look_alikes": [
        "old-man-of-the-woods",
        "parasitic-bolete"
      ],
      "confused_with": [
        "old-man-of-the-woods",
        "parasitic-bolete"
      ],
      "food_role": "food",
      "edibility_status": "edible_with_caution",
      "field_identification": "Grows on the ground near ash trees. Cap is yellowish-brown to reddish-brown and often wavy or irregular; stem is often off-center; pores are large, shallow, angular, radially arranged, and can bruise olive to brownish or sometimes bluish.",
      "use_links": [
        {
          "label": "MushroomExpert: Boletinellus merulioides",
          "url": "https://www.mushroomexpert.com/boletinellus_merulioides.html",
          "link_type": "identification",
          "applies_to_part": "whole mushroom",
          "source_quality": "mycology reference",
          "notes": "Ash association and pore/staining details."
        }
      ],
      "review_reasons": [],
      "common_names": [
        "Ash-tree Bolete"
      ],
      "kingdom_type": "mushroom",
      "species_scope": "species",
      "foraging_class": "mushroom",
      "season_months": [
        7,
        8,
        9,
        6,
        10
      ],
      "habitats": [],
      "look_alike_risk": "",
      "look_alike_notes": "",
      "rare_profile": null,
      "overview": "",
      "other_uses": "",
      "edibility_notes": "Edible but not usually ranked with choice boletes; use only young, firm specimens after confident ID near ash.",
      "curation_notes": [
        "Original app species restored into the standalone modular build.",
        "Minimal species seed. Added during the bolete expansion pass for the clean app; details, seasonality, and images still need a later review. Baseline audit pass added lane, seasonality, commonness, food quality, host filtering, and comparison notes.",
        "This record still needs species-level images and source links, but the core field-guide traits are now scaffolded for sorting and filtering."
      ],
      "edible_use": {
        "has_ingestible_use": true,
        "method": "Food",
        "preparation_required": false,
        "notes": "Edible but not usually ranked with choice boletes; use only young, firm specimens after confident ID near ash."
      },
      "medicinal": {
        "has_meaningful_content": false,
        "summary": "",
        "evidence_tier": "",
        "actions": [],
        "body_systems": [],
        "medical_terms": [],
        "parts_used": [],
        "preparation_notes": "",
        "warnings": "",
        "claims": []
      }
    },
    {
      "slug": "aspen-oyster",
      "display_name": "Aspen oyster",
      "common_name": "Aspen oyster",
      "category": "Mushroom",
      "notes": "Shelf-forming oyster on aspen and related hardwoods.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "September",
        "October",
        "November"
      ],
      "links": [
        "https://www.mushroomexpert.com/pleurotus_populinus.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Pleurotus%20populinus%2013996.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Pleurotus%20populinus%20O.%20Hilber%20%26%20O.K.%20Mill%20742181.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Pleurotus%20populinus%20O.%20Hilber%20%26%20O.K.%20Mill%2089533.jpg"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Cooked like other oyster mushrooms: sauté, add to soups, or use in mixed mushroom dishes. Best when young and fresh before the margins dry out.",
      "general_notes": "Treat as a gilled wood-rotting oyster rather than 'other'. In the U.P. this is a late-season hardwood oyster-type entry and should be compared with pearl and summer oysters.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Aspen / poplar"
      ],
      "commonness": "Occasional",
      "food_quality": "Good",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        9,
        10,
        11
      ],
      "food_role": "food",
      "look_alikes": [
        "pearl-oyster",
        "phoenix-oyster-summer-oyster"
      ],
      "confused_with": [
        "pearl-oyster",
        "phoenix-oyster-summer-oyster"
      ],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Dead hardwood wood"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Aspen / poplar"
        ],
        "ring": [
          "None"
        ],
        "texture": [
          "Fleshy / soft"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None notable"
        ],
        "cap_surface": [
          "Smooth"
        ],
        "stem_feature": [
          "Lateral or nearly absent stem"
        ],
        "spore_print": "White to pale lilac",
        "gill_attachment": "Decurrent",
        "volva": "None",
        "season_note": "Late summer into fall on dead aspen and related hardwoods."
      },
      "commonness_score": 3,
      "food_quality_score": 4,
      "scientific_name": "Pleurotus populinus",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Good forage",
      "foraging_value_score": 4,
      "field_identification": "Shelf-like oyster mushroom on aspen or other Populus wood, with decurrent white gills and little to no central stem.",
      "mushroom_card_note": "A good edible oyster on aspen/poplar wood; best young and cooked."
    },
    {
      "slug": "bay-bolete",
      "display_name": "Bay Bolete",
      "common_name": "Bay Bolete",
      "category": "Mushroom",
      "notes": "Bay Bolete is treated here as Imleria badia. Older app data also used the scientific-name slug imleria-badia; that duplicate has been merged into this page.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September",
        "October"
      ],
      "links": [
        "https://www.mushroomexpert.com/imleria_badia.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Bay%20Bolete%2C%20Boletus%20badius%20%2821195318373%29.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Boletus%20badius%205052175998%20df099ccc79%20b.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Boletus%20badius%20G1.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Generally regarded as edible when confidently identified and cooked; avoid old, buggy, or waterlogged specimens.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "bolete",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [
        "bay-bolete",
        "Bay Bolete",
        "Imleria badia"
      ],
      "host_filter_tokens": [
        "Softwood",
        "Pine",
        "Hemlock",
        "Decayed wood"
      ],
      "commonness": "Occasional",
      "food_quality": "Good",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "commonness_score": 4,
      "food_quality_score": 4,
      "month_numbers": [
        7,
        8,
        9,
        10
      ],
      "look_alikes": [
        "false-king-bolete",
        "bitter-bolete"
      ],
      "confused_with": [
        "false-king-bolete",
        "true-bitter-bolete"
      ],
      "edibility_detail": "Use only after confirming the bay-brown cap, yellow pores that bruise grayish blue, conifer/decayed-wood setting, and non-reticulate wrinkled stem.",
      "food_role": "food",
      "mushroom_profile": {
        "cap_surface": [
          "Dry to slightly tacky",
          "Sticky when fresh then dry",
          "Bay-brown cap"
        ],
        "stem_feature": [
          "Smooth to netted stem",
          "Wrinkled non-reticulate stem"
        ],
        "pore_color": [
          "Whitish to yellow pores",
          "Pale yellow becoming dirty yellow-brown"
        ],
        "growth_form": [
          "Cap and stem"
        ],
        "fertile_surface": [
          "Pores"
        ],
        "fruitbody_shape": [
          "Convex cap with central stem"
        ],
        "season_note": "Summer and fall in northeastern North America and the upper Midwest.",
        "lane": "bolete",
        "substrate": [
          "Forest soil",
          "Near decayed wood",
          "Mossy stumps"
        ],
        "host_filter_tokens": [
          "Softwood",
          "Pine",
          "Hemlock",
          "Decayed wood"
        ],
        "host_trees": [
          "Pine",
          "Eastern hemlock",
          "Conifers"
        ],
        "underside": [
          "Pores"
        ],
        "staining": [
          "Pores bruise grayish blue",
          "Unknown"
        ],
        "texture": [
          "Fleshy / firm when young",
          "Fleshy / firm"
        ],
        "smell": [
          "Mild / not distinctive"
        ],
        "taste": [
          "Mild / not distinctive"
        ],
        "scientific_name": "Imleria badia",
        "entry_scope": "species",
        "edibility_status": "review_required",
        "caution_level": "medium",
        "summary": "Minimal bolete seed entry for Bay Bolete. Added in the Michigan audit pass; fuller ID notes, sources, and images still need review.",
        "ecology": "bolete",
        "wood_type": [],
        "host_certainty": "unknown",
        "ring": "Unknown",
        "odor": "Unknown",
        "spore_print": "",
        "processing_required": [],
        "research_notes": [
          "Species seed added from the Michigan bolete audit.",
          "Needs image coverage.",
          "Needs source links and fuller field notes."
        ]
      },
      "scientific_name": "Imleria badia",
      "edibility_status": "edible_with_caution",
      "field_identification": "Bay-brown to reddish-brown cap, pale yellow pores that bruise grayish blue, wrinkled non-reticulate stem, and frequent fruiting near conifers or very decayed mossy wood.",
      "weekPrecision": "species-level-reviewed",
      "use_links": [
        {
          "label": "MushroomExpert: Imleria badia",
          "url": "https://www.mushroomexpert.com/imleria_badia.html",
          "link_type": "identification",
          "applies_to_part": "whole mushroom",
          "source_quality": "mycology reference",
          "notes": "Conifer/decayed wood association, blue-gray bruising pores, and stem traits."
        }
      ],
      "boleteGroup": [
        "Xerocomus / blue-bruising brown boletes"
      ],
      "boleteSubgroup": [
        "Bay bolete",
        "Conifer associate",
        "Decayed wood vicinity"
      ],
      "primary_type": "mushroom",
      "review_reasons": [],
      "manual_review_reasons": [],
      "common_names": [
        "Bay Bolete"
      ],
      "kingdom_type": "mushroom",
      "species_scope": "species",
      "foraging_class": "mushroom",
      "season_months": [
        7,
        8,
        9,
        10
      ],
      "habitats": [],
      "look_alike_risk": "",
      "look_alike_notes": "",
      "rare_profile": null,
      "overview": "",
      "other_uses": "",
      "edibility_notes": "Cooked food. Generally regarded as edible when confidently identified and cooked; avoid old, buggy, or waterlogged specimens.",
      "curation_notes": [
        "Original app species restored into the standalone modular build.",
        "Recreated locally from the original app baseline checklist for the modular standalone build. Baseline audit pass added lane, seasonality, commonness, food quality, host filtering, and comparison notes.",
        "This record still needs species-level images and source links, but the core field-guide traits are now scaffolded for sorting and filtering."
      ],
      "edible_use": {
        "has_ingestible_use": true,
        "method": "Cooked food",
        "preparation_required": true,
        "notes": "Generally regarded as edible when confidently identified and cooked; avoid old, buggy, or waterlogged specimens."
      },
      "medicinal": {
        "has_meaningful_content": false,
        "summary": "",
        "evidence_tier": "",
        "actions": [],
        "body_systems": [],
        "medical_terms": [],
        "parts_used": [],
        "preparation_notes": "",
        "warnings": "",
        "claims": []
      },
      "hidden": true,
      "duplicate_of": "imleria-badia",
      "alias_record_note": "Hidden from lists as a duplicate/legacy alias of Imleria badia; retained so older look-alike links and searches do not break.",
      "legacy_alias": true,
      "list_visibility": "hidden-duplicate",
      "duplicate_note": "Duplicate Bay Bolete record kept only as a legacy slug alias.",
      "mushroom_family": "Porcini & brown allies",
      "is_medicinal": false,
      "is_non_edible": false,
      "former_slugs": [
        "imleria-badia"
      ],
      "aliases": [
        "imleria-badia"
      ],
      "images_structured": [
        {
          "thumb": "https://commons.wikimedia.org/wiki/Special:FilePath/Bay%20Bolete%2C%20Boletus%20badius%20%2821195318373%29.jpg",
          "detail": "https://commons.wikimedia.org/wiki/Special:FilePath/Bay%20Bolete%2C%20Boletus%20badius%20%2821195318373%29.jpg",
          "full": "https://commons.wikimedia.org/wiki/Special:FilePath/Bay%20Bolete%2C%20Boletus%20badius%20%2821195318373%29.jpg",
          "source": "Wikimedia Commons",
          "title": "Bay Bolete, Boletus badius (21195318373).jpg",
          "part_or_stage": "Field photo",
          "source_page": "https://commons.wikimedia.org/wiki/File:Bay_Bolete,_Boletus_badius_(21195318373).jpg",
          "credit": "Wikimedia Commons",
          "license": "See Wikimedia Commons file page"
        },
        {
          "thumb": "https://commons.wikimedia.org/wiki/Special:FilePath/Boletus%20badius%205052175998%20df099ccc79%20b.jpg",
          "detail": "https://commons.wikimedia.org/wiki/Special:FilePath/Boletus%20badius%205052175998%20df099ccc79%20b.jpg",
          "full": "https://commons.wikimedia.org/wiki/Special:FilePath/Boletus%20badius%205052175998%20df099ccc79%20b.jpg",
          "source": "Wikimedia Commons",
          "title": "Boletus badius 5052175998 df099ccc79 b.jpg",
          "part_or_stage": "Field photo 2",
          "source_page": "https://commons.wikimedia.org/wiki/File:Boletus_badius_5052175998_df099ccc79_b.jpg",
          "credit": "Wikimedia Commons",
          "license": "See Wikimedia Commons file page"
        },
        {
          "thumb": "https://commons.wikimedia.org/wiki/Special:FilePath/Boletus%20badius%20G1.jpg",
          "detail": "https://commons.wikimedia.org/wiki/Special:FilePath/Boletus%20badius%20G1.jpg",
          "full": "https://commons.wikimedia.org/wiki/Special:FilePath/Boletus%20badius%20G1.jpg",
          "source": "Wikimedia Commons",
          "title": "Boletus badius G1.jpg",
          "part_or_stage": "Field photo 3",
          "source_page": "https://commons.wikimedia.org/wiki/File:Boletus_badius_G1.jpg",
          "credit": "Wikimedia Commons",
          "license": "See Wikimedia Commons file page"
        }
      ],
      "needs_review": false,
      "review_note": "",
      "review_notes": ""
    },
    {
      "slug": "bear-s-head-tooth",
      "display_name": "Bear's head tooth",
      "common_name": "Bear's head tooth",
      "category": "Mushroom",
      "notes": "Cascading white tooth fungus with branched clusters rather than one round pom-pom mass.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "August",
        "September",
        "October"
      ],
      "links": [
        "https://mushroomexpert.com/fungionwood/teeth%20and%20spine/species%20pages/Hericium%20americanum.htm",
        "https://www.mushroomexpert.com/hericium.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Bear%27s%20Head%20Tooth%20%28Hericium%20americanum%29%20-%20Mississauga%2C%20Ontario%2001.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Bear%27s%20Head%20Tooth%20%28Hericium%20americanum%29%20-%20Mississauga%2C%20Ontario%2002.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Bear%27s%20Head%20Tooth%20%28Hericium%20americanum%29%20-%20Mississauga%2C%20Ontario%2003.jpg"
      ],
      "medicinal_uses": "Hericium species have modern supplement interest, but this entry is treated primarily as a food mushroom.",
      "culinary_uses": "Choice edible when young and white. Cook like lion's mane or other Hericium: sauté, brown in butter, or use in rich mushroom dishes.",
      "general_notes": "One of the Hericium mushrooms; useful to distinguish from lion's mane and coral tooth.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Uncommon",
      "food_quality": "Choice",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        8,
        9,
        10
      ],
      "food_role": "food",
      "look_alikes": [
        "lion-s-mane",
        "coral-tooth-fungus"
      ],
      "confused_with": [
        "lion-s-mane",
        "coral-tooth-fungus"
      ],
      "edibility_detail": "Choice edible when fresh and tender.",
      "mushroom_profile": {
        "underside": [
          "Teeth / spines"
        ],
        "substrate": [
          "Dead hardwood",
          "Wounded hardwood"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "ring": [],
        "texture": [
          "Soft / fleshy"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None"
        ],
        "cap_surface": [
          "White cascading clusters"
        ],
        "stem_feature": [
          "No real stem / branched base"
        ],
        "spore_print": "White",
        "growth_form": [
          "Toothed / cascading"
        ],
        "fertile_surface": [
          "Hanging teeth"
        ],
        "branching_form": [
          "Branched clusters"
        ],
        "season_note": "Late summer through fall on hardwood logs and trunks."
      },
      "commonness_score": 2,
      "food_quality_score": 5,
      "scientific_name": "Hericium americanum",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Prime foraging",
      "foraging_value_score": 5,
      "field_identification": "Branched white tooth fungus with longer teeth clustered on branch tips; found on hardwood logs or wounds.",
      "mushroom_card_note": "Choice Hericium: branched white clusters with hanging teeth, usually on hardwood."
    },
    {
      "slug": "birch-polypore",
      "display_name": "Birch polypore",
      "common_name": "Birch polypore",
      "category": "Mushroom",
      "notes": "Look for pale hoof-like brackets on birch with a fine white pore surface underneath.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      "links": [
        "https://www.mushroomexpert.com/fomitopsis_betulina.html",
        "https://link.springer.com/article/10.1007/s11274-017-2247-0"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Piptoporus%20Betulinus.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Polyporus%20Betulinus.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Fomitopsis%20betulina%20100134091.jpg"
      ],
      "medicinal_uses": "Traditional tea/decoction and historical medicinal-use interest; use conservatively and do not treat as a cure.",
      "culinary_uses": "Not a table mushroom; corky, bitter, and tough.",
      "non_edible_severity": "Non-culinary / tea",
      "edibility_detail": "Generally treated as non-culinary; better known for utility and tea-type use than as food.",
      "photo_subject": "Birch",
      "general_notes": "A birch specialist and a good host-linked ID species for the app.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Birch"
      ],
      "commonness": "Common",
      "food_quality": "Not recommended",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "food_role": "medicinal_only",
      "look_alikes": [
        "artist-s-conk",
        "tinder-conk-hoof-fungus"
      ],
      "confused_with": [
        "artist-s-conk"
      ],
      "mushroom_profile": {
        "underside": [
          "Pores"
        ],
        "substrate": [
          "Dead birch",
          "Standing dead wood",
          "Logs / stumps"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Birch"
        ],
        "ring": [],
        "texture": [
          "Tough / corky"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None"
        ],
        "cap_surface": [
          "Smooth",
          "Pale tan"
        ],
        "stem_feature": [
          "Sessile / no stem"
        ],
        "spore_print": "White",
        "growth_form": [
          "Shelf / bracket"
        ],
        "fertile_surface": [
          "Pored underside"
        ],
        "branching_form": [
          "Single shelves"
        ],
        "season_note": "Fruiting bodies persist and can be found year-round on birch."
      },
      "commonness_score": 4,
      "food_quality_score": 1,
      "scientific_name": "Fomitopsis betulina",
      "use_roles": [
        "Medicinal",
        "Other use"
      ],
      "foraging_value": "Niche / traditional use",
      "foraging_value_score": 2,
      "other_uses": "Also known historically as razor-strop fungus and as an ember/tinder material.",
      "field_identification": "Whitish to tan annual bracket on birch, often with a rounded inrolled margin and sunken pore surface.",
      "mushroom_card_note": "A birch-only polypore with traditional tea/tinder/utility interest, not a frying-pan mushroom."
    },
    {
      "slug": "bitter-bolete",
      "display_name": "Bitter Bolete",
      "common_name": "Bitter Bolete",
      "category": "Mushroom",
      "notes": "Bitter Bolete is treated here as the Tylopilus felleus concept: a bitter, pink-pored bolete often confused with porcini-type mushrooms. North American material may not all be true European T. felleus, so use this page as a field-guide concept rather than a final microscope-level taxonomy claim.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September",
        "October"
      ],
      "links": [
        "https://www.mushroomexpert.com/tylopilus_felleus.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Tylopilus%20felleus.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Tylopilus%20felleus%20%281%29.JPG",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Tylopilus%20felleus%20%2823431150244%29.jpg"
      ],
      "culinary_uses": "Niche edible with an intensely bitter flavor. Most foragers skip it because even a small amount can make a dish unpleasant, but it is retained in the edible mushroom list as an acquired-taste bittering mushroom rather than a poison/caution species.",
      "non_edible_severity": "",
      "edibility_detail": "Use only if intentionally seeking strong bitterness; otherwise keep it separate from good edible boletes because a small piece can dominate a pan.",
      "general_notes": "Key field clues: pinkish pores as it matures, a strongly bitter nibble-and-spit taste, and dark netting on the stalk. Often confused with porcini/king bolete types.",
      "record_type": "mushroom",
      "lane": "bolete",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [
        "bitter-bolete",
        "Bitter Bolete",
        "Tylopilus felleus"
      ],
      "host_filter_tokens": [],
      "commonness": "Common",
      "food_quality": "Niche / acquired taste",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "commonness_score": 4,
      "food_quality_score": 2,
      "month_numbers": [
        7,
        8,
        9,
        10
      ],
      "look_alikes": [
        "bay-bolete",
        "king-bolete"
      ],
      "confused_with": [
        "bay-bolete",
        "king-bolete"
      ],
      "food_role": "food",
      "mushroom_profile": {
        "cap_surface": [
          "Dry to slightly tacky"
        ],
        "stem_feature": [
          "Smooth to netted stem",
          "Reticulate/netted stem"
        ],
        "pore_color": [
          "Whitish to yellow pores",
          "Whitish aging pinkish pores",
          "Pinkish mature pores"
        ],
        "growth_form": [
          "Cap and stem"
        ],
        "fertile_surface": [
          "Pores"
        ],
        "fruitbody_shape": [
          "Convex cap with central stem"
        ],
        "season_note": "Usually encountered from July through October in the Upper Midwest / Great Lakes window.",
        "edibility_status": "edible_niche_acquired_taste",
        "caution_level": "low",
        "summary": "Pink-pored Tylopilus with an intensely bitter taste. Not poisonous in the usual field-guide sense, but most foragers skip it because it can ruin a meal; kept here as a niche/acquired-taste edible.",
        "taste": [
          "Bitter",
          "Very bitter"
        ],
        "scientific_name": "Tylopilus felleus",
        "entry_scope": "species",
        "ecology": "bolete",
        "substrate": [
          "Forest soil"
        ],
        "wood_type": [],
        "host_trees": [],
        "host_certainty": "unknown",
        "underside": [
          "Pores"
        ],
        "ring": "None",
        "texture": [
          "Fleshy / firm"
        ],
        "odor": "Unknown",
        "staining": "Unknown",
        "spore_print": "",
        "processing_required": [],
        "research_notes": [
          "Species seed added from the Michigan / Upper Midwest bolete pass.",
          "Needs image coverage.",
          "Needs source links and fuller field notes."
        ]
      },
      "common_names": [
        "Bitter Bolete",
        "False Porcini"
      ],
      "scientific_name": "Tylopilus felleus",
      "edibility_status": "edible_niche_acquired_taste",
      "look_alike_risk": "",
      "danger_level": "Niche edible / intensely bitter",
      "poisoning_effects": "Large amounts may cause stomach upset in some people; the practical problem is intense bitterness and confusion with better edible porcini-type boletes.",
      "affected_systems": [],
      "kingdom_type": "mushroom",
      "species_scope": "species",
      "foraging_class": "mushroom",
      "field_identification": "",
      "season_months": [
        7,
        8,
        9,
        10
      ],
      "habitats": [],
      "look_alike_notes": "",
      "rare_profile": null,
      "overview": "",
      "other_uses": "",
      "edibility_notes": "Inedible because of intense bitterness rather than dangerous poisoning. Keep it out of the Caution page unless a future record adds a real toxicity concern.",
      "curation_notes": [
        "Original app species restored into the standalone modular build.",
        "Recreated locally from the original app baseline checklist for the modular standalone build. Baseline audit pass added lane, seasonality, commonness, food quality, host filtering, and comparison notes.",
        "This record still needs species-level images and source links, but the core field-guide traits are now scaffolded for sorting and filtering."
      ],
      "review_reasons": [],
      "edible_use": {
        "has_ingestible_use": false,
        "method": "",
        "preparation_required": false,
        "notes": ""
      },
      "medicinal": {
        "has_meaningful_content": false,
        "summary": "",
        "evidence_tier": "",
        "actions": [],
        "body_systems": [],
        "medical_terms": [],
        "parts_used": [],
        "preparation_notes": "",
        "warnings": "",
        "claims": []
      },
      "use_links": [
        {
          "label": "MushroomExpert: Tylopilus felleus",
          "url": "https://www.mushroomexpert.com/tylopilus_felleus.html",
          "link_type": "identification",
          "applies_to_part": "whole mushroom",
          "source_quality": "mycology reference",
          "notes": "Pink pore surface, bitter taste, conifer association, and Michigan taxonomic note."
        }
      ],
      "hidden": true,
      "duplicate_of": "true-bitter-bolete",
      "legacy_alias": true,
      "list_visibility": "hidden-duplicate",
      "duplicate_note": "Duplicate Bitter Bolete record kept only as a legacy slug alias.",
      "manual_review_reasons": [
        "needs image coverage",
        "needs species-level notes review",
        "needs source links"
      ],
      "is_non_edible": false,
      "toxicity_notes": "Not treated as a poison species in this guide; retained as a niche/acquired-taste edible with a strong bitter flavor.",
      "medicinal_uses": "",
      "mushroom_family": "Pink-pored Tylopilus & bitter allies",
      "boleteGroup": [
        "Pink-pored Tylopilus & bitter allies"
      ],
      "boleteSubgroup": [
        "Pink-pored bitters"
      ],
      "weekPrecision": "needs-review",
      "primary_type": "mushroom",
      "is_medicinal": false,
      "needs_review": false,
      "review_note": "",
      "review_notes": "",
      "former_slugs": [
        "true-bitter-bolete"
      ],
      "aliases": [
        "true-bitter-bolete",
        "tylopilus-felleus"
      ],
      "images_structured": [
        {
          "thumb": "https://commons.wikimedia.org/wiki/Special:FilePath/Tylopilus%20felleus.jpg",
          "detail": "https://commons.wikimedia.org/wiki/Special:FilePath/Tylopilus%20felleus.jpg",
          "full": "https://commons.wikimedia.org/wiki/Special:FilePath/Tylopilus%20felleus.jpg",
          "source": "Wikimedia Commons",
          "title": "Tylopilus felleus.jpg",
          "part_or_stage": "Field photo",
          "source_page": "https://commons.wikimedia.org/wiki/File:Tylopilus_felleus.jpg",
          "credit": "Wikimedia Commons",
          "license": "See Wikimedia Commons file page"
        },
        {
          "thumb": "https://commons.wikimedia.org/wiki/Special:FilePath/Tylopilus%20felleus%20%281%29.JPG",
          "detail": "https://commons.wikimedia.org/wiki/Special:FilePath/Tylopilus%20felleus%20%281%29.JPG",
          "full": "https://commons.wikimedia.org/wiki/Special:FilePath/Tylopilus%20felleus%20%281%29.JPG",
          "source": "Wikimedia Commons",
          "title": "Tylopilus felleus (1).JPG",
          "part_or_stage": "Field photo 2",
          "source_page": "https://commons.wikimedia.org/wiki/File:Tylopilus_felleus_(1).JPG",
          "credit": "Wikimedia Commons",
          "license": "See Wikimedia Commons file page"
        },
        {
          "thumb": "https://commons.wikimedia.org/wiki/Special:FilePath/Tylopilus%20felleus%20%2823431150244%29.jpg",
          "detail": "https://commons.wikimedia.org/wiki/Special:FilePath/Tylopilus%20felleus%20%2823431150244%29.jpg",
          "full": "https://commons.wikimedia.org/wiki/Special:FilePath/Tylopilus%20felleus%20%2823431150244%29.jpg",
          "source": "Wikimedia Commons",
          "title": "Tylopilus felleus (23431150244).jpg",
          "part_or_stage": "Field photo 3",
          "source_page": "https://commons.wikimedia.org/wiki/File:Tylopilus_felleus_(23431150244).jpg",
          "credit": "Wikimedia Commons",
          "license": "See Wikimedia Commons file page"
        }
      ]
    },
    {
      "slug": "black-morels",
      "display_name": "Black morels",
      "common_name": "Black morels",
      "category": "Mushroom",
      "notes": "Spring morels with darker ridges and a fully attached cap; hollow from tip through stem.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "April",
        "May",
        "June"
      ],
      "links": [
        "https://www.mushroomexpert.com/morchella_angusticeps.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Morchella%20elata%2083497.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Morchella%20elata%2083536.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Morchella%20elata%20group%2038336.jpg"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Choice spring edible; always cook thoroughly. Slice lengthwise to confirm a hollow interior and to clean out grit or insects.",
      "general_notes": "Grouped here as a practical field-guide complex rather than a single strict species concept.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Conifer / softwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Choice",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        4,
        5,
        6
      ],
      "food_role": "food",
      "look_alikes": [
        "false-morel-gyromitra-group",
        "half-free-morels",
        "yellow-morels"
      ],
      "confused_with": [
        "false-morel-gyromitra-group",
        "half-free-morels"
      ],
      "edibility_detail": "Excellent edible; false morels are the main danger.",
      "mushroom_profile": {
        "underside": [
          "Pitted / ridged"
        ],
        "substrate": [
          "Forest soil",
          "Burn areas",
          "Disturbed ground"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Conifer / softwood"
        ],
        "ring": [],
        "texture": [
          "Fleshy / hollow"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None"
        ],
        "cap_surface": [
          "Ridged pits"
        ],
        "stem_feature": [
          "Hollow stem"
        ],
        "spore_print": "Pale cream",
        "growth_form": [
          "Morel"
        ],
        "fertile_surface": [
          "Outer ridges and pits"
        ],
        "branching_form": [
          "Single fruitbody"
        ],
        "season_note": "Primarily a spring mushroom, often during leaf-out and warming soil."
      },
      "commonness_score": 3,
      "food_quality_score": 5,
      "scientific_name": "Morchella angusticeps / Morchella septentrionalis complex",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Prime foraging",
      "foraging_value_score": 5,
      "field_identification": "True morel with pitted cap, hollow interior from cap through stem, and cap attached to the stem; darkening ridges in black morels.",
      "mushroom_card_note": "Prime spring mushroom; confirm hollow true-morel structure and cook thoroughly."
    },
    {
      "slug": "black-trumpet",
      "display_name": "Black trumpet",
      "common_name": "Black trumpet",
      "category": "Mushroom",
      "notes": "Dark hollow trumpet with no true gills; the outside fertile surface is smooth to wrinkled, not bladed.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September",
        "October"
      ],
      "links": [
        "https://www.mushroomexpert.com/craterellus_fallax"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Craterellus%20fallax%20822088.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Craterellus%20cornucopioides%20362779.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Craterellus%20cornucopioides%20362782.jpg"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Choice edible with deep, aromatic flavor. Excellent fresh or dried; use in sauces, soups, eggs, rice, or anywhere a concentrated mushroom flavor helps.",
      "general_notes": "Easy to miss because of its dark color, especially in leaf litter.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Choice",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        7,
        8,
        9,
        10
      ],
      "food_role": "food",
      "look_alikes": [
        "yellowfoot-chanterelle",
        "smooth-chanterelles"
      ],
      "confused_with": [
        "yellowfoot-chanterelle"
      ],
      "edibility_detail": "Choice edible with a strong aroma when dried.",
      "mushroom_profile": {
        "underside": [
          "Smooth",
          "Wrinkled"
        ],
        "substrate": [
          "Forest soil",
          "Leaf litter"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "ring": [],
        "texture": [
          "Thin / pliable"
        ],
        "smell": [
          "Mild fruity"
        ],
        "staining": [
          "None"
        ],
        "cap_surface": [
          "Funnel / trumpet"
        ],
        "stem_feature": [
          "Hollow trumpet body"
        ],
        "spore_print": "Pale yellow to cream",
        "growth_form": [
          "Trumpet / funnel"
        ],
        "fertile_surface": [
          "Smooth to wrinkled outer surface"
        ],
        "branching_form": [
          "Single fruitbody"
        ],
        "season_note": "Most often late summer into fall in moist hardwood woods."
      },
      "commonness_score": 3,
      "food_quality_score": 5,
      "scientific_name": "Craterellus fallax",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Prime foraging",
      "foraging_value_score": 5,
      "field_identification": "Dark hollow trumpet or vase with no true gills; fertile outer surface smooth to shallowly wrinkled.",
      "mushroom_card_note": "Prime edible trumpet; easy to miss on the forest floor but excellent fresh or dried."
    },
    {
      "slug": "blewit-mushroom",
      "display_name": "Blewit mushroom",
      "common_name": "Blewit mushroom",
      "category": "Mushroom",
      "notes": "Lilac-toned forest-litter gilled mushroom.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "September",
        "October",
        "November"
      ],
      "links": [
        "https://www.mushroomexpert.com/clitocybe_nuda"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Lepista%20nuda.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Lepista%20nuda%20%282%29.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Lepista%20nuda%2001.jpg"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Good edible when properly identified and cooked; flavor is earthy/aromatic. Avoid old soggy specimens and confirm spore print/ID against purple Cortinarius look-alikes.",
      "general_notes": "A practical gilled entry for the guide because the color, smell, and late-season habit are all useful identification cues.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Conifer / softwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Good",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        9,
        10,
        11
      ],
      "food_role": "food",
      "look_alikes": [],
      "confused_with": [],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Leaf litter",
          "Duff",
          "Composty litter"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Conifer / softwood"
        ],
        "ring": [
          "None"
        ],
        "texture": [
          "Fleshy"
        ],
        "smell": [
          "Perfumed",
          "Fruity"
        ],
        "staining": [
          "None notable"
        ],
        "cap_surface": [
          "Smooth"
        ],
        "stem_feature": [
          "Central smooth stem"
        ],
        "spore_print": "Pale pinkish buff",
        "gill_attachment": "Sinuate to attached",
        "volva": "None",
        "season_note": "Mostly fall after cool weather begins."
      },
      "commonness_score": 3,
      "food_quality_score": 4,
      "scientific_name": "Clitocybe nuda",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Good forage",
      "foraging_value_score": 4,
      "field_identification": "Purple-lilac young mushroom fading brownish, with pinkish spore print, no veil, and growth in leaf litter or organic debris.",
      "mushroom_card_note": "Good cooked edible, but confirm it is a blewit and not a purple Cortinarius."
    },
    {
      "slug": "blue-staining-red-pored-boletes-caution-group",
      "display_name": "Blue-staining / red-pored boletes (caution group)",
      "common_name": "Blue-staining / red-pored boletes (caution group)",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Neoboletus%20luridiformis%2083371622.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Suillellus%20luridus%20117238994.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Exsudoporus%20frostii%2039926151623.jpg"
      ],
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "non_edible_severity": "Caution group",
      "edibility_detail": "Avoid for food in this guide; keep as an identification/caution record.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "bolete",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "Occasional",
      "food_quality": "Not recommended",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "commonness_score": 3,
      "food_quality_score": 1,
      "month_numbers": [
        7,
        8,
        9
      ],
      "look_alikes": [],
      "confused_with": [],
      "food_role": "avoid",
      "mushroom_profile": {
        "cap_surface": [
          "Dry to slightly tacky"
        ],
        "stem_feature": [
          "Smooth to netted stem"
        ],
        "pore_color": [
          "Whitish to yellow pores"
        ],
        "growth_form": [
          "Cap and stem"
        ],
        "fertile_surface": [
          "Pores"
        ],
        "fruitbody_shape": [
          "Convex cap with central stem"
        ],
        "season_note": "Usually encountered from July through September in the Upper Midwest / Great Lakes window."
      },
      "edibility_status": "not_edible",
      "edible_use": {
        "has_ingestible_use": false,
        "method": "",
        "preparation_required": false,
        "notes": ""
      }
    },
    {
      "slug": "cauliflower-mushroom",
      "display_name": "Cauliflower mushroom",
      "common_name": "Cauliflower mushroom",
      "category": "Mushroom",
      "notes": "Large ruffled mass with noodle-like folds rather than gills, pores, or teeth.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "August",
        "September",
        "October"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Sparassis%20crispa.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Sparassis%20spathulata%20%28Schwein.%29%20Fr%20545832.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Sparassis%20spathulata%20315469856.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "general_notes": "Can hold grit and debris deep inside; cleaning matters.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Conifer / softwood",
        "Pine"
      ],
      "commonness": "Occasional",
      "food_quality": "Good",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        8,
        9,
        10
      ],
      "food_role": "food",
      "look_alikes": [
        "coral-tooth-fungus"
      ],
      "confused_with": [
        "coral-tooth-fungus"
      ],
      "edibility_detail": "Good edible when young and clean.",
      "mushroom_profile": {
        "underside": [
          "None / folded surfaces"
        ],
        "substrate": [
          "At base of conifers",
          "Forest soil"
        ],
        "host_filter_tokens": [
          "Conifer / softwood",
          "Pine"
        ],
        "ring": [],
        "texture": [
          "Fleshy / crisp"
        ],
        "smell": [
          "Aromatic"
        ],
        "staining": [
          "None"
        ],
        "cap_surface": [
          "Ruffled folds"
        ],
        "stem_feature": [
          "Short branching base"
        ],
        "spore_print": "Cream to pale yellow",
        "growth_form": [
          "Ruffled mass"
        ],
        "fertile_surface": [
          "Fold surfaces"
        ],
        "branching_form": [
          "Highly branched"
        ],
        "season_note": "Late summer through fall, often at the base of pines or nearby roots."
      },
      "commonness_score": 3,
      "food_quality_score": 4
    },
    {
      "slug": "chaga",
      "display_name": "Chaga",
      "common_name": "Chaga",
      "category": "Mushroom",
      "notes": "Irregular black charcoal-like mass on living birch with warm brown interior.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      "links": [
        "https://www.mushroomexpert.com/inonotus_obliquus.html",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC11132974/"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Inonotus%20obliquus.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Chaga%20%288237818667%29.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Chaga%20Mushroom%20-%20Inonotus%20obliquus%20%2830222675437%29.jpg"
      ],
      "medicinal_uses": "Traditional medicinal and modern research interest, mostly as extracts/tea; evidence and safety vary, and it should not be treated as a cure.",
      "culinary_uses": "Used as a tea/decoction rather than a table mushroom. Harvest sparingly from living birch and avoid taking all material from one tree.",
      "non_edible_severity": "",
      "edibility_detail": "Used for tea/extract traditions rather than as food.",
      "general_notes": "Not a culinary mushroom; better filed under medicinal/other uses despite being a fungus.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [
        "clinker polypore",
        "cinder conk",
        "birch conk",
        "tinder fungus",
        "medicinal tea",
        "fire starter"
      ],
      "host_filter_tokens": [
        "Hardwood",
        "Birch"
      ],
      "commonness": "Occasional",
      "food_quality": "Tea / infusion",
      "medicinalAction": [
        "Antioxidant",
        "Anti-inflammatory",
        "Immunomodulating",
        "Preliminary metabolic support"
      ],
      "medicinalSystem": [
        "Immune system",
        "Inflammation response",
        "Metabolic / blood sugar",
        "Kidneys / urinary caution"
      ],
      "medicinalTerms": [
        "Oxalates",
        "Anticoagulant interaction",
        "Blood sugar interaction",
        "Kidney injury risk with heavy use"
      ],
      "habitat": [],
      "month_numbers": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "food_role": "ingestible_prepared",
      "look_alikes": [
        "birch-polypore",
        "tinder-conk-hoof-fungus",
        "burn scars"
      ],
      "confused_with": [
        "burn scars",
        "birch-polypore"
      ],
      "mushroom_profile": {
        "underside": [
          "None / sterile conk"
        ],
        "substrate": [
          "Living birch",
          "Birch"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Birch"
        ],
        "ring": [],
        "texture": [
          "Hard woody mass",
          "Woody / hard",
          "Corky inner material when dry"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "Rusty brown interior when cut"
        ],
        "cap_surface": [
          "Black cracked crust",
          "Black cracked outer surface",
          "Rusty brown interior"
        ],
        "stem_feature": [
          "No stem"
        ],
        "spore_print": "",
        "growth_form": [
          "Sterile conk / mass",
          "Sterile conk / black mass on birch"
        ],
        "fertile_surface": [
          "None on sterile conk",
          "Not a typical cap-and-stem mushroom"
        ],
        "branching_form": [
          "Irregular mass"
        ],
        "season_note": "Visible year-round on living birch trunks.",
        "lane": "other",
        "scientific_name": "Inonotus obliquus"
      },
      "commonness_score": 3,
      "food_quality_score": 1,
      "common_names": [
        "Chaga",
        "Clinker Polypore",
        "Cinder Conk",
        "Birch Conk"
      ],
      "scientific_name": "Inonotus obliquus",
      "primary_type": "mushroom",
      "edibility_status": "edible_with_preparation",
      "other_uses": "Excellent practical tinder / ember carrier. The dry rusty-brown inner material catches a spark readily, smolders like a coal, and can help start or carry fire; scrape, crumble, or powder the inner material. If damp or freshly harvested, expose or dry the inner material first for best spark-catching.",
      "medicinal": {
        "has_meaningful_content": true,
        "summary": "",
        "evidence_tier": "traditional use / preclinical research",
        "actions": [
          "Antioxidant",
          "Anti-inflammatory",
          "Immunomodulating",
          "Preliminary metabolic support"
        ],
        "body_systems": [
          "Immune system",
          "Inflammation response",
          "Metabolic / blood sugar",
          "Kidneys / urinary caution"
        ],
        "medical_terms": [
          "Oxalates",
          "Anticoagulant interaction",
          "Blood sugar interaction",
          "Kidney injury risk with heavy use"
        ],
        "parts_used": [
          "Sclerotium / conk"
        ],
        "preparation_notes": "Usually simmered or steeped as tea; stronger extracts/supplements are a different risk category than an occasional beverage.",
        "warnings": "Use moderation. Chaga can be high in oxalates and case reports link heavy or long-term powder use with kidney injury. It may also increase bleeding risk with anticoagulant/antiplatelet drugs and may affect blood sugar, so avoid casual supplement-style use with kidney disease, bleeding disorders, diabetes drugs, blood thinners, pregnancy, or before surgery without medical guidance.",
        "claims": []
      },
      "use_tags": [
        "E",
        "T",
        "M",
        "O"
      ],
      "use_links": [
        {
          "label": "Memorial Sloan Kettering: Chaga Mushroom",
          "url": "https://www.mskcc.org/cancer-care/integrative-medicine/herbs/chaga-mushroom",
          "link_type": "medicinal_reference",
          "applies_to_part": "conk / tea",
          "source_quality": "medical center",
          "notes": "Traditional use, preclinical evidence, and safety interactions."
        },
        {
          "label": "PMC review: Therapeutic properties of Inonotus obliquus",
          "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11132974/",
          "link_type": "research_review",
          "applies_to_part": "extracts / compounds",
          "source_quality": "peer-reviewed review",
          "notes": "Review of antioxidant, anti-inflammatory, immunomodulating, and other studied properties."
        },
        {
          "label": "Wildwood Survival: True Tinder Fungus / Chaga",
          "url": "https://wildwoodsurvival.com/survival/fire/tinder/tinderfungus/true.html",
          "link_type": "other_use",
          "applies_to_part": "inner conk",
          "source_quality": "practical firecraft",
          "notes": "Spark-catching and coal-carrying use."
        }
      ],
      "kingdom_type": "mushroom",
      "species_scope": "species",
      "foraging_class": "mushroom",
      "field_identification": "Black, cracked, charcoal-like sterile conk protruding from living birch; interior is orange-brown, not wood.",
      "season_months": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "habitats": [],
      "look_alike_risk": "",
      "look_alike_notes": "",
      "rare_profile": null,
      "overview": "",
      "edibility_notes": "Tea / infusion. Woody conk is not eaten like a normal mushroom, but it is commonly simmered or steeped as a bitter tea / coffee-like beverage. Used for tea/extract traditions rather than as food.",
      "curation_notes": [
        "Original app species restored into the standalone modular build."
      ],
      "review_reasons": [],
      "edible_use": {
        "has_ingestible_use": true,
        "method": "Tea / infusion",
        "preparation_required": true,
        "notes": "Woody conk is not eaten like a normal mushroom, but it is commonly simmered or steeped as a bitter tea / coffee-like beverage. Used for tea/extract traditions rather than as food."
      },
      "use_roles": [
        "Tea",
        "Medicinal"
      ],
      "foraging_value": "Good tea / traditional use",
      "foraging_value_score": 3,
      "mushroom_card_note": "Birch conk used for tea/decoction; harvest conservatively and avoid cure-all thinking."
    },
    {
      "slug": "charcoal-burners-mild-flexible-gill-russulas",
      "display_name": "Charcoal burners / mild flexible-gill russulas",
      "common_name": "Charcoal burners / mild flexible-gill russulas",
      "category": "Mushroom",
      "notes": "Mild russula group.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/GT%20Charcoal%20Burner%2C%20Russula%20cyanoxantha.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Russula%20cyanoxantha%2001.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "general_notes": "Useful as a group entry because amateurs often meet the field concept before they sort out the exact Russula name. Flexible gills are a meaningful criterion here. Representative Commons images use Russula cyanoxantha to illustrate the mild flexible-gill charcoal-burner group.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Fair",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        7,
        8,
        9
      ],
      "food_role": "food",
      "look_alikes": [
        "short-stemmed-russula",
        "shrimp-russulas"
      ],
      "confused_with": [
        "short-stemmed-russula",
        "shrimp-russulas"
      ],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Forest soil"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "ring": [
          "None"
        ],
        "texture": [
          "Brittle cap",
          "Flexible gills"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None notable"
        ],
        "cap_surface": [
          "Smooth"
        ],
        "stem_feature": [
          "Brittle chalky stem"
        ],
        "spore_print": "White to cream",
        "gill_attachment": "Attached",
        "volva": "None",
        "season_note": "Summer into early fall in woods."
      },
      "commonness_score": 3,
      "food_quality_score": 3
    },
    {
      "slug": "chicken-of-the-woods",
      "display_name": "Chicken of the woods",
      "common_name": "Chicken of the woods",
      "category": "Mushroom",
      "notes": "Bright orange and yellow shelving bracket with pores below, not true gills.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "June",
        "July",
        "August",
        "September"
      ],
      "links": [
        "https://www.mushroomexpert.com/laetiporus_sulphureus.html",
        "https://www.mushroomexpert.com/laetiporus.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Laetiporus%20Sulphureus.JPG",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Chicken%20of%20the%20Woods%20-%20Laetiporus%20sulphureus%2C%20Point%20of%20View%2C%20Mason%20Neck%2C%20Virginia%20%2844536583375%29.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Chicken%20of%20the%20Woods%20Laetiporus%20sulphureus.jpg"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Good edible when young and tender. Cook thoroughly; some people get stomach upset, and old, tough, or bug-ridden shelves are not worth it.",
      "general_notes": "Some people react to it, especially older specimens or those from some conifers.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Conifer / softwood"
      ],
      "commonness": "Common",
      "food_quality": "Good",
      "non_edible_severity": "Edible with caution",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        6,
        7,
        8,
        9
      ],
      "food_role": "food",
      "look_alikes": [
        "jack-o-lantern"
      ],
      "confused_with": [
        "jack-o-lantern"
      ],
      "edibility_detail": "Good edible when young and tender, but not universally tolerated.",
      "mushroom_profile": {
        "underside": [
          "Pores"
        ],
        "substrate": [
          "Dead wood",
          "Living hardwoods",
          "Logs / stumps"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Conifer / softwood"
        ],
        "ring": [],
        "texture": [
          "Soft / fleshy"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None"
        ],
        "cap_surface": [
          "Bright orange shelves"
        ],
        "stem_feature": [
          "Shelf / no true stem"
        ],
        "spore_print": "White",
        "growth_form": [
          "Shelf / bracket"
        ],
        "fertile_surface": [
          "Pored underside"
        ],
        "branching_form": [
          "Overlapping shelves"
        ],
        "season_note": "Summer into early fall on trunks, stumps, and buried roots."
      },
      "commonness_score": 4,
      "food_quality_score": 4,
      "scientific_name": "Laetiporus sulphureus / Laetiporus spp.",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Good forage",
      "foraging_value_score": 4,
      "field_identification": "Bright orange/yellow overlapping shelves with a pore surface, growing from wood; host tree and pore color help separate Laetiporus species.",
      "mushroom_card_note": "Good edible shelf mushroom when young; host tree and tenderness matter."
    },
    {
      "slug": "coral-tooth-fungus",
      "display_name": "Coral tooth fungus",
      "common_name": "Coral tooth fungus",
      "category": "Mushroom",
      "notes": "White coral-like tooth fungus with many branches carrying hanging spines.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "August",
        "September",
        "October"
      ],
      "links": [
        "https://www.mushroomexpert.com/hericium_coralloides",
        "https://www.mushroomexpert.com/hericium.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Hericium-coralloides.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2009-09-25%20Hericium%20coralloides%20%28Scop.%29%20Pers%2058068.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2015-10-11%20Hericium%20coralloides%20%28Scop.%29%20Pers%20564137.jpg"
      ],
      "medicinal_uses": "Hericium species have medicinal/supplement interest, but this entry is treated primarily as food.",
      "culinary_uses": "Choice edible when young and white. Cook gently; older yellowing specimens lose quality.",
      "general_notes": "Another Hericium ally that benefits from side-by-side comparison with lion's mane and bear's head tooth.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Uncommon",
      "food_quality": "Choice",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        8,
        9,
        10
      ],
      "food_role": "food",
      "look_alikes": [
        "bear-s-head-tooth",
        "lion-s-mane"
      ],
      "confused_with": [
        "bear-s-head-tooth",
        "lion-s-mane"
      ],
      "edibility_detail": "Choice edible when fresh.",
      "mushroom_profile": {
        "underside": [
          "Teeth / spines"
        ],
        "substrate": [
          "Dead hardwood"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "ring": [],
        "texture": [
          "Soft / fleshy"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None"
        ],
        "cap_surface": [
          "White branching coral"
        ],
        "stem_feature": [
          "Branched from central base"
        ],
        "spore_print": "White",
        "growth_form": [
          "Coral / branched"
        ],
        "fertile_surface": [
          "Hanging teeth"
        ],
        "branching_form": [
          "Branched clusters"
        ],
        "season_note": "Late summer through fall on hardwood logs."
      },
      "commonness_score": 2,
      "food_quality_score": 5,
      "scientific_name": "Hericium coralloides",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Prime foraging",
      "foraging_value_score": 5,
      "field_identification": "Branched white Hericium with short teeth hanging in rows along the branches, usually on dead hardwood.",
      "mushroom_card_note": "Choice toothed edible; short teeth hang along delicate branches on hardwood."
    },
    {
      "slug": "destroying-angel",
      "display_name": "Destroying angel",
      "common_name": "Destroying angel",
      "category": "Mushroom",
      "notes": "Deadly white Amanita.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September"
      ],
      "links": [
        "https://www.mushroomexpert.com/amanita_bisporigera.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Amanita%20bisporigera%2017933.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Amanita%20bisporigera%2017932.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Amanita%20bisporigera%2097861769.jpg"
      ],
      "culinary_uses": "Deadly poisonous. No food use.",
      "non_edible_severity": "Deadly",
      "edibility_detail": "Avoid for food in this guide; keep as an identification/caution record.",
      "general_notes": "One of the highest-priority caution mushrooms in the guide. The combination of white gills, ring, and volva matters more than almost anything else in the gilled lane.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Conifer / softwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Not recommended",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        7,
        8,
        9
      ],
      "food_role": "avoid",
      "look_alikes": [
        "field-mushroom",
        "meadow-mushroom"
      ],
      "confused_with": [
        "field-mushroom",
        "meadow-mushroom"
      ],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Forest soil"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Conifer / softwood"
        ],
        "ring": [
          "Ring present"
        ],
        "texture": [
          "Fleshy"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None notable"
        ],
        "cap_surface": [
          "Smooth"
        ],
        "stem_feature": [
          "Bulbous base"
        ],
        "spore_print": "White",
        "gill_attachment": "Free",
        "volva": "Present",
        "season_note": "Mid to late summer into early fall in woods."
      },
      "commonness_score": 3,
      "food_quality_score": 1,
      "edibility_status": "not_edible",
      "edible_use": {
        "has_ingestible_use": false,
        "method": "",
        "preparation_required": false,
        "notes": "Deadly poisonous. No food use."
      },
      "scientific_name": "Amanita bisporigera group",
      "use_roles": [
        "Caution"
      ],
      "foraging_value": "Deadly — never forage for food",
      "foraging_value_score": 0,
      "medicinal_uses": "No medicinal use in this guide.",
      "field_identification": "Deadly white Amanita with white gills, ring, bulbous base, and a sack-like volva; the volva may be buried, so dig the base for ID.",
      "mushroom_card_note": "Deadly white Amanita. Never eat; confirm the base/volva when identifying."
    },
    {
      "slug": "dryad-s-saddle-pheasant-back",
      "display_name": "Dryad's saddle / pheasant back",
      "common_name": "Dryad's saddle / pheasant back",
      "category": "Mushroom",
      "notes": "Large tan-brown bracket with dark scales above and broad pores underneath.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "April",
        "May",
        "June"
      ],
      "links": [
        "https://mushroomexpert.com/fungionwood/poroid%20fungi/species%20pages/Cerioporus%20squamosus.htm",
        "https://www.nps.gov/articles/000/dryads-saddle.htm"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Cerioporus%20squamosus.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/0%20Polyporus%20squamosus.JPG",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2014-05-01%20Polyporus%20squamosus%20%28Huds.%29%20Fr%20418219.jpg"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Edible when very young and tender; older caps become leathery. Good sliced thin, sautéed, or dried for stock when still fragrant.",
      "non_edible_severity": "Edible young only",
      "edibility_detail": "Edible young only; quality drops quickly with age.",
      "general_notes": "Mostly worth collecting young; older specimens get leathery fast.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Common",
      "food_quality": "Fair",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        4,
        5,
        6
      ],
      "food_role": "food",
      "look_alikes": [
        "birch-polypore",
        "artist-s-conk"
      ],
      "confused_with": [
        "artist-s-conk"
      ],
      "mushroom_profile": {
        "underside": [
          "Pores"
        ],
        "substrate": [
          "Dead hardwood",
          "Living hardwoods",
          "Logs / stumps"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "ring": [],
        "texture": [
          "Toughening with age"
        ],
        "smell": [
          "Watermelon / cucumber"
        ],
        "staining": [
          "None"
        ],
        "cap_surface": [
          "Brown scaled top"
        ],
        "stem_feature": [
          "Short off-center stem"
        ],
        "spore_print": "White",
        "growth_form": [
          "Shelf / bracket"
        ],
        "fertile_surface": [
          "Large angular pores"
        ],
        "branching_form": [
          "Single or a few shelves"
        ],
        "season_note": "Most useful as a young spring mushroom before it toughens."
      },
      "commonness_score": 4,
      "food_quality_score": 3,
      "scientific_name": "Cerioporus squamosus",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Fair / best very young",
      "foraging_value_score": 3,
      "field_identification": "Large scaly tan-to-brown shelf with big angular pores and a watermelon-rind/cucumber-like odor.",
      "mushroom_card_note": "Fair edible only when young and tender; older pheasant backs are stock material at best."
    },
    {
      "slug": "false-morel-gyromitra-group",
      "display_name": "False morel / Gyromitra group",
      "common_name": "False morel / Gyromitra group",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "April",
        "May",
        "June"
      ],
      "links": [
        "https://www.mushroomexpert.com/gyromitra.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Gyromitra%20esculenta.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2007-04-02%20Gyromitra%20esculenta%20cropped.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Conifer%20false%20morel-%20Gyromitra%20esculenta%20%287320510562%29.jpg"
      ],
      "culinary_uses": "Do not eat. This group includes dangerous false morels with toxins that can cause serious illness or death.",
      "non_edible_severity": "Potentially deadly",
      "edibility_detail": "Avoid for food in this guide; keep as an identification/caution record.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Conifer / softwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Not recommended",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "commonness_score": 3,
      "food_quality_score": 1,
      "month_numbers": [
        4,
        5,
        6
      ],
      "look_alikes": [
        "black-morels",
        "half-free-morels",
        "yellow-morels"
      ],
      "confused_with": [
        "black-morels",
        "half-free-morels",
        "yellow-morels"
      ],
      "food_role": "avoid",
      "mushroom_profile": {
        "growth_form": [
          "Wrinkled cap with stem"
        ],
        "fertile_surface": [
          "Pitted / folded cap surface"
        ],
        "branching_form": [
          "Unbranched"
        ],
        "host_filter_tokens": [
          "Conifer / softwood"
        ],
        "substrate": [
          "Forest soil",
          "Duff"
        ],
        "season_note": "Usually encountered from April through June in the Upper Midwest / Great Lakes window."
      },
      "edibility_status": "not_edible",
      "edible_use": {
        "has_ingestible_use": false,
        "method": "",
        "preparation_required": false,
        "notes": ""
      },
      "scientific_name": "Gyromitra spp.",
      "use_roles": [
        "Caution"
      ],
      "foraging_value": "Potentially deadly — avoid",
      "foraging_value_score": 0,
      "medicinal_uses": "No medicinal use in this guide.",
      "field_identification": "Wrinkled, folded, brain-like cap rather than true pitted morel structure; interior may not be cleanly hollow like a true morel.",
      "mushroom_card_note": "False morel warning group. Do not treat as a food mushroom."
    },
    {
      "slug": "field-mushroom",
      "display_name": "Field mushroom",
      "common_name": "Field mushroom",
      "category": "Mushroom",
      "notes": "Open-ground agaric.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "August",
        "September",
        "October"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Agaricus%20campestris.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2010-08-07%20Agaricus%20campestris.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2010-08-07%20Agaricus%20campestris%20gills.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "non_edible_severity": "Edible with caution",
      "edibility_detail": "Treat as caution / not for meals in this guide until species-level edibility is clarified.",
      "general_notes": "One of the everyday 'looks like a store mushroom' entries, but still a caution species because white Amanitas and yellowing toxic Agaricus relatives complicate things.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "Occasional",
      "food_quality": "Good",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        8,
        9,
        10
      ],
      "food_role": "food",
      "look_alikes": [
        "destroying-angel",
        "meadow-mushroom"
      ],
      "confused_with": [
        "destroying-angel",
        "meadow-mushroom"
      ],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Grass",
          "Soil"
        ],
        "host_filter_tokens": [],
        "ring": [
          "Ring present"
        ],
        "texture": [
          "Fleshy"
        ],
        "smell": [
          "Mushroomy"
        ],
        "staining": [
          "May bruise slightly"
        ],
        "cap_surface": [
          "Smooth"
        ],
        "stem_feature": [
          "Central ringed stem"
        ],
        "spore_print": "Dark brown",
        "gill_attachment": "Free",
        "volva": "None",
        "season_note": "Late summer through fall in open grassy ground."
      },
      "commonness_score": 3,
      "food_quality_score": 4,
      "hidden": true,
      "duplicate_of": "meadow-mushroom",
      "legacy_alias": true,
      "list_visibility": "hidden-duplicate",
      "duplicate_note": "Duplicate Field/Meadow Mushroom record kept only as a legacy slug alias."
    },
    {
      "slug": "giant-puffball",
      "display_name": "Giant puffball",
      "common_name": "Giant puffball",
      "category": "Mushroom",
      "notes": "Only edible when the interior is pure white and uniform all the way through.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "August",
        "September",
        "October"
      ],
      "links": [
        "https://www.mushroomexpert.com/calvatia_gigantea"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Calvatia%20gigantea.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/20120629Calvatia%20gigantea1.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/20190524Calvatia%20gigantea1.jpg"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Good edible only while the interior is pure white and uniform. Slice open every specimen; discard any yellowing, browning, developing gills, or odd structure.",
      "general_notes": "A cut-open check is mandatory because immature deadly amanitas can fool people when still buttoned.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "Occasional",
      "food_quality": "Good",
      "non_edible_severity": "Edible with caution",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        8,
        9,
        10
      ],
      "food_role": "food",
      "look_alikes": [
        "earthballs",
        "destroying-angel"
      ],
      "confused_with": [
        "earthballs",
        "destroying-angel"
      ],
      "edibility_detail": "Good edible when young and solid white inside.",
      "mushroom_profile": {
        "underside": [
          "None / enclosed gleba"
        ],
        "substrate": [
          "Ground",
          "Meadow",
          "Forest edge / openings"
        ],
        "host_filter_tokens": [],
        "ring": [],
        "texture": [
          "Soft white interior when young"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "Interior yellows/browns with age"
        ],
        "cap_surface": [
          "Smooth white outer skin"
        ],
        "stem_feature": [
          "No real stem"
        ],
        "spore_print": "Olive-brown at maturity",
        "growth_form": [
          "Puffball"
        ],
        "fertile_surface": [
          "Internal spore mass"
        ],
        "branching_form": [
          "Single ball"
        ],
        "season_note": "Late summer into fall in open ground and edges."
      },
      "commonness_score": 3,
      "food_quality_score": 4,
      "scientific_name": "Calvatia gigantea",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Good forage",
      "foraging_value_score": 4,
      "field_identification": "Large white ball-like puffball with no developing cap, stem, gills, or internal outline when cut open.",
      "mushroom_card_note": "Good edible only when cut-open flesh is pure white all the way through."
    },
    {
      "slug": "half-free-morels",
      "display_name": "Half-free morels",
      "common_name": "Half-free morels",
      "category": "Mushroom",
      "notes": "Cap hangs partly free from the stem rather than being attached all the way down.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "April",
        "May"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Morchella%20punctipes%20202600.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2013-04-15%20Morchella%20punctipes%20Peck%20%281903%29%20322536.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Morchella%20punctipes%20205457.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "general_notes": "Still a true morel-type mushroom, but the partial cap attachment is the key field mark.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Good",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        4,
        5
      ],
      "food_role": "food",
      "look_alikes": [
        "black-morels",
        "false-morel-gyromitra-group"
      ],
      "confused_with": [
        "black-morels",
        "false-morel-gyromitra-group"
      ],
      "edibility_detail": "Good edible.",
      "mushroom_profile": {
        "underside": [
          "Pitted / ridged"
        ],
        "substrate": [
          "Forest soil",
          "Floodplain edges"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "ring": [],
        "texture": [
          "Fleshy / hollow"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None"
        ],
        "cap_surface": [
          "Ridged pits"
        ],
        "stem_feature": [
          "Cap attached only near top / half-free"
        ],
        "spore_print": "Pale cream",
        "growth_form": [
          "Morel"
        ],
        "fertile_surface": [
          "Outer ridges and pits"
        ],
        "branching_form": [
          "Single fruitbody"
        ],
        "season_note": "Spring morel season, often slightly earlier or alongside other morels."
      },
      "commonness_score": 3,
      "food_quality_score": 4
    },
    {
      "slug": "hedgehog-mushrooms",
      "display_name": "Hedgehog mushrooms",
      "common_name": "Hedgehog mushrooms",
      "category": "Mushroom",
      "notes": "Instead of gills or pores, these have short dangling teeth under the cap.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "August",
        "September",
        "October"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Hydnum%20repandum.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2012-08-29%20Hydnum%20repandum%20L%20256175.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Hedgehog%20fungi.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "general_notes": "One of the friendlier edible groups because the tooth underside is distinctive.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Conifer / softwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Choice",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        8,
        9,
        10
      ],
      "food_role": "food",
      "look_alikes": [
        "smooth-chanterelles",
        "yellowfoot-chanterelle"
      ],
      "confused_with": [
        "smooth-chanterelles"
      ],
      "edibility_detail": "Choice edible.",
      "mushroom_profile": {
        "underside": [
          "Teeth / spines"
        ],
        "substrate": [
          "Forest soil"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Conifer / softwood"
        ],
        "ring": [],
        "texture": [
          "Fleshy / firm"
        ],
        "smell": [
          "Mild fruity"
        ],
        "staining": [
          "None"
        ],
        "cap_surface": [
          "Dry cap"
        ],
        "stem_feature": [
          "Solid stem"
        ],
        "spore_print": "White",
        "growth_form": [
          "Cap and stem"
        ],
        "fertile_surface": [
          "Hanging teeth"
        ],
        "branching_form": [
          "Single fruitbody"
        ],
        "season_note": "Late summer through fall in mixed woods."
      },
      "commonness_score": 3,
      "food_quality_score": 5
    },
    {
      "slug": "hemlock-varnish-shelf-reishi",
      "display_name": "Hemlock varnish shelf / reishi",
      "common_name": "Hemlock varnish shelf / reishi",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ganoderma%20tsugae.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ganoderma%20tsugae%20123102289.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ganoderma%20tsugae%20Vermont%2C%20USA.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "non_edible_severity": "Non-culinary / tea",
      "edibility_detail": "Treat as caution / not for meals in this guide until species-level edibility is clarified.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Conifer / softwood",
        "Hemlock"
      ],
      "commonness": "Occasional",
      "food_quality": "Not recommended",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "commonness_score": 3,
      "food_quality_score": 1,
      "month_numbers": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "look_alikes": [
        "artist-s-conk",
        "red-belted-conk"
      ],
      "confused_with": [
        "artist-s-conk",
        "red-belted-conk"
      ],
      "food_role": "avoid",
      "mushroom_profile": {
        "growth_form": [
          "Bracket / shelf"
        ],
        "fertile_surface": [
          "Folds, pores, or irregular surface"
        ],
        "branching_form": [
          "Unbranched"
        ],
        "host_filter_tokens": [
          "Conifer / softwood",
          "Hemlock"
        ],
        "substrate": [
          "Dead wood"
        ],
        "season_note": "Usually encountered from January through December in the Upper Midwest / Great Lakes window."
      }
    },
    {
      "slug": "hen-of-the-woods",
      "display_name": "Hen of the woods",
      "common_name": "Hen of the woods",
      "category": "Mushroom",
      "notes": "Large clustered rosette of overlapping fronds at the base of oaks and other hardwoods.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "September",
        "October"
      ],
      "links": [
        "https://www.mushroomexpert.com/grifola_frondosa"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Grifola%20frondosa.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Autumn%20mushrooms%201%20Hen%20of%20the%20woods%20%28Grifola%20frondosa%29%20%284035115888%29.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Cultivated%20grifola%20frondosa.jpg"
      ],
      "medicinal_uses": "Maitake has supplement interest, but this guide treats wild hens mainly as a prime food mushroom.",
      "culinary_uses": "Choice edible; trim away tough bases, clean well, and cook. Excellent sautéed, roasted, dried, or used in soups and gravies.",
      "general_notes": "A good host-linked species and one of the better fall edible clusters.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Oak"
      ],
      "commonness": "Occasional",
      "food_quality": "Choice",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        9,
        10
      ],
      "food_role": "food",
      "look_alikes": [
        "black-staining-polypore",
        "cauliflower-mushroom"
      ],
      "confused_with": [
        "black-staining-polypore"
      ],
      "edibility_detail": "Choice edible.",
      "mushroom_profile": {
        "underside": [
          "Pores"
        ],
        "substrate": [
          "At base of hardwoods",
          "Roots / buried wood"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Oak"
        ],
        "ring": [],
        "texture": [
          "Fleshy / layered"
        ],
        "smell": [
          "Rich earthy"
        ],
        "staining": [
          "Blackens when old or bruised slightly"
        ],
        "cap_surface": [
          "Gray-brown fan caps"
        ],
        "stem_feature": [
          "Clustered branching base"
        ],
        "spore_print": "White",
        "growth_form": [
          "Rosette cluster"
        ],
        "fertile_surface": [
          "Pored underside"
        ],
        "branching_form": [
          "Many overlapping fronds"
        ],
        "season_note": "Mostly fall, especially at oak bases."
      },
      "commonness_score": 3,
      "food_quality_score": 5,
      "scientific_name": "Grifola frondosa",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Prime foraging",
      "foraging_value_score": 5,
      "field_identification": "Large gray-brown rosette of many overlapping fronds at the base of oak or other hardwoods; pores underneath.",
      "mushroom_card_note": "Prime fall mushroom; look for recurring rosettes at hardwood bases, especially oak."
    },
    {
      "slug": "honey-mushrooms",
      "display_name": "Honey mushrooms",
      "common_name": "Honey mushrooms",
      "category": "Mushroom",
      "notes": "Clustered gilled mushrooms on wood and roots.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "August",
        "September",
        "October"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Armillaria%20mellea%207724.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2010-09-30%20Armillaria%20mellea%20s.str.%20cropped.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2015.10.10.-01-Viernheim--Honiggelber%20Hallimasch.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "non_edible_severity": "Edible with caution",
      "edibility_detail": "Treat as caution / not for meals in this guide until species-level edibility is clarified.",
      "general_notes": "A practical U.P. gilled entry because people do find them, but they belong in the 'edible with caution' bucket and need comparison against jack-o'-lantern.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Conifer / softwood"
      ],
      "commonness": "Common",
      "food_quality": "Fair",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        8,
        9,
        10
      ],
      "food_role": "food",
      "look_alikes": [
        "jack-o-lantern"
      ],
      "confused_with": [
        "jack-o-lantern"
      ],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Wood",
          "Buried roots"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Conifer / softwood"
        ],
        "ring": [
          "Ring present"
        ],
        "texture": [
          "Fibrous stem",
          "Fleshy cap"
        ],
        "smell": [
          "Mushroomy"
        ],
        "staining": [
          "None notable"
        ],
        "cap_surface": [
          "Dry",
          "Often with small scales"
        ],
        "stem_feature": [
          "Clustered ringed stems"
        ],
        "spore_print": "White",
        "gill_attachment": "Attached",
        "volva": "None",
        "season_note": "Mostly late summer through fall in clusters on wood or roots."
      },
      "commonness_score": 4,
      "food_quality_score": 3
    },
    {
      "slug": "jack-o-lantern",
      "display_name": "Jack-o'-lantern",
      "common_name": "Jack-o'-lantern",
      "category": "Mushroom",
      "notes": "Poisonous gilled wood-rotting mushroom.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September",
        "October"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Omphalotus%20illudens%20%2821630755718%29.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/081224%20Jack%20O%27%20Lantern%20NC.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2012-08-12%20Omphalotus%20illudens%20%28Schwein.%29%20Bresinsky%20%26%20Besl%20248346.jpg"
      ],
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "non_edible_severity": "Poisonous",
      "edibility_detail": "Avoid for food in this guide; keep as an identification/caution record.",
      "general_notes": "This should stay in the caution side of the app. It is a key chanterelle look-alike and belongs in the gilled lane, not 'other'.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Not recommended",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        7,
        8,
        9,
        10
      ],
      "food_role": "avoid",
      "look_alikes": [
        "yellow-chanterelles-hardwood-associated-complex",
        "yellow-chanterelles-conifer-associated-complex",
        "yellowfoot-chanterelle"
      ],
      "confused_with": [
        "yellow-chanterelles-hardwood-associated-complex",
        "yellow-chanterelles-conifer-associated-complex",
        "yellowfoot-chanterelle",
        "honey-mushrooms"
      ],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Wood",
          "Buried hardwood roots"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "ring": [
          "None"
        ],
        "texture": [
          "Fleshy"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None notable"
        ],
        "cap_surface": [
          "Smooth"
        ],
        "stem_feature": [
          "Clustered stems"
        ],
        "spore_print": "Cream to pale yellow",
        "gill_attachment": "Decurrent",
        "volva": "None",
        "season_note": "Late summer through fall on hardwood stumps, logs, and roots."
      },
      "commonness_score": 3,
      "food_quality_score": 1,
      "edibility_status": "not_edible",
      "edible_use": {
        "has_ingestible_use": false,
        "method": "",
        "preparation_required": false,
        "notes": ""
      }
    },
    {
      "slug": "king-bolete",
      "display_name": "King Bolete",
      "common_name": "King Bolete",
      "category": "Mushroom",
      "notes": "King Bolete / porcini is kept as a practical field-guide page, but North American Boletus edulis-like mushrooms are taxonomically messy. Treat this as an edulis-group/porcini-style entry unless a collection is confirmed to species level.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September",
        "October"
      ],
      "links": [
        "https://www.mushroomexpert.com/boletus_edulis.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Boletus%20edulis.jpg"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Choice edible when a true porcini-type bolete is confidently identified and cooked; avoid bitter, staining, old, buggy, or waterlogged specimens.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "bolete",
      "reviewReasons": [
        "Needs regional/taxonomy confirmation for North American Boletus edulis group",
        "Regional/taxonomy confirmation for the North American Boletus edulis group"
      ],
      "review_status": "needs_review",
      "search_aliases": [
        "boletus-edulis",
        "King Bolete",
        "Boletus edulis",
        "Porcini",
        "Cep"
      ],
      "host_filter_tokens": [],
      "commonness": "Occasional",
      "food_quality": "Choice",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "commonness_score": 3,
      "food_quality_score": 5,
      "month_numbers": [
        7,
        8,
        9,
        10
      ],
      "look_alikes": [
        "false-king-bolete",
        "bitter-bolete"
      ],
      "confused_with": [
        "false-king-bolete",
        "true-bitter-bolete"
      ],
      "edibility_detail": "Highly regarded.",
      "food_role": "food",
      "mushroom_profile": {
        "cap_surface": [
          "Dry to slightly tacky"
        ],
        "stem_feature": [
          "Smooth to netted stem",
          "Reticulate/netted stem"
        ],
        "pore_color": [
          "Whitish to yellow pores"
        ],
        "growth_form": [
          "Cap and stem"
        ],
        "fertile_surface": [
          "Pores"
        ],
        "fruitbody_shape": [
          "Convex cap with central stem"
        ],
        "season_note": "Usually encountered from July through October in the Upper Midwest / Great Lakes window.",
        "scientific_name": "Boletus edulis / Boletus edulis group",
        "entry_scope": "species",
        "edibility_status": "review_required",
        "caution_level": "medium",
        "summary": "Minimal bolete seed entry for King Bolete. Added in the Michigan audit pass; fuller ID notes, sources, and images still need review.",
        "ecology": "bolete",
        "substrate": [
          "Forest soil"
        ],
        "wood_type": [],
        "host_trees": [],
        "host_certainty": "unknown",
        "underside": [
          "Pores"
        ],
        "ring": "Unknown",
        "texture": [
          "Fleshy / firm"
        ],
        "odor": "Unknown",
        "staining": [
          "Unknown",
          "No notable bruising"
        ],
        "taste": [
          "Mild / pleasant"
        ],
        "spore_print": "",
        "processing_required": [],
        "research_notes": [
          "Species seed added from the Michigan bolete audit.",
          "Needs image coverage.",
          "Needs source links and fuller field notes."
        ]
      },
      "common_names": [
        "King Bolete",
        "Porcini",
        "Cep"
      ],
      "manual_review_reasons": [
        "needs image coverage",
        "needs source links",
        "needs species-level notes review"
      ],
      "scientific_name": "Boletus edulis",
      "needs_review": true,
      "review_reasons": [
        "Needs regional/taxonomy confirmation for North American Boletus edulis group",
        "Regional/taxonomy confirmation for the North American Boletus edulis group"
      ],
      "review_note": "Needs review: regional/taxonomy confirmation for the North American Boletus edulis group.",
      "review_notes": "Needs review: regional/taxonomy confirmation for the North American Boletus edulis group.",
      "mushroom_family": "Porcini & brown allies",
      "boleteGroup": [
        "Porcini & brown allies"
      ],
      "boleteSubgroup": [
        "Boletus",
        "Brown cap allies"
      ],
      "weekPrecision": "needs-review",
      "primary_type": "mushroom",
      "is_medicinal": false,
      "is_non_edible": false,
      "hidden": true,
      "duplicate_of": "king-bolete",
      "legacy_alias": true,
      "list_visibility": "hidden-duplicate",
      "duplicate_note": "Duplicate King Bolete record kept only as a legacy slug alias.",
      "former_slugs": [
        "boletus-edulis"
      ],
      "aliases": [
        "boletus-edulis",
        "porcini",
        "cep"
      ],
      "images_structured": [
        {
          "thumb": "https://commons.wikimedia.org/wiki/Special:FilePath/Boletus%20edulis.jpg",
          "detail": "https://commons.wikimedia.org/wiki/Special:FilePath/Boletus%20edulis.jpg",
          "full": "https://commons.wikimedia.org/wiki/Special:FilePath/Boletus%20edulis.jpg",
          "source": "Wikimedia Commons",
          "title": "Boletus edulis.jpg",
          "part_or_stage": "Field photo",
          "source_page": "https://commons.wikimedia.org/wiki/File:Boletus_edulis.jpg",
          "credit": "Wikimedia Commons",
          "license": "See Wikimedia Commons file page"
        }
      ],
      "use_links": [
        {
          "label": "MushroomExpert: Boletus edulis",
          "url": "https://www.mushroomexpert.com/boletus_edulis.html",
          "link_type": "identification",
          "applies_to_part": "whole mushroom",
          "source_quality": "mycology reference",
          "notes": "Edulis-group traits and caution that North American edulis-like mushrooms are taxonomically complex."
        }
      ],
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Prime foraging — species group needs care",
      "foraging_value_score": 5,
      "mushroom_card_note": "Prime bolete/porcini-type food mushroom, but North American Boletus edulis-group naming needs caution.",
      "field_identification": "Porcini-type bolete with firm flesh, whitish-to-yellowish pore surface, and netted stem; avoid bitter or staining look-alikes."
    },
    {
      "slug": "king-oyster",
      "display_name": "King oyster",
      "common_name": "King oyster",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "September",
        "October",
        "November"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Pleurotus%20eryngii%2001.JPG",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2007-05-18%20Pleurotus%20eryngii%20%28DC.%29%20Gillet%20461699.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2016-11-13%20Pleurotus%20eryngii%20%28DC.%29%20Gillet%20691527.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "non_edible_severity": "Range review",
      "edibility_detail": "Avoid for food in this guide; keep as an identification/caution record.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Rare",
      "food_quality": "Not recommended",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "commonness_score": 1,
      "food_quality_score": 1,
      "month_numbers": [
        9,
        10,
        11
      ],
      "look_alikes": [
        "pearl-oyster",
        "phoenix-oyster-summer-oyster"
      ],
      "confused_with": [
        "pearl-oyster",
        "phoenix-oyster-summer-oyster"
      ],
      "food_role": "avoid",
      "mushroom_profile": {
        "gill_attachment": "Decurrent",
        "gill_spacing": "Close to medium",
        "gill_color": "Variable with age",
        "cap_surface": [
          "Smooth"
        ],
        "stem_feature": [
          "Fibrous stem"
        ],
        "volva": "Absent",
        "spore_print": "White",
        "growth_form": [
          "Cap and stem"
        ],
        "fertile_surface": [
          "Gills"
        ],
        "fruitbody_shape": [
          "Cap with stem"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "substrate": [
          "Dead wood"
        ],
        "season_note": "Usually encountered from September through November in the Upper Midwest / Great Lakes window."
      },
      "edibility_status": "not_edible",
      "edible_use": {
        "has_ingestible_use": false,
        "method": "",
        "preparation_required": false,
        "notes": ""
      }
    },
    {
      "slug": "larch-suillus",
      "display_name": "Larch Suillus",
      "common_name": "Larch Suillus",
      "category": "Mushroom",
      "notes": "Larch Suillus is treated here as Suillus clintonianus, the North American larch/tamarack-associated species often shown in older guides as Suillus grevillei. Check for larch/tamarack nearby.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September"
      ],
      "links": [
        "https://www.mushroomexpert.com/suillus_clintonianus.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Suillus%20clintonianus%20%28Peck%29%20Kuntze%20374653.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Suillus%20clintonianus%20%28Peck%29%20Kuntze%20374654.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Suillus%20clintonianus%20%28Peck%29%20Kuntze%20805098.jpg"
      ],
      "medicinal_uses": "Primarily culinary/ID interest in this guide.",
      "culinary_uses": "Edible when young and carefully prepared, but sticky cap skin and soft texture make it less desirable than prime boletes. Best cooked; peel slimy cap skin if objectionable.",
      "non_edible_severity": "Edible with caution",
      "edibility_detail": "Treat as caution / not for meals in this guide until species-level edibility is clarified.",
      "month_numbers": [
        7,
        8,
        9
      ],
      "scientific_name": "Suillus clintonianus",
      "mushroom_profile": {
        "scientific_name": "Suillus clintonianus",
        "entry_scope": "species",
        "edibility_status": "good",
        "caution_level": "low",
        "summary": "Minimal bolete seed entry for Larch Suillus. Added in the Michigan / Upper Midwest bolete pass; fuller ID notes, sources, and images still need review.",
        "ecology": "bolete",
        "substrate": [
          "Forest soil"
        ],
        "wood_type": [],
        "host_trees": [
          "Tamarack / larch",
          "Larch"
        ],
        "host_certainty": "low",
        "underside": [
          "Pores"
        ],
        "ring": "Ring present",
        "texture": [
          "Fleshy / firm"
        ],
        "odor": "Unknown",
        "staining": [
          "Not a strong blue-stainer"
        ],
        "taste": [
          "Mild / not distinctive"
        ],
        "spore_print": "",
        "season_note": "Usually encountered from July through September in the Upper Midwest / Great Lakes window.",
        "processing_required": [],
        "research_notes": [
          "Species seed added from the Michigan / Upper Midwest bolete pass.",
          "Needs source links and fuller field notes."
        ],
        "cap_surface": [
          "Brownish red cap",
          "Sticky / slimy when fresh"
        ],
        "stem_feature": [
          "Glandular dots or smooth stem"
        ],
        "pore_color": [
          "Yellow pores"
        ],
        "growth_form": [
          "Cap and stem"
        ],
        "fertile_surface": [
          "Pores"
        ],
        "fruitbody_shape": [
          "Convex cap with central stem"
        ],
        "host_filter_tokens": [
          "Conifer / softwood",
          "Tamarack / larch"
        ]
      },
      "manual_review_reasons": [],
      "mushroom_family": "Suillus / slippery jacks",
      "boleteGroup": [
        "Suillus / slippery jacks"
      ],
      "boleteSubgroup": [
        "Larch / tamarack associates",
        "Ring present"
      ],
      "weekPrecision": "needs-review",
      "primary_type": "mushroom",
      "is_medicinal": false,
      "is_non_edible": false,
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "bolete",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Conifer / softwood",
        "Tamarack / larch"
      ],
      "commonness": "Occasional",
      "food_quality": "Fair",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "commonness_score": 3,
      "food_quality_score": 3,
      "look_alikes": [
        "butterball",
        "slippery-jack"
      ],
      "confused_with": [
        "butterball",
        "slippery-jack"
      ],
      "food_role": "food",
      "needs_review": false,
      "review_reasons": [],
      "review_note": "",
      "review_notes": "",
      "use_links": [
        {
          "label": "MushroomExpert: Suillus clintonianus",
          "url": "https://www.mushroomexpert.com/suillus_clintonianus.html",
          "link_type": "identification",
          "applies_to_part": "whole mushroom",
          "source_quality": "mycology reference",
          "notes": "North American larch/tamarack Suillus; separated from European Suillus grevillei."
        }
      ],
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Fair / sticky-cap Suillus",
      "foraging_value_score": 2,
      "field_identification": "Sticky orange-yellow to reddish Suillus associated with larch/tamarack; check for nearby larch and a slimy cap.",
      "mushroom_card_note": "Fair Suillus tied to larch/tamarack; edible but not a prime bolete."
    },
    {
      "slug": "lion-s-mane",
      "display_name": "Lion's mane",
      "common_name": "Lion's mane",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "August",
        "September",
        "October",
        "November"
      ],
      "links": [
        "https://www.mushroomexpert.com/hericium_erinaceus.html",
        "https://www.mushroomexpert.com/hericium.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/2006-11-03%20Hericium%20erinaceus%20crop.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Bearded%20Hedgehog%20-%20Hericium%20erinaceus%2C%20Occoquan%20Bay%20National%20Wildlife%20Refuge%2C%20Woodbridge%2C%20Virginia.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2012-10-02%20Hericium%20erinaceus%20%28Bull.%29%20Pers%20268392.jpg"
      ],
      "medicinal_uses": "Traditional and modern supplement interest exists, especially around cognition/gut health, but human evidence is still limited; this app treats it as food first.",
      "culinary_uses": "Choice edible when young and white. Slice or tear and brown well; texture works nicely for crab-cake style preparations, sautés, and soups.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Uncommon",
      "food_quality": "Choice",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "commonness_score": 2,
      "food_quality_score": 5,
      "month_numbers": [
        8,
        9,
        10,
        11
      ],
      "look_alikes": [
        "bear-s-head-tooth",
        "coral-tooth-fungus"
      ],
      "confused_with": [
        "bear-s-head-tooth",
        "coral-tooth-fungus"
      ],
      "edibility_detail": "Highly regarded.",
      "food_role": "food",
      "mushroom_profile": {
        "growth_form": [
          "Irregular fleshy fruitbody"
        ],
        "fertile_surface": [
          "Teeth / spines"
        ],
        "branching_form": [
          "Unbranched"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "substrate": [
          "Dead wood"
        ],
        "season_note": "Usually encountered from August through November in the Upper Midwest / Great Lakes window."
      },
      "scientific_name": "Hericium erinaceus",
      "use_roles": [
        "Food",
        "Medicinal"
      ],
      "foraging_value": "Prime foraging",
      "foraging_value_score": 5,
      "field_identification": "Unbranched clump of long dangling white teeth, usually from wounds on living or recently cut hardwood.",
      "mushroom_card_note": "Prime Hericium: unbranched white pom-pom of hanging teeth; food first, medicinal claims second."
    },
    {
      "slug": "lobster-mushroom",
      "display_name": "Lobster mushroom",
      "common_name": "Lobster mushroom",
      "category": "Mushroom",
      "notes": "A parasitized mushroom turned bright orange-red and dense, usually from a russula or milkcap host.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/%27Lobster%20Mushroom%27%20%28mold%29%2C%20Hypomyces%20lactifluorum%20%289818972044%29.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2014-08-03%20Hypomyces%20lactifluorum%20%28Schwein.%29%20Tul.%20%26%20C.%20Tul%20440594.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Hypomyces%20lactifluorum%20%28Lobster%20mushroom%29.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "general_notes": "Best learned as a transformation fungus rather than a normal cap-and-gill mushroom.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Conifer / softwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Good",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        7,
        8,
        9
      ],
      "food_role": "food",
      "look_alikes": [
        "jack-o-lantern",
        "red-chanterelles-cinnabars"
      ],
      "confused_with": [
        "jack-o-lantern"
      ],
      "edibility_detail": "Good edible when fresh and not waterlogged or buggy.",
      "mushroom_profile": {
        "underside": [
          "Deformed / obscured"
        ],
        "substrate": [
          "Forest soil"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Conifer / softwood"
        ],
        "ring": [],
        "texture": [
          "Firm dense flesh"
        ],
        "smell": [
          "Seafood-like"
        ],
        "staining": [
          "Orange-red exterior"
        ],
        "cap_surface": [
          "Orange-red crust"
        ],
        "stem_feature": [
          "Distorted host mushroom form"
        ],
        "spore_print": "Usually not useful",
        "growth_form": [
          "Parasitized irregular cap"
        ],
        "fertile_surface": [
          "Often obscured by parasite"
        ],
        "branching_form": [
          "Single distorted fruitbody"
        ],
        "season_note": "Summer into early fall where Russula/Lactarius hosts fruit."
      },
      "commonness_score": 3,
      "food_quality_score": 4
    },
    {
      "slug": "meadow-mushroom",
      "display_name": "Meadow / Field Mushroom",
      "common_name": "Meadow / Field Mushroom",
      "category": "Mushroom",
      "notes": "Grassy-ground agaric.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "June",
        "July",
        "August",
        "September",
        "October"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/2010-08-07%20Agaricus%20campestris.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2010-08-07%20Agaricus%20campestris%20gills.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Agaricus%20campestris.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "non_edible_severity": "Edible with caution",
      "edibility_detail": "Treat as caution / not for meals in this guide until species-level edibility is clarified.",
      "general_notes": "Useful as a separate gilled entry because people do encounter it in lawns and meadows, but it still belongs in the caution-aware edible category.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [
        "field-mushroom",
        "Field mushroom",
        "Meadow mushroom",
        "Agaricus campestris"
      ],
      "host_filter_tokens": [],
      "commonness": "Occasional",
      "food_quality": "Good",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        6,
        7,
        8,
        9,
        10
      ],
      "food_role": "food",
      "look_alikes": [
        "destroying-angel",
        "field-mushroom"
      ],
      "confused_with": [
        "destroying-angel",
        "field-mushroom",
        "meadow-mushroom"
      ],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Grass",
          "Soil"
        ],
        "host_filter_tokens": [],
        "ring": [
          "Ring present"
        ],
        "texture": [
          "Fleshy"
        ],
        "smell": [
          "Mushroomy"
        ],
        "staining": [
          "May bruise slightly"
        ],
        "cap_surface": [
          "Smooth"
        ],
        "stem_feature": [
          "Central ringed stem"
        ],
        "spore_print": "Dark brown",
        "gill_attachment": "Free",
        "volva": "None",
        "season_note": "Summer through fall in open grass."
      },
      "commonness_score": 3,
      "food_quality_score": 4,
      "common_names": [
        "field-mushroom",
        "Field mushroom",
        "Meadow mushroom",
        "Agaricus campestris"
      ],
      "scientific_name": "Agaricus campestris group"
    },
    {
      "slug": "old-man-of-the-woods",
      "display_name": "Old Man of the Woods",
      "common_name": "Old Man of the Woods",
      "category": "Mushroom",
      "notes": "Old Man of the Woods is kept under the common-name slug. The former scientific-name slug strobilomyces-strobilaceus has been merged here to avoid duplicate listings.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September",
        "October"
      ],
      "links": [
        "https://www.mushroomexpert.com/strobilomyces_floccopus.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Strobilomyces%20strobilaceus%205.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2006-09-03%20Strobilomyces%20strobilaceus%201.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/2006-09-03%20Strobilomyces%20strobilaceus%202.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Strobilomyces%20strobilaceus%206.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Strobilomyces%20strobilaceus%203.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Edible by some accounts when young, but usually poor quality; included mainly because it is distinctive and useful for ID practice.",
      "non_edible_severity": "",
      "edibility_detail": "Not a prime edible. Use only young, firm specimens if at all; older specimens are poor-textured and unappealing.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "bolete",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [
        "strobilomyces-strobilaceus",
        "Old Man of the Woods",
        "Strobilomyces sp. / Strobilomyces floccopus group"
      ],
      "host_filter_tokens": [
        "Hardwood",
        "Oak"
      ],
      "commonness": "Occasional",
      "food_quality": "Poor",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "scientific_name": "Strobilomyces sp. / Strobilomyces floccopus group",
      "food_role": "food",
      "edibility_status": "edible_with_caution",
      "field_identification": "Distinctive gray-black woolly/scaly bolete with a shaggy cap and stem. Pores start whitish-gray and darken; cut flesh turns pinkish or red, then blackens over time.",
      "month_numbers": [
        7,
        8,
        9,
        10
      ],
      "weekPrecision": "species-level-reviewed",
      "use_links": [
        {
          "label": "MushroomExpert: Old Man of the Woods",
          "url": "https://www.mushroomexpert.com/strobilomyces_floccopus.html",
          "link_type": "identification",
          "applies_to_part": "whole mushroom",
          "source_quality": "mycology reference",
          "notes": "Scaly cap, pore color, hardwood association, and staining progression."
        }
      ],
      "boleteGroup": [
        "Oddballs / veined / shaggy boletes"
      ],
      "boleteSubgroup": [
        "Strobilomyces",
        "Shaggy / blackening boletes"
      ],
      "mushroom_profile": {
        "lane": "bolete",
        "substrate": [
          "Forest soil"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Oak"
        ],
        "host_trees": [
          "Oak",
          "Hardwoods"
        ],
        "underside": [
          "Pores"
        ],
        "pore_color": [
          "Whitish to gray pores becoming blackish"
        ],
        "staining": [
          "Flesh reddens then blackens",
          "Unknown"
        ],
        "cap_surface": [
          "Dry",
          "Woolly black scales over gray-white base"
        ],
        "stem_feature": [
          "Shaggy stem",
          "Possible ring zone"
        ],
        "texture": [
          "Fleshy becoming coarse",
          "Fleshy / firm"
        ],
        "smell": [
          "Mild / not distinctive"
        ],
        "taste": [
          "Mild / not distinctive"
        ],
        "season_note": "Summer and fall; often July through October.",
        "scientific_name": "Strobilomyces strobilaceus",
        "entry_scope": "species",
        "edibility_status": "review_required",
        "caution_level": "medium",
        "summary": "Minimal bolete seed entry for Old Man of the Woods. Added in the Michigan audit pass; fuller ID notes, sources, and images still need review.",
        "ecology": "bolete",
        "wood_type": [],
        "host_certainty": "unknown",
        "ring": "Unknown",
        "odor": "Unknown",
        "spore_print": "",
        "processing_required": [],
        "research_notes": [
          "Species seed added from the Michigan bolete audit.",
          "Needs source links and fuller field notes."
        ]
      },
      "primary_type": "mushroom",
      "review_reasons": [],
      "manual_review_reasons": [],
      "common_names": [
        "Old Man of the Woods"
      ],
      "kingdom_type": "mushroom",
      "species_scope": "species",
      "foraging_class": "mushroom",
      "season_months": [
        7,
        8,
        9,
        10
      ],
      "habitats": [],
      "look_alikes": [],
      "look_alike_risk": "",
      "look_alike_notes": "",
      "rare_profile": null,
      "overview": "",
      "other_uses": "",
      "edibility_notes": "Edible by some accounts when young, but usually poor quality; included mainly because it is distinctive and useful for ID practice. Not a prime edible.",
      "curation_notes": [
        "Original app species restored into the standalone modular build.",
        "Recreated locally from the original app baseline checklist for the modular standalone build."
      ],
      "edible_use": {
        "has_ingestible_use": true,
        "method": "Food",
        "preparation_required": false,
        "notes": "Edible by some accounts when young, but usually poor quality; included mainly because it is distinctive and useful for ID practice. Not a prime edible."
      },
      "medicinal": {
        "has_meaningful_content": false,
        "summary": "",
        "evidence_tier": "",
        "actions": [],
        "body_systems": [],
        "medical_terms": [],
        "parts_used": [],
        "preparation_notes": "",
        "warnings": "",
        "claims": []
      },
      "mushroom_family": "Shaggy & scaly oddballs",
      "is_medicinal": false,
      "is_non_edible": false,
      "hidden": true,
      "duplicate_of": "old-man-of-the-woods",
      "legacy_alias": true,
      "list_visibility": "hidden-duplicate",
      "duplicate_note": "Duplicate Old Man of the Woods record kept only as a legacy slug alias.",
      "former_slugs": [
        "strobilomyces-strobilaceus"
      ],
      "aliases": [
        "strobilomyces-strobilaceus",
        "strobilomyces-floccopus"
      ],
      "images_structured": [
        {
          "thumb": "https://commons.wikimedia.org/wiki/Special:FilePath/Strobilomyces%20strobilaceus%205.jpg",
          "detail": "https://commons.wikimedia.org/wiki/Special:FilePath/Strobilomyces%20strobilaceus%205.jpg",
          "full": "https://commons.wikimedia.org/wiki/Special:FilePath/Strobilomyces%20strobilaceus%205.jpg",
          "source": "Wikimedia Commons",
          "title": "Strobilomyces strobilaceus 5.jpg",
          "part_or_stage": "Field photo",
          "source_page": "https://commons.wikimedia.org/wiki/File:Strobilomyces_strobilaceus_5.jpg",
          "credit": "Wikimedia Commons",
          "license": "See Wikimedia Commons file page"
        },
        {
          "thumb": "https://commons.wikimedia.org/wiki/Special:FilePath/2006-09-03%20Strobilomyces%20strobilaceus%201.jpg",
          "detail": "https://commons.wikimedia.org/wiki/Special:FilePath/2006-09-03%20Strobilomyces%20strobilaceus%201.jpg",
          "full": "https://commons.wikimedia.org/wiki/Special:FilePath/2006-09-03%20Strobilomyces%20strobilaceus%201.jpg",
          "source": "Wikimedia Commons",
          "title": "2006-09-03 Strobilomyces strobilaceus 1.jpg",
          "part_or_stage": "Field photo 2",
          "source_page": "https://commons.wikimedia.org/wiki/File:2006-09-03_Strobilomyces_strobilaceus_1.jpg",
          "credit": "Wikimedia Commons",
          "license": "See Wikimedia Commons file page"
        },
        {
          "thumb": "https://commons.wikimedia.org/wiki/Special:FilePath/2006-09-03%20Strobilomyces%20strobilaceus%202.jpg",
          "detail": "https://commons.wikimedia.org/wiki/Special:FilePath/2006-09-03%20Strobilomyces%20strobilaceus%202.jpg",
          "full": "https://commons.wikimedia.org/wiki/Special:FilePath/2006-09-03%20Strobilomyces%20strobilaceus%202.jpg",
          "source": "Wikimedia Commons",
          "title": "2006-09-03 Strobilomyces strobilaceus 2.jpg",
          "part_or_stage": "Field photo 3",
          "source_page": "https://commons.wikimedia.org/wiki/File:2006-09-03_Strobilomyces_strobilaceus_2.jpg",
          "credit": "Wikimedia Commons",
          "license": "See Wikimedia Commons file page"
        },
        {
          "thumb": "https://commons.wikimedia.org/wiki/Special:FilePath/Strobilomyces%20strobilaceus%206.jpg",
          "detail": "https://commons.wikimedia.org/wiki/Special:FilePath/Strobilomyces%20strobilaceus%206.jpg",
          "full": "https://commons.wikimedia.org/wiki/Special:FilePath/Strobilomyces%20strobilaceus%206.jpg",
          "source": "Wikimedia Commons",
          "title": "Strobilomyces strobilaceus 6.jpg",
          "part_or_stage": "Field photo 4",
          "source_page": "https://commons.wikimedia.org/wiki/File:Strobilomyces_strobilaceus_6.jpg",
          "credit": "Wikimedia Commons",
          "license": "See Wikimedia Commons file page"
        },
        {
          "thumb": "https://commons.wikimedia.org/wiki/Special:FilePath/Strobilomyces%20strobilaceus%203.jpg",
          "detail": "https://commons.wikimedia.org/wiki/Special:FilePath/Strobilomyces%20strobilaceus%203.jpg",
          "full": "https://commons.wikimedia.org/wiki/Special:FilePath/Strobilomyces%20strobilaceus%203.jpg",
          "source": "Wikimedia Commons",
          "title": "Strobilomyces strobilaceus 3.jpg",
          "part_or_stage": "Field photo 5",
          "source_page": "https://commons.wikimedia.org/wiki/File:Strobilomyces_strobilaceus_3.jpg",
          "credit": "Wikimedia Commons",
          "license": "See Wikimedia Commons file page"
        }
      ],
      "needs_review": false,
      "review_note": "",
      "review_notes": ""
    },
    {
      "slug": "pearl-oyster",
      "display_name": "Pearl oyster",
      "common_name": "Pearl oyster",
      "category": "Mushroom",
      "notes": "Classic hardwood oyster.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "September",
        "October",
        "November"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Pleurotus%20ostreatus.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "general_notes": "A core gilled mushroom entry for the guide. Keep separate from the warmer-season phoenix oyster and the aspen-focused oyster entry.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Common",
      "food_quality": "Good",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        9,
        10,
        11
      ],
      "food_role": "food",
      "look_alikes": [
        "aspen-oyster",
        "phoenix-oyster-summer-oyster"
      ],
      "confused_with": [
        "aspen-oyster",
        "phoenix-oyster-summer-oyster"
      ],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Dead hardwood wood"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "ring": [
          "None"
        ],
        "texture": [
          "Fleshy / soft"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None notable"
        ],
        "cap_surface": [
          "Smooth"
        ],
        "stem_feature": [
          "Lateral or short stem"
        ],
        "spore_print": "White to pale lilac",
        "gill_attachment": "Decurrent",
        "volva": "None",
        "season_note": "Mostly fall in the U.P., often after cool weather arrives."
      },
      "commonness_score": 4,
      "food_quality_score": 4
    },
    {
      "slug": "phoenix-oyster-summer-oyster",
      "display_name": "Phoenix oyster / summer oyster",
      "common_name": "Phoenix oyster / summer oyster",
      "category": "Mushroom",
      "notes": "Warm-season oyster on hardwood.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "June",
        "July",
        "August",
        "September"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Pleurotus%20pulmonarius.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "general_notes": "Use this entry for the thinner, warmer-season oyster type rather than treating every oyster as a fall pearl oyster.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Good",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        6,
        7,
        8,
        9
      ],
      "food_role": "food",
      "look_alikes": [
        "pearl-oyster",
        "aspen-oyster"
      ],
      "confused_with": [
        "pearl-oyster",
        "aspen-oyster"
      ],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Dead hardwood wood"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "ring": [
          "None"
        ],
        "texture": [
          "Fleshy / thin"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None notable"
        ],
        "cap_surface": [
          "Smooth"
        ],
        "stem_feature": [
          "Lateral or reduced stem"
        ],
        "spore_print": "White to pale lilac",
        "gill_attachment": "Decurrent",
        "volva": "None",
        "season_note": "Primarily summer into early fall."
      },
      "commonness_score": 3,
      "food_quality_score": 4
    },
    {
      "slug": "red-chanterelles-cinnabars",
      "display_name": "Red chanterelles / cinnabars",
      "common_name": "Red chanterelles / cinnabars",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Cantharellus%20cinnabarinus.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": []
    },
    {
      "slug": "red-belted-conk",
      "display_name": "Red-belted conk",
      "common_name": "Red-belted conk",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Fomitopsis%20pinicola%2021631.JPG",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Fomitopsis%20pinicola%203.JPG",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Fomitopsis%20pinicola%2094768946.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "non_edible_severity": "Inedible",
      "edibility_detail": "Avoid for food in this guide; keep as an identification/caution record.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "Not recommended",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "food_role": "avoid",
      "edibility_status": "not_edible",
      "edible_use": {
        "has_ingestible_use": false,
        "method": "",
        "preparation_required": false,
        "notes": ""
      }
    },
    {
      "slug": "reindeer-lichen",
      "display_name": "Reindeer lichen",
      "common_name": "Reindeer lichen",
      "category": "Mushroom",
      "notes": "Needs review: category should be reviewed.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      "links": [
        "https://www.britannica.com/science/reindeer-lichen",
        "https://www.purdue.edu/hla/sites/famine-foods/famine_food/cladonia-rangiferina-2/"
      ],
      "images": [
        "assets/images/mushrooms/reindeer-lichen-1.jpg"
      ],
      "medicinal_uses": "Poultice for wound care",
      "culinary_uses": "Emergency survival flour after extensive prep",
      "non_edible_severity": "Emergency only",
      "edibility_detail": "Treat as caution / not for meals in this guide until species-level edibility is clarified.",
      "month_numbers": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "scientific_name": "Cladonia rangiferina (and related reindeer lichens)",
      "mushroom_profile": {
        "scientific_name": "Cladonia rangiferina (and related reindeer lichens)",
        "entry_scope": "lichen_group",
        "edibility_status": "emergency_only",
        "caution_level": "high",
        "summary": "A lichen rather than a mushroom. Historically processed as famine food or flour extender, but bitter acids require substantial preparation.",
        "ecology": "lichen",
        "substrate": [
          "Ground"
        ],
        "wood_type": [],
        "host_trees": [],
        "host_certainty": "unknown",
        "underside": "None / lichen thallus",
        "ring": "None",
        "texture": [
          "Dry"
        ],
        "odor": "Unknown",
        "staining": "Unknown",
        "taste": [
          "Bitter"
        ],
        "spore_print": "",
        "season_note": "Visible year-round in open, well-drained sites.",
        "processing_required": [
          "Repeated soaking / boiling"
        ],
        "research_notes": [
          "Better treated as a lichen entry than a mushroom entry.",
          "Known more as animal browse and famine food than as a casual wild edible.",
          "Source coverage count in current app data: 2",
          "Image status in current repo build: has image"
        ]
      },
      "manual_review_reasons": [
        "category should be reviewed: lichen, not mushroom"
      ],
      "mushroom_family": "Lichens & survival entries",
      "related_mushroom_slugs": [
        "rock-tripe-lichen"
      ],
      "medicinalAction": [
        "Vulnerary / wound support"
      ],
      "medicinalSystem": [
        "Skin / topical"
      ],
      "medicinalTerms": [
        "Wounds"
      ],
      "weekPrecision": "month-window-reviewed",
      "primary_type": "mushroom",
      "is_medicinal": true,
      "is_non_edible": true,
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [
        "Category should be reviewed"
      ],
      "review_status": "needs_review",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "",
      "habitat": [],
      "needs_review": true,
      "review_reasons": [
        "Category should be reviewed"
      ],
      "review_note": "Needs review: category should be reviewed.",
      "review_notes": "Needs review: category should be reviewed."
    },
    {
      "slug": "rock-tripe-lichen",
      "display_name": "Rock tripe (lichen)",
      "common_name": "Rock tripe (lichen)",
      "category": "Mushroom",
      "notes": "Needs review: category should be reviewed.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      "links": [
        "https://www.britannica.com/science/rock-tripe",
        "https://whatsinaname.hmnh.harvard.edu/rocktripe"
      ],
      "images": [
        "assets/images/mushrooms/rock-tripe-lichen-1.jpg"
      ],
      "medicinal_uses": "Traditional source of vitamin C in survival situations",
      "culinary_uses": "Emergency food when boiled and rinsed",
      "non_edible_severity": "Emergency only",
      "edibility_detail": "Treat as caution / not for meals in this guide until species-level edibility is clarified.",
      "month_numbers": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "scientific_name": "Umbilicaria spp.",
      "mushroom_profile": {
        "scientific_name": "Umbilicaria spp.",
        "entry_scope": "lichen_group",
        "edibility_status": "emergency_only",
        "caution_level": "high",
        "summary": "Actually a rock-dwelling lichen rather than a mushroom. Historically used as an emergency or famine food after extensive processing.",
        "ecology": "lichen",
        "substrate": [
          "Rock"
        ],
        "wood_type": [],
        "host_trees": [],
        "host_certainty": "unknown",
        "underside": "None / lichen thallus",
        "ring": "None",
        "texture": [
          "Leathery"
        ],
        "odor": "Unknown",
        "staining": "Unknown",
        "taste": [
          "Bitter"
        ],
        "spore_print": "",
        "season_note": "Present year-round where established.",
        "processing_required": [
          "Repeated boiling / soaking"
        ],
        "research_notes": [
          "Common name covers edible Umbilicaria lichens rather than a single mushroom species.",
          "Treat as a survival food entry, not a routine edible.",
          "Slow-growing and best not heavily harvested.",
          "Source coverage count in current app data: 2",
          "Image status in current repo build: has image"
        ]
      },
      "manual_review_reasons": [
        "category should be reviewed: lichen, not mushroom"
      ],
      "mushroom_family": "Lichens & survival entries",
      "related_mushroom_slugs": [
        "reindeer-lichen"
      ],
      "medicinalAction": [
        "Nutritive / nutrient-dense"
      ],
      "medicinalSystem": [
        "General nutritive"
      ],
      "weekPrecision": "month-window-reviewed",
      "primary_type": "mushroom",
      "is_medicinal": true,
      "is_non_edible": true,
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [
        "Category should be reviewed"
      ],
      "review_status": "needs_review",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "",
      "medicinalTerms": [],
      "habitat": [],
      "needs_review": true,
      "review_reasons": [
        "Category should be reviewed"
      ],
      "review_note": "Needs review: category should be reviewed.",
      "review_notes": "Needs review: category should be reviewed."
    },
    {
      "slug": "scaber-stalk-boletes-birch-aspen-boletes",
      "display_name": "Scaber-stalk boletes / birch-aspen boletes",
      "common_name": "Scaber-stalk boletes / birch-aspen boletes",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Leccinum_scabrum.png",
        "https://commons.wikimedia.org/wiki/Special:FilePath/LeccinumScabrum.JPG",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Leccinum%20scabrum%20117467.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "general_notes": "Representative Commons images currently use Leccinum scabrum to illustrate the broader scaber-stalk birch/aspen bolete group.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "hidden": true,
      "duplicate_of": "leccinum-scabrum",
      "legacy_alias": true,
      "list_visibility": "hidden-duplicate",
      "duplicate_note": "Broad scaber-stalk duplicate/group page kept only as a legacy slug alias. Its caution content has been consolidated into Birch Bolete / Leccinum scabrum."
    },
    {
      "slug": "shaggy-mane",
      "display_name": "Shaggy mane",
      "common_name": "Shaggy mane",
      "category": "Mushroom",
      "notes": "Fast-deliquescing gilled mushroom of disturbed ground.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "May",
        "June",
        "July",
        "August",
        "September",
        "October"
      ],
      "links": [
        "https://www.mushroomexpert.com/coprinus_comatus.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Coprinus%20comatus.jpg"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Good edible only when young, white, and before the gills darken/ink. Cook soon after picking; it deteriorates quickly.",
      "general_notes": "This is a classic 'find it and use it quickly' species. The deliquescing black gills are part of why it must sit in the gilled lane.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "Occasional",
      "food_quality": "Good",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "food_role": "food",
      "look_alikes": [],
      "confused_with": [],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Soil",
          "Lawns",
          "Disturbed ground"
        ],
        "host_filter_tokens": [],
        "ring": [
          "Ring present or movable ring"
        ],
        "texture": [
          "Fragile"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "Gills blacken and liquefy"
        ],
        "cap_surface": [
          "Shaggy scales"
        ],
        "stem_feature": [
          "Tall slender white stem"
        ],
        "spore_print": "Black",
        "gill_attachment": "Free",
        "volva": "None",
        "season_note": "Spring through fall in rich disturbed ground."
      },
      "commonness_score": 3,
      "food_quality_score": 4,
      "scientific_name": "Coprinus comatus",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Good forage — very time-sensitive",
      "foraging_value_score": 4,
      "field_identification": "Tall shaggy white cap that becomes black ink as it matures; often in lawns, roadsides, and disturbed ground.",
      "mushroom_card_note": "Good edible but extremely time-sensitive: use young white specimens before they ink."
    },
    {
      "slug": "short-stemmed-russula",
      "display_name": "Short-stemmed russula",
      "common_name": "Short-stemmed russula",
      "category": "Mushroom",
      "notes": "Needs review: needs real field photo / image coverage.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September"
      ],
      "links": [
        "https://www.mushroomexpert.com/russula_brevipes.html"
      ],
      "images": [
        "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271200%27%20height%3D%27900%27%20viewBox%3D%270%200%201200%20900%27%3E%0A%20%20%3Crect%20width%3D%271200%27%20height%3D%27900%27%20fill%3D%27%23f4f1e8%27/%3E%0A%20%20%3Crect%20x%3D%2740%27%20y%3D%2740%27%20width%3D%271120%27%20height%3D%27820%27%20rx%3D%2736%27%20fill%3D%27%23ebe5d6%27%20stroke%3D%27%238a7757%27%20stroke-width%3D%2710%27%20stroke-dasharray%3D%2720%2016%27/%3E%0A%20%20%3Cg%20fill%3D%27none%27%20stroke%3D%27%238a7757%27%20stroke-width%3D%2722%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%0A%20%20%20%20%3Cpath%20d%3D%27M360%20420c28-108%20122-178%20240-178s212%2070%20240%20178H360z%27/%3E%0A%20%20%20%20%3Cpath%20d%3D%27M600%20420v170%27/%3E%0A%20%20%20%20%3Cpath%20d%3D%27M525%20590h150%27/%3E%0A%20%20%20%20%3Cpath%20d%3D%27M470%20340c35-24%2082-38%20130-38%2047%200%2094%2014%20130%2038%27/%3E%0A%20%20%3C/g%3E%0A%20%20%3Ctext%20x%3D%27600%27%20y%3D%27680%27%20text-anchor%3D%27middle%27%20font-family%3D%27Arial%2C%20Helvetica%2C%20sans-serif%27%20font-size%3D%2772%27%20font-weight%3D%27700%27%20fill%3D%27%235f513c%27%3EIMAGE%20NEEDED%3C/text%3E%0A%20%20%3Ctext%20x%3D%27600%27%20y%3D%27760%27%20text-anchor%3D%27middle%27%20font-family%3D%27Arial%2C%20Helvetica%2C%20sans-serif%27%20font-size%3D%2742%27%20font-weight%3D%27600%27%20fill%3D%27%236c5c43%27%3EShort-stemmed%20russula%3C/text%3E%0A%20%20%3Ctext%20x%3D%27600%27%20y%3D%27815%27%20text-anchor%3D%27middle%27%20font-family%3D%27Arial%2C%20Helvetica%2C%20sans-serif%27%20font-size%3D%2730%27%20fill%3D%27%237a6a50%27%3EPublic%20usable%20photo%20not%20yet%20found%3C/text%3E%0A%3C/svg%3E"
      ],
      "medicinal_uses": "Primarily culinary/ID interest in this guide.",
      "culinary_uses": "Edible reports exist, but quality is variable and ID can be confusing; better treated as a cautious/advanced edible unless converted into lobster mushroom.",
      "general_notes": "A good reminder that russulas belong in the gilled lane too. The short thick stem and brittle white flesh matter more than generic 'mushroom' features.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [
        "Needs real field photo / image coverage",
        "Russula species/group ID should be kept conservative"
      ],
      "review_status": "needs_review",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Conifer / softwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Fair",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        7,
        8,
        9
      ],
      "food_role": "food",
      "look_alikes": [
        "shrimp-russulas",
        "charcoal-burners-mild-flexible-gill-russulas"
      ],
      "confused_with": [
        "shrimp-russulas",
        "charcoal-burners-mild-flexible-gill-russulas"
      ],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Forest soil"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Conifer / softwood"
        ],
        "ring": [
          "None"
        ],
        "texture": [
          "Brittle"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None notable"
        ],
        "cap_surface": [
          "Smooth"
        ],
        "stem_feature": [
          "Short stout brittle stem"
        ],
        "spore_print": "White to cream",
        "gill_attachment": "Attached",
        "volva": "None",
        "season_note": "Summer into early fall in woods."
      },
      "commonness_score": 3,
      "food_quality_score": 3,
      "image_review_status": "needs_field_photo",
      "image_review_reasons": [
        "No usable field-view photo is currently available in the app.",
        "Replace placeholder with a clear field photo showing cap/stem/underside or growth context."
      ],
      "review_reasons": [
        "Needs real field photo / image coverage",
        "Russula species/group ID should be kept conservative"
      ],
      "needs_review": true,
      "review_note": "Needs review: Needs real field photo / image coverage; Russula species/group ID should be kept conservative.",
      "review_notes": "Needs review: Needs real field photo / image coverage; Russula species/group ID should be kept conservative.",
      "scientific_name": "Russula brevipes group",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Fair / expert confirmation",
      "foraging_value_score": 2,
      "field_identification": "Sturdy pale russula with short thick stem; gills and stem often bruise brownish. Can be hard to separate from similar Lactarius without checking for latex.",
      "mushroom_card_note": "Fair/advanced russula; useful partly because it can become lobster mushroom."
    },
    {
      "slug": "shrimp-of-the-woods-aborted-entoloma",
      "display_name": "Shrimp of the woods / aborted entoloma",
      "common_name": "Shrimp of the woods / aborted entoloma",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Hypomyces%20lactifluorum%20(33383198385).jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Hypomyces%20lactifluorum%20169126.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Hypomyces%20lactifluorum%207851624.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "non_edible_severity": "Conditionally edible",
      "edibility_detail": "Treat as caution / not for meals in this guide until species-level edibility is clarified.",
      "general_notes": "Representative Commons images currently show the Hypomyces lactifluorum / lobster-mushroom side of the concept pending a stronger aborted-entoloma image set.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": []
    },
    {
      "slug": "shrimp-russulas",
      "display_name": "Shrimp russulas",
      "common_name": "Shrimp russulas",
      "category": "Mushroom",
      "notes": "Needs review: needs real field photo / image coverage. Russula group with seafood-like odor.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "July",
        "August",
        "September"
      ],
      "links": [
        "https://www.mushroomexpert.com/russula_shrimp.html"
      ],
      "images": [
        "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271200%27%20height%3D%27900%27%20viewBox%3D%270%200%201200%20900%27%3E%0A%20%20%3Crect%20width%3D%271200%27%20height%3D%27900%27%20fill%3D%27%23f4f1e8%27/%3E%0A%20%20%3Crect%20x%3D%2740%27%20y%3D%2740%27%20width%3D%271120%27%20height%3D%27820%27%20rx%3D%2736%27%20fill%3D%27%23ebe5d6%27%20stroke%3D%27%238a7757%27%20stroke-width%3D%2710%27%20stroke-dasharray%3D%2720%2016%27/%3E%0A%20%20%3Cg%20fill%3D%27none%27%20stroke%3D%27%238a7757%27%20stroke-width%3D%2722%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%0A%20%20%20%20%3Cpath%20d%3D%27M360%20420c28-108%20122-178%20240-178s212%2070%20240%20178H360z%27/%3E%0A%20%20%20%20%3Cpath%20d%3D%27M600%20420v170%27/%3E%0A%20%20%20%20%3Cpath%20d%3D%27M525%20590h150%27/%3E%0A%20%20%20%20%3Cpath%20d%3D%27M470%20340c35-24%2082-38%20130-38%2047%200%2094%2014%20130%2038%27/%3E%0A%20%20%3C/g%3E%0A%20%20%3Ctext%20x%3D%27600%27%20y%3D%27680%27%20text-anchor%3D%27middle%27%20font-family%3D%27Arial%2C%20Helvetica%2C%20sans-serif%27%20font-size%3D%2772%27%20font-weight%3D%27700%27%20fill%3D%27%235f513c%27%3EIMAGE%20NEEDED%3C/text%3E%0A%20%20%3Ctext%20x%3D%27600%27%20y%3D%27760%27%20text-anchor%3D%27middle%27%20font-family%3D%27Arial%2C%20Helvetica%2C%20sans-serif%27%20font-size%3D%2742%27%20font-weight%3D%27600%27%20fill%3D%27%236c5c43%27%3EShrimp%20russulas%3C/text%3E%0A%20%20%3Ctext%20x%3D%27600%27%20y%3D%27815%27%20text-anchor%3D%27middle%27%20font-family%3D%27Arial%2C%20Helvetica%2C%20sans-serif%27%20font-size%3D%2730%27%20fill%3D%27%237a6a50%27%3EPublic%20usable%20photo%20not%20yet%20found%3C/text%3E%0A%3C/svg%3E"
      ],
      "medicinal_uses": "Primarily culinary/ID interest in this guide.",
      "culinary_uses": "Often considered edible when confidently identified, but North American shrimp russulas are a complex; use only with strong Russula skills.",
      "general_notes": "This belongs in the gilled lane even though it does not look like a typical agaric. Russula brittleness and odor are important criteria for the mushroom schema.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [
        "Needs real field photo / image coverage",
        "Russula species/group ID should be kept conservative"
      ],
      "review_status": "needs_review",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Conifer / softwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Fair",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        7,
        8,
        9
      ],
      "food_role": "food",
      "look_alikes": [
        "short-stemmed-russula",
        "charcoal-burners-mild-flexible-gill-russulas"
      ],
      "confused_with": [
        "short-stemmed-russula",
        "charcoal-burners-mild-flexible-gill-russulas"
      ],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Forest soil"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Conifer / softwood"
        ],
        "ring": [
          "None"
        ],
        "texture": [
          "Brittle"
        ],
        "smell": [
          "Seafood-like",
          "Shrimp-like"
        ],
        "staining": [
          "None notable"
        ],
        "cap_surface": [
          "Smooth"
        ],
        "stem_feature": [
          "Brittle chalky stem"
        ],
        "spore_print": "Cream to pale ochre",
        "gill_attachment": "Attached",
        "volva": "None",
        "season_note": "Summer into early fall in woods."
      },
      "commonness_score": 3,
      "food_quality_score": 3,
      "image_review_status": "needs_field_photo",
      "image_review_reasons": [
        "No usable field-view photo is currently available in the app.",
        "Replace placeholder with a clear field photo showing cap/stem/underside or growth context."
      ],
      "review_reasons": [
        "Needs real field photo / image coverage",
        "Russula species/group ID should be kept conservative"
      ],
      "needs_review": true,
      "review_note": "Needs review: Needs real field photo / image coverage; Russula species/group ID should be kept conservative.",
      "review_notes": "Needs review: Needs real field photo / image coverage; Russula species/group ID should be kept conservative.",
      "scientific_name": "Russula xerampelina group / North American shrimp russulas",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Fair / expert confirmation",
      "foraging_value_score": 2,
      "field_identification": "Russulas with shrimp/fishy odor, brown staining, mild taste, and brittle flesh; species-level ID is messy in North America.",
      "mushroom_card_note": "Fair edible for Russula people; shrimp odor helps, but the group is taxonomically messy."
    },
    {
      "slug": "smooth-chanterelles",
      "display_name": "Smooth chanterelles",
      "common_name": "Smooth chanterelles",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [],
      "links": [
        "https://www.mushroomexpert.com/cantharellus_lateritius.html",
        "https://mdc.mo.gov/discover-nature/field-guide/smooth-chanterelle"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Cantharellus%20lateritius%2054894.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Cantharellus%20lateritius%2051632.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Cantharellus%20lateritius%2049073.jpg"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Choice edible chanterelle-type mushroom. Cook fresh in butter, eggs, sauces, or cream dishes; avoid confusing with jack-o'-lanterns.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "scientific_name": "Cantharellus lateritius",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Prime foraging",
      "foraging_value_score": 5,
      "field_identification": "Orange-yellow chanterelle with a smooth to shallowly wrinkled underside rather than true blade-like gills.",
      "mushroom_card_note": "Prime chanterelle-type edible with a smooth or barely wrinkled underside."
    },
    {
      "slug": "tinder-conk-hoof-fungus",
      "display_name": "Tinder conk / hoof fungus",
      "common_name": "Tinder conk / hoof fungus",
      "category": "Mushroom",
      "notes": "Hard hoof-shaped bracket on hardwoods, especially birch and beech. The tough gray-brown hoof form and pale pore underside are the key field marks.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Fomes%20fomentarius%20177852044.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Fomes%20fomentarius%20170079378.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Fomes%20fomentarius%201700886953.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "non_edible_severity": "Inedible",
      "edibility_detail": "Avoid for food in this guide; keep as an identification/caution record.",
      "general_notes": "Not food; included for tinder/utility value and for separating woody conks from edible shelf fungi.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "Not recommended",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "food_role": "avoid",
      "edibility_status": "not_edible",
      "edible_use": {
        "has_ingestible_use": false,
        "method": "",
        "preparation_required": false,
        "notes": ""
      },
      "review_reasons": [],
      "needs_review": false
    },
    {
      "slug": "turkey-tail",
      "display_name": "Turkey tail",
      "common_name": "Turkey tail",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [],
      "links": [
        "https://mushroomexpert.com/trametes_versicolor.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Red%20Turkey%20Tail.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Turkey%20Tail%20(4063595386).jpg"
      ],
      "medicinal_uses": "Traditional and supplement interest, especially as tea/extract; this app does not treat it as a cure.",
      "culinary_uses": "Too tough for table eating; usually dried and simmered for tea/decoction.",
      "non_edible_severity": "Inedible",
      "edibility_detail": "Avoid for food in this guide; keep as an identification/caution record.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "Not recommended",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "food_role": "avoid",
      "edibility_status": "not_edible",
      "edible_use": {
        "has_ingestible_use": false,
        "method": "",
        "preparation_required": false,
        "notes": ""
      },
      "scientific_name": "Trametes versicolor",
      "use_roles": [
        "Tea",
        "Medicinal"
      ],
      "foraging_value": "Good tea / traditional use",
      "foraging_value_score": 3,
      "field_identification": "Thin leathery shelf with strongly zoned, fuzzy cap surface and a true tiny-pored white underside.",
      "mushroom_card_note": "Tea/decoction mushroom, not table food; confirm true pores underneath."
    },
    {
      "slug": "velvet-foot",
      "display_name": "Velvet foot",
      "common_name": "Velvet foot",
      "category": "Mushroom",
      "notes": "Cold-weather gilled mushroom on wood.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "October",
        "November",
        "December",
        "January",
        "February",
        "March"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Flammulina%20velutipes%20(42284743332).jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Flammulina%20velutipes%20106827706.jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "non_edible_severity": "Edible with caution",
      "edibility_detail": "Treat as caution / not for meals in this guide until species-level edibility is clarified.",
      "general_notes": "The dark velvety stem base matters here. This is one of the few edible-type gilled mushrooms worth checking in cold weather.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood"
      ],
      "commonness": "Occasional",
      "food_quality": "Fair",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        10,
        11,
        12,
        1,
        2,
        3
      ],
      "food_role": "food",
      "look_alikes": [
        "jack-o-lantern"
      ],
      "confused_with": [
        "jack-o-lantern"
      ],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Dead hardwood wood"
        ],
        "host_filter_tokens": [
          "Hardwood"
        ],
        "ring": [
          "None"
        ],
        "texture": [
          "Fleshy"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None notable"
        ],
        "cap_surface": [
          "Smooth",
          "Viscid when moist"
        ],
        "stem_feature": [
          "Dark velvety stem base"
        ],
        "spore_print": "White",
        "gill_attachment": "Attached",
        "volva": "None",
        "season_note": "Late fall through winter into early spring during thaw periods."
      },
      "commonness_score": 3,
      "food_quality_score": 3
    },
    {
      "slug": "yellow-chanterelles-conifer-associated-complex",
      "display_name": "Yellow chanterelles (conifer-associated complex)",
      "common_name": "Yellow chanterelles (conifer-associated complex)",
      "category": "Mushroom",
      "notes": "Needs review: needs real field photo / image coverage.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [],
      "links": [
        "https://www.mushroomexpert.com/cantharellus_cibarius.html",
        "https://www.mushroomexpert.com/cantharellaceae.html"
      ],
      "images": [
        "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271200%27%20height%3D%27900%27%20viewBox%3D%270%200%201200%20900%27%3E%0A%20%20%3Crect%20width%3D%271200%27%20height%3D%27900%27%20fill%3D%27%23f4f1e8%27/%3E%0A%20%20%3Crect%20x%3D%2740%27%20y%3D%2740%27%20width%3D%271120%27%20height%3D%27820%27%20rx%3D%2736%27%20fill%3D%27%23ebe5d6%27%20stroke%3D%27%238a7757%27%20stroke-width%3D%2710%27%20stroke-dasharray%3D%2720%2016%27/%3E%0A%20%20%3Cg%20fill%3D%27none%27%20stroke%3D%27%238a7757%27%20stroke-width%3D%2722%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%0A%20%20%20%20%3Cpath%20d%3D%27M360%20420c28-108%20122-178%20240-178s212%2070%20240%20178H360z%27/%3E%0A%20%20%20%20%3Cpath%20d%3D%27M600%20420v170%27/%3E%0A%20%20%20%20%3Cpath%20d%3D%27M525%20590h150%27/%3E%0A%20%20%20%20%3Cpath%20d%3D%27M470%20340c35-24%2082-38%20130-38%2047%200%2094%2014%20130%2038%27/%3E%0A%20%20%3C/g%3E%0A%20%20%3Ctext%20x%3D%27600%27%20y%3D%27680%27%20text-anchor%3D%27middle%27%20font-family%3D%27Arial%2C%20Helvetica%2C%20sans-serif%27%20font-size%3D%2772%27%20font-weight%3D%27700%27%20fill%3D%27%235f513c%27%3EIMAGE%20NEEDED%3C/text%3E%0A%20%20%3Ctext%20x%3D%27600%27%20y%3D%27760%27%20text-anchor%3D%27middle%27%20font-family%3D%27Arial%2C%20Helvetica%2C%20sans-serif%27%20font-size%3D%2742%27%20font-weight%3D%27600%27%20fill%3D%27%236c5c43%27%3EYellow%20chanterelles%20%28conifer-associated%20complex%29%3C/text%3E%0A%20%20%3Ctext%20x%3D%27600%27%20y%3D%27815%27%20text-anchor%3D%27middle%27%20font-family%3D%27Arial%2C%20Helvetica%2C%20sans-serif%27%20font-size%3D%2730%27%20fill%3D%27%237a6a50%27%3EPublic%20usable%20photo%20not%20yet%20found%3C/text%3E%0A%3C/svg%3E"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Choice edible chanterelle-type mushrooms when positively identified. Cook; do not confuse with jack-o'-lanterns or true-gilled orange mushrooms.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [
        "Needs real field photo / image coverage",
        "Species-complex wording should be kept conservative"
      ],
      "review_status": "needs_review",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "image_review_status": "needs_field_photo",
      "image_review_reasons": [
        "No usable field-view photo is currently available in the app.",
        "Replace placeholder with a clear field photo showing cap/stem/underside or growth context."
      ],
      "review_reasons": [
        "Needs real field photo / image coverage",
        "Species-complex wording should be kept conservative"
      ],
      "needs_review": true,
      "review_note": "Needs review: Needs real field photo / image coverage; Species-complex wording should be kept conservative.",
      "review_notes": "Needs review: Needs real field photo / image coverage; Species-complex wording should be kept conservative.",
      "scientific_name": "Cantharellus spp. / conifer-associated yellow chanterelles",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Prime foraging — species complex",
      "foraging_value_score": 5,
      "field_identification": "Yellow-orange chanterelle complex with blunt forked false gills, solid flesh, and conifer association; species-level names are unsettled in North America.",
      "mushroom_card_note": "Prime chanterelle group, but this entry still needs a real field photo and careful species-complex wording."
    },
    {
      "slug": "yellow-chanterelles-hardwood-associated-complex",
      "display_name": "Yellow chanterelles (hardwood-associated complex)",
      "common_name": "Yellow chanterelles (hardwood-associated complex)",
      "category": "Mushroom",
      "notes": "Needs review: needs real field photo / image coverage.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [],
      "links": [
        "https://www.mushroomexpert.com/cantharellus_cibarius.html",
        "https://www.mushroomexpert.com/cantharellaceae.html"
      ],
      "images": [
        "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271200%27%20height%3D%27900%27%20viewBox%3D%270%200%201200%20900%27%3E%0A%20%20%3Crect%20width%3D%271200%27%20height%3D%27900%27%20fill%3D%27%23f4f1e8%27/%3E%0A%20%20%3Crect%20x%3D%2740%27%20y%3D%2740%27%20width%3D%271120%27%20height%3D%27820%27%20rx%3D%2736%27%20fill%3D%27%23ebe5d6%27%20stroke%3D%27%238a7757%27%20stroke-width%3D%2710%27%20stroke-dasharray%3D%2720%2016%27/%3E%0A%20%20%3Cg%20fill%3D%27none%27%20stroke%3D%27%238a7757%27%20stroke-width%3D%2722%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%0A%20%20%20%20%3Cpath%20d%3D%27M360%20420c28-108%20122-178%20240-178s212%2070%20240%20178H360z%27/%3E%0A%20%20%20%20%3Cpath%20d%3D%27M600%20420v170%27/%3E%0A%20%20%20%20%3Cpath%20d%3D%27M525%20590h150%27/%3E%0A%20%20%20%20%3Cpath%20d%3D%27M470%20340c35-24%2082-38%20130-38%2047%200%2094%2014%20130%2038%27/%3E%0A%20%20%3C/g%3E%0A%20%20%3Ctext%20x%3D%27600%27%20y%3D%27680%27%20text-anchor%3D%27middle%27%20font-family%3D%27Arial%2C%20Helvetica%2C%20sans-serif%27%20font-size%3D%2772%27%20font-weight%3D%27700%27%20fill%3D%27%235f513c%27%3EIMAGE%20NEEDED%3C/text%3E%0A%20%20%3Ctext%20x%3D%27600%27%20y%3D%27760%27%20text-anchor%3D%27middle%27%20font-family%3D%27Arial%2C%20Helvetica%2C%20sans-serif%27%20font-size%3D%2742%27%20font-weight%3D%27600%27%20fill%3D%27%236c5c43%27%3EYellow%20chanterelles%20%28hardwood-associated%20complex%29%3C/text%3E%0A%20%20%3Ctext%20x%3D%27600%27%20y%3D%27815%27%20text-anchor%3D%27middle%27%20font-family%3D%27Arial%2C%20Helvetica%2C%20sans-serif%27%20font-size%3D%2730%27%20fill%3D%27%237a6a50%27%3EPublic%20usable%20photo%20not%20yet%20found%3C/text%3E%0A%3C/svg%3E"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Choice edible chanterelle-type mushrooms when positively identified. Cook; check false gills, growth from soil, and lack of jack-o'-lantern clustering on wood.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [
        "Needs real field photo / image coverage",
        "Species-complex wording should be kept conservative"
      ],
      "review_status": "needs_review",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "image_review_status": "needs_field_photo",
      "image_review_reasons": [
        "No usable field-view photo is currently available in the app.",
        "Replace placeholder with a clear field photo showing cap/stem/underside or growth context."
      ],
      "review_reasons": [
        "Needs real field photo / image coverage",
        "Species-complex wording should be kept conservative"
      ],
      "needs_review": true,
      "review_note": "Needs review: Needs real field photo / image coverage; Species-complex wording should be kept conservative.",
      "review_notes": "Needs review: Needs real field photo / image coverage; Species-complex wording should be kept conservative.",
      "scientific_name": "Cantharellus spp. / hardwood-associated yellow chanterelles",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Prime foraging — species complex",
      "foraging_value_score": 5,
      "field_identification": "Yellow-orange chanterelle complex with blunt forked false gills and hardwood association; North American species naming is still unsettled.",
      "mushroom_card_note": "Prime chanterelle group, but this entry still needs a real field photo and careful species-complex wording."
    },
    {
      "slug": "yellow-fly-agaric-guessowii",
      "display_name": "Yellow fly agaric / guessowii",
      "common_name": "Yellow fly agaric / guessowii",
      "category": "Mushroom",
      "notes": "Yellow fly agaric entry.",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [
        "August",
        "September",
        "October"
      ],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Amanita%20muscaria%20var.%20guessowii%20(2).jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Amanita%20muscaria%20var.%20guessowii%2C%20medium.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Amanita%20muscaria%20var.%20guessowii%2C%20small.jpg"
      ],
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "non_edible_severity": "Poisonous",
      "edibility_detail": "Avoid for food in this guide; keep as an identification/caution record.",
      "general_notes": "A conspicuous northern Amanita and worth keeping obvious in the caution side of the guide. The warts, white gills, ring, and bulbous base all matter.",
      "record_type": "mushroom",
      "lane": "gilled",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [
        "Hardwood",
        "Conifer / softwood"
      ],
      "commonness": "Common",
      "food_quality": "Not recommended",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "month_numbers": [
        8,
        9,
        10
      ],
      "food_role": "avoid",
      "look_alikes": [],
      "confused_with": [],
      "mushroom_profile": {
        "lane": "gilled",
        "underside": [
          "Gills"
        ],
        "substrate": [
          "Forest soil"
        ],
        "host_filter_tokens": [
          "Hardwood",
          "Conifer / softwood"
        ],
        "ring": [
          "Ring present"
        ],
        "texture": [
          "Fleshy"
        ],
        "smell": [
          "Mild"
        ],
        "staining": [
          "None notable"
        ],
        "cap_surface": [
          "Warty"
        ],
        "stem_feature": [
          "Bulbous base"
        ],
        "spore_print": "White",
        "gill_attachment": "Free",
        "volva": "Present as universal veil remnants",
        "season_note": "Late summer through fall in mixed woods."
      },
      "commonness_score": 4,
      "food_quality_score": 1,
      "edibility_status": "not_edible",
      "edible_use": {
        "has_ingestible_use": false,
        "method": "",
        "preparation_required": false,
        "notes": ""
      }
    },
    {
      "slug": "yellow-morels",
      "display_name": "Yellow morels",
      "common_name": "Yellow morels",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [],
      "links": [],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Morchella%20esculenta%2036795275.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Morchella%20esculenta%20(Twelve%20edible%20mushrooms%20of%20the%20United%20States).jpg"
      ],
      "medicinal_uses": "Original app included medicinal notes or related use context for this entry. Detailed copyback is still pending.",
      "culinary_uses": "Detailed culinary and caution notes are still being copied back.",
      "general_notes": "Representative Commons images currently use Morchella esculenta / yellow-morel-type material for this field-guide group record.",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": []
    },
    {
      "slug": "yellowfoot-chanterelle",
      "display_name": "Yellowfoot chanterelle",
      "common_name": "Yellowfoot chanterelle",
      "category": "Mushroom",
      "notes": "",
      "short_reason": "Original app species restored into the standalone modular build.",
      "months_available": [],
      "links": [
        "https://www.mushroomexpert.com/craterellus_tubaeformis.html"
      ],
      "images": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Craterellus%20tubaeformis%20(37555429931).jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/Craterellus%20tubaeformis%20(24592812038).jpg"
      ],
      "medicinal_uses": "Primarily culinary in this guide.",
      "culinary_uses": "Good edible small chanterelle. Excellent sautéed or dried; stems can be tougher than caps.",
      "general_notes": "",
      "record_type": "mushroom",
      "lane": "other",
      "reviewReasons": [],
      "review_status": "ok",
      "search_aliases": [],
      "host_filter_tokens": [],
      "commonness": "",
      "food_quality": "",
      "non_edible_severity": "",
      "medicinalAction": [],
      "medicinalSystem": [],
      "medicinalTerms": [],
      "habitat": [],
      "scientific_name": "Craterellus tubaeformis",
      "use_roles": [
        "Food"
      ],
      "foraging_value": "Good forage",
      "foraging_value_score": 4,
      "field_identification": "Small brownish funnel cap with well-developed false gills and a yellow to orange-yellow hollow stem, often in mossy conifer bogs.",
      "mushroom_card_note": "Good late-season small chanterelle; brown cap, false gills, yellow hollow stem."
    }
  ]
}
