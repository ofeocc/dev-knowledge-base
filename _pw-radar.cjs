const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push('[console.error] ' + m.text().slice(0,140)); });
  page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message.slice(0,160)));

  await page.goto('http://127.0.0.1:3108/?view=overview', { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log('goto warn', e.message));
  await page.waitForTimeout(2500);

  // dump nav / view links and headings
  const info = await page.evaluate(() => {
    const navLinks = Array.from(document.querySelectorAll('a[href]'))
      .map(a => ({ text: (a.textContent||'').trim().slice(0,30), href: a.getAttribute('href') }))
      .filter(x => x.href && (x.href.includes('view=') || x.href.includes('/'))).slice(0, 40);
    const h = Array.from(document.querySelectorAll('h1,h2,h3')).map(x => (x.textContent||'').trim().slice(0,40));
    return { title: document.title, navLinks, headings: h.slice(0,30) };
  });
  console.log('TITLE:', info.title);
  console.log('HEADINGS:', JSON.stringify(info.headings));
  console.log('NAV LINKS:', JSON.stringify(info.navLinks, null, 1));

  // full page screenshot
  await page.screenshot({ path: 'D:/workspace-for-deepseek/radar-overview.png', fullPage: true });
  console.log('shot saved overview');
  console.log('errors:', errors.length ? JSON.stringify(errors, null, 1) : 'none');

  await browser.close();
})().catch((e) => { console.error('SCRIPT ERROR:', e); process.exit(1); });
