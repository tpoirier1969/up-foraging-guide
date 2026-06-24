# PROJECT_RULES.md — Upper Michigan Foraging Guide

This file is the controlling project rule file for the Upper Michigan Foraging Guide.

All supervisors and workers must read and follow this file before doing any research, audit, QA, handoff, package, build, or repo-related work.

If this file conflicts with older handoffs, stale audit assumptions, old source-folder labels, or previous worker habits, this file controls unless Tod explicitly says otherwise.

---

## 1. Active app scope

The active app is under:

```text
fixed-site/
```

Actual app work is done inside `fixed-site/`.

Root-level files are for project documentation, repo metadata, and process control only unless Tod explicitly says otherwise. Do not treat root-level data files, old build folders, abandoned packages, backup folders, retired master files, or stale patch notes as active app data.

Use only canonical files loaded by:

```text
fixed-site/js/data/sources.js
```

Ignore:

```text
stale root files
old build folders
abandoned package folders
backup files
retired master files
old patch notes unless directly reflected in fixed-site/
anything outside the live active app tree
```

`PHOTO_PATCH_PATHS` should remain empty unless Tod explicitly revives that system.

---

## 2. Roles and allowed work

Research/audit/QA workers return findings only.

Workers must not create:

```text
files
ZIPs
patches
JSON sidecars
scripts
batch files
repo edits
commits
branches
PRs
```

Supervisors may build packages only when explicitly asked.

Package/build work means complete changed files or a complete changed-files ZIP. Do not provide partial snippets when a package is requested.

Do not create helper scripts, `.bat` files, builder tools, cleanup utilities, or repo-maintenance tools unless Tod explicitly asks for them.

---

## 3. Revision/package rules

Named revisions must be packaged as changed-files ZIPs unless Tod explicitly requests another format.

Changed files must be placed in their real app paths, for example:

```text
fixed-site/version.json
fixed-site/data/mushrooms-5.json
fixed-site/js/lib/merge.js
```

Do not include unchanged files.

Do not include stale root files.

Do not include `config.js` unless it actually changed.

Every named package must update:

```text
fixed-site/version.json
```

Use clear revision names, for example:

```text
v4.3.164-r2026-06-23-june-mushroom-season-route-cleanup1
```

Before recommending a package for apply, perform a self-audit:

```text
ZIP opens cleanly.
ZIP integrity test passes.
Only expected changed files are included.
Changed JSON files parse.
All fixed-site/**/*.json files parse in the staged tree.
All JSON paths loaded by fixed-site/js/data/sources.js exist and parse.
PHOTO_PATCH_PATHS remains empty unless explicitly revived.
Relevant JS passes node --check when app behavior changed.
Target records contain intended changes.
Dropped images are not exposed in images, images_structured, detail_images, enlarge_images, or list_thumbnail.
```

---

## 4. Source rules

Use strong sources for:

```text
mushrooms
toxic/caution plants
medicinal claims
dose/safety claims
unusual preparations
uncommon species
records with weak/conflicting data
unresolved taxonomy
```

Do not use Wikipedia alone to clear mushroom review, safety, medicinal, or edible-use issues.

Do not use marketing pages, recipe blogs, AI summaries, unsourced social posts, or casual internet claims as final proof for safety, medicinal use, source review, or edible-use clearance.

Use Wikipedia only as a lead or background pointer unless Tod explicitly allows otherwise for a low-risk task.

For mushroom ID and taxonomy, prefer sources such as:

```text
MushroomExpert
regional mycology groups with reliable documentation
university/extension sources
field-guide-quality sources
government/agency sources where relevant
primary taxonomic sources when needed
```

For plants, prefer sources such as:

```text
USDA PLANTS
USDA FEIS
university/extension sources
government/agency sources
field-guide-quality sources
reputable ethnobotanical or food-use references
```

---

## 5. Plant source-review standard

Common edible plants do not require mushroom-level proof.

For common edible berries, fruits, nuts, greens, sap, and similar plant foods, do not treat obvious edible-use claims as unresolved just because the first source is range/taxonomy. One solid ID/range/habitat source plus one ordinary edible-use source is enough.

Common preparation-required plants are not hard blockers. For plants such as acorns, cattails, milkweed shoots, or similar well-known foraging staples, verify practical guardrails:

```text
edible part
correct season/stage
required preparation
safety cautions
major lookalikes or contamination concerns
```

Do not overcomplicate obvious edible berries such as thimbleberries, raspberries, blueberries, blackberries, serviceberries, or wild strawberries.

Do not underplay preparation/safety cautions for acorns, cattails, elderberry, pokeweed, milkweed, or similar records.

Medicinal/dose claims require stronger support than ordinary edible-use claims.

---

## 6. Mushroom source-review standard

Mushrooms require stricter review than common edible plants.

Do not food-promote a mushroom without adequate source support.

`needs_review:true` records may remain visible if safely framed.

Imageless mushroom records may remain visible if useful and not misleading.

ID/comparison mushroom records may remain visible if useful and safely framed.

Do not clear review status for mushrooms unless source support is strong enough for the claim being made.

Wikipedia-only mushroom records should generally remain review-needed.

Do not add or broaden mushroom seasons without source support.

Do not add June merely because a generic source says “summer/fall” unless the record is a broad group and the app intentionally treats summer as June–August. If using that broad rule, say so explicitly.

---

## 7. Food, edible, medicinal, and route rules

Useful records may remain visible even if they are not normal edible targets.

Do not suppress useful records merely because they are:

```text
imageless
needs_review
medicinal
other-use
ID/comparison
caution
non-food
```

Instead, route and frame them correctly.

Normal edible mushroom lists must not include:

```text
medicinal-only records
tea-extract-only records
other-use-only records
emergency-only records
survival-only records
warning/comparison records
caution-only records
poisonous/deadly records
not-recommended non-food records
non-culinary tea/decoction/extract records
records whose only ingestible support is medicinal/traditional use
```

Legitimate edible mushrooms with caution wording may appear in edible lists if they are truly food-valid.

Edible-with-caution and edible-with-preparation records should not be removed from edible routes just because they have safety wording.

Caution/lookalike group records should not stand in for actual edible species records.

---

## 8. Tea / infusion / decoction rule

Tea, infusion, and decoction may count as edible/ingestible use when the use is culinary, beverage, flavor, or ordinary food enjoyment.

Examples of potentially culinary beverage use:

```text
mint tea
sumac tea
spruce tip tea
berry-leaf tea
other ordinary beverage/flavor teas with safe support
```

Medicinal tea is different.

If the primary use is medicinal, tonic, supplement, therapeutic, traditional medicine, or health-effect related, classify the record as medicinal/traditional use rather than normal edible food use.

Chaga / Inonotus obliquus is medicinal/traditional tea use unless strong sources support a primarily culinary beverage role. It may remain visible and ingestible-use-aware, but it should not appear as a normal edible mushroom target.

---

## 9. Image-rights rules

Do not invent image rights.

Do not use Commons category pages as proof.

Do not use “See Wikimedia Commons file page” as adequate license metadata.

Do not rely on “Wikimedia Commons” alone as author, license, or source proof.

Verify exact Commons file-page rights when using Commons images.

For visible images, capture adequate rights metadata:

```text
source
source_url
author
credit
license
license_url
attribution_required
commercial_use_allowed
modification_allowed
share_alike_required
rights_checked
rights_checked_build
source_note / image_rights_notes when needed
```

If author/license/source page cannot be verified, mark it unclear and recommend dropping or suppressing the image.

Dropped images must not remain exposed in:

```text
images
images_structured
detail_images
enlarge_images
list_thumbnail
```

Do not restore old image paths unless exact rights have been verified.

---

## 10. Review, suppression, and visibility rules

Fully suppressed is for bad/unresolved data, not merely review/imageless/comparison status.

Do not suppress useful records just because they are:

```text
needs_review
needs_images
imageless
ID/comparison only
medicinal/traditional use
other-use
```

Use suppression only when the record is misleading, duplicate, bad data, unsafe as displayed, outside scope, or cannot be honestly represented.

If a record remains visible but should not be a food target, use appropriate fields such as:

```text
food_role: avoid
food_role: medicinal_only
food_role: tea_extract_only
food_role: other_use
use_roles: ["ID / comparison"]
use_roles: ["ID / caution"]
use_roles: ["Medicinal / traditional tea"]
use_roles: ["Other use"]
edible_use.has_ingestible_use: false
```

Use the project’s existing schema where possible. Do not invent new schema fields casually.

---

## 11. Route/category rules

Before changing route behavior, determine whether the problem is:

```text
data-field issue
season-field issue
route/classifier issue
cache/deploy issue
missing record issue
```

Prefer narrow data-field fixes when possible.

Do not make broad route/classifier changes unless route-count evidence shows the classifier is truly wrong.

Do not remove legitimate edible-with-caution records from edible routes.

Do not keep medicinal/non-food records in edible routes just to preserve counts.

For season work, distinguish:

```text
record is valid and already in season
record is valid but missing June/season field
record is valid but should remain later-season
record is missing and should be future add candidate
record should not be added
record is non-food and should route elsewhere
```

---

## 12. Worker output rules

Workers must return findings only.

Use clear outcomes:

```text
PASS
HOLD
BUILD-READY
KEEP / NO CHANGE
ADD CANDIDATE
SOURCE NEEDED
REVIEW NEEDED
ROUTE FIX NEEDED
IMAGE RIGHTS UNCLEAR
DROP IMAGE
SUPERVISOR DECISION
REJECT / DO NOT ADD
```

Avoid vague “maybe” conclusions. If a task is blocked, identify:

```text
exact blocker
source/path checked
what evidence is missing
next acquisition path
whether the record should be left unchanged
```

For each target record, report:

```text
slug
display/common name
scientific name
active canonical file path
current visible/suppressed status
current review status
current food_role / use_roles / edible_use
current source links/use_links
current image status when relevant
exact build-ready recommendation
fields to change
fields to leave unchanged
blockers
```

---

## 13. Supervisor handoff rule

Every supervisor handoff to another supervisor or worker must explicitly state:

```text
Before starting, review and follow:
1. The current ChatGPT project settings
2. PROJECT_RULES.md in the repo

PROJECT_RULES.md is controlling.
```

Handoffs must not rely on old copied instructions alone.

Every worker assignment must include the relevant project standards for the task, but the assignment should also point back to `PROJECT_RULES.md` as controlling.

---

## 14. Known project mistakes to avoid

Do not repeat these mistakes:

```text
Do not treat root-level data as active.
Do not use stale build folders as proof of current app behavior.
Do not use Commons category pages as image-rights proof.
Do not use "See Wikimedia Commons file page" as license metadata.
Do not restore unverified image paths.
Do not clear mushroom review from Wikipedia alone.
Do not classify Chaga as a normal edible mushroom.
Do not treat medicinal tea as normal edible food use.
Do not remove legitimate edible-with-caution mushrooms from edible routes.
Do not keep medicinal/other-use/warning records in edible routes to preserve counts.
Do not overcomplicate obvious edible plants like thimbleberries.
Do not make broad route-code changes when a narrow data-field fix is enough.
Do not split canonical JSON files just for tool comfort if the app works and ZIP-based packaging is acceptable.
```

---

## 15. Final principle

This is a safety-sensitive foraging app.

Accuracy, safety, source clarity, exact image rights, and stable app behavior matter more than record count.

When uncertain, keep the record visible only if it can be safely and honestly framed. Otherwise mark it for review, source work, image work, route cleanup, or supervisor decision.
