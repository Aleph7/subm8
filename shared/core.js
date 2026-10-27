/**
 * subm8 — shared core
 * Icons, formatting helpers, i18n, minimalist "About Me" Bento widget,
 * copy button checkmark morph, 5-tap confetti Easter egg, and host profile.
 */
(function (global) {
  'use strict';

  const HOST_KEY = 'submate.host.v2';

  const ICONS = {
    check: '<polyline points="20 6 9 17 4 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    message: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    chevL: '<polyline points="15 18 9 12 15 6"/>',
    chevR: '<polyline points="9 18 15 12 9 6"/>',
    chevD: '<polyline points="6 9 12 15 18 9"/>',
    arrowR: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    arrowL: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    wallet: '<path d="M20 12V8H6a2 2 0 0 1 0-4h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
    play: '<polygon points="6 4 20 12 6 20 6 4" fill="currentColor"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    clockSm: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    crown: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    sparkles: '<path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    coffee: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    graduation: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    refresh: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'
  };

  function icon(name, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || '') + '</svg>';
  }

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function fmt(n) {
    const v = Number(n) || 0;
    const whole = Math.abs(v - Math.round(v)) < 0.005;
    return '฿' + v.toLocaleString('en-US', {
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: 2
    });
  }

  function ymNow() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  const LANG_KEY = 'subm8.lang';

  const I18N = {
    th: {
      langBtn: 'TH',
      langTitle: 'เปลี่ยนเป็นภาษาอังกฤษ / Switch to English',
      brandSub: 'ระบบจัดการแชร์สตรีมมิ่ง & แฟมิลี่',
      allFamilies: 'หน้าหลักรวมแฟมิลี่',
      backToHub: 'รวมแฟมิลี่',
      contactHost: 'ติดต่อโฮสต์',
      hostLogin: 'โหมดโฮสต์',
      hostMode: 'โหมดโฮสต์',
      hostLock: 'ล็อกโหมดโฮสต์',
      hostSettings: 'ตั้งค่าโฮสต์ & บัญชีรับเงิน',
      backupRestore: 'สำรอง & กู้คืนข้อมูล',
      planCost: 'ค่าบริการรายเดือน',
      perMonth: ' / เดือน',
      perMember: 'คนละ',
      dueDay: 'ตัดรอบวันที่',
      dueEveryMonth: 'ทุกวันที่ {day}',
      seats: 'จำนวนที่นั่ง',
      paidCount: 'จ่ายแล้ว {paid} จาก {n} คน',
      allPaidBadge: 'จ่ายครบทุกคนแล้ว',
      collected: 'ยอดที่เก็บได้แล้ว',
      collectedSub: 'จ่ายแล้ว {paid} จาก {n} คน',
      outstanding: 'ยอดค้างชำระ',
      outstandingSub: 'รอโอนอีก {unpaid} คน',
      allSettledSub: 'เก็บครบเรียบร้อยแล้ว',
      planCostLabel: 'ค่าบริการรายเดือน',
      billedOnDay: 'ตัดรอบบิลทุกวันที่ {day} ของเดือน',
      netCost: 'ส่วนต่างที่โฮสต์ออก',
      surplus: 'ส่วนเกินสะสม',
      whenAllPay: 'เมื่อสมาชิกทั้ง {n} คนจ่ายคนละ {pp}',
      tabPayments: 'รายการชำระเงิน',
      tabMembers: 'สมาชิก',
      tabPlan: 'แพ็กเกจ & ราคา',
      tabAbout: 'เกี่ยวกับโฮสต์',
      monthlyPayments: 'การชำระเงินประจำเดือน',
      trackPaymentsDesc: 'ตรวจสอบสถานะการชำระเงินและสแกนจ่ายประจำเดือน {month}',
      today: 'เดือนปัจจุบัน',
      searchPlaceholder: 'ค้นหาชื่อสมาชิก หรือช่องทางติดต่อ...',
      filterAll: 'ทั้งหมด',
      filterPending: 'ค้างชำระ',
      filterPaid: 'จ่ายแล้ว',
      copyPending: 'คัดลอกรายชื่อค้างชำระ',
      markAllPaid: 'จ่ายครบทุกคน',
      confirmMarkAllTitle: 'ยืนยันบันทึกจ่ายครบทุกคน',
      confirmMarkAll: 'ต้องการทำเครื่องหมายว่าสมาชิกทุกคนจ่ายเงินสำหรับเดือน {month} เรียบร้อยแล้วใช่หรือไม่?',
      confirmBtn: 'ยืนยัน',
      historyTitle: 'สถิติการเก็บเงินย้อนหลัง 6 เดือน',
      noMembersYet: 'ยังไม่มีรายชื่อสมาชิก',
      noMembersYetSub: 'กดไปที่แท็บ "สมาชิก" เพื่อเพิ่มคนที่ร่วมหารแพ็กเกจนี้',
      noMatching: 'ไม่พบสมาชิกที่ค้นหา',
      noMatchingSub: 'ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองสถานะอื่น',
      member: 'สมาชิก',
      amount: 'ยอดชำระ',
      status: 'สถานะ',
      actions: 'การดำเนินการ',
      paid: 'จ่ายแล้ว',
      unpaid: 'รอชำระ',
      paidOn: 'เมื่อ {date}',
      undo: 'ยกเลิก',
      markPaid: 'จ่ายแล้ว',
      payNow: 'สแกนจ่าย',
      invoice: 'ใบแจ้งยอด',
      copyReminder: 'คัดลอกข้อความแจ้งยอด',
      reminderCopied: 'คัดลอกข้อความแจ้งยอดแล้ว',
      familyMembers: 'สมาชิกในแฟมิลี่',
      familyMembersDesc: 'รายชื่อสมาชิกที่ร่วมแชร์แพ็กเกจ {plan}',
      addMember: 'เพิ่มสมาชิก',
      editMember: 'แก้ไขข้อมูลสมาชิก',
      removeMember: 'ลบสมาชิก',
      confirmRemoveTitle: 'ลบสมาชิกออกจากกลุ่ม',
      confirmRemoveMember: 'ต้องการลบ "{name}" ออกจากแฟมิลี่นี้หรือไม่? (ประวัติการจ่ายเงินเดิมจะยังถูกเก็บไว้)',
      seatsUsed: 'จำนวนที่นั่งที่ใช้ไป',
      seatsOf: '{used} จาก {max} ที่นั่ง',
      overCapacity: ' · เกินจำนวนที่นั่งสูงสุด',
      noContactAdded: 'ยังไม่ได้ระบุช่องทางติดต่อ',
      familyMemberDefault: 'สมาชิกแฟมิลี่',
      planSettings: 'ตั้งค่าแพ็กเกจ & การหารเงิน',
      planSettingsDesc: 'ปรับราคาแพ็กเกจ จำนวนคนหาร และวันตัดรอบบิล',
      planName: 'ชื่อแพ็กเกจ',
      monthlyCost: 'ราคารวมต่อเดือน',
      seatsAvailable: 'จำนวนที่นั่งทั้งหมด (รวมโฮสต์)',
      chargePerMember: 'ยอดเก็บต่อคน',
      autoRound: 'ปัดเศษขึ้น',
      autoHint: 'เว้นว่างไว้เพื่อหารเท่ากันอัตโนมัติ หรือกด "ปัดเศษขึ้น" เพื่อปัดเศษสตางค์',
      billingDayOfMonth: 'วันที่ตัดรอบบิลของทุกเดือน',
      hostSharesSeat: 'โฮสต์ใช้งานด้วย 1 ที่นั่ง',
      hostSharesSeatSub: 'โฮสต์ร่วมใช้งานในกลุ่ม และรับผิดชอบส่วนต่างที่เหลือ',
      notes: 'หมายเหตุ / กติกาการแชร์',
      saveChanges: 'บันทึกการเปลี่ยนแปลง',
      unlockToEdit: 'ปลดล็อกโหมดโฮสต์เพื่อแก้ไข',
      memberViewBannerTitle: 'มุมมองสำหรับสมาชิก (Member View)',
      memberViewBannerDesc: 'คุณสามารถดูรายละเอียดแพ็กเกจและสแกนจ่ายเงินได้ การแก้ไขข้อมูลสงวนสิทธิ์เฉพาะโฮสต์',
      howItBreaksDown: 'สรุปการคำนวณค่าบริการ',
      exactSplit: 'ราคาหารตามจริง ({total} ÷ {seats})',
      membersEnrolled: 'สมาชิกที่ร่วมหาร (ไม่รวมโฮสต์)',
      collectedWhenAll: 'ยอดรวมเมื่อเก็บครบทุกคน',
      invoiceTitle: 'รายละเอียดการชำระเงิน',
      totalDue: 'ยอดที่ต้องโอน',
      copyAmount: 'คัดลอกยอดเงิน',
      amountCopied: 'คัดลอกยอดเงิน {amount} แล้ว',
      promptPayTitle: 'สแกนจ่ายด้วย PromptPay',
      promptPayFallback: 'ยังไม่ได้ระบุเบอร์พร้อมเพย์ (ตั้งค่าได้ที่เมนูข้อมูลโฮสต์)',
      promptPayOffline: 'ไม่สามารถโหลดรูป QR ได้ในขณะนี้ กรุณาโอนยอด {amount} ไปที่พร้อมเพย์',
      openQrImage: 'เปิดรูป QR เต็มจอ',
      sendSlipToHost: 'แจ้งโอนเงิน / ส่งสลิปให้โฮสต์',
      reminderPreviewTitle: 'ข้อความแจ้งยอดสำหรับส่งในแชท',
      close: 'ปิดหน้าต่าง',
      cancel: 'ยกเลิก',
      notSet: 'ยังไม่ได้ระบุ',
      hostProfileTitle: 'ตั้งค่าข้อมูลโฮสต์ & บัญชีรับเงิน',
      hostProfileSub: 'ข้อมูลติดต่อและเลขบัญชีนี้จะใช้ร่วมกันในทุกแฟมิลี่',
      aboutYou: 'ข้อมูลผู้ดูแลกลุ่ม (โฮสต์)',
      displayName: 'ชื่อโฮสต์',
      roleTagline: 'บทบาท / คำแนะนำตัว',
      availabilityNote: 'เวลาที่สะดวกตอบกลับ',
      contactChannels: 'ช่องทางติดต่อ',
      paymentDetails: 'ช่องทางรับเงินโอน',
      promptPayLabel: 'เบอร์พร้อมเพย์ หรือ เลขบัตรประชาชน 13 หลัก',
      promptPaySub: 'ระบบจะสร้าง QR Code ที่ระบุยอดโอนของแต่ละคนให้อัตโนมัติ',
      bankName: 'ธนาคาร',
      bankAccount: 'เลขที่บัญชีธนาคาร',
      hostSecurityTitle: 'ความปลอดภัยโหมดโฮสต์ (PIN)',
      hostPinLabel: 'รหัส PIN สำหรับโฮสต์',
      hostPinHint: 'ใช้ปลดล็อกเพื่อติ๊กจ่ายเงิน เพิ่ม/ลบสมาชิก หรือแก้ไขราคา (ค่าเริ่มต้น: 1234)',
      reminderTemplate: 'เทมเพลตข้อความแจ้งเตือน',
      templateHint: 'ตัวแปรที่ใช้ได้: {name} {plan} {month} {amount} {due} {promptpay} {bank} {account}',
      saveProfile: 'บันทึกข้อมูลโฮสต์',
      hostVerificationTitle: 'ยืนยันรหัสโฮสต์ (Host Mode)',
      enterPinToUnlock: 'กรอกรหัส PIN เพื่อปลดล็อกการจัดการสำหรับโฮสต์',
      enterPinTo: 'กรอกรหัส PIN เพื่อ{action}',
      defaultPinNote: 'รหัสเริ่มต้นคือ 1234 (เปลี่ยนได้ในเมนูตั้งค่าโฮสต์)',
      incorrectPin: 'รหัส PIN ไม่ถูกต้อง กรุณาลองอีกครั้ง',
      unlockHostMode: 'ปลดล็อกโหมดโฮสต์',
      contactHostTitle: 'ติดต่อโฮสต์ / แจ้งโอนเงิน',
      contactHostSub: 'ส่งสลิปโอนเงิน หรือสอบถามเรื่องสิทธิ์แฟมิลี่ได้ตามช่องทางด้านล่าง',
      sendQuickMsg: 'พิมพ์ข้อความด่วนถึงโฮสต์',
      yourName: 'ชื่อของคุณ',
      whoIsThisFrom: 'ระบุชื่อเล่นของคุณ',
      messageText: 'ข้อความ',
      msgPlaceholder: 'เช่น โอนเงินค่าบริการเดือนนี้เรียบร้อยแล้วครับ/ค่ะ...',
      sendEmail: 'ส่งทางอีเมล',
      copyForChat: 'คัดลอกไปวางใน LINE / แชท',
      noContactDetailsYet: 'โฮสต์ยังไม่ได้เพิ่มช่องทางติดต่อ',
      addYoursPrompt: 'เพิ่มช่องทางติดต่อของโฮสต์',
      backupTitle: 'สำรอง & จัดการข้อมูล',
      backupSub: 'ข้อมูลถูกบันทึกไว้ในเบราว์เซอร์เครื่องนี้ คุณสามารถส่งออกไฟล์สำรองหรือคัดลอกค่าเริ่มต้นได้',
      exportBackup: 'ดาวน์โหลดไฟล์ข้อมูลสำรอง (.json)',
      importBackup: 'นำเข้าข้อมูลจากไฟล์สำรอง (.json)',
      exportConfig: 'คัดลอกโค้ดตั้งค่าสำหรับอัปเดตลง GitHub (config.js)',
      resetDefaults: 'รีเซ็ตข้อมูลแฟมิลี่นี้เป็นค่าเริ่มต้น',
      resetWarningTitle: 'ยืนยันการรีเซ็ตข้อมูล',
      resetWarning: 'ต้องการรีเซ็ตแฟมิลี่นี้กลับเป็นค่าเริ่มต้นหรือไม่? รายชื่อสมาชิกและประวัติการชำระเงินที่แก้ไขไว้ในเบราว์เซอร์นี้จะถูกล้างทั้งหมด',
      downloadBtn: 'ดาวน์โหลด',
      chooseFileBtn: 'เลือกไฟล์',
      copyBtn: 'คัดลอก',
      resetBtn: 'รีเซ็ต',
      backupDownloaded: 'ดาวน์โหลดไฟล์สำรองเรียบร้อย',
      backupRestored: 'กู้คืนข้อมูลจากไฟล์สำรองเรียบร้อย',
      invalidBackup: 'ไฟล์สำรองไม่ถูกต้อง กรุณาตรวจสอบไฟล์อีกครั้ง',
      dataStoredPrivately: 'บันทึกข้อมูลอัตโนมัติในเบราว์เซอร์ของคุณ',
      hostModeActive: 'โหมดโฮสต์เปิดอยู่',
      lock: 'ล็อก',
      memberView: 'มุมมองสมาชิก',
      unpaidSummaryCopied: 'คัดลอกสรุปรายชื่อคนค้างชำระแล้ว',
      allMarkedPaid: 'บันทึกจ่ายครบทุกคนเรียบร้อย',
      memberUpdated: 'อัปเดตข้อมูลสมาชิกเรียบร้อย',
      memberAdded: 'เพิ่มสมาชิกใหม่เรียบร้อย',
      planUpdated: 'บันทึกการตั้งค่าแพ็กเกจเรียบร้อย',
      hostSaved: 'บันทึกข้อมูลโฮสต์เรียบร้อย',
      hostUnlocked: 'ปลดล็อกโหมดโฮสต์แล้ว',
      hostLocked: 'ล็อกโหมดโฮสต์แล้ว',
      copied: 'คัดลอกแล้ว!',
      copiedTip: 'คัดลอกแล้ว!',
      hubHeadline: 'จัดการหารค่าแฟมิลี่<br>ครบจบในที่เดียว',
      hubTagline: 'เช็กสถานะการจ่ายเงินรายเดือน สแกนจ่ายผ่าน PromptPay QR และจัดการสมาชิกแต่ละกลุ่มอย่างเป็นระบบ',
      openDashboard: 'เปิดหน้าจัดการแฟมิลี่',
      hubTotalCollected: 'เก็บได้แล้วเดือนนี้',
      hubTotalOutstanding: 'รอเก็บเพิ่มเดือนนี้',
      hubPaidProgress: 'จ่ายแล้ว {paid}/{n} คน',
      paymentChannelsTitle: 'ช่องทางโอนเงินของโฮสต์',
      // About Me Bento translations
      aboutSectionEyebrow: 'ABOUT THE HOST · ผู้ดูแลระบบ',
      aboutRoleBadge: 'AI Tech Undergrad & Creator',
      aboutBio: 'นักศึกษาสาย Artificial Intelligence ที่ชอบพัฒนาเว็บแอป\u00A0และเครื่องมือที่ใช้งานง่าย ดูแลระบบแชร์บริการ\u00A0Streaming ให้ทุกคนในกลุ่มจัดการได้อย่างสะดวก',
      aboutTapStatusHint: 'แตะเพื่อสลับสถานะ',
      aboutAgeLabel: 'AGE & BIRTHDAY',
      aboutYearsOld: '20 ปี',
      aboutBirthdayVal: '23 February 2006',
      aboutEducationLabel: 'EDUCATION',
      aboutMajor: 'Artificial Intelligence Technology (AIT)',
      aboutUni: "King Mongkut's Institute of Technology Ladkrabang (KMITL)",
      aboutStickersLabel: 'INTERESTS & FOCUS',
      aboutVibeCardLabel: 'NOTES & STATUS',
      aboutShuffleBtn: 'เปลี่ยนโควท',
      aboutBeatBtnOn: 'Ambient: On',
      aboutBeatBtnOff: 'Ambient: Off',
      aboutCopyProfileBtn: 'คัดลอกข้อมูลโฮสต์',
      aboutCopiedBtn: 'คัดลอกแล้ว!',
      aboutPhotoHint: 'แตะรูป 5 ครั้งเพื่อปลดล็อก Easter Egg',
      aboutOpenCardBtn: 'ดูการ์ดโปรไฟล์',
      aboutTapCardHint: 'แตะเพื่อดูรายละเอียด',
      popupSecretBadge: 'SECRET VIBE MODE · UNLOCKED',
      popupCreatorBadge: 'CREATOR & HOST PASS',
      popupFireConfetti: 'จุดพลุฉลองอีกครั้ง',
      popupLiveDaysLabel: 'จำนวนวันที่เติบโตมา',
      popupNextBdayLabel: 'นับถอยหลังวันเกิดถัดไป (23 ก.พ.)',
      popupDaysUnit: 'วัน',
      popupCoreFocusLabel: 'หัวข้อที่ศึกษาและสนใจ',
      popupToolsLabel: 'เครื่องมือ & สิ่งที่โฟกัส'
    },
    en: {
      langBtn: 'EN',
      langTitle: 'สลับเป็นภาษาไทย / Switch to Thai',
      brandSub: 'Family subscription manager',
      allFamilies: 'All family groups',
      backToHub: 'All families',
      contactHost: 'Contact host',
      hostLogin: 'Host Mode',
      hostMode: 'Host Mode',
      hostLock: 'Lock Host Mode',
      hostSettings: 'Host profile & payment settings',
      backupRestore: 'Backup & restore',
      planCost: 'Monthly plan',
      perMonth: ' /mo',
      perMember: 'Per member',
      dueDay: 'Billing day',
      dueEveryMonth: 'Day {day} monthly',
      seats: 'Seats',
      paidCount: '{paid} of {n} paid',
      allPaidBadge: 'All paid',
      collected: 'Collected',
      collectedSub: '{paid} of {n} members paid',
      outstanding: 'Outstanding',
      outstandingSub: '{unpaid} member{s} remaining',
      allSettledSub: 'Everyone is settled up',
      planCostLabel: 'Plan cost',
      billedOnDay: 'Billed on day {day} each month',
      netCost: 'Host net share',
      surplus: 'Monthly surplus',
      whenAllPay: 'When all {n} members pay {pp}',
      tabPayments: 'Payments',
      tabMembers: 'Members',
      tabPlan: 'Plan & billing',
      tabAbout: 'About Host',
      monthlyPayments: 'Monthly payments',
      trackPaymentsDesc: 'Track payment status and PromptPay QR invoices for {month}.',
      today: 'Current month',
      searchPlaceholder: 'Search member name or contact...',
      filterAll: 'All',
      filterPending: 'Unpaid',
      filterPaid: 'Paid',
      copyPending: 'Copy unpaid list',
      markAllPaid: 'Mark all paid',
      confirmMarkAllTitle: 'Mark everyone as paid?',
      confirmMarkAll: 'Mark all members as paid for {month}?',
      confirmBtn: 'Confirm',
      historyTitle: 'Last 6 months · collection rate',
      noMembersYet: 'No members yet',
      noMembersYetSub: 'Switch to the Members tab to add people sharing this plan.',
      noMatching: 'No matching members',
      noMatchingSub: 'Try a different search keyword or status filter.',
      member: 'Member',
      amount: 'Amount',
      status: 'Status',
      actions: 'Actions',
      paid: 'Paid',
      unpaid: 'Unpaid',
      paidOn: 'on {date}',
      undo: 'Undo',
      markPaid: 'Mark paid',
      payNow: 'Pay / QR',
      invoice: 'Invoice',
      copyReminder: 'Copy reminder message',
      reminderCopied: 'Reminder message copied',
      familyMembers: 'Family members',
      familyMembersDesc: 'Everyone sharing the {plan} subscription.',
      addMember: 'Add member',
      editMember: 'Edit member',
      removeMember: 'Remove member',
      confirmRemoveTitle: 'Remove family member?',
      confirmRemoveMember: 'Remove "{name}" from this family plan? Past payment history will be preserved.',
      seatsUsed: 'Seats occupied',
      seatsOf: '{used} of {max} seats',
      overCapacity: ' · over capacity',
      noContactAdded: 'No contact info',
      familyMemberDefault: 'Family member',
      planSettings: 'Plan & billing settings',
      planSettingsDesc: 'Configure subscription pricing, seat limit, and how costs are split.',
      planName: 'Plan name',
      monthlyCost: 'Total monthly cost',
      seatsAvailable: 'Total seats (including host)',
      chargePerMember: 'Amount per member',
      autoRound: 'Round up',
      autoHint: 'Leave empty for exact split, or click "Round up" to round to the nearest baht.',
      billingDayOfMonth: 'Billing day of month',
      hostSharesSeat: 'Host takes 1 seat',
      hostSharesSeatSub: 'The host uses one seat and covers the remaining balance.',
      notes: 'Plan notes & rules',
      saveChanges: 'Save changes',
      unlockToEdit: 'Unlock Host Mode to edit',
      memberViewBannerTitle: 'Member View',
      memberViewBannerDesc: 'You can view plan breakdown and scan QR codes to pay. Editing is locked to the host.',
      howItBreaksDown: 'Cost breakdown',
      exactSplit: 'Exact split ({total} ÷ {seats})',
      membersEnrolled: 'Members enrolled (excl. host)',
      collectedWhenAll: 'Collected when all members pay',
      invoiceTitle: 'Payment & Invoice',
      totalDue: 'Total due',
      copyAmount: 'Copy amount',
      amountCopied: 'Copied {amount}',
      promptPayTitle: 'Scan with PromptPay',
      promptPayFallback: 'Add a PromptPay number in Host Settings to generate a QR code.',
      promptPayOffline: 'Offline: please transfer {amount} via PromptPay to',
      openQrImage: 'Open full QR image',
      sendSlipToHost: 'Send transfer slip to host',
      reminderPreviewTitle: 'Reminder message for chat',
      close: 'Close',
      cancel: 'Cancel',
      notSet: 'Not set',
      hostProfileTitle: 'Host profile & payment details',
      hostProfileSub: 'Shared across all family groups in this browser.',
      aboutYou: 'Host details',
      displayName: 'Display name',
      roleTagline: 'Role / tagline',
      availabilityNote: 'Availability note',
      contactChannels: 'Contact channels',
      paymentDetails: 'Payment receiving details',
      promptPayLabel: 'PromptPay ID (Phone or 13-digit National ID)',
      promptPaySub: 'Automatically generates a scannable QR code with the exact member amount.',
      bankName: 'Bank name',
      bankAccount: 'Bank account number',
      hostSecurityTitle: 'Host Security & Passcode',
      hostPinLabel: 'Host PIN / Passcode',
      hostPinHint: 'Required to mark payments, edit members, or change settings (Default: 1234).',
      reminderTemplate: 'Reminder message template',
      templateHint: 'Variables: {name} {plan} {month} {amount} {due} {promptpay} {bank} {account}',
      saveProfile: 'Save host profile',
      hostVerificationTitle: 'Host Mode Verification',
      enterPinToUnlock: 'Enter your host PIN to unlock management controls.',
      enterPinTo: 'Enter your host PIN to {action}.',
      defaultPinNote: 'Default PIN is 1234 (changeable anytime in Host Settings).',
      incorrectPin: 'Incorrect PIN. Please try again.',
      unlockHostMode: 'Unlock Host Mode',
      contactHostTitle: 'Contact your host',
      contactHostSub: 'Send your payment slip or ask questions about your family seat anytime.',
      sendQuickMsg: 'Send a quick message',
      yourName: 'Your name',
      whoIsThisFrom: 'Your name or nickname',
      messageText: 'Message',
      msgPlaceholder: 'e.g. I just transferred my share for this month! Sending the slip via LINE.',
      sendEmail: 'Send via Email',
      copyForChat: 'Copy for LINE / Chat',
      noContactDetailsYet: 'No contact channels configured yet.',
      addYoursPrompt: 'Add host contact details',
      backupTitle: 'Backup & data management',
      backupSub: 'Data is saved locally in your browser. Export a JSON backup or copy your config anytime.',
      exportBackup: 'Download JSON backup file',
      importBackup: 'Restore from a JSON backup file',
      exportConfig: 'Copy config.js snippet for GitHub deployment',
      resetDefaults: 'Reset this family site to default data',
      resetWarningTitle: 'Reset to default data?',
      resetWarning: 'Reset this family group to its initial defaults? Current members and payment history in this browser will be cleared.',
      downloadBtn: 'Download',
      chooseFileBtn: 'Choose file',
      copyBtn: 'Copy',
      resetBtn: 'Reset',
      backupDownloaded: 'Backup file downloaded',
      backupRestored: 'Backup restored successfully',
      invalidBackup: 'Invalid backup file. Please check the file format.',
      dataStoredPrivately: 'Saved locally in this browser.',
      hostModeActive: 'Host Mode active',
      lock: 'Lock',
      memberView: 'Member View',
      unpaidSummaryCopied: 'Unpaid summary copied to clipboard',
      allMarkedPaid: 'All members marked as paid',
      memberUpdated: 'Member updated',
      memberAdded: 'Member added',
      planUpdated: 'Plan & billing updated',
      hostSaved: 'Host profile saved',
      hostUnlocked: 'Host Mode unlocked',
      hostLocked: 'Host Mode locked',
      copied: 'Copied!',
      copiedTip: 'คัดลอกแล้ว!',
      hubHeadline: 'Shared family plans,<br>effortlessly organized',
      hubTagline: 'Track monthly splits, scan PromptPay QR invoices, and keep every family group in sync.',
      openDashboard: 'Open family dashboard',
      hubTotalCollected: 'Collected this month',
      hubTotalOutstanding: 'Remaining this month',
      hubPaidProgress: '{paid}/{n} paid',
      paymentChannelsTitle: 'Host payment channels',
      // About Me Bento translations
      aboutSectionEyebrow: 'ABOUT THE HOST · CREATOR PROFILE',
      aboutRoleBadge: 'AI Tech Undergrad & Builder',
      aboutBio: 'AI technology undergraduate building clean web tools, exploring machine learning, and keeping our shared subscriptions running smoothly.',
      aboutTapStatusHint: 'Tap to switch status',
      aboutAgeLabel: 'AGE & BIRTHDAY',
      aboutYearsOld: '20 years old',
      aboutBirthdayVal: '23 February 2006',
      aboutEducationLabel: 'EDUCATION',
      aboutMajor: 'Artificial Intelligence Technology (AIT)',
      aboutUni: "King Mongkut's Institute of Technology Ladkrabang (KMITL)",
      aboutStickersLabel: 'INTERESTS & FOCUS',
      aboutVibeCardLabel: 'NOTES & STATUS',
      aboutShuffleBtn: 'Next Quote',
      aboutBeatBtnOn: 'Ambient: On',
      aboutBeatBtnOff: 'Ambient: Off',
      aboutCopyProfileBtn: 'Copy Host Card',
      aboutCopiedBtn: 'คัดลอกแล้ว!',
      aboutPhotoHint: 'Tap 5 times quickly for a secret surprise',
      aboutOpenCardBtn: 'Creator Card',
      aboutTapCardHint: 'Tap for details',
      popupSecretBadge: 'SECRET VIBE MODE · UNLOCKED',
      popupCreatorBadge: 'CREATOR & HOST PASS',
      popupFireConfetti: 'Launch Confetti',
      popupLiveDaysLabel: 'Days on Earth',
      popupNextBdayLabel: 'Next Birthday (23 Feb)',
      popupDaysUnit: 'days',
      popupCoreFocusLabel: 'Core Focus & Coursework',
      popupToolsLabel: 'Stack & Daily Focus'
    }
  };

  function getLang() {
    try {
      return localStorage.getItem(LANG_KEY) || 'th';
    } catch (e) {
      return 'th';
    }
  }

  function setLang(l) {
    try {
      localStorage.setItem(LANG_KEY, l);
      document.documentElement.lang = l;
    } catch (e) {}
  }

  function toggleLang() {
    const next = getLang() === 'th' ? 'en' : 'th';
    setLang(next);
    return next;
  }

  function t(key, vars) {
    const lang = getLang();
    const dict = I18N[lang] || I18N.th;
    let s = dict[key] != null ? dict[key] : (I18N.en && I18N.en[key] != null ? I18N.en[key] : key);
    if (vars && typeof vars === 'object') {
      s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    }
    return s;
  }

  function monthLabel(ym, short) {
    const p = ym.split('-').map(Number);
    const lang = getLang();
    const d = new Date(p[0], p[1] - 1, 1);
    return d.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', short ? { month: 'short' } : { month: 'long', year: 'numeric' });
  }

  function fmtDate(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      const lang = getLang();
      return d.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short' });
    } catch (e) {
      return '';
    }
  }

  function shiftMonth(ym, delta) {
    const p = ym.split('-').map(Number);
    const d = new Date(p[0], p[1] - 1 + delta, 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  const AVATAR_COLORS = ['#4f46e5', '#0284c7', '#0d9488', '#d97706', '#db2777', '#7c3aed', '#dc2626', '#16a34a', '#ea580c', '#0891b2'];
  function avatar(name) {
    const s = String(name || '?').trim();
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const ch = Array.from(s)[0] || '?';
    return '<span class="avatar" style="background:' + AVATAR_COLORS[h % AVATAR_COLORS.length] + '">' +
      esc(ch.toUpperCase()) + '</span>';
  }

  // ---- Host profile -------------------------------------------------------
  const DEFAULT_TEMPLATE =
    'Hi {name}, friendly reminder for {plan} – {month}.\n' +
    'สวัสดีครับ/ค่ะ แจ้งยอดค่า {plan} ประจำเดือน {month}\n\n' +
    'Amount / ยอดชำระ: {amount} THB (due day {due})\n' +
    'PromptPay: {promptpay}\n' +
    'Bank: {bank} {account}\n\n' +
    'Please send the slip after transfer. Thank you.';

  const DEFAULT_HOST = {
    name: 'Natthaset Attharungroj',
    title: 'AIT @ KMITL · Family Plan Host',
    hours: 'Usually replies within a few hours',
    line: '',
    phone: '',
    email: '',
    facebook: '',
    instagram: '',
    promptPay: '',
    bankName: '',
    bankAccount: '',
    pin: '1234',
    template: DEFAULT_TEMPLATE
  };

  const PIN_STORAGE_KEY = 'subm8.host.unlocked';

  function isHostUnlocked(host) {
    const pin = (host && host.pin ? String(host.pin).trim() : '');
    if (!pin) return true;
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) === 'true' || sessionStorage.getItem(PIN_STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  function unlockHost(host, enteredPin) {
    const pin = (host && host.pin ? String(host.pin).trim() : '1234');
    if (String(enteredPin).trim() === pin) {
      try {
        localStorage.setItem(PIN_STORAGE_KEY, 'true');
        sessionStorage.setItem(PIN_STORAGE_KEY, 'true');
      } catch (e) {}
      return true;
    }
    return false;
  }

  function lockHost() {
    try {
      localStorage.removeItem(PIN_STORAGE_KEY);
      sessionStorage.removeItem(PIN_STORAGE_KEY);
    } catch (e) {}
  }

  function loadHost() {
    try {
      const raw = JSON.parse(localStorage.getItem(HOST_KEY));
      if (raw && typeof raw === 'object') {
        const h = Object.assign({}, DEFAULT_HOST, raw);
        if (!h.pin) h.pin = '1234';
        if (h.name === 'Your Name') h.name = DEFAULT_HOST.name;
        if (h.title === 'Family plan host') h.title = DEFAULT_HOST.title;
        return h;
      }
    } catch (e) { /* ignore */ }
    return Object.assign({}, DEFAULT_HOST);
  }

  function saveHost(host) {
    try { localStorage.setItem(HOST_KEY, JSON.stringify(host)); } catch (e) { /* ignore */ }
  }

  function urlFor(kind, v) {
    v = String(v || '').trim();
    if (!v) return '';
    if (kind === 'line') return 'https://line.me/ti/p/~' + encodeURIComponent(v.replace(/^@/, ''));
    if (kind === 'phone') return 'tel:' + v.replace(/[^\d+]/g, '');
    if (kind === 'email') return 'mailto:' + v;
    if (kind === 'facebook') return /^https?:/i.test(v) ? v : 'https://facebook.com/' + encodeURIComponent(v.replace(/^@/, ''));
    if (kind === 'instagram') return /^https?:/i.test(v) ? v : 'https://instagram.com/' + encodeURIComponent(v.replace(/^@/, ''));
    return '';
  }

  /** Returns every contact channel with its current value (value may be empty). */
  function contactChannels(host) {
    return [
      { key: 'line', label: 'LINE', cls: 'line', icon: 'message', value: host.line, href: urlFor('line', host.line) },
      { key: 'phone', label: 'Phone', cls: 'phone', icon: 'phone', value: host.phone, href: urlFor('phone', host.phone) },
      { key: 'email', label: 'Email', cls: 'mail', icon: 'mail', value: host.email, href: urlFor('email', host.email) },
      { key: 'facebook', label: 'Facebook', cls: 'fb', icon: 'link', value: host.facebook, href: urlFor('facebook', host.facebook) },
      { key: 'instagram', label: 'Instagram', cls: 'ig', icon: 'link', value: host.instagram, href: urlFor('instagram', host.instagram) }
    ];
  }

  function toast(message, type) {
    let box = document.getElementById('toasts');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toasts';
      box.className = 'toasts';
      box.setAttribute('aria-live', 'polite');
      document.body.appendChild(box);
    }
    const el = document.createElement('div');
    el.className = 'toast ' + (type === 'error' ? 'error' : type === 'vibe' ? 'vibe' : '');
    el.innerHTML = icon(type === 'error' ? 'close' : type === 'vibe' ? 'sparkles' : 'check') + '<span>' + esc(message) + '</span>';
    box.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0'; el.style.transform = 'translateY(8px)';
      setTimeout(function () { el.remove(); }, 220);
    }, 3000);
  }

  // Track last clicked button so copyText can morph it with a checkmark + "คัดลอกแล้ว!" tooltip
  let lastClickedBtn = null;
  if (typeof document !== 'undefined') {
    document.addEventListener('pointerdown', function (e) {
      const b = e.target && e.target.closest ? e.target.closest('button, [role="button"]') : null;
      if (b) lastClickedBtn = b;
    }, true);
  }

  function flashCopyButton(btn, tipText) {
    if (!btn || btn.dataset.copyFlashing === '1') return;
    btn.dataset.copyFlashing = '1';
    const origHtml = btn.innerHTML;
    const tip = tipText || 'คัดลอกแล้ว!';
    btn.classList.add('is-copied');
    btn.setAttribute('data-copied-tip', tip);

    // Morph svg icon inside button to checkmark
    const svgEl = btn.querySelector('svg');
    if (svgEl) {
      svgEl.innerHTML = ICONS.check;
    }

    setTimeout(function () {
      btn.classList.remove('is-copied');
      btn.removeAttribute('data-copied-tip');
      if (btn.isConnected) btn.innerHTML = origHtml;
      delete btn.dataset.copyFlashing;
    }, 1500);
  }

  function copyText(text, okMsg, triggerEl) {
    const btn = triggerEl || lastClickedBtn;
    const done = function () {
      if (btn) flashCopyButton(btn, 'คัดลอกแล้ว!');
      toast(okMsg || t('copied'));
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('Could not copy', 'error'); }
      ta.remove();
    }
  }

  // ---- Canvas Confetti Burst (for the 5-tap Avatar Easter Egg) ------------
  function fireConfetti(originX, originY) {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const cx = originX || W / 2;
    const cy = originY || H / 3;
    const colors = ['#4f46e5', '#818cf8', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#a855f7'];
    const particles = [];
    for (let i = 0; i < 85; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 4 + Math.random() * 11;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 5,
        color: colors[i % colors.length],
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.25,
        alpha: 1,
        gravity: 0.24 + Math.random() * 0.1
      });
    }

    let frame = 0;
    function step() {
      frame++;
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.rot += p.vRot;
        if (frame > 45) p.alpha -= 0.024;
        if (p.alpha > 0 && p.y < H + 40) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }
      if (alive && frame < 120) {
        requestAnimationFrame(step);
      } else {
        canvas.remove();
      }
    }
    requestAnimationFrame(step);
  }

  // ---- Minimalist "About Me" Bento State & Component ----------------------
  const ABOUT_STATUSES = [
    'Vibing & building cool projects',
    'Studying AI Technology @ KMITL',
    'Powered by iced coffee & lo-fi beats',
    'Shipping clean UI & side projects',
    'Exploring deep learning & web craft'
  ];

  const ABOUT_QUOTES = [
    { text: '"Simplicity is about subtracting the obvious and adding the meaningful."', tag: 'Design Philosophy' },
    { text: '"Building intelligent systems and clean interfaces that people enjoy using."', tag: 'AIT @ KMITL' },
    { text: '"Good coffee, lo-fi playlists, and zero merge conflicts."', tag: 'Daily Routine' },
    { text: '"Turning machine learning concepts and late-night ideas into practical tools."', tag: 'Current Focus' }
  ];

  const ABOUT_STICKERS = [
    {
      id: 'ai',
      icon: 'cpu',
      label: 'AI & Machine Learning',
      reaction: 'AI & Machine Learning — AIT @ KMITL',
      desc: 'Studying neural networks, computer vision, and applied machine learning systems at AIT, KMITL.',
      tags: ['Python', 'PyTorch', 'Deep Learning', 'Data Science', 'LLMs']
    },
    {
      id: 'code',
      icon: 'code',
      label: 'Web Engineering',
      reaction: 'Clean, modular frontend architecture',
      desc: 'Crafting fast, responsive web applications with zero bloat and clean component architecture.',
      tags: ['JavaScript', 'TypeScript', 'Modern CSS', 'Web APIs', 'Git']
    },
    {
      id: 'ui',
      icon: 'layers',
      label: 'UI/UX Design',
      reaction: 'Minimalist interfaces & smooth motion',
      desc: 'Designing tactile interfaces with Bento layouts, spring physics, and mobile-first ergonomics.',
      tags: ['Bento Grid', 'Micro-Interactions', 'iOS Ergonomics', 'Design Systems']
    },
    {
      id: 'music',
      icon: 'music',
      label: 'Music & Lo-Fi',
      reaction: 'Lo-fi & indie playlists on repeat',
      desc: 'Late-night coding sessions soundtracked by chillhop, indie R&B, and ambient instrumentals.',
      tags: ['Lo-Fi Beats', 'Indie R&B', 'Apple Music', 'YouTube Premium']
    },
    {
      id: 'coffee',
      icon: 'coffee',
      label: 'Coffee',
      reaction: 'Iced Americano daily routine',
      desc: 'Fueling morning lectures at KMITL and evening side projects with specialty iced black coffee.',
      tags: ['Iced Americano', 'Light Roast', 'Specialty Brew', 'Morning Routine']
    },
    {
      id: 'term',
      icon: 'terminal',
      label: 'Automation',
      reaction: 'Building fast developer workflows',
      desc: 'Automating repetitive tasks, CLI setups, and family subscription tracking with custom scripts.',
      tags: ['CLI Workflows', 'macOS', 'Shell Scripting', 'Productivity']
    }
  ];

  const aboutState = {
    statusIdx: 0,
    quoteIdx: 0,
    vibeBeat: true,
    secretVibe: false,
    activeStickers: { ai: true, code: true },
    copiedProfile: false,
    tapCount: 0,
    tapTimer: null,
    assetPrefix: './'
  };

  function calcBirthdayStats() {
    const birth = new Date(2006, 1, 23); // 23 Feb 2006
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - birth.getTime());
    const daysLived = Math.floor(diffMs / 86400000);
    let nextBday = new Date(now.getFullYear(), 1, 23);
    if (now > nextBday) {
      nextBday = new Date(now.getFullYear() + 1, 1, 23);
    }
    const daysUntil = Math.max(0, Math.ceil((nextBday.getTime() - now.getTime()) / 86400000));
    return { daysLived: daysLived, daysUntil: daysUntil };
  }

  function closeAboutPopup() {
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('aboutPopupOverlay');
    if (existing) {
      existing.classList.add('closing');
      setTimeout(() => {
        if (existing.parentNode) existing.remove();
      }, 180);
    }
  }

  function openAboutPopup(type, payload) {
    if (typeof document === 'undefined') return;
    const prev = document.getElementById('aboutPopupOverlay');
    if (prev) prev.remove();

    const prefix = aboutState.assetPrefix || './';
    const quoteObj = ABOUT_QUOTES[aboutState.quoteIdx % ABOUT_QUOTES.length];
    let modalClass = 'modal about-popup-modal';
    let innerHtml = '';

    if (type === 'secret-vibe' || type === 'creator') {
      const isSecret = type === 'secret-vibe' || aboutState.secretVibe;
      if (isSecret) modalClass += ' secret-holo-modal';
      const badgeLabel = isSecret ? t('popupSecretBadge') : t('popupCreatorBadge');
      const statusLine = isSecret
        ? '🚀 Secret Vibe Mode Unlocked!'
        : ABOUT_STATUSES[aboutState.statusIdx % ABOUT_STATUSES.length];

      innerHtml = `
        <div class="modal-sheet-bar"></div>
        <div class="about-popup-head">
          <span class="holo-pass-badge ${isSecret ? 'secret' : ''}">
            <span class="status-pulse" aria-hidden="true"></span>
            <span>${esc(badgeLabel)}</span>
          </span>
          <button type="button" class="icon-btn" data-about-action="close-popup" aria-label="${esc(t('close'))}">${icon('x', 'sm')}</button>
        </div>
        <div class="modal-body about-popup-body">
          <div class="holo-id-card ${isSecret ? 'is-secret' : ''}">
            <div class="holo-id-top">
              <div class="holo-avatar-wrap">
                <img
                  src="${esc(prefix)}assets/profile.jpg"
                  onerror="this.onerror=null;this.src='${esc(prefix)}assets/avatar-fallback.svg'"
                  alt="Natthaset Attharungroj"
                  class="holo-avatar"
                >
              </div>
              <div class="holo-id-meta">
                <span class="holo-pass-id">ID #AIT-2302-2006</span>
                <h3>Natthaset Attharungroj</h3>
                <p>Artificial Intelligence Technology · KMITL</p>
              </div>
            </div>

            <div class="holo-status-bar">
              <span class="status-pulse" aria-hidden="true"></span>
              <span id="popupStatusText">${esc(statusLine)}</span>
            </div>

            <div class="holo-stats-grid">
              <div class="holo-stat">
                <span class="k">${esc(t('aboutAgeLabel'))}</span>
                <b class="v">20 yrs · 23 Feb 2006</b>
              </div>
              <div class="holo-stat">
                <span class="k">${esc(t('aboutEducationLabel'))}</span>
                <b class="v">AIT @ KMITL</b>
              </div>
              <div class="holo-stat">
                <span class="k">FOCUS</span>
                <b class="v">AI · Web · UI/UX</b>
              </div>
              <div class="holo-stat">
                <span class="k">DAILY FUEL</span>
                <b class="v">Iced Americano</b>
              </div>
            </div>

            <blockquote class="holo-quote" id="popupQuoteBox" data-about-action="popup-quote">
              <p>${esc(quoteObj.text)}</p>
              <footer>${esc(quoteObj.tag)} · ${esc(t('aboutShuffleBtn'))}</footer>
            </blockquote>
          </div>
        </div>
        <div class="modal-foot about-popup-foot">
          <button type="button" class="btn btn-ghost" data-about-action="popup-confetti">
            ${icon('sparkle', 'sm')}
            <span>${esc(t('popupFireConfetti'))}</span>
          </button>
          <button type="button" class="btn btn-primary copy-btn" data-about-action="copy-profile">
            ${icon('copy', 'sm')}
            <span>${esc(t('aboutCopyProfileBtn'))}</span>
          </button>
        </div>`;
    } else if (type === 'age') {
      const bstats = calcBirthdayStats();
      innerHtml = `
        <div class="modal-sheet-bar"></div>
        <div class="about-popup-head">
          <span class="holo-pass-badge">
            ${icon('calendar', 'sm')}
            <span>${esc(t('aboutAgeLabel'))}</span>
          </span>
          <button type="button" class="icon-btn" data-about-action="close-popup" aria-label="${esc(t('close'))}">${icon('x', 'sm')}</button>
        </div>
        <div class="modal-body about-popup-body">
          <div class="popup-spotlight-hero">
            <div class="popup-big-badge">20</div>
            <div>
              <h3>Natthaset Attharungroj</h3>
              <p>${esc(t('aboutBirthdayVal'))} · Bangkok, Thailand</p>
            </div>
          </div>
          <div class="holo-stats-grid">
            <div class="holo-stat">
              <span class="k">${esc(t('popupLiveDaysLabel'))}</span>
              <b class="v">${bstats.daysLived.toLocaleString()} ${esc(t('popupDaysUnit'))}</b>
            </div>
            <div class="holo-stat">
              <span class="k">${esc(t('popupNextBdayLabel'))}</span>
              <b class="v">${bstats.daysUntil} ${esc(t('popupDaysUnit'))}</b>
            </div>
          </div>
        </div>
        <div class="modal-foot about-popup-foot">
          <button type="button" class="btn btn-ghost" data-about-action="popup-confetti">
            ${icon('sparkle', 'sm')}
            <span>${esc(t('popupFireConfetti'))}</span>
          </button>
          <button type="button" class="btn btn-primary" data-about-action="close-popup">${esc(t('close'))}</button>
        </div>`;
    } else if (type === 'edu') {
      innerHtml = `
        <div class="modal-sheet-bar"></div>
        <div class="about-popup-head">
          <span class="holo-pass-badge">
            ${icon('graduation', 'sm')}
            <span>${esc(t('aboutEducationLabel'))} · KMITL</span>
          </span>
          <button type="button" class="icon-btn" data-about-action="close-popup" aria-label="${esc(t('close'))}">${icon('x', 'sm')}</button>
        </div>
        <div class="modal-body about-popup-body">
          <div class="popup-edu-card">
            <span class="bento-mini-badge neon">AIT @ KMITL</span>
            <h3>${esc(t('aboutMajor'))}</h3>
            <p>${esc(t('aboutUni'))}</p>
            <div class="popup-divider"></div>
            <div class="popup-kicker">${esc(t('popupCoreFocusLabel'))}</div>
            <div class="popup-chip-cloud">
              <span>Machine Learning</span>
              <span>Deep Learning</span>
              <span>Computer Vision</span>
              <span>Natural Language Processing</span>
              <span>Data Structures & Algorithms</span>
              <span>Software Engineering</span>
            </div>
          </div>
        </div>
        <div class="modal-foot about-popup-foot">
          <button type="button" class="btn btn-primary" data-about-action="close-popup">${esc(t('close'))}</button>
        </div>`;
    } else if (type === 'sticker') {
      const st = ABOUT_STICKERS.find((x) => x.id === payload) || ABOUT_STICKERS[0];
      const tagsHtml = (st.tags || []).map((tg) => `<span>${esc(tg)}</span>`).join('');
      innerHtml = `
        <div class="modal-sheet-bar"></div>
        <div class="about-popup-head">
          <span class="holo-pass-badge">
            ${icon(st.icon, 'sm')}
            <span>${esc(t('aboutStickersLabel'))}</span>
          </span>
          <button type="button" class="icon-btn" data-about-action="close-popup" aria-label="${esc(t('close'))}">${icon('x', 'sm')}</button>
        </div>
        <div class="modal-body about-popup-body">
          <div class="popup-edu-card">
            <div class="popup-sticker-title">
              <span class="popup-sticker-ic">${icon(st.icon, 'md')}</span>
              <div>
                <h3>${esc(st.label)}</h3>
                <small>${esc(st.reaction)}</small>
              </div>
            </div>
            <p class="popup-sticker-desc">${esc(st.desc)}</p>
            <div class="popup-divider"></div>
            <div class="popup-kicker">${esc(t('popupToolsLabel'))}</div>
            <div class="popup-chip-cloud">${tagsHtml}</div>
          </div>
        </div>
        <div class="modal-foot about-popup-foot">
          <button type="button" class="btn btn-primary" data-about-action="close-popup">${esc(t('close'))}</button>
        </div>`;
    }

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay about-popup-overlay';
    overlay.id = 'aboutPopupOverlay';
    overlay.setAttribute('data-about-action', 'overlay-bg');
    overlay.innerHTML = `<div class="${modalClass}" role="dialog" aria-modal="true">${innerHtml}</div>`;
    document.body.appendChild(overlay);
  }

  function renderAboutBento(opts) {
    opts = opts || {};
    const prefix = opts.assetPrefix || './';
    aboutState.assetPrefix = prefix;
    const statusText = aboutState.secretVibe
      ? 'Secret Vibe Mode Unlocked!'
      : ABOUT_STATUSES[aboutState.statusIdx % ABOUT_STATUSES.length];
    const quoteObj = ABOUT_QUOTES[aboutState.quoteIdx % ABOUT_QUOTES.length];

    const stickersHtml = ABOUT_STICKERS.map((s) => {
      const active = !!aboutState.activeStickers[s.id];
      return `<button type="button" class="sticker-pill ${active ? 'active' : ''}" data-about-action="sticker" data-sticker-id="${s.id}">
        ${icon(s.icon, 'sm')}
        <span>${esc(s.label)}</span>
      </button>`;
    }).join('');

    return `
    <section class="about-bento-wrap ${aboutState.vibeBeat ? 'vibe-glow' : ''} ${aboutState.secretVibe ? 'secret-vibe-mode' : ''}" id="aboutMeSection" aria-label="About Natthaset Attharungroj">
      <div class="about-section-head">
        <span class="about-eyebrow">${icon('user', 'sm')}<span>${esc(t('aboutSectionEyebrow'))}</span></span>
        <button type="button" class="about-pass-trigger" data-about-action="open-popup" data-popup-type="creator">
          ${icon('sparkle', 'sm')}
          <span>${esc(t('aboutOpenCardBtn'))}</span>
        </button>
      </div>

      <div class="bento-grid">
        <!-- 1. Main Profile Hero Card -->
        <div class="bento-card bento-profile">
          <div class="bento-profile-top">
            <button type="button" class="bento-photo-frame" data-about-action="avatar-tap" title="${esc(t('aboutPhotoHint'))}" aria-label="Natthaset Attharungroj profile photo">
              <img
                src="${esc(prefix)}assets/profile.jpg"
                onerror="this.onerror=null;this.src='${esc(prefix)}assets/avatar-fallback.svg'"
                alt="Natthaset Attharungroj"
                class="bento-photo"
                loading="lazy"
              >
              <span class="avatar-tap-ring" id="avatarTapRing" aria-hidden="true"></span>
              <span class="avatar-tap-badge" id="avatarTapBadge" aria-hidden="true"></span>
            </button>
            <div class="bento-profile-info">
              <button type="button" class="status-live-pill" data-about-action="cycle-status" title="${esc(t('aboutTapStatusHint'))}">
                <span class="status-pulse" aria-hidden="true"></span>
                <span class="status-live-text" id="aboutStatusText">${esc(statusText)}</span>
              </button>
              <h2 class="bento-name">Natthaset Attharungroj</h2>
              <div class="bento-role-row">
                <span class="bento-tag-chip">${icon('graduation', 'sm')}<span>AIT @ KMITL</span></span>
                <span class="bento-tag-chip soft">${esc(t('aboutRoleBadge'))}</span>
              </div>
            </div>
          </div>
          <p class="bento-bio">${esc(t('aboutBio'))}</p>
        </div>

        <!-- 2. Age & Birthday Card (Interactive Popup) -->
        <div class="bento-card bento-stat-card is-interactive" data-about-action="open-popup" data-popup-type="age" role="button" tabindex="0" title="${esc(t('aboutTapCardHint'))}">
          <div class="bento-card-head">
            <span class="bento-kicker">${icon('calendar', 'sm')}<span>${esc(t('aboutAgeLabel'))}</span></span>
            <span class="bento-mini-badge">2006</span>
          </div>
          <div class="bento-age-row">
            <div class="bento-big-num">20</div>
            <div class="bento-age-meta">
              <b>${esc(t('aboutYearsOld'))}</b>
              <span>${esc(t('aboutBirthdayVal'))}</span>
            </div>
          </div>
          <div class="bento-sub-pill">23 Feb 2006 · Bangkok, TH</div>
        </div>

        <!-- 3. Education Card (AIT @ KMITL - Interactive Popup) -->
        <div class="bento-card bento-edu-card is-interactive" data-about-action="open-popup" data-popup-type="edu" role="button" tabindex="0" title="${esc(t('aboutTapCardHint'))}">
          <div class="bento-card-head">
            <span class="bento-kicker">${icon('graduation', 'sm')}<span>${esc(t('aboutEducationLabel'))}</span></span>
            <span class="bento-mini-badge neon">KMITL</span>
          </div>
          <div class="bento-edu-title">${esc(t('aboutMajor'))}</div>
          <div class="bento-edu-sub">${esc(t('aboutUni'))}</div>
          <div class="bento-edu-tags">
            <span>Artificial Intelligence</span>
            <span>Computer Science</span>
          </div>
        </div>

        <!-- 4. Interactive Skill / Interest Tags Card -->
        <div class="bento-card bento-stickers-card">
          <div class="bento-card-head">
            <span class="bento-kicker">${icon('layers', 'sm')}<span>${esc(t('aboutStickersLabel'))}</span></span>
            <span class="bento-tap-hint">${esc(t('aboutTapCardHint'))}</span>
          </div>
          <div class="sticker-cloud">
            ${stickersHtml}
          </div>
        </div>

        <!-- 5. Interactive Quote + Equalizer Card -->
        <div class="bento-card bento-vibe-card">
          <div class="bento-card-head">
            <span class="bento-kicker">${icon('activity', 'sm')}<span>${esc(t('aboutVibeCardLabel'))}</span></span>
            <div class="eq-bars ${aboutState.vibeBeat ? 'playing' : ''}" aria-hidden="true">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
          <blockquote class="bento-quote" id="aboutQuoteBox" data-about-action="shuffle-quote">
            <p>${esc(quoteObj.text)}</p>
            <footer>${esc(quoteObj.tag)}</footer>
          </blockquote>
          <div class="bento-vibe-actions">
            <button type="button" class="bento-btn" data-about-action="shuffle-quote">
              ${icon('refresh', 'sm')}
              <span>${esc(t('aboutShuffleBtn'))}</span>
            </button>
            <button type="button" class="bento-btn ${aboutState.vibeBeat ? 'active' : ''}" data-about-action="toggle-beat">
              ${icon('activity', 'sm')}
              <span>${esc(aboutState.vibeBeat ? t('aboutBeatBtnOn') : t('aboutBeatBtnOff'))}</span>
            </button>
            <button type="button" class="bento-btn copy-btn ${aboutState.copiedProfile ? 'copied' : ''}" data-about-action="copy-profile">
              ${icon(aboutState.copiedProfile ? 'check' : 'copy', 'sm')}
              <span>${esc(aboutState.copiedProfile ? t('aboutCopiedBtn') : t('aboutCopyProfileBtn'))}</span>
            </button>
          </div>
        </div>
      </div>
    </section>`;
  }

  function handleAboutClick(e) {
    // Allow clicking outside the popup dialog to close it
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-about-action') === 'overlay-bg') {
      closeAboutPopup();
      return true;
    }

    const btn = e.target.closest('[data-about-action]');
    if (!btn) return false;
    const act = btn.dataset.aboutAction;
    if (act === 'overlay-bg') return false;
    e.preventDefault();

    if (act === 'close-popup') {
      closeAboutPopup();
      return true;
    }

    if (act === 'open-popup') {
      const pType = btn.dataset.popupType || 'creator';
      openAboutPopup(pType);
      return true;
    }

    if (act === 'popup-confetti') {
      const rect = btn.getBoundingClientRect();
      fireConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return true;
    }

    if (act === 'popup-quote') {
      aboutState.quoteIdx = (aboutState.quoteIdx + 1) % ABOUT_QUOTES.length;
      const q = ABOUT_QUOTES[aboutState.quoteIdx];
      const pBox = document.getElementById('popupQuoteBox');
      if (pBox) {
        pBox.innerHTML = `<p>${esc(q.text)}</p><footer>${esc(q.tag)} · ${esc(t('aboutShuffleBtn'))}</footer>`;
        pBox.classList.remove('pop-anim');
        void pBox.offsetWidth;
        pBox.classList.add('pop-anim');
      }
      const box = document.getElementById('aboutQuoteBox');
      if (box) {
        box.innerHTML = `<p>${esc(q.text)}</p><footer>${esc(q.tag)}</footer>`;
      }
      return true;
    }

    // 5-Tap Easter Egg on Avatar -> Confetti + Toast + Secret Vibe Popup Modal!
    if (act === 'avatar-tap') {
      btn.classList.remove('avatar-wiggle');
      void btn.offsetWidth;
      btn.classList.add('avatar-wiggle');

      aboutState.tapCount += 1;
      const badgeEl = document.getElementById('avatarTapBadge');
      if (badgeEl && aboutState.tapCount < 5) {
        badgeEl.textContent = aboutState.tapCount + '/5';
        badgeEl.classList.add('show');
      }

      if (aboutState.tapTimer) clearTimeout(aboutState.tapTimer);
      aboutState.tapTimer = setTimeout(function () {
        aboutState.tapCount = 0;
        if (badgeEl) badgeEl.classList.remove('show');
      }, 2200);

      if (aboutState.tapCount >= 5) {
        aboutState.tapCount = 0;
        if (badgeEl) badgeEl.classList.remove('show');
        aboutState.secretVibe = true;
        const rect = btn.getBoundingClientRect();
        fireConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
        const wrap = document.getElementById('aboutMeSection');
        if (wrap) wrap.classList.add('secret-vibe-mode');
        const stEl = document.getElementById('aboutStatusText');
        if (stEl) {
          stEl.textContent = 'Secret Vibe Mode Unlocked!';
        }
        toast('🚀 Secret Vibe Mode Unlocked!', 'vibe');
        openAboutPopup('secret-vibe');
      }
      return true;
    }

    if (act === 'cycle-status') {
      aboutState.secretVibe = false;
      const wrap = document.getElementById('aboutMeSection');
      if (wrap) wrap.classList.remove('secret-vibe-mode');
      aboutState.statusIdx = (aboutState.statusIdx + 1) % ABOUT_STATUSES.length;
      const txt = ABOUT_STATUSES[aboutState.statusIdx];
      const el = document.getElementById('aboutStatusText');
      if (el) {
        el.textContent = txt;
        btn.classList.remove('pop-anim');
        void btn.offsetWidth;
        btn.classList.add('pop-anim');
      }
      return true;
    }

    if (act === 'sticker') {
      const id = btn.dataset.stickerId;
      aboutState.activeStickers[id] = true;
      btn.classList.add('active');
      btn.classList.remove('pop-anim');
      void btn.offsetWidth;
      btn.classList.add('pop-anim');
      openAboutPopup('sticker', id);
      return true;
    }

    if (act === 'shuffle-quote') {
      aboutState.quoteIdx = (aboutState.quoteIdx + 1) % ABOUT_QUOTES.length;
      const q = ABOUT_QUOTES[aboutState.quoteIdx];
      const box = document.getElementById('aboutQuoteBox');
      if (box) {
        box.innerHTML = `<p>${esc(q.text)}</p><footer>${esc(q.tag)}</footer>`;
        box.classList.remove('pop-anim');
        void box.offsetWidth;
        box.classList.add('pop-anim');
      }
      return true;
    }

    if (act === 'toggle-beat') {
      aboutState.vibeBeat = !aboutState.vibeBeat;
      const wrap = document.getElementById('aboutMeSection');
      if (wrap) wrap.classList.toggle('vibe-glow', aboutState.vibeBeat);
      const eq = wrap ? wrap.querySelector('.eq-bars') : null;
      if (eq) eq.classList.toggle('playing', aboutState.vibeBeat);
      btn.classList.toggle('active', aboutState.vibeBeat);
      btn.innerHTML = `${icon('activity', 'sm')}<span>${esc(aboutState.vibeBeat ? t('aboutBeatBtnOn') : t('aboutBeatBtnOff'))}</span>`;
      return true;
    }

    if (act === 'copy-profile') {
      const h = loadHost();
      const info = [
        'Natthaset Attharungroj (Age 20 · Born 23 Feb 2006)',
        'Education: Artificial Intelligence Technology (AIT) @ KMITL',
        h.line ? 'LINE: ' + h.line : '',
        h.phone ? 'Phone: ' + h.phone : '',
        h.email ? 'Email: ' + h.email : '',
        h.promptPay ? 'PromptPay: ' + h.promptPay : ''
      ].filter(Boolean).join('\n');
      aboutState.copiedProfile = true;
      copyText(info, t('aboutCopiedBtn'), btn);
      btn.classList.add('copied');
      btn.innerHTML = `${icon('check', 'sm')}<span>${esc(t('aboutCopiedBtn'))}</span>`;
      setTimeout(() => {
        aboutState.copiedProfile = false;
        btn.classList.remove('copied');
        if (btn.isConnected) btn.innerHTML = `${icon('copy', 'sm')}<span>${esc(t('aboutCopyProfileBtn'))}</span>`;
      }, 2000);
      return true;
    }

    return false;
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('aboutPopupOverlay')) {
        closeAboutPopup();
      }
    });
  }

  try {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = getLang();
    }
  } catch (e) {}

  global.SM = {
    HOST_KEY: HOST_KEY, PIN_STORAGE_KEY: PIN_STORAGE_KEY, icon: icon, esc: esc, fmt: fmt, ymNow: ymNow, monthLabel: monthLabel,
    fmtDate: fmtDate, shiftMonth: shiftMonth, avatar: avatar, loadHost: loadHost, saveHost: saveHost,
    isHostUnlocked: isHostUnlocked, unlockHost: unlockHost, lockHost: lockHost,
    getLang: getLang, setLang: setLang, toggleLang: toggleLang, t: t, I18N: I18N,
    DEFAULT_HOST: DEFAULT_HOST, contactChannels: contactChannels, urlFor: urlFor,
    toast: toast, copyText: copyText, flashCopyButton: flashCopyButton, fireConfetti: fireConfetti,
    renderAboutBento: renderAboutBento, handleAboutClick: handleAboutClick,
    openAboutPopup: openAboutPopup, closeAboutPopup: closeAboutPopup
  };
})(window);
