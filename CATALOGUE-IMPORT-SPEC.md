# Full supermarket meat catalogue import

Fieldfare must never imply that its currently reviewed sample is a complete supermarket range. This import contract supports a complete catalogue when a retailer exposes a lawful, reproducible product source.

## One record per sellable variant

An import row represents one currently listed sellable product variant, rather than a product family. It needs: retailer, retailer product ID, name, URL, department, pack size when listed, availability state, capture timestamp and source URL. GTIN is optional and remains unverified until a reviewer matches it to an exact pack.

## Review states

- `discovered`: the retailer currently lists the variant; no welfare conclusion.
- `needs_evidence`: a reviewer has not assessed organic/rearing claims.
- `reviewed`: the Fieldfare evidence record is complete.
- `retired`: it disappeared from a later retailer capture. It is retained for audit history and never recommended.

`discovered` and `needs_evidence` records must render as **not yet reviewed**, never as an approval or a failure.

## Import validation

Every import must reject duplicate `(retailer, retailerProductId)` keys, missing HTTPS product links, unsupported departments, missing capture time and product-family/range records masquerading as variants. An import run records source, timestamp, counts by department and a content hash.

## Welfare review

The importer does not infer welfare from title, brand, price, country, premium wording, Red Tractor, grass-fed or corn-fed claims. Organic certification, outdoor access, assurance schemes and animal-specific assertions require their own cited review fields.

## Coverage in the app

For each retailer and meat department, publish: discovered variants, reviewed variants, candidates that meet the user’s standard, explicitly outside the standard, insufficient evidence and date of the retailer capture. Show “coverage unknown” until a complete capture has been established.
