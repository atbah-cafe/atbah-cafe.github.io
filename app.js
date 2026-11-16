(() => {
  'use strict';

  const LINKS = {
    map: 'https://maps.app.goo.gl/4b192y152jt2RceVA',
    keeta: 'https://url.mykeeta.com/DDGFLk0z',
    whatsapp: 'https://wa.me/966537474706'
  };
  const EMPTY_TEXT = 'الأصناف تُضاف قريبًا';

  const app = document.getElementById('app');
  const drawer = document.getElementById('drawer');
  const drawerList = document.getElementById('drawerList');
  const backdrop = document.getElementById('backdrop');
  const menuBtn = document.getElementById('menuBtn');
  const searchBtn = document.getElementById('searchBtn');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');

  let sections = [];
  let searchIndex = [];

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  // Normalize Arabic/English text for search
  const norm = (s) => String(s || '')
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, '') // tashkeel + tatweel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

  const sectionItems = (s) => s.groups ? s.groups.flatMap((g) => g.items || []) : (s.items || []);
  const icon = {
    map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-3.8A8 8 0 1 1 8 19z"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>'
  };

  function priceText(p) {
    if (p === null || p === undefined || p === '') return '';
    return `${p} SR`;
  }

  function itemHTML(it, opts = {}) {
    const price = priceText(it.price);
    const img = it.image
      ? `<img src="${esc(it.image)}" alt="${esc(it.name)}" width="300" height="300" loading="lazy" decoding="async">`
      : '';
    return `<li class="item">
      ${img}
      <h3>${esc(it.name)}</h3>
      ${it.nameEn ? `<p class="en">${esc(it.nameEn)}</p>` : ''}
      ${price ? `<p class="price">${esc(price)}</p>` : ''}
      ${it.allergens ? `<p class="allergen">${esc(it.allergens)}</p>` : ''}
      ${opts.from ? `<a class="from" href="#${esc(opts.from.id)}">${esc(opts.from.name)}</a>` : ''}
    </li>`;
  }

  const itemsHTML = (items) => items && items.length
    ? `<ul class="items">${items.map((i) => itemHTML(i)).join('')}</ul>`
    : `<p class="empty">${EMPTY_TEXT}</p>`;

  function nextHTML(next) {
    return `<div class="next"><a class="btn btn-solid" href="#${esc(next.id)}">
      <span>التالي: ${esc(next.name)}</span>${icon.next}</a></div>`;
  }

  /* ---------- views ---------- */
  function renderHome() {
    document.title = 'منيو عتبة | Atbah Menu';
    app.innerHTML = `
      <img class="storefront" src="images/storefront.webp" alt="واجهة مقهى عتبة" width="1200" height="523" fetchpriority="high">
      <div class="actions">
        <a class="btn btn-outline" href="${LINKS.map}" target="_blank" rel="noopener">${icon.map}<span>موقعنا على الخريطة</span></a>
        <div class="btn-row">
          <a class="btn btn-solid" href="${LINKS.keeta}" target="_blank" rel="noopener">${icon.bag}<span>اطلب توصيل عبر كيتا</span></a>
          <a class="btn btn-whatsapp" href="${LINKS.whatsapp}" target="_blank" rel="noopener">${icon.chat}<span>واتساب</span></a>
        </div>
      </div>
      <h2 class="home-title">المنيو</h2>
      <ul class="section-list">
        ${sections.map((s) => `<li><a href="#${esc(s.id)}"><span class="label">${esc(s.name)}<small>${esc(s.nameEn || '')}</small></span></a></li>`).join('')}
      </ul>
      ${sections.length ? nextHTML(sections[0]) : ''}`;
  }

  function renderSection(s) {
    document.title = `${s.name} | منيو عتبة`;
    const idx = sections.indexOf(s);
    const next = sections[(idx + 1) % sections.length];
    let body;
    if (s.groups) {
      body = s.groups.map((g) => `
        <h3 class="group-title">${esc(g.name)}</h3>
        ${itemsHTML(g.items)}`).join('');
    } else {
      body = itemsHTML(s.items);
    }
    app.innerHTML = `
      <h2 class="page-title">${esc(s.name)}</h2>
      ${s.nameEn ? `<p class="page-sub">${esc(s.nameEn)}</p>` : ''}
      ${body}
      ${nextHTML(next)}`;
  }

  function renderSearch(q) {
    const nq = norm(q);
    const words = nq.split(' ').filter(Boolean);
    const results = searchIndex.filter((e) => words.every((w) => e.key.includes(w)));
    app.innerHTML = `
      <p class="search-head">${results.length ? `${results.length} نتيجة لـ «<bdi>${esc(q)}</bdi>»` : `ما لقينا نتائج لـ «<bdi>${esc(q)}</bdi>»`}</p>
      ${results.length ? `<ul class="items">${results.map((r) => itemHTML(r.item, { from: r.section })).join('')}</ul>` : ''}`;
  }

  function renderDrawer(activeId) {
    const links = [{ id: '', name: 'الرئيسية' }, ...sections];
    drawerList.innerHTML = links.map((s) =>
      `<li><a href="#${esc(s.id)}"${s.id === activeId ? ' aria-current="page"' : ''}>${esc(s.name)}</a></li>`
    ).join('');
  }

  /* ---------- router ---------- */
  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    const s = sections.find((x) => x.id === id);
    closeSearch(false);
    if (s) renderSection(s); else renderHome();
    renderDrawer(s ? s.id : '');
    closeDrawer();
    window.scrollTo(0, 0);
  }

  /* ---------- drawer ---------- */
  function openDrawer() {
    backdrop.hidden = false;
    drawer.inert = false;
    drawer.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => { backdrop.classList.add('show'); drawer.classList.add('open'); });
    const cur = drawer.querySelector('[aria-current]') || drawer.querySelector('a');
    if (cur) setTimeout(() => cur.focus({ preventScroll: true }), 50);
  }
  function closeDrawer() {
    if (!drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    drawer.inert = true;
    drawer.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { if (!drawer.classList.contains('open')) backdrop.hidden = true; }, 280);
  }

  /* ---------- search ---------- */
  function openSearch() {
    searchBar.hidden = false;
    searchBtn.setAttribute('aria-expanded', 'true');
    searchInput.focus();
  }
  function closeSearch(restore = true) {
    const hadQuery = searchInput.value.trim() !== '';
    searchBar.hidden = true;
    searchBtn.setAttribute('aria-expanded', 'false');
    searchInput.value = '';
    if (restore && hadQuery) route();
  }

  let t;
  searchInput.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const q = searchInput.value.trim();
      if (q) { renderSearch(q); window.scrollTo(0, 0); }
      else route();
    }, 120);
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchInput.blur();
    if (e.key === 'Escape') closeSearch();
  });

  menuBtn.addEventListener('click', openDrawer);
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  searchBtn.addEventListener('click', openSearch);
  document.getElementById('searchClose').addEventListener('click', () => closeSearch());
  drawerList.addEventListener('click', (e) => {
    // Re-selecting the current page should still close the drawer
    if (e.target.closest('a')) closeDrawer();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
  window.addEventListener('hashchange', route);

  /* ---------- boot ---------- */
  fetch('menu.json', { cache: 'no-cache' })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((data) => {
      sections = data.sections || [];
      searchIndex = sections.flatMap((s) => sectionItems(s).map((item) => ({
        item, section: s, key: norm(`${item.name} ${item.nameEn || ''}`)
      })));
      route();
    })
    .catch(() => {
      app.innerHTML = '<p class="empty">تعذّر تحميل المنيو، حدّث الصفحة من فضلك.</p>';
    });
})();
