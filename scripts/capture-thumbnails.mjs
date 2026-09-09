import { chromium } from "playwright";
import path from "node:path";

const OUT = "/Users/kn/devel/localtools/content/ph-assets";
const FILE = "file://" + path.join(OUT, "thumbnails.html");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 960, height: 240 },
  deviceScaleFactor: 4,
});
await page.goto(FILE);
await page.waitForTimeout(300);

for (const [id, name] of [
  ["thumb-a", "thumb-a-shield.png"],
  ["thumb-b", "thumb-b-docbar.png"],
  ["thumb-c", "thumb-c-shieldcheck.png"],
  ["thumb-d", "thumb-d-eraser.png"],
]) {
  await page.locator("#" + id).screenshot({ path: path.join(OUT, "raw-" + name) });
  console.log("raw saved:", name);
}
await browser.close();
