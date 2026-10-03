import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createGameServer } from '../../server/server.js';
import { questions } from '../../server/questionsData.js';
import { findBrowser, withChromePage } from './chromeHarness.mjs';

const origins = [];
const game = createGameServer({ origins, game: { countdownMs: 10, questionCount: 1, transitionMs: 400 } });
await new Promise(resolve => game.httpServer.listen(0, '127.0.0.1', resolve));
const gameUrl = `http://127.0.0.1:${game.httpServer.address().port}`;
const root = resolve(import.meta.dirname, '../..');
const vite = await createServer({ root, configFile: false, envDir: false,
  resolve: { alias: { '@': resolve(root, 'src') } }, optimizeDeps: { entries: ['index.html'] },
  plugins: [react(), tailwindcss()],
  define: { 'import.meta.env.VITE_GAME_SERVER_URL': JSON.stringify(gameUrl),
    'import.meta.env.VITE_SUPABASE_URL': '""', 'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': '""' },
  server: { host: '127.0.0.1', port: 0, hmr: false } });
await vite.listen();
after(async () => { await vite.close(); await game.close(); });
const origin = `http://127.0.0.1:${vite.httpServer.address().port}`;
origins.push(origin);
const clickText = (page, selector, label) => page.evaluate(`Array.from(document.querySelectorAll(${JSON.stringify(selector)})).find(e => e.textContent.trim() === ${JSON.stringify(label)}).click()`);

test('canonical app lazily opens PvP, plays two browser clients, guards exit and preserves learning XP', async () => {
  await withChromePage(findBrowser(), origin, async first => {
    const second = await first.newPage(origin);
    const topBar = page => page.evaluate('document.querySelector("[role=banner]").innerText');
    try {
      await first.waitFor('document.querySelectorAll("nav button").length === 5 && Boolean(document.querySelector("[role=banner]"))');
      await second.waitFor('document.querySelectorAll("nav button").length === 5');
      const before = await topBar(first);
      assert.equal(await first.evaluate('performance.getEntriesByType("resource").some(e=>e.name.includes("DauTriScreen"))'), false);
      for (const page of [first, second]) {
        await page.evaluate('localStorage.setItem("pvp-unrelated-proof", "keep")');
        await clickText(page, 'nav button', 'ĐẤU TRÍ');
        await page.waitFor('document.body.innerText.includes("Đã kết nối máy chủ")');
      }
      await clickText(first, 'button', 'TÌM ĐỐI THỦ ONLINE');
      await first.waitFor('document.body.innerText.includes("Đang chờ người chơi online")');
      await first.evaluate('window.confirm = () => false');
      await clickText(first, 'nav button', 'HỌC');
      assert.equal(await first.evaluate('document.querySelector("nav [aria-current]").textContent.trim()'), 'ĐẤU TRÍ');
      await clickText(second, 'button', 'TÌM ĐỐI THỦ ONLINE');
      for (const page of [first, second]) await page.waitFor(`Boolean(document.querySelector('[aria-label="Các lựa chọn trả lời"] button'))`);
      const prompt = await first.evaluate('document.querySelector("section h2.font-bold.text-base").textContent');
      assert.equal(await second.evaluate('document.querySelector("section h2.font-bold.text-base").textContent'), prompt);
      const answer = questions.find(q => q.question === prompt).correctIndex;
      for (const page of [first, second]) await page.evaluate(`document.querySelectorAll('[aria-label="Các lựa chọn trả lời"] button')[${answer}].click()`);
      for (const page of [first, second]) await page.waitFor('document.body.innerText.includes("TÌM TRẬN MỚI")');
      assert.match(await first.evaluate('document.body.innerText'), /Chưa ghi vào XP, xu hoặc rank/);
      assert.equal(await first.evaluate('localStorage.getItem("pvp-unrelated-proof")'), 'keep');
      assert.equal(await topBar(first), before);
      for (const [width, height] of [[375,812], [430,932], [812,375]]) {
        await first('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true });
        assert.equal(await first.evaluate('document.documentElement.scrollWidth <= innerWidth'), true);
      }
      await clickText(first, 'button', 'VỀ TRANG CHỦ');
      await first.waitFor('document.querySelector("nav [aria-current]").textContent.trim() === "HỌC"');
    } finally { await second.close(); }
  });
});

test('account A to B to A starts fresh guest identities and does not retain another account queue', async () => {
  await withChromePage(findBrowser(), `${origin}/tests/qa/fixtures/pvp-account.html`, async page => {
    const identities = [];
    for (let epoch = 1; epoch <= 3; epoch++) {
      await page.waitFor('document.body.innerText.includes("Đã kết nối máy chủ")');
      const current = await page.evaluate(`Object.entries(sessionStorage).map(([key,value])=>({key,player:JSON.parse(value).player})).find(entry=>entry.key.endsWith(':${epoch}')).player`);
      assert.equal(current.username, epoch % 2 ? 'Account A' : 'Account B');
      identities.push(current.userId);
      assert.ok(!(await page.evaluate('document.body.innerText')).includes('Đang chờ người chơi online'));
      await clickText(page, 'button', 'TÌM ĐỐI THỦ ONLINE');
      await page.waitFor('document.body.innerText.includes("Đang chờ người chơi online")');
      if (epoch < 3) await page.evaluate('document.querySelector("#switch-account").click()');
    }
    assert.equal(new Set(identities).size, 3);
  });
});

test('legacy lobby rules, real leaderboard, private room, forfeit and rematch controls work', async () => {
  await withChromePage(findBrowser(), origin, async first => {
    const second = await first.newPage(origin);
    try {
      for (const page of [first, second]) {
        await page.waitFor('document.querySelectorAll("nav button").length === 5');
        await clickText(page, 'nav button', 'ĐẤU TRÍ');
        await page.waitFor('document.body.innerText.includes("Đã kết nối máy chủ")');
        assert.match(await page.evaluate('document.body.innerText'), /TRƯỜNG ĐẤU SỬ HỌC/);
      }
      for (const [width, height] of [[375,812], [430,932], [812,375]]) {
        await first('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true });
        assert.equal(await first.evaluate('document.documentElement.scrollWidth <= innerWidth'), true);
        assert.equal(await first.evaluate(`(()=>{const area=document.querySelector('[aria-label="Nội dung Đấu Trí online"]');return area.scrollWidth<=area.clientWidth})()`), true);
      }
      await first('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
      await mkdir(resolve(root, 'output'), { recursive: true });
      const capture = await first('Page.captureScreenshot', { format: 'png' });
      await writeFile(resolve(root, 'output/pvp-lobby-375.png'), Buffer.from(capture.data, 'base64'));
      await clickText(first, 'button', '📜 Luật thi đấu');
      await first.waitFor('Boolean(document.querySelector("dialog[open]"))');
      assert.equal(await first.evaluate('document.querySelector("dialog").contains(document.activeElement)'), true);
      await clickText(first, 'dialog button', 'ĐÃ HIỂU');
      assert.equal(await first.evaluate('Boolean(document.querySelector("dialog[open]"))'), false);
      await clickText(first, 'button', '🏆 Bảng Xếp Hạng');
      await first.waitFor('Boolean(document.querySelector("dialog[open]"))');
      await clickText(first, 'dialog button', 'Tìm tôi');
      await first.waitFor('document.querySelector("dialog").innerText.includes("Bạn chưa hoàn thành trận đấu nào")');
      await first.evaluate('document.querySelector("dialog button[aria-label=Đóng]").click()');
      await clickText(second, 'button', 'VÀO PHÒNG');
      await second.waitFor('document.querySelector("#battle-room-code").getAttribute("aria-invalid") === "true"');
      await clickText(first, 'button', 'TẠO PHÒNG');
      await first.waitFor(`Boolean(document.querySelector('[aria-label^="Mã phòng"]'))`);
      const code = await first.evaluate(`document.querySelector('[aria-label^="Mã phòng"]').textContent`);
      // React's value tracker needs the native setter for a real controlled-input update.
      await second.evaluate(`Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(document.querySelector('#battle-room-code'),${JSON.stringify(code)}); document.querySelector('#battle-room-code').dispatchEvent(new Event('input',{bubbles:true}))`);
      await clickText(second, 'button', 'VÀO PHÒNG');
      for (const page of [first, second]) await page.waitFor(`Boolean(document.querySelector('[aria-label="Các lựa chọn trả lời"] button'))`);
      await clickText(first, 'button', 'BỎ CUỘC');
      await first.waitFor('Boolean(document.querySelector("dialog[open]"))');
      await clickText(first, 'dialog button', 'Ở LẠI TRẬN');
      assert.equal(await first.evaluate('Boolean(document.querySelector("dialog[open]"))'), false);
      await clickText(first, 'button', 'BỎ CUỘC'); await clickText(first, 'dialog button', 'XÁC NHẬN BỎ CUỘC');
      for (const page of [first, second]) await page.waitFor('document.body.innerText.includes("TÌM TRẬN MỚI")');
      assert.match(await second.evaluate('document.body.innerText'), /BẠN THẮNG/);
      await clickText(second, 'button', 'BẢNG XẾP HẠNG');
      await second.waitFor('Boolean(document.querySelector("dialog ol li"))');
      assert.match(await second.evaluate('document.querySelector("dialog ol").innerText'), /50 RP/);
      await second.evaluate('document.querySelector("dialog button[aria-label=Đóng]").click()');
      await clickText(second, 'button', 'TÌM TRẬN MỚI');
      await second.waitFor('document.body.innerText.includes("Đang chờ người chơi online")');
      await clickText(second, 'button', 'HỦY TÌM TRẬN');
      await second.waitFor('document.body.innerText.includes("TẠO PHÒNG")');
      await clickText(second, 'button', 'TẠO PHÒNG');
      await second.waitFor('document.body.innerText.includes("ĐÓNG PHÒNG")');
      await clickText(second, 'button', 'ĐÓNG PHÒNG');
      await second.waitFor('document.body.innerText.includes("TÌM ĐỐI THỦ ONLINE")');
    } finally { await second.close(); }
  });
});

test('offline match button starts cancellable connection and never queues a cancelled intent', async () => {
  await withChromePage(findBrowser(), `${origin}/tests/qa/fixtures/pvp-wakeup.html`, async page => {
    await page.waitFor('document.body.innerText.includes("TÌM ĐỐI THỦ ONLINE")');
    assert.equal(await page.evaluate('Array.from(document.querySelectorAll("button")).find(e=>e.textContent==="TÌM ĐỐI THỦ ONLINE").disabled'), false);
    await clickText(page, 'button', 'TÌM ĐỐI THỦ ONLINE');
    await page.waitFor('document.body.innerText.includes("HỦY KẾT NỐI")');
    await clickText(page, 'button', 'HỦY KẾT NỐI');
    assert.equal(await page.evaluate('window.pvpSessions'), 0);
    await page.evaluate('window.pvpAwake = true');
    await clickText(page, 'button', 'TẠO PHÒNG');
    await page.waitFor('document.body.innerText.includes("ĐÓNG PHÒNG")');
    assert.equal(await page.evaluate('window.pvpSessions'), 1);
    assert.equal(await page.evaluate('document.body.innerText.includes("Đang chờ người chơi online")'), false);
  });
});
