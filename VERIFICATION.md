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
