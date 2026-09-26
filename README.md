# Fieldfare PWA

An installable, mobile-first meat-sourcing companion for Edinburgh. Built as a dependency-free static web app, with self-hosted Lucide and ZXing browser libraries.

## Run locally

From this folder, run `python3 -m http.server 8766 --bind 127.0.0.1 --directory dist` and visit `http://127.0.0.1:8766/`. HTTPS is required outside localhost for installation, service workers and camera access. No build step is needed.

Use `node verify.mjs` for the data, identifier, icon and asset checks. JavaScript syntax can be checked with `node --check dist/app.js` and `node --check dist/sw.js`.

## Working features

- Search 24 sourcing candidates and filter by meat, organic listing or named farm; the default outdoor preference hides two indoor chicken systems.
- Read product evidence, original sources, caveats and supplier profiles.
- Save favourites and a quantity-based shopping list on the current device; export JSON.
- Browse 11 Edinburgh shops/collection points. Use a postcode or optional location to sort approximate straight-line distances to postcode centres.
- Capture EAN/UPC identifiers using the camera, barcode photo or manual entry. Validate check digits. Unknown codes stay explicitly unverified; open Open Food Facts separately for product identity.
- Install via the browser or iOS Add to Home Screen, with standalone presentation, home-screen icons and shortcuts.
- Offline shell, full curated catalogue, local supplier directory, saved list and barcode decoder after successful first-load caching.
- App-update prompt, device-data controls, contextual permission requests and reduced-motion support.
- Optional WebMCP tools for catalogue search and adding known items to the same local shopping list.

## Deliberate limits

This is the first working PWA, not the entire 50-feature roadmap. There is no live stock, pricing, checkout, account sync, universal product database or certification registry feed. No GTIN-to-product links have been independently established in the seed research, so barcode scans never automatically approve an item. Camera decoding is implemented with ZXing but still requires physical phone/pack testing. Research checked 22 September 2026 is explicitly dated; confirm current pack and certificate scope before purchase. Directory participation is not a batch-level guarantee.

Store coordinates are postcode centroids from Postcodes.io; they are not precise storefront coordinates or routed travel times. Entered postcodes are sent to Postcodes.io only on submission. Device location is used only within the page session. Supplier and map links open external services. Shopping data remains in browser localStorage and is not uploaded by the app. The private hosting layer may require the owner's sign-in.

## Update source data

Edit `dist/data.js` with a source URL, retrieval date and scope limitations for each record. Never infer farm identity from a barcode or apply one product's certification to a whole business. Update source facts and review notes together. Adjust the cache version in `dist/sw.js` for every release that changes cached files. Test the update flow; never silently replace local shopping data.

## Asset provenance

The pasture image is one original AI-generated illustrative Scottish landscape, created for Fieldfare. It does not depict or endorse any actual supplier. The image is labelled illustrative in the interface. App icons are simple original monograms.

Lucide 0.468.0: ISC licence. ZXing browser 0.1.5: MIT. The bundled ZXing library uses Apache 2.0. Licence texts are in `licenses/`. Source libraries were obtained from their pinned jsDelivr distributions. Postcode data attribution: Postcodes.io / Office for National Statistics.

## Vercel deployment

The linked Vercel project is `fieldfare` in `matthewjmortimer11s-projects`. Static output is `dist`; no install/build is required. Deploy with `npx --yes vercel@59.25.2 --prod --yes`. `vercel.json` provides the equivalent PWA and security headers for Vercel; Cloudflare `_headers` is excluded. `.env*`, hosting metadata and local research are excluded from uploads.

Supermarket coverage now includes specific Aldi and Lidl free-range chicken, additional Tesco organic/free-range chicken, and Sainsbury’s organic chicken, beef and lamb. Use the retailer filter to read the buying guide and related evidence. No retailer-wide welfare approval is implied.

Saved shopping data belongs to its browser origin. Lists stored on the previous Sites hostname do not automatically move to the Vercel hostname; the old site is retained.

## Organic review — 22 September 2026

All 24 records have a dedicated `dist/reviews.js` evidence record. Organic is the default view. Product-level listings are separated into control code listed, certifier named and organic listing only. Supplier-wide scope claims and other welfare schemes do not qualify for the organic filters. A stricter filter shows only organic products with a code or named certifier.

Eleven major grocers now have reviews, including explicit evidence gaps for Aldi, Lidl, Co-op and Iceland. M&S has separate organic products; Oakham Gold is retained as a non-organic comparison. Ocado Daylesford products carry a separate official operator-directory check; no exact product certificate or batch audit is claimed. Sources, check date, inclusion rationale and outstanding checks are visible in every product dialog. The new reviews module is included in the offline cache.

## Supermarket shopping release

Home now defaults to 11 mainstream grocers, with 35 reviewed supermarket listings (38 total including farms). Four decision groups distinguish matches, pack checks, known preference mismatches and unknown evidence. Compare up to three products and inspect alternatives prioritising the same supermarket and meat cut. Organic remains required; optional certificate-scope preference is deliberately stricter and currently has no approved products. Confirmed indoor systems remain visible as comparisons. Unknown evidence is never proof of factory farming.

Product details preserve source links, certifier/control-code distinctions, availability caveats and pack conflicts. Prices and branch inventory are not live. Rules downgrade organic evidence older than 90 days. Saved shop and standards persist locally, alongside the existing basket and favourites. The offline catalogue uses the versioned service-worker cache.

This implements the supermarket decision release of the expansion plan. Barcode identity APIs, reviewed physical-pack mappings, moderated uploads and licensed price/stock feeds remain subsequent phases; no credentials or paid integrations have been provisioned.

## Research database

The app's published snapshot is accompanied by a separate, versioned research ledger in [`research/`](research/). It provides a portable SQLite schema for primary sources, exact product variants, observed claims, human reviews, source links and privacy-preserving pack observations. The seed records show the intended distinction: confirmed product matches, confirmed indoor-system mismatches, and records that must remain a pack check.

Create a local database with `sqlite3 research/fieldfare.sqlite < research/schema.sql`. This database is intentionally not a live public submission endpoint: local shopping data and unreviewed observations remain on the device until a future consented moderation workflow exists.

## Logos, catalogue and scores (1.6)

95 total product records, including 92 supermarket listings across 11 chains. All retailers have locally served brand icons from their own websites, cached offline; provenance is in LOGO-SOURCES.md. The deeper exact-product audit is documented in PRODUCT-AUDIT-DEEP-1.6.md.

Product cards/details/comparison show an evidence-coverage score with an inspectable breakdown. Sorting by score stays within verdict groups. Retailer comparison shows matching reviewed products divided by the full reviewed sample, with explicit partial-sample caveats. SCORE-METHOD.md documents the versioned editorial rubric. Scores never override organic/outdoor requirements or imply an audited welfare outcome.

Brand marks are also repeated in nearby supermarket cards, retailer guides, product and supplier dialogs, score rows and basket store labels so the shopping context remains visible throughout the PWA.
