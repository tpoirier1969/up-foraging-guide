Replace these files in your site with the ones in this package.

Included fixes:
- single visible version number normalized to v3.1.1
- Rare / Endangered restored in the live v3 shell and app route
- mushrooms page now includes a visible Start here section
- sort controls restored on search/plants/mushrooms/medicinal/lookalikes/review
- References search no longer shows Clear all filters
- shared singleton imports normalized for state/constants to stop mixed-version flashes and split state behavior

This package is built against the live v3 shell files I could inspect in the repo.
It replaces the front door and the core JS wiring rather than just patching one widget.
