import { FETCH_TIMEOUT_MS } from "../config.js";

function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`Timeout after ${ms}ms: ${label}`)), ms);
    promise.then(
      value => { clearTimeout(id); resolve(value); },
      err => { clearTimeout(id); reject(err); }
    );
  });
}

export async function fetchJsonFromRepo(path) {
  const res = await withTimeout(fetch(path, { cache: "no-store" }), FETCH_TIMEOUT_MS, path);
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
  return res.json();
}
