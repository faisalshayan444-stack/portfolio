import { imageSizes } from './image-sizes.js';
// EDIT HERE: all project content and image paths. These are self-initiated concepts,
// not commissioned client work or verified campaign results.
export const projects = [
  { id: 'fragrance-editions', title: 'Sévra & Aurelle', category: 'Perfume', discipline: 'Fragrance campaigns · Editorial design', year: '2026', ratio: '1/1', cover: 'sevra-silk', gallery: ['aurelle-light'], captions: { 'aurelle-light': 'Aurelle / Fresh Oud — light, glass, and an ivory palette.' }, brief: 'Two self-initiated fragrance campaigns with distinct identities. Sévra uses black silk and champagne gold; Aurelle pairs cream stone with sunlight through frosted glass. Both explore product photography, expressive typography, and a restrained advertising layout.', tools: 'AI-assisted product photography, fictional brand naming, campaign typography, and layout direction.' },
  { id: 'orvane', title: 'ORVANE / After Dusk', category: 'Perfume', discipline: 'Product identity · E-commerce · Packaging', year: '2026', ratio: '1/1', cover: 'orvane-gift', gallery: ['orvane-master','orvane-contents','orvane-ribbon'], captions: { 'orvane-master': 'Product master / Transparent background and blank label before branding.', 'orvane-contents': 'Packaging study / Ivory carton, 50 ml bottle, sample vial, and care card.', 'orvane-ribbon': 'Material detail / Grosgrain ribbon and textured presentation packaging.' }, brief: 'A self-initiated identity and e-commerce concept for a fictional fragrance brand. Dark glass, brushed gold, ivory paper, a handwritten fragrance name, and a single iris create the visual world of After Dusk. The selected images show the campaign, the product master, packaging contents, and material detail.', tools: 'AI-assisted product and packaging photography, reference-led art direction, brand naming, and editorial composition.' },
  { id: 'oud-noir', title: 'Oud Noir', category: 'Perfume', discipline: 'Art direction · Campaign imagery', year: '2026', ratio: '4/5', cover: 'oud-leaves', gallery: ['oud-crown','oud-heritage','oud-packaging'], brief: 'A fragrance world built from amber light, tactile tobacco leaves and quiet black glass. A study in making a product feel considered before a single word is read.', tools: 'Art direction, AI-assisted image creation, image refinement and campaign composition.' },
  { id: 'noor-atelier', title: 'Noor Atelier', category: 'Fashion', discipline: 'Fashion · Social campaign', year: '2026', ratio: '1/1', cover: 'noor-editorial', gallery: ['noor-eid','noor-outdoor','noor-classic'], brief: 'An editorial campaign concept for a contemporary abaya label. Rich black, delicate gold embroidery and sunlit cream create a visual language that moves from collection launch to seasonal promotion.', tools: 'Campaign art direction, AI-assisted imagery, typographic hierarchy and social format adaptation.' },
  { id: 'rise-above', title: 'Rise Above', category: 'Sneakers', discipline: 'Product storytelling · Ad creative', year: '2026', ratio: '4/5', cover: 'sneaker-type', gallery: ['sneaker-clean','sneaker-detail','sneaker-type'], brief: 'A weightless product campaign that turns a simple sneaker into the hero. A clean sky, vivid laces and confident type bring a fresh perspective to everyday style.', tools: 'Creative concept, AI-assisted product photography, copywriting and advertising layout.' },
  { id: 'creator-edition', title: 'The Creator Edition', category: 'Social', discipline: 'Creator templates · Social systems', year: '2026', ratio: '4/3', cover: 'creator-duo', gallery: ['creator-noor','creator-oud','creator-duo'], brief: 'A paired template system for creator collaborations. Generous image space, a clear code area and two restrained palettes give each partnership a consistent visual home.', tools: 'Template design, brand adaptation, spacing systems and Story-format composition.' },
  { id: 'studio-notes', title: 'Studio Notes', category: 'Social', discipline: 'Visual identity · Brand guidelines', year: '2026', ratio: '4/3', cover: 'brand-notes', gallery: ['brand-notes','brand-type','brand-palette'], brief: 'A personal identity study in rhythm, restraint and repeat play. Rose, warm paper and confident type form a compact visual system for an independent creative practice.', tools: 'Identity design, typography selection, palette development and SVG artwork.' },
  { id: 'fresh-expression', title: 'A Fresh Expression', category: 'Perfume', discipline: 'E-commerce · Web campaign', year: '2026', ratio: '4/5', cover: 'oud-tropical', gallery: ['oud-banner','oud-fresh-type','oud-sky'], brief: 'A brighter chapter for Oud Noir, built around frosted glass and a vivid orange accent. A responsive visual direction spanning product imagery, social advertising and a wide web hero.', tools: 'Art direction, AI-assisted photography, headline development and format adaptation.' },
  { id: 'campaign-review', title: 'The Campaign Review', category: 'Decks', discipline: 'Presentation design · Information design', year: '2026', ratio: '16/9', cover: 'campaign-deck', gallery: ['deck-cover','campaign-deck','deck-detail'], brief: 'A minimal presentation direction with an editorial typographic hierarchy. The supplied sample metrics are demonstration content, presented with clear labels and a restrained chart.', tools: 'Presentation layout, data hierarchy, chart design and typographic styling.' },
  { id: 'noir-objects', title: 'Noir Objects', category: 'Perfume', discipline: 'Packaging · Product identity', year: '2026', ratio: '4/5', cover: 'oud-packaging', gallery: ['oud-packaging','packaging-detail','oud-heritage'], brief: 'A packaging concept translating the Oud Noir atmosphere into physical objects. Charcoal paper, warm foil and an ivory presentation box turn opening the fragrance into a considered ritual.', tools: 'Packaging art direction, AI-assisted mockup imagery and material exploration.' }
];
// Resolve relative to this module so case studies also work under deployed subpaths.
const root = new URL('../assets/work/', import.meta.url).href;
const dimensions = name => { const [w,h] = imageSizes[name] || [1200,1500]; return `width="${w}" height="${h}"`; };
const escape = s => s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
export function initPortfolio({ gsap, ST, reduced }) {
  document.querySelector('#work-title sup').textContent = `(${String(projects.length).padStart(2,'0')})`;
  const grid = document.querySelector('#project-grid');
  const dialog = document.querySelector('#case-dialog');
  const content = dialog.querySelector('.case-content');
  let filter = 'All', view = 'grid', opener = null, current = null, transition = null;
  const cards = projects.map((p, i) => {
    const card = document.createElement('article'); card.className = 'project-card'; card.style.setProperty('--ratio', p.ratio); card.dataset.category = p.category;
    card.innerHTML = `<button class="project-open" aria-label="View ${escape(p.title)} — ${escape(p.discipline)}"><div class="project-art"><img src="${root+p.cover}.webp" alt="${escape(p.title)}: ${escape(p.discipline.toLowerCase())}" ${dimensions(p.cover)} loading="lazy" decoding="async"><span class="project-reveal"><span>${escape(p.title)} / ${escape(p.category)}</span><span>View project ↗</span></span></div></button><div class="project-meta"><div><h3>${escape(p.title)}</h3><p>${escape(p.discipline)}</p></div><span>0${i+1} / ${p.year}</span></div>`;
    card.querySelector('button').addEventListener('click', e => openCase(p, e.currentTarget)); grid.append(card); return card;
  });
  const revealObserver = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    if (gsap && !reduced) {
      const art = e.target.querySelector('.project-art');
      gsap.fromTo(art, { clipPath: 'inset(12% 0 0 0)', opacity: .5 }, { clipPath: 'inset(0)', opacity: 1, duration: 1.1, ease: 'power3.out', clearProps: 'clipPath,opacity' });
    }
    revealObserver.unobserve(e.target);
  }), { threshold: .1 }); cards.forEach(c => revealObserver.observe(c));
  // Native horizontal scrolling keeps the document flow stable when switching views.
  const galleryNav = document.createElement('div'); galleryNav.className = 'gallery-navigation'; galleryNav.hidden = true;
  galleryNav.innerHTML = '<span class="label">Scroll sideways to explore</span><div><button type="button" aria-label="Previous projects">←</button><button type="button" aria-label="Next projects">→</button></div>';
  grid.before(galleryNav);
  const previous = galleryNav.querySelector('[aria-label="Previous projects"]');
  const next = galleryNav.querySelector('[aria-label="Next projects"]');
  function updateArrows() {
    previous.disabled = grid.scrollLeft <= 2;
    next.disabled = grid.scrollLeft >= grid.scrollWidth-grid.clientWidth-2;
  }
  function refreshGallery(anchorTop) {
    galleryNav.hidden = view !== 'gallery';
    grid.tabIndex = view === 'gallery' ? 0 : -1;
    grid.setAttribute('aria-label', view === 'gallery' ? 'Selected projects, horizontal gallery' : 'Selected projects');
    requestAnimationFrame(() => {
      updateArrows(); document.dispatchEvent(new Event('portfolio:layout')); ST?.refresh();
      if (typeof anchorTop === 'number') {
        const delta = document.querySelector('.work-toolbar').getBoundingClientRect().top-anchorTop;
        if (Math.abs(delta) > .5) document.dispatchEvent(new CustomEvent('portfolio:scroll-adjust', { detail: { delta } }));
      }
    });
  }
  function moveGallery(direction) {
    const first = cards.find(card => !card.hidden);
    if (first) grid.scrollBy({ left: direction*(first.getBoundingClientRect().width+24), behavior: reduced ? 'instant' : 'smooth' });
  }
  previous.addEventListener('click', () => moveGallery(-1)); next.addEventListener('click', () => moveGallery(1));
  grid.addEventListener('scroll', updateArrows, { passive: true });
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    const anchorTop = document.querySelector('.work-toolbar').getBoundingClientRect().top;
    gsap?.killTweensOf(cards);
    filter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach(b => { const on = b === button; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    cards.forEach(c => c.hidden = filter !== 'All' && c.dataset.category !== filter);
    grid.classList.toggle('is-filtered', filter !== 'All');
    grid.scrollLeft = 0;
    const count = cards.filter(c => !c.hidden).length;
    document.querySelector('.work-count').textContent = `${String(count).padStart(2,'0')} ${count===1?'project':'projects'}`;
    if (gsap && !reduced) gsap.fromTo(cards.filter(c=>!c.hidden), { opacity: .5 }, { opacity: 1, duration: .3, clearProps: 'opacity' });
    refreshGallery(anchorTop);
  }));
  document.querySelectorAll('.view-toggle').forEach(button => button.addEventListener('click', () => {
    if (view === button.dataset.view) return;
    const anchorTop = document.querySelector('.work-toolbar').getBoundingClientRect().top;
    gsap?.killTweensOf(cards);
    gsap?.set(cards, { clearProps: 'transform,opacity' });
    view = button.dataset.view;
    document.querySelectorAll('.view-toggle').forEach(b => { b.classList.toggle('is-active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    grid.classList.toggle('gallery-mode', view === 'gallery'); grid.scrollLeft = 0; refreshGallery(anchorTop);
  }));
  let resizeTimer; window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(refreshGallery, 250); });
  function renderCase(p) {
    document.querySelector('#case-index').textContent = `${String(projects.indexOf(p)+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;
    content.innerHTML = `<div class="case-title-row"><h2 id="case-title">${escape(p.title)}</h2><span class="case-category label">${escape(p.discipline)}<br>Independent concept · ${p.year}</span></div><img class="case-hero" src="${root+p.cover}.webp" ${dimensions(p.cover)} alt="${escape(p.title)} campaign hero"><div class="case-brief"><p>${escape(p.brief)}</p><div class="case-note"><span class="label">Tools & process</span>${escape(p.tools)}</div></div><div class="case-gallery">${p.gallery.map((name,i)=>`<figure><img src="${root+name}.webp" alt="${escape(p.title)} — detail ${i+1}" ${dimensions(name)} loading="eager" decoding="async" data-speed="${.03+i*.01}">${p.captions?.[name] ? `<figcaption>${escape(p.captions[name])}</figcaption>` : ''}</figure>`).join('')}</div><div class="case-process"><span class="label">Revision process</span><p>Brief → Concepts → Feedback round → Final files<br>A clear sequence from the first direction to the finished work.</p></div><button class="case-next"><span><small>Next project</small>${escape(projects[(projects.indexOf(p)+1)%projects.length].title)}</span><span aria-hidden="true">↗</span></button>`;
    content.querySelector('.case-next').addEventListener('click', () => { current = projects[(projects.indexOf(current)+1)%projects.length]; renderCase(current); dialog.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' }); });
  }
  async function openCase(p, source) {
    if (transition) return;
    current = p; opener = source; renderCase(p);
    const origin = source.querySelector('img'); const start = origin.getBoundingClientRect();
    document.dispatchEvent(new CustomEvent('portfolio:lock', { detail: { reason: 'case', locked: true } }));
    dialog.showModal(); dialog.scrollTop = 0;
    if (!reduced && gsap) {
      const hero = content.querySelector('.case-hero'); hero.style.opacity = '0';
      const clone = origin.cloneNode(); clone.removeAttribute('loading'); clone.className = 'transition-clone';
      Object.assign(clone.style, { left:`${start.left}px`, top:`${start.top}px`, width:`${start.width}px`, height:`${start.height}px` });
      dialog.append(clone); const end = hero.getBoundingClientRect();
      transition = gsap.to(clone, { left:end.left, top:end.top, width:end.width, height:end.height, duration:.7, ease:'power3.inOut', onComplete:()=>{ clone.remove(); hero.style.opacity=''; transition=null; } });
    }
    dialog.querySelector('.case-close').focus({ preventScroll: true });
  }
  function closeCase() {
    transition?.kill(); transition = null; document.querySelectorAll('.transition-clone').forEach(el => el.remove());
    dialog.close(); document.dispatchEvent(new CustomEvent('portfolio:lock', { detail: { reason: 'case', locked: false } }));
    opener?.focus({ preventScroll: true });
  }
  dialog.querySelector('.case-close').addEventListener('click', closeCase);
  dialog.addEventListener('cancel', e => { e.preventDefault(); closeCase(); });
  dialog.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button,a[href]')].filter(el => !el.disabled);
    const first = focusable[0], last = focusable.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  let ticking = false;
  dialog.addEventListener('scroll', () => {
    if (reduced || ticking) return; ticking = true;
    requestAnimationFrame(() => { content.querySelectorAll('[data-speed]').forEach(img => { const r = img.parentElement.getBoundingClientRect(); const shift = Math.max(-12, Math.min(12, (innerHeight/2-r.top-r.height/2)*Number(img.dataset.speed))); img.style.transform=`translateY(${shift}px) scale(1.035)`; }); ticking=false; });
  }, { passive: true });
}
