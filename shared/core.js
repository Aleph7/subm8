/**
 * subm8 — shared core
 * Icons, formatting helpers, and the host profile (contact + payment info),
 * which is stored once and shared by every family site.
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
    arrowR: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
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
    crown: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
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
      langBtn: '🇹🇭 TH',
      langTitle: 'เปลี่ยนเป็นภาษาอังกฤษ / Switch to English',
      brandSub: 'ระบบจัดการแชร์สตรีมมิ่ง & แฟมิลี่',
      allFamilies: 'รวมแฟมิลี่ทั้งหมด',
      contactHost: 'ติดต่อโฮสต์',
      hostLogin: 'เข้าสู่ระบบโฮสต์',
      hostMode: 'โหมดโฮสต์',
      hostLock: 'ล็อกโหมดโฮสต์',
      hostSettings: 'ข้อมูลโฮสต์ & บัญชีรับเงิน',
      backupRestore: 'สำรอง & กู้คืนข้อมูล',
      planCost: 'ค่าบริการรายเดือน',
      perMonth: ' / เดือน',
      perMember: 'คนละ',
      dueDay: 'ครบกำหนดวันที่',
      seats: 'จำนวนคน',
      paidCount: 'จ่ายแล้ว {paid} จาก {n} คน',
      collected: 'ยอดที่เก็บได้แล้ว',
      collectedSub: 'จ่ายแล้ว {paid} จาก {n} คน',
      outstanding: 'ยอดค้างชำระ',
      outstandingSub: 'ยังไม่จ่าย {unpaid} คน',
      planCostLabel: 'ค่าบริการรายเดือน',
      billedOnDay: 'ตัดรอบบิลทุกวันที่ {day} ของเดือน',
      netCost: 'ส่วนต่างที่โฮสต์ออก',
      surplus: 'ส่วนเกิน',
      whenAllPay: 'เมื่อสมาชิกทุกคนจ่ายคนละ {pp}',
      tabPayments: 'รายการชำระเงิน',
      tabMembers: 'สมาชิก',
      tabPlan: 'แพ็กเกจ & ราคา',
      monthlyPayments: 'การชำระเงินประจำเดือน',
      trackPaymentsDesc: 'บันทึกและตรวจสอบสถานะการโอนเงินของ {month}',
      today: 'เดือนนี้',
      searchPlaceholder: 'ค้นหาชื่อสมาชิกหรือเบอร์ติดต่อ...',
      filterAll: 'ทั้งหมด',
      filterPending: 'ยังไม่จ่าย',
      filterPaid: 'จ่ายแล้ว',
      copyPending: 'คัดลอกรายชื่อคนค้างชำระ',
      markAllPaid: 'ทำเครื่องหมายจ่ายครบทุกคน',
      confirmMarkAll: 'ต้องการทำเครื่องหมายจ่ายครบทุกคนสำหรับ {month} หรือไม่?',
      historyTitle: 'สถิติการจ่ายเงินย้อนหลัง 6 เดือน',
      noMembersYet: 'ยังไม่มีสมาชิก',
      noMembersYetSub: 'เพิ่มสมาชิกที่ร่วมหารในแท็บสมาชิก',
      noMatching: 'ไม่พบสมาชิกที่ตรงกับการค้นหา',
      noMatchingSub: 'ลองค้นหาด้วยชื่อหรือเบอร์ติดต่ออื่น',
      member: 'สมาชิก',
      amount: 'ยอดชำระ',
      status: 'สถานะ',
      actions: 'จัดการ',
      paid: 'จ่ายแล้ว',
      unpaid: 'ยังไม่จ่าย',
      undo: 'ยกเลิก',
      markPaid: 'บันทึกจ่ายแล้ว',
      payNow: 'ชำระเงิน',
      invoice: 'ใบแจ้งยอด',
      copyReminder: 'คัดลอกข้อความทวง',
      reminderCopied: 'คัดลอกข้อความทวงเงินเรียบร้อย',
      familyMembers: 'สมาชิกในแฟมิลี่',
      familyMembersDesc: 'รายชื่อสมาชิกที่ร่วมแชร์แพ็กเกจ {plan}',
      addMember: 'เพิ่มสมาชิก',
      editMember: 'แก้ไขข้อมูลสมาชิก',
      seatsUsed: 'สิทธิ์ที่ใช้ไป',
      seatsOf: '{used} จาก {max} คน',
      overCapacity: ' · เกินจำนวนสิทธิ์ที่กำหนด',
      noContactAdded: 'ไม่ได้ระบุช่องทางติดต่อ',
      familyMemberDefault: 'สมาชิกแฟมิลี่',
      planSettings: 'แพ็กเกจ & การหารเงิน',
      planSettingsDesc: 'ปรับเปลี่ยนราคาแพ็กเกจและวิธีหารค่าบริการ',
      planName: 'ชื่อแพ็กเกจ',
      monthlyCost: 'ราคารวมต่อเดือน',
      seatsAvailable: 'จำนวนคนทั้งหมดในแฟมิลี่',
      chargePerMember: 'ยอดเก็บต่อคน',
      autoRound: 'ปัดเศษขึ้น',
      autoHint: 'เว้นว่างไว้เพื่อหารเท่าอัตโนมัติ หรือกด "ปัดเศษขึ้น" เพื่อปัดเศษสตางค์',
      billingDayOfMonth: 'วันที่ตัดรอบบิลของทุกเดือน',
      hostSharesSeat: 'โฮสต์ใช้ด้วย 1 สิทธิ์',
      hostSharesSeatSub: 'โฮสต์เป็นหนึ่งในสมาชิกที่ใช้งาน และรับผิดชอบค่าใช้จ่ายส่วนที่เหลือ',
      notes: 'หมายเหตุ / กฎการแชร์',
      saveChanges: 'บันทึกการเปลี่ยนแปลง',
      unlockToEdit: 'ปลดล็อกโหมดโฮสต์เพื่อแก้ไข',
      memberViewBannerTitle: 'มุมมองสมาชิก (Member view)',
      memberViewBannerDesc: 'ข้อมูลแพ็กเกจและการหารเงินดูแลโดยโฮสต์',
      howItBreaksDown: 'สรุปการแบ่งจ่าย',
      exactSplit: 'ราคาหารตรงตัว ({total} ÷ {seats})',
      membersEnrolled: 'จำนวนสมาชิกปัจจุบัน',
      collectedWhenAll: 'ยอดรวมเมื่อทุกคนจ่าย',
      invoiceTitle: 'ใบแจ้งยอดชำระเงิน',
      totalDue: 'ยอดที่ต้องชำระ',
      promptPayTitle: 'พร้อมเพย์ (PromptPay)',
      promptPayFallback: 'ระบุเบอร์พร้อมเพย์ใน "ข้อมูลโฮสต์" เพื่อแสดง QR Code',
      promptPayOffline: 'ต้องการอินเทอร์เน็ตเพื่อโหลด QR Code กรุณาโอนเงิน {amount} ไปที่',
      sendSlipToHost: 'ส่งสลิปให้โฮสต์',
      close: 'ปิด',
      cancel: 'ยกเลิก',
      hostProfileTitle: 'ข้อมูลโฮสต์ & บัญชีรับเงิน',
      hostProfileSub: 'ข้อมูลนี้จะใช้ร่วมกันทุกแฟมิลี่ในระบบ',
      aboutYou: 'ข้อมูลผู้ดูแล (โฮสต์)',
      displayName: 'ชื่อที่แสดง',
      roleTagline: 'บทบาท / คำแนะนำตัว',
      availabilityNote: 'เวลาที่สะดวกตอบข้อความ',
      contactChannels: 'ช่องทางติดต่อ',
      paymentDetails: 'ข้อมูลรับชำระเงิน',
      promptPayLabel: 'พร้อมเพย์ (เบอร์โทร หรือ เลขบัตร ปชช. 13 หลัก)',
      promptPaySub: 'ใช้สร้าง QR Code พร้อมเพย์ที่ระบุยอดเงินให้อัตโนมัติ',
      bankName: 'ธนาคาร',
      bankAccount: 'เลขที่บัญชี',
      hostSecurityTitle: 'รหัสผ่านความปลอดภัย (PIN)',
      hostPinLabel: 'รหัส PIN โฮสต์ (4 หลัก)',
      hostPinHint: 'รหัสผ่านสำหรับเข้าแก้ไขสมาชิก ราคาแพ็กเกจ ข้อมูลโฮสต์ และบันทึกการจ่ายเงิน (ค่าเริ่มต้นคือ 1234)',
      reminderTemplate: 'เทมเพลตข้อความทวงเงิน',
      templateHint: 'ตัวแปรที่ใช้ได้: {name} {plan} {month} {amount} {due} {promptpay} {bank} {account}',
      saveProfile: 'บันทึกข้อมูลโฮสต์',
      hostVerificationTitle: 'ยืนยันตัวตนโฮสต์',
      enterPinToUnlock: 'ใส่รหัส PIN 4 หลักเพื่อปลดล็อกโหมดโฮสต์',
      enterPinTo: 'ใส่รหัส PIN เพื่อ {action}',
      defaultPinNote: 'รหัสผ่านเริ่มต้นคือ 1234 (สามารถเปลี่ยนได้ที่การตั้งค่าโฮสต์)',
      incorrectPin: 'รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
      unlockHostMode: 'ปลดล็อกโหมดโฮสต์',
      contactHostTitle: 'ติดต่อโฮสต์',
      contactHostSub: 'มีคำถามเรื่องยอดชำระ สิทธิ์แฟมิลี่ หรือต้องการส่งสลิป ติดต่อได้ตลอดเวลาครับ',
      sendQuickMsg: 'ส่งข้อความด่วน',
      yourName: 'ชื่อของคุณ',
      whoIsThisFrom: 'ระบุชื่อผู้ส่ง',
      messageText: 'ข้อความ',
      msgPlaceholder: 'เช่น โอนเงินค่าบริการเดือนนี้ให้เรียบร้อยแล้วครับ แนบสลิปมาด้วย...',
      sendEmail: 'ส่งทางอีเมล',
      copyForChat: 'คัดลอกส่งทาง LINE / แชท',
      noContactDetailsYet: 'ยังไม่ได้ระบุช่องทางติดต่อ',
      addYoursPrompt: 'เพิ่มข้อมูลติดต่อของคุณ',
      backupTitle: 'สำรอง & กู้คืนข้อมูล',
      backupSub: 'ข้อมูลทั้งหมดเก็บอยู่ในเบราว์เซอร์นี้ คุณสามารถดาวน์โหลดไฟล์เก็บไว้ได้',
      exportBackup: 'ดาวน์โหลดไฟล์สำรอง (JSON)',
      importBackup: 'กู้คืนข้อมูลจากไฟล์',
      resetDefaults: 'รีเซ็ตกลับเป็นค่าเริ่มต้น',
      resetWarning: 'ต้องการรีเซ็ตไซต์นี้กลับเป็นค่าเริ่มต้นหรือไม่? รายชื่อสมาชิกและประวัติการจ่ายเงินจะถูกล้าง',
      dataStoredPrivately: 'ข้อมูลบันทึกอย่างปลอดภัยในเบราว์เซอร์นี้',
      hostModeActive: 'โหมดโฮสต์ทำงานอยู่',
      lock: 'ล็อก',
      memberView: 'มุมมองสมาชิก',
      unpaidSummaryCopied: 'คัดลอกรายชื่อคนค้างชำระเรียบร้อย',
      allMarkedPaid: 'บันทึกจ่ายแล้วครบทุกคนเรียบร้อย',
      memberUpdated: 'อัปเดตข้อมูลสมาชิกเรียบร้อย',
      memberAdded: 'เพิ่มสมาชิกเรียบร้อย',
      planUpdated: 'อัปเดตแพ็กเกจเรียบร้อย',
      hostSaved: 'บันทึกข้อมูลโฮสต์เรียบร้อย',
      hostUnlocked: 'ปลดล็อกโหมดโฮสต์เรียบร้อย',
      hostLocked: 'ล็อกโหมดโฮสต์เรียบร้อย',
      copied: 'คัดลอกเรียบร้อย',
      hubHeadline: 'แชร์ค่าบริการแฟมิลี่<br>จัดการง่ายทุกกลุ่ม',
      hubTagline: 'ติดตามการจ่ายเงินรายเดือน ส่งแจ้งเตือน และจัดการสมาชิกแต่ละแฟมิลี่แยกกันอย่างเป็นระเบียบ',
      openDashboard: 'เปิดหน้าจัดการ',
      exportConfig: 'คัดลอกการตั้งค่าเริ่มต้นสำหรับเว็บไซต์'
    },
    en: {
      langBtn: '🇬🇧 EN',
      langTitle: 'สลับเป็นภาษาไทย / Switch to Thai',
      brandSub: 'Family sharing manager',
      allFamilies: 'All family sites',
      contactHost: 'Contact host',
      hostLogin: 'Host login',
      hostMode: 'Host Mode',
      hostLock: 'Lock Host Mode',
      hostSettings: 'Host profile & settings',
      backupRestore: 'Backup & restore',
      planCost: 'Plan cost',
      perMonth: ' /mo',
      perMember: 'Per member',
      dueDay: 'Due day',
      seats: 'Seats',
      paidCount: '{paid} of {n} paid',
      collected: 'Collected',
      collectedSub: '{paid} of {n} members paid',
      outstanding: 'Outstanding',
      outstandingSub: '{unpaid} member{s} to follow up',
      planCostLabel: 'Plan cost',
      billedOnDay: 'Billed on day {day} each month',
      netCost: 'Your net cost',
      surplus: 'Surplus',
      whenAllPay: 'When all {n} members pay {pp}',
      tabPayments: 'Payments',
      tabMembers: 'Members',
      tabPlan: 'Plan & billing',
      monthlyPayments: 'Monthly payments',
      trackPaymentsDesc: 'Track who has paid for {month}.',
      today: 'Today',
      searchPlaceholder: 'Search members...',
      filterAll: 'All',
      filterPending: 'Unpaid',
      filterPaid: 'Paid',
      copyPending: 'Copy unpaid summary',
      markAllPaid: 'Mark all paid',
      confirmMarkAll: 'Mark every member as paid for {month}?',
      historyTitle: 'Last 6 months · collection rate',
      noMembersYet: 'No members yet',
      noMembersYetSub: 'Add the people who share this plan in the Members tab.',
      noMatching: 'No matching members',
      noMatchingSub: 'Try a different search or filter.',
      member: 'Member',
      amount: 'Amount',
      status: 'Status',
      actions: 'Actions',
      paid: 'Paid',
      unpaid: 'Unpaid',
      undo: 'Undo',
      markPaid: 'Mark paid',
      payNow: 'Pay',
      invoice: 'Invoice',
      copyReminder: 'Copy reminder',
      reminderCopied: 'Reminder message copied',
      familyMembers: 'Family members',
      familyMembersDesc: 'Everyone sharing the {plan} plan.',
      addMember: 'Add member',
      editMember: 'Edit member',
      seatsUsed: 'Seats used',
      seatsOf: '{used} of {max}',
      overCapacity: ' · over capacity',
      noContactAdded: 'No contact added',
      familyMemberDefault: 'Family member',
      planSettings: 'Plan & billing',
      planSettingsDesc: 'Update the subscription price and how it is split.',
      planName: 'Plan name',
      monthlyCost: 'Monthly cost',
      seatsAvailable: 'Seats available',
      chargePerMember: 'Charge per member',
      autoRound: 'Round up',
      autoHint: 'Leave empty to split equally. "Round up" uses cost ÷ seats, rounded up.',
      billingDayOfMonth: 'Billing day of month',
      hostSharesSeat: 'I take one seat',
      hostSharesSeatSub: 'The host is part of the family plan and covers the remainder.',
      notes: 'Notes',
      saveChanges: 'Save changes',
      unlockToEdit: 'Unlock Host Mode to edit',
      memberViewBannerTitle: 'Member view',
      memberViewBannerDesc: 'Subscription settings and seat allocation are managed by your host.',
      howItBreaksDown: 'How it breaks down',
      exactSplit: 'Exact split ({total} ÷ {seats})',
      membersEnrolled: 'Members enrolled',
      collectedWhenAll: 'Collected when everyone pays',
      invoiceTitle: 'Invoice',
      totalDue: 'Total due',
      promptPayTitle: 'PromptPay',
      promptPayFallback: 'Add your PromptPay number in Host profile to show a scannable QR code.',
      promptPayOffline: 'QR image needs an internet connection. Transfer {amount} to',
      sendSlipToHost: 'Send slip to host',
      close: 'Close',
      cancel: 'Cancel',
      hostProfileTitle: 'Host profile & settings',
      hostProfileSub: 'Shared across every family site on this browser.',
      aboutYou: 'About you',
      displayName: 'Display name',
      roleTagline: 'Role / tagline',
      availabilityNote: 'Availability note',
      contactChannels: 'Contact channels',
      paymentDetails: 'Payment details',
      promptPayLabel: 'PromptPay (phone or 13-digit ID)',
      promptPaySub: 'Used to generate a scannable QR code with the exact amount.',
      bankName: 'Bank',
      bankAccount: 'Account number',
      hostSecurityTitle: 'Host Security & Passcode',
      hostPinLabel: 'Host PIN / Passcode',
      hostPinHint: 'Passcode required to edit members, prices, host details, or mark payments. Default is 1234.',
      reminderTemplate: 'Reminder message template',
      templateHint: 'Placeholders: {name} {plan} {month} {amount} {due} {promptpay} {bank} {account}',
      saveProfile: 'Save profile',
      hostVerificationTitle: 'Host Verification',
      enterPinToUnlock: 'Enter your 4-digit host passcode to unlock host controls.',
      enterPinTo: 'Enter passcode to {action}.',
      defaultPinNote: 'Default passcode is 1234. You can change this anytime in Host Settings.',
      incorrectPin: 'Incorrect passcode. Please try again.',
      unlockHostMode: 'Unlock Host Mode',
      contactHostTitle: 'Contact your host',
      contactHostSub: 'Questions about payments, seats or joining the plan? Reach out any time.',
      sendQuickMsg: 'Send a quick message',
      yourName: 'Your name',
      whoIsThisFrom: 'Who is this from?',
      messageText: 'Message',
      msgPlaceholder: 'e.g. I have paid this month share - slip attached.',
      sendEmail: 'Send by email',
      copyForChat: 'Copy for LINE / chat',
      noContactDetailsYet: 'No contact details yet.',
      addYoursPrompt: 'Add yours so family members can reach you.',
      backupTitle: 'Backup & restore',
      backupSub: 'Your data lives in this browser. Keep a copy somewhere safe.',
      exportBackup: 'Download a JSON backup',
      importBackup: 'Restore from a backup file',
      resetDefaults: 'Restore this site defaults',
      resetWarning: 'Reset this site to its defaults? Members and payment history will be replaced.',
      dataStoredPrivately: 'Data is stored privately in this browser.',
      hostModeActive: 'Host Mode active',
      lock: 'Lock',
      memberView: 'Member view',
      unpaidSummaryCopied: 'Unpaid summary copied',
      allMarkedPaid: 'All members marked as paid',
      memberUpdated: 'Member updated',
      memberAdded: 'Member added',
      planUpdated: 'Plan updated',
      hostSaved: 'Host profile saved',
      hostUnlocked: 'Host Mode unlocked',
      hostLocked: 'Host Mode locked',
      copied: 'Copied',
      hubHeadline: 'Shared subscriptions,<br>sorted for every family',
      hubTagline: 'Track monthly payments, send reminders and keep each family group organised in its own space.',
      openDashboard: 'Open dashboard',
      exportConfig: 'Copy config for website defaults'
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

  function shiftMonth(ym, delta) {
    const p = ym.split('-').map(Number);
    const d = new Date(p[0], p[1] - 1 + delta, 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  const AVATAR_COLORS = ['#6366f1', '#0ea5e9', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#22c55e', '#f97316', '#06b6d4'];
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
    'Please send the slip after transfer. Thank you! 🙏';

  const DEFAULT_HOST = {
    name: 'Your Name',
    title: 'Family plan host',
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
    const t = document.createElement('div');
    t.className = 'toast ' + (type === 'error' ? 'error' : '');
    t.innerHTML = icon(type === 'error' ? 'close' : 'check') + '<span>' + esc(message) + '</span>';
    box.appendChild(t);
    setTimeout(function () {
      t.style.opacity = '0'; t.style.transform = 'translateY(8px)';
      setTimeout(function () { t.remove(); }, 220);
    }, 2800);
  }

  function copyText(text, okMsg) {
    const done = function () { toast(okMsg || 'Copied to clipboard'); };
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

  try {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = getLang();
    }
  } catch (e) {}

  global.SM = {
    HOST_KEY: HOST_KEY, PIN_STORAGE_KEY: PIN_STORAGE_KEY, icon: icon, esc: esc, fmt: fmt, ymNow: ymNow, monthLabel: monthLabel,
    shiftMonth: shiftMonth, avatar: avatar, loadHost: loadHost, saveHost: saveHost,
    isHostUnlocked: isHostUnlocked, unlockHost: unlockHost, lockHost: lockHost,
    getLang: getLang, setLang: setLang, toggleLang: toggleLang, t: t, I18N: I18N,
    DEFAULT_HOST: DEFAULT_HOST, contactChannels: contactChannels, urlFor: urlFor,
    toast: toast, copyText: copyText
  };
})(window);
