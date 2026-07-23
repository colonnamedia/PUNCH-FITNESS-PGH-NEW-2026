// ============================================================================
// Supabase project config for Punch PGH.
// The publishable/anon key is public by design — it can only do what the Row
// Level Security policies allow (public reads products/posts; only signed-in
// admins can change them). Never put the service_role/secret key here.
// ============================================================================
window.PUNCH_CONFIG = {
  SUPABASE_URL: "https://uyzvmrbjlzafpwpamjwa.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_HPXuZiYMaOHhuXiZ6SONBg_hy6X3_ce",
  IMAGE_BUCKET: "product-images"
};
