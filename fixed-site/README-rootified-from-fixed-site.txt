This package rootifies the fixed-site app shell.

What it does:
- puts the fixed-site app files at repo root paths:
  index.html
  styles/base.css
  js/...
- keeps data loading pointed at the EXISTING fixed-site/data/*.json files
- keeps the optional image manifest pointed at fixed-site/data/species-images.json

Important:
- Do not delete fixed-site/data/
- This package assumes the current fixed-site data folder remains in the repo
- Upload these files at repo root, preserving folders
