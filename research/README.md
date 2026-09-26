# Fieldfare research database

This directory is the source-of-truth layer for research that supports Fieldfare decisions. It is deliberately separate from the PWA interface so that evidence can be reviewed, corrected and extended without treating UI wording as research.

`schema.sql` describes a portable SQLite database. The schema works with SQLite, Turso/libSQL, PostgreSQL (with small type adjustments), or an ORM migration. `seed.json` is a small, human-readable seed containing representative confirmed and unresolved records from the current audit.

## Decision states

- `confirmed_match`: an exact product record has reviewed product-level evidence for the selected standard.
- `confirmed_mismatch`: an exact product record documents an indoor system while Fieldfare's outdoor-access preference is enabled.
- `pack_check_needed`: a source makes a potentially relevant claim, but it is a category/range record or lacks exact-product evidence.
- `not_enough_evidence`: no eligible product-level claim has been established. It is not a negative welfare finding.

Only `confirmed_match` and `confirmed_mismatch` are factual product decisions. The other states are deliberately non-verdicts.

## Research workflow

1. Create or reuse a `sources` row for a primary source URL and record the retrieval date.
2. Add the sellable variant to `products`. A catalogue category is not a product variant.
3. Add each observed claim separately in `claims`, preserving the wording and source.
4. Add a `reviews` row that says what the evidence supports and what it cannot establish.
5. Link the product to the source in `product_sources`.
6. Set a decision only after the reviewer can explain it in a way a shopper can verify on the pack.

Do not infer outdoor access from country of origin, premium branding, price, Red Tractor, grass-fed, corn-fed, a barcode, or another product in the same range. Never promote a category claim to a confirmed product decision.

## Local development

The app remains static and does not send research or personal shopping data to a server. To initialise a local research database:

```sh
sqlite3 research/fieldfare.sqlite < research/schema.sql
```

Then load a reviewed export or insert records using the schema. The PWA data modules remain the current published snapshot; database changes require review and a deliberate app-data export in a future importer step.
