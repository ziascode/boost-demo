/* Demo-only sales banner (not part of the client's site). Remove this file and its <script> tags at go-live.
   Shows after 15 seconds on the site (counted across pages in this tab), can be dismissed,
   and appears immediately with ?demo=now for presenting. */
(() => {
  const DELAY = 15000, KEY_START = 'demoStart', KEY_SHUT = 'demoClosed';
  const store = {
    get: k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} },
  };
  const now = Date.now();
  if (!store.get(KEY_START)) store.set(KEY_START, String(now));
  const force = new URLSearchParams(location.search).get('demo') === 'now';
  if (store.get(KEY_SHUT) && !force) return;
  const start = Number(store.get(KEY_START)) || now;
  const wait = force ? 600 : Math.max(0, DELAY - (now - start));

  const el = document.createElement('aside');
  el.className = 'demo';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'About this demo: AI search');
  el.innerHTML = `
    <div class="demo__in">
      <span class="demo__tag">Demo · AI search</span>
      <div class="demo__copy">
        <p class="demo__title">Be the business AI recommends.</p>
        <p class="demo__text">More customers now ask Google’s AI, ChatGPT and Perplexity “who’s the best painter near me?” and act on the answer. When this site goes live, we build it so AI can read, trust and recommend your business over competitors.</p>
      </div>
      <div class="demo__ctas">
        <a class="demo__call" href="tel:+12262011834"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg><span>Call 226-201-1834 to go live</span></a>
      </div>
      <button class="demo__close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    </div>`;

  const open = () => {
    document.body.appendChild(el);
    document.body.classList.add('has-demo');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
  };
  const close = () => {
    store.set(KEY_SHUT, '1');
    el.classList.remove('is-in');
    document.body.classList.remove('has-demo');
    setTimeout(() => el.remove(), 700);
  };
  el.querySelector('.demo__close').addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape' && el.isConnected) close(); });
  setTimeout(open, wait);
})();
