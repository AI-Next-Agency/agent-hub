# LinkedIn Bağlantı ve Mesaj Otomasyonu

Claude in Chrome kullanarak LinkedIn'de bağlantı gönderme ve kabul sonrası mesajlaşma.

## Tetikleyiciler
- "LinkedIn bağlantılarını gönder"
- "Bugünkü LinkedIn'leri at"
- "Kabul edilenlere mesaj gönder"

---

## FLOW A: Bağlantı İsteği Gönderme

### Ön Koşul
- Nihat LinkedIn'de giriş yapmış olmalı (Chrome'da)
- Prospect listesi hazır (günlük outreach skill çıktısından)

### Adımlar

1. `mcp__Claude_in_Chrome__navigate` ile LinkedIn'i aç: `https://www.linkedin.com`
2. Her prospect için sırayla:
   a. LinkedIn URL biliniyorsa direkt git: `mcp__Claude_in_Chrome__navigate` → URL
   b. URL bilinmiyorsa: `https://www.linkedin.com/search/results/people/?keywords=[AD+SOYAD+SİRKET]` ara
   c. `mcp__Claude_in_Chrome__get_page_text` ile sayfayı oku, doğru profili bul
   d. "Bağlan" / "Connect" butonunu bul: `mcp__Claude_in_Chrome__find` → "Connect"
   e. Butona tıkla: `mcp__Claude_in_Chrome__javascript_tool`
   f. "Not ekle" / "Add a note" seç
   g. Kişiselleştirilmiş notu yaz (templates.md'den): `mcp__Claude_in_Chrome__form_input`
   h. Gönder

3. Her gönderimden sonra CRM'de `linkedin_baglanti: "Gönderildi"` ve `son_temas: [bugün]` güncelle
4. Günde max 15-20 bağlantı isteği (LinkedIn limiti)

### Onay Akışı
Her profile gitmeden önce Nihat'a göster:
"[AD SOYAD] — [ŞİRKET] profiline gidiyorum. Bağlantı notu: '[NOT]' — onaylıyor musunuz? (e/h)"

---

## FLOW B: Kabul Edilenleri Kontrol Et ve Mesajla

### Ne Zaman Çalışır
- Her gün sabah nightly script'ten sonra
- Veya Nihat "kabul edilenleri kontrol et" dediğinde

### Adımlar

1. `mcp__Claude_in_Chrome__navigate` → `https://www.linkedin.com/mynetwork/invitation-manager/sent/`
2. `mcp__Claude_in_Chrome__get_page_text` ile kabul edilmiş bağlantıları oku
3. CRM'deki `linkedin_baglanti: "Gönderildi"` olan kayıtlarla karşılaştır
4. Kabul edilmiş olanları bul → `linkedin_baglanti: "Kabul Edildi"` güncelle
5. Bu kişilere mesaj gönder:
   a. `mcp__Claude_in_Chrome__navigate` → profil sayfası
   b. "Mesaj" / "Message" butonunu tıkla
   c. templates.md'den sektöre uygun kabul mesajını yaz
   d. Nihat'a göster ve onay al
   e. Gönder → `linkedin_baglanti: "Mesajlandı"` güncelle

---

## FLOW C: Gelen Kutusu Tarama (Yanıt Takibi)

### Adımlar

1. `mcp__Claude_in_Chrome__navigate` → `https://www.linkedin.com/messaging/`
2. `mcp__Claude_in_Chrome__get_page_text` ile son mesajları oku
3. CRM'deki isimlerle eşleştir, yanıt gelenleri bul
4. Rapor: "Şu kişilerden yanıt gelmiş: [liste]"
5. CRM'de `yanit: true` ve `asama: "Pozitif"` güncelle

---

## CRM LinkedIn Alanları

PROSPECTS[] içinde her kayıt şunları içerir:
```js
linkedin_url: "https://linkedin.com/in/...",
linkedin_baglanti: "Gönderilmedi",  // → Gönderildi → Kabul Edildi → Mesajlandı
linkedin_not: "Bağlantı notu metni"
```

---

## Günlük LinkedIn Limitleri (Yanmamak İçin)

| Aksiyon | Güvenli Limit |
|---------|---------------|
| Bağlantı isteği | 15-20/gün |
| Mesaj gönderme | 20-25/gün |
| Profil ziyareti | 80-100/gün |

Bunların üstüne çıkma. LinkedIn hesabını kısıtlayabilir.
