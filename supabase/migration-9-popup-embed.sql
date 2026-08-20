-- ============================================================================
-- PUNCH — migration 9 : popup embed support. Run after migration-8.sql. Safe
-- to re-run.
--
-- Adds an "embed_html" column to the existing popups table so the admin can
-- create a third popup type: 'form' — a raw HTML/embed snippet (e.g. a
-- third-party lead-capture form) rendered inside the same popup shell as the
-- trial and image popups. Uses the SAME active / show_desktop / show_mobile /
-- pages targeting already built for the other popup types — no app logic
-- changes needed beyond reading this one new column.
-- ============================================================================
alter table public.popups add column if not exists embed_html text;

-- 'type' has no CHECK constraint (plain text column), so no migration is
-- needed to allow the new 'form' value — the admin simply starts writing
-- rows with type = 'form'.
