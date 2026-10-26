/**
 * subm8 — hub (landing) page
 * Lists each family site with live stats read from its saved data, plus host contact info.
 */
(function () {
  'use strict';
  const SM = window.SM;
  const { icon, esc, fmt, ymNow, monthLabel, contactChannels, loadHost, copyText, t, getLang, toggleLang, toast } = SM;

  const SITES = [
    {
      id: 'youtube', theme: 'youtube', href: 'youtube/index.html', logo: 'play',
      title: 'YouTube Premium Family',
      text: 'Ad-free video and YouTube Music for the family group.',
      textTh: 'ดูวิดีโอไม่มีโฆษณาคั่น และ YouTube Music สำหรับกลุ่มแฟมิลี่',
      defaults: { members: 5, perPerson: 67, total: 399 }
    },
    {
      id: 'apple', theme: 'apple', href: 'apple/index.html', logo: 'cloud',
      title: 'Apple One Family',
      text: 'Apple One with 2 TB iCloud+, shared through Family Sharing.',
      textTh: 'Apple One พร้อม iCloud+ 2 TB แชร์ผ่านระบบ Family Sharing',
      defaults: { members: 5, perPerson: 142, total: 848 }
    }
  ];

  function readStats(s) {
    let data = null;
    try { data = JSON.parse(localStorage.getItem('submate.site.v2.' + s.id)); } catch (e) { /* ignore */ }
    const members = data && Array.isArray(data.members) ? data.members : null;
    const n = members ? members.length : s.defaults.members;
    const plan = data && data.plan ? data.plan : null;
    const total = plan ? plan.totalCost : s.defaults.total;
    let pp = plan ? Number(plan.perPerson) : s.defaults.perPerson;
    if (!(pp > 0)) pp = n + (plan && plan.hostShares ? 1 : 0) ? total / (n + (plan && plan.hostShares ? 1 : 0)) : total;
    const month = ymNow();
    const rec = (data && data.payments && data.payments[month]) || {};
    const paid = members ? members.filter((m) => rec[m.id] && rec[m.id].paid).length : 0;
    return { n, pp, total, paid, outstanding: (n - paid) * pp };
  }

  function card(s) {
    const st = readStats(s);
    const desc = getLang() === 'th' ? s.textTh : s.text;
    return `
    <a class="site-card" data-theme="${s.theme}" href="${s.href}" aria-label="Open ${esc(s.title)}">
      <div class="site-card-top">
        <span class="brand-logo">${icon(s.logo)}</span>
        <div><h2>${esc(s.title)}</h2><p>${esc(desc)}</p></div>
      </div>
      <div class="site-stats">
        <div class="site-stat"><div class="k">${esc(t('tabMembers'))}</div><div class="v">${st.n}</div></div>
        <div class="site-stat"><div class="k">${esc(t('perMember'))}</div><div class="v">${fmt(st.pp)}</div></div>
        <div class="site-stat"><div class="k">${esc(t('outstanding'))}</div><div class="v">${fmt(st.outstanding)}</div></div>
      </div>
      <span class="btn btn-primary btn-block">${esc(t('openDashboard'))} ${icon('arrowR', 'sm')}</span>
    </a>`;
  }

  function contact() {
    const host = loadHost();
    const chans = contactChannels(host).filter((c) => c.value);
    const items = chans.length
      ? chans.map((c) => `
        <div class="contact-item">
          <a class="contact-link" href="${esc(c.href)}" ${c.key === 'phone' || c.key === 'email' ? '' : 'target="_blank" rel="noopener"'}>
            <span class="contact-ic ${c.cls}">${icon(c.icon)}</span>
            <span class="contact-main"><small>${c.label}</small><b>${esc(c.value)}</b></span>
          </a>
          <button class="icon-btn" data-copy="${esc(c.value)}" aria-label="Copy ${c.label}">${icon('copy', 'sm')}</button>
        </div>`).join('')
      : `<div class="contact-note">${icon('plus', 'sm')}<span>${esc(t('noContactDetailsYet'))}</span></div>`;
    return `
    <section class="panel hub-contact" aria-labelledby="contactTitle">
      <div class="panel-head">
        <div><div class="panel-title" id="contactTitle">${esc(t('contactHostTitle'))}</div>
        <div class="panel-desc">${esc(host.name)} · ${esc(host.title)} — ${esc(host.hours)}</div></div>
      </div>
      <div class="panel-body"><div class="contact-list">${items}</div></div>
    </section>`;
  }

  function render() {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
      <header class="topbar">
        <div class="container topbar-inner">
          <a class="brand" href="index.html">
            <span class="brand-logo">${icon('users')}</span>
            <span><span class="brand-name" style="display:block">subm8</span><span class="brand-sub" style="display:block">${esc(t('brandSub'))}</span></span>
          </a>
          <div class="topbar-spacer"></div>
          <div class="topbar-actions">
            <button class="lang-pill" data-action="toggle-lang" title="${esc(t('langTitle'))}" aria-label="${esc(t('langTitle'))}">
              <span>${esc(t('langBtn'))}</span>
            </button>
          </div>
        </div>
      </header>
      <section class="hero hub-hero">
        <div class="container hero-inner" style="flex-direction:column;align-items:center;text-align:center">
          <span class="hero-eyebrow">${icon('calendar', 'sm')} ${esc(monthLabel(ymNow()))}</span>
          <h1>${t('hubHeadline')}</h1>
          <p>${esc(t('hubTagline'))}</p>
        </div>
      </section>
      <main class="container">
        <div class="hub-grid">${SITES.map(card).join('')}</div>
        ${contact()}
      </main>
      <footer class="footer">
        <div class="container footer-inner">
          <div class="footer-brand"><b>subm8</b><span>${esc(t('dataStoredPrivately'))}</span></div>
        </div>
      </footer>`;
  }

  document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('[data-action="toggle-lang"]');
    if (langBtn) {
      e.preventDefault();
      const next = toggleLang();
      render();
      toast(next === 'th' ? 'เปลี่ยนเป็นภาษาไทยแล้ว' : 'Switched to English');
      return;
    }
    const b = e.target.closest('[data-copy]');
    if (b) {
      e.preventDefault();
      copyText(b.dataset.copy, t('copied'));
    }
  });

  render();
})();
