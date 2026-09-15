async (page) => {
 await page.evaluate(async()=>{for(const r of await navigator.serviceWorker.getRegistrations())await r.unregister();for(const k of await caches.keys())await caches.delete(k)});
 await page.reload();
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  const result=await page.evaluate(()=>{const r=document.querySelector('.gallery-photo').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,ratio:r.width/r.height}});
  if(result.overflow||Math.abs(result.ratio-2/3)>.01)throw Error(JSON.stringify({width,...result}));
 }
 await page.setViewportSize({width:390,height:844});
 if(await page.locator('.gallery-item').count()!==16)throw Error('Initial count');
 await page.locator('#gallery').scrollIntoViewIfNeeded();
 await page.screenshot({path:'output/playwright/carousel-mobile.png'});
 await page.locator('.gallery-item').nth(2).click();
 await page.waitForFunction(()=>document.querySelector('#photo-position').textContent.startsWith('03'));
 await page.getByRole('button',{name:'Próxima foto',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('#photo-position').textContent.startsWith('04'));
 await page.waitForFunction(()=>{const t=document.querySelector('#photo-track');return Math.abs(t.scrollLeft-3*t.clientWidth)<2});
 await page.keyboard.press('ArrowLeft');
 await page.waitForFunction(()=>document.querySelector('#photo-position').textContent.startsWith('03'));
 await page.waitForFunction(()=>{const t=document.querySelector('#photo-track');return Math.abs(t.scrollLeft-2*t.clientWidth)<2});
 const cdp=await page.context().newCDPSession(page);
 const r=await page.locator('#photo-track').boundingBox();
 const x=r.x+r.width*.8,y=r.y+r.height*.5;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*r.width*.075,y}]});await page.waitForTimeout(25)}
 const during=await page.locator('#photo-track').evaluate(t=>t.scrollLeft/t.clientWidth);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 if(during<=2.1)throw Error('Track did not follow touch');
 await page.waitForFunction(()=>document.querySelector('#photo-position').textContent.startsWith('04'));
 await page.waitForFunction(()=>{const t=document.querySelector('#photo-track');return Math.abs(t.scrollLeft-3*t.clientWidth)<2});
 await page.screenshot({path:'output/playwright/carousel-modal-mobile.png'});
 const link=await page.locator('#photo-contact').getAttribute('href');
 if(!decodeURIComponent(link).includes('1001250773'))throw Error('Wrong photo link');
 await page.getByRole('button',{name:'Fechar foto',exact:true}).click();
 await page.locator('#load-more').click();
 if(await page.locator('.gallery-item').count()!==28)throw Error('Load more');
 await page.getByRole('button',{name:'Casa & mesa',exact:true}).click();
 if(await page.locator('.gallery-item').count()!==6)throw Error('Filter');
 await page.locator('.gallery-item').first().click();
 if(!(await page.locator('#prev-photo').isDisabled()))throw Error('First boundary');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('#next-photo').click();
 await page.waitForFunction(()=>document.querySelector('#photo-position').textContent.startsWith('02'));
 await page.keyboard.press('Escape');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:1440,height:1000});
 await page.getByRole('button',{name:'Todas',exact:true}).click();
 await page.locator('#gallery').scrollIntoViewIfNeeded();
 await page.screenshot({path:'output/playwright/carousel-desktop.png'});
 return {passed:true,initial:16,loaded:28,touchPositionDuringDrag:during};
}
