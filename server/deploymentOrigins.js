export function deploymentOrigins(env = process.env) {
  const origins = env.ALLOWED_ORIGINS?.trim() ? env.ALLOWED_ORIGINS.split(",").map(value => value.trim()) : [];
  // Use Render's documented deployment URL, never a caller-supplied Host header.
  if (env.STATIC_DIR && env.RENDER === "true" && env.RENDER_EXTERNAL_URL) {
    const url = new URL(env.RENDER_EXTERNAL_URL);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("Invalid deployment origin");
    if (!origins.includes(url.origin)) origins.push(url.origin);
  }
  if (origins.length) return origins;
  if (env.NODE_ENV === "production") throw new Error("Production requires ALLOWED_ORIGINS or Render same-origin hosting");
  return ["http://localhost:8443", "http://127.0.0.1:8443"];
}
