# Fieldfare implementation status

## Current milestone

**Day 1–2 — baseline audit and trust repair: complete**

The live catalogue was corrected before feature expansion. The primary defects were unknown rearing values represented as indoor, invalid organic-certifier labels, duplicate product identities, availability normalisation, barcode mapping absence and PWA update consistency.

## Evidence found on 22 September 2026

- 95 current catalogue records and 95 review records; 92 are attached to the 11 reviewed supermarkets.
- 13 imported products changed a source `outdoor: null` into `outdoor: false` and require correction to unknown unless an affirmative indoor source is added.
- Six records use `organic` or a retailer/farm phrase as a named organic certifier. They require a real control body or a listing-level status.
- Several records repeat an exact product URL or use a range/category URL. Identity must be resolved before product counts or barcode matching are presented as exact.
- There are no independently verified barcode mappings.

## Completion evidence required for this milestone

- Regression tests for each correction class.
- A canonical decision result that distinguishes unknown from indoor and organic listing from named control body.
- Alias-aware list migration for any confirmed duplicate merge.
- A reviewed correction report with changed decision counts.

## Next action

Build the pack-observation workflow: require exact product identity, photographed pack evidence and reviewer confirmation before a GTIN can enter the currently empty barcode index.

## Completion record

- The runtime now uses a canonical 90-variant catalogue, with five legacy aliases migrated for saved lists and baskets.
- Unsupported outdoor claims are unknown, not indoor; range-level records request an exact-pack match.
- Six records without an identified organic body or code now remain organic-listing evidence rather than named-certifier evidence.
- The barcode scanner has an explicit reviewed mapping boundary. No barcode can be treated as a Fieldfare match until a pack-level mapping is added.
- Version 1.7.0 caches the canonical catalogue for offline use and was deployed to production on 22 September 2026.
