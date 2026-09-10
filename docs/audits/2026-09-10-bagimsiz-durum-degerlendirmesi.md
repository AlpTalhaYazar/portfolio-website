# Bağımsız Durum Değerlendirmesi

## 1. İnceleme künyesi

| Alan | Değer |
| --- | --- |
| İnceleme tarihi | 2026-09-10 |
| Depo | `/Users/alptalhayazarwork/personal/portfolio-website` |
| Dal / commit | `main` @ `aa6ccce` |
| Çalışma ağacı durumu | Temiz (inceleme sırasında yalnızca bu rapor eklendi) |
| Dayanak | `docs/audits/2026-07-15-comprehensive-project-audit.md` ve `...-remediation.md` |
| Bulgu sayısı | **P1: 3 / P2: 3 / P3: 4** |

Bu rapor, 2026-07-15 audit'inin "tüm bulgular çözüldü" iddiasını **bağımsız olarak doğrulamak** ve o tarihten sonra oluşan **yeni sorunları** tespit etmek için hazırlanmıştır.

---

## 2. Yönetici özeti

Proje, önceki audit'ten bu yana **gerçekten ve kapsamlı biçimde iyileştirilmiş**. Kod düzeyinde doğruladığım kadarıyla remediation raporundaki iddiaların çoğu abartı değil: durumsuz imzalı CSRF, uç nokta bazlı rate-limit hata politikaları, HTML e-posta kaçışlama, liveness/readiness ayrımı, gerçek analytics onay akışı ve ölü paralel UI ağacının kaldırılması — hepsinin kaynak kodda karşılığı var.

**Ancak release kararı "hazır değil" olmalıdır.** Üç P1 bulgu bunu engelliyor:

1. **CI şu anda kırmızı.** `npm run audit:dependencies` → exit code **1** (ölçüldü). CI'daki bu adım `verify` job'ının ortasında; sonraki tüm adımlar (coverage, build, Playwright) hiç çalışmıyor.
2. **Kritik Next.js güvenlik açığı.** Kurulu `next@16.2.10`, düzeltmenin `16.2.11` olduğu bildirimlerin etki aralığında.
3. **Gerçek hydration mismatch.** Tema bootstrap script'i sunucuda `nonce=""` ile render ediliyor, istemci gerçek nonce'u bekliyor; React ağacı yeniden üretiyor ve 45 console hatası oluşuyor. Bu, **E2E tarafından yakalanmış gerçek bir uygulama hatasıdır**.

Ayrıca **`npm run build` ve `npm run e2e` lokalde çalışmıyor** — ikisi de production ortam değişkeni doğrulamasında duruyor. Bu yüzden E2E yalnızca dev sunucusuna karşı çalıştırılabildi.

---

## 3. Çalıştırılan doğrulamalar

| Komut | Exit | Sonuç |
| --- | ---: | --- |
| `npm run lint` | 0 | Hata yok |
| `npm run type-check` | 0 | Hata yok |
| `npm run test:run` | 0 | 34 dosya, 133 test geçti |
| `npm run test:coverage` | 0 | Eşikler karşılandı (%63,8 ifade / %60,7 dal) |
| `npm run audit:dependencies` | **1** | **Başarısız — 24 açık** |
| `npm --omit=dev audit` | 1 | 5 açık: 1 kritik, 3 yüksek, 1 orta |
| `npm run build` | **1** | **`CSRF_SECRET is required in production`** |
| `npm run e2e` | **1** | **Build'de durdu; Playwright hiç çalışmadı** |
| `npm run e2e:dev` | 1 | Çalıştı: **86 geçti / 10 başarısız / 16 atlandı** |
| `git status` / `git diff --summary` | 0 | Temiz; mod farkı yok |

> **İki ölçüm tuzağı ve uyarı.** (a) `npm run e2e` ilk çalıştırmada `| tail` ile borulandığı için kabuk exit kodu 0 göründü; gerçek kod ayrıca ölçüldü: **1**. (b) İlk iki E2E denemesi **geçersizdi**: port 3000'de önceki turdan kalan bir dev sunucusu vardı, yeni sunucu 3001'e kaçtı, testler ise 3000'e istek attı. Aşağıdaki sonuçlar tüm sunucular öldürülüp portlar boşaltıldıktan sonra yapılan **üçüncü, izole** turdan alınmıştır.

---

## 4. Önceki audit bulgularının bağımsız doğrulaması

| Eski bulgu | Doğrulanan durum | Kanıt |
| --- | --- | --- |
| AUD-001 robots/sitemap 403 | ✅ Çözülmüş | `isSensitivePath` artık yalnızca `.git`/`.env`/`/admin` kontrol ediyor (`src/proxy.ts:39-65`) |
| AUD-003 process-local CSRF | ✅ Çözülmüş | Durumsuz HMAC-SHA256 token, `timingSafeEqual`, cookie bağlama (`src/lib/csrf.ts`) |
| AUD-004 Redis fail-open | ✅ Çözülmüş | Uç nokta bazlı `failureMode`; contact `"closed"` (`src/proxy.ts:12-37`, `src/lib/redis-rate-limit.ts:267-287`) |
| AUD-005 e-posta HTML injection | ✅ Çözülmüş | `escape.ts` + `normalizeHeaderText` (`src/app/api/contact/route.ts:59-61,166`) |
| AUD-006 spam yanlış pozitif | ✅ Çözülmüş | Geniş heuristikler kaldırılmış; yalnızca honeypot |
| AUD-007 health semantiği | ✅ Çözülmüş | Liveness/readiness ayrımı, zaman aşımlı bağımlılık probu (`src/lib/health.ts`) |
| AUD-012 ölü paralel UI ağacı | ✅ Çözülmüş | Dizinler boş; `repo-conventions.test.ts:79-109` geri gelmesini engelliyor |
| AUD-013 doküman kayması | ✅ Çözülmüş | README güncel sürümleri ve kısıtları yansıtıyor; LICENSE durumu dürüstçe belirtilmiş |
| AUD-014 consent'siz analytics | ✅ Çözülmüş | Consent default `denied`, `ga-disable` bayrağı, geri çekme yolu |
| AUD-015 coverage çalışmıyor | ✅ Çözülmüş | Eşikler tanımlı **ve** exit 0 |
| AUD-016 env önceliği | ✅ Çözülmüş | `CSRF_SECRET` production'da zorunlu (`src/lib/env-validation.ts:75-82`) |
| AUD-017 dosya modları | ✅ Çözülmüş | `git diff --summary` boş; konvansiyon testi koruyor |
| AUD-018 logger derlenip siliniyor | ✅ Çözülmüş | `removeConsole` kaldırılmış; özyinelemeli redaksiyon (`src/lib/logger.ts:11-83`) |
| AUD-019 bozuk JSON 500 | ✅ Çözülmüş | 400 `invalid_json`, ayrıştırıcı detayı yok (`route.ts:78-87`) |
| AUD-020 metadata tutarsızlığı | ✅ Çözülmüş | Skip link lokalize; `es.ts` kaldırılmış; manifest güncel |
| AUD-021 reduced motion | ✅ Çözülmüş | `MotionConfig reducedMotion="user"` (`PortfolioThemeProvider.tsx:105`) |
| AUD-008 hydration | ❌ **Kısmen geri dönmüş** | Bkz. **Y-05** |
| AUD-009/010/011 erişilebilirlik | ⚠️ **Doğrulanamadı** | Bkz. **Y-04**, **Y-06** |

Kod düzeyinde en etkileyici düzeltme `Header.tsx`: odak tuzağı, Escape, `inert` + `aria-hidden` arka plan, `aria-expanded`/`aria-controls` ve odak iadesi doğru uygulanmış.

---

## 5. Bulgular

### Y-01 — CI bağımlılık kapısı başarısız (P1)

**Kanıt.** `npm run audit:dependencies` → exit code **1** (ayrı ölçüm).

Komut: `npm audit --audit-level=high && npm audit --omit=dev --audit-level=moderate`

`.github/workflows/ci.yml:46` bu adımı `verify` iş akışının **ortasında** çalıştırıyor. Başarısız olduğu için sonraki adımlar (`test:coverage`, `build`, Playwright matrisi) **hiç çalışmıyor**.

**Etki.** Deponun tek otomatik kalite kapısı devre dışı. Coverage, build ve tarayıcı testleri şu anda hiçbir koruma sağlamıyor — bu, AUD-015'in (kırık kalite kapısı) farklı biçimde geri döndüğünü gösterir.

---

### Y-02 — Kurulu Next.js kritik bildirim aralığında (P1)

Kurulu/kilitli: `next@16.2.10`. Düzeltme: **16.2.11**. Mevcut en son: **16.3.4**.

| Bildirim | Önem | Konu |
| --- | --- | --- |
| GHSA-2xp9-vwfh-vxw4 | **Critical** | Image Optimization API'de kimlik doğrulamasız RCE (AVIF) |
| GHSA-p293-qw3h-jr36 | **Critical** | Windows sunucularda kimlik doğrulamasız RCE |
| GHSA-6gpp-xcg3-4w24 | High | Turbopack + tek locale'de proxy bypass |
| GHSA-p9j2-gv94-2wf4 | High | Rewrites üzerinden SSRF |
| + 7 ek bildirim | Orta/Yüksek | Cache karışıklığı, Server Action DoS, iç uç nokta ifşası |

**Dürüst erişilebilirlik değerlendirmesi:** Windows RCE geçersiz (Vercel/Linux). AVIF RCE büyük olasılıkla erişilemez — projede `next/image` bileşeni hiç kullanılmıyor ve dosya yükleme yüzeyi yok (ancak `next.config.ts:14-17` AVIF'i etkin format olarak listeliyor). Proxy bypass erişilemez — ön koşul `config.i18n.locales` içinde tek girdi; proje Next'in i18n yapılandırmasını kullanmıyor. SSRF erişilemez — `rewrites` tanımı yok.

**Yine de P1:** düzeltme tek komutla mümkün, Y-01'in doğrudan sebebi ve framework yüzeyi gelecekteki bir özellikle aniden açılabilir.

---

### Y-03 — nodemailer ve sharp bildirimleri (P2)

| Paket | Kurulu | Düzeltilmiş | Konu |
| --- | --- | --- | --- |
| `nodemailer` | 9.0.3 | 9.1.1 (en son 10.0.3) | Adres ayrıştırıcıda O(n²) DoS; alan adı doğrulama atlatma; `resolveContent` dosya/URL erişim atlatma |
| `sharp` | 0.34.5 | — | libvips/libheif CVE'leri |

`resolveContent` atlatması uygulanabilir değil (rota `raw`/`resolveContent` kullanmıyor). Ancak DoS ve alan adı atlatma bildirimleri **iletişim formunun alıcısını** etkilediği için gerçek.

---

### Y-04 — Lokal build ve production E2E çalıştırılamıyor (P2)

```
$ npm run build  → exit 1
   ❌ CSRF_SECRET: CSRF_SECRET is required in production

$ npm run e2e    → exit 1
   > npm run build && playwright test   # build durdu, Playwright hiç çalışmadı
```

`npm run e2e` `npm run build`'e bağlı olduğu için **production modunda E2E paketi hiç çalıştırılamıyor**. Bu, README'nin belgelediği bir kısıt olsa da sonuç ağırdır:

- E2E yalnızca **dev sunucusuna** karşı çalıştırılabiliyor (`npm run e2e:dev`).
- Dev modda Next.js **error overlay** çalışıyor ve bu, testleri doğrudan bozuyor (bkz. Y-06).
- Bu nedenle erişilebilirlik ve hydration davranışı **production koşullarında hiç doğrulanamıyor**.

**Öneri:** `e2e` script'ini production-env doğrulamasından ayırın (build'i ayrı adıma taşıyın) veya `e2e:dev`'i varsayılan yapın. CI'da sorun görünmüyor çünkü ortam değişkenleri iş akışında tanımlı (`ci.yml:15-28`) — bu da lokal/CI parite farkıdır.

---

### Y-05 — Hydration mismatch: tema script'i sunucuda boş nonce ile render ediliyor (P2)

**Bu, E2E tarafından yakalanmış gerçek bir uygulama hatasıdır** (test kusuru değil).

**Kanıt.** İzole E2E turunda responsive testi 45 console hatası topladı; ilk hata:

```
A tree hydrated but some attributes of the server rendered HTML
didn't match the client properties. This won't be patched up.

  <script
    dangerouslySetInnerHTML={{__html:"\n(functio..."}}
    id="portfolio-theme-script"
+   nonce="2/GRU6tVX78EsSULMxKl3w=="   ← istemcinin beklediği
-   nonce=""                            ← sunucunun render ettiği
  >
```

**Kök neden.** `src/app/layout.tsx:34,43-47` nonce'u `headers().get("x-nonce")` ile okuyup script'e geçiriyor; ancak sunucu render'ında bu değer boş geliyor. Proxy (`src/proxy.ts:180-184`) nonce'u `buildRequestContextHeaders` ile iletiyor, dolayısıyla zayıf halka layout ile proxy arasındaki header aktarımı.

**Etki.** React sunucu işaretlemesini istemcide yeniden üretiyor — gereksiz iş, sunucu-render durumunun atılması ve her sayfa yüklemesinde 45 console hatası. Bu tam olarak AUD-008'in düzeltmeye çalıştığı sınıftır; `suppressHydrationWarning` yalnızca `<html>` üzerinde olduğu için bu farkı bastırmıyor.

**Not.** Gözlem dev modda yapıldı; production'da doğrulanamadı çünkü build çalışmıyor (Y-04). Ancak nonce üretimi request-time olduğundan production'da da geçerli olması beklenir — **Y-04 giderildikten sonra mutlaka doğrulanmalı.**

---

### Y-06 — E2E erişilebilirlik testleri dev overlay ile çakışıyor (P2)

İzole turda **7 erişilebilirlik testi** başarısız oldu. Sebep uygulama değil, **test kusuru**:

```
Error: locator.scrollIntoViewIfNeeded: strict mode violation:
locator('footer') resolved to 2 elements:
  1) <footer class="border-t border-border bg-surface ...">   ← gerçek footer
  2) <footer class="error-overlay-footer" data-nextjs-error-overlay-footer="true">
       … "Was this helpful?"                                  ← Next.js dev overlay
```

`e2e/accessibility.spec.ts:17` `page.locator("footer")` kullanıyor; Next.js dev overlay kendi `<footer>`'ını eklediği için locator iki element buluyor ve test axe denetimine hiç ulaşamadan düşüyor.

**Etki.** Erişilebilirlik regresyon kapısı **pratikte hiç çalışmıyor** — ne dev'de (bu çakışma) ne production'da (Y-04). Yani AUD-009/010/011'in "Resolved" iddiası bu incelemede **bağımsız olarak doğrulanamadı**.

**Öneri.** Locator'ı `page.locator("body > footer")` veya `getByRole("contentinfo")` ile daraltın ve overlay'i test başında devre dışı bırakın.

---

### Y-07 — `.env.production` sürüm kontrolünde (P3)

`.gitignore` `.env*` dosyalarını dışlarken `!.env.production` istisnasıyla bu dosyayı bilinçli olarak depoya alıyor. Tasarım dotenvx şifrelemesine dayanıyor ve `.env.keys` takip edilmiyor — yaklaşım makul.

İçeriği bu incelemede **okunmadı** (sır koruması devrede), dolayısıyla tamamen şifreli olduğu doğrulanamadı. Risk: şifrelenmemiş tek bir satır sırrı kalıcı olarak git geçmişine yazar. **Öneri:** CI'da "her değer `encrypted:` ile başlamalı" bütünlük kontrolü.

---

### Y-08 — İstemci IP güven zinciri (P3)

`src/lib/redis-rate-limit.ts:128-141` sırası: `x-vercel-forwarded-for` → `cf-connecting-ip` → `x-forwarded-for` → `x-real-ip`.

Vercel'de ilk başlık platform tarafından yazıldığı için bugün sömürülebilir değil. Ancak `cf-connecting-ip` Vercel tarafından temizlenmez ve ikinci sırada durur; önde gerçek bir Cloudflare katmanı olmadığı için anlamsızdır. İlk başlığın bulunmadığı bir ortama taşınırsa rate-limit **başlık sahtelemesiyle atlatılabilir**. **Öneri:** kaldırın veya açık bir "güvenilen vekil" yapılandırmasına bağlayın.

---

### Y-09 — Test kapsamındaki kör noktalar (P3)

| Modül | İfade kapsamı |
| --- | ---: |
| `src/lib/env.ts` | **%0** |
| `src/lib/i18n/config.ts` | %23,5 |
| `src/lib/email-templates/components.ts` | %57,9 |
| `src/lib/email-templates/builder.ts` | %51,2 |
| `src/lib/redis-rate-limit.ts` | %56,0 |

Küresel eşik %60 olduğu için bu boşluklar geçiyor. Sunucu/istemci sır sınırını çizen `env.ts`'in %0 olması özellikle dikkat çekici.

---

### Y-10 — Bağımlılıkların güncelliği (P3)

`npm outdated`: **35 paket** geride. Güvenlik açıklarını kapatanlar:

| Paket | Kurulu | Güncel |
| --- | --- | --- |
| `next` (+ `@next/*`, `eslint-config-next`) | 16.2.10 | **16.3.4** |
| `nodemailer` | 9.0.3 | 9.1.1 (major: 10.0.3) |
| `react` / `react-dom` | 19.2.7 | 19.3.0 |
| `framer-motion` | 12.42.2 | 13.2.0 (major) |
| `zod` | 4.4.3 | 4.6.1 |
| `lucide-react` | 1.24.0 | 1.44.0 |
| `vitest` / `@vitest/coverage-v8` | 4.1.10 | 5.0.0 (major) |
| `jsdom` | 29.1.1 | 30.0.1 (major) |
| `eslint` | 9.39.5 | 10.10.0 (major) |
| `typescript` | 6.0.3 | 7.0.2 (major) |

⚠️ README bilinçli bir kısıt belgeliyor: *"ESLint 9 and TypeScript 6 are intentionally the newest versions accepted by the current Next.js lint dependency graph. Do not force ESLint 10 or TypeScript 7 until every installed peer declares support."* Bu iki major yükseltme **peer uyumluluğu doğrulanmadan yapılmamalı**.

---

## 6. Öncelikli aksiyon listesi

| # | Aksiyon | Bağlı bulgu | Çaba |
| --- | --- | --- | --- |
| 1 | `next` 16.3.4'e, `nodemailer` 9.1.1'e yükselt; `audit:dependencies` exit 0 olana kadar doğrula | Y-01, Y-02, Y-03 | Orta |
| 2 | CI'ı yeşile al ve sonraki adımların gerçekten koştuğunu doğrula | Y-01 | Küçük |
| 3 | Hydration mismatch'i gider: nonce'u sunucu render'ında da ilet | **Y-05** | Orta |
| 4 | `e2e`'yi production-env doğrulamasından ayır; production E2E'yi çalıştır | Y-04 | Küçük |
| 5 | `accessibility.spec.ts` footer locator'ını daralt | Y-06 | Küçük |
| 6 | Minor/patch bağımlılık güncellemelerini uygula; major'ları ayrı değerlendir | Y-10 | Orta |
| 7 | `cf-connecting-ip`'i güven zincirinden çıkar | Y-08 | Küçük |
| 8 | `.env.production` şifreleme bütünlük kontrolü ekle | Y-07 | Küçük |
| 9 | `env.ts` ve e-posta şablonları için kapsam eşiği tanımla | Y-09 | Orta |

---

## 7. Yöntem ve sınırlamalar

**Yapılanlar.** Kaynak kod okuması (`src/proxy.ts`, `src/lib/csrf.ts`, `src/lib/redis-rate-limit.ts`, `src/lib/security.ts`, `src/lib/logger.ts`, `src/lib/health.ts`, `src/lib/env-validation.ts`, `src/app/api/contact/route.ts`, `src/app/layout.tsx`, tema sağlayıcısı, `Header.tsx`, `ContactForm.tsx`, `theme-script.ts`, E2E spesifikasyonları, CI iş akışı); tüm komutların bağımsız çalıştırılması; `npm audit` çıktısının paket bazında ayrıştırılması; izole ortamda üç E2E turu.

**Sınırlamalar.**

- **Production E2E hiç çalıştırılamadı** (Y-04). Erişilebilirlik ve hydration davranışı yalnızca dev koşullarında gözlemlendi.
- **Erişilebilirlik doğrulanamadı** (Y-06). Bu "sorun yok" değil, "kanıt yok" demektir.
- Gerçek tarayıcı davranışı, gerçek SMTP teslimi, gerçek Redis hata/geri kazanım senaryosu ve production CWV ölçümü yapılmadı.
- `.env.production`, `.env.keys`, `.env.local` dosyalarının **içeriği okunmadı**; yalnızca varlıkları ve git durumları incelendi.
- Bildirimlerin erişilebilirlik değerlendirmesi kaynak kod okumasına dayanır; dinamik exploit doğrulaması yapılmadı.
- Bu rapor bir hukuki/uyumluluk görüşü değildir.
