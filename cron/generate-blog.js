// Standalone blog generator for a Render Cron Job (Node runtime).
// Mirrors api/generate-blog.js but runs on a schedule instead of an HTTP trigger.
// Render → New → Cron Job → build: `npm install` → command: `node cron/generate-blog.js`
// Env vars: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
const TOPICS = ["Boxing for Fitness","Nutrition","Parkinson's Boxing Benefits"];
const TOPIC_IMAGE = {
  "Boxing for Fitness":"/assets/punch-pittsburgh-6.jpg",
  "Nutrition":"/assets/punch-pittsburgh-31.jpg",
  "Parkinson's Boxing Benefits":"/assets/punch-pittsburgh-40.jpg",
};
const GUIDE = {
  "Boxing for Fitness":"How boxing-based training builds fitness: calorie burn, full-body strength, conditioning, coordination, stress relief. Encouraging for beginners.",
  "Nutrition":"Simple, sustainable nutrition that supports training. General wellness only — no medical advice, no calorie targets, no weight-loss promises.",
  "Parkinson's Boxing Benefits":"How low-impact controlled boxing supports people with Parkinson's: balance, coordination, rhythm, confidence, community. State Punch is NOT a Rock Steady affiliate; fitness-based, not medical treatment; consult a physician.",
};
const slug = s => String(s).toLowerCase().trim().replace(/['’]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);

(async () => {
  const { ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) { console.error("Missing env vars"); process.exit(1); }
  const H = { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization:`Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type":"application/json" };

  // weekly limit from site_settings
  let perWeek = 1;
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=value&key=eq.blog`, { headers: H });
    const j = await r.json(); const v = Array.isArray(j)&&j[0]?j[0].value:null;
    if (v && Number(v.posts_per_week)) perWeek = Math.min(3, Math.max(1, Number(v.posts_per_week)));
  } catch {}
  const weekAgo = new Date(Date.now()-7*864e5).toISOString();
  const rc = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=id&created_at=gte.${weekAgo}`, { headers:{...H, Prefer:"count=exact"} });
  const posted = (await rc.json()).length || 0;
  if (posted >= perWeek) { console.log(`Weekly limit reached (${posted}/${perWeek}) — nothing to do.`); return; }

  const last = await (await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=topic&order=created_at.desc&limit=1`, { headers:H })).json();
  const topic = TOPICS[(TOPICS.indexOf(last[0]?.topic) + 1) % TOPICS.length];

  const prompt = `You are writing a blog post for Punch Boxing & Fitness, a boxing-based gym in Pittsburgh's South Hills.
TOPIC: ${topic}
FOCUS: ${GUIDE[topic]}
Voice: personal, warm, motivational. Never invent statistics, studies, or testimonials. Attribute health claims to real orgs (Mayo Clinic, Cleveland Clinic, Parkinson's Foundation, CDC) and link them. End with a "## Sources" section of 2-4 real markdown links, and a line inviting a free first class. For health topics add a "talk to your doctor" note.
Respond ONLY with JSON, no fence: {"title":"...","excerpt":"under 160 chars","body":"markdown"}`;

  const ai = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{ "content-type":"application/json","x-api-key":ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01" },
    body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:2000, messages:[{role:"user",content:prompt}] }),
  });
  if (!ai.ok) { console.error("Anthropic error", await ai.text()); process.exit(1); }
  const text = (await ai.json()).content.filter(b=>b.type==="text").map(b=>b.text).join("").replace(/```json|```/g,"").trim();
  const post = JSON.parse(text);

  let s = slug(post.title);
  const dup = await (await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=slug&slug=eq.${encodeURIComponent(s)}`, { headers:H })).json();
  if (dup.length) s = `${s}-${Date.now().toString().slice(-5)}`;

  const ins = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method:"POST", headers:{...H, Prefer:"return=representation"},
    body: JSON.stringify({ title:post.title, slug:s, topic, excerpt:(post.excerpt||"").slice(0,200), body:post.body, image_url:TOPIC_IMAGE[topic]||"/assets/punch-pittsburgh-41.jpg", published:true }),
  });
  if (!ins.ok) { console.error("Insert failed", await ins.text()); process.exit(1); }
  console.log("Published:", topic, "—", post.title);
})();
