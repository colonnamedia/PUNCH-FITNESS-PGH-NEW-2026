-- ============================================================================
-- PUNCH — migration 13 : archive sections (don't delete, just hide). Run
-- after migration-12.sql. Safe to re-run.
--
-- Adds "active" to page_sections. true (or no row at all) = the section
-- shows normally. false = the section is fully removed from the built page
-- at deploy time, but its saved order/text/images are untouched — flip it
-- back to true and republish to bring it back exactly as it was.
-- ============================================================================
alter table public.page_sections add column if not exists active boolean not null default true;
