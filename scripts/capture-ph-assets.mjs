import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(__dirname, "..");
const FIXTURE = path.join(APP_DIR, "fixtures", "basic.pdf");
const OUT_DIR = "/Users/kn/devel/localtools/content/ph-assets";
const FRAMES_DIR = path.join(OUT_DIR, "gif-frames");

async function startPreview() {
  const proc = spawn("npm", ["run", "preview", "--", "--port", "4173", "--strictPort"], {
    cwd: APP_DIR,
    stdio: "pipe",
    detached: true,
  });
  const url = await new Promise((resolve, reject) => {
    let output = "";
    const handler = (chunk) => {
      output += chunk.toString();
      const match = output.match(/(http:\/\/localhost:\d+)\//);
      if (match) {
        proc.stdout.off("data", handler);
        proc.stderr.off("data", handler);
        resolve(match[1]);
      }
    };
    proc.stdout.on("data", handler);
    proc.stderr.on("data", handler);
    setTimeout(() => reject(new Error("Preview did not start: " + output)), 20000);
  });
  return { proc, url };
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT_DIR, name) });
  console.log("saved", name);
}

async function frame(page, name) {
  await page.screenshot({ path: path.join(FRAMES_DIR, name) });
}

async function main() {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
  const { proc, url } = await startPreview();
  const requestsAfterLoad = [];
  let recording = false;

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1270, height: 760 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    page.on("request", (req) => {
      if (recording) requestsAfterLoad.push(req.url());
    });

    // --- Shot 1: landing / drop zone ---
    await page.goto(`${url}/pdf/redact`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("text=Drop a PDF here", { timeout: 15000 });
    // wait for service worker install + precache, then reload so SW controls the
    // page (needed for the offline shot later)
    await page.evaluate(() => navigator.serviceWorker?.ready);
    await page.reload();
    await page.waitForSelector("text=Drop a PDF here", { timeout: 15000 });
    // dismiss cookie banner so it doesn't cover UI in the shots
    await page.getByRole("button", { name: "Decline" }).click();
    await page.waitForTimeout(600);
    await shot(page, "ph-01-drop.png");
    await frame(page, "f01.png");

    // --- Upload fixture ---
    recording = true;
    await page.locator('input[type="file"]').setInputFiles(FIXTURE);
    await page.waitForSelector("text=Page 1 of 1", { timeout: 30000 });
    await page.waitForTimeout(800);
    await frame(page, "f02.png");

    // --- Shot 2: search + highlighted matches ---
    await page.locator('label[for="ssn"]').click();
    await page.locator('button:has-text("Find matches")').click();
    await page.waitForSelector("text=match(es) marked for redaction", { timeout: 30000 });
    await page.waitForTimeout(800);
    await shot(page, "ph-02-search.png");
    await frame(page, "f03.png");

    // --- Apply ---
    await page.locator('button:has-text("Apply redactions")').click();
    await frame(page, "f04.png");
    await page.getByRole("button", { name: "Continue" }).click();
    await frame(page, "f05.png");

    // --- Shot 3: verified ---
    await page.waitForSelector("text=Verified: 0 matches remain", { timeout: 30000 });
    await page.locator("text=Verified: 0 matches remain").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await shot(page, "ph-03-verified.png");
    await frame(page, "f06.png");
    recording = false;

    // --- Shot 4: offline still works ---
    await context.setOffline(true);
    try {
      await page.reload({ timeout: 20000 });
      await page.waitForSelector("text=Drop a PDF here", { timeout: 20000 });
      await page.waitForTimeout(500);
      await shot(page, "ph-04-offline.png");
    } catch (err) {
      console.warn("offline reload failed (SW not ready?):", err.message);
    }
    await context.setOffline(false);

    // request log as supporting evidence for the "0 bytes" story
    fs.writeFileSync(
      path.join(OUT_DIR, "requests-during-redaction.txt"),
      requestsAfterLoad.length
        ? requestsAfterLoad.join("\n")
        : "No network requests fired during upload, search, redaction and verification.\n"
    );
    console.log("requests during redaction:", requestsAfterLoad.length);

    await browser.close();
  } finally {
    try {
      process.kill(-proc.pid, "SIGTERM");
    } catch {
      proc.kill("SIGTERM");
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
