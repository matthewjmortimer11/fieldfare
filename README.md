# Fieldfare PWA

An installable, mobile-first meat-sourcing companion for Edinburgh. Built as a dependency-free static web app, with self-hosted Lucide and ZXing browser libraries.

## Run locally

From this folder, run `python3 -m http.server 8766 --bind 127.0.0.1 --directory dist` and visit `http://127.0.0.1:8766/`. HTTPS is required outside localhost for installation, service workers and camera access. No build step is needed.

Use `node verify.mjs` for the data, identifier, icon and asset checks. JavaScript syntax can be checked with `node --check dist/app.js` and `node --check dist/sw.js`.

## Working features

- Search 12 sourcing candidates and filter by meat, organic listing or named farm; the default outdoor preference hides two indoor chicken systems.
- Read product evidence, original sources, caveats and supplier profiles.
- Save favourites and a quantity-based shopping list on the current device; export JSON.
- Browse 10 Edinburgh shops/collection points. Use a postcode or optional location to sort approximate straight-line distances to postcode centres.
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
