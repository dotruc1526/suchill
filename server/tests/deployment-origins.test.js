import { test } from "node:test";
import assert from "node:assert/strict";
import { deploymentOrigins } from "../deploymentOrigins.js";

test("standalone Render origin is exact, requires HTTPS and cannot be derived from a client host", () => {
  const env = { NODE_ENV: "production", RENDER: "true", STATIC_DIR: "/app/public", RENDER_EXTERNAL_URL: "https://trial-example.onrender.com" };
  assert.deepEqual(deploymentOrigins(env), ["https://trial-example.onrender.com"]);
  assert.deepEqual(deploymentOrigins({ ...env, ALLOWED_ORIGINS: "https://old-preview.example" }), ["https://old-preview.example", "https://trial-example.onrender.com"]);
  for (const url of ["http://trial-example.onrender.com", "https://name:password@trial-example.onrender.com", "https://trial-example.onrender.com/path"]) {
    assert.throws(() => deploymentOrigins({ ...env, RENDER_EXTERNAL_URL: url }));
  }
  assert.throws(() => deploymentOrigins({ NODE_ENV: "production", RENDER_EXTERNAL_URL: env.RENDER_EXTERNAL_URL }));
  assert.deepEqual(deploymentOrigins({ ALLOWED_ORIGINS: "https://frontend.example,https://other.example" }), ["https://frontend.example", "https://other.example"]);
});
