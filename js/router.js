import { slugifyHash } from "./utils.js";

export function parseRoute(hash) {
  const raw = slugifyHash(hash || "#/home");
  if (raw.startsWith("detail/")) {
    return { page: "detail", slug: decodeURIComponent(raw.slice(7)) };
  }
  const page = raw || "home";
  return { page, slug: null };
}
