/**
 * subm8 — family site application
 * One module powering every family site; behaviour & data come from window.SITE_CONFIG.
 */
(function () {
  'use strict';

  const SM = window.SM;
  const CFG = window.SITE_CONFIG;
  const { icon, esc, fmt, ymNow, monthLabel, shiftMonth, avatar, toast, copyText } = SM;

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
    try { localStorage.setItem(SITE_KEY, JSON.stringify(site)); }
    catch (e) { toast('Could not save to this browser', 'error'); }
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

  function isPaid(month, id) {
    return !!(site.payments[month] && site.payments[month][id] && site.payments[month][id].paid);
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
        <a class="brand" href="${esc(CFG.hubHref)}" aria-label="All family sites">
          <span class="brand-logo">${icon(CFG.logoIcon)}</span>
          <span>
            <span class="brand-name" style="display:block">${esc(CFG.short)}</span>
            <span class="brand-sub" style="display:block">Family sharing manager</span>
          </span>
        </a>
        <div class="topbar-spacer"></div>
        <div class="topbar-actions">
          <a class="site-switch" href="${esc(CFG.switchTo.href)}" title="Switch to ${esc(CFG.switchTo.label)}">
            ${icon(CFG.switchTo.icon, 'sm')}<span>${esc(CFG.switchTo.label)}</span>
          </a>
          ${unlocked
            ? `<button class="btn btn-soft btn-sm host-pill unlocked" data-action="host-lock" title="Host Mode unlocked · Click to lock">${icon('crown', 'sm')}<span>Host Mode</span>${icon('lock', 'sm')}</button>`
            : `<button class="btn btn-ghost btn-sm host-pill" data-action="host-login" title="Host login with PIN">${icon('lock', 'sm')}<span>Host login</span></button>`}
          <button class="btn btn-primary" data-action="open-contact">${icon('message', 'sm')}<span>Contact host</span></button>
          <button class="icon-btn" data-action="open-host" title="Host profile &amp; payment details" aria-label="Host profile">${icon('settings')}</button>
          <button class="icon-btn" data-action="open-backup" title="Backup &amp; restore" aria-label="Backup and restore">${icon('download')}</button>
        </div>
      </div>
    </header>`;
  }

  function hero(st) {
    const R = 42, C = 2 * Math.PI * R, dash = (C * st.pct) / 100;
    return `
    <section class="hero" aria-label="Overview">
      <div class="container hero-inner">
        <div>
          <span class="hero-eyebrow">${icon('calendar', 'sm')} ${esc(monthLabel(ui.month))}</span>
          <h1>${esc(CFG.brand)}</h1>
          <p>${esc(CFG.tagline)}</p>
          <div class="hero-chips">
            <div class="hero-chip"><div class="k">Plan cost</div><div class="v">${fmt(site.plan.totalCost)}<small style="font-size:12px;opacity:.7;font-weight:500"> /mo</small></div></div>
            <div class="hero-chip"><div class="k">Per member</div><div class="v">${fmt(st.pp)}</div></div>
            <div class="hero-chip"><div class="k">Due day</div><div class="v">${esc(site.plan.billingDay)}</div></div>
            <div class="hero-chip"><div class="k">Seats</div><div class="v">${site.members.length + (site.plan.hostShares ? 1 : 0)} / ${esc(site.plan.maxSlots)}</div></div>
          </div>
        </div>
        <div class="ring-wrap" role="img" aria-label="${st.pct}% of members have paid">
          <svg viewBox="0 0 100 100"><circle class="ring-bg" cx="50" cy="50" r="${R}"/><circle class="ring-fg" cx="50" cy="50" r="${R}" stroke-dasharray="${dash} ${C}"/></svg>
          <div class="ring-label"><b>${st.pct}%</b><span>${st.paid} of ${st.n} paid</span></div>
        </div>
      </div>
    </section>`;
  }

  function kpis(st) {
    const netLabel = st.net < 0 ? 'Surplus' : 'Your net cost';
    const netVal = Math.abs(st.net);
    return `
    <section class="kpis" aria-label="Key figures">
      <div class="kpi"><div class="kpi-top"><span class="kpi-label">Collected</span><span class="kpi-ic green">${icon('check', 'sm')}</span></div>
        <div class="kpi-value">${fmt(st.collected)}</div><div class="kpi-sub">${st.paid} of ${st.n} members paid</div></div>
      <div class="kpi"><div class="kpi-top"><span class="kpi-label">Outstanding</span><span class="kpi-ic amber">${icon('clock', 'sm')}</span></div>
        <div class="kpi-value">${fmt(st.outstanding)}</div><div class="kpi-sub">${st.unpaid} member${st.unpaid === 1 ? '' : 's'} to follow up</div></div>
      <div class="kpi"><div class="kpi-top"><span class="kpi-label">Plan cost</span><span class="kpi-ic accent">${icon('wallet', 'sm')}</span></div>
        <div class="kpi-value">${fmt(st.total)}</div><div class="kpi-sub">Billed on day ${esc(site.plan.billingDay)} each month</div></div>
      <div class="kpi"><div class="kpi-top"><span class="kpi-label">${netLabel}</span><span class="kpi-ic slate">${icon('shield', 'sm')}</span></div>
        <div class="kpi-value">${fmt(netVal)}</div><div class="kpi-sub">When all ${st.n} members pay ${fmt(st.pp)}</div></div>
    </section>`;
  }

  function tabsNav() {
    const t = (id, ic, label, count) =>
      `<button class="tab ${ui.tab === id ? 'active' : ''}" data-action="tab" data-id="${id}" role="tab" aria-selected="${ui.tab === id}">
         ${icon(ic, 'sm')}<span>${label}</span>${count != null ? `<span class="count">${count}</span>` : ''}
       </button>`;
    return `<nav class="tabs" role="tablist">
      ${t('payments', 'wallet', 'Payments', null)}
      ${t('members', 'users', 'Members', site.members.length)}
      ${t('plan', 'sliders', 'Plan &amp; billing', null)}
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
      return `<div class="empty"><b>No members yet</b>Add the people who share this plan in the Members tab.</div>`;
    }
    const list = filteredMembers();
    if (!list.length) {
      return `<div class="empty"><b>No matching members</b>Try a different search or filter.</div>`;
    }
    const pp = perMember();
    const unlocked = SM.isHostUnlocked(host);
    const head = `<div class="row head"><div>Member</div><div>Amount</div><div>Status</div><div style="text-align:right">Actions</div></div>`;
    return head + list.map((m) => {
      const paid = isPaid(ui.month, m.id);
      return `
      <div class="row">
        <div class="who">${avatar(m.name)}<div style="min-width:0"><div class="who-name">${esc(m.name)}</div><div class="who-meta">${esc(m.contact || m.note || 'No contact added')}</div></div></div>
        <div class="amt">${fmt(pp)}</div>
        <div><span class="badge ${paid ? 'paid' : 'pending'}">${paid ? 'Paid' : 'Unpaid'}</span></div>
        <div class="acts">
          ${unlocked
            ? (paid
                ? `<button class="btn btn-ghost btn-sm" data-action="toggle-paid" data-id="${m.id}">Undo</button>`
                : `<button class="btn btn-success btn-sm" data-action="toggle-paid" data-id="${m.id}">${icon('check', 'sm')}Mark paid</button>`)
            : `<button class="btn btn-soft btn-sm" data-action="bill" data-id="${m.id}">${icon('qr', 'sm')}${paid ? 'Invoice' : 'Pay'}</button>`}
          <button class="icon-btn" data-action="bill" data-id="${m.id}" title="Invoice &amp; PromptPay QR" aria-label="Invoice and QR for ${esc(m.name)}">${icon('qr')}</button>
          <button class="icon-btn" data-action="remind" data-id="${m.id}" title="Copy reminder message" aria-label="Copy reminder for ${esc(m.name)}">${icon('copy')}</button>
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
      <button class="hbar ${ym === ui.month ? 'current' : ''}" data-action="goto-month" data-id="${ym}" title="${esc(monthLabel(ym))}: ${paid}/${n} paid">
        <div class="hbar-track"><div class="hbar-fill" style="height:${Math.max(pct, 0)}%"></div></div>
        <div class="hbar-m">${esc(monthLabel(ym, true))}</div>
        <div class="hbar-v">${paid}/${n}</div>
      </button>`);
    }
    return `<div class="history"><div class="history-title">Last 6 months · collection rate</div><div class="history-bars">${bars.join('')}</div></div>`;
  }

  function paymentsTab() {
    const unlocked = SM.isHostUnlocked(host);
    return `
    <div class="panel ${ui.anim ? 'anim' : ''}">
      <div class="panel-head">
        <div>
          <div class="panel-title">Monthly payments</div>
          <div class="panel-desc">Track who has paid for ${esc(monthLabel(ui.month))}.</div>
        </div>
        <div class="month-nav">
          <button class="icon-btn" data-action="prev-month" aria-label="Previous month">${icon('chevL', 'sm')}</button>
          <div class="month-label">${esc(monthLabel(ui.month))}</div>
          <button class="icon-btn" data-action="next-month" aria-label="Next month">${icon('chevR', 'sm')}</button>
          <button class="btn btn-soft btn-sm" data-action="today">Today</button>
        </div>
      </div>
      <div class="toolbar">
        <div class="toolbar-left">
          <label class="search">${icon('search', 'sm')}<input id="searchInput" type="search" placeholder="Search members" value="${esc(ui.query)}" aria-label="Search members"></label>
          <div class="segmented" role="group" aria-label="Filter">
            ${['all', 'pending', 'paid'].map((f) =>
              `<button class="${ui.filter === f ? 'active' : ''}" data-action="filter" data-id="${f}">${{ all: 'All', pending: 'Unpaid', paid: 'Paid' }[f]}</button>`).join('')}
          </div>
        </div>
        <div class="toolbar-right">
          <button class="btn btn-secondary btn-sm" data-action="copy-pending">${icon('bell', 'sm')}Copy unpaid summary</button>
          ${unlocked ? `<button class="btn btn-secondary btn-sm" data-action="mark-all">${icon('check', 'sm')}Mark all paid</button>` : ''}
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
      ? `<div class="row head members"><div>Member</div><div>Contact</div><div>Monthly</div><div style="text-align:right">Actions</div></div>` +
        site.members.map((m) => `
        <div class="row members">
          <div class="who">${avatar(m.name)}<div style="min-width:0"><div class="who-name">${esc(m.name)}</div><div class="who-meta">${esc(m.note || 'Family member')}</div></div></div>
          <div class="who-meta">${esc(m.contact || '—')}</div>
          <div class="amt">${fmt(pp)}</div>
          <div class="acts">
            <button class="icon-btn" data-action="edit-member" data-id="${m.id}" title="${unlocked ? 'Edit' : 'Edit (Host passcode required)'}" aria-label="Edit ${esc(m.name)}">${icon('edit')}</button>
            ${unlocked ? `<button class="icon-btn" data-action="del-member" data-id="${m.id}" title="Remove" aria-label="Remove ${esc(m.name)}">${icon('trash')}</button>` : ''}
          </div>
        </div>`).join('')
      : `<div class="empty"><b>No members yet</b>Add the first person who shares this plan.</div>`;
    return `
    <div class="panel ${ui.anim ? 'anim' : ''}">
      <div class="panel-head">
        <div>
          <div class="panel-title">Family members</div>
          <div class="panel-desc">Everyone sharing the ${esc(CFG.short)} plan.</div>
        </div>
        <button class="btn ${unlocked ? 'btn-primary' : 'btn-secondary'}" data-action="add-member">${icon(unlocked ? 'plus' : 'lock', 'sm')}${unlocked ? 'Add member' : 'Add member'}</button>
      </div>
      <div class="panel-body" style="padding-bottom:6px">
        <div class="seat-meter">
          <div class="seat-head"><span>Seats used</span><span style="color:${over ? 'var(--red)' : 'inherit'}">${used} of ${max}${over ? ' · over capacity' : ''}</span></div>
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
      <div class="bk-row"><span>Plan cost</span><b>${fmt(plan.totalCost)} / month</b></div>
      <div class="bk-row"><span>Seats</span><b>${seats}</b></div>
      <div class="bk-row"><span>Exact split (${fmt(plan.totalCost)} ÷ ${seats})</span><b>${fmt(Math.round(exact * 100) / 100)}</b></div>
      <div class="bk-row total"><span>Charged per member</span><b>${fmt(pp)}</b></div>
      <div class="bk-row"><span>Members enrolled</span><b>${n}</b></div>
      <div class="bk-row"><span>Collected when everyone pays</span><b>${fmt(receivable)}</b></div>
      <div class="bk-row"><span>${net < 0 ? 'Surplus' : 'Your net cost'}</span><b>${fmt(Math.abs(net))}</b></div>
      <div class="bk-row"><span>Billing date</span><b>Day ${esc(plan.billingDay)} of each month</b></div>`;
  }

  function planTab() {
    const p = site.plan;
    const unlocked = SM.isHostUnlocked(host);
    return `
    <div class="panel ${ui.anim ? 'anim' : ''}">
      <div class="panel-head">
        <div>
          <div class="panel-title">Plan &amp; billing</div>
          <div class="panel-desc">Subscription pricing and split details.</div>
        </div>
        ${!unlocked ? `<button class="btn btn-secondary btn-sm" data-action="host-login">${icon('lock', 'sm')}Unlock to edit</button>` : ''}
      </div>
      <div class="panel-body">
        ${!unlocked ? `
        <div class="banner-locked">
          <div>
            <strong>${icon('lock', 'sm')} Member view</strong>
            <div>Subscription settings and seat allocation are managed by your host.</div>
          </div>
          <button class="btn btn-soft btn-sm" data-action="host-login">${icon('unlock', 'sm')}Host login</button>
        </div>` : ''}
        <div class="grid-2">
          <form data-form="plan" autocomplete="off">
            <div class="field"><label for="pName">Plan name</label><input class="input" id="pName" name="name" value="${esc(p.name)}" ${unlocked ? 'required' : 'readonly'}></div>
            <div class="field-row">
              <div class="field"><label for="pTotal">Monthly cost</label>
                <div class="input-affix"><span class="affix">฿</span><input class="input" id="pTotal" name="totalCost" type="number" min="0" step="0.01" value="${esc(p.totalCost)}" ${unlocked ? 'required' : 'readonly'}></div></div>
              <div class="field"><label for="pSlots">Seats available</label><input class="input" id="pSlots" name="maxSlots" type="number" min="1" max="20" value="${esc(p.maxSlots)}" ${unlocked ? 'required' : 'readonly'}></div>
            </div>
            <div class="field"><label for="pPer">Charge per member</label>
              <div style="display:flex;gap:10px">
                <div class="input-affix" style="flex:1"><span class="affix">฿</span><input class="input" id="pPer" name="perPerson" type="number" min="0" step="0.01" value="${esc(p.perPerson || '')}" placeholder="Auto" ${unlocked ? '' : 'readonly'}></div>
                ${unlocked ? `<button class="btn btn-secondary" type="button" data-action="auto-round">Round up</button>` : ''}
              </div>
              <div class="hint">Leave empty to split equally. “Round up” uses cost ÷ seats, rounded up.</div></div>
            <div class="field"><label for="pDay">Billing day of month</label><input class="input" id="pDay" name="billingDay" type="number" min="1" max="31" value="${esc(p.billingDay)}" ${unlocked ? 'required' : 'readonly'}></div>
            <div class="toggle-row"><div><b>I take one seat</b><small>The host is part of the family plan and covers the remainder.</small></div>
              <label class="switch"><input type="checkbox" name="hostShares" ${p.hostShares ? 'checked' : ''} ${unlocked ? '' : 'disabled'}><span></span></label></div>
            <div class="field"><label for="pNotes">Notes</label><textarea class="textarea" id="pNotes" name="notes" rows="3" ${unlocked ? '' : 'readonly'}>${esc(p.notes || '')}</textarea></div>
            ${unlocked ? `<button class="btn btn-primary" type="submit">Save changes</button>` : `<button class="btn btn-secondary" type="button" data-action="host-login">${icon('lock', 'sm')}Unlock Host Mode to edit</button>`}
          </form>
          <div>
            <div class="section-label" style="margin-top:0;padding-top:0">How it breaks down</div>
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
            ? chans.map((c) => `<a class="btn btn-secondary btn-sm" href="${esc(c.href)}" ${c.key === 'phone' || c.key === 'email' ? '' : 'target="_blank" rel="noopener"'}>${icon(c.icon, 'sm')}${c.label}</a>`).join('')
            : `<button class="btn btn-secondary btn-sm" data-action="open-host">${icon('plus', 'sm')}Add contact details</button>`}
          <a class="btn btn-ghost btn-sm" href="${esc(CFG.hubHref)}">${icon('home', 'sm')}All families</a>
        </div>
        <div class="footer-copy">subm8 · ${unlocked ? '<span class="mode-tag unlocked">' + icon('crown', 'sm') + 'Host Mode active (<a href="#" data-action="host-lock">Lock</a>)</span>' : '<span class="mode-tag">' + icon('lock', 'sm') + 'Member view (<a href="#" data-action="host-login">Host login</a>)</span>'} · Data is stored privately in this browser.</div>
      </div>
    </footer>`;
  }

  function render() {
    const st = stats(ui.month);
    const body = ui.tab === 'members' ? membersTab() : ui.tab === 'plan' ? planTab() : paymentsTab();
    app.innerHTML = header() + hero(st) +
      `<main class="container">${kpis(st)}${tabsNav()}${body}</main>` + footer();
    ui.anim = false;
  }

  // ------------------------------------------------------------------------
  // Modals
  // ------------------------------------------------------------------------
  function openModal(o) {
    closeModal();
    const el = document.createElement('div');
    el.className = 'modal-overlay';
    el.id = 'modalRoot';
    el.innerHTML = `
      <div class="modal ${o.wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(o.title)}">
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

  function contactModal() {
    const chans = SM.contactChannels(host);
    const anySet = chans.some((c) => c.value);
    const items = chans.map((c) => c.value
      ? `<div class="contact-item">
           <a class="contact-link" href="${esc(c.href)}" ${c.key === 'phone' || c.key === 'email' ? '' : 'target="_blank" rel="noopener"'}>
             <span class="contact-ic ${c.cls}">${icon(c.icon)}</span>
             <span class="contact-main"><small>${c.label}</small><b>${esc(c.value)}</b></span>
           </a>
           <button class="icon-btn" type="button" data-action="copy" data-copy="${esc(c.value)}" title="Copy" aria-label="Copy ${c.label}">${icon('copy', 'sm')}</button>
         </div>`
      : `<div class="contact-item unset"><span class="contact-ic ${c.cls}">${icon(c.icon)}</span><span class="contact-main"><small>${c.label}</small><b>Not set</b></span></div>`
    ).join('');
    openModal({
      title: 'Contact your host',
      sub: 'Questions about payments, seats or joining the plan? Reach out any time.',
      body: `
        <div class="host-card">${avatar(host.name)}<div><b>${esc(host.name)}</b><span>${esc(host.title)}</span><br><span>${esc(host.hours)}</span></div></div>
        <div class="contact-list">${items}</div>
        ${anySet ? '' : `<div class="contact-note">${icon('plus', 'sm')}<span>No contact details yet. <a href="#" data-action="open-host" style="color:var(--accent);font-weight:600">Add yours</a> so family members can reach you.</span></div>`}
        <div class="section-label">Send a quick message</div>
        <form data-form="message">
          <div class="field"><label for="msgName">Your name</label><input class="input" id="msgName" name="name" placeholder="Who is this from?"></div>
          <div class="field"><label for="msgText">Message</label><textarea class="textarea" id="msgText" name="text" rows="3" placeholder="e.g. I've paid this month's share — slip attached."></textarea></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary" type="submit" data-mode="email">${icon('mail', 'sm')}Send by email</button>
            <button class="btn btn-secondary" type="submit" data-mode="copy">${icon('copy', 'sm')}Copy for LINE / chat</button>
          </div>
        </form>`,
      wide: true,
      focus: false
    });
  }

  function memberModal(id) {
    const m = id ? site.members.find((x) => x.id === id) : null;
    openModal({
      title: m ? 'Edit member' : 'Add member',
      sub: m ? 'Update this person’s details.' : 'Add someone who shares this plan.',
      body: `
        <form data-form="member" id="memberForm" autocomplete="off">
          <input type="hidden" name="id" value="${m ? esc(m.id) : ''}">
          <div class="field"><label for="mName">Name</label><input class="input" id="mName" name="name" value="${m ? esc(m.name) : ''}" required placeholder="Full name or nickname"></div>
          <div class="field"><label for="mContact">Contact (LINE, phone or email)</label><input class="input" id="mContact" name="contact" value="${m ? esc(m.contact || '') : ''}" placeholder="e.g. LINE: somchai.k"></div>
          <div class="field"><label for="mNote">Note</label><input class="input" id="mNote" name="note" value="${m ? esc(m.note || '') : ''}" placeholder="e.g. Pays on the 1st"></div>
        </form>`,
      foot: `<button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" form="memberForm">${m ? 'Save changes' : 'Add member'}</button>`
    });
  }

  function hostModal() {
    const f = (id, name, label, ph, hint) =>
      `<div class="field"><label for="${id}">${label}</label><input class="input" id="${id}" name="${name}" value="${esc(host[name])}" placeholder="${esc(ph || '')}">${hint ? `<div class="hint">${hint}</div>` : ''}</div>`;
    openModal({
      title: 'Host profile & settings',
      sub: 'Shared across every family site on this browser.',
      wide: true,
      body: `
        <form data-form="host" id="hostForm" autocomplete="off">
          <div class="section-label">About you</div>
          <div class="field-row">${f('hName', 'name', 'Display name', 'Your name')}${f('hTitle', 'title', 'Role / tagline', 'Family plan host')}</div>
          ${f('hHours', 'hours', 'Availability note', 'Usually replies within a few hours')}
          <div class="section-label">Contact channels</div>
          <div class="field-row">${f('hLine', 'line', 'LINE ID', '@yourid')}${f('hPhone', 'phone', 'Phone', '08x-xxx-xxxx')}</div>
          ${f('hEmail', 'email', 'Email', 'you@example.com')}
          <div class="field-row">${f('hFb', 'facebook', 'Facebook', 'username or full URL')}${f('hIg', 'instagram', 'Instagram', '@username')}</div>
          <div class="section-label">Payment details</div>
          ${f('hPay', 'promptPay', 'PromptPay (phone or 13-digit ID)', '0812345678', 'Used to generate a scannable QR code with the exact amount.')}
          <div class="field-row">${f('hBank', 'bankName', 'Bank', 'e.g. Kasikorn')}${f('hAcc', 'bankAccount', 'Account number', 'xxx-x-xxxxx-x')}</div>
          <div class="section-label">Host Security &amp; Passcode</div>
          <div class="field"><label for="hPin">Host PIN / Passcode</label><input class="input" id="hPin" name="pin" type="text" maxlength="12" value="${esc(host.pin || '1234')}" placeholder="1234">
            <div class="hint">Passcode required to edit members, prices, host details, or mark payments. Default is <b>1234</b>.</div></div>
          <div class="section-label">Reminder message</div>
          <div class="field"><label for="hTpl">Template</label><textarea class="textarea" id="hTpl" name="template" rows="7">${esc(host.template)}</textarea>
            <div class="hint">Placeholders: {name} {plan} {month} {amount} {due} {promptpay} {bank} {account}</div></div>
        </form>`,
      foot: `<button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" form="hostForm">Save profile</button>`
    });
  }

  function backupModal() {
    openModal({
      title: 'Backup & restore',
      sub: 'Your data lives in this browser. Keep a copy somewhere safe.',
      body: `
        <div class="contact-list">
          <div class="contact-item"><span class="contact-ic phone">${icon('download')}</span>
            <span class="contact-main"><small>Export</small><b>Download a JSON backup</b></span>
            <button class="btn btn-secondary btn-sm" data-action="export">Download</button></div>
          <div class="contact-item"><span class="contact-ic mail">${icon('upload')}</span>
            <span class="contact-main"><small>Import</small><b>Restore from a backup file</b></span>
            <button class="btn btn-secondary btn-sm" data-action="import">Choose file</button></div>
          <div class="contact-item"><span class="contact-ic" style="background:var(--red)">${icon('trash')}</span>
            <span class="contact-main"><small>Reset</small><b>Restore this site's defaults</b></span>
            <button class="btn btn-danger btn-sm" data-action="reset">Reset</button></div>
        </div>
        <input type="file" id="importFile" accept="application/json,.json" hidden>`,
      foot: `<button class="btn btn-secondary" data-action="close-modal">Close</button>`,
      focus: false
    });
  }

  function billModal(id) {
    const m = site.members.find((x) => x.id === id);
    if (!m) return;
    const pp = perMember();
    const paid = isPaid(ui.month, m.id);
    const msg = buildMessage(m);
    const unlocked = SM.isHostUnlocked(host);
    openModal({
      title: 'Invoice',
      sub: monthLabel(ui.month) + ' · ' + site.plan.name,
      wide: true,
      focus: false,
      body: `
        <div class="bill">
          <div class="bill-head">${avatar(m.name)}<div><b>${esc(m.name)}</b><div class="who-meta">${esc(m.contact || '')}</div></div>
            <span class="badge ${paid ? 'paid' : 'pending'}" style="margin-left:auto">${paid ? 'Paid' : 'Unpaid'}</span></div>
          <div class="bill-line"><span>${esc(site.plan.name)}</span><span>${fmt(pp)}</span></div>
          <div class="bill-total"><span>Total due</span><b>${fmt(pp)}</b></div>
        </div>
        <div class="qr-card" id="qrCard">
          <span class="qr-badge">PromptPay</span>
          <div id="qrBox"></div>
          <div class="qr-meta">
            <div class="line"><span>PromptPay</span><b>${esc(host.promptPay || 'Not set')}</b>${host.promptPay ? `<button class="icon-btn" style="width:28px;height:28px" data-action="copy" data-copy="${esc(host.promptPay)}" aria-label="Copy PromptPay">${icon('copy', 'sm')}</button>` : ''}</div>
            ${host.bankAccount ? `<div class="line"><span>${esc(host.bankName || 'Bank')}</span><b>${esc(host.bankAccount)}</b><button class="icon-btn" style="width:28px;height:28px" data-action="copy" data-copy="${esc(host.bankAccount)}" aria-label="Copy account number">${icon('copy', 'sm')}</button></div>` : ''}
          </div>
        </div>
        <div class="field"><label for="billMsg">Reminder message</label><textarea class="textarea" id="billMsg" rows="7" readonly>${esc(msg)}</textarea></div>
        <button class="btn btn-secondary btn-sm" data-action="copy" data-copy="${esc(msg)}">${icon('copy', 'sm')}Copy message</button>`,
      foot: `<button class="btn btn-secondary" data-action="close-modal">Close</button>
             ${unlocked
               ? `<button class="btn ${paid ? 'btn-secondary' : 'btn-success'}" data-action="toggle-paid-close" data-id="${m.id}">${paid ? 'Mark as unpaid' : 'Mark as paid'}</button>`
               : `<button class="btn btn-primary" data-action="open-contact">${icon('message', 'sm')}Send slip to host</button>`}`
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
      box.innerHTML = `<div class="qr-fallback">Add your PromptPay number in <a href="#" data-action="open-host" style="color:var(--accent);font-weight:600">Host profile</a> to show a scannable QR code.</div>`;
      return;
    }
    const size = 220;
    const img = document.createElement('img');
    img.id = 'qrImage';
    img.className = 'qr-img';
    img.width = size; img.height = size;
    img.alt = 'PromptPay QR code for ' + fmt(amount);
    img.onerror = () => {
      box.innerHTML = `<div class="qr-fallback">QR image needs an internet connection.<br>Transfer ${fmt(amount)} to <b>${esc(host.promptPay)}</b>.</div>`;
    };
    img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size + '&margin=0&data=' + encodeURIComponent(payload);
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
    return '📢 ' + site.plan.name + ' · ' + monthLabel(ui.month) + '\n\nUnpaid (' + pending.length + '):\n' + lines +
      '\n\nTotal outstanding: ' + fmt(pp * pending.length) +
      (host.promptPay ? '\nPromptPay: ' + host.promptPay : '') +
      (host.bankAccount ? '\n' + (host.bankName || 'Bank') + ': ' + host.bankAccount : '') +
      '\n\nThank you! 🙏';
  }

  // ------------------------------------------------------------------------
  // Host Security & PIN Verification
  // ------------------------------------------------------------------------
  let pendingHostAction = null;

  function pinModal(onSuccess, actionName) {
    pendingHostAction = onSuccess || null;
    openModal({
      title: 'Host Verification',
      sub: actionName ? 'Enter passcode to ' + actionName + '.' : 'Enter your 4-digit host passcode to unlock host controls.',
      body: `
        <form data-form="pin" id="pinForm" autocomplete="off">
          <input class="input pin-input" id="pinInput" name="pin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="12" placeholder="••••" required autofocus>
          <div class="pin-note">Default passcode is <b>1234</b>. You can change this anytime in Host Settings.</div>
          <div id="pinError" style="display:none;color:var(--red);text-align:center;font-size:13px;font-weight:600;margin-top:6px">${icon('close', 'sm')} Incorrect passcode. Please try again.</div>
        </form>`,
      foot: `<button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" form="pinForm">${icon('unlock', 'sm')}Unlock Host Mode</button>`
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
    'tab': (id) => { ui.tab = id; ui.anim = true; render(); },
    'filter': (id) => { ui.filter = id; render(); },
    'prev-month': () => { ui.month = shiftMonth(ui.month, -1); render(); },
    'next-month': () => { ui.month = shiftMonth(ui.month, 1); render(); },
    'today': () => { ui.month = ymNow(); render(); },
    'goto-month': (id) => { ui.month = id; render(); },
    'toggle-paid': (id) => {
      requireHost(() => {
        const paid = !isPaid(ui.month, id);
        setPaid(ui.month, id, paid); render();
        toast(paid ? 'Marked as paid' : 'Marked as unpaid');
      }, 'change payment status');
    },
    'toggle-paid-close': (id) => {
      requireHost(() => {
        const paid = !isPaid(ui.month, id);
        setPaid(ui.month, id, paid); closeModal(); render();
        toast(paid ? 'Marked as paid' : 'Marked as unpaid');
      }, 'change payment status');
    },
    'mark-all': () => {
      requireHost(() => {
        if (!site.members.length) return;
        if (confirm('Mark every member as paid for ' + monthLabel(ui.month) + '?')) {
          site.members.forEach((m) => setPaid(ui.month, m.id, true)); render(); toast('All members marked as paid');
        }
      }, 'mark all as paid');
    },
    'copy-pending': () => {
      const s = unpaidSummary();
      if (!s) { toast('Everyone has paid — nothing outstanding'); return; }
      copyText(s, 'Unpaid summary copied');
    },
    'remind': (id) => {
      const m = site.members.find((x) => x.id === id);
      if (m) copyText(buildMessage(m), 'Reminder for ' + m.name + ' copied');
    },
    'bill': (id) => billModal(id),
    'add-member': () => requireHost(() => memberModal(), 'add a member'),
    'edit-member': (id) => requireHost(() => memberModal(id), 'edit member details'),
    'del-member': (id) => {
      requireHost(() => {
        const m = site.members.find((x) => x.id === id);
        if (m && confirm('Remove ' + m.name + ' from this plan? Their payment history will be kept.')) {
          site.members = site.members.filter((x) => x.id !== id); save(); render(); toast('Member removed');
        }
      }, 'remove a member');
    },
    'open-contact': () => contactModal(),
    'open-host': () => requireHost(() => hostModal(), 'access host settings'),
    'host-login': () => pinModal(),
    'host-lock': () => { SM.lockHost(); render(); toast('Host Mode locked'); },
    'open-backup': () => backupModal(),
    'close-modal': () => closeModal(),
    'copy': (id, el) => copyText(el.dataset.copy, 'Copied'),
    'auto-round': () => {
      const f = document.querySelector('form[data-form="plan"]');
      const total = parseFloat(f.elements.totalCost.value) || 0;
      const seats = parseInt(f.elements.maxSlots.value, 10) || 1;
      if (total > 0) { f.elements.perPerson.value = Math.ceil(total / seats); updatePlanPreview(); toast('Rounded to ' + fmt(Math.ceil(total / seats)) + ' per member'); }
    },
    'export': () => {
      const blob = new Blob([JSON.stringify({ app: 'subm8', site: CFG.id, exportedAt: new Date().toISOString(), data: site, host }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'subm8-' + CFG.id + '-' + ymNow() + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast('Backup downloaded');
    },
    'import': () => { const i = document.getElementById('importFile'); if (i) i.click(); },
    'reset': () => {
      requireHost(() => {
        if (confirm('Reset this site to its defaults? Members and payment history will be replaced.')) {
          site = defaultSite(); save(); closeModal(); render(); toast('Reset to defaults');
        }
      }, 'reset data');
    }
  };

  const forms = {
    pin(f) {
      const entered = (f.elements.pin.value || '').trim();
      if (SM.unlockHost(host, entered)) {
        closeModal();
        render();
        toast('Host Mode unlocked');
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
      if (id) Object.assign(site.members.find((m) => m.id === id) || {}, data);
      else site.members.push(Object.assign({ id: uid('m') }, data));
      save(); closeModal(); render(); toast(id ? 'Member updated' : 'Member added');
    },
    plan(f) {
      if (!SM.isHostUnlocked(host)) {
        pinModal(() => forms.plan(f), 'save plan changes');
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
        hostShares: el.hostShares.checked,
        notes: el.notes.value.trim()
      };
      save(); render(); toast('Plan updated');
    },
    host(f) {
      ['name', 'title', 'hours', 'line', 'phone', 'email', 'facebook', 'instagram', 'promptPay', 'bankName', 'bankAccount', 'template']
        .forEach((k) => { host[k] = f.elements[k].value.trim(); });
      host.pin = (f.elements.pin ? f.elements.pin.value.trim() : host.pin) || '1234';
      if (!host.name) host.name = SM.DEFAULT_HOST.name;
      if (!host.template) host.template = SM.DEFAULT_HOST.template;
      SM.saveHost(host); closeModal(); render(); toast('Host profile saved');
    },
    message(f, submitter) {
      const who = f.elements.name.value.trim() || 'a family member';
      const text = f.elements.text.value.trim();
      if (!text) { toast('Write a message first', 'error'); return; }
      const full = 'Hi ' + host.name + ', this is ' + who + ' (' + CFG.short + ').\n\n' + text;
      if (submitter && submitter.dataset.mode === 'email') {
        if (!host.email) { toast('No email set — copied for chat instead', 'error'); copyText(full, 'Message copied'); return; }
        window.location.href = 'mailto:' + host.email + '?subject=' + encodeURIComponent(CFG.short + ' — message from ' + who) + '&body=' + encodeURIComponent(full);
      } else {
        copyText(full, 'Message copied — paste it into LINE or chat');
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
      hostShares: el.hostShares.checked
    });
  }

  // ------------------------------------------------------------------------
  // Events
  // ------------------------------------------------------------------------
  document.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('modal-overlay')) { closeModal(); return; }
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
          save(); closeModal(); render(); toast('Backup restored');
        } catch (err) { toast('That file is not a valid backup', 'error'); }
      };
      reader.readAsText(e.target.files[0]);
    }
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  render();
})();
