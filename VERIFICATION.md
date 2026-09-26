# Verification — 22 September 2026

Passed on the local production files:

- JavaScript syntax and data integrity checks, valid/invalid EAN/UPC check digits, manifest and PNG icon dimensions, required offline assets, saved-basket validation and distance calculations.
- Desktop layout at 1440px and phone layout at 390px, plus an intermediate width.
- Product search and basket actions through the app's optional WebMCP interface; invalid input is rejected.
- Basket persisted across reload. App and basket remained usable after the HTTP server was stopped and the browser was reloaded.
- Postcode lookup using the public EH1 3RZ shop postcode correctly sorted nearby shops. Location was cleared after the check.
- Manual barcode and a real decoded test barcode PNG both returned 4006381333931 as unverified, without implying welfare approval.
- Service-worker update from v1.0.0 to v1.0.1 applied through the visible update button; the revised UI loaded successfully.
- No browser error logs in the final tested flows.

Physical-device camera scanning and installation through iOS/Android browser menus still need device testing. Localhost offline checks establish service-worker behaviour; the private site's authentication layer may need an online sign-in before first access or after credentials expire. Current stock and product-to-barcode matching are not connected.

## Vercel and supermarket expansion

Production deployment succeeded on Vercel. Checked the four retailer filters in the deployed browser: Aldi 1, Lidl 1, Tesco 3 and Sainsbury’s 4 outdoor-compatible catalogue entries. Aldi product detail contains both its exact product link and certification policy link. Phone layout measured 390px viewport / 390px document width with no horizontal overflow. Settings confirmed the offline cache is ready on Vercel. Browser error logs were empty. Service worker and manifest return HTTP 200 with correct MIME types and no-cache headers.

A first-install update toast was observed without a waiting update. Added a controller check so update notifications are only raised for an already controlled page.

## Organic evidence release — v1.2.0

Production deployment dpl_Fw67N44VG95rtsH5hVjjM9hz4zkr succeeded at https://fieldfare-ruby.vercel.app.

- Static checks passed for all 24 product reviews, 11 grocer reviews and 17 product-level organic listings; organic control-code identity and non-organic/supplier-scope exclusions were checked.
- Applied the PWA update through the existing in-app update control.
- Browser confirmed default organic filter (17), stricter code/named-certifier filter (9), and Co-op's explicit evidence-gap state (0).
- Asda product panel showed its exact product rationale, Organic Farmers and Growers, GB-ORG-02, source links and missing operator/batch evidence.
- Daylesford panel showed independent operator-directory status separately from the still-unretrieved product certificate/trading schedule.
- Phone review at 390px: document width 390px, dialog width 358px, no horizontal overflow.
- Settings confirmed offline readiness with the new reviews module. No browser error logs observed.
- Returned the app to all retailers / organic products and restored normal browser sizing. No shopping data was changed.

## Supermarket release 1.3.1 — 22 September 2026

- 38 exact product records, including 35 supermarket listings across 11 grocers; 27 organic listings across all sources. Added 14 researched records.
- Node verification: identity/check-digit/storage/PWA checks plus deterministic decisions, unknown versus confirmed indoor, strict certificate scope, conflicting pack details, stale evidence, species/same-retailer alternative priority and exclusion of unavailable swaps.
- Production browser verified: retailer selector (Tesco and Aldi), two-product comparison, indoor chicken to same-store organic alternatives, strict preference toggled on/off, mobile 390px product dialog 358px with no horizontal overflow, service worker update from prior release.
- v1.3.1 follow-up: clearly flag unconfirmed Ocado delivery, flag pre-existing Morrisons weight conflict, remove unsupported pig icon, mark organic evidence stale after 90 days.
- API phase remains future work: scanner reads codes and links to external Open Food Facts identity search, but there are no verified GTIN mappings, live stock/price feeds, commercial data agreements, public upload endpoint or certificate-scope audits. No backend integration is claimed.

## Logos and scoring release 1.4.1 — 22 September 2026

- 53 product records; 50 supermarket listings across 11 chains; 37 explicit organic listings across all sources. Fifteen new exact-product records researched from primary retailer pages.
- All 11 locally served brand assets loaded in production; logo provenance retained. Tesco and Asda replaced with unmodified vector marks for display sharpness.
- Production browser: 85/100 organic chicken score expanded into all six scoring dimensions; independent product verification correctly 0/15. Retailer coverage displayed partial-sample numerators/denominators; Tesco 3/8 rounded to 38%. Score sorting within the matching group produced 85, 85, 78. No browser errors observed in this release.
- Mobile 390px: retailer coverage dialog fits; page scroll width equals viewport width. No horizontal overflow. Existing list/preferences preserved; test retailer selection reset afterward.
- Static checks cover all product reviews, scoring sums/bounds, stale evidence, unsupported outdoor claims, unknown evidence, strict scope, logo files and inclusion in the versioned offline cache. Existing barcode/storage/PWA tests pass.
- Scores describe evidence coverage, not welfare outcomes. Stock and barcode mapping limitations remain unchanged.

## Catalogue and logo release 1.5.0 — 22 September 2026

- 71 product records; 68 supermarket listings across 11 chains; 37 explicit organic listings. Added 18 Aldi, Co-op and Lidl records from official retailer pages and policy documents.
- New records keep welfare wording separate from organic qualification: outdoor-bred, RSPCA and Red Tractor claims remain pack-check evidence unless an organic product claim is established.
- Brand icons are present in retailer tiles, product cards, score/compare rows, retailer guides, nearby supermarket cards, product/supplier dialogs and basket store labels. All 11 assets remain in the offline cache.
- Static verification passed: 71 review records, decision and score bounds, 37 organic listings, all 11 logo files, PWA assets and offline service-worker manifest.

## Deep product audit release 1.6.0 — 22 September 2026

- 95 product records; 92 supermarket listings across 11 chains; 48 organic evidence records. Added 24 exact products or range records from official Waitrose, M&S, Tesco, Sainsbury’s, Morrisons, Lidl, Aldi and Asda sources.
- Welfare-only claims such as Better Chicken Commitment, RSPCA Assured, Red Tractor Enhanced Welfare and free-range wording remain separate from organic qualification. Range pages and unavailable listings remain explicitly marked for pack checking.
- Added an in-app pack guide covering control codes, outdoor wording, welfare detail and terms that are not sufficient by themselves.
- Node verification passed: 95 records, organic/welfare separation, decisions, evidence-score bounds, PWA assets and offline logo cache.
- Verdict explanations now name the exact organic claim or missing claim, rearing system, welfare certification and the remaining pack check directly on product cards and detail panels.
