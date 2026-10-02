import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createGameServer } from "../../server/server.js";
import { findBrowser, withChromePage } from "./chromeHarness.mjs";

const root = resolve(import.meta.dirname, "../..");
const directory = resolve(root, "output/pvp-trial/dist");
const origins = [];
const server = createGameServer({ origins, staticDir: directory, game: { countdownMs: 5, questionCount: 1 } });
await new Promise(resolve => server.httpServer.listen(0, "127.0.0.1", resolve));
const url = `http://127.0.0.1:${server.httpServer.address().port}`;
origins.push(url);
after(() => server.close());
const click = (page, label) => page.evaluate(`Array.from(document.querySelectorAll('button')).find(e=>e.textContent.trim()===${JSON.stringify(label)}).click()`);
const name = (page, value) => page.evaluate(`Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(document.querySelector('#trial-name'),${JSON.stringify(value)}); document.querySelector('#trial-name').dispatchEvent(new Event('input',{bubbles:true}))`);

test("built standalone trial serves UI/assets/health, denies unapproved sessions, has no account config", async () => {
  const response = await fetch(url);
  assert.equal(response.status, 200); assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  const html = await response.text(); assert.match(html, /Đấu Trí online thử nghiệm/);
  const asset = html.match(/src="([^"]+\.js)"/)[1];
  const bundle = await (await fetch(url + asset)).text();
  assert.ok(!bundle.includes("supabase.co")); assert.ok(!bundle.includes("sb_publishable_"));
  assert.ok(!bundle.includes("sb_secret_")); assert.ok(!bundle.includes("SESSION_SECRET"));
  assert.equal((await fetch(url + "/health")).status, 200);
  assert.equal((await fetch(url + "/.env")).status, 404);
  assert.equal((await fetch(url + "/session", { method: "POST", headers: { Origin: "https://unapproved.example", "Content-Type": "application/json" }, body: '{"username":"X"}' })).status, 403);
  assert.match(await readFile(resolve(directory, "index-pvp.html"), "utf8"), /noindex/);
});

test("two pages of the built trial use same-origin backend, enter names and finish a real match", async () => {
  await withChromePage(findBrowser(), url, async first => {
    const second = await first.newPage(url);
    try {
      for (const [page, display] of [[first, "Học giả A"], [second, "Học giả B"]]) {
        await page.waitFor('Boolean(document.querySelector("#trial-name"))');
        await name(page, display); await click(page, "VÀO TRƯỜNG ĐẤU");
        await page.waitFor('document.body.innerText.includes("Đã kết nối máy chủ")');
      }
      await first("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
      assert.equal(await first.evaluate("document.documentElement.scrollWidth <= innerWidth"), true);
      await mkdir(resolve(root, "output"), { recursive: true });
      await first("Page.bringToFront");
      const capture = await first("Page.captureScreenshot", { format: "png" });
      await writeFile(resolve(root, "output/pvp-trial-375.png"), Buffer.from(capture.data, "base64"));
      for (const page of [first, second]) await click(page, "TÌM ĐỐI THỦ ONLINE");
      for (const page of [first, second]) await page.waitFor(`Boolean(document.querySelector('[aria-label="Các lựa chọn trả lời"] button'))`);
      assert.equal(await first.evaluate("document.querySelector('h2.font-bold.text-base').textContent"), await second.evaluate("document.querySelector('h2.font-bold.text-base').textContent"));
      await click(first, "BỎ CUỘC"); await click(first, "XÁC NHẬN BỎ CUỘC");
      for (const page of [first, second]) await page.waitFor('document.body.innerText.includes("TÌM TRẬN MỚI")');
      assert.match(await second.evaluate("document.body.innerText"), /BẠN THẮNG/);
      await click(second, "VỀ TRANG CHỦ");
      await second.waitFor('Boolean(document.querySelector("#trial-name"))');
    } finally { await second.close(); }
  });
});
