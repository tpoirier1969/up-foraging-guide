# Mushroom Host Filter Gap Note

## Version
v0.6

## What the current behavior means
If the app only shows **Conifer** and then only **Tamarack/Larch** as host-tree options, that does **not** mean the other mushrooms in the list do not grow on trees.

It means the current data and inference layer are still incomplete.

## Plain-language truth
The present build is exposing only the host-tree relationships that were actually mapped or inferred with enough confidence from the imported material.

So the current filter is a **data coverage gap**, not a biological claim.

## What still needs to happen
To make the mushroom host filters honest and useful, the app needs:

1. A broader controlled vocabulary for host trees
2. More species-by-species ecology tagging
3. Broad wood classes and specific tree classes working together
4. Clear handling of unknown host trees

## Filter behavior the app should support
Users should be able to filter mushrooms by:

- substrate type, such as soil, dead wood, stump, log, living tree
- broad wood class, such as hardwood or conifer
- specific host tree, such as birch, maple, cherry, oak, beech, pine, spruce, tamarack/larch
- unknown host tree, because many users will not know the exact tree species

## Expected future logic
- Selecting **Hardwood** should return mushrooms associated with hardwood in general plus mushrooms tied to specific hardwood trees.
- Selecting **Conifer** should return mushrooms associated with conifers in general plus mushrooms tied to specific conifers.
- Selecting a specific tree like **Cherry** should narrow the result set further.
- Selecting nothing should not imply "does not grow on wood."

## Bottom line
The current mushroom tree filter is incomplete. It should be treated as a temporary limitation in the tagging layer, not as a factual statement about where those mushrooms grow.
