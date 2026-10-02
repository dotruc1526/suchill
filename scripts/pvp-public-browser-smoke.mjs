import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { findBrowser, withChromePage } from "../tests/qa/chromeHarness.mjs";

const url = new URL(process.argv[2]);
assert.equal(url.protocol, "https:");
assert.equal(url.pathname, "/"); assert.ok(!url.username && !url.password && !url.search && !url.hash);
const root = resolve(import.meta.dirname, "..");
const response = await fetch(`${url.origin}/health`, { signal: AbortSignal.timeout(15000) });
assert.equal(response.status, 200); assert.equal((await response.json()).status, "ok");
const click = (page, label) => page.evaluate(`Array.from(document.querySelectorAll('button')).find(e=>e.textContent.trim()===${JSON.stringify(label)}).click()`);
await withChromePage(findBrowser(), url.origin, async first => {
  const second = await first.newPage(url.origin);
  try {
    for (const [page, name] of [[first, "QA-PvP-A"], [second, "QA-PvP-B"]]) {
      await page.waitFor('Boolean(document.querySelector("#trial-name"))');
      await page.evaluate(`Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(document.querySelector('#trial-name'),${JSON.stringify(name)}); document.querySelector('#trial-name').dispatchEvent(new Event('input',{bubbles:true}))`);
      await click(page, "VÀO TRƯỜNG ĐẤU");
      await page.waitFor('document.body.innerText.includes("Đã kết nối máy chủ")');
    }
    await first("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
    await first("Page.bringToFront");
    const capture = await first("Page.captureScreenshot", { format: "png" });
    await mkdir(resolve(root, "output"), { recursive: true });
    await writeFile(resolve(root, "output/pvp-public-375.png"), Buffer.from(capture.data, "base64"));
    // Private room keeps this public QA from consuming another user's random opponent.
    await click(first, "TẠO PHÒNG");
    await first.waitFor(`Boolean(document.querySelector('[aria-label^="Mã phòng"]'))`);
    const code = await first.evaluate(`document.querySelector('[aria-label^="Mã phòng"]').textContent`);
    await second.evaluate(`Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(document.querySelector('#battle-room-code'),${JSON.stringify(code)}); document.querySelector('#battle-room-code').dispatchEvent(new Event('input',{bubbles:true}))`);
    await click(second, "VÀO PHÒNG");
    for (const page of [first, second]) await page.waitFor(`Boolean(document.querySelector('[aria-label="Các lựa chọn trả lời"] button'))`);
    const question = await first.evaluate("document.querySelector('h2.font-bold.text-base').textContent");
    assert.equal(question, await second.evaluate("document.querySelector('h2.font-bold.text-base').textContent"));
    await click(first, "BỎ CUỘC"); await click(first, "XÁC NHẬN BỎ CUỘC");
    for (const page of [first, second]) await page.waitFor('document.body.innerText.includes("TÌM TRẬN MỚI")');
    assert.match(await second.evaluate("document.body.innerText"), /BẠN THẮNG/);
    await click(second, "TÌM TRẬN MỚI");
    await second.waitFor('document.body.innerText.includes("Đang chờ người chơi online")');
    await click(second, "HỦY TÌM TRẬN");
    await second.waitFor('document.body.innerText.includes("TẠO PHÒNG")');
    console.log(JSON.stringify({ publicUrl: url.origin, browserClients: 2, sameQuestion: true, friendRoom: "passed", forfeit: "passed", rematchCancel: "passed", screenshot: "output/pvp-public-375.png", physicalWifi4g: "not-yet-tested" }));
  } finally { await second.close(); }
});
