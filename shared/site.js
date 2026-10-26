/**
 * subm8 — family site application
 * One module powering every family site; behaviour & data come from window.SITE_CONFIG.
 */
(function () {
  'use strict';

  const SM = window.SM;
  const CFG = window.SITE_CONFIG;
  const { icon, esc, fmt, ymNow, monthLabel, fmtDate, shiftMonth, avatar, toast, copyText, t, getLang } = SM;

  const SITE_KEY = 'submate.site.v2.' + CFG.id;
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const uid = (p) => p + '_' + Math.random().toString(36).slice(2, 9);

  // ------------------------------------------------------------------------
  // State
  // ------------------------------------------------------------------------
  let host = SM.loadHost();
  let site = loadSite();
  const ui = { tab: 'payments', month: ymNow(), filter: 'all', query: '', anim: false };
  const app = document.getElementById('app');

  function defaultSite() {
    return { plan: clone(CFG.plan), members: clone(CFG.members), payments: {} };
  }

  function loadSite() {
    try {
      const s = JSON.parse(localStorage.getItem(SITE_KEY));
      if (s && s.plan && Array.isArray(s.members)) return Object.assign(defaultSite(), s);
    } catch (e) { /* ignore */ }
    return defaultSite();
  }

  function save() {
    try {
      localStorage.setItem(SITE_KEY, JSON.stringify(site));
    } catch (e) {
      toast('Could not save to this browser', 'error');
    }
  }

  // ------------------------------------------------------------------------
  // Calculations
  // ------------------------------------------------------------------------
  function perMember(plan, count) {
    plan = plan || site.plan;
    if (Number(plan.perPerson) > 0) return Number(plan.perPerson);
    const n = (count == null ? site.members.length : count) + (plan.hostShares ? 1 : 0);
    return n > 0 ? plan.totalCost / n : plan.totalCost;
  }

  function payRecord(month, id) {
    return (site.payments[month] && site.payments[month][id]) || null;
  }

  function isPaid(month, id) {
    const r = payRecord(month, id);
    return !!(r && r.paid);
  }

  function setPaid(month, id, value) {
    if (!site.payments[month]) site.payments[month] = {};
    site.payments[month][id] = { paid: value, paidAt: value ? new Date().toISOString() : null };
    save();
  }

  function stats(month) {
    const n = site.members.length;
    const pp = perMember();
    const paid = site.members.filter((m) => isPaid(month, m.id)).length;
    const receivable = n * pp;
    return {
      n, pp, paid, unpaid: n - paid,
      collected: paid * pp,
      outstanding: (n - paid) * pp,
      receivable,
      total: site.plan.totalCost,
      net: site.plan.totalCost - receivable,
      pct: n ? Math.round((paid / n) * 100) : 0
    };
  }

  // ------------------------------------------------------------------------
  // Views
  // ------------------------------------------------------------------------
  function header() {
    const unlocked = SM.isHostUnlocked(host);
    return `
    <header class="topbar">
      <div class="container topbar-inner">
        <div class="brand-group">
          <a class="hub-back" href="${esc(CFG.hubHref)}" title="${esc(t('allFamilies'))}" aria-label="${esc(t('allFamilies'))}">
            ${icon('home', 'sm')}<span>${esc(t('backToHub'))}</span>
          </a>
          <span class="topbar-div" aria-hidden="true"></span>
          <a class="brand" href="${esc(CFG.hubHref)}">
            <span class="brand-logo">${icon(CFG.logoIcon)}</span>
            <span>
              <span class="brand-name" style="display:block">${esc(CFG.short)}</span>
              <span class="brand-sub" style="display:block">${esc(t('brandSub'))}</span>
            </span>
          </a>
        </div>
        <div class="topbar-spacer"></div>
        <div class="topbar-actions">
          <button class="lang-pill" data-action="toggle-lang" title="${esc(t('langTitle'))}" aria-label="${esc(t('langTitle'))}">
            ${icon('globe', 'sm')}<span>${esc(t('langBtn'))}</span>
          </button>
          <a class="site-switch" href="${esc(CFG.switchTo.href)}" title="${esc(CFG.switchTo.label)}">
            ${icon(CFG.switchTo.icon, 'sm')}<span>${esc(CFG.switchTo.label)}</span>
          </a>
          ${unlocked
            ? `<button class="btn btn-soft btn-sm host-pill unlocked" data-action="host-lock" title="${esc(t('hostMode'))} · ${esc(t('hostLock'))}">${icon('crown', 'sm')}<span>${esc(t('hostMode'))}</span></button>`
            : `<button class="btn btn-ghost btn-sm host-pill" data-action="host-login" title="${esc(t('hostLogin'))}">${icon('lock', 'sm')}<span>${esc(t('hostLogin'))}</span></button>`}
          <button class="btn btn-primary btn-sm" data-action="open-contact">${icon('message', 'sm')}<span>${esc(t('contactHost'))}</span></button>
          <button class="icon-btn" data-action="open-host" title="${esc(t('hostSettings'))}" aria-label="${esc(t('hostSettings'))}">${icon('settings')}</button>
          <button class="icon-btn" data-action="open-backup" title="${esc(t('backupRestore'))}" aria-label="${esc(t('backupRestore'))}">${icon('download')}</button>
        </div>
      </div>
    </header>`;
  }

  function hero(st) {
    const R = 42, C = 2 * Math.PI * R, dash = (C * st.pct) / 100;
    const paidLabel = t('paidCount', { paid: st.paid, n: st.n });
    const tagline = (getLang() === 'th' && CFG.taglineTh) ? CFG.taglineTh : CFG.tagline;
    return `
    <section class="hero" aria-label="Overview">
      <div class="container hero-inner">
        <div>
          <span class="hero-eyebrow">${icon('calendar', 'sm')} ${esc(monthLabel(ui.month))}</span>
          <h1>${esc(CFG.brand)}</h1>
          <p>${esc(tagline)}</p>
          <div class="hero-chips">
            <div class="hero-chip"><div class="k">${esc(t('planCost'))}</div><div class="v">${fmt(site.plan.totalCost)}<small style="font-size:12px;opacity:.7;font-weight:500">${esc(t('perMonth'))}</small></div></div>
            <div class="hero-chip"><div class="k">${esc(t('perMember'))}</div><div class="v">${fmt(st.pp)}</div></div>
            <div class="hero-chip"><div class="k">${esc(t('dueDay'))}</div><div class="v">${esc(t('dueEveryMonth', { day: site.plan.billingDay }))}</div></div>
            <div class="hero-chip"><div class="k">${esc(t('seats'))}</div><div class="v">${site.members.length + (site.plan.hostShares ? 1 : 0)} / ${esc(site.plan.maxSlots)}</div></div>
          </div>
        </div>
        <div class="ring-wrap" role="img" aria-label="${esc(paidLabel)}">
          <svg viewBox="0 0 100 100"><circle class="ring-bg" cx="50" cy="50" r="${R}"/><circle class="ring-fg" cx="50" cy="50" r="${R}" stroke-dasharray="${dash} ${C}"/></svg>
          <div class="ring-label"><b>${st.pct}%</b><span>${esc(paidLabel)}</span></div>
        </div>
      </div>
    </section>`;
  }

  function kpis(st) {
    const netLabel = st.net < 0 ? t('surplus') : t('netCost');
    const netVal = Math.abs(st.net);
    const outSub = st.unpaid === 0
      ? t('allSettledSub')
      : t('outstandingSub', { unpaid: st.unpaid, s: st.unpaid === 1 ? '' : 's' });
    return `
    <section class="kpis" aria-label="Key figures">
      <div class="kpi"><div class="kpi-top"><span class="kpi-label">${esc(t('collected'))}</span><span class="kpi-ic green">${icon('check', 'sm')}</span></div>
        <div class="kpi-value">${fmt(st.collected)}</div><div class="kpi-sub">${esc(t('collectedSub', { paid: st.paid, n: st.n }))}</div></div>
      <div class="kpi"><div class="kpi-top"><span class="kpi-label">${esc(t('outstanding'))}</span><span class="kpi-ic ${st.unpaid === 0 ? 'green' : 'amber'}">${icon(st.unpaid === 0 ? 'check' : 'clock', 'sm')}</span></div>
        <div class="kpi-value">${fmt(st.outstanding)}</div><div class="kpi-sub">${esc(outSub)}</div></div>
      <div class="kpi"><div class="kpi-top"><span class="kpi-label">${esc(t('planCostLabel'))}</span><span class="kpi-ic accent">${icon('wallet', 'sm')}</span></div>
        <div class="kpi-value">${fmt(st.total)}</div><div class="kpi-sub">${esc(t('billedOnDay', { day: site.plan.billingDay }))}</div></div>
      <div class="kpi"><div class="kpi-top"><span class="kpi-label">${esc(netLabel)}</span><span class="kpi-ic slate">${icon('shield', 'sm')}</span></div>
        <div class="kpi-value">${fmt(netVal)}</div><div class="kpi-sub">${esc(t('whenAllPay', { n: st.n, pp: fmt(st.pp) }))}</div></div>
    </section>`;
  }

  function tabsNav() {
    const tabBtn = (id, ic, label, count) =>
      `<button class="tab ${ui.tab === id ? 'active' : ''}" data-action="tab" data-id="${id}" role="tab" aria-selected="${ui.tab === id}">
         ${icon(ic, 'sm')}<span>${label}</span>${count != null ? `<span class="count">${count}</span>` : ''}
       </button>`;
    return `<nav class="tabs" role="tablist">
      ${tabBtn('payments', 'wallet', t('tabPayments'), null)}
      ${tabBtn('members', 'users', t('tabMembers'), site.members.length)}
      ${tabBtn('plan', 'sliders', t('tabPlan'), null)}
      ${tabBtn('about', 'user', t('tabAbout'), null)}
    </nav>`;
  }

  // ---- Payments ----------------------------------------------------------
  function filteredMembers() {
    const q = ui.query.trim().toLowerCase();
    return site.members.filter((m) => {
      const paid = isPaid(ui.month, m.id);
      if (ui.filter === 'paid' && !paid) return false;
      if (ui.filter === 'pending' && paid) return false;
      if (q && !((m.name || '') + ' ' + (m.contact || '') + ' ' + (m.note || '')).toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function payRows() {
    if (!site.members.length) {
      return `<div class="empty"><b>${esc(t('noMembersYet'))}</b>${esc(t('noMembersYetSub'))}</div>`;
    }
    const list = filteredMembers();
    if (!list.length) {
      return `<div class="empty"><b>${esc(t('noMatching'))}</b>${esc(t('noMatchingSub'))}</div>`;
    }
    const pp = perMember();
    const unlocked = SM.isHostUnlocked(host);
    const head = `<div class="row head"><div>${esc(t('member'))}</div><div>${esc(t('amount'))}</div><div>${esc(t('status'))}</div><div style="text-align:right">${esc(t('actions'))}</div></div>`;
    return head + list.map((m) => {
      const rec = payRecord(ui.month, m.id);
      const paid = !!(rec && rec.paid);
      const dateStr = paid && rec.paidAt ? fmtDate(rec.paidAt) : '';
      return `
      <div class="row ${paid ? 'is-paid' : ''}">
        <div class="who">
          ${avatar(m.name)}
          <div class="who-info">
            <div class="who-name">${esc(m.name)}</div>
            <div class="who-meta">${esc(m.contact || m.note || t('familyMemberDefault'))}</div>
          </div>
        </div>
        <div class="amt">${fmt(pp)}</div>
        <div class="status-cell">
          <span class="badge ${paid ? 'paid' : 'pending'}">${esc(paid ? t('paid') : t('unpaid'))}</span>
          ${dateStr ? `<span class="paid-date">${esc(t('paidOn', { date: dateStr }))}</span>` : ''}
        </div>
        <div class="acts">
          ${unlocked
            ? (paid
                ? `<button class="btn btn-ghost btn-sm" data-action="toggle-paid" data-id="${m.id}">${esc(t('undo'))}</button>`
                : `<button class="btn btn-success btn-sm" data-action="toggle-paid" data-id="${m.id}">${icon('check', 'sm')}<span>${esc(t('markPaid'))}</span></button>`) +
              `<button class="icon-btn" data-action="bill" data-id="${m.id}" title="${esc(t('invoice'))} &amp; PromptPay QR" aria-label="${esc(t('invoice'))} ${esc(m.name)}">${icon('qr')}</button>` +
              `<button class="icon-btn" data-action="remind" data-id="${m.id}" title="${esc(t('copyReminder'))}" aria-label="${esc(t('copyReminder'))} ${esc(m.name)}">${icon('copy')}</button>`
            : `<button class="btn ${paid ? 'btn-secondary' : 'btn-primary'} btn-sm" data-action="bill" data-id="${m.id}">${icon('qr', 'sm')}<span>${esc(paid ? t('invoice') : t('payNow'))}</span></button>
               <button class="icon-btn" data-action="remind" data-id="${m.id}" title="${esc(t('copyReminder'))}" aria-label="${esc(t('copyReminder'))} ${esc(m.name)}">${icon('copy')}</button>`}
        </div>
      </div>`;
    }).join('');
  }

  function historyStrip() {
    const bars = [];
    for (let i = 5; i >= 0; i--) {
      const ym = shiftMonth(ui.month, -i);
      const n = site.members.length;
      const paid = site.members.filter((m) => isPaid(ym, m.id)).length;
      const pct = n ? Math.round((paid / n) * 100) : 0;
      bars.push(`
      <button class="hbar ${ym === ui.month ? 'current' : ''}" data-action="goto-month" data-id="${ym}" title="${esc(monthLabel(ym))}: ${t('paidCount', { paid, n })}">
        <div class="hbar-track"><div class="hbar-fill" style="height:${Math.max(pct, 0)}%"></div></div>
        <div class="hbar-m">${esc(monthLabel(ym, true))}</div>
        <div class="hbar-v">${paid}/${n}</div>
      </button>`);
    }
    return `<div class="history"><div class="history-title">${esc(t('historyTitle'))}</div><div class="history-bars">${bars.join('')}</div></div>`;
  }

  function paymentsTab(st) {
    const unlocked = SM.isHostUnlocked(host);
    const counts = { all: st.n, pending: st.unpaid, paid: st.paid };
    const filterLabels = { all: t('filterAll'), pending: t('filterPending'), paid: t('filterPaid') };
    return `
    <div class="panel ${ui.anim ? 'anim' : ''}">
      <div class="panel-head">
        <div>
          <div class="panel-title">${esc(t('monthlyPayments'))}</div>
          <div class="panel-desc">${esc(t('trackPaymentsDesc', { month: monthLabel(ui.month) }))}</div>
        </div>
        <div class="month-nav">
          <button class="icon-btn" data-action="prev-month" aria-label="Previous month">${icon('chevL', 'sm')}</button>
          <div class="month-label">${esc(monthLabel(ui.month))}</div>
          <button class="icon-btn" data-action="next-month" aria-label="Next month">${icon('chevR', 'sm')}</button>
          <button class="btn btn-soft btn-sm" data-action="today">${esc(t('today'))}</button>
        </div>
      </div>
      <div class="toolbar">
        <div class="toolbar-left">
          <label class="search">${icon('search', 'sm')}<input id="searchInput" type="search" placeholder="${esc(t('searchPlaceholder'))}" value="${esc(ui.query)}" aria-label="${esc(t('searchPlaceholder'))}"></label>
          <div class="segmented" role="group" aria-label="Filter">
            ${['all', 'pending', 'paid'].map((f) =>
              `<button class="${ui.filter === f ? 'active' : ''}" data-action="filter" data-id="${f}">
                 <span>${esc(filterLabels[f])}</span><span class="seg-count">${counts[f]}</span>
               </button>`).join('')}
          </div>
        </div>
        <div class="toolbar-right">
          <button class="btn btn-secondary btn-sm" data-action="copy-pending">${icon('bell', 'sm')}<span>${esc(t('copyPending'))}</span></button>
          ${unlocked && st.unpaid > 0 ? `<button class="btn btn-secondary btn-sm" data-action="mark-all">${icon('check', 'sm')}<span>${esc(t('markAllPaid'))}</span></button>` : ''}
        </div>
      </div>
      <div class="rows" id="payRows">${payRows()}</div>
      ${historyStrip()}
    </div>`;
  }

  // ---- Members -----------------------------------------------------------
  function membersTab() {
    const used = site.members.length + (site.plan.hostShares ? 1 : 0);
    const max = Number(site.plan.maxSlots) || 1;
    const over = used > max;
    const pct = Math.min(100, Math.round((used / max) * 100));
    const pp = perMember();
    const unlocked = SM.isHostUnlocked(host);
    const rows = site.members.length
      ? `<div class="row head members"><div>${esc(t('member'))}</div><div>${esc(t('contactChannels'))}</div><div>${esc(t('perMember'))}</div><div style="text-align:right">${esc(t('actions'))}</div></div>` +
        site.members.map((m) => `
        <div class="row members">
          <div class="who">${avatar(m.name)}<div class="who-info"><div class="who-name">${esc(m.name)}</div><div class="who-meta">${esc(m.note || t('familyMemberDefault'))}</div></div></div>
          <div class="who-meta">${esc(m.contact || '—')}</div>
          <div class="amt">${fmt(pp)}</div>
          <div class="acts">
            <button class="icon-btn" data-action="bill" data-id="${m.id}" title="${esc(t('invoice'))}" aria-label="${esc(t('invoice'))} ${esc(m.name)}">${icon('qr')}</button>
            <button class="icon-btn" data-action="edit-member" data-id="${m.id}" title="${esc(t('editMember'))}" aria-label="Edit ${esc(m.name)}">${icon('edit')}</button>
            ${unlocked ? `<button class="icon-btn" data-action="del-member" data-id="${m.id}" title="${esc(t('removeMember'))}" aria-label="Remove ${esc(m.name)}">${icon('trash')}</button>` : ''}
          </div>
        </div>`).join('')
      : `<div class="empty"><b>${esc(t('noMembersYet'))}</b>${esc(t('noMembersYetSub'))}</div>`;
    return `
    <div class="panel ${ui.anim ? 'anim' : ''}">
      <div class="panel-head">
        <div>
          <div class="panel-title">${esc(t('familyMembers'))}</div>
          <div class="panel-desc">${esc(t('familyMembersDesc', { plan: CFG.short }))}</div>
        </div>
        <button class="btn ${unlocked ? 'btn-primary' : 'btn-secondary'} btn-sm" data-action="add-member">${icon(unlocked ? 'plus' : 'lock', 'sm')}<span>${esc(t('addMember'))}</span></button>
      </div>
      <div class="panel-body" style="padding-bottom:6px">
        <div class="seat-meter">
          <div class="seat-head"><span>${esc(t('seatsUsed'))}</span><span style="color:${over ? 'var(--red)' : 'inherit'}">${esc(t('seatsOf', { used, max }))}${over ? esc(t('overCapacity')) : ''}</span></div>
          <div class="seat-track"><div class="seat-fill ${over ? 'over' : ''}" style="width:${pct}%"></div></div>
        </div>
      </div>
      <div class="rows">${rows}</div>
    </div>`;
  }

  // ---- Plan --------------------------------------------------------------
  function breakdownHtml(plan) {
    const n = site.members.length;
    const pp = perMember(plan);
    const seats = Math.max(1, Number(plan.maxSlots) || 1);
    const exact = plan.totalCost / seats;
    const receivable = n * pp;
    const net = plan.totalCost - receivable;
    return `
      <div class="bk-row"><span>${esc(t('planCost'))}</span><b>${fmt(plan.totalCost)} ${esc(t('perMonth'))}</b></div>
      <div class="bk-row"><span>${esc(t('seats'))}</span><b>${seats}</b></div>
      <div class="bk-row"><span>${esc(t('exactSplit', { total: fmt(plan.totalCost), seats }))}</span><b>${fmt(Math.round(exact * 100) / 100)}</b></div>
      <div class="bk-row total"><span>${esc(t('chargePerMember'))}</span><b>${fmt(pp)}</b></div>
      <div class="bk-row"><span>${esc(t('membersEnrolled'))}</span><b>${n}</b></div>
      <div class="bk-row"><span>${esc(t('collectedWhenAll'))}</span><b>${fmt(receivable)}</b></div>
      <div class="bk-row"><span>${net < 0 ? esc(t('surplus')) : esc(t('netCost'))}</span><b>${fmt(Math.abs(net))}</b></div>
      <div class="bk-row"><span>${esc(t('dueDay'))}</span><b>${esc(t('billedOnDay', { day: plan.billingDay }))}</b></div>`;
  }

  function planTab() {
    const p = site.plan;
    const unlocked = SM.isHostUnlocked(host);
    return `
    <div class="panel ${ui.anim ? 'anim' : ''}">
      <div class="panel-head">
        <div>
          <div class="panel-title">${esc(t('planSettings'))}</div>
          <div class="panel-desc">${esc(t('planSettingsDesc'))}</div>
        </div>
        ${!unlocked ? `<button class="btn btn-secondary btn-sm" data-action="host-login">${icon('lock', 'sm')}<span>${esc(t('unlockToEdit'))}</span></button>` : ''}
      </div>
      <div class="panel-body">
        ${!unlocked ? `
        <div class="banner-locked">
          <div>
            <strong>${icon('lock', 'sm')} ${esc(t('memberViewBannerTitle'))}</strong>
            <div>${esc(t('memberViewBannerDesc'))}</div>
          </div>
          <button class="btn btn-soft btn-sm" data-action="host-login">${icon('unlock', 'sm')}<span>${esc(t('hostLogin'))}</span></button>
        </div>` : ''}
        <div class="grid-2">
          <form data-form="plan" id="planForm" autocomplete="off">
            <div class="field"><label for="pName">${esc(t('planName'))}</label><input class="input" id="pName" name="name" value="${esc(p.name)}" ${unlocked ? 'required' : 'readonly'}></div>
            <div class="field-row">
              <div class="field"><label for="pTotal">${esc(t('monthlyCost'))}</label>
                <div class="input-affix"><span class="affix">฿</span><input class="input" id="pTotal" name="totalCost" type="number" min="0" step="0.01" value="${esc(p.totalCost)}" ${unlocked ? 'required' : 'readonly'}></div></div>
              <div class="field"><label for="pSlots">${esc(t('seatsAvailable'))}</label><input class="input" id="pSlots" name="maxSlots" type="number" min="1" max="20" value="${esc(p.maxSlots)}" ${unlocked ? 'required' : 'readonly'}></div>
            </div>
            <div class="field"><label for="pPer">${esc(t('chargePerMember'))}</label>
              <div style="display:flex;gap:10px">
                <div class="input-affix" style="flex:1"><span class="affix">฿</span><input class="input" id="pPer" name="perPerson" type="number" min="0" step="0.01" value="${esc(p.perPerson || '')}" placeholder="Auto" ${unlocked ? '' : 'readonly'}></div>
                ${unlocked ? `<button class="btn btn-secondary" type="button" data-action="auto-round">${esc(t('autoRound'))}</button>` : ''}
              </div>
              <div class="hint">${esc(t('autoHint'))}</div></div>
            <div class="field"><label for="pDay">${esc(t('billingDayOfMonth'))}</label><input class="input" id="pDay" name="billingDay" type="number" min="1" max="31" value="${esc(p.billingDay)}" ${unlocked ? 'required' : 'readonly'}></div>
            <div class="toggle-row"><div><b>${esc(t('hostSharesSeat'))}</b><small>${esc(t('hostSharesSeatSub'))}</small></div>
              <label class="switch"><input type="checkbox" name="hostShares" ${p.hostShares ? 'checked' : ''} ${unlocked ? '' : 'disabled'}><span></span></label></div>
            <div class="field"><label for="pNotes">${esc(t('notes'))}</label><textarea class="textarea" id="pNotes" name="notes" rows="3" ${unlocked ? '' : 'readonly'}>${esc(p.notes || '')}</textarea></div>
            ${unlocked ? `<button class="btn btn-primary" type="submit">${esc(t('saveChanges'))}</button>` : `<button class="btn btn-secondary" type="button" data-action="host-login">${icon('lock', 'sm')}<span>${esc(t('unlockToEdit'))}</span></button>`}
          </form>
          <div>
            <div class="section-label" style="margin-top:0;padding-top:0">${esc(t('howItBreaksDown'))}</div>
            <div class="breakdown" id="planBreakdown">${breakdownHtml(p)}</div>
          </div>
        </div>
      </div>
    </div>`;
  }

  function footer() {
    const chans = SM.contactChannels(host).filter((c) => c.value);
    const unlocked = SM.isHostUnlocked(host);
    return `
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand"><b>${esc(host.name)}</b><span>${esc(host.title)} · ${esc(host.hours)}</span></div>
        <div class="footer-links">
          ${chans.length
            ? chans.map((c) => `<a class="btn btn-secondary btn-sm" href="${esc(c.href)}" ${c.key === 'phone' || c.key === 'email' ? '' : 'target="_blank" rel="noopener"'}>${icon(c.icon, 'sm')}<span>${c.label}</span></a>`).join('')
            : `<button class="btn btn-secondary btn-sm" data-action="open-host">${icon('plus', 'sm')}<span>${esc(t('addYoursPrompt'))}</span></button>`}
          <a class="btn btn-ghost btn-sm" href="${esc(CFG.hubHref)}">${icon('home', 'sm')}<span>${esc(t('allFamilies'))}</span></a>
        </div>
        <div class="footer-copy">subm8 · ${unlocked ? '<span class="mode-tag unlocked">' + icon('crown', 'sm') + esc(t('hostModeActive')) + ' (<a href="#" data-action="host-lock">' + esc(t('lock')) + '</a>)</span>' : '<span class="mode-tag">' + icon('lock', 'sm') + esc(t('memberView')) + ' (<a href="#" data-action="host-login">' + esc(t('hostLogin')) + '</a>)</span>'} · ${esc(t('dataStoredPrivately'))}</div>
      </div>
    </footer>`;
  }

  function render() {
    const st = stats(ui.month);
    const body = ui.tab === 'members'
      ? membersTab()
      : ui.tab === 'plan'
        ? planTab()
        : ui.tab === 'about'
          ? SM.renderAboutBento({ assetPrefix: '../' })
          : paymentsTab(st);
    app.innerHTML = header() + hero(st) +
      `<main class="container">${kpis(st)}${tabsNav()}${body}</main>` + footer();
    ui.anim = false;
  }

  // ------------------------------------------------------------------------
  // Modals
  // ------------------------------------------------------------------------
  let pendingConfirmFn = null;

  function openModal(o) {
    closeModal();
    const el = document.createElement('div');
    el.className = 'modal-overlay';
    el.id = 'modalRoot';
    el.innerHTML = `
      <div class="modal ${o.wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(o.title)}">
        <div class="modal-sheet-bar" aria-hidden="true"></div>
        <div class="modal-head">
          <div><h2>${esc(o.title)}</h2>${o.sub ? `<p>${esc(o.sub)}</p>` : ''}</div>
          <button class="icon-btn" data-action="close-modal" aria-label="Close">${icon('close')}</button>
        </div>
        <div class="modal-body">${o.body}</div>
        ${o.foot ? `<div class="modal-foot">${o.foot}</div>` : ''}
      </div>`;
    document.body.appendChild(el);
    const first = el.querySelector('input:not([type=hidden]), textarea, button.btn-primary');
    if (first && o.focus !== false) setTimeout(() => first.focus(), 30);
  }

  function closeModal() {
    const el = document.getElementById('modalRoot');
    if (el) el.remove();
  }

  function confirmModal(opts) {
    pendingConfirmFn = opts.onConfirm || null;
    openModal({
      title: opts.title || t('confirmBtn'),
      body: `<p style="color:var(--text-2);font-size:14.5px;line-height:1.6">${esc(opts.message)}</p>`,
      foot: `
        <button class="btn btn-secondary" data-action="close-modal">${esc(t('cancel'))}</button>
        <button class="btn ${opts.danger ? 'btn-danger' : 'btn-primary'}" data-action="confirm-yes">${esc(opts.confirmLabel || t('confirmBtn'))}</button>`
    });
  }

  function contactModal() {
    const chans = SM.contactChannels(host);
    const anySet = chans.some((c) => c.value);
    const items = chans.map((c) => c.value
      ? `<div class="contact-item">
           <a class="contact-link" href="${esc(c.href)}" ${c.key === 'phone' || c.key === 'email' ? '' : 'target="_blank" rel="noopener"'}>
             <span class="contact-ic ${c.cls}">${icon(c.icon)}</span>
             <span class="contact-main"><small>${c.label}</small><b>${esc(c.value)}</b></span>
           </a>
           <button class="icon-btn" type="button" data-action="copy" data-copy="${esc(c.value)}" title="${esc(t('copyBtn'))}" aria-label="Copy ${c.label}">${icon('copy', 'sm')}</button>
         </div>`
      : `<div class="contact-item unset"><span class="contact-ic ${c.cls}">${icon(c.icon)}</span><span class="contact-main"><small>${c.label}</small><b>${esc(t('notSet'))}</b></span></div>`
    ).join('');
    openModal({
      title: t('contactHostTitle'),
      sub: t('contactHostSub'),
      body: `
        <div class="host-card">${avatar(host.name)}<div><b>${esc(host.name)}</b><span>${esc(host.title)}</span><br><span>${esc(host.hours)}</span></div></div>
        <div class="contact-list">${items}</div>
        ${anySet ? '' : `<div class="contact-note">${icon('plus', 'sm')}<span>${esc(t('noContactDetailsYet'))} <a href="#" data-action="open-host" style="color:var(--accent);font-weight:600">${esc(t('addYoursPrompt'))}</a></span></div>`}
        <div class="section-label">${esc(t('sendQuickMsg'))}</div>
        <form data-form="message" id="messageForm">
          <div class="field"><label for="msgName">${esc(t('yourName'))}</label><input class="input" id="msgName" name="name" placeholder="${esc(t('whoIsThisFrom'))}"></div>
          <div class="field"><label for="msgText">${esc(t('messageText'))}</label><textarea class="textarea" id="msgText" name="text" rows="3" placeholder="${esc(t('msgPlaceholder'))}"></textarea></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary" type="submit" data-mode="email">${icon('mail', 'sm')}<span>${esc(t('sendEmail'))}</span></button>
            <button class="btn btn-secondary" type="submit" data-mode="copy">${icon('copy', 'sm')}<span>${esc(t('copyForChat'))}</span></button>
          </div>
        </form>`,
      wide: true,
      focus: false
    });
  }

  function memberModal(id) {
    const m = id ? site.members.find((x) => x.id === id) : null;
    openModal({
      title: m ? t('editMember') : t('addMember'),
      sub: m ? m.name : CFG.short,
      body: `
        <form data-form="member" id="memberForm" autocomplete="off">
          <input type="hidden" name="id" value="${m ? esc(m.id) : ''}">
          <div class="field"><label for="mName">${esc(t('member'))}</label><input class="input" id="mName" name="name" value="${m ? esc(m.name) : ''}" required placeholder="e.g. Somchai / Mint"></div>
          <div class="field"><label for="mContact">${esc(t('contactChannels'))}</label><input class="input" id="mContact" name="contact" value="${m ? esc(m.contact || '') : ''}" placeholder="e.g. LINE: somchai.k, 081-xxx-xxxx"></div>
          <div class="field"><label for="mNote">${esc(t('notes'))}</label><input class="input" id="mNote" name="note" value="${m ? esc(m.note || '') : ''}" placeholder="e.g. Pays on 1st, Apple ID email"></div>
        </form>`,
      foot: `<button class="btn btn-secondary" data-action="close-modal">${esc(t('cancel'))}</button><button class="btn btn-primary" type="submit" form="memberForm">${esc(m ? t('saveChanges') : t('addMember'))}</button>`
    });
  }

  function hostModal() {
    const f = (id, name, label, ph, hint) =>
      `<div class="field"><label for="${id}">${label}</label><input class="input" id="${id}" name="${name}" value="${esc(host[name])}" placeholder="${esc(ph || '')}">${hint ? `<div class="hint">${hint}</div>` : ''}</div>`;
    openModal({
      title: t('hostProfileTitle'),
      sub: t('hostProfileSub'),
      wide: true,
      body: `
        <form data-form="host" id="hostForm" autocomplete="off">
          <div class="section-label">${esc(t('aboutYou'))}</div>
          <div class="field-row">${f('hName', 'name', t('displayName'), 'Your name')}${f('hTitle', 'title', t('roleTagline'), 'Family plan host')}</div>
          ${f('hHours', 'hours', t('availabilityNote'), 'Usually replies within a few hours')}
          <div class="section-label">${esc(t('contactChannels'))}</div>
          <div class="field-row">${f('hLine', 'line', 'LINE ID', '@yourid')}${f('hPhone', 'phone', 'Phone', '08x-xxx-xxxx')}</div>
          ${f('hEmail', 'email', 'Email', 'you@example.com')}
          <div class="field-row">${f('hFb', 'facebook', 'Facebook', 'username or full URL')}${f('hIg', 'instagram', 'Instagram', '@username')}</div>
          <div class="section-label">${esc(t('paymentDetails'))}</div>
          ${f('hPay', 'promptPay', t('promptPayLabel'), '0812345678', t('promptPaySub'))}
          <div class="field-row">${f('hBank', 'bankName', t('bankName'), 'e.g. Kasikorn / SCB')}${f('hAcc', 'bankAccount', t('bankAccount'), 'xxx-x-xxxxx-x')}</div>
          <div class="section-label">${esc(t('hostSecurityTitle'))}</div>
          <div class="field"><label for="hPin">${esc(t('hostPinLabel'))}</label><input class="input" id="hPin" name="pin" type="text" maxlength="12" value="${esc(host.pin || '1234')}" placeholder="1234">
            <div class="hint">${esc(t('hostPinHint'))}</div></div>
          <div class="section-label">${esc(t('reminderTemplate'))}</div>
          <div class="field"><label for="hTpl">${esc(t('reminderTemplate'))}</label><textarea class="textarea" id="hTpl" name="template" rows="6">${esc(host.template)}</textarea>
            <div class="hint">${esc(t('templateHint'))}</div></div>
        </form>`,
      foot: `<button class="btn btn-secondary" data-action="close-modal">${esc(t('cancel'))}</button><button class="btn btn-primary" type="submit" form="hostForm">${esc(t('saveProfile'))}</button>`
    });
  }

  function backupModal() {
    openModal({
      title: t('backupTitle'),
      sub: t('backupSub'),
      body: `
        <div class="contact-list">
          <div class="contact-item"><span class="contact-ic phone">${icon('download')}</span>
            <span class="contact-main"><small>JSON</small><b>${esc(t('exportBackup'))}</b></span>
            <button class="btn btn-secondary btn-sm" data-action="export">${esc(t('downloadBtn'))}</button></div>
          <div class="contact-item"><span class="contact-ic mail">${icon('upload')}</span>
            <span class="contact-main"><small>JSON</small><b>${esc(t('importBackup'))}</b></span>
            <button class="btn btn-secondary btn-sm" data-action="import">${esc(t('chooseFileBtn'))}</button></div>
          <div class="contact-item"><span class="contact-ic list" style="background:#475569">${icon('copy')}</span>
            <span class="contact-main"><small>GitHub / Git</small><b>${esc(t('exportConfig'))}</b></span>
            <button class="btn btn-secondary btn-sm" data-action="copy-site-config">${esc(t('copyBtn'))}</button></div>
          <div class="contact-item"><span class="contact-ic" style="background:var(--red)">${icon('trash')}</span>
            <span class="contact-main"><small>Reset</small><b>${esc(t('resetDefaults'))}</b></span>
            <button class="btn btn-danger btn-sm" data-action="reset">${esc(t('resetBtn'))}</button></div>
        </div>
        <input type="file" id="importFile" accept="application/json,.json" hidden>`,
      foot: `<button class="btn btn-secondary" data-action="close-modal">${esc(t('close'))}</button>`,
      focus: false
    });
  }

  function billModal(id) {
    const m = site.members.find((x) => x.id === id);
    if (!m) return;
    const pp = perMember();
    const rec = payRecord(ui.month, m.id);
    const paid = !!(rec && rec.paid);
    const dateStr = paid && rec.paidAt ? fmtDate(rec.paidAt) : '';
    const msg = buildMessage(m);
    const unlocked = SM.isHostUnlocked(host);
    const rawAmount = (Math.round(pp * 100) / 100).toString();
    openModal({
      title: t('invoiceTitle'),
      sub: monthLabel(ui.month) + ' · ' + site.plan.name,
      wide: true,
      focus: false,
      body: `
        <div class="bill">
          <div class="bill-head">
            ${avatar(m.name)}
            <div style="min-width:0">
              <b>${esc(m.name)}</b>
              <div class="who-meta">${esc(m.contact || m.note || t('familyMemberDefault'))}</div>
            </div>
            <div style="margin-left:auto;text-align:right">
              <span class="badge ${paid ? 'paid' : 'pending'}">${esc(paid ? t('paid') : t('unpaid'))}</span>
              ${dateStr ? `<div class="paid-date" style="margin-top:3px">${esc(t('paidOn', { date: dateStr }))}</div>` : ''}
            </div>
          </div>
          <div class="bill-line"><span>${esc(site.plan.name)}</span><span>${fmt(pp)}</span></div>
          <div class="bill-line"><span>${esc(t('dueDay'))}</span><span>${esc(t('billedOnDay', { day: site.plan.billingDay }))}</span></div>
          <div class="bill-total">
            <span>${esc(t('totalDue'))}</span>
            <div class="bill-total-right">
              <b>${fmt(pp)}</b>
              <button class="btn btn-soft btn-sm" type="button" data-action="copy" data-copy="${esc(rawAmount)}">${icon('copy', 'sm')}<span>${esc(t('copyAmount'))}</span></button>
            </div>
          </div>
        </div>
        <div class="qr-card" id="qrCard">
          <span class="qr-badge">${esc(t('promptPayTitle'))}</span>
          <div id="qrBox"></div>
          <div class="qr-meta">
            <div class="line">
              <span>PromptPay</span>
              <b>${esc(host.promptPay || t('notSet'))}</b>
              ${host.promptPay ? `<button class="icon-btn" style="width:30px;height:30px" data-action="copy" data-copy="${esc(host.promptPay)}" aria-label="Copy PromptPay">${icon('copy', 'sm')}</button>` : ''}
            </div>
            ${host.bankAccount ? `
            <div class="line">
              <span>${esc(host.bankName || t('bankName'))}</span>
              <b>${esc(host.bankAccount)}</b>
              <button class="icon-btn" style="width:30px;height:30px" data-action="copy" data-copy="${esc(host.bankAccount)}" aria-label="Copy account number">${icon('copy', 'sm')}</button>
            </div>` : ''}
          </div>
        </div>
        <details class="reminder-details" ${unlocked ? 'open' : ''}>
          <summary>
            <span>${icon('message', 'sm')} ${esc(t('reminderPreviewTitle'))}</span>
            <span class="summary-actions">
              <button class="btn btn-secondary btn-sm" type="button" data-action="copy" data-copy="${esc(msg)}">${icon('copy', 'sm')}<span>${esc(t('copyReminder'))}</span></button>
            </span>
          </summary>
          <div class="reminder-body">
            <textarea class="textarea" id="billMsg" rows="6" readonly>${esc(msg)}</textarea>
          </div>
        </details>`,
      foot: `<button class="btn btn-secondary" data-action="close-modal">${esc(t('close'))}</button>
             ${unlocked
               ? `<button class="btn ${paid ? 'btn-secondary' : 'btn-success'}" data-action="toggle-paid-close" data-id="${m.id}">${icon('check', 'sm')}<span>${esc(paid ? t('undo') : t('markPaid'))}</span></button>`
               : `<button class="btn btn-primary" data-action="open-contact">${icon('message', 'sm')}<span>${esc(t('sendSlipToHost'))}</span></button>`}`
    });
    renderQR(pp);
  }

  // ------------------------------------------------------------------------
  // PromptPay QR
  // ------------------------------------------------------------------------
  function crc16(s) {
    let crc = 0xFFFF;
    for (let i = 0; i < s.length; i++) {
      crc ^= s.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  function promptPayPayload(target, amount) {
    const digits = String(target || '').replace(/\D/g, '');
    let type, value;
    if (digits.length === 10 || digits.length === 9) { type = '01'; value = ('0066' + digits.replace(/^0/, '')).padStart(13, '0'); }
    else if (digits.length === 13) { type = '02'; value = digits; }
    else return null;
    const t29 = '0016A000000677010111' + type + String(value.length).padStart(2, '0') + value;
    let p = '000201' + '010212' + '29' + String(t29.length).padStart(2, '0') + t29 + '5303764';
    if (amount > 0) { const a = Number(amount).toFixed(2); p += '54' + String(a.length).padStart(2, '0') + a; }
    p += '5802TH6304';
    return p + crc16(p);
  }

  function renderQR(amount) {
    const box = document.getElementById('qrBox');
    if (!box) return;
    const payload = promptPayPayload(host.promptPay, amount);
    if (!payload) {
      box.innerHTML = `<div class="qr-fallback">${esc(t('promptPayFallback'))}</div>`;
      return;
    }
    const size = 220;
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size + '&margin=0&data=' + encodeURIComponent(payload);
    const img = document.createElement('img');
    img.id = 'qrImage';
    img.className = 'qr-img';
    img.width = size; img.height = size;
    img.alt = 'PromptPay QR code for ' + fmt(amount);
    img.onerror = () => {
      box.innerHTML = `<div class="qr-fallback">${esc(t('promptPayOffline', { amount: fmt(amount) }))} <b>${esc(host.promptPay)}</b>.</div>`;
    };
    img.src = qrUrl;
    box.innerHTML = '';
    box.appendChild(img);
  }

  // ------------------------------------------------------------------------
  // Messages
  // ------------------------------------------------------------------------
  function buildMessage(m) {
    const map = {
      name: m.name,
      month: monthLabel(ui.month),
      amount: perMember().toFixed(2),
      plan: site.plan.name,
      due: site.plan.billingDay,
      promptpay: host.promptPay || '-',
      bank: host.bankName || '',
      account: host.bankAccount || ''
    };
    return (host.template || SM.DEFAULT_HOST.template)
      .replace(/\{(\w+)\}/g, (s, k) => (k in map ? map[k] : s))
      .replace(/[ \t]+\n/g, '\n').trim();
  }

  function unpaidSummary() {
    const pending = site.members.filter((m) => !isPaid(ui.month, m.id));
    if (!pending.length) return null;
    const pp = perMember();
    const lines = pending.map((m, i) => (i + 1) + '. ' + m.name + ' — ' + fmt(pp)).join('\n');
    return site.plan.name + ' · ' + monthLabel(ui.month) + '\n\n' + t('filterPending') + ' (' + pending.length + '):\n' + lines +
      '\n\n' + t('outstanding') + ': ' + fmt(pp * pending.length) +
      (host.promptPay ? '\nPromptPay: ' + host.promptPay : '') +
      (host.bankAccount ? '\n' + (host.bankName || 'Bank') + ': ' + host.bankAccount : '') +
      '\n\nThank you.';
  }

  // ------------------------------------------------------------------------
  // Host Security & PIN Verification
  // ------------------------------------------------------------------------
  let pendingHostAction = null;

  function pinModal(onSuccess, actionName) {
    pendingHostAction = onSuccess || null;
    openModal({
      title: t('hostVerificationTitle'),
      sub: actionName ? t('enterPinTo', { action: actionName }) : t('enterPinToUnlock'),
      body: `
        <form data-form="pin" id="pinForm" autocomplete="off">
          <input class="input pin-input" id="pinInput" name="pin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="12" placeholder="••••" required autofocus>
          <div class="pin-note">${esc(t('defaultPinNote'))}</div>
          <div id="pinError" style="display:none;color:var(--red);text-align:center;font-size:13px;font-weight:600;margin-top:6px">${icon('close', 'sm')} ${esc(t('incorrectPin'))}</div>
        </form>`,
      foot: `<button class="btn btn-secondary" data-action="close-modal">${esc(t('cancel'))}</button><button class="btn btn-primary" type="submit" form="pinForm">${icon('unlock', 'sm')}<span>${esc(t('unlockHostMode'))}</span></button>`
    });
    setTimeout(() => {
      const inp = document.getElementById('pinInput');
      if (inp) inp.focus();
    }, 50);
  }

  function requireHost(fn, actionName) {
    if (SM.isHostUnlocked(host)) {
      fn();
    } else {
      pinModal(fn, actionName);
    }
  }

  // ------------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------------
  const actions = {
    'toggle-lang': () => {
      const next = SM.toggleLang();
      render();
      toast(next === 'th' ? 'เปลี่ยนเป็นภาษาไทยแล้ว' : 'Switched to English');
    },
    'tab': (id) => { ui.tab = id; ui.anim = true; render(); },
    'filter': (id) => { ui.filter = id; render(); },
    'prev-month': () => { ui.month = shiftMonth(ui.month, -1); render(); },
    'next-month': () => { ui.month = shiftMonth(ui.month, 1); render(); },
    'today': () => { ui.month = ymNow(); render(); },
    'goto-month': (id) => { ui.month = id; render(); },
    'confirm-yes': () => {
      const fn = pendingConfirmFn;
      pendingConfirmFn = null;
      closeModal();
      if (typeof fn === 'function') fn();
    },
    'toggle-paid': (id) => {
      requireHost(() => {
        const paid = !isPaid(ui.month, id);
        setPaid(ui.month, id, paid); render();
        toast(paid ? t('paid') : t('unpaid'));
      }, t('markPaid'));
    },
    'toggle-paid-close': (id) => {
      requireHost(() => {
        const paid = !isPaid(ui.month, id);
        setPaid(ui.month, id, paid); closeModal(); render();
        toast(paid ? t('paid') : t('unpaid'));
      }, t('markPaid'));
    },
    'mark-all': () => {
      requireHost(() => {
        if (!site.members.length) return;
        confirmModal({
          title: t('confirmMarkAllTitle'),
          message: t('confirmMarkAll', { month: monthLabel(ui.month) }),
          confirmLabel: t('markAllPaid'),
          onConfirm: () => {
            site.members.forEach((m) => setPaid(ui.month, m.id, true));
            render();
            toast(t('allMarkedPaid'));
          }
        });
      }, t('markAllPaid'));
    },
    'copy-pending': () => {
      const s = unpaidSummary();
      if (!s) { toast(t('allPaidBadge')); return; }
      copyText(s, t('unpaidSummaryCopied'));
    },
    'remind': (id) => {
      const m = site.members.find((x) => x.id === id);
      if (m) copyText(buildMessage(m), t('reminderCopied') + ' (' + m.name + ')');
    },
    'bill': (id) => billModal(id),
    'add-member': () => requireHost(() => memberModal(), t('addMember')),
    'edit-member': (id) => requireHost(() => memberModal(id), t('editMember')),
    'del-member': (id) => {
      requireHost(() => {
        const m = site.members.find((x) => x.id === id);
        if (!m) return;
        confirmModal({
          title: t('confirmRemoveTitle'),
          message: t('confirmRemoveMember', { name: m.name }),
          confirmLabel: t('removeMember'),
          danger: true,
          onConfirm: () => {
            site.members = site.members.filter((x) => x.id !== id);
            save();
            render();
            toast(t('memberUpdated'));
          }
        });
      }, t('removeMember'));
    },
    'open-contact': () => contactModal(),
    'open-host': () => requireHost(() => hostModal(), t('hostSettings')),
    'host-login': () => pinModal(),
    'host-lock': () => { SM.lockHost(); render(); toast(t('hostLocked')); },
    'open-backup': () => backupModal(),
    'close-modal': () => closeModal(),
    'copy': (id, el) => copyText(el.dataset.copy, t('copied')),
    'copy-site-config': () => {
      const code = 'window.SITE_CONFIG.plan = ' + JSON.stringify(site.plan, null, 2) + ';\n' +
                   'window.SITE_CONFIG.members = ' + JSON.stringify(site.members, null, 2) + ';';
      copyText(code, t('copied') + ' (Config for GitHub)');
    },
    'auto-round': () => {
      const f = document.querySelector('form[data-form="plan"]');
      if (!f) return;
      const total = parseFloat(f.elements.totalCost.value) || 0;
      const seats = parseInt(f.elements.maxSlots.value, 10) || 1;
      if (total > 0) {
        f.elements.perPerson.value = Math.ceil(total / seats);
        updatePlanPreview();
        toast(t('chargePerMember') + ': ' + fmt(Math.ceil(total / seats)));
      }
    },
    'export': () => {
      const blob = new Blob([JSON.stringify({ app: 'subm8', site: CFG.id, exportedAt: new Date().toISOString(), data: site, host }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'subm8-' + CFG.id + '-' + ymNow() + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast(t('backupDownloaded'));
    },
    'import': () => { const i = document.getElementById('importFile'); if (i) i.click(); },
    'reset': () => {
      requireHost(() => {
        confirmModal({
          title: t('resetWarningTitle'),
          message: t('resetWarning'),
          confirmLabel: t('resetBtn'),
          danger: true,
          onConfirm: () => {
            site = defaultSite();
            save();
            render();
            toast(t('resetDefaults'));
          }
        });
      }, t('resetDefaults'));
    }
  };

  const forms = {
    pin(f) {
      const entered = (f.elements.pin.value || '').trim();
      if (SM.unlockHost(host, entered)) {
        closeModal();
        render();
        toast(t('hostUnlocked'));
        if (typeof pendingHostAction === 'function') {
          const cb = pendingHostAction;
          pendingHostAction = null;
          cb();
        }
      } else {
        const err = document.getElementById('pinError');
        if (err) err.style.display = 'block';
        const inp = document.getElementById('pinInput');
        if (inp) { inp.value = ''; inp.focus(); }
      }
    },
    member(f) {
      const el = f.elements;
      const id = el.id.value;
      const data = { name: el.name.value.trim(), contact: el.contact.value.trim(), note: el.note.value.trim() };
      if (!data.name) return;
      if (id) {
        const existing = site.members.find((m) => m.id === id);
        if (existing) Object.assign(existing, data);
      } else {
        site.members.push(Object.assign({ id: uid('m') }, data));
      }
      save();
      closeModal();
      render();
      toast(id ? t('memberUpdated') : t('memberAdded'));
    },
    plan(f) {
      if (!SM.isHostUnlocked(host)) {
        pinModal(() => forms.plan(f), t('saveChanges'));
        return;
      }
      const el = f.elements;
      const total = parseFloat(el.totalCost.value);
      if (!(total > 0)) { toast('Enter a valid monthly cost', 'error'); return; }
      site.plan = {
        name: el.name.value.trim() || CFG.plan.name,
        totalCost: total,
        perPerson: parseFloat(el.perPerson.value) || 0,
        maxSlots: Math.max(1, parseInt(el.maxSlots.value, 10) || 1),
        billingDay: Math.min(31, Math.max(1, parseInt(el.billingDay.value, 10) || 1)),
        hostShares: el.hostShares ? el.hostShares.checked : false,
        notes: el.notes ? el.notes.value.trim() : ''
      };
      save();
      render();
      toast(t('planUpdated'));
    },
    host(f) {
      ['name', 'title', 'hours', 'line', 'phone', 'email', 'facebook', 'instagram', 'promptPay', 'bankName', 'bankAccount', 'template']
        .forEach((k) => {
          if (f.elements[k]) host[k] = f.elements[k].value.trim();
        });
      if (f.elements.pin) host.pin = f.elements.pin.value.trim() || host.pin || '1234';
      if (!host.name) host.name = SM.DEFAULT_HOST.name;
      if (!host.template) host.template = SM.DEFAULT_HOST.template;
      SM.saveHost(host);
      closeModal();
      render();
      toast(t('hostSaved'));
    },
    message(f, submitter) {
      const who = f.elements.name.value.trim() || 'a family member';
      const text = f.elements.text.value.trim();
      if (!text) { toast('Write a message first', 'error'); return; }
      const full = 'Hi ' + host.name + ', this is ' + who + ' (' + CFG.short + ').\n\n' + text;
      if (submitter && submitter.dataset.mode === 'email') {
        if (!host.email) { toast('No email set — copied for chat instead', 'error'); copyText(full, t('copied')); return; }
        window.location.href = 'mailto:' + host.email + '?subject=' + encodeURIComponent(CFG.short + ' — message from ' + who) + '&body=' + encodeURIComponent(full);
      } else {
        copyText(full, t('copied'));
      }
    }
  };

  function updatePlanPreview() {
    const f = document.querySelector('form[data-form="plan"]');
    const box = document.getElementById('planBreakdown');
    if (!f || !box) return;
    const el = f.elements;
    box.innerHTML = breakdownHtml({
      totalCost: parseFloat(el.totalCost.value) || 0,
      perPerson: parseFloat(el.perPerson.value) || 0,
      maxSlots: parseInt(el.maxSlots.value, 10) || 1,
      billingDay: parseInt(el.billingDay.value, 10) || 1,
      hostShares: el.hostShares ? el.hostShares.checked : false
    });
  }

  // ------------------------------------------------------------------------
  // Events
  // ------------------------------------------------------------------------
  document.addEventListener('click', (e) => {
    if (SM.handleAboutClick && SM.handleAboutClick(e)) return;
    if (e.target.classList && e.target.classList.contains('modal-overlay')) { closeModal(); return; }

    // Explicitly handle type="submit" buttons (especially outside forms like in modal footers)
    const submitBtn = e.target.closest('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
      const formId = submitBtn.getAttribute('form');
      const form = formId ? document.getElementById(formId) : submitBtn.closest('form');
      if (form && form.dataset && forms[form.dataset.form]) {
        e.preventDefault();
        if (form.reportValidity && !form.reportValidity()) return;
        forms[form.dataset.form](form, submitBtn);
        return;
      }
    }

    const el = e.target.closest('[data-action]');
    if (!el) return;
    const fn = actions[el.dataset.action];
    if (!fn) return;
    e.preventDefault();
    if (el.dataset.action === 'open-host' && document.getElementById('modalRoot')) closeModal();
    fn(el.dataset.id, el, e);
  });

  document.addEventListener('submit', (e) => {
    const f = e.target.closest('form[data-form]');
    if (!f || !forms[f.dataset.form]) return;
    e.preventDefault();
    forms[f.dataset.form](f, e.submitter);
  });

  document.addEventListener('input', (e) => {
    if (e.target.id === 'searchInput') {
      ui.query = e.target.value;
      const rows = document.getElementById('payRows');
      if (rows) rows.innerHTML = payRows();
    } else if (e.target.closest && e.target.closest('form[data-form="plan"]')) {
      updatePlanPreview();
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.id === 'importFile' && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const j = JSON.parse(reader.result);
          const d = j.data || j;
          if (!d.plan || !Array.isArray(d.members)) throw new Error('bad file');
          site = Object.assign(defaultSite(), d);
          if (j.host) { host = Object.assign({}, SM.DEFAULT_HOST, j.host); SM.saveHost(host); }
          save(); closeModal(); render(); toast(t('backupRestored'));
        } catch (err) { toast(t('invalidBackup'), 'error'); }
      };
      reader.readAsText(e.target.files[0]);
    }
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  render();
})();
