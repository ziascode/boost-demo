/* Shared behaviour for the short pages (about, contact): smooth scroll, heading and tape reveals,
   menu, header, mobile call bar and the footer wordmark. Page-specific motion lives inline on each page. */
(() => {
'use strict';
gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';
$$('.stars').forEach(s => s.innerHTML = STAR.repeat(5));

const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: !reduced });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);

function splitLines(el) {
  if (!el._html) el._html = el.innerHTML;
  el.innerHTML = el._html;
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  const words = [];
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const f = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(tok => { if (!tok) return; if (/^\s+$/.test(tok)) { f.appendChild(document.createTextNode(' ')); return; } const w = document.createElement('span'); w.textContent = tok; w.style.display = 'inline-block'; f.appendChild(w); words.push(w); });
      n.replaceWith(f);
    } else if (n.nodeType === 1) walk(n);
  });
  walk(el);
  const lines = []; let top = null;
  words.forEach(w => { const t = w.offsetTop; if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t; } lines[lines.length - 1].push(w); });
  el.innerHTML = lines.map(ws => `<span class="lm" aria-hidden="true"><span class="ln">${ws.map(w => w.parentElement !== el ? `<${w.parentElement.tagName.toLowerCase()}>${w.textContent}</${w.parentElement.tagName.toLowerCase()}>` : w.textContent).join(' ')}</span></span>`).join('');
  return $$('.ln', el);
}
function reveal(el, delay = 0) {
  const lines = splitLines(el);
  if (reduced) return;
  gsap.fromTo(lines, { yPercent: 105, filter: 'blur(10px)', opacity: 0 }, { yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: 1.2, stagger: .09, ease: 'expo.out', delay });
}
function layTape(el) { if (!reduced) gsap.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'power3.inOut' }); }

/* menu */
const menuBtn = $('#menuBtn');
function setMenu(open) {
  document.body.classList.toggle('is-menu', open); menuBtn.setAttribute('aria-expanded', open);
  open ? lenis.stop() : lenis.start();
  if (open && !reduced) gsap.fromTo('#menu li', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: .05, ease: 'expo.out', delay: .25 });
}
menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('is-menu')));
addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('is-menu')) { setMenu(false); menuBtn.focus(); } });

/* header hides on scroll down; mobile call bar after the first screen */
let last = 0;
lenis.on('scroll', ({ scroll, limit }) => {
  const dn = scroll > last && scroll > 200; last = scroll;
  $('#header').classList.toggle('is-hidden', dn && !document.body.classList.contains('is-menu'));
  const bar = $('#callbar'); if (bar) bar.classList.toggle('is-in', scroll > innerHeight * .6 && scroll < limit - innerHeight * .5);
});

/* footer wordmark leans toward the pointer */
const giant = $('#giant');
if (giant) {
  const gl = $$('span', giant), gy = gl.map(() => 0); let gx = null;
  giant.addEventListener('pointermove', e => gx = e.clientX); giant.addEventListener('pointerleave', () => gx = null);
  gsap.ticker.add(() => gl.forEach((l, i) => { let t = 0; if (gx !== null) { const r = l.getBoundingClientRect(); t = -Math.max(0, 1 - Math.abs(gx - (r.left + r.width / 2)) / 260) * 14; } gy[i] += (t - gy[i]) * .12; l.style.transform = `translateY(${gy[i]}%)`; }));
}

/* boot: reveal the hero title, set up below-the-fold reveals, then run page code */
const queue = []; let booted = false;
const ready = fn => booted ? fn() : queue.push(fn);
Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 2500))]).then(() => {
  const hero = $('#heroTitle');
  if (hero) reveal(hero, reduced ? 0 : .25);
  if (!reduced) gsap.from('.reveal-fade', { y: 14, opacity: 0, filter: 'blur(6px)', duration: 1.1, stagger: .08, ease: 'expo.out', delay: .55 });
  $$('[data-lines]').forEach(el => {
    if (el === hero) return;
    if (el.getBoundingClientRect().top > innerHeight && !reduced) gsap.set(splitLines(el), { yPercent: 105, opacity: 0 });
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => reveal(el) });
  });
  $$('.tape[data-tape]').forEach(el => {
    if (el.getBoundingClientRect().top > innerHeight && !reduced) gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => layTape(el) });
  });
  booted = true; queue.splice(0).forEach(fn => fn());
});
let rt, lastW = innerWidth;
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (innerWidth === lastW && innerWidth <= 760) return; lastW = innerWidth; const h = $('#heroTitle'); h && splitLines(h); ScrollTrigger.refresh(); }, 200); });

window.BP = { $, $$, reduced, lenis, reveal, splitLines, layTape, setMenu, ready };
})();
