# Product catalogue sources for Fieldfare

**Research date:** 23 September 2026  
**Purpose:** establish a lawful, maintainable way to identify and review the meat listings of the UK supermarkets used by Fieldfare. This is a sourcing assessment, not a welfare assessment and not a claim that an online range equals every pack in every branch.

## Decision

Fieldfare should build its complete catalogue from **retailer-approved product data or retailer permission**, then use the public product pages as the customer-facing evidence link. It should not bulk-scrape retailer websites or reverse-engineer their private shopping APIs.

There is no common, documented public catalogue API for the eleven retailers below. The public websites are useful for *human-led discovery* and usually expose a durable retailer product number in the page URL, but this is not permission to run a crawler. Tesco is explicit: its terms prohibit bots, crawlers, scrapers and AI tools used to access, extract, or collect site data without prior written consent. [Tesco general terms](https://www.tesco.com/shop/zone/general-terms-and-conditions) The same conservative interpretation should be used for every retailer unless its written data licence says otherwise.

The practical goal is therefore **catalogue completeness with evidence states**, rather than pretending the app can know every physical pack from a public web page:

1. Request a UK, Scotland, or Edinburgh product feed from each retailer that contains product ID, GTIN/EAN, title, brand/range, pack size, species, category, availability/assortment, ingredients, origin, image URL, current product URL, and an `updatedAt` timestamp.
2. Store the retailer's product ID as the retailer-specific identity. Store a GTIN only where it is supplied by the retailer, independently verified, or read from the exact pack. A GTIN identifies a trade item, but a different size or formulation needs a different GTIN. [GS1 UK: what a GTIN is](https://www.gs1uk.org/knowledge-hub/product-identification/what-is-a-gtin)
3. Treat category/search pages as discovery indexes and individual product pages or retailer feeds as the record of a particular pack. Capture source URL, retrieved date, quoted evidence, and a screenshot/hash where permission permits.
4. Re-check availability frequently, and never turn a missing online listing into a welfare conclusion. Aldi explicitly says displayed products may not be available in stores, products can be withdrawn without warning, and packaging/prices can change. [Aldi terms, product availability](https://www.aldi.co.uk/corporate/terms-and-conditions)
5. Keep `not reviewed`, `identity confirmed`, `welfare evidence confirmed`, `out of date`, and `not currently ranged online` as separate states. A product can be perfectly identified but still have insufficient welfare evidence.

## What the public catalogues actually support

| Retailer | Official public discovery surface | Stable public identity observed | GTIN/EAN on public page | Public API/feed found | Safe conclusion and next action |
| --- | --- | --- | --- | --- | --- |
| Aldi | Aldi product pages and category/range pages; online assortment is not guaranteed to equal store assortment. [Terms](https://www.aldi.co.uk/corporate/terms-and-conditions) | Page slugs/retailer URLs, but these can change. | Not established by official documentation reviewed. | No documented public grocery catalogue API found. | Request an approved product/GTIN feed; do not enumerate site pages automatically. Supplement via pack scans from Edinburgh stores. |
| Lidl | Product/range pages exist, but Lidl GB does not run a normal full national grocery e-commerce catalogue. Its official products page describes ranges and seasonal groceries. [Lidl products](https://www.lidl.co.uk/c/our-products/s10023093) | No dependable public all-product identifier established. | Not established. Lidl Plus can scan barcodes for in-store self-scanning, but this is an app feature, not a data licence. [Lidl Plus terms](https://www.lidl.co.uk/c/lidl-plus-terms-of-use/s10025414) | No documented public grocery catalogue API found. | Make Lidl a store/pack-observation programme until Lidl provides a feed. Record each observed pack's GTIN, store, date, and photographs. |
| Tesco | Full public grocery browse/search and individual product pages, including a numeric product ID in `/products/{id}` URLs. [Example product page](https://www.tesco.com/groceries/en-GB/products/293861718) | Numeric Tesco product ID is usable as a retailer ID, subject to change/retirement. | Not established as a public page field from official documentation reviewed. | No public catalogue API found. Automated collection is expressly prohibited without written consent. [Terms](https://www.tesco.com/shop/zone/general-terms-and-conditions) | Seek written permission or a licensed feed before importing at scale. Until then, add only individually reviewed packs. |
| Sainsbury's | The official grocery app supports browse/search across 30,000+ products. [Sainsbury's app help](https://help.sainsburys.co.uk/help/products/mobile-app) | Retailer product URLs/IDs may be available in shopping pages, but no stable public-ID contract was found. | Not established. | No documented public grocery catalogue API found. | Ask Sainsbury's for a product data export, including exact online assortment for the selected Edinburgh fulfilment/store context. |
| Waitrose | Public grocery browse/search with category filters and individual product details. [Grocery browse](https://www.waitrose.com/ecom/shop/browse/groceries) | Product URLs provide a retail identity, but no published permanence contract was found. | Not established by official documentation reviewed. | No documented public grocery catalogue API found. | Use individual product pages for citations, but request a feed for bulk coverage. Waitrose says availability depends on the delivery location and asks customers to log in to identify the local assortment. [Availability help](https://www.waitrose.com/ecom/help-information/customer-service/booking-a-slot-and-placing-an-order) |
| Asda | Public grocery web/app shopping and Scan & Go. [Scan & Go terms](https://www.asda.com/terms/scan-and-go) | No stable public catalogue-ID contract located. | Not established. | No documented public grocery catalogue API found. | Request retailer permission/data. Use exact pack observations in the meantime, not inferred range claims. |
| Morrisons | Public category pages enumerate products and individual pages use a numeric ID in `/products/{slug}/{id}`. [Chicken category](https://groceries.morrisons.com/categories/meat-fish/chicken/184534) · [Example product](https://groceries.morrisons.com/products/morrisons-british-chicken-breast-fillets-400g/113028499) | Numeric Morrisons product ID is a strong retailer-local key. | Not established as a public customer-page field. | No documented public grocery catalogue API found. | This is the best public catalogue surface for a manual/review-led queue, but obtain permission before automated extraction or bulk republication. The product page says its data is supplied for personal use and may not be reproduced without consent. [Morrisons product example](https://groceries.morrisons.com/products/morrisons-chicken-breast/105062603) |
| M&S | M&S Food has store, partner, and online-shopping surfaces; the full grocery range is not established here as a public, stable, nationwide catalogue. | No stable public grocery product-ID contract found. | Not established. | No documented public grocery catalogue API found. | Request an M&S Food feed directly. Do not treat an Ocado/M&S relationship as proof that an Ocado listing is sold in M&S shops. |
| Ocado | Public shopping catalogue and product pages; its terms cover website and app product data. [Ocado terms](https://www.ocado.com/content/terms-conditions-purchase-consumer) | Product URLs provide a retailer identity, but no published permanence contract was found. | Not established by official documentation reviewed. | No documented public catalogue API found. | Do not bulk copy: Ocado allows material/data/content only for personal order placement and prohibits copying, reproducing, publishing, distributing or derivative works without permission. Request a data licence/feed. [Ocado terms, clause 14.5](https://www.ocado.com/content/terms-conditions-purchase-consumer) |
| Co-op | Co-op online grocery pages can be used for individual, local availability discovery. | No stable national public catalogue-ID contract found. | Not established. | No documented public grocery catalogue API found. | Get a Co-op feed or record branch-level pack observations. Availability needs a store/postcode dimension. |
| Iceland | Public pages expose individual product pages with a numeric ID in `/p/{slug}/{id}.html`. [Example product](https://www.iceland.co.uk/p/iceland-class-a-fresh-british-small-whole-chicken-without-giblets-1.1kg/79735.html) | Numeric Iceland product ID is a strong retailer-local key. | Not established as a public page field. | No documented public grocery catalogue API found. | Useful for manually triaging items and linking customers to a source. Iceland warns that product information can change and online availability, prices and promotions may vary by store. [Product information note](https://www.iceland.co.uk/p/iceland-class-a-fresh-british-medium-whole-chicken-without-giblets-1.3kg/48261.html) |

### Interpretation of “no documented public API found”

This means the official public sources reviewed on 23 September 2026 did not provide a developer catalogue API, authenticated feed documentation, data licence, or published rate limit for a third-party application. It does **not** prove that a retailer has no private supplier, partner, app, or internal API. It means Fieldfare needs an agreement before relying on one.

## Product identity and barcode strategy

### Use three identifiers, not one

| Field | Meaning | Source of truth | Why it matters |
| --- | --- | --- | --- |
| `retailerProductId` | The retailer's current online/product master key. | Approved retailer feed or exact product URL. | Lets the app refresh a listing even when its name changes. |
| `gtin` | The exact trade-item barcode. | Retailer feed, exact-pack scan, or licensed GS1 lookup. | Supports reliable scanning and avoids matching a 400g pack to a 600g pack. |
| `fieldfareVariantId` | Fieldfare's immutable review record. | Fieldfare. | Preserves review history when retailer IDs/URLs change. |

Do not derive welfare from a GTIN lookup. GS1's global product registry can confirm core identity attributes such as GTIN, brand, description, image, category, net content, and country of sale; those attributes do not establish farming method. [Verified by GS1](https://www.gs1uk.org/standards-services/data-services/verified-by-gs1)

For validation at scale, GS1 UK's GTIN Check API is restricted to GS1 UK partners with an access key. [GTIN Check API](https://www.gs1uk.org/standards-services/data-services/gtin-check-api) The public Verified by GS1 search is limited to 30 searches per day, with premium access available for more. [Verified by GS1 search](https://www.gs1uk.org/our-services/data-services/verified-by-gs1/search-verified-by-gs1) That makes it useful as a review control, not the main catalogue-ingestion pipeline.

### Variable-weight fresh meat

Fresh meat often has variable price/weight labels. Treat a scanned price/weight barcode as a **pack observation** unless the retailer confirms it maps to a stable consumer GTIN. Persist the base product, measured weight, price, store, scan date and photo separately. Never use a variable-weight label alone to merge two distinct products.

## Required retailer-data request

Send the same short request to each retailer's product-data, ecommerce, supplier, press, or responsible-sourcing contact:

> Fieldfare is a consumer app helping UK shoppers find and understand meat products with documented farming and certification evidence. We would like written permission and a machine-readable UK product feed for meat, poultry, charcuterie and meat-containing prepared products sold online and, where possible, in Scottish stores. We need retailer product ID, GTIN/EAN, title, brand/range, pack size, species, category, ingredients, origin, current product URL, image URL, online/store availability, and last-updated timestamp. We will retain source links and dates, display attribution, refresh/remove withdrawn products, and will not infer welfare standards from absent data. Please provide your licence, refresh limits, Scotland/Edinburgh assortment rules, and the correct contact for welfare/assurance evidence.

Ask each retailer to also identify:

- whether a listed product is a precise SKU or a range/variable-weight placeholder;
- which branch, delivery postcode, or fulfilment location controls availability;
- whether the feed includes seasonal, temporary, third-party marketplace, halal, counter, frozen, processed and ready-meal meat products;
- what each assurance/range field means and who may substantiate it;
- the retention, caching, image-use and attribution requirements.

## Build order

1. **Implement the catalogue intake contract first.** Reject records without retailer, retailer product ID or source URL, species, product type, identity status, availability status and source date. Permit `gtin: null` and `welfare: unreviewed`.
2. **Secure feeds for Tesco, Sainsbury's, Waitrose, Asda, Morrisons, Ocado and Co-op.** These have online grocery catalogues large enough that manual coverage will remain incomplete.
3. **Run an Edinburgh pack-observation programme for Aldi, Lidl, M&S and Iceland.** These are more dependent on local/seasonal assortment or lack a demonstrated comprehensive public online catalogue. Capture the exact pack before giving any consumer verdict.
4. **Review in welfare-risk order.** Fresh chicken, pork, turkey and processed poultry first; then beef/lamb; then bacon, sausages, mince, deli/cooked meat, frozen meat and meat-containing prepared products. Product presence is not a good or bad welfare verdict by itself.
5. **Publish completeness honestly.** Each supermarket view should show: `X exact variants in current feed`, `Y local packs observed`, `Z awaiting welfare review`, `last catalogue refresh`, and `coverage caveats`. Never display “every product” unless the retailer feed scope explicitly supports it.

## Minimum data licence requirement

Before any automated import, obtain a written answer covering: permission to fetch; allowed endpoint/feed; authentication; rate limit; fields; update frequency; storage period; customer display/attribution; product images; territory; branch-level availability; removal handling; and whether Fieldfare may score/annotate a product using independently researched welfare evidence. If the retailer cannot license the data, use manual pack observations and link to public product pages without bulk copying their catalogue content.

## Source notes

- Official online content is useful but volatile. Waitrose says product availability can vary by location and product/stock information may not be correct or up to date; it also notes images may not reflect the exact pack received. [Waitrose terms](https://www.waitrose.com/ecom/help-information/terms-and-conditions)
- Morrisons and Iceland both explicitly warn shoppers to check the supplied physical label because ingredients/product information can change. [Morrisons example](https://groceries.morrisons.com/products/morrisons-chicken-breast/105062603) · [Iceland example](https://www.iceland.co.uk/p/iceland-class-a-fresh-british-medium-whole-chicken-without-giblets-1.3kg/48261.html)
- This reinforces the app's existing principle: the physical pack is the final evidence point for an individual purchase.
