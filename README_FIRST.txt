UP FORAGING GUIDE FIX PACKAGE

What is in this zip
- js/state.js
- js/pages-mainfix4-commonness-v3.js
- js/rare-watch.js

What these fix
1. Restores the Rare / Endangered page by fixing the rare-page render call.
2. Adds defaults so the rare page will not crash if sightings data is missing.
3. Makes state shared through a global singleton so different ?v= module imports stop splitting the app into separate states.
4. Adds a "Start here" section to the Mushrooms page.

How to use
- Unzip this package.
- Copy the included js files over the matching files in your existing site.
- Do not change your other files unless you want to layer on more cleanup later.

Important
This is a targeted fix package built around the broken files I could verify directly.
It is not a full mirror of the entire repo.
