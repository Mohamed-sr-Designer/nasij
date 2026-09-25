/* =========================================================================
   NASIJ storefront — hash-routed SPA on top of NZ core.
   Every text, product, image, section and setting comes from the CMS content.
   ========================================================================= */
(function () {
  'use strict';
  const N = window.NZ;
  const { $, $$, esc, t, L, LL, money } = N;
  const C = () => N.C;

  /* ─────────────────────────── icons ─────────────────────────── */
  const IC = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    bag: '<path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>',
    menu: '<path d="M4 8h16M4 16h10"/>', close: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', arrowUR: '<path d="M7 17 17 7M9 7h8v8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>', check: '<path d="m5 12 4.5 4.5L19 7"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    home: '<path d="M4 11 12 4l8 7v9H4z"/><path d="M10 20v-5h4v5"/>', grid: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
    star: '<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h2M12 14h2M16 14h.5M8 17.5h2M12 17.5h2"/>',
    link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/>',
    panel: '<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M9 4v16M13 9h4M13 13h4"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    gift: '<rect x="3.5" y="8" width="17" height="4"/><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 3.5 8 4.5 9 8 12 8zM12 8s1.5-4.5 4-3.5S15 8 12 8z"/>',
    wa: '<path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z"/><path d="M9 9.5c.3 2.4 2.2 4.4 4.6 4.9l1.2-1.2 2 .9-.4 1.6c-3.8.3-8.4-3.9-8.1-7.8l1.6-.4.9 2z"/>',
    ig: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r=".6"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="1"/><path d="m4 7 8 6 8-6"/>',
    chev: '<path d="m6 9 6 6 6-6"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', orbit: '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-25 12 12)"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'
  };
  const icon = (n, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;
  const arr = () => icon('arrow', 'arr');
  const glyph = g => g + '︎';

  /* ─────────────────────────── helpers ─────────────────────────── */
  const pad = n => String(n).padStart(2, '0');
  const S = () => C().settings;
  const toneFix = (s) => s;
  let route = { path: '/', parts: [], q: {} };
  const onceTimers = [];
  const logo = () => `<a class="logo" href="#/" aria-label="${esc(L(S(), 'name'))}">
      <img class="logo-l" src="${esc(N.abs((C().theme || {}).logo || 'images/logo-en.png'))}" alt="${esc(L(S(), 'name'))}" width="120" height="26">
      <img class="logo-d" src="${esc(N.abs((C().theme || {}).logoLight || 'images/logo-en-white.png'))}" alt="" width="120" height="26" aria-hidden="true"></a>`;

  function copyText(txt) {
    try { if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt); } catch (e) { }
    const ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { } ta.remove();
  }
  function toast(msg, opts) {
    opts = opts || {};
    const box = $('#toasts'); if (!box) return;
    const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status');
    el.innerHTML = `<span class="dot"></span><span>${esc(msg)}</span>${opts.action ? `<a href="${opts.href || '#'}">${esc(opts.action)}</a>` : ''}`;
    box.appendChild(el);
    if (opts.onAction) el.querySelector('a').addEventListener('click', e => { e.preventDefault(); opts.onAction(); el.remove(); });
    setTimeout(() => { el.style.transition = 'opacity .4s, transform .4s'; el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; setTimeout(() => el.remove(), 400); }, opts.ms || 2800);
  }

  /* countdown markup; values are refreshed by the global ticker */
  function cdHTML(to, cls) {
    const c = N.countdown(to);
    return `<div class="cd ${cls || ''}" data-cd="${to}">${[['d', c.d, 'c.days'], ['h', c.h, 'c.hrs'], ['m', c.m, 'c.min'], ['s', c.s, 'c.sec']].map(([u, v, k]) =>
      `<div class="cd__c"><b class="cd__n" data-u="${u}">${pad(v)}</b><span class="cd__l mono">${t(k)}</span></div>`).join('')}</div>`;
  }
  function tcdHTML(to) {
    const c = N.countdown(to);
    return `<div class="tcd" data-cd="${to}">${[['d', c.d, 'c.days'], ['h', c.h, 'c.hrs'], ['m', c.m, 'c.min'], ['s', c.s, 'c.sec']].map(([u, v, k]) =>
      `<div class="tcd__c"><b class="tcd__n" data-u="${u}">${pad(v)}</b><span class="tcd__l">${t(k)}</span></div>`).join('')}</div>`;
  }
  function tick() {
    $$('[data-cd]').forEach(el => {
      const c = N.countdown(+el.dataset.cd);
      ['d', 'h', 'm', 's'].forEach(u => { const n = el.querySelector(`[data-u="${u}"]`); if (n) { const v = pad(c[u]); if (n.textContent !== v) n.textContent = v; } });
    });
  }
  function meterHTML() {
    const d = N.drop(), n = N.reservedCount(), goal = +d.goal || 100, p = Math.min(100, Math.round(n / goal * 100));
    return `<div class="cd-head"><span class="mono">${t('d.reserved', { n, goal })}</span><span class="mono">${p}%</span></div><div class="meter" style="--p:${Math.max(2, p)}%"><i></i></div>`;
  }

  /* ─────────────────────────── product card ─────────────────────────── */
  function priceHTML(p) {
    if (N.isPre(p)) return `${money(p.price)}<small>${t('d.deposit', { pct: N.drop().depositPct })} ${money(N.deposit(p.price))}</small>`;
    return `${p.compareAt && +p.compareAt > +p.price ? `<s>${money(p.compareAt, false)}</s>` : ''}${money(p.price)}`;
  }
  function tagsHTML(p, v) {
    const out = [];
    if (N.isPre(p)) out.push(`<span class="tag tag--signal">${t('c.preorder')}</span>`);
    else if (N.soldOut(p, v)) out.push(`<span class="tag tag--out">${t('c.soldOut')}</span>`);
    if ((p.badges || []).indexOf('new') > -1 && !N.isPre(p)) out.push(`<span class="tag">${t('c.new')}</span>`);
    if (p.compareAt && +p.compareAt > +p.price) out.push(`<span class="tag tag--line">−${Math.round((1 - p.price / p.compareAt) * 100)}%</span>`);
    return out.join('');
  }
  function card(p, opts) {
    opts = opts || {};
    const v = opts.variant || N.variant(p, opts.color);
    const pre = N.isPre(p), a = v.images[0], b = v.images[1];
    const href = `#/products/${p.handle}?c=${encodeURIComponent(v.color)}`;
    const sg = p.sign ? N.sign(p.sign) : null;
    const multi = !opts.split && p.variants.length > 1;
    const title = N.title(p) + (opts.split && p.variants.length > 1 ? ` — ${N.colourName(v)}` : '');
    return `<article class="pc rv" style="--d:${((opts.i || 0) % 4) * 0.06}s" data-pid="${esc(p.id)}" data-vid="${esc(v.id)}">
      <div class="pc__media">
        <a class="pc__cover" href="${href}" aria-label="${esc(title)}"></a>
        <img src="${esc(a)}" alt="${esc(title)}" loading="lazy" decoding="async" width="900" height="1200">
        ${b ? `<img class="alt" src="${esc(b)}" alt="" loading="lazy" decoding="async" aria-hidden="true" width="900" height="1200">` : ''}
        <div class="pc__tags">${tagsHTML(p, v)}</div>
        <button class="icon-btn pc__fav${N.wish.has(p.id) ? ' on' : ''}" data-fav="${esc(p.id)}" aria-label="${t('p.save')}">${icon('heart')}</button>
        ${sg ? `<span class="pc__idx mono">${glyph(sg.glyph)} ${pad((N.C.signs || []).indexOf(sg) + 1)}/12</span>` : ''}
        ${!N.soldOut(p, v) ? `<div class="pc__quick"><b>${pre ? t('c.preorder') : t('c.size')}</b>${(p.sizes || []).map(s => `<button data-quick="${esc(p.id)}|${esc(v.id)}|${esc(s)}"${!pre && N.stockOf(v, s) <= 0 ? ' disabled' : ''}>${esc(s)}</button>`).join('')}</div>` : ''}
      </div>
      <div class="pc__info">
        <a href="${href}" class="pc__t">${esc(title)}</a>
        ${L(p, 'sub') ? `<div class="pc__s">${esc(L(p, 'sub'))}</div>` : ''}
        <div class="pc__meta"><div class="pc__p num">${priceHTML(p)}</div>
        ${multi ? `<div class="swatches" role="radiogroup">${p.variants.map(x => `<button class="sw sw--sm${x.id === v.id ? ' on' : ''}" style="--c:${esc(x.hex)}" data-sw="${esc(x.id)}" aria-label="${esc(N.colourName(x))}" title="${esc(N.colourName(x))}"></button>`).join('')}</div>` : ''}</div>
      </div>
    </article>`;
  }
  /* products → card list, expanding split-colour collections into one card per colour */
  function cards(list, opts) {
    opts = opts || {};
    const out = [];
    list.forEach(p => {
      const col = N.collection(p.collection);
      if ((col && col.split) || opts.split) p.variants.forEach(v => out.push({ p, v, split: true }));
      else out.push({ p, v: N.variant(p, opts.color) });
    });
    return (opts.limit ? out.slice(0, opts.limit) : out).map((x, i) => card(x.p, { variant: x.v, split: x.split, i }));
  }
  function sortList(list, how) {
    const a = list.slice();
    if (how === 'low') a.sort((x, y) => x.price - y.price);
    else if (how === 'high') a.sort((x, y) => y.price - x.price);
    else if (how === 'best') a.sort((x, y) => (y.sales || 0) - (x.sales || 0));
    return a;
  }

  /* ─────────────────────────── shell ─────────────────────────── */
  function applyTheme() {
    const th = C().theme || {}, r = document.documentElement.style;
    const stops = th.gradient === false ? [] : [th.g1, th.g2, th.g3].filter(Boolean);
    const solid = th.accent || stops[0] || '#C4B5FD', g = stops.length ? stops : [solid];
    r.setProperty('--signal', solid);
    r.setProperty('--g1', g[0]); r.setProperty('--g2', g[1] || g[0]); r.setProperty('--g3', g[2] || g[1] || g[0]);
    r.setProperty('--grad', g.length > 1 ? 'linear-gradient(' + (+th.angle || 105) + 'deg, ' + g.join(', ') + ')' : solid);
    if (th.night) r.setProperty('--night', th.night);
    if (th.paper) r.setProperty('--paper', th.paper);
    if (th.radius != null) r.setProperty('--r', th.radius + 'px');
    document.documentElement.dataset.grain = th.grain === false ? '0' : '1';
    // readable ink on the accent: judged by the darkest stop
    const lum = h => { const x = String(h || '#000000').replace('#', ''); const c = [0, 2, 4].map(i => parseInt(x.substr(i, 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4)); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
    const ink = Math.min.apply(null, g.map(lum)) > .3 ? '#0B0B0D' : '#FFFFFF';
    r.setProperty('--signal-ink', ink);
    try { localStorage.setItem('nz_theme_cache', JSON.stringify({ g1: g[0], g2: g[1] || g[0], g3: g[2] || g[1] || g[0], grad: r.getPropertyValue('--grad'), night: th.night || '' })); } catch (e) { }
  }
  function applyLang() {
    const h = document.documentElement;
    h.lang = N.lang; h.dir = N.isAr() ? 'rtl' : 'ltr';
  }
  const mode = () => N.read(N.LS.mode, null) || S().defaultMode || 'light';
  function applyMode() { document.documentElement.dataset.mode = mode(); const m = $('meta[name="theme-color"]'); if (m) m.content = mode() === 'dark' ? '#08080B' : '#F3F0EA'; }

  function shell() {
    const s = S(), nav = C().nav || {};
    const ann = (s.announcement || []).map(a => `<span class="ann__i">${esc(LL(a))}</span>`).join('');
    const live = N.dropOpen();
    $('#app').innerHTML = `
      ${ann ? `<div class="ann" role="region" aria-label="announcements"><div class="ann__track">${ann}${ann}${ann}${ann}</div></div>` : ''}
      <header class="hdr" id="hdr">
        <div class="wrap hdr__in">
          <div style="display:flex;align-items:center;gap:6px">
            <button class="icon-btn hdr__menu" data-open="menu" aria-label="${t('nav.menu')}">${icon('menu')}</button>
            <nav class="hdr__nav" aria-label="primary">${(nav.header || []).map(l => `<a class="link${l.to === '#/drops' && live ? ' is-live' : ''}" href="${esc(l.to)}">${esc(LL(l))}</a>`).join('')}</nav>
          </div>
          ${logo()}
          <div class="hdr__act">
            <button class="lang-pill hide-m" data-lang aria-label="language">${N.isAr() ? 'EN' : 'ع'}</button>
            <button class="icon-btn hide-m" data-mode aria-label="${t('nav.theme')}">${icon(mode() === 'dark' ? 'sun' : 'moon')}</button>
            <button class="icon-btn" data-open="search" aria-label="${t('nav.search')}">${icon('search')}</button>
            <a class="icon-btn hide-m" href="#/saved" aria-label="${t('nav.saved')}">${icon('heart')}<span class="badge-dot" data-count="wish"></span></a>
            <button class="icon-btn" data-open="bag" aria-label="${t('nav.bag')}">${icon('bag')}<span class="badge-dot" data-count="bag"></span></button>
          </div>
        </div>
      </header>
      <main id="main" tabindex="-1"></main>
      <footer class="ftr stars grain" id="ftr"></footer>
      <nav class="tabbar" aria-label="app">
        <a href="#/" data-tab="/">${icon('home')}<span>${t('nav.home')}</span></a>
        <a href="#/shop" data-tab="/shop">${icon('grid')}<span>${t('nav.shop')}</span></a>
        <a href="#/drops" data-tab="/drops">${icon('orbit')}<span>${t('nav.drops')}</span></a>
        <a href="#" data-open="bag" data-tab="/bag">${icon('bag')}<span>${t('nav.bag')}</span><span class="badge-dot" data-count="bag"></span></a>
        <a href="#/saved" data-tab="/saved">${icon('heart')}<span>${t('nav.saved')}</span><span class="badge-dot" data-count="wish"></span></a>
      </nav>
      <div class="scrim" id="scrim"></div>
      <aside class="drawer drawer--start" id="d-menu" aria-label="${t('nav.menu')}" aria-hidden="true"></aside>
      <aside class="drawer drawer--end" id="d-bag" aria-label="${t('b.title')}" aria-hidden="true"></aside>
      <aside class="drawer drawer--end" id="d-search" aria-label="${t('nav.search')}" aria-hidden="true"></aside>
      <div class="modal" id="modal" aria-hidden="true"><div class="modal__bg" data-close-modal></div><div class="modal__card" role="dialog" aria-modal="true"></div></div>
      <button class="gift-fab" id="giftFab" aria-label="gift">${icon('gift')}<small>−10%</small></button>
      <div class="toasts" id="toasts" aria-live="polite"></div>
      ${N.previewing() ? `<div class="preview-bar">${t('m.preview')} <button data-exit-preview>${t('m.exitPreview')}</button></div>` : ''}`;
    footer(); menu(); counts();
  }

  function footer() {
    const s = S(), nav = C().nav || {};
    const pays = Object.values(s.payments || {}).filter(p => p && p.on).map(p => `<span class="pay-chip">${esc(LL(p))}</span>`).join('');
    const cols = C().collections.filter(c => c.status === 'active');
    $('#ftr').innerHTML = `<div class="wrap">
        <div class="ftr__grid">
          <div>
            <div class="logo" style="height:30px"><img src="${esc(N.abs((C().theme || {}).logoLight || 'images/logo-en-white.png'))}" alt="${esc(L(s, 'name'))}" style="height:30px;width:auto"></div>
            <p class="muted" style="max-width:36ch;margin:16px 0 0">${esc(L(s, 'tagline'))}</p>
            <div class="pay-row" style="margin-top:18px">${pays}</div>
          </div>
          <div><h4 class="mono">${t('nav.shop')}</h4><ul>${cols.map(c => `<li><a href="#/collections/${esc(c.handle)}">${esc(L(c, 'short') || L(c, 'title'))}</a></li>`).join('')}<li><a href="#/drops">${t('c.drop')}</a></li><li><a href="#/custom">${esc(LL({ en: 'Custom', ar: 'تخصيص' }))}</a></li></ul></div>
          <div><h4 class="mono">${t('nav.menu')}</h4><ul>${(nav.footer || []).map(l => `<li><a href="${esc(l.to)}">${esc(LL(l))}</a></li>`).join('')}</ul></div>
          <div><h4 class="mono">${t('m.getInTouch')}</h4><ul>
            <li><a href="${N.wa()}" target="_blank" rel="noopener">WhatsApp · <bdi class="num">${esc(fmtPhone(s.whatsapp))}</bdi></a></li>
            ${s.instagram ? `<li><a href="https://instagram.com/${esc(s.instagram)}" target="_blank" rel="noopener">Instagram · @${esc(s.instagram)}</a></li>` : ''}
            ${s.tiktok ? `<li><a href="https://tiktok.com/@${esc(s.tiktok)}" target="_blank" rel="noopener">TikTok · @${esc(s.tiktok)}</a></li>` : ''}
            ${s.email ? `<li><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></li>` : ''}
            <li class="muted">${t('m.deliveryArea')}</li></ul></div>
        </div>
      </div>
      <div class="wrap ftr__bot"><span class="mono">${t('m.rights', { y: new Date().getFullYear() })}</span>
        <span style="display:flex;gap:8px;flex-wrap:wrap"><a class="lang-pill ftr__dash" href="${esc(N.wp ? (N.wp.admin || N.wp.home + '?nasij_admin=1') : 'admin.html')}">${icon('panel')}${t('m.dashboard')}</a><button class="lang-pill" data-lang style="color:#F3F0EA;border-color:rgba(243,240,234,.3)">${N.isAr() ? 'English' : 'العربية'}</button><button class="lang-pill" data-mode style="color:#F3F0EA;border-color:rgba(243,240,234,.3)">${mode() === 'dark' ? '☀' : '☾'}</button></span></div>`;
  }
  function fmtPhone(p) { p = String(p || '').replace(/\D/g, ''); if (p.indexOf('20') === 0) p = '0' + p.slice(2); return p.replace(/^(\d{4})(\d{3})(\d{4})$/, '$1 $2 $3'); }

  function menu() {
    const nav = C().nav || {};
    const links = (nav.header || []).concat([{ en: 'Shop all', ar: 'كل المنتجات', to: '#/shop' }, { en: 'Saved', ar: 'المحفوظ', to: '#/saved' }]);
    $('#d-menu').innerHTML = `<div class="drawer__h">${logo()}<button class="icon-btn" data-close aria-label="${t('nav.close')}">${icon('close')}</button></div>
      <div class="drawer__b"><nav class="mnav">${links.map((l, i) => `<a href="${esc(l.to)}"><span class="disp">${esc(LL(l))}</span><span class="mono">${pad(i + 1)}</span></a>`).join('')}</nav>
      <div class="mnav__meta"><button class="btn btn--line btn--sm" data-lang>${t('nav.lang')}</button><button class="btn btn--line btn--sm" data-mode>${icon(mode() === 'dark' ? 'sun' : 'moon')} ${t('nav.theme')}</button><a class="btn btn--line btn--sm" href="${N.wa()}" target="_blank" rel="noopener">${icon('wa')} WhatsApp</a></div></div>`;
  }
  function counts() {
    const n = N.cart.count(), w = N.wish.list().length;
    $$('[data-count="bag"]').forEach(e => { e.textContent = n || ''; });
    $$('[data-count="wish"]').forEach(e => { e.textContent = w || ''; });
  }

  /* drawers / modal */
  let openD = null;
  function openDrawer(name) {
    closeDrawer(true);
    const d = $('#d-' + name); if (!d) return;
    if (name === 'bag') renderBag();
    if (name === 'search') renderSearch();
    d.classList.add('on'); d.setAttribute('aria-hidden', 'false'); $('#scrim').classList.add('on'); document.body.style.overflow = 'hidden';
    openD = d;
    setTimeout(() => { const f = d.querySelector('input, button'); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function closeDrawer(silent) {
    $$('.drawer.on').forEach(d => { d.classList.remove('on'); d.setAttribute('aria-hidden', 'true'); });
    if (!silent || !openD) { $('#scrim') && $('#scrim').classList.remove('on'); document.body.style.overflow = ''; }
    else { $('#scrim').classList.remove('on'); document.body.style.overflow = ''; }
    openD = null;
  }
  function modal(html, cls) {
    const m = $('#modal'); const c = m.querySelector('.modal__card');
    c.className = 'modal__card' + (cls ? ' ' + cls : '');
    c.innerHTML = `<button class="icon-btn modal__x" data-close-modal aria-label="${t('nav.close')}">${icon('close')}</button>` + html;
    m.classList.add('on'); m.setAttribute('aria-hidden', 'false');
  }
  function closeModal() { const m = $('#modal'); if (!m) return; m.classList.remove('on'); m.setAttribute('aria-hidden', 'true'); if (m._onClose) { const f = m._onClose; m._onClose = null; f(); } }

  /* ─────────────────────────── bag drawer ─────────────────────────── */
  function renderBag() {
    const T = N.cart.totals();
    const d = $('#d-bag');
    const head = `<div class="drawer__h"><b class="disp h3" style="font-size:1.3rem">${t('b.title')} <span class="mono muted">(${T.count})</span></b><button class="icon-btn" data-close aria-label="${t('nav.close')}">${icon('close')}</button></div>`;
    if (!T.rows.length) {
      d.innerHTML = head + `<div class="drawer__b"><div class="empty"><div class="big">${glyph('♎')}</div><p>${t('b.empty')}</p><a class="btn" href="#/shop" data-close>${t('c.shopNow')} ${arr()}</a></div></div>`;
      return;
    }
    const left = T.freeOver ? Math.max(0, T.freeOver - (T.full - T.discount)) : 0;
    const fp = T.freeOver ? Math.min(100, Math.round((T.full - T.discount) / T.freeOver * 100)) : 100;
    d.innerHTML = head + `
      ${T.freeOver ? `<div class="freebar"><span class="mono">${left > 0 ? t('b.toFree', { amount: money(left) }) : t('b.free')}</span><div class="meter" style="--p:${Math.max(3, fp)}%"><i></i></div></div>` : ''}
      <div class="drawer__b">${T.rows.map(lineHTML).join('')}</div>
      <div class="drawer__f"><div class="sum">
        ${promoHTML()}
        <div class="sum__r"><span>${t('b.subtotal')}</span><b class="num">${money(T.full)}</b></div>
        ${T.discount ? `<div class="sum__r"><span>${t('b.discount')} · ${esc(T.promo.code)}</span><b class="num">−${money(T.discount)}</b></div>` : ''}
        ${T.hasPre ? `<div class="sum__r"><span>${t('b.balance')}</span><b class="num">${money(T.balance)}</b></div>` : ''}
        <div class="sum__r"><span>${t('b.delivery')}</span><span class="muted">${t('b.calcLater')}</span></div>
        <div class="sum__r big${T.hasPre ? ' hl' : ''}"><span>${T.hasPre ? t('b.dueNow') : t('b.total')}</span><b class="num">${money(T.hasPre ? T.dueNow : T.full - T.discount)}</b></div>
        <a class="btn btn--block" href="#/checkout" data-close>${t('b.checkout')} ${arr()}</a>
        <p class="muted" style="margin:0;font-size:.82rem;text-align:center">${t('k.secure')}</p>
      </div></div>`;
  }
  function lineHTML(r) {
    const { l, p, v } = r;
    return `<div class="line" data-key="${esc(l.key)}">
      <a class="line__img" href="#/products/${esc(p.handle)}?c=${esc(v.color)}" data-close><img src="${esc(v.images[0])}" alt="" loading="lazy"></a>
      <div><div class="line__t">${esc(N.title(p))}</div>
        <div class="line__m">${esc(N.colourName(v))} · ${esc(l.size)}${l.pre ? ` · <span class="tag tag--signal" style="vertical-align:1px">${t('c.preorder')}</span>` : ''}</div>
        <div class="qty"><button data-q="-1" aria-label="−">${icon('minus')}</button><span class="num">${l.qty}</span><button data-q="1" aria-label="+">${icon('plus')}</button></div></div>
      <div class="line__p num"><span>${money(r.lineNow)}${l.pre ? `<small>${t('d.deposit', { pct: N.drop().depositPct })}</small><small>${money(r.line)}</small>` : ''}</span><button class="btn btn--ghost btn--sm" data-rm>${t('c.remove')}</button></div>
    </div>`;
  }
  function promoHTML() {
    const cur = N.promo.get();
    return `<form class="promo" data-promo><input class="inp" name="code" placeholder="${t('b.promo')}" value="${esc(cur || '')}" autocomplete="off" style="text-transform:uppercase"><button class="btn btn--line btn--sm" type="submit">${t('b.apply')}</button></form>`;
  }

  /* ─────────────────────────── search drawer ─────────────────────────── */
  function renderSearch(q) {
    const d = $('#d-search');
    if (!d.dataset.ready) {
      d.innerHTML = `<div class="drawer__h"><b class="mono">${t('nav.search')}</b><button class="icon-btn" data-close aria-label="${t('nav.close')}">${icon('close')}</button></div>
        <div class="search-top"><input class="inp" type="search" id="sq" placeholder="${t('m.searchPh')}" autocomplete="off"></div><div class="drawer__b"><div class="sres" id="sres"></div></div>`;
      d.dataset.ready = '1';
      $('#sq').addEventListener('input', e => searchResults(e.target.value));
    }
    searchResults(q != null ? q : ($('#sq') ? $('#sq').value : ''));
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي'); }
  function searchResults(q) {
    const box = $('#sres'); if (!box) return;
    q = norm(q).trim();
    const list = N.products().filter(p => N.collection(p.collection) && N.collection(p.collection).status === 'active');
    let hits = list;
    if (q) hits = list.filter(p => {
      const sg = p.sign ? N.sign(p.sign) : null;
      const hay = norm([p.title_en, p.title_ar, p.sub_en, p.sub_ar, (p.tags || []).join(' '), sg && sg.en, sg && sg.ar, p.variants.map(v => v.color_en + ' ' + v.color_ar).join(' ')].join(' '));
      return q.split(/\s+/).every(w => hay.indexOf(w) > -1);
    });
    if (q) try { window.NZ_TRACK && NZ_TRACK.event('search', { q, n: hits.length }); } catch (e) { }
    box.innerHTML = hits.length ? hits.slice(0, 20).map(p => { const v = p.variants[0]; return `<a href="#/products/${esc(p.handle)}" data-close><img src="${esc(v.images[0])}" alt="" loading="lazy"><span><b>${esc(N.title(p))}</b><br><small class="muted">${esc(L(p, 'sub'))}</small></span><span class="mono num">${money(p.price)}</span></a>`; }).join('')
      : `<p class="muted" style="padding:10px">${t('m.noResults', { q: esc(q) })}</p>`;
  }

  /* ─────────────────────────── section header ─────────────────────────── */
  function sh(k, title, idx, action) {
    return `<div class="sh rv"><div class="sh__k"><span class="mono kick">${esc(k)}</span><span class="rule"></span>${idx ? `<span class="mono sh__idx">${idx}</span>` : ''}</div>
      ${title ? `<h2 class="disp h2">${esc(title)}</h2>` : ''}${action ? `<div class="sh__a">${action}</div>` : ''}</div>`;
  }

  /* ─────────────────────────── HOME ─────────────────────────── */
  const SECTIONS = {
    hero(s) {
      const d = N.drop(), open = N.dropOpen(), signs = C().signs || [];
      const title = L(s, 'title');
      let lines = (title.match(/[^.!?؟…]+[.!?؟…]*/g) || [title]).map(x => x.trim()).filter(Boolean);
      if (lines.length < 2) { const w = title.split(' '), h = Math.ceil(w.length / 2); lines = [w.slice(0, h).join(' '), w.slice(h).join(' ')].filter(Boolean); }
      lines = [lines[0], lines.slice(1).join(' ')].filter(Boolean);
      const n = N.reservedCount(), goal = +d.goal || 100, pct = Math.min(100, Math.round(n / goal * 100));
      return `<section class="hero tone-dark grain">
        <div class="hero__img"><img src="${esc(s.image)}" alt="" fetchpriority="high" width="1920" height="1020"></div>
        <div class="chart-lines" aria-hidden="true"></div>
        <div class="hero__coords mono" aria-hidden="true"><span>30.0444° N · 31.2357° E</span><span class="hide-m">RA 04h 35m · DEC +16° 30′</span><span>${esc(LL({ en: 'Cairo', ar: 'القاهرة' }))}</span></div>
        <div class="hero__cross" aria-hidden="true"></div>
        <div class="wrap hero__body">
          <div>
            <span class="mono kick" style="color:rgba(243,240,234,.8)">${esc(L(s, 'kicker'))}</span>
            <h1 class="disp h1 hero__title">${lines.map(x => `<span class="ln"><span>${esc(x)}</span></span>`).join('')}</h1>
            <p class="lead">${esc(L(s, 'text'))}</p>
            <div class="hero__cta">
              <a class="btn btn--signal" href="${esc(s.to || '#/drops')}">${esc(L(s, 'cta'))} ${arr()}</a>
              ${L(s, 'cta2') ? `<a class="btn btn--line" href="${esc(s.to2 || '#/shop')}">${esc(L(s, 'cta2'))}</a>` : ''}
            </div>
          </div>
          ${d.on ? `<div class="hero__side"><div class="tcard">
            <div class="tcard__h mono"><span class="tcard__live">${open ? t('d.opens') : t('d.live')}</span><span class="tcard__date">${t('c.drop')} · ${esc(N.date(d.date, { day: 'numeric', month: 'short' }))}</span></div>
            ${open ? tcdHTML(N.dropTime()) : ''}
            <div style="display:grid;gap:8px"><div class="tcard__m mono"><span>${t('d.reserved', { n, goal })}</span><span>${pct}%</span></div><div class="meter" style="--p:${Math.max(2, pct)}%"><i></i></div></div>
            <div class="tcard__glyphs" aria-hidden="true">${signs.map((sg, i) => `<span style="--i:${i}">${glyph(sg.glyph)}</span>`).join('')}</div>
          </div></div>` : ''}
        </div>
      </section>`;
    },
    dial(s) {
      return `<section class="sec dial-sec tone-dark stars grain" id="dial">
        <div class="wrap">
          ${sh(L(s, 'kicker'), '', '§ 01')}
          <div class="dial-grid">
            <div class="dial rv" id="dialBox">${dialSVG()}<div class="dial__center"><span class="gl" id="dialGl"></span><img id="dialImg" alt=""></div></div>
            <div class="dial-info rv" style="--d:.1s">
              <span class="mono muted" id="dialDates"></span>
              <h2 class="disp h1" id="dialName"></h2>
              <p class="lead" id="dialTag"></p>
              <div class="mono muted" id="dialEl"></div>
              <div class="swatches" id="dialSw"></div>
              <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn--signal" id="dialGo" href="#/drops">${arr()}</a><span class="mono muted" style="align-self:center">${t('d.spin')}</span></div>
              <hr class="hair">
              <form class="bday" id="bday" novalidate><label class="fld"><span>${t('d.birthday')}</span><span class="datef"><input class="inp" name="d" inputmode="numeric" autocomplete="bday" placeholder="DD/MM/YYYY" maxlength="10" dir="ltr" aria-describedby="bdayErr"><button type="button" class="datef__btn" data-datepick aria-label="${t('d.pickDate')}" title="${t('d.pickDate')}">${icon('cal')}</button><input type="date" class="datef__native" tabindex="-1" aria-hidden="true"></span></label><button class="btn btn--line" style="align-self:end">${t('d.find')}</button><span class="bday__err mono" id="bdayErr" hidden></span></form>
            </div>
          </div>
        </div></section>`;
    },
    drop(s) {
      const d = N.drop(), list = N.inCollection(s.collection || d.collection).slice(0, s.limit || 12);
      if (!list.length) return '';
      return `<section class="sec tone-light" id="drop">
        <div class="wrap">
          ${sh(L(s, 'kicker'), L(s, 'title'), '§ 02', `<a class="btn btn--line btn--sm" href="#/drops">${t('c.viewAll')} ${arr()}</a>`)}
          ${d.on && N.dropOpen() ? `<div class="rv" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;align-items:end;margin-bottom:28px" data-dropbar>
            <div style="display:grid;gap:10px">${meterHTML()}</div>${cdHTML(N.dropTime())}</div>` : ''}
          <div class="rail" id="dropRail">${cards(list).join('')}</div>
        </div></section>`;
    },
    collections(s) {
      const cols = N.collections().filter(c => N.inCollection(c.id).length);
      if (!cols.length) return '';
      return `<section class="sec tone-light">
        <div class="wrap">${sh(L(s, 'kicker'), L(s, 'title'), '§ 03')}
          <div class="tiles" style="--n:${Math.min(cols.length, 3)}">${cols.map((c, i) => `<a class="tile rv" style="--d:${i * .08}s" href="#/collections/${esc(c.handle)}">
            <img src="${esc(c.image)}" alt="" loading="lazy">
            <span class="tile__big mono">${pad(i + 1)} / ${pad(cols.length)} · ${N.inCollection(c.id).length} ${t('c.items')}</span>
            <div class="tile__b"><div><span class="mono" style="opacity:.8">${esc(L(c, 'desc'))}</span><h3 class="disp tile__t">${esc(L(c, 'short') || L(c, 'title'))}</h3></div><span class="arrow-c">${icon('arrowUR')}</span></div>
          </a>`).join('')}</div></div></section>`;
    },
    products(s) {
      let list = N.products().filter(p => N.collection(p.collection) && N.collection(p.collection).status === 'active');
      if (s.collection) list = list.filter(p => p.collection === s.collection);
      if (s.source === 'best') {
        const dc = N.drop().collection;
        list = list.slice().sort((a, b) => ((N.isPre(a) && a.collection === dc) - (N.isPre(b) && b.collection === dc)) || ((b.sales || 0) - (a.sales || 0)));
      }
      const html = cards(list, { limit: s.limit || 8 });
      if (!html.length) return '';
      return `<section class="sec tone-light"><div class="wrap">${sh(L(s, 'kicker'), L(s, 'title'), '§ 04', `<a class="btn btn--line btn--sm" href="#/shop">${t('l.shopAll')} ${arr()}</a>`)}
        <div class="grid">${html.join('')}</div></div></section>`;
    },
    editorial(s) {
      return `<section class="sec tone-light"><div class="wrap"><div class="edit rv">
        <div class="edit__img"><img src="${esc(s.image)}" alt="" loading="lazy"></div>
        <div class="edit__b"><div><span class="mono kick kick--ink">${esc(L(s, 'kicker'))}</span><div class="edit__big" aria-hidden="true">320</div></div>
          <div><h2 class="disp h2" style="max-width:14ch">${esc(L(s, 'title'))}</h2><p class="lead" style="margin:18px 0 26px">${esc(L(s, 'text'))}</p>
          <div class="specs"><div><b class="num">320</b><span class="mono muted">GSM</span></div><div><b>S–XXL</b><span class="mono muted">${esc(LL({ en: 'Unisex', ar: 'يونيسكس' }))}</span></div><div><b>EG</b><span class="mono muted">${esc(LL({ en: 'Made in Egypt', ar: 'صناعة مصرية' }))}</span></div></div>
          ${L(s, 'cta') ? `<div style="margin-top:26px"><a class="btn" href="${esc(s.to || '#/shop')}">${esc(L(s, 'cta'))} ${arr()}</a></div>` : ''}</div></div>
      </div></div></section>`;
    },
    band(s) {
      return `<section class="sec band"><div class="wrap"><div class="band__in">
        <div><span class="mono kick kick--ink">${esc(L(s, 'kicker'))}</span><h2 class="disp h2" style="margin-top:14px">${esc(L(s, 'title'))}</h2></div>
        <div style="display:grid;gap:18px;justify-items:start"><p class="lead" style="color:rgba(11,11,13,.8)">${esc(L(s, 'text'))}</p><a class="btn" href="${esc(s.to || '#/custom')}">${esc(L(s, 'cta'))} ${arr()}</a></div>
      </div></div></section>`;
    },
    faq(s) {
      const items = (C().pages.faq || []).slice(0, s.limit || 5);
      if (!items.length) return '';
      return `<section class="sec tone-light"><div class="wrap faq-grid">
        <div>${sh(L(s, 'kicker'), L(s, 'title'), '')}<a class="btn btn--line btn--sm" href="#/faq">${t('c.viewAll')} ${arr()}</a></div>
        <div class="faq rv">${faqItems(items)}</div></div></section>`;
    }
  };
  function faqItems(items) { return items.map(f => `<details><summary>${esc(L(f, 'q'))}<span class="pm">${icon('plus')}</span></summary><div class="ans">${esc(L(f, 'a'))}</div></details>`).join(''); }

  function viewHome() {
    const secs = (C().home.sections || []).filter(s => s.on !== false && SECTIONS[s.type]);
    return secs.map(s => SECTIONS[s.type](s)).join('');
  }

  /* ─────────────────────────── DIAL ─────────────────────────── */
  let dialState = { i: 0, color: 'black', rot: 0 };
  function dialSVG() {
    const signs = C().signs || [], R1 = 184, R2 = 298, cx = 300, cy = 300;
    const pt = (r, a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
    const seg = i => { const a0 = i * 30 - 15, a1 = i * 30 + 15; const [x1, y1] = pt(R2, a0), [x2, y2] = pt(R2, a1), [x3, y3] = pt(R1, a1), [x4, y4] = pt(R1, a0);
      return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${R2} ${R2} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}L${x3.toFixed(1)} ${y3.toFixed(1)}A${R1} ${R1} 0 0 0 ${x4.toFixed(1)} ${y4.toFixed(1)}Z`; };
    let ticks = '';
    for (let a = 0; a < 360; a += 3) { const long = a % 30 === 15; const [x1, y1] = pt(R2 + 2, a), [x2, y2] = pt(R2 + (long ? 14 : 6), a); ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-opacity="${long ? .5 : .22}"/>`; }
    return `<svg viewBox="-20 -20 640 640" role="group" aria-label="zodiac dial">
      <g style="color:var(--fg)">${ticks}</g>
      <circle cx="${cx}" cy="${cy}" r="${R2 + 24}" fill="none" stroke="var(--line)"/>
      <circle cx="${cx}" cy="${cy}" r="120" fill="none" stroke="var(--line)" stroke-dasharray="2 6"/>
      <line x1="${cx}" y1="-10" x2="${cx}" y2="610" stroke="var(--line)"/><line x1="-10" y1="${cy}" x2="610" y2="${cy}" stroke="var(--line)"/>
      <g class="dial__ring" id="dialRing" transform="rotate(0 300 300)">
        ${signs.map((s, i) => { const [gx, gy] = pt(262, i * 30), [nx, ny] = pt(210, i * 30);
          return `<path class="dial__seg" d="${seg(i)}" data-si="${i}"><title>${esc(LL(s))}</title></path>
          <g class="dial__lab" data-lab="${i}" data-cx="${gx.toFixed(1)}" data-cy="${gy.toFixed(1)}"><text class="dial__glyph" x="${gx.toFixed(1)}" y="${(gy + 10).toFixed(1)}" text-anchor="middle">${glyph(s.glyph)}</text></g>
          <g class="dial__lab" data-lab="${i}" data-cx="${nx.toFixed(1)}" data-cy="${ny.toFixed(1)}"><text class="dial__name" x="${nx.toFixed(1)}" y="${(ny + 4).toFixed(1)}" text-anchor="middle">${esc(LL(s))}</text></g>`; }).join('')}
      </g>
      <path class="dial__pointer" d="M${cx - 11} -16 L${cx + 11} -16 L${cx} 6 Z"/>
    </svg>`;
  }
  function dialSelect(i, color, spin) {
    const signs = C().signs || []; if (!signs.length) return;
    i = ((i % 12) + 12) % 12; dialState.i = i; if (color) dialState.color = color;
    // rotate the shortest way (from what is on screen) so sign i sits under the pointer
    let target = -i * 30; const cur = dialState.shown != null ? dialState.shown : dialState.rot;
    while (target - cur > 180) target -= 360; while (target - cur < -180) target += 360;
    dialState.rot = target;
    if (!$('#dialRing')) return;
    dialTo(target, spin === false ? 0 : 950);
    $$('.dial__seg').forEach(p => p.classList.toggle('on', +p.dataset.si === i));
    const s = signs[i], p = N.product('z-' + s.id);
    const v = p ? N.variant(p, dialState.color) : null;
    $('#dialName').textContent = LL(s);
    $('#dialDates').textContent = (N.isAr() ? s.dates_ar : s.dates_en) + '  ·  ' + glyph(s.glyph);
    $('#dialTag').textContent = p ? L(p, 'sub') + '.' : '';
    const el = (C().elements || {})[s.element];
    $('#dialEl').textContent = el ? t('d.element') + ' · ' + (N.isAr() ? el[1] : el[0]) : '';
    $('#dialGl').textContent = glyph(s.glyph);
    const im = $('#dialImg');
    if (v) { im.style.opacity = 0; const src = v.images[0]; const pre = new Image(); pre.onload = () => { im.src = src; im.style.opacity = 1; }; pre.src = src; }
    $('#dialSw').innerHTML = p ? p.variants.map(x => `<button class="sw${x.color === dialState.color ? ' on' : ''}" style="--c:${esc(x.hex)}" data-dialc="${esc(x.color)}" aria-label="${esc(N.colourName(x))}" title="${esc(N.colourName(x))}"></button>`).join('') : '';
    const go = $('#dialGo');
    if (p) { go.href = `#/products/${p.handle}?c=${dialState.color}`; go.innerHTML = `${esc(t('d.reserveSign', { sign: LL(s) }))} ${arr()}`; }
  }
  let dialAnim = 0;
  function dialPaint(rot) {
    const ring = $('#dialRing'); if (!ring) return;
    ring.setAttribute('transform', 'rotate(' + rot.toFixed(3) + ' 300 300)');
    $$('.dial__lab').forEach(g => g.setAttribute('transform', 'rotate(' + (-rot).toFixed(3) + ' ' + g.dataset.cx + ' ' + g.dataset.cy + ')'));
  }
  function dialTo(target, ms) {
    cancelAnimationFrame(dialAnim);
    const from = dialState.shown != null ? dialState.shown : target;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ms || reduce || Math.abs(target - from) < .05) { dialState.shown = target; dialPaint(target); return; }
    const t0 = performance.now(), ease = x => 1 - Math.pow(1 - x, 4);
    const step = now => { const k = Math.min(1, (now - t0) / ms), v = from + (target - from) * ease(k); dialState.shown = v; dialPaint(v); if (k < 1) dialAnim = requestAnimationFrame(step); };
    dialAnim = requestAnimationFrame(step);
  }
  function mountDial() {
    const box = $('#dialBox'); if (!box) return;
    const today = new Date(), s0 = N.signForDate(today.getMonth() + 1, today.getDate());
    dialSelect((C().signs || []).indexOf(s0), 'black', false);
    let drag = null;
    const angle = e => { const r = box.getBoundingClientRect(); const x = (e.touches ? e.touches[0].clientX : e.clientX) - (r.left + r.width / 2), y = (e.touches ? e.touches[0].clientY : e.clientY) - (r.top + r.height / 2); return Math.atan2(x, -y) * 180 / Math.PI; };
    box.addEventListener('pointerdown', e => {
      if (e.target.closest('.dial__center')) return;
      cancelAnimationFrame(dialAnim);
      drag = { last: angle(e), rot: dialState.shown != null ? dialState.shown : dialState.rot, moved: 0, target: e.target };
      box.classList.add('dragging'); box.setPointerCapture && box.setPointerCapture(e.pointerId);
    });
    box.addEventListener('pointermove', e => {
      if (!drag) return;
      const a = angle(e); let d = a - drag.last; if (d > 180) d -= 360; if (d < -180) d += 360;
      drag.last = a; drag.moved += Math.abs(d); drag.rot += d;
      dialState.shown = drag.rot; dialPaint(drag.rot);
    });
    const end = () => {
      if (!drag) return;
      box.classList.remove('dragging');
      if (drag.moved < 4 && drag.target.dataset && drag.target.dataset.si != null) dialSelect(+drag.target.dataset.si);
      else dialSelect(Math.round(-dialState.shown / 30));
      drag = null;
    };
    box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);
    const bd = $('#bday'), bi = bd.elements.d, nat = $('.datef__native', bd), berr = $('#bdayErr');
    bi.addEventListener('input', () => {
      let x = bi.value.replace(/\D/g, '').slice(0, 8);
      if (x.length > 4) x = x.slice(0, 2) + '/' + x.slice(2, 4) + '/' + x.slice(4); else if (x.length > 2) x = x.slice(0, 2) + '/' + x.slice(2);
      bi.value = x; berr.hidden = true;
    });
    $('[data-datepick]', bd).addEventListener('click', () => { try { nat.showPicker(); } catch (x) { nat.focus(); nat.click(); } });
    nat.addEventListener('change', () => { if (!nat.value) return; const [y, m, d] = nat.value.split('-'); bi.value = d + '/' + m + '/' + y; bd.requestSubmit(); });
    bd.addEventListener('submit', e => {
      e.preventDefault();
      const m = bi.value.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/), dd = m ? +m[1] : 0, mm = m ? +m[2] : 0;
      if (!m || mm < 1 || mm > 12 || dd < 1 || dd > new Date(2024, mm, 0).getDate()) { berr.textContent = t('d.dateBad'); berr.hidden = false; return; }
      dialSelect((C().signs || []).indexOf(N.signForDate(mm, dd))); $('#dialBox').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ─────────────────────────── LISTING ─────────────────────────── */
  function colourFamilies(list) {
    const seen = {};
    list.forEach(p => p.variants.forEach(v => { const k = v.color; if (!seen[k]) seen[k] = v; }));
    return Object.values(seen);
  }
  function viewListing(handle) {
    const col = handle ? N.collection(handle) : null;
    if (handle && (!col || col.status !== 'active')) return view404();
    let list = handle ? N.inCollection(col.id) : N.products().filter(p => N.collection(p.collection) && N.collection(p.collection).status === 'active');
    const q = route.q, sort = q.sort || 'featured', colour = q.c || '', cat = q.cat || '';
    if (!handle && cat) list = list.filter(p => p.collection === cat);
    const fams = colourFamilies(list);
    if (colour) list = list.filter(p => p.variants.some(v => v.color === colour));
    list = sortList(list, sort);
    const split = col && col.split;
    let html;
    if (colour) html = list.map((p, i) => card(p, { variant: N.variant(p, colour), split: true, i }));
    else html = cards(list, {});
    const title = col ? L(col, 'title') : t('l.shopAll');
    const qs = (patch) => { const o = Object.assign({}, q, patch); Object.keys(o).forEach(k => { if (!o[k]) delete o[k]; }); const s = new URLSearchParams(o).toString(); return '#' + route.path + (s ? '?' + s : ''); };
    const head = col && col.banner
      ? `<section class="phead phead--img tone-dark grain"><div class="bg"><img src="${esc(col.banner)}" alt=""></div><div class="wrap">
          <div class="crumbs mono"><a href="#/">${t('nav.home')}</a><span>/</span><a href="#/shop">${t('nav.shop')}</a></div>
          <h1 class="disp h1">${esc(title)}</h1><p class="lead" style="margin-top:14px">${esc(L(col, 'desc'))}</p></div></section>`
      : `<section class="phead tone-light"><div class="wrap"><div class="crumbs mono"><a href="#/">${t('nav.home')}</a><span>/</span><span>${esc(title)}</span></div>
          <h1 class="disp h1">${esc(title)}</h1>${col && L(col, 'desc') ? `<p class="lead" style="margin-top:14px">${esc(L(col, 'desc'))}</p>` : ''}</div></section>`;
    const cols = N.collections().filter(c => N.inCollection(c.id).length);
    return `${head}
      <div class="toolbar tone-light"><div class="wrap toolbar__in">
        <div class="chips">
          ${!handle ? `<a class="chip${!cat ? ' on' : ''}" href="${qs({ cat: '' })}">${t('l.all')}</a>${cols.map(c => `<a class="chip${cat === c.id ? ' on' : ''}" href="${qs({ cat: c.id })}">${esc(L(c, 'short') || L(c, 'title'))}</a>`).join('')}` : ''}
          ${fams.length > 1 ? `<a class="chip${!colour ? ' on' : ''}" href="${qs({ c: '' })}">${t('c.colour')}: ${t('l.all')}</a>${fams.map(v => `<a class="chip${colour === v.color ? ' on' : ''}" href="${qs({ c: v.color })}"><span class="sw sw--sm" style="--c:${esc(v.hex)}"></span>${esc(N.colourName(v))}</a>`).join('')}` : ''}
        </div>
        <label style="display:flex;align-items:center;gap:8px;flex:none"><span class="mono muted">${t('l.sort')}</span>
          <select class="inp sortsel" data-sort>${['featured', 'best', 'low', 'high'].map(k => `<option value="${k}"${sort === k ? ' selected' : ''}>${t('l.sort.' + k)}</option>`).join('')}</select></label>
      </div></div>
      <section class="sec sec--tight tone-light"><div class="wrap">
        <p class="mono muted" style="margin:0 0 18px">${t('l.count', { n: html.length })}</p>
        ${html.length ? `<div class="grid">${html.join('')}</div>` : `<div class="empty"><p>${t('l.empty')}</p></div>`}
      </div></section>`;
  }

  /* ─────────────────────────── PRODUCT ─────────────────────────── */
  let pdp = { size: null };
  function viewProduct(handle) {
    const p = N.product(handle);
    const col = p && N.collection(p.collection);
    if (!p || (p.status !== 'active' && !N.previewing()) || !col || (col.status !== 'active' && !N.previewing())) return view404(t('p.notFound'));
    const v = N.variant(p, route.q.c);
    const pre = N.isPre(p), d = N.drop(), sg = p.sign ? N.sign(p.sign) : null;
    pdp = { p, v, size: pdp.p && pdp.p.id === p.id ? pdp.size : null, cur: 0 };
    const imgs = v.images;
    const lbl = galLbl;
    const care = (C().pages.policies || []).find(x => x.id === 'care');
    const ship = (C().pages.policies || []).find(x => x.id === 'shipping');
    const el = sg ? (C().elements || {})[sg.element] : null;
    const others = p.sign ? N.inCollection(p.collection).filter(x => x.id !== p.id) : N.products().filter(x => x.id !== p.id && N.collection(x.collection) && N.collection(x.collection).status === 'active').sort((a, b) => (b.sales || 0) - (a.sales || 0));
    try { const r = N.read(N.LS.recent, []).filter(x => x !== p.id); r.unshift(p.id); N.write(N.LS.recent, r.slice(0, 12)); } catch (e) { }
    return `<section class="tone-light"><div class="wrap">
      <div class="crumbs mono" style="padding-top:22px"><a href="#/">${t('nav.home')}</a><span>/</span><a href="#/collections/${esc(col.handle)}">${esc(L(col, 'short') || L(col, 'title'))}</a><span>/</span><span>${esc(N.title(p))}</span></div>
      <div class="pdp">
        <div>
          <div class="gal${imgs.length > 1 ? '' : ' gal--one'}" id="gal">
            ${imgs.length > 1 ? `<div class="gal__thumbs" id="galThumbs">${galThumbs(0)}</div>` : ''}
            <div class="gal__main" id="galMain">${lbl(0) ? `<span class="gal__lbl tag tag--line" id="galLbl">${lbl(0)}</span>` : ''}<img id="galImg" src="${esc(imgs[0])}" alt="${esc(galAlt(0))}" fetchpriority="high" width="900" height="1200"></div>
          </div>
        </div>
        <div class="buy">
          <div style="display:grid;gap:12px">
            <div class="buy__top"><div style="display:flex;gap:8px;flex-wrap:wrap">${tagsHTML(p, v)}${sg ? `<span class="tag tag--line">${glyph(sg.glyph)} ${esc(N.isAr() ? sg.dates_ar : sg.dates_en)}</span>` : ''}</div>
              <div class="share"><button class="share__b" data-copylink title="${t('p.copyLink')}">${icon('link')}<span>${t('p.copyLink')}</span></button><a class="share__b" href="https://wa.me/?text=${encodeURIComponent(N.title(p) + ' — ' + location.href)}" target="_blank" rel="noopener" title="${t('p.shareWa')}" aria-label="${t('p.shareWa')}">${icon('wa')}</a></div></div>
            <h1 class="disp buy__t">${esc(N.title(p))}</h1>
            ${ratingLine(p)}
            ${L(p, 'sub') ? `<p class="muted" style="margin:0">${esc(L(p, 'sub'))}</p>` : ''}
            <div class="buy__p num">${pre ? `<span>${money(p.price)}</span><span class="dep">${t('d.deposit', { pct: d.depositPct })} · ${money(N.deposit(p.price))}</span>` : `${p.compareAt && +p.compareAt > +p.price ? `<s class="muted" style="font-weight:400">${money(p.compareAt)}</s>` : ''}<span>${money(p.price)}</span>`}</div>
            ${pre ? `<p class="muted" style="margin:0;font-size:.9rem">${t('p.fullPrice', { price: money(p.price), rest: money(p.price - N.deposit(p.price)) })}</p>` : ''}
          </div>
          ${p.variants.length > 1 ? `<div style="display:grid;gap:10px"><div class="buy__row"><span class="mono">${t('c.colour')} · <b>${esc(N.colourName(v))}</b></span></div>
            <div class="swatches">${p.variants.map(x => `<a class="sw${x.id === v.id ? ' on' : ''}" style="--c:${esc(x.hex)}" href="#/products/${esc(p.handle)}?c=${esc(x.color)}" aria-label="${esc(N.colourName(x))}" title="${esc(N.colourName(x))}" data-keep></a>`).join('')}</div></div>` : ''}
          <div style="display:grid;gap:10px"><div class="buy__row"><span class="mono">${t('c.size')}</span><a class="mono link" href="#/size-guide">${t('p.sizeGuide')}</a></div>
            <div class="sizes" id="sizes">${(p.sizes || []).map(s => { const st = N.stockOf(v, s); return `<button class="sz${pdp.size === s ? ' on' : ''}" data-size="${esc(s)}"${!pre && st <= 0 ? ' disabled' : ''}>${esc(s)}</button>`; }).join('')}</div>
            ${!pre && v.track && pdp.size && N.stockOf(v, pdp.size) <= 3 && N.stockOf(v, pdp.size) > 0 ? `<span class="mono" style="color:var(--danger)">${t('p.lowStock', { n: N.stockOf(v, pdp.size) })}</span>` : ''}
          </div>
          <div class="buy__ctas" id="buyCtas">
            ${N.soldOut(p, v) && !pre ? `<button class="btn btn--block" disabled>${t('c.soldOut')}</button>` : pre
              ? `<button class="btn btn--signal btn--block" data-buy="reserve">${t('p.reserve', { amount: money(N.deposit(p.price)) })} ${arr()}</button>`
              : `<button class="btn btn--block" data-buy="add">${t('p.addToBag')} ${arr()}</button><button class="btn btn--line btn--block" data-buy="now">${t('p.buyNow')}</button>`}
            <button class="btn btn--ghost" data-fav="${esc(p.id)}" style="justify-self:center">${icon('heart')} <span>${N.wish.has(p.id) ? t('p.saved') : t('p.save')}</span></button>
          </div>
          <div class="buy__note">${icon('truck')}<span>${pre ? t('p.shipsAfter', { date: N.date(d.date) }) : t('p.inStockCairo')}</span></div>
          ${sg ? `<div class="signline"><span class="g">${glyph(sg.glyph)}</span><div><b>${esc(LL(sg))}</b><div class="muted" style="font-size:.9rem">${esc(N.isAr() ? sg.dates_ar : sg.dates_en)}${el ? ' · ' + t('d.element') + ': ' + esc(N.isAr() ? el[1] : el[0]) : ''}</div></div></div>` : ''}
          <div class="acc">
            <details open><summary>${t('p.details')}${icon('chev')}</summary><div class="ans">${esc(L(p, 'desc'))}</div></details>
            ${pre ? `<details><summary>${t('p.dropTerms')}${icon('chev')}</summary><div class="ans"><p>${esc(L(d, 'text'))}</p><p>${esc(L(d, 'terms').replace(/\{days\}/g, d.cancelDays))}</p></div></details>` : ''}
            ${care ? `<details><summary>${t('p.fabric')}${icon('chev')}</summary><div class="ans">${L(care, 'body')}</div></details>` : ''}
            ${ship ? `<details><summary>${t('p.delivery')}${icon('chev')}</summary><div class="ans">${L(ship, 'body')}</div></details>` : ''}
          </div>
        </div>
      </div>
      ${chartOf(p) !== 'none' ? `<section class="pdp-sec" id="sizeFit">${sh(t('p.sizeFit'), LL({ en: 'Find your fit.', ar: 'اعرف مقاسك.' }), '', `<a class="btn btn--line btn--sm" href="#/size-guide">${t('p.fullGuide')} ${arr()}</a>`)}<div class="sg" id="pdpSg">${pdpSizeInner()}</div></section>` : ''}
      ${reviewsHTML(p)}
      ${others.length ? `<div style="padding-bottom:80px">${sh(p.sign ? t('p.other') : t('p.also'), '', '')}<div class="rail">${cards(others.slice(0, 12), { color: p.sign ? v.color : '' }).join('')}</div></div>` : ''}
      </div>
      <div class="sticky-buy tone-light" id="stickyBuy" aria-hidden="true"><div class="sticky-buy__in">
        <img class="sticky-buy__img" src="${esc(imgs[0])}" alt="" width="90" height="120">
        <div class="sticky-buy__t"><b>${esc(N.title(p))}</b><span class="mono muted num">${esc(N.colourName(v))} · ${pre ? t('d.deposit', { pct: d.depositPct }) + ' ' + money(N.deposit(p.price)) : money(p.price)}</span></div>
        ${N.soldOut(p, v) && !pre ? '' : `<div class="sticky-buy__sz">${(p.sizes || []).map(z => `<button class="sz sz--sm${pdp.size === z ? ' on' : ''}" data-size="${esc(z)}"${!pre && N.stockOf(v, z) <= 0 ? ' disabled' : ''}>${esc(z)}</button>`).join('')}</div>`}
        ${N.soldOut(p, v) && !pre ? `<button class="btn" disabled>${t('c.soldOut')}</button>` : pre ? `<button class="btn btn--signal" data-buy="reserve">${t('p.reserve', { amount: money(N.deposit(p.price)) })} ${arr()}</button>` : `<button class="btn btn--signal" data-buy="add">${t('p.addToBag')} ${arr()}</button>`}
      </div></div>
      </section>`;
  }
  function starsHTML(v) {
    const f = Math.round((+v || 0) * 2) / 2; let h = '';
    for (let i = 1; i <= 5; i++) h += `<i class="${f >= i ? 'f' : f >= i - .5 ? 'h' : ''}"></i>`;
    return `<span class="rstars" role="img" aria-label="${(+v || 0).toFixed(1)} / 5">${h}</span>`;
  }
  function ratingLine(p) {
    const st = N.reviews.stats(N.reviews.forProduct(p));
    if (!st.n) return `<a class="rate-line mono" href="#reviews" data-scroll="#reviews">${starsHTML(0)}<span>${t('rv.first')}</span></a>`;
    return `<a class="rate-line" href="#reviews" data-scroll="#reviews">${starsHTML(st.avg)}<b class="num">${st.avg.toFixed(1)}</b><span class="muted">(${st.n === 1 ? t('rv.one') : t('rv.count', { n: st.n })})</span></a>`;
  }
  function reviewsHTML(p) {
    const list = N.reviews.forProduct(p), st = N.reviews.stats(list), col = N.collection(p.collection);
    const pooled = list.some(r => r.pid !== p.id);
    const item = r => { const q = N.product(r.pid), vv = q && r.color ? q.variants.find(x => x.color === r.color) : null;
      const what = [q && q.id !== p.id ? N.title(q) : '', vv ? N.colourName(vv) : '', r.size || ''].filter(Boolean).join(' · ');
      return `<article class="rv-i"><div class="rv-i__h"><span class="rv-i__av" aria-hidden="true">${esc(String(r.name || '?').trim().charAt(0).toUpperCase())}</span>
        <div style="min-width:0"><b>${esc(r.name || '')}</b>${r.verified ? ` <span class="rv-i__ok">${icon('check')}${t('rv.verified')}</span>` : ''}<div class="muted rv-i__m">${r.date ? esc(N.date(r.date, { day: 'numeric', month: 'short', year: 'numeric' })) : ''}${what ? ' · ' + esc(what) : ''}</div></div>${starsHTML(r.rating)}</div>
        <p dir="auto">${esc(r.text || '')}</p></article>`; };
    return `<section class="pdp-sec" id="reviews">${sh(t('rv.title'), st.n ? LL({ en: 'What people say.', ar: 'الناس بتقول إيه.' }) : '', '', `<button class="btn btn--line btn--sm" data-rvopen>${icon('plus')} ${t('rv.write')}</button>`)}
      <div class="rvs">
        <div class="rvs__sum">${st.n ? `<div class="rvs__avg"><b class="num">${st.avg.toFixed(1)}</b><div>${starsHTML(st.avg)}<span class="muted mono">${t('rv.of')} · ${st.n === 1 ? t('rv.one') : t('rv.count', { n: st.n })}</span></div></div>
          <div class="rvs__dist">${[5, 4, 3, 2, 1].map(k => `<div><span class="mono">${k}★</span><i style="--p:${Math.round(st.dist[k - 1] / st.n * 100)}%"></i><span class="mono muted">${st.dist[k - 1]}</span></div>`).join('')}</div>
          ${pooled && col ? `<p class="muted" style="margin:0;font-size:.85rem">${esc(t('rv.pooled', { col: L(col, 'short') || L(col, 'title') }))}</p>` : ''}`
          : `<div class="rvs__empty">${starsHTML(0)}<p style="margin:0">${t('rv.none')}</p><button class="btn btn--signal" data-rvopen>${t('rv.first')} ${arr()}</button></div>`}</div>
        <div class="rvs__list">${list.map((r, i) => `<div class="${i >= 6 ? 'rv-more' : ''}">${item(r)}</div>`).join('')}
          ${list.length > 6 ? `<button class="btn btn--line btn--sm" data-rvall>${t('c.viewAll')} (${list.length})</button>` : ''}</div>
      </div>
      <form class="rvf" id="rvForm" hidden novalidate>
        <div class="rvf__stars" role="radiogroup" aria-label="${t('rv.rating')}"><span class="mono">${t('rv.rating')}</span>${[1, 2, 3, 4, 5].map(k => `<button type="button" data-rvstar="${k}" aria-label="${k}">${icon('star')}</button>`).join('')}</div>
        <div class="fgrid">
          <label class="fld"><span>${t('rv.name')}<em>*</em></span><input class="inp" name="name" autocomplete="given-name" maxlength="40"></label>
          <label class="fld"><span>${t('rv.size')}</span><select class="inp" name="size"><option value="">—</option>${(p.sizes || []).map(z => `<option>${esc(z)}</option>`).join('')}</select></label>
          <label class="fld full"><span>${t('rv.text')}<em>*</em></span><textarea class="inp" name="text" rows="4" maxlength="800" dir="auto" placeholder="${t('rv.textPh')}"></textarea></label>
          <label class="fld full"><span>${t('rv.phone')}</span><input class="inp" name="phone" type="tel" inputmode="tel" dir="ltr" placeholder="01XXXXXXXXX" maxlength="11"></label>
        </div>
        <p class="err" id="rvErr" hidden></p>
        <button class="btn btn--signal" type="submit">${t('rv.send')} ${arr()}</button>
      </form>
      <div class="rvf-done" id="rvDone" hidden></div>
    </section>`;
  }
  const chartOf = p => (p && p.sizeChart) || (p && p.collection === 'sweatpants' ? 'pants' : 'hoodie');
  function pdpSizeInner() {
    const p = pdp.p; if (!p) return ''; const kind = chartOf(p), g = C().pages.sizeGuide || {};
    return `<div style="display:flex;justify-content:flex-end">${sgUnits()}</div>${sgCard(kind)}${sgTable(kind, pdp.size)}<p class="mono muted" style="margin:0;font-size:.78rem">${esc(L(g, 'note'))} · ${sgState.unit === 'in' ? 'IN' : 'CM'}</p>`;
  }
  function galLbl(i) { const p = pdp.p; if (!p) return ''; return p.sign ? (i === 0 ? t('c.backSide') : i === 1 ? t('c.front') : '') : ''; }
  function galAlt(i) { const { p, v } = pdp; return N.title(p) + ' — ' + N.colourName(v) + (galLbl(i) ? ' — ' + galLbl(i) : ''); }
  function galThumbs(cur) {
    const imgs = pdp.v.images;
    return imgs.map((src, i) => i === cur ? '' : `<button class="gal__t" data-gal="${i}" aria-label="${esc(galLbl(i) || String(i + 1))}"><img src="${esc(src)}" alt="" loading="lazy" width="180" height="240">${galLbl(i) ? `<span>${esc(galLbl(i))}</span>` : ''}</button>`).join('');
  }
  function galShow(i) {
    const img = $('#galImg'), th = $('#galThumbs'); if (!img || !pdp.v || i === pdp.cur) return;
    const src = pdp.v.images[i]; if (!src) return;
    pdp.cur = i;
    img.classList.add('out');
    const pre = new Image();
    pre.onload = pre.onerror = () => setTimeout(() => { img.src = src; img.alt = galAlt(i); requestAnimationFrame(() => img.classList.remove('out')); }, 160);
    pre.src = src;
    const lb = $('#galLbl'); if (lb) lb.textContent = galLbl(i);
    if (th) th.innerHTML = galThumbs(i);
  }
  function mountProduct() {
    const ctas = $('#buyCtas'), sb = $('#stickyBuy');
    if (ctas && sb && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { const on = !e.isIntersecting && e.boundingClientRect.top < 0; sb.classList.toggle('on', on); sb.setAttribute('aria-hidden', on ? 'false' : 'true'); document.body.classList.toggle('sb-on', on); }));
      io.observe(ctas); onceTimers.push(() => { io.disconnect(); document.body.classList.remove('sb-on'); });
    }
    const rf = $('#rvForm');
    if (rf) {
      let stars = 0;
      const paint = k => $$('[data-rvstar]', rf).forEach(b => b.classList.toggle('on', +b.dataset.rvstar <= k));
      $$('[data-rvstar]', rf).forEach(b => { b.addEventListener('click', () => { stars = +b.dataset.rvstar; paint(stars); }); b.addEventListener('mouseenter', () => paint(+b.dataset.rvstar)); b.addEventListener('mouseleave', () => paint(stars)); });
      rf.addEventListener('submit', e => {
        e.preventDefault(); const f = rf.elements, err = $('#rvErr');
        const name = f.name.value.trim(), text = f.text.value.trim(), phone = f.phone.value.replace(/\s/g, '');
        const bad = !stars ? t('rv.errRating') : !name ? t('rv.errName') : text.length < 10 ? t('rv.errText') : (phone && !/^01[0125]\d{8}$/.test(phone)) ? t('k.phoneBad') : '';
        if (bad) { err.textContent = bad; err.hidden = false; return; }
        const r = N.reviews.submit({ id: 'RV-' + N.uid().slice(0, 7), pid: pdp.p.id, color: pdp.v.color, size: f.size.value, name, rating: stars, text, phone, date: Date.now(), lang: N.lang, status: 'pending' });
        try { window.NZ_TRACK && NZ_TRACK.event('review', { id: pdp.p.id }); } catch (x) { }
        rf.hidden = true; const done = $('#rvDone'); done.hidden = false;
        const msg = (N.isAr() ? 'تقييم ' : 'Review · ') + N.title(pdp.p) + ' — ' + '★'.repeat(r.rating) + '\n' + r.text + '\n— ' + r.name;
        done.innerHTML = `<div class="done-card" style="padding:26px"><span class="ok">${icon('check')}</span><b>${t('rv.thanks')}</b>${N.wp ? '' : `<a class="btn btn--line btn--sm" href="${N.wa(msg)}" target="_blank" rel="noopener">${icon('wa')} ${t('rv.waToo')}</a>`}</div>`;
      });
    }
    if (route.q.review) setTimeout(() => { const f = $('#rvForm'); if (f) { f.hidden = false; $('#reviews').scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, 400);
    try { window.NZ_TRACK && NZ_TRACK.event('view_item', { id: pdp.p.id }); } catch (e) { }
  }
  function buy(kind) {
    const { p, v } = pdp;
    if (!pdp.size) {
      const sz = $('#sizes'); if (sz) { sz.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 }); sz.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      toast(t('p.pickSize')); return;
    }
    const ok = N.cart.add(p.id, v.id, pdp.size, 1);
    if (!ok) { toast(t('c.soldOut')); return; }
    try { window.NZ_TRACK && NZ_TRACK.event('add_to_cart', { id: p.id }); } catch (e) { }
    if (kind === 'now') { location.hash = '#/checkout'; return; }
    toast(kind === 'reserve' ? t('p.reserved') : t('p.added'), { action: t('b.checkout'), href: '#/checkout' });
    openDrawer('bag');
  }

  /* ─────────────────────────── DROPS ─────────────────────────── */
  function viewDrops() {
    const d = N.drop(), open = N.dropOpen();
    const list = N.inCollection(d.collection);
    const col = N.collection(d.collection);
    return `<section class="phead phead--img tone-dark grain" style="min-height:70vh"><div class="bg"><img src="${esc((col && col.banner) || N.abs('images/zodiac/zodiac-banner.jpg'))}" alt=""></div>
      <div class="chart-lines" aria-hidden="true"></div>
      <div class="wrap" style="display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:32px;align-items:end" data-dhead>
        <div><div class="crumbs mono"><a href="#/">${t('nav.home')}</a><span>/</span><span>${t('c.drop')}</span></div>
          <h1 class="disp h1">${esc(L(d, 'title'))}</h1><p class="lead" style="margin-top:16px">${esc(L(d, 'text'))}</p></div>
        <div style="display:grid;gap:14px">${d.on ? `<div class="cd-head"><span class="mono">${open ? t('d.opens') : t('d.live')}</span><span class="mono">${esc(N.date(d.date))}</span></div>${open ? cdHTML(N.dropTime()) : ''}${meterHTML()}` : ''}
          <a class="btn btn--signal" href="#/drops" data-scroll="#signs">${t('d.how1')} ${arr()}</a></div>
      </div></section>
      <section class="sec sec--tight tone-dark stars"><div class="wrap"><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)" class="rv" data-steps>
        ${[1, 2, 3].map(i => `<div style="background:var(--bg);padding:clamp(20px,3vw,34px);display:grid;gap:10px"><span class="mono" style="color:var(--signal)">0${i}</span><h3 class="disp h3" style="font-size:clamp(1.2rem,2vw,1.7rem)">${t('d.how' + i, { pct: d.depositPct })}</h3><p class="muted" style="margin:0">${t('d.how' + i + 't')}</p></div>`).join('')}
      </div></div></section>
      <section class="sec tone-light" id="signs"><div class="wrap">${sh(t('c.drop'), L(col || {}, 'title') || t('c.drop'), '12 × 5')}
        <div class="grid">${cards(list).join('')}</div></div></section>
      <section class="sec tone-light" style="padding-top:0"><div class="wrap faq-grid"><div>${sh(t('d.terms'), '', '')}</div>
        <div class="prose"><p>${esc(L(d, 'terms').replace(/\{days\}/g, d.cancelDays))}</p><div class="faq">${faqItems((C().pages.faq || []).slice(0, 2))}</div></div></div></section>`;
  }

  /* ─────────────────────────── CHECKOUT ─────────────────────────── */
  let co = { zone: '', payment: '' };
  function viewCheckout() {
    const T0 = N.cart.totals();
    if (!T0.rows.length) return `<section class="sec tone-light"><div class="wrap"><div class="empty"><div class="big">${glyph('♒')}</div><p>${t('k.empty')}</p><a class="btn" href="#/shop">${t('c.shopNow')} ${arr()}</a></div></div></section>`;
    const pf = N.profile(), s = S(), zones = (s.shipping.zones || []).filter(z => z.on !== false);
    if (!co.zone) co.zone = pf.zone || '';
    const pays = Object.entries(s.payments || {}).filter(([, p]) => p && p.on).filter(([k]) => !(T0.hasPre && k === 'cod'));
    if (!co.payment || !pays.some(([k]) => k === co.payment)) co.payment = pays[0] ? pays[0][0] : '';
    const zone = zones.find(z => z.id === co.zone);
    return `<section class="tone-light"><div class="wrap">
      <div class="crumbs mono" style="padding-top:22px"><a href="#/">${t('nav.home')}</a><span>/</span><span>${t('k.title')}</span></div>
      <div class="co">
        <form id="coForm" novalidate>
          <h1 class="disp h2" style="margin-bottom:22px">${t('k.title')}</h1>
          <div class="steps mono"><span class="on"><b>1</b>${t('k.contact')}</span><i></i><span><b>2</b>${t('k.delivery')}</span><i></i><span><b>3</b>${t('k.payment')}</span></div>
          <div class="co__block"><h2>${t('k.contact')}</h2><div class="fgrid">
            <label class="fld"><span>${t('k.name')}<em>*</em></span><input class="inp" name="name" autocomplete="name" value="${esc(pf.name || '')}" required></label>
            <label class="fld"><span>${t('k.phone')}<em>*</em></span><input class="inp" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="01XXXXXXXXX" value="${esc(pf.phone || '')}" required></label>
            <label class="fld full"><span>${t('k.email')}</span><input class="inp" name="email" type="email" autocomplete="email" dir="ltr" value="${esc(pf.email || '')}"></label>
          </div></div>
          <div class="co__block"><h2>${t('k.delivery')}</h2><p class="muted" style="margin:0">${t('k.onlyAreas')}</p><div class="fgrid">
            <label class="fld"><span>${t('k.gov')}<em>*</em></span><select class="inp" name="zone" required><option value="">${t('k.choose')}</option>${zones.map(z => `<option value="${esc(z.id)}"${co.zone === z.id ? ' selected' : ''}>${esc(LL(z))}</option>`).join('')}</select></label>
            <label class="fld"><span>${t('k.district')}<em>*</em></span><select class="inp" name="district" required><option value="">${t('k.choose')}</option>${zone ? zone.districts.map(x => `<option value="${esc(x.id)}"${pf.district === x.id ? ' selected' : ''}>${esc(LL(x))}</option>`).join('') : ''}</select></label>
            <label class="fld full"><span>${t('k.address')}<em>*</em></span><input class="inp" name="address" autocomplete="street-address" value="${esc(pf.address || '')}" required></label>
            <label class="fld full"><span>${t('k.notes')}</span><input class="inp" name="notes"></label>
          </div></div>
          <div class="co__block"><h2>${t('k.payment')}</h2><div class="opts">${pays.map(([k, p]) => `<label class="opt${co.payment === k ? ' on' : ''}"><input type="radio" name="payment" value="${esc(k)}"${co.payment === k ? ' checked' : ''}><span><b>${esc(LL(p))}</b><small>${esc(payHint(k, p))}</small></span></label>`).join('')}</div>
            ${T0.hasPre ? `<div class="pre-note">${icon('clock')}<span>${esc(L(N.drop(), 'terms').replace(/\{days\}/g, N.drop().cancelDays))}</span></div><label class="check"><input type="checkbox" name="agree" required><span>${t('k.agree')}</span></label>` : ''}
          </div>
          <p class="err" id="coErr" hidden></p>
          <div class="co__block" style="border:0;padding-top:6px"><button class="btn btn--signal btn--block" type="submit" id="coBtn">${placeLabel(N.cart.totals(co.zone))} ${arr()}</button><p class="muted" style="margin:0;text-align:center;font-size:.86rem">${t('k.secure')}</p></div>
        </form>
        <aside class="co__side"><div id="coSide">${coSummary()}</div><div class="co__go"><button class="btn btn--signal btn--block" type="submit" form="coForm" data-cogo>${placeLabel(N.cart.totals(co.zone))} ${arr()}</button></div></aside>
      </div></div>
      <div class="co-bar tone-light" id="coBar">${coBarHTML()}</div></section>`;
  }
  function payHint(k, p) {
    if (k === 'cod') return LL({ en: 'Pay the courier in cash when it arrives.', ar: 'ادفع كاش للمندوب وقت الاستلام.' });
    if (k === 'instapay') return LL({ en: 'Transfer to ', ar: 'حوّل على ' }) + (p.handle || '');
    if (k === 'vodafone') return LL({ en: 'Send to ', ar: 'ابعت على ' }) + (p.number || '');
    return '';
  }
  function placeLabel(T) { return T.hasPre ? t('k.placeDeposit', { amount: money(T.dueNow) }) : t('k.place'); }
  function coSummary() {
    const T = N.cart.totals(co.zone);
    return `<div class="drawer__h" style="min-height:0;padding:16px 18px"><b>${t('k.summary')}</b><span class="mono muted">${T.count} ${T.count === 1 ? t('c.item') : t('c.items')}</span></div>
      ${T.rows.map(r => `<div class="mini"><div class="mini__img"><img src="${esc(r.v.images[0])}" alt=""><i>${r.l.qty}</i></div><div><b style="font-size:.92rem">${esc(N.title(r.p))}</b><div class="muted" style="font-size:.82rem">${esc(N.colourName(r.v))} · ${esc(r.l.size)}${r.l.pre ? ' · ' + t('c.preorder') : ''}</div></div><span class="mono num" style="font-size:.85rem">${money(r.lineNow)}</span></div>`).join('')}
      <div class="sum">
        ${promoHTML()}
        <div class="sum__r"><span>${t('b.subtotal')}</span><b class="num">${money(T.full)}</b></div>
        ${T.discount ? `<div class="sum__r"><span>${t('b.discount')} · ${esc(T.promo.code)}</span><b class="num">−${money(T.discount)}</b></div>` : ''}
        <div class="sum__r"><span>${t('b.delivery')}</span><b class="num">${T.delivery == null ? `<span class="muted" style="font-family:var(--f-body);font-weight:400">${t('b.calcLater')}</span>` : T.delivery === 0 ? t('b.freeShip') : money(T.delivery)}</b></div>
        <div class="sum__r big"><span>${t('b.total')}</span><b class="num">${money(T.total)}</b></div>
        ${T.hasPre ? `<div class="sum__r hl"><span>${t('b.dueNow')}</span><b class="num">${money(T.dueNow)}</b></div><div class="sum__r"><span>${t('b.balance')}</span><b class="num">${money(T.balance)}</b></div>` : ''}
      </div>`;
  }
  function coBarHTML() { const T = N.cart.totals(co.zone); return `<div style="min-width:0"><span class="mono muted" style="display:block;font-size:.7rem">${T.hasPre ? t('b.dueNow') : t('b.total')}</span><b class="num">${money(T.hasPre ? T.dueNow : T.total)}</b></div><button class="btn btn--signal" type="submit" form="coForm">${T.hasPre ? t('c.preorder') : t('k.place')} ${arr()}</button>`; }
  function refreshCheckout() {
    const s = $('#coSide'); if (s) s.innerHTML = coSummary();
    const lbl = `${placeLabel(N.cart.totals(co.zone))} ${arr()}`;
    const b = $('#coBtn'); if (b) b.innerHTML = lbl; const g = $('[data-cogo]'); if (g) g.innerHTML = lbl;
    const bar = $('#coBar'); if (bar) bar.innerHTML = coBarHTML();
  }
  function mountCheckout() {
    const btn = $('#coBtn'), bar = $('#coBar');
    if (btn && bar && 'IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => bar.classList.toggle('off', e.isIntersecting))); io.observe(btn); onceTimers.push(() => io.disconnect()); }
  }
  function submitCheckout(form) {
    const f = form.elements, err = $('#coErr');
    const val = n => (f[n] && f[n].value || '').trim();
    let bad = [];
    ['name', 'phone', 'zone', 'district', 'address'].forEach(n => { if (!val(n)) bad.push(n); });
    let phone = val('phone').replace(/[\s-]/g, '').replace(/^\+?20/, '0');
    if (phone && !/^01[0125]\d{8}$/.test(phone)) bad.push('phone');
    if (f.agree && !f.agree.checked) bad.push('agree');
    $$('.inp', form).forEach(i => i.classList.toggle('bad', bad.indexOf(i.name) > -1));
    if (bad.length) { err.hidden = false; err.textContent = bad.indexOf('phone') > -1 && val('phone') ? t('k.phoneBad') : t('k.required'); err.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const pay = (form.querySelector('input[name="payment"]:checked') || {}).value || co.payment;
    const o = N.orders.create({ name: val('name'), phone, email: val('email'), zone: val('zone'), district: val('district'), address: val('address'), notes: val('notes'), payment: pay });
    if (o) location.hash = '#/order/' + o.id;
  }

  /* ─────────────────────────── ORDER CONFIRMATION ─────────────────────────── */
  const STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];
  function orderText(o) {
    const s = S(), z = (s.shipping.zones || []).find(x => x.id === o.address.zone) || {}, dd = (z.districts || []).find(x => x.id === o.address.district) || {};
    const ar = N.isAr();
    const lines = o.items.map(i => `• ${ar ? i.title_ar : i.title_en} — ${ar ? i.color_ar : i.color_en} / ${i.size} × ${i.qty}${i.pre ? (ar ? ' (حجز)' : ' (pre-order)') : ''}`).join('\n');
    return (ar ? `أهلاً نسيج 👋\nطلب رقم ${o.id}\n` : `Hi NASIJ 👋\nOrder ${o.id}\n`) + lines + '\n' +
      (ar ? `الإجمالي: ${money(o.totals.total)}\nالمطلوب دلوقتي: ${money(o.totals.dueNow)}\n` : `Total: ${money(o.totals.total)}\nDue now: ${money(o.totals.dueNow)}\n`) +
      `${o.customer.name} · ${o.customer.phone}\n${LL(z)} — ${LL(dd)}\n${o.address.line}`;
  }
  function viewOrder(id) {
    const o = N.orders.get(id);
    if (!o) return `<section class="sec tone-light"><div class="wrap"><div class="empty"><p>${t('o.notFound')}</p><a class="btn" href="#/">${t('nav.home')}</a></div></div></section>`;
    const ar = N.isAr(), s = S(), pay = (s.payments || {})[o.payment] || {};
    const cur = o.status === 'reserved' ? 0 : STEPS.indexOf(o.status);
    const needTransfer = o.payment !== 'cod' && o.totals.dueNow > 0;
    return `<section class="tone-light"><div class="wrap ok-wrap">
      <div style="display:grid;gap:22px;align-content:start">
        <span class="mono kick kick--ink">${esc(o.id)}</span>
        <h1 class="disp h2">${esc(t('o.thanks', { name: o.customer.name.split(' ')[0] }))}</h1>
        <p class="lead" style="margin:0">${esc(t('o.placed', { id: o.id }))}</p>
        ${needTransfer ? `<div class="pre-note" style="display:grid;gap:6px"><b>${esc(t('o.payNow', { amount: money(o.totals.dueNow), method: LL(pay) }))}</b><span class="num" dir="ltr" style="justify-self:start;font-family:var(--f-mono)">${esc(pay.handle || pay.number || '')}</span><span>${t('o.payHint')}</span></div>` : ''}
        <div><h3 class="mono" style="margin:0 0 6px">${t('o.next')}</h3><div class="track">
          ${[['o.step1'], ['o.step2'], ['o.step3']].map(([k], i) => `<div class="track__s${i <= cur ? ' on' : ''}"><i>${i + 1}</i><div style="padding-top:4px">${t(k)}</div></div>`).join('')}</div></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn--signal" href="${N.wa(orderText(o))}" target="_blank" rel="noopener">${icon('wa')} ${t('o.sendWa')}</a><a class="btn btn--line" href="#/shop">${t('c.continue')}</a></div>
      </div>
      <div class="receipt" aria-label="receipt">
        <span class="stamp">${t('o.st.' + o.status)}</span>
        <div style="display:flex;align-items:center;gap:10px"><img src="${esc(N.abs('images/logo-en.png'))}" alt="NASIJ" style="height:22px;width:auto"><span class="muted" style="font-size:.72rem">${esc(N.date(o.date, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }))}</span></div>
        <hr>
        ${o.items.map(i => `<div class="r"><span>${esc(ar ? i.title_ar : i.title_en)}<br><small class="muted">${esc(ar ? i.color_ar : i.color_en)} · ${esc(i.size)} × ${i.qty}${i.pre ? ' · ' + t('c.preorder') : ''}</small></span><b class="num">${money(i.price * i.qty)}</b></div>`).join('')}
        <hr>
        <div class="r"><span>${t('b.subtotal')}</span><span class="num">${money(o.totals.subtotal)}</span></div>
        ${o.totals.discount ? `<div class="r"><span>${t('b.discount')} ${esc(o.promo)}</span><span class="num">−${money(o.totals.discount)}</span></div>` : ''}
        <div class="r"><span>${t('b.delivery')}</span><span class="num">${o.totals.delivery ? money(o.totals.delivery) : t('b.freeShip')}</span></div>
        <div class="r big"><span>${t('b.total')}</span><span class="num">${money(o.totals.total)}</span></div>
        ${o.preorder ? `<div class="r"><span>${t('b.dueNow')}</span><b class="num">${money(o.totals.dueNow)}</b></div><div class="r"><span>${t('b.balance')}</span><span class="num">${money(o.totals.balance)}</span></div>` : ''}
        <hr><div class="r"><span>${t('k.payment')}</span><span>${esc(LL(pay))}</span></div>
        <div class="barcode" aria-hidden="true"></div><div style="text-align:center;margin-top:6px;letter-spacing:.3em" class="num">${esc(o.id)}</div>
      </div></div></section>`;
  }

  /* ─────────────────────────── ACCOUNT ─────────────────────────── */
  function viewSaved() {
    const ws = N.wish.list().map(id => N.product(id)).filter(p => p && p.status === 'active');
    return `<section class="phead tone-light"><div class="wrap"><div class="crumbs mono"><a href="#/">${t('nav.home')}</a><span>/</span><span>${t('nav.saved')}</span></div><h1 class="disp h1" style="margin-top:10px">${t('a.saved')}</h1></div></section>
      <section class="sec sec--tight tone-light"><div class="wrap">
        ${ws.length ? `<div class="grid">${ws.map((p, i) => card(p, { i })).join('')}</div>` : `<div class="empty"><div class="big">${glyph('♡')}</div><p>${t('a.noSaved')}</p><a class="btn" href="#/shop">${t('c.shopNow')} ${arr()}</a></div>`}
      </div></section>`;
  }

  /* ─────────────────────────── CUSTOM REQUEST ─────────────────────────── */
  let creq = { files: [], mat: -1 };
  function viewCustom() {
    const pg = C().pages.custom;
    creq = { files: [], mat: -1 };
    return `<section class="phead tone-dark stars grain" style="padding-block:clamp(64px,9vw,130px) clamp(40px,5vw,70px)"><div class="chart-lines" aria-hidden="true"></div><div class="wrap" style="position:relative;z-index:2">
        <span class="mono kick">${esc(LL({ en: 'Custom & bulk', ar: 'تخصيص وجملة' }))}</span><h1 class="disp h1" style="margin:14px 0 16px">${esc(L(pg, 'title'))}</h1><p class="lead">${esc(L(pg, 'text'))}</p></div></section>
      <section class="sec sec--tight tone-light"><div class="wrap">
        <form class="creq" id="creqForm" novalidate>
          <div class="creq__b"><div class="creq__n"><b>01</b><span class="mono">${t('r.ref')}</span></div>
            <label class="drop-zone" id="dz"><input type="file" accept="image/*" multiple hidden id="creqFile">${icon('upload')}<b>${t('r.upload')}</b><span class="muted" style="font-size:.85rem">${t('r.uploadHint')}</span></label>
            <div class="thumbs" id="thumbs"></div></div>
          <div class="creq__b"><div class="creq__n"><b>02</b><span class="mono">${t('r.size')}</span></div><div class="fgrid" style="grid-template-columns:repeat(3,minmax(0,1fr))">
            <label class="fld"><span>${t('r.w')}<em>*</em></span><input class="inp" name="w" type="number" min="1" max="200" step="0.5" placeholder="30" dir="ltr"></label>
            <label class="fld"><span>${t('r.h')}<em>*</em></span><input class="inp" name="h" type="number" min="1" max="200" step="0.5" placeholder="40" dir="ltr"></label>
            <label class="fld"><span>${t('r.qty')}</span><input class="inp" name="qty" type="number" min="1" max="5000" value="1" dir="ltr"></label></div></div>
          <div class="creq__b"><div class="creq__n"><b>03</b><span class="mono">${t('r.fabric')}</span></div>
            <div class="chips" style="flex-wrap:wrap" id="mats">${(pg.materials || []).map((m, i) => `<button type="button" class="chip" data-mat="${i}">${esc(LL(m))}</button>`).join('')}</div>
            <label class="fld"><span>${t('r.other')}</span><input class="inp" name="matOther"></label></div>
          <div class="creq__b"><div class="creq__n"><b>04</b><span class="mono">${t('r.reach')}</span></div><div class="fgrid">
            <label class="fld"><span>${t('k.name')}<em>*</em></span><input class="inp" name="name" autocomplete="name" value="${esc(N.profile().name || '')}"></label>
            <label class="fld"><span>${t('k.phone')}<em>*</em></span><input class="inp" name="phone" type="tel" dir="ltr" placeholder="01XXXXXXXXX" value="${esc(N.profile().phone || '')}"></label>
            <label class="fld full"><span>${t('r.alt')}</span><input class="inp" name="alt" dir="ltr" placeholder="@handle / you@email.com"></label>
            <label class="fld full"><span>${t('r.notes')}</span><textarea class="inp" name="notes" rows="3"></textarea></label></div></div>
          <p class="err" id="creqErr" hidden></p>
          <button class="btn btn--signal btn--block" type="submit">${t('r.send')} ${arr()}</button>
          <p class="muted" style="text-align:center;margin:0;font-size:.88rem">${t('r.fine')}</p>
        </form>
        <div class="creq" id="creqDone" hidden></div>
      </div></section>`;
  }
  function shrink(file) {
    return new Promise(res => {
      const fr = new FileReader();
      fr.onload = () => { const im = new Image(); im.onload = () => { const s = Math.min(1, 1000 / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); try { res(c.toDataURL('image/jpeg', .72)); } catch (e) { res(fr.result); } }; im.onerror = () => res(''); im.src = fr.result; };
      fr.onerror = () => res(''); fr.readAsDataURL(file);
    });
  }
  function mountCustom() {
    const fi = $('#creqFile'), dz = $('#dz'); if (!fi) return;
    const add = async files => {
      for (const f of Array.from(files || []).filter(x => /^image\//.test(x.type))) {
        if (creq.files.length >= 4) { toast(t('r.max')); break; }
        const u = await shrink(f); if (u) creq.files.push(u);
      }
      $('#thumbs').innerHTML = creq.files.map((u, i) => `<div class="thumb"><img src="${u}" alt=""><button type="button" data-rmimg="${i}" aria-label="${t('c.remove')}">✕</button></div>`).join('');
    };
    fi.addEventListener('change', () => { add(fi.files); fi.value = ''; });
    ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('over'); }));
    dz.addEventListener('drop', e => add(e.dataTransfer.files));
    $('#thumbs').addEventListener('click', e => { const b = e.target.closest('[data-rmimg]'); if (!b) return; creq.files.splice(+b.dataset.rmimg, 1); add([]); });
    $('#mats').addEventListener('click', e => { const b = e.target.closest('[data-mat]'); if (!b) return; creq.mat = creq.mat === +b.dataset.mat ? -1 : +b.dataset.mat; $$('#mats .chip').forEach(c => c.classList.toggle('on', +c.dataset.mat === creq.mat)); });
    $('#creqForm').addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target.elements, v = n => (f[n].value || '').trim(), err = $('#creqErr');
      const w = parseFloat(v('w')), h = parseFloat(v('h')), phone = v('phone').replace(/[\s-]/g, '').replace(/^\+?20/, '0');
      let msg = '';
      if (!(w > 0) || !(h > 0)) msg = t('r.errSize'); else if (!v('name')) msg = t('r.errName'); else if (!/^01[0125]\d{8}$/.test(phone)) msg = t('k.phoneBad');
      $$('.inp', e.target).forEach(i => i.classList.remove('bad'));
      if (msg) { err.hidden = false; err.textContent = msg; if (!(w > 0)) f.w.classList.add('bad'); if (!(h > 0)) f.h.classList.add('bad'); return; }
      err.hidden = true;
      const mats = C().pages.custom.materials || [];
      const r = N.requests.add({ id: 'CR-' + N.uid().slice(0, 6), date: Date.now(), status: 'new', name: v('name'), phone, alt: v('alt'), width: w, height: h, qty: Math.max(1, parseInt(v('qty'), 10) || 1), material: creq.mat > -1 ? (mats[creq.mat] || {}).en : '', materialOther: v('matOther'), notes: v('notes'), images: creq.files.slice(), lang: N.lang });
      try { window.NZ_TRACK && NZ_TRACK.event('custom_request', { id: r.id }); } catch (e2) { }
      const pg = C().pages.custom;
      $('#creqForm').hidden = true;
      const done = $('#creqDone'); done.hidden = false;
      done.innerHTML = `<div class="done-card"><div class="ok">${icon('check')}</div><h2 class="disp h2">${t('r.done')}</h2><p class="lead" style="margin:0 auto">${esc(L(pg, 'done'))}</p><span class="code" style="font-size:.9rem">${esc(t('r.no', { id: r.id }))}</span>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn" href="${N.wa((N.isAr() ? 'طلب تخصيص رقم ' : 'Custom request ') + r.id)}" target="_blank" rel="noopener">${icon('wa')} ${t('c.whatsapp')}</a><a class="btn btn--line" href="#/custom" data-reload>${t('r.again')}</a></div></div>`;
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ─────────────────────────── INFO PAGES ─────────────────────────── */
  function simpleHead(title, kick) { return `<section class="phead tone-light"><div class="wrap"><div class="crumbs mono"><a href="#/">${t('nav.home')}</a><span>/</span><span>${esc(title)}</span></div>${kick ? `<span class="mono kick kick--ink">${esc(kick)}</span>` : ''}<h1 class="disp h1" style="margin-top:10px">${esc(title)}</h1></div></section>`; }
  function viewFaq() { return simpleHead(t('m.faq')) + `<section class="sec sec--tight tone-light"><div class="wrap"><div class="faq" style="max-width:900px">${faqItems(C().pages.faq || [])}</div></div></section>`; }
  let sgState = { g: 'hoodie', unit: 'cm' };
  function viewSizeGuide() {
    return simpleHead(t('m.sizeGuide')) + `<section class="sec sec--tight tone-light"><div class="wrap sg" id="sg">${sgInner()}</div></section>`;
  }
  const SG_DEFS = '<defs><linearGradient id="sgGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="400"><stop offset="0" style="stop-color:var(--g1)"/><stop offset=".5" style="stop-color:var(--g2)"/><stop offset="1" style="stop-color:var(--g3)"/></linearGradient></defs>';
  function sgMark(x1, y1, x2, y2, k, lx, ly) {
    return `<line class="m" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><circle class="mk" cx="${x1}" cy="${y1}" r="3.2"/><circle class="mk" cx="${x2}" cy="${y2}" r="3.2"/><circle class="mc" cx="${lx}" cy="${ly}" r="13"/><text class="mt" x="${lx}" y="${ly + 4.5}" text-anchor="middle">${k}</text>`;
  }
  function hoodieSVG() {
    return `<svg viewBox="0 0 400 400" role="img" aria-label="hoodie measurements">${SG_DEFS}
      <path class="garm" d="M144 100 C136 52 166 16 200 16 C234 16 264 52 256 100 Z"/>
      <path class="garm" d="M160 76 L108 96 C92 102 82 118 78 140 L46 296 L46 322 L84 322 L86 298 L128 172 L128 330 L128 352 L272 352 L272 330 L272 172 L314 298 L316 322 L354 322 L354 296 L322 140 C318 118 308 102 292 96 L240 76 Q200 108 160 76 Z"/>
      <path class="seam" d="M128 330 L272 330 M46 298 L86 300 M314 300 L354 298 M108 96 L128 172 M292 96 L272 172"/>
      <path class="seam" d="M150 262 L250 262 L266 320 L134 320 Z"/>
      <path class="garm garm--in" d="M166 90 C168 56 184 38 200 38 C216 38 232 56 234 90 Q200 116 166 90 Z"/>
      <path class="seam" d="M186 100 L184 146 M214 100 L216 146"/>
      ${sgMark(128, 190, 272, 190, 'A', 200, 190)}
      ${sgMark(236, 86, 236, 352, 'B', 236, 236)}
      ${sgMark(100, 88, 36, 318, 'C', 60, 212)}
    </svg>`;
  }
  function pantsSVG() {
    return `<svg viewBox="0 0 400 410" role="img" aria-label="sweatpants measurements">${SG_DEFS}
      <path class="garm" d="M120 40 L280 40 L280 64 L302 372 L210 372 L200 178 L190 372 L98 372 L120 64 Z"/>
      <path class="seam" d="M120 64 L280 64 M200 64 L200 178 M140 70 C150 96 160 110 172 118 M260 70 C250 96 240 110 228 118 M100 350 L190 350 M210 350 L300 350"/>
      <path class="seam" d="M196 40 L192 88 M204 40 L208 88"/>
      ${sgMark(120, 22, 280, 22, 'A', 200, 22)}
      ${sgMark(296, 40, 320, 372, 'B', 308, 206)}
      ${sgMark(192, 186, 186, 364, 'C', 176, 282)}
      ${sgMark(98, 392, 190, 392, 'D', 144, 392)}
    </svg>`;
  }
  function sgCols(kind) {
    return kind === 'pants'
      ? [['waist', 'A', { en: 'Waist', ar: 'الوسط' }, { en: 'Relaxed waistband, edge to edge.', ar: 'الأستك من الطرف للطرف من غير شد.' }],
         ['length', 'B', { en: 'Length', ar: 'الطول' }, { en: 'Waistband to hem, along the side.', ar: 'من الوسط لآخر الرجل من الجنب.' }],
         ['inseam', 'C', { en: 'Inseam', ar: 'الطول الداخلي' }, { en: 'Crotch seam to hem.', ar: 'من الخياطة الداخلية لآخر الرجل.' }],
         ['hem', 'D', { en: 'Leg opening', ar: 'فتحة الرجل' }, { en: 'Hem width, laid flat.', ar: 'عرض آخر الرجل والقطعة مفرودة.' }]]
      : [['chest', 'A', { en: 'Chest', ar: 'الصدر' }, { en: 'Armpit to armpit, laid flat.', ar: 'من تحت الإبط للإبط والقطعة مفرودة.' }],
         ['length', 'B', { en: 'Length', ar: 'الطول' }, { en: 'Highest point of the shoulder to the hem.', ar: 'من أعلى نقطة في الكتف لآخر القطعة.' }],
         ['sleeve', 'C', { en: 'Sleeve', ar: 'الكم' }, { en: 'Shoulder seam to the end of the cuff.', ar: 'من خياطة الكتف لآخر الأستك.' }]];
  }
  function sgUnits() { const inch = sgState.unit === 'in'; return `<div class="sg__units" role="group" aria-label="units"><button type="button" data-sgu="cm" class="${!inch ? 'on' : ''}">CM</button><button type="button" data-sgu="in" class="${inch ? 'on' : ''}">IN</button></div>`; }
  function sgCard(kind) {
    const g = C().pages.sizeGuide || {}, cols = sgCols(kind);
    return `<div class="sg__card"><div class="sg__art">${kind === 'pants' ? pantsSVG() : hoodieSVG()}</div>
      <div style="display:grid;gap:20px"><p class="lead" style="margin:0;max-width:none">${esc(L(g, 'text'))}</p>
        <ul class="sg__legend">${cols.map(c => `<li><b class="k">${c[1]}</b><span><strong>${esc(LL(c[2]))}</strong>${esc(LL(c[3]))}</span></li>`).join('')}</ul></div></div>`;
  }
  function sgTable(kind, hl) {
    const g = C().pages.sizeGuide || {}, rows = kind === 'pants' ? (g.pants || []) : (g.rows || []), cols = sgCols(kind), inch = sgState.unit === 'in';
    const cv = v => { const x = parseFloat(v); if (isNaN(x)) return esc(v || '—'); return inch ? (x / 2.54).toFixed(1) : String(x); };
    if (!rows.length) return '';
    return `<div class="sg__tbl"><table><thead><tr><th>${t('c.size')}</th>${cols.map(c => `<th><span class="k">${c[1]}</span>${esc(LL(c[2]))}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr data-szrow="${esc(r.size)}" class="${hl && hl === r.size ? 'on' : ''}"><td>${esc(r.size)}${hl && hl === r.size ? '' : ''}</td>${cols.map(c => `<td>${cv(r[c[0]])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function sgInner() {
    const g = C().pages.sizeGuide || {}, hood = sgState.g === 'hoodie', kind = hood ? 'hoodie' : 'pants';
    return `<div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">
        <div class="sg__tabs" role="tablist"><button type="button" role="tab" aria-selected="${hood}" data-sg="hoodie" class="${hood ? 'on' : ''}">${esc(LL({ en: 'Hoodies', ar: 'الهوديز' }))}</button><button type="button" role="tab" aria-selected="${!hood}" data-sg="pants" class="${!hood ? 'on' : ''}">${esc(LL({ en: 'Sweatpants', ar: 'البناطيل' }))}</button></div>
        ${sgUnits()}
      </div>
      ${sgCard(kind)}
      ${sgTable(kind)}
      <p class="mono muted" style="margin:0;font-size:.78rem">${esc(L(g, 'note'))} · ${sgState.unit === 'in' ? 'IN' : 'CM'}</p>
      <div class="sg__tips">
        <div><b>${esc(LL({ en: 'Relaxed fit', ar: 'قصّة واسعة' }))}</b><span>${esc(LL({ en: 'Your usual size gives the oversized, dropped-shoulder look.', ar: 'مقاسك المعتاد بيدّي الوك الأوفرسايز بالكتف النازل.' }))}</span></div>
        <div><b>${esc(LL({ en: 'Closer fit', ar: 'قصّة أضيق' }))}</b><span>${esc(LL({ en: 'One size down if you like it less boxy.', ar: 'مقاس أصغر لو بتحب القطعة أقل وسع.' }))}</span></div>
        <div><b>${esc(LL({ en: 'Still unsure?', ar: 'لسه محتار؟' }))}</b><span><a class="link" href="${N.wa(LL({ en: 'Hi NASIJ, I need help with my size.', ar: 'أهلاً نسيج، محتاج مساعدة في المقاس.' }))}" target="_blank" rel="noopener">WhatsApp</a> — ${esc(LL({ en: 'send us your height and weight.', ar: 'ابعتلنا الطول والوزن.' }))}</span></div>
      </div>`;
  }
  function viewPolicy(id) {
    const ps = C().pages.policies || [], p = ps.find(x => x.id === id) || ps[0];
    if (!p) return view404();
    return simpleHead(L(p, 'title')) + `<section class="tone-light"><div class="wrap pol"><nav>${ps.map(x => `<a href="#/policies/${esc(x.id)}" class="${x.id === p.id ? 'on' : ''}">${esc(L(x, 'title'))}</a>`).join('')}</nav><article class="prose">${L(p, 'body')}</article></div></section>`;
  }
  function viewJournal() {
    const js = (C().journal || []).filter(a => a.status !== 'draft');
    return simpleHead(t('m.journal')) + `<section class="sec sec--tight tone-light"><div class="wrap"><div class="grid" style="--cols:3">${js.map((a, i) => `<a class="jcard rv" style="--d:${(i % 3) * .06}s" href="#/journal/${esc(a.id)}"><div class="jcard__img"><img src="${esc(a.image)}" alt="" loading="lazy"></div><span class="mono muted">${esc(L(a, 'cat'))} · ${esc(a.date)}</span><h3>${esc(L(a, 'title'))}</h3><p class="muted" style="margin:0">${esc(L(a, 'excerpt'))}</p></a>`).join('')}</div></div></section>`;
  }
  function viewArticle(id) {
    const a = (C().journal || []).find(x => x.id === id);
    if (!a) return view404();
    return `<section class="phead phead--img tone-dark"><div class="bg"><img src="${esc(a.image)}" alt=""></div><div class="wrap"><div class="crumbs mono"><a href="#/journal">${t('m.journal')}</a><span>/</span><span>${esc(L(a, 'cat'))}</span></div><h1 class="disp h2" style="max-width:22ch">${esc(L(a, 'title'))}</h1></div></section>
      <section class="sec sec--tight tone-light"><div class="wrap"><article class="prose" style="margin-inline:auto">${L(a, 'body')}</article><div style="text-align:center;margin-top:40px"><a class="btn" href="#/shop">${t('c.shopNow')} ${arr()}</a></div></div></section>`;
  }
  function view404(msg) {
    return `<section class="sec tone-dark stars grain" style="min-height:70vh;display:grid;place-items:center;text-align:center"><div class="wrap" style="display:grid;gap:18px;justify-items:center">
      <div class="disp" style="font-size:clamp(5rem,20vw,14rem);-webkit-text-stroke:1px var(--fg);color:transparent;line-height:.8">404</div>
      <h1 class="disp h3">${t('m.404')}</h1><p class="muted">${esc(msg || t('m.404t'))}</p><a class="btn btn--signal" href="#/">${t('nav.home')} ${arr()}</a></div></section>`;
  }

  /* ─────────────────────────── router ─────────────────────────── */
  const ROUTES = [
    [/^\/$/, () => viewHome(), 'home'],
    [/^\/shop$/, () => viewListing(null), 'shop'],
    [/^\/collections\/([\w-]+)$/, m => viewListing(m[1]), 'collection'],
    [/^\/products\/([\w-]+)$/, m => viewProduct(m[1]), 'product'],
    [/^\/drops$/, () => viewDrops(), 'drops'],
    [/^\/checkout$/, () => viewCheckout(), 'checkout'],
    [/^\/cart$/, () => { setTimeout(() => openDrawer('bag'), 50); return viewHome(); }, 'home'],
    [/^\/order\/([\w-]+)$/, m => viewOrder(m[1]), 'order'],
    [/^\/(saved|account|wishlist)$/, () => viewSaved(), 'saved'],
    [/^\/custom$/, () => viewCustom(), 'custom'],
    [/^\/faq$/, () => viewFaq(), 'faq'],
    [/^\/size-guide$/, () => viewSizeGuide(), 'size'],
    [/^\/policies\/([\w-]+)$/, m => viewPolicy(m[1]), 'policy'],
    [/^\/journal$/, () => viewJournal(), 'journal'],
    [/^\/journal\/([\w-]+)$/, m => viewArticle(m[1]), 'article'],
    [/^\/search$/, () => { setTimeout(() => openDrawer('search'), 50); return viewListing(null); }, 'shop']
  ];
  function parse() {
    let h = decodeURIComponent(location.hash.replace(/^#/, '')) || '/';
    if (h[0] !== '/') h = '/' + h;
    const [path, qs] = h.split('?');
    const q = {}; new URLSearchParams(qs || '').forEach((v, k) => { q[k] = v; });
    return { path: path.replace(/\/+$/, '') || '/', q };
  }
  let lastPath = null, io = null;
  function render(keepScroll) {
    const r = parse(); route = r;
    let name = '404', html = null;
    for (const [re, fn, nm] of ROUTES) { const m = r.path.match(re); if (m) { html = fn(m); name = nm; break; } }
    if (html == null) html = view404();
    onceTimers.splice(0).forEach(f => { try { f(); } catch (e) { } });
    document.body.classList.toggle('is-home', name === 'home');
    document.body.dataset.route = name;
    const main = $('#main'); main.innerHTML = html;
    const samePath = lastPath === r.path; lastPath = r.path;
    if (!keepScroll && !samePath) window.scrollTo(0, 0);
    // tabbar state
    $$('.tabbar a').forEach(a => a.classList.toggle('on', a.dataset.tab === r.path || (a.dataset.tab === '/shop' && /^\/(shop|collections|products)/.test(r.path))));
    $$('.hdr__nav a').forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === '#' + r.path));
    if (name === 'home') mountDial();
    if (name === 'product') mountProduct();
    if (name === 'custom') mountCustom();
    if (name === 'checkout') mountCheckout();
    reveal(); headerState(); tick(); seo(name);
    try { window.NZ_TRACK && NZ_TRACK.page(r.path, name); } catch (e) { }
    if (name === 'checkout') try { window.NZ_TRACK && NZ_TRACK.event('begin_checkout', {}); } catch (e) { }
  }
  function seo(name) {
    const s = S(); let title = L(s, 'seo_title'), desc = L(s, 'seo_desc');
    const setT = x => { title = x + ' — ' + L(s, 'name'); };
    if (name === 'product' && pdp.p) { setT(N.title(pdp.p)); desc = L(pdp.p, 'desc').slice(0, 160); }
    else if (name === 'collection') { const c = N.collection(route.path.split('/')[2]); if (c) { setT(L(c, 'title')); desc = L(c, 'desc') || desc; } }
    else if (name === 'drops') setT(L(N.drop(), 'title'));
    else if (name === 'shop') setT(t('l.shopAll'));
    else if (name === 'custom') setT(LL({ en: 'Custom & bulk', ar: 'تخصيص وجملة' }));
    else if (name === 'checkout') setT(t('k.title'));
    else if (name === 'faq') setT(t('m.faq'));
    else if (name === 'journal') setT(t('m.journal'));
    else if (name !== 'home') { const h = $('#main h1'); if (h && h.textContent.trim()) setT(h.textContent.trim().replace(/\s+/g, ' ')); }
    document.title = title;
    const md = $('meta[name="description"]'); if (md) md.content = desc;
  }
  function reveal() {
    if (!('IntersectionObserver' in window)) { $$('.rv').forEach(e => e.classList.add('in')); return; }
    if (io) io.disconnect();
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rv:not(.in)').forEach(e => io.observe(e));
  }
  function headerState() { const h = $('#hdr'); if (!h) return; h.classList.toggle('over', document.body.classList.contains('is-home') && window.scrollY < 40); }

  /* ─────────────────────────── popup / gift ─────────────────────────── */
  function popup(force) {
    const p = S().popup || {};
    if (!p.on || !N.promo.find(p.code)) return;
    const st = N.read(N.LS.popup, {});
    if (!force && (st.seen || st.claimed)) { if (!st.claimed) $('#giftFab').classList.add('on'); return; }
    modal(`<div class="popup"><div class="popup__img tone-dark stars"><img src="${esc(N.abs('images/zodiac/scorpio-black-back.jpg'))}" alt=""></div><div class="popup__b"><span class="mono kick kick--ink">${esc(L(S(), 'name'))}</span>
      <h2 class="disp h3" style="font-size:clamp(1.6rem,3vw,2.2rem)">${esc(L(p, 'title'))}</h2><p class="muted" style="margin:0">${esc(L(p, 'text'))}</p>
      <button class="code" data-copy="${esc(p.code)}">${esc(p.code)} ${icon('copy')}</button>
      <button class="btn btn--signal" data-claim="${esc(p.code)}">${t('m.useCode')} ${arr()}</button></div></div>`);
    $('#modal')._onClose = () => { const s2 = N.read(N.LS.popup, {}); s2.seen = 1; N.write(N.LS.popup, s2); if (!s2.claimed) $('#giftFab').classList.add('on'); };
  }

  /* ─────────────────────────── events ─────────────────────────── */
  function bind() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a, button, [data-open], [data-close]');
      if (!a) return;
      if (a.hasAttribute('data-open')) { e.preventDefault(); openDrawer(a.dataset.open); return; }
      if (a.hasAttribute('data-close')) { closeDrawer(); if (a.tagName !== 'A') return; }
      if (a.hasAttribute('data-close-modal')) { closeModal(); return; }
      if (a.hasAttribute('data-lang')) { N.setLang(N.isAr() ? 'en' : 'ar'); boot2(); return; }
      if (a.hasAttribute('data-mode')) { N.write(N.LS.mode, mode() === 'dark' ? 'light' : 'dark'); applyMode(); shell(); render(true); return; }
      if (a.hasAttribute('data-exit-preview')) { try { localStorage.removeItem(N.LS.preview); } catch (x) { } location.reload(); return; }
      if (a.dataset.fav) { e.preventDefault(); const on = N.wish.toggle(a.dataset.fav); $$(`[data-fav="${a.dataset.fav}"]`).forEach(b => { b.classList.toggle('on', on); const sp = b.querySelector('span'); if (sp) sp.textContent = on ? t('p.saved') : t('p.save'); }); toast(on ? t('p.saved') : t('c.remove')); return; }
      if (a.dataset.sw) {
        e.preventDefault(); const c = a.closest('.pc'); const p = N.product(c.dataset.pid), v = p.variants.find(x => x.id === a.dataset.sw); if (!v) return;
        c.dataset.vid = v.id; const im = $$('.pc__media img', c); im[0].src = v.images[0]; if (im[1] && v.images[1]) im[1].src = v.images[1];
        $$('.pc__cover, .pc__t', c).forEach(l => { l.href = `#/products/${p.handle}?c=${encodeURIComponent(v.color)}`; });
        $$('[data-quick]', c).forEach(b => { const parts = b.dataset.quick.split('|'); parts[1] = v.id; b.dataset.quick = parts.join('|'); });
        $$('[data-sw]', c).forEach(b => b.classList.toggle('on', b === a)); return;
      }
      if (a.dataset.quick) {
        e.preventDefault(); const [pid, vid, size] = a.dataset.quick.split('|'); const p = N.product(pid);
        if (N.cart.add(pid, vid, size, 1)) { try { window.NZ_TRACK && NZ_TRACK.event('add_to_cart', { id: pid }); } catch (x) { } toast(N.isPre(p) ? t('p.reserved') : t('p.added'), { action: t('nav.bag'), onAction: () => openDrawer('bag') }); }
        return;
      }
      if (a.dataset.gal != null) { galShow(+a.dataset.gal); return; }
      if (a.hasAttribute('data-copylink')) { copyText(location.href); toast(t('p.linkCopied')); return; }
      if (a.hasAttribute('data-rvopen')) { const f = $('#rvForm'); if (f) { f.hidden = false; $('#rvDone').hidden = true; f.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => { const i = f.querySelector('[name="name"]'); if (i) i.focus({ preventScroll: true }); }, 500); } return; }
      if (a.hasAttribute('data-rvall')) { $$('.rv-more').forEach(x => x.classList.remove('rv-more')); a.remove(); return; }
      if (a.dataset.sg) { sgState.g = a.dataset.sg; const box = $('#sg'); if (box) box.innerHTML = sgInner(); return; }
      if (a.dataset.sgu) { sgState.unit = a.dataset.sgu; const box = $('#sg'); if (box) box.innerHTML = sgInner(); const pb = $('#pdpSg'); if (pb) pb.innerHTML = pdpSizeInner(); return; }
      if (a.dataset.size) { pdp.size = a.dataset.size; $$('[data-size]').forEach(b => b.classList.toggle('on', b.dataset.size === pdp.size)); $$('[data-szrow]').forEach(r => r.classList.toggle('on', r.dataset.szrow === pdp.size)); return; }
      if (a.dataset.buy) { buy(a.dataset.buy); return; }
      if (a.dataset.dialc) { dialSelect(dialState.i, a.dataset.dialc); return; }
      if (a.dataset.scroll) { e.preventDefault(); const el = $(a.dataset.scroll); if (el) el.scrollIntoView({ behavior: 'smooth' }); return; }
      if (a.dataset.copy) { try { navigator.clipboard.writeText(a.dataset.copy); } catch (x) { } toast(t('m.copied')); return; }
      if (a.dataset.claim) { N.promo.set(a.dataset.claim); const s2 = N.read(N.LS.popup, {}); s2.claimed = 1; s2.seen = 1; N.write(N.LS.popup, s2); $('#giftFab').classList.remove('on'); closeModal(); toast(t('b.promoOk') + ' · ' + a.dataset.claim); return; }
      if (a.id === 'giftFab') { popup(true); return; }
      if (a.hasAttribute('data-reload')) { e.preventDefault(); render(); return; }
      const line = a.closest('.line[data-key]');
      if (line && a.dataset.q) { const l = N.cart.lines().find(x => x.key === line.dataset.key); if (l) N.cart.setQty(l.key, l.qty + (+a.dataset.q)); return; }
      if (line && a.hasAttribute('data-rm')) { N.cart.remove(line.dataset.key); return; }
      if (a.dataset.zoom) return;
    });
    document.addEventListener('submit', e => {
      const f = e.target;
      if (f.hasAttribute('data-promo')) {
        e.preventDefault(); const code = (f.code.value || '').trim();
        if (!code) { N.promo.set(null); return; }
        if (N.promo.find(code)) { N.promo.set(code); toast(t('b.promoOk')); } else { toast(t('b.promoBad')); }
        return;
      }
      if (f.id === 'coForm') { e.preventDefault(); submitCheckout(f); }
    });
    document.addEventListener('change', e => {
      const el = e.target;
      if (el.matches('[data-sort]')) { const q = Object.assign({}, route.q, { sort: el.value }); location.hash = '#' + route.path + '?' + new URLSearchParams(q).toString(); return; }
      if (el.form && el.form.id === 'coForm') {
        if (el.name === 'zone') { co.zone = el.value; const z = (S().shipping.zones || []).find(x => x.id === el.value); const ds = el.form.district; ds.innerHTML = `<option value="">${t('k.choose')}</option>` + (z ? z.districts.map(x => `<option value="${esc(x.id)}">${esc(LL(x))}</option>`).join('') : ''); refreshCheckout(); }
        if (el.name === 'payment') { co.payment = el.value; $$('.opt', el.form).forEach(o => o.classList.toggle('on', o.contains(el))); }
      }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); closeModal(); } });
    $('#app').addEventListener('click', e => { if (e.target.id === 'scrim') closeDrawer(); });
    window.addEventListener('hashchange', () => { closeDrawer(); render(); });
    window.addEventListener('scroll', headerState, { passive: true });
    N.on(what => {
      counts();
      if (what === 'cart' || what === 'added') { if ($('#d-bag').classList.contains('on')) renderBag(); if (route.path === '/checkout') { if (!N.cart.lines().length) render(); else refreshCheckout(); } }
    });
    setInterval(tick, 1000);
  }

  /* ─────────────────────────── boot ─────────────────────────── */
  function boot2() { applyLang(); applyTheme(); applyMode(); shell(); render(true); }
  async function boot() {
    await N.load({ abs: true });
    N.initLang();
    boot2(); bind();
    const ld = $('#loader');
    if (ld) setTimeout(() => { ld.classList.add('off'); setTimeout(() => ld.remove(), 900); }, Math.max(0, 1100 - performance.now()));
    const p = S().popup || {};
    if (p.on) setTimeout(() => { if (!$('#modal').classList.contains('on') && !/^\/(checkout|order)/.test(route.path)) popup(); }, (+p.delay || 12) * 1000);
    else if (N.read(N.LS.popup, {}).seen) { /* nothing */ }
  }
  window.NZ_STORE = { render, toast, openDrawer };
  boot();
})();
