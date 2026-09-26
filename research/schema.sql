-- Fieldfare research ledger. SQLite-compatible and intentionally independent
-- from browser-local shopping lists and unreviewed barcode observations.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  publisher TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE CHECK (url LIKE 'https://%'),
  source_type TEXT NOT NULL CHECK (source_type IN ('product_page','category_page','policy','certifier','directory','report','pack_observation')),
  retrieved_on TEXT NOT NULL,
  archived_url TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  retailer TEXT NOT NULL,
  retailer_product_id TEXT,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  cut_name TEXT,
  pack_size TEXT,
  gtin TEXT,
  identity_status TEXT NOT NULL CHECK (identity_status IN ('exact_variant','range_candidate')),
  availability_status TEXT NOT NULL DEFAULT 'unknown' CHECK (availability_status IN ('listed','listed_range','out_of_stock','unknown')),
  first_seen_on TEXT NOT NULL,
  last_seen_on TEXT NOT NULL,
  UNIQUE(retailer, retailer_product_id)
);

CREATE TABLE IF NOT EXISTS claims (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES sources(id),
  claim_type TEXT NOT NULL CHECK (claim_type IN ('organic','control_code','certifier','outdoor_access','free_range','outdoor_bred','indoor_system','welfare_scheme','farm','availability')),
  wording TEXT NOT NULL,
  value TEXT,
  observed_on TEXT NOT NULL,
  reviewer_note TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
  product_id TEXT PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  decision TEXT NOT NULL CHECK (decision IN ('confirmed_match','confirmed_mismatch','pack_check_needed','not_enough_evidence','retired')),
  standard_version TEXT NOT NULL,
  summary TEXT NOT NULL,
  supports TEXT NOT NULL,
  limitations TEXT NOT NULL,
  reviewed_on TEXT NOT NULL,
  reviewer TEXT NOT NULL DEFAULT 'Fieldfare research',
  next_review_on TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product_sources (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES sources(id),
  role TEXT NOT NULL CHECK (role IN ('primary_evidence','supporting_evidence','certifier_check','contradiction')),
  PRIMARY KEY(product_id, source_id, role)
);

CREATE TABLE IF NOT EXISTS pack_observations (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  retailer TEXT,
  barcode TEXT,
  pack_name TEXT NOT NULL,
  species TEXT,
  organic_wording TEXT,
  rearing_wording TEXT,
  location_note TEXT,
  observed_on TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'awaiting_review' CHECK (review_status IN ('awaiting_review','reviewed','rejected')),
  privacy_scope TEXT NOT NULL DEFAULT 'local_only' CHECK (privacy_scope IN ('local_only','submitted_with_consent'))
);

CREATE INDEX IF NOT EXISTS idx_products_retailer_species ON products(retailer, species);
CREATE INDEX IF NOT EXISTS idx_claims_product_type ON claims(product_id, claim_type);
CREATE INDEX IF NOT EXISTS idx_reviews_decision ON reviews(decision, reviewed_on);
