import { initPortfolio } from './portfolio.js';

// EDIT HERE: identity, availability, motion and optional social destinations.
export const SETTINGS = {
  name: 'Shayan', city: 'Karachi', timezone: 'Asia/Karachi', email: 'faisalshayan444@gmail.com',
  heroWord: 'Portfolio', preloaderDuration: 2.2, smoothDuration: 1.2,
  socials: { Instagram: null, Behance: null, LinkedIn: null }
};
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelector('.hero h1').textContent = SETTINGS.heroWord;
const gsap = window.gsap;
const ST = window.ScrollTrigger;
if (gsap && ST) gsap.registerPlugin(ST, window.Flip);
let lenis;
if (window.Lenis && !reduced) {
  lenis = new window.Lenis({ duration: SETTINGS.smoothDuration, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), anchors: false });
  lenis.on('scroll', () => ST?.update());
  if (gsap) { gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
}
let locks = new Set();
function lock(reason, state) {
  if (state) locks.add(reason); else locks.delete(reason);
  document.body.classList.toggle('is-locked', locks.size > 0);
  if (locks.size) lenis?.stop(); else lenis?.start();
}
document.addEventListener('portfolio:lock', e => lock(e.detail.reason, e.detail.locked));

function animateHero() {
  const title = document.querySelector('.hero h1');
  if (!gsap || reduced) return;
  gsap.fromTo(title, { clipPath: 'inset(0 100% 0 -20%)', skewX: -8 }, { clipPath: 'inset(0 -20% 0 -20%)', skewX: 0, duration: 1.6, ease: 'power3.out' });
  gsap.from('.track-marker, .hero-side, .hero-top-note, .hero-edition', { opacity: 0, y: 10, duration: 1.1, stagger: .08, ease: 'power3.out', clearProps: 'opacity,transform' });
}
async function preloader() {
  let seen = false;
  try { seen = sessionStorage.getItem('shayan-intro') === 'seen'; } catch { /* Storage may be restricted by the browser. */ }
  if (reduced || seen || !gsap) { animateHero(); return; }
  document.body.classList.add('is-loading'); lock('intro', true);
  const counter = { value: 0 };
  await new Promise(resolve => {
    const tl = gsap.timeline({ onComplete: resolve });
    tl.to('.load-line i', { scaleX: 1, duration: SETTINGS.preloaderDuration - .65, ease: 'power2.inOut' }, 0)
      .to(counter, { value: 100, duration: SETTINGS.preloaderDuration - .65, roundProps: 'value', ease: 'power2.inOut', onUpdate: () => document.querySelector('.load-count').textContent = String(counter.value).padStart(2, '0') }, 0)
      .to('.load-line', { scaleX: 1.7, opacity: 0, duration: .3, ease: 'power2.inOut' }, '-=.1')
      .to('.preloader', { clipPath: 'inset(0 0 100% 0)', duration: .7, ease: 'power3.inOut' }, '-=.1');
  });
  document.body.classList.remove('is-loading'); lock('intro', false);
  try { sessionStorage.setItem('shayan-intro', 'seen'); } catch { /* Intro still completes without session storage. */ }
  animateHero();
}

// Accessible navigation: focus is contained in the full-screen overlay.
const menu = document.querySelector('#menu-overlay');
const menuButton = document.querySelector('.menu-toggle');
let menuTimer;
function setMenu(open) {
  clearTimeout(menuTimer);
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open); lock('menu', open);
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    menuTimer = setTimeout(() => menu.querySelector('nav a').focus(), reduced ? 0 : 100);
  } else {
    menu.classList.remove('is-open');
    menuTimer = setTimeout(() => { menu.hidden = true; }, reduced ? 0 : 700);
    menuButton.focus({ preventScroll: true });
  }
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', e => {
  if (menuButton.getAttribute('aria-expanded') !== 'true') return;
  if (e.key === 'Escape') setMenu(false);
  if (e.key === 'Tab') {
    const targets = [menuButton, ...menu.querySelectorAll('a')];
    const first = targets[0], last = targets.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', e => {
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  if (menu.contains(link)) setMenu(false);
  if (lenis) lenis.scrollTo(target, { offset: -35 }); else target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
  history.replaceState(null, '', link.getAttribute('href'));
  // Move keyboard focus with anchor navigation without changing visual layout.
  target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
}));

// Split explicit editorial lines without fragmenting words for screen readers.
document.querySelectorAll('.reveal-lines').forEach(heading => {
  const label = heading.innerHTML.replace(/<br\s*\/?\s*>/gi,' ').replace(/<[^>]*>/g,'').replace(/\s+/g, ' ').trim();
  heading.setAttribute('aria-label', label);
  const lines = heading.innerHTML.split(/<br\s*\/?\s*>/i);
  heading.innerHTML = lines.map(line => `<span class="line-mask" aria-hidden="true"><span class="line-inner">${line}</span></span>`).join('');
  if (gsap && ST && !reduced) gsap.from(heading.querySelectorAll('.line-inner'), { yPercent: 110, duration: 1.15, stagger: .08, ease: 'power4.out', scrollTrigger: { trigger: heading, start: 'top 88%', once: true } });
});

if (gsap && ST && !reduced) {
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
    .to('.vinyl-stage', { scale: 1.4, yPercent: -30, ease: 'none' }, 0)
    .to('.hero h1', { scaleX: 1.13, letterSpacing: '.01em', opacity: 0, yPercent: -30, ease: 'none' }, 0)
    .to('.hero-side, .hero-top-note, .hero-edition, .hero-bottom', { opacity: 0, ease: 'none' }, 0);
}
const themeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) document.body.dataset.theme = entry.target.id === 'work' ? 'dark' : 'light';
  });
}, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
document.querySelectorAll('.hero,.about,.work,.process,.contact').forEach(el => themeObserver.observe(el));
const processObserver = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('is-lit', e.isIntersecting)), { threshold: .55 });
document.querySelectorAll('.process-steps li').forEach(el => processObserver.observe(el));

// Marquee changes speed and direction with scroll velocity.
const marquee = document.querySelector('.marquee-track');
let offset = 0, lastY = scrollY, direction = 1, speed = .35, lastTime = 0;
function moveMarquee(t) {
  if (!reduced && !document.hidden) {
    const dt = Math.min((t - (lastTime || t)) / 16.67, 3);
    const delta = scrollY - lastY; lastY = scrollY;
    if (Math.abs(delta) > .2) direction = delta > 0 ? 1 : -1;
    speed += ((.35 + Math.min(Math.abs(delta) * .08, 3)) - speed) * .08;
    const width = marquee.scrollWidth / 2;
    offset = width ? (offset + speed * direction * dt + width) % width : 0;
    marquee.style.transform = `translateX(${-offset}px)`;
  }
  lastTime = t; requestAnimationFrame(moveMarquee);
}
if (!reduced) requestAnimationFrame(moveMarquee);

function initCursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || reduced) return;
  const dot = document.querySelector('.cursor-dot'), ring = document.querySelector('.cursor-ring');
  let x = -100, y = -100, rx = x, ry = y, visible = false;
  document.addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY; visible = true;
    dot.style.opacity = ring.style.opacity = '1'; dot.style.left = `${x}px`; dot.style.top = `${y}px`;
    const view = !!e.target.closest('.project-open');
    ring.classList.toggle('is-view', view); ring.classList.toggle('is-link', !view && !!e.target.closest('a,button'));
    ring.querySelector('span').textContent = view ? 'VIEW' : '';
  });
  document.addEventListener('pointerleave', () => { visible = false; dot.style.opacity = ring.style.opacity = '0'; });
  function tick() { if (visible) { rx += (x - rx) * .15; ry += (y - ry) * .15; ring.style.left = `${rx}px`; ring.style.top = `${ry}px`; } requestAnimationFrame(tick); } tick();
}
function initMagnetism() {
  if (!gsap || reduced || !matchMedia('(pointer:fine)').matches) return;
  document.querySelectorAll('.magnetic,.email-button,.menu-toggle,.view-toggle').forEach(button => {
    const xTo = gsap.quickTo(button, 'x', { duration: .55, ease: 'power3.out' });
    const yTo = gsap.quickTo(button, 'y', { duration: .55, ease: 'power3.out' });
    button.addEventListener('pointermove', e => { const r = button.getBoundingClientRect(); xTo(Math.max(-40, Math.min(40, (e.clientX - r.left - r.width / 2) * .15))); yTo(Math.max(-40, Math.min(40, (e.clientY - r.top - r.height / 2) * .2))); });
    button.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}
function updateClock() {
  const now = new Date();
  document.querySelector('#local-clock').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: SETTINGS.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now);
  document.querySelector('#local-clock').dateTime = now.toISOString();
  document.querySelector('.current-year').textContent = now.getFullYear();
  document.querySelector('.availability-date').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: SETTINGS.timezone, month: 'long', year: 'numeric' }).format(now);
}
const details = document.querySelector('.contact-details');
for (const [label, url] of Object.entries(SETTINGS.socials)) {
  if (!url || !/^https:\/\//.test(url)) continue;
  const link = document.createElement('a'); link.textContent = label; link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; details.append(link);
}
initPortfolio({ gsap, ST, reduced }); initCursor(); initMagnetism(); updateClock(); setInterval(updateClock, 1000);
preloader();
// Optional WebGL is loaded after the first paint; the SVG record is always available.
if (!reduced) import('./hero3d.js').then(m => m.initHero()).catch(() => document.documentElement.classList.add('webgl-unavailable'));
document.fonts.ready.then(() => ST?.refresh());
window.addEventListener('load', () => ST?.refresh());
