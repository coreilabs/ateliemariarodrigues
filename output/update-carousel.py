from pathlib import Path
p=Path('app.js');s=p.read_text(encoding='utf-8')
s=s.replace("const img=document.createElement('img');img.src=p.src;", "const img=document.createElement('img');img.width=1000;img.height=1500;img.src=p.src;")
s=s.replace("currentIndex=index;showPhoto();lightbox.showModal();document.body.style.overflow='hidden'", "openPhoto(index)")
s=s.replace("function renderGallery(){const products=filtered();gallery.replaceChildren();products.slice(0,visible).forEach", "function renderGallery(append=false){const products=filtered();const start=append?gallery.children.length:0;if(!append){gallery.replaceChildren();gallery.scrollLeft=0}products.slice(start,visible).forEach")
s=s.replace("openPhoto(index)", "openPhoto(index+start)")
s=s.replace("visible+=12;renderGallery();gallery.children[previous]?.focus({preventScroll:true})", "visible+=12;renderGallery(true);gallery.children[previous]?.focus({preventScroll:true});if(matchMedia('(max-width:700px)').matches)gallery.children[previous]?.scrollIntoView({behavior:motion(),block:'nearest',inline:'start'})")
s=s.replace("const img=document.querySelector('#detail-image');img.src=p.src;img.alt=p.title;", "document.querySelector('#prev-photo').disabled=currentIndex===0;document.querySelector('#next-photo').disabled=currentIndex===products.length-1;photoTrack.querySelectorAll('.photo-slide').forEach((slide,index)=>slide.setAttribute('aria-hidden',String(index!==currentIndex)));")
start=s.index('function movePhoto(');end=s.index("document.querySelectorAll('dialog')",start)
s=s[:start]+'''const photoTrack=document.querySelector('#photo-track');
const motion=()=>matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth';
function openPhoto(index){
  currentIndex=index;
  photoTrack.replaceChildren(...filtered().map((p,i)=>{
    const slide=document.createElement('div');slide.className='photo-slide';
    slide.setAttribute('role','group');slide.setAttribute('aria-label',`${i+1} de ${filtered().length}: ${p.title}`);
    const img=document.createElement('img');img.src=p.src;img.alt=p.title;img.width=1000;img.height=1500;img.draggable=false;img.loading=Math.abs(i-index)<=1?'eager':'lazy';
    slide.append(img);return slide;
  }));
  lightbox.showModal();document.body.style.overflow='hidden';
  photoTrack.scrollTo({left:currentIndex*photoTrack.clientWidth,behavior:'instant'});showPhoto();
}
function movePhoto(direction){const next=Math.max(0,Math.min(filtered().length-1,currentIndex+direction));photoTrack.scrollTo({left:next*photoTrack.clientWidth,behavior:motion()})}
document.querySelector('#prev-photo').addEventListener('click',()=>movePhoto(-1));
document.querySelector('#next-photo').addEventListener('click',()=>movePhoto(1));
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();movePhoto(-1)}if(e.key==='ArrowRight'){e.preventDefault();movePhoto(1)}});
let scrollFrame=0;
photoTrack.addEventListener('scroll',()=>{if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;const index=Math.max(0,Math.min(filtered().length-1,Math.round(photoTrack.scrollLeft/photoTrack.clientWidth)));if(index!==currentIndex){currentIndex=index;showPhoto()}})},{passive:true});
new ResizeObserver(()=>{if(lightbox.open)photoTrack.scrollTo({left:currentIndex*photoTrack.clientWidth,behavior:'instant'})}).observe(photoTrack);
''' + s[end:]
p.write_text(s,encoding='utf-8')
p=Path('index.html');s=p.read_text(encoding='utf-8').replace('<img id="detail-image" src="assets/fotos/1001250772.webp" alt="">','<div id="photo-track" class="photo-track" role="region" aria-label="Fotos das criações" aria-roledescription="carrossel" tabindex="0"></div>')
s=s.replace('<div id="gallery" class="gallery"></div>', '<p class="gallery-swipe-hint">Deslize para explorar as criações <span aria-hidden="true">⟷</span></p><div id="gallery" class="gallery" role="region" aria-label="Galeria de criações"></div>')
s=s.replace('id="photo-position" class="eyebrow"','id="photo-position" class="eyebrow" aria-live="polite" aria-atomic="true"')
p.write_text(s,encoding='utf-8')
p=Path('sw.js');s=p.read_text(encoding='utf-8').replace('atelie-maria-v6','atelie-maria-v7');p.write_text(s,encoding='utf-8')
