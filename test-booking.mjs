import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outDir = '/tmp/salongen-screenshots';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await (await browser.newContext()).newPage();

// Capture console errors
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

// 1. Load homepage — skip the 72s intro via localStorage
await page.goto('http://localhost:3002');
await page.evaluate(() => localStorage.setItem('introSeen', 'true'));
await page.reload({ waitUntil: 'networkidle' });
await page.screenshot({ path: `${outDir}/1-homepage.png`, fullPage: false });
console.log('✓ Homepage loaded');

// 2. Click "Book Cinema"
await page.click('text=Book Cinema');
await page.waitForSelector('text=Upcoming Events', { timeout: 5000 });
await page.screenshot({ path: `${outDir}/2-modal-step1.png` });
console.log('✓ Booking modal opened — Step 1 (events)');

// 3. Wait for events to load (loading... disappears)
await page.waitForFunction(() => !document.body.innerText.includes('Loading...'), { timeout: 8000 }).catch(() => {});
const modalContent = await page.locator('[class*="max-w-2xl"]').textContent();
console.log('  Modal content snippet:', modalContent?.slice(0, 200));
await page.screenshot({ path: `${outDir}/3-modal-events.png` });

const noEvents = await page.locator('text=No upcoming events').count();
if (noEvents > 0) {
  console.log('  → No events in DB yet (expected if tables are empty)');
} else {
  const firstEvent = page.locator('button').filter({ hasText: /\d+ seats/i }).first();
  if (await firstEvent.count() > 0) {
    await firstEvent.click();
    await page.waitForSelector('text=Select Seats', { timeout: 5000 });
    await page.screenshot({ path: `${outDir}/4-modal-step2.png` });
    console.log('✓ Step 2 — seat map visible');
  }
}

// Close modal
await page.keyboard.press('Escape');

// Console errors
if (errors.length > 0) {
  console.log('\nConsole errors:');
  errors.forEach(e => console.log(' ', e));
} else {
  console.log('\n✓ No console errors');
}

await browser.close();
