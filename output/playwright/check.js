async (page) => {
  const results = {};
  await page.goto('http://localhost:8080');
  await page.getByRole('button', {name:'Casa & mesa', exact:true}).click();
  results.filter = await page.locator('#gallery-count').innerText();
  if (await page.locator('.gallery-item').count() !== 6) throw new Error('Filtro casa');
  await page.getByRole('button', {name:'Todas', exact:true}).click();
  while (await page.locator('#load-more').isVisible()) await page.locator('#load-more').click();
  results.photos = await page.locator('.gallery-item').count();
  if (results.photos !== 37) throw new Error('Catálogo incompleto');
  await page.locator('.gallery-item').first().click();
  const first = await page.locator('#detail-title').innerText();
  await page.keyboard.press('ArrowRight');
  results.keyboard = first !== await page.locator('#detail-title').innerText();
  await page.locator('#detail-image').dispatchEvent('touchstart', {changedTouches:[{identifier:1,clientX:250,clientY:100}]});
  await page.locator('#detail-image').dispatchEvent('touchend', {changedTouches:[{identifier:1,clientX:80,clientY:105}]});
  results.swipe = (await page.locator('#photo-position').innerText()).startsWith('03');
  results.photoLink = await page.locator('#photo-contact').getAttribute('href');
  await page.keyboard.press('Escape');
  results.dialogClosed = !(await page.locator('#lightbox').isVisible());
  await page.evaluate(() => {window.open = url => {window.testWhatsAppUrl = url; return null;}});
  await page.getByRole('textbox', {name:'Como você se chama?'}).fill('Ana Teste');
  await page.getByRole('combobox').selectOption('Bolsa ou acessório');
  await page.getByRole('textbox', {name:'Cores desejadas'}).fill('Cru & dourado');
  await page.getByRole('textbox', {name:'Conte sua ideia'}).fill('Alça curta, por favor.');
  await page.getByRole('button', {name:'Continuar no WhatsApp'}).click();
  results.message = await page.evaluate(() => new URL(window.testWhatsAppUrl).searchParams.get('text'));
  if (!results.message.includes('Ana Teste') || !results.message.includes('Cru & dourado')) throw new Error('Mensagem incorreta');
  results.fallback = await page.locator('#form-status a').isVisible();
  results.widths = [];
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:900});
    results.widths.push(await page.evaluate(() => ({width:innerWidth,content:document.documentElement.scrollWidth})));
  }
  results.assets = await page.evaluate(async () => {const urls=[...new Set([...document.images].map(i=>i.src))];const failed=[];for(const url of urls){const r=await fetch(url);if(!r.ok)failed.push(url)}return {checked:urls.length,failed}});
  results.pwa = await page.evaluate(async () => {const r=await navigator.serviceWorker.ready;const m=await (await fetch('manifest.webmanifest')).json();return {active:r.active.state,icons:m.icons.length,display:m.display,cache:await caches.keys()}});
  await page.context().setOffline(true);
  await page.reload();
  results.offline = await page.title();
  await page.context().setOffline(false);
  if (!results.keyboard || !results.swipe || results.assets.failed.length || results.widths.some(v=>v.content>v.width)) throw new Error(JSON.stringify(results));
  console.log(JSON.stringify(results,null,2));
}

