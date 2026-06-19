/**
 * AI-Next CRM — Google Apps Script Web App
 *
 * KURULUM (bir kez):
 *   1. Google Sheet aç → Extensions → Apps Script
 *   2. Bu dosyayı yapıştır (mevcut kodu sil)
 *   3. Deploy → New deployment → Web app
 *      - Execute as: Me
 *      - Who has access: Anyone  (veya Anyone with Google account)
 *   4. Deploy et → URL'yi kopyala
 *   5. crm-dashboard.html içinde WEBAPI_URL değişkenine yapıştır
 *
 * Desteklenen istekler:
 *   POST { action: "updateStage", id: 3, asama: "Email 1 Gönderildi", son_temas: "2026-06-19" }
 *   POST { action: "updateField", id: 3, field: "yanit", value: "Evet" }
 *   GET  ?action=getAll  →  tüm satırları JSON döner
 */

const SHEET_NAME = "Pipeline";
const COL = {
  sirket: 1, sektor: 2, ad: 3, rol: 4, eposta: 5,
  calisan: 6, oncelik: 7, asama: 8, son_temas: 9,
  fu1: 10, fu2: 11, yanit: 12, yanit_turu: 13,
  otomasyon: 14, gozlem: 15, not_: 16
};

function doGet(e) {
  const action = e.parameter.action;
  if (action === "getAll") {
    return jsonResponse(getAllRows());
  }
  return jsonResponse({ error: "Unknown action" });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    if (action === "updateStage") {
      const result = updateRowField(body.id, "asama", body.asama);
      if (body.son_temas) updateRowField(body.id, "son_temas", body.son_temas);
      return jsonResponse({ ok: true, updated: body.id, asama: body.asama });
    }

    if (action === "updateField") {
      const result = updateRowField(body.id, body.field, body.value);
      return jsonResponse({ ok: true, updated: body.id });
    }

    return jsonResponse({ error: "Unknown action: " + action });
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

function getAllRows() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return { error: "Sheet '" + SHEET_NAME + "' bulunamadı" };

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const row = {};
    headers.forEach((h, j) => {
      row[h] = values[i][j];
    });
    row._row = i + 1;
    rows.push(row);
  }
  return rows;
}

function updateRowField(id, field, value) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return false;

  const colIdx = COL[field];
  if (!colIdx) return false;

  const lastRow = sheet.getLastRow();

  // Find row by id (1-based id = row index + 1)
  const targetRow = id + 1;
  if (targetRow < 2 || targetRow > lastRow) return false;

  sheet.getRange(targetRow, colIdx).setValue(value);
  return true;
}

function jsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ─── ONE-TIME SETUP: run this once to verify sheet structure ─────────
function checkSetup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    SpreadsheetApp.getUi().alert('❌ "Pipeline" adında sheet bulunamadı. Sheet adını kontrol et.');
    return;
  }
  const headers = sheet.getRange(1, 1, 1, 16).getValues()[0];
  SpreadsheetApp.getUi().alert(
    '✅ Sheet bulundu!\nSatır sayısı: ' + (sheet.getLastRow() - 1) + '\n' +
    'İlk sütun: ' + headers[0]
  );
}
