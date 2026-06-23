# AI-Next Günlük Outreach Skill

Bu skill her sabah çalışır. Nihat'ın verdiği 10 prospect listesini alır, araştırır, kişiselleştirilmiş email yazar, LinkedIn mesajlarını hazırlar ve CRM'e ekler.

## Tetikleyiciler
- "Bugünkü prospectleri işle"
- "Outreach başlat"
- "Şu 10 kişiyi ekle: ..."
- Sabah scheduled run

## Input Formatı
Nihat şu formatta liste verir (ya da sadece şirket + isim):
```
1. Şirket Adı | Karar Verici | Sektör | LinkedIn URL (opsiyonel)
2. ...
```

Eğer sadece şirket adı verilmişse, Claude araştırarak tamamlar.

## Adım 1: Prospect Araştırma

Her prospect için web'de araştır:
- Şirketin ne yaptığı (1 cümle)
- Sektörü (Sağlık / İnşaat / Sigorta / Diğer)
- Karar verici adı ve rolü (eğer verilmemişse bul)
- Kurumsal email tahmini (format: ad@sirket.com.tr veya info@sirket.com.tr)
- LinkedIn profil URL'si (mümkünse)
- Şirkete özgü 1 kişiselleştirme cümlesi (email'de kullanılacak)

## Adım 2: Email Üretimi

`/Users/nihat/DevS/ai-next/outreach/templates.md` dosyasını oku.
Sektöre göre doğru şablonu seç.
Her prospect için köşeli parantezleri doldur:
- [AD SOYAD] → karar vericinin adı
- [ŞİRKET] → şirket adı
- İtalik açıklama → şirkete özgü 1 cümle (araştırmadan)

Hangi PDF'in ekleneceğini belirt:
- Sağlık → ai-next-saglik.pdf (klasör: /Users/nihat/DevS/ai-next/outreach/pdf/)
- İnşaat → ai-next-insaat.pdf
- Sigorta → ai-next-sigorta.pdf

## Adım 3: LinkedIn Hazırlığı

Her prospect için:
1. Bağlantı notu: şablondan kişiselleştirilmiş (300 karakter altı)
2. Kabul sonrası mesaj: hazır, kopyalanmaya hazır

LinkedIn URL'si biliniyorsa listele. Bilinmiyorsa "LinkedIn'de ara: [Ad Soyad] + [Şirket]" yaz.

## Adım 4: CRM Güncellemesi

`/Users/nihat/DevS/ai-next/crm-dashboard.html` dosyasını oku.
PROSPECTS[] dizisine yeni kayıtları ekle:

```js
{ id: [son_id+1],
  sirket: "...",
  sektor: "...",
  karar_verici: "...",
  rol: "...",
  eposta: "...",
  calisanlar: 0,
  oncelik: "Orta",
  asama: "Araştırılıyor",
  son_temas: "",
  fu1: "", fu2: "",
  yanit: false,
  otomasyon: "...",
  gozlem: "...",
  not_: "...",
  linkedin_url: "...",
  linkedin_baglanti: "Gönderilmedi",  // Gönderilmedi | Gönderildi | Kabul Edildi | Mesajlandı
  linkedin_not: ""
}
```

Dosyayı kaydet.

## Adım 5: Günlük Özet Çıktısı

Aşağıdaki formatı kullan:

---
**📋 Bugünkü Outreach Özeti — [tarih]**

**Toplam:** 10 prospect işlendi

| # | Şirket | Karar Verici | Email | Sektör | PDF |
|---|--------|--------------|-------|--------|-----|
| 1 | ... | ... | ... | ... | saglik |
...

**📧 Email Kopyaları:**
Her email için konu + gövde, kopyalamaya hazır.

**💼 LinkedIn Notları:**
Her bağlantı notu, kopyalamaya hazır.

**💬 Kabul Sonrası Mesajlar:**
Her mesaj, kopyalamaya hazır.

---

## Adım 6: LinkedIn Chrome Otomasyonu (opsiyonel)

Eğer Nihat "LinkedIn'e gönder" derse:
→ `linkedin-connect` flow'u başlat (aşağıda ayrı skill)

---

## Notlar
- Günde max 10 prospect (domain güvenliği)
- Email gönderimi Nihat yapar (Gmail browser, manuel)
- LinkedIn bağlantısı da Nihat onayıyla Claude in Chrome gönderir
- CRM her zaman güncel kalır
