/**
 * AI-Next Pipeline CRM — Advanced Apps Script
 * Features:
 *   - formatCRM(): One-time sheet formatting (run first)
 *   - onOpen(): Adds "CRM" menu to sheet
 *   - showSidebar(): Click any row → sidebar shows full prospect details
 *   - Search: Filter rows by company/sector/stage/priority
 *   - Next action calculation: shows what email is due and when
 *
 * SETUP:
 *   1. Extensions → Apps Script
 *   2. Paste entire file
 *   3. Run formatCRM() once (for styling)
 *   4. Run setupTrigger() once (for auto-sidebar on row click)
 *   5. Reload the sheet — "CRM" menu appears
 */

// ─── Column map ───────────────────────────────────────────────────
const COLS = {
  sirket: 1, sektor: 2, ad: 3, rol: 4, email: 5,
  calisan: 6, oncelik: 7, asama: 8, sonTemas: 9,
  fu1: 10, fu2: 11, yanit: 12, yanitTuru: 13,
  otomasyon: 14, gozlem: 15, not: 16
};

// ─── Menu ─────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚀 CRM')
    .addItem('📋 Prospect Detayı (seçili satır)', 'showSidebarForSelection')
    .addSeparator()
    .addItem('🔍 Ara / Filtrele', 'showSearchDialog')
    .addItem('🔄 Filtreyi Temizle', 'clearFilter')
    .addSeparator()
    .addItem('📅 Bugün Ne Yapılacak?', 'showTodayActions')
    .addSeparator()
    .addItem('🎨 Formatla (ilk kurulum)', 'formatCRM')
    .addToUi();
}

// ─── Sidebar: show detail for selected row ────────────────────────
function showSidebarForSelection() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = sheet.getActiveCell().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert('Lütfen bir prospect satırı seçin (başlık satırı değil).');
    return;
  }
  showSidebarForRow(row);
}

function showSidebarForRow(row) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getRange(row, 1, 1, 16).getValues()[0];

  const sirket    = data[COLS.sirket - 1]    || '—';
  const sektor    = data[COLS.sektor - 1]    || '—';
  const ad        = data[COLS.ad - 1]        || '—';
  const rol       = data[COLS.rol - 1]       || '—';
  const email     = data[COLS.email - 1]     || '—';
  const calisan   = data[COLS.calisan - 1]   || '—';
  const oncelik   = data[COLS.oncelik - 1]   || '—';
  const asama     = data[COLS.asama - 1]     || '—';
  const sonTemas  = formatDate(data[COLS.sonTemas - 1]);
  const fu1       = formatDate(data[COLS.fu1 - 1]);
  const fu2       = formatDate(data[COLS.fu2 - 1]);
  const yanit     = data[COLS.yanit - 1]     || '—';
  const yanitTuru = data[COLS.yanitTuru - 1] || '—';
  const otomasyon = data[COLS.otomasyon - 1] || '—';
  const gozlem    = data[COLS.gozlem - 1]    || '—';
  const notlar    = data[COLS.not - 1]       || '—';

  const nextAction = getNextAction(asama, sonTemas, fu1, fu2);

  const stageBadge = getStageBadge(asama);
  const prioColor  = getPrioColor(oncelik);

  const html = HtmlService.createHtmlOutput(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Arial, sans-serif;
    font-size: 12px;
    background: #F8F9FC;
    color: #1A1F2E;
    padding: 12px;
  }
  .company {
    font-size: 15px;
    font-weight: bold;
    color: #1A1F2E;
    margin-bottom: 2px;
  }
  .sector {
    font-size: 11px;
    color: #666;
    margin-bottom: 10px;
  }
  .badges {
    display: flex;
    gap: 6px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
  .badge {
    padding: 3px 9px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: bold;
  }
  .next-action {
    background: #1A6FD4;
    color: white;
    border-radius: 8px;
    padding: 10px 12px;
    margin-bottom: 14px;
    font-size: 11px;
    line-height: 1.6;
  }
  .next-action .label {
    font-size: 10px;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }
  .next-action .value {
    font-weight: bold;
    font-size: 12px;
  }
  .section {
    background: white;
    border-radius: 8px;
    padding: 10px 12px;
    margin-bottom: 8px;
    border: 1px solid #E8EAF0;
  }
  .section-title {
    font-size: 9px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #888;
    margin-bottom: 8px;
  }
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    gap: 8px;
  }
  .lbl { color: #888; font-size: 11px; flex-shrink: 0; }
  .val { color: #1A1F2E; font-size: 11px; font-weight: 500; text-align: right; word-break: break-word; }
  .email-val { color: #1A6FD4; font-size: 11px; font-weight: 500; word-break: break-all; }
  .long-text {
    font-size: 11px;
    color: #333;
    line-height: 1.5;
    margin-top: 2px;
  }
  .btn {
    display: block;
    width: 100%;
    background: #1A1F2E;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 9px;
    font-size: 11px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 4px;
    text-align: center;
    text-decoration: none;
  }
  .btn:hover { background: #2D3548; }
  .btn-secondary {
    background: transparent;
    color: #1A6FD4;
    border: 1px solid #1A6FD4;
    margin-top: 6px;
  }
</style>
</head>
<body>

<div class="company">${escHtml(sirket)}</div>
<div class="sector">${escHtml(sektor)} · ${escHtml(calisan)} çalışan</div>

<div class="badges">
  <span class="badge" style="background:${stageBadge.bg};color:${stageBadge.fg}">${escHtml(asama)}</span>
  <span class="badge" style="background:${prioColor.bg};color:${prioColor.fg}">${escHtml(oncelik)}</span>
</div>

<div class="next-action">
  <div class="label">⏭ Sıradaki Aksiyon</div>
  <div class="value">${escHtml(nextAction.action)}</div>
  ${nextAction.date ? `<div style="font-size:11px;opacity:0.9;margin-top:2px">${escHtml(nextAction.date)}</div>` : ''}
</div>

<div class="section">
  <div class="section-title">İletişim</div>
  <div class="row"><span class="lbl">Kişi</span><span class="val">${escHtml(ad)}</span></div>
  <div class="row"><span class="lbl">Rol</span><span class="val">${escHtml(rol)}</span></div>
  <div class="row"><span class="lbl">E-posta</span><span class="email-val">${escHtml(email)}</span></div>
  <a class="btn btn-secondary" href="mailto:${escHtml(email)}">✉ Mail Oluştur</a>
</div>

<div class="section">
  <div class="section-title">Pipeline Geçmişi</div>
  <div class="row"><span class="lbl">Son Temas</span><span class="val">${escHtml(sonTemas)}</span></div>
  <div class="row"><span class="lbl">Follow-up 1</span><span class="val">${escHtml(fu1)}</span></div>
  <div class="row"><span class="lbl">Follow-up 2</span><span class="val">${escHtml(fu2)}</span></div>
  <div class="row"><span class="lbl">Yanıt</span><span class="val">${escHtml(yanit)}</span></div>
  <div class="row"><span class="lbl">Yanıt Türü</span><span class="val">${escHtml(yanitTuru)}</span></div>
</div>

<div class="section">
  <div class="section-title">Otomasyon Fırsatı</div>
  <div class="long-text">${escHtml(otomasyon)}</div>
</div>

<div class="section">
  <div class="section-title">Gözlem & Not</div>
  <div class="long-text">${escHtml(gozlem)}</div>
  ${notlar !== '—' ? `<div class="long-text" style="margin-top:6px;padding-top:6px;border-top:1px solid #eee">${escHtml(notlar)}</div>` : ''}
</div>

</body>
</html>
`)
    .setTitle(sirket)
    .setWidth(320);

  SpreadsheetApp.getUi().showSidebar(html);
}

// ─── Search dialog ────────────────────────────────────────────────
function showSearchDialog() {
  const html = HtmlService.createHtmlOutput(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; font-size: 13px; padding: 16px; }
  label { display: block; font-size: 11px; font-weight: bold; margin-bottom: 4px; color: #555; margin-top: 12px; }
  input, select {
    width: 100%; padding: 7px 10px;
    border: 1px solid #DDE1EA; border-radius: 6px;
    font-size: 12px; color: #1A1F2E;
    box-sizing: border-box;
  }
  .btn {
    width: 100%; margin-top: 16px;
    background: #1A1F2E; color: white;
    border: none; border-radius: 6px;
    padding: 10px; font-size: 13px; font-weight: bold;
    cursor: pointer;
  }
  .btn:hover { background: #2D3548; }
  .status { margin-top: 10px; font-size: 11px; color: #1A7A45; text-align: center; }
</style>
</head>
<body>
<label>Şirket Adı (içerir)</label>
<input id="sirket" type="text" placeholder="örn: GAMA">

<label>Aşama</label>
<select id="asama">
  <option value="">— Tümü —</option>
  <option>Araştırılıyor</option>
  <option>Email 1 Gönderildi</option>
  <option>Follow-up 1 Gönderildi</option>
  <option>Follow-up 2 Gönderildi</option>
  <option>Pozitif</option>
  <option>Arşiv</option>
</select>

<label>Sektör</label>
<select id="sektor">
  <option value="">— Tümü —</option>
  <option>Sağlık Zinciri</option>
  <option>Mühendislik / Müşavirlik</option>
  <option>Sigorta Brokerlik</option>
  <option>Sigorta</option>
</select>

<label>AI Önceliği</label>
<select id="oncelik">
  <option value="">— Tümü —</option>
  <option>Yüksek</option>
  <option>Orta</option>
  <option>Düşük</option>
</select>

<button class="btn" onclick="runFilter()">🔍 Filtrele</button>
<div id="status" class="status"></div>

<script>
function runFilter() {
  const params = {
    sirket:  document.getElementById('sirket').value,
    asama:   document.getElementById('asama').value,
    sektor:  document.getElementById('sektor').value,
    oncelik: document.getElementById('oncelik').value,
  };
  document.getElementById('status').textContent = 'Filtreleniyor...';
  google.script.run
    .withSuccessHandler(n => {
      document.getElementById('status').textContent = n + ' sonuç gösteriliyor.';
    })
    .applyFilter(params);
}
</script>
</body>
</html>
`)
    .setWidth(320)
    .setHeight(380)
    .setTitle('Ara / Filtrele');

  SpreadsheetApp.getUi().showModalDialog(html, '🔍 Ara / Filtrele');
}

function applyFilter(params) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  let visible = 0;

  for (let r = 2; r <= lastRow; r++) {
    const row = sheet.getRange(r, 1, 1, 16).getValues()[0];
    const sirket  = String(row[COLS.sirket - 1]).toLowerCase();
    const asama   = row[COLS.asama - 1];
    const sektor  = row[COLS.sektor - 1];
    const oncelik = row[COLS.oncelik - 1];

    const match =
      (!params.sirket  || sirket.includes(params.sirket.toLowerCase())) &&
      (!params.asama   || asama   === params.asama) &&
      (!params.sektor  || sektor  === params.sektor) &&
      (!params.oncelik || oncelik === params.oncelik);

    if (match) {
      sheet.showRows(r);
      visible++;
    } else {
      sheet.hideRows(r);
    }
  }
  return visible;
}

function clearFilter() {
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.showRows(2, sheet.getLastRow() - 1);
  SpreadsheetApp.getUi().alert('Filtre temizlendi — tüm satırlar görünüyor.');
}

// ─── Today's actions ───────────────────────────────────────────────
function showTodayActions() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = [];
  const overdue = [];

  for (let r = 2; r <= lastRow; r++) {
    const row    = sheet.getRange(r, 1, 1, 16).getValues()[0];
    const sirket = row[COLS.sirket - 1];
    const asama  = row[COLS.asama - 1];
    const sonTemas = toDate(row[COLS.sonTemas - 1]);
    if (!sonTemas) continue;

    const daysSince = Math.floor((today - sonTemas) / 86400000);

    if (asama === 'Email 1 Gönderildi') {
      if (daysSince === 4) due.push(`📧 D4 Follow-up: ${sirket} (${daysSince} gün oldu)`);
      else if (daysSince > 4) overdue.push(`⚠️ D4 GECIKMIŞ: ${sirket} (${daysSince} gün)`);
    }
    if (asama === 'Follow-up 1 Gönderildi') {
      if (daysSince === 5) due.push(`📧 D9 Breakup: ${sirket} (${daysSince} gün oldu)`);
      else if (daysSince > 5) overdue.push(`⚠️ D9 GECIKMIŞ: ${sirket} (${daysSince} gün)`);
    }
  }

  const msg = [
    '📅 BUGÜN YAPILACAKLAR',
    '',
    due.length ? due.join('\n') : 'Bugün zamanı gelen email yok.',
    overdue.length ? '\n⚠️ GECİKMİŞLER:\n' + overdue.join('\n') : ''
  ].join('\n');

  SpreadsheetApp.getUi().alert(msg);
}

// ─── Helpers ──────────────────────────────────────────────────────
function getNextAction(asama, sonTemas, fu1, fu2) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sonTemasD = toDate(sonTemas);
  if (!sonTemasD) {
    if (asama === 'Araştırılıyor') return { action: 'D1 email gönderilecek', date: null };
    return { action: '—', date: null };
  }

  const daysSince = Math.floor((today - sonTemasD) / 86400000);

  if (asama === 'Araştırılıyor') {
    return { action: 'D1 ilk email gönder', date: null };
  }
  if (asama === 'Email 1 Gönderildi') {
    const daysLeft = 4 - daysSince;
    if (daysLeft > 0) return { action: `D4 follow-up için ${daysLeft} gün kaldı`, date: addDays(sonTemasD, 4) };
    if (daysLeft === 0) return { action: '🔔 BUGÜN D4 follow-up gönder!', date: 'Bugün' };
    return { action: `⚠️ D4 follow-up ${Math.abs(daysLeft)} gün gecikmiş!`, date: null };
  }
  if (asama === 'Follow-up 1 Gönderildi') {
    const daysLeft = 5 - daysSince;
    if (daysLeft > 0) return { action: `D9 breakup için ${daysLeft} gün kaldı`, date: addDays(sonTemasD, 5) };
    if (daysLeft === 0) return { action: '🔔 BUGÜN D9 breakup gönder!', date: 'Bugün' };
    return { action: `⚠️ D9 breakup ${Math.abs(daysLeft)} gün gecikmiş!`, date: null };
  }
  if (asama === 'Follow-up 2 Gönderildi') {
    if (daysSince >= 7) return { action: '📦 Arşivlenmeye hazır', date: null };
    return { action: `Yanıt beklenyor (${7 - daysSince} gün kaldı → Arşiv)`, date: null };
  }
  if (asama === 'Pozitif') return { action: '🎯 Toplantı planla!', date: null };
  if (asama === 'Arşiv') return { action: 'Arşivlenmiş', date: null };
  return { action: '—', date: null };
}

function getStageBadge(asama) {
  const map = {
    'Araştırılıyor':           { bg: '#EFF1F5', fg: '#5C667A' },
    'Email 1 Gönderildi':      { bg: '#EAF2FF', fg: '#1A6FD4' },
    'Follow-up 1 Gönderildi':  { bg: '#F3EEFF', fg: '#7C3AED' },
    'Follow-up 2 Gönderildi':  { bg: '#FFF7E6', fg: '#C47F00' },
    'Pozitif':                 { bg: '#E6F7EE', fg: '#1A7A45' },
    'Arşiv':                   { bg: '#F0F0F0', fg: '#888888' },
  };
  return map[asama] || { bg: '#F0F0F0', fg: '#888' };
}

function getPrioColor(p) {
  if (p === 'Yüksek') return { bg: '#FDECEA', fg: '#C0392B' };
  if (p === 'Orta')   return { bg: '#FEF9E7', fg: '#B7770D' };
  return { bg: '#F0F0F0', fg: '#888' };
}

function formatDate(val) {
  if (!val) return '—';
  if (val instanceof Date) {
    return Utilities.formatDate(val, Session.getScriptTimeZone(), 'dd MMM yyyy');
  }
  return String(val);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd MMM yyyy');
}

function toDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  const d = new Date(val);
  return isNaN(d) ? null : d;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── ONE-TIME FORMAT ──────────────────────────────────────────────
function formatCRM() {
  const ws = SpreadsheetApp.getActiveSheet();
  const LAST_COL = 16;
  const LAST_ROW = ws.getLastRow();

  const widths = [200,170,170,200,210,80,90,170,100,110,110,70,100,350,350,260];
  widths.forEach((w, i) => ws.setColumnWidth(i + 1, w));

  const headerRange = ws.getRange(1, 1, 1, LAST_COL);
  headerRange.setBackground('#1A1F2E');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  headerRange.setFontFamily('Arial');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  ws.setRowHeight(1, 28);
  ws.setFrozenRows(1);

  try { ws.getRange(1,1,1,LAST_COL).createFilter(); } catch(e) {}

  for (let r = 2; r <= LAST_ROW; r++) {
    ws.getRange(r, 1, 1, LAST_COL).setBackground(r % 2 === 0 ? '#F8F9FC' : '#FFFFFF');
    ws.setRowHeight(r, 22);
  }

  const STAGE = {
    'Araştırılıyor':          ['#EFF1F5','#5C667A'],
    'Email 1 Gönderildi':     ['#EAF2FF','#1A6FD4'],
    'Follow-up 1 Gönderildi': ['#F3EEFF','#7C3AED'],
    'Follow-up 2 Gönderildi': ['#FFF7E6','#C47F00'],
    'Pozitif':                ['#E6F7EE','#1A7A45'],
    'Arşiv':                  ['#F0F0F0','#888888'],
  };
  const PRIO = {
    'Yüksek': ['#FDECEA','#C0392B'],
    'Orta':   ['#FEF9E7','#B7770D'],
    'Düşük':  ['#F0F0F0','#888888'],
  };
  const SEC = {
    'Sağlık Zinciri':           ['#E8F5E9','#2E7D32'],
    'Mühendislik / Müşavirlik': ['#E3F2FD','#1565C0'],
    'Sigorta Brokerlik':        ['#F3E5F5','#6A1B9A'],
    'Sigorta':                  ['#FFF3E0','#E65100'],
  };

  for (let r = 2; r <= LAST_ROW; r++) {
    const row = ws.getRange(r, 1, 1, 16).getValues()[0];

    const asama = row[7];
    if (STAGE[asama]) {
      const c = ws.getRange(r,8);
      c.setBackground(STAGE[asama][0]);c.setFontColor(STAGE[asama][1]);
      c.setFontWeight('bold');c.setHorizontalAlignment('center');
    }
    const prio = row[6];
    if (PRIO[prio]) {
      const c = ws.getRange(r,7);
      c.setBackground(PRIO[prio][0]);c.setFontColor(PRIO[prio][1]);
      c.setFontWeight('bold');c.setHorizontalAlignment('center');
    }
    const sec = row[1];
    if (SEC[sec]) {
      const c = ws.getRange(r,2);
      c.setBackground(SEC[sec][0]);c.setFontColor(SEC[sec][1]);
      c.setHorizontalAlignment('center');
    }
    if (row[4]) ws.getRange(r,5).setFontColor('#1A6FD4');
  }

  ws.getRange(2,6,LAST_ROW-1,1).setHorizontalAlignment('right');
  ws.getRange(2,9,LAST_ROW-1,1).setHorizontalAlignment('center');
  ws.getRange(2,10,LAST_ROW-1,1).setHorizontalAlignment('center');
  ws.getRange(2,11,LAST_ROW-1,1).setHorizontalAlignment('center');
  ws.getRange(2,14,LAST_ROW-1,3).setWrap(true).setVerticalAlignment('top');
  ws.getRange(2,1,LAST_ROW-1,LAST_COL).setFontFamily('Arial').setFontSize(10).setVerticalAlignment('middle');
  ws.setTabColor('#1A6FD4');

  SpreadsheetApp.getUi().alert('✅ CRM formatlandı! Sayfayı yenile — "🚀 CRM" menüsü görünecek.');
}

// ─── Web App API ───────────────────────────────────────────────────
// Deploy: Extensions → Apps Script → Deploy → New deployment
//   Type: Web app | Execute as: Me | Who can access: Anyone
//   Copy the /exec URL into crm-dashboard.html WEBAPI_URL constant.

function doGet() {
  const rows = _getSheetRows();
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, data: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let result = { ok: false, error: 'unknown' };
  try {
    const payload = JSON.parse(e.postData.contents);
    if (payload.action === 'updateStage') {
      _updateRowField(payload.id, 'asama', payload.asama);
      if (payload.son_temas) _updateRowField(payload.id, 'son_temas', payload.son_temas);
      result = { ok: true };
    } else if (payload.action === 'updateField') {
      _updateRowField(payload.id, payload.field, payload.value);
      result = { ok: true };
    } else {
      result = { ok: false, error: 'unknown action: ' + payload.action };
    }
  } catch (err) {
    result = { ok: false, error: err.toString() };
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function _getSheetRows() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const rows = sheet.getRange(2, 1, lastRow - 1, 16).getValues();
  return rows.map((r, i) => ({
    id:           i + 1,
    sirket:       String(r[0]  || ''),
    sektor:       String(r[1]  || ''),
    karar_verici: String(r[2]  || ''),
    rol:          String(r[3]  || ''),
    eposta:       String(r[4]  || ''),
    calisanlar:   Number(r[5]) || 0,
    oncelik:      String(r[6]  || 'Orta'),
    asama:        String(r[7]  || 'Araştırılıyor'),
    son_temas:    _isoDate(r[8]),
    fu1:          _isoDate(r[9]),
    fu2:          _isoDate(r[10]),
    yanit:        r[11] === true || r[11] === 'TRUE' || r[11] === 'true',
    otomasyon:    String(r[13] || ''),
    gozlem:       String(r[14] || ''),
    not_:         String(r[15] || ''),
  }));
}

// id is 1-based row index (row 1 = header, row 2 = first data row = id 1)
function _updateRowField(id, field, value) {
  const fieldToCol = { asama: 8, son_temas: 9, fu1: 10, fu2: 11, yanit: 12 };
  const col = fieldToCol[field];
  if (!col) return;
  SpreadsheetApp.getActiveSheet().getRange(Number(id) + 1, col).setValue(value);
}

function _isoDate(val) {
  if (!val) return '';
  if (val instanceof Date) return Utilities.formatDate(val, 'UTC', 'yyyy-MM-dd');
  return String(val);
}
