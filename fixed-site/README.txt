Clean Build v2

This package now includes local JSON files inside the zip:
- data/plants.json
- data/mushrooms.json
- data/rare_endangered.json

Architecture:
- plants and mushrooms are the canonical species stores
- medicinal is a flag/property, not its own duplicated species file
- non-edible is a flag/property, not its own duplicated species file
- rare/endangered stays separate

Important honesty note:
- The species source that was available in-chat was the current repo species.json.
- In this notebook build, that repo species content was only partially available directly in the tool transcript, so the included split JSONs reflect the currently captured data rather than the entire live repo unless a full sidecar file was present.
- The file structure and app architecture are the corrected part here.
