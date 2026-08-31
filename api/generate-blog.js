// ============================================================================
// AUTO-BLOG — Vercel Serverless Function
// Runs on cron. Each run picks the NEXT topic in rotation, asks Claude to write
// an original post, and saves it to Supabase for /blog-events.
// ============================================================================

const TOPICS = [
  "Boxing for Fitness",
  "Nutrition",
  "Parkinson's Boxing Benefits",
  "Boxing vs Popular Fitness Classes",
];

const GUIDE = {
  "Boxing for Fitness":
    "How boxing-based training builds fitness: full-body conditioning, strength, coordination, stress relief, and why it stays interesting. Practical and encouraging for beginners.",
  "Nutrition":
    "Simple, sustainable nutrition that supports training: protein, whole-food carbs, hydration, timing around workouts, and habits that actually stick. General wellness only — no medical or prescriptive diet advice, no calorie targets, no weight-loss promises.",
  "Parkinson's Boxing Benefits":
    "How low-impact, controlled boxing supports people living with Parkinson's: balance, coordination, rhythm, posture, confidence, and community. Must state Punch is NOT a Rock Steady Boxing affiliate, that the program is fitness-based and not medical treatment or therapy, and that readers should consult their physician.",
  "Boxing vs Popular Fitness Classes":
    "Compare the benefits and training experience of boxing-based fitness with popular boutique fitness formats and brands such as Orangetheory Fitness, F45 Training, indoor cycling, SoulCycle, CycleBar, and HOTWORX. Keep the comparison fair and factual: never attack, insult, or make unsupported claims about competitors. Explain where boxing can differ through skill development, punching combinations, coordination, footwork, full-body conditioning, strength work, variety, stress relief, and an engaging learning component. Rotate the brands and comparison angles naturally so every article is different. Use brand names only when genuinely relevant to the article and never imply affiliation with Punch.",
};

const TOPIC_IMAGE = {
  "Boxing for Fitness": "/assets/punch-pittsburgh-6.jpg",
  "Nutrition": "/assets/punch-pittsburgh-31.jpg",
  "Parkinson's Boxing Benefits": "/assets/punch-pittsburgh-40.jpg",
  "Boxing vs Popular Fitness Classes": "/assets/punch-pittsburgh-14.jpg",
};
const IMAGE_POOL = [
  "punch-pittsburgh-6.jpg","punch-pittsburgh-1.jpg","punch-pittsburgh-11.jpg",
  "punch-pittsburgh-14.jpg","punch-pittsburgh-21.jpg","punch-pittsburgh-22.jpg",
  "punch-pittsburgh-31.jpg","punch-pittsburgh-40.jpg","punch-pittsburgh-41.jpg",
  "punch-pittsburgh-43.jpg","punch-pittsburgh-44.jpg"
].map(f => "/assets/" + f);
function pickImage(topic, title){
  if (TOPIC_IMAGE[topic]) return TOPIC_IMAGE[topic];
  let h = 0; for (const c of String(title)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return IMAGE_POOL[h % IMAGE_POOL.length];
}

function slugify(s) {
  return String(s).toLowerCase().trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
}

export default async function handler(req, res) {
  try {
    const { ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET } = process.env;
    if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: "Missing environment variables." });
    }

    const isCron = Boolean(req.headers["x-vercel-cron"]);
    const secret = (req.query && req.query.secret) || "";
    if (!isCron && CRON_SECRET && secret !== CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const sbHeaders = {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    };

    // Respect the weekly post limit set in admin. Four topics can now rotate;
    // allow up to four posts/week if admin is set to 4.
    let perWeek = 1;
    try {
      const setRes = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=value&key=eq.blog`, { headers: sbHeaders });
      const setJson = await setRes.json();
      const v = Array.isArray(setJson) && setJson[0] ? setJson[0].value : null;
      if (v && Number(v.posts_per_week)) perWeek = Math.min(4, Math.max(1, Number(v.posts_per_week)));
    } catch (e) { /* fall back to 1 */ }

    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
    const recentRes = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=id&created_at=gte.${weekAgo}`,
      { headers: { ...sbHeaders, Prefer: "count=exact" } }
    );
    const recent = await recentRes.json();
    const postedThisWeek = Array.isArray(recent) ? recent.length : 0;
    if (postedThisWeek >= perWeek && !(req.query && req.query.force)) {
      return res.status(200).json({ ok: true, skipped: true, reason: `weekly limit reached (${postedThisWeek}/${perWeek})` });
    }

    const lastRes = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=topic,slug&order=created_at.desc&limit=1`,
      { headers: sbHeaders }
    );
    const last = await lastRes.json();
    const lastTopic = Array.isArray(last) && last[0] ? last[0].topic : null;
    const lastIdx = TOPICS.indexOf(lastTopic);
    const topic = TOPICS[(lastIdx + 1) % TOPICS.length];

    const prompt = `You are curating a blog post for Punch Boxing & Fitness, a boxing-based fitness gym in Pittsburgh's South Hills (Greentree, 15220).

TOPIC: ${topic}
FOCUS: ${GUIDE[topic]}

STEP 1 — Use web search to find ONE recent, reputable article (ideally within the last 90 days) related to this topic. For comparison posts, research the official websites of any named fitness brands plus reputable independent fitness/health sources so descriptions of their formats are accurate.

STEP 2 — Write an ORIGINAL 450-650 word blog post in Punch's voice. Voice: personal, direct, warm, motivational (journey, community, confidence, stronger, consistency). Avoid: athlete, elite, hardcore, dominate.

SEO AND COMPARISON RULES:
- Write naturally for people first. Do not keyword-stuff competitor names.
- When the topic is a comparison, use one or two relevant competitor/format names in the title when natural, e.g. boxing vs Orangetheory, boxing vs F45, boxing vs cycling, or boxing vs HOTWORX. Rotate comparisons rather than listing every brand in every post.
- Competitor comparisons must be fair, factual and respectful. Do not say a competitor is bad, unsafe, ineffective, overpriced, or inferior unless a reliable source explicitly establishes the narrow factual point.
- Do not imply Punch is affiliated with, endorsed by, or partnered with Orangetheory, F45, SoulCycle, CycleBar, HOTWORX, or any other comparison brand.
- Focus on differences and the positive benefits of boxing-based fitness at Punch.

GENERAL RULES:
- Put the whole thing in YOUR OWN WORDS. Do NOT copy sentences from sources. Never invent statistics, studies, member names, or testimonials.
- Attribute sourced claims and link recognized organizations where relevant.
- Include 3-4 "## " subheadings and short paragraphs.
- Near the end, add: "Read the original article at [Source Name](exact URL)."
- End with a "## Sources" section listing source links.
- Add one closing line inviting the reader to try a free first class at Punch.
- For health-related content, add a short line that this is general information and readers should talk to their doctor.

IMAGE:
- Return an image_url only if web search identifies a DIRECT, publicly accessible image URL that is clearly licensed/authorized for reuse by Punch. Do not use a publisher's article image merely because it appears on the web. If reuse rights are unclear, return null. The site will use a Punch-owned fallback image.

Respond with ONLY a JSON object, no markdown fence, no preamble:
{"title":"...","excerpt":"one sentence under 160 characters","body":"full markdown post","source_name":"the publication name","source_url":"https://exact-article-url","image_url":null}`;

    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 3000,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }],
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiRes.ok) {
      const detail = await aiRes.text();
      return res.status(502).json({ error: "Anthropic API error", detail: detail.slice(0, 400) });
    }

    const aiJson = await aiRes.json();
    let text = (aiJson.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .replace(/```json|```/g, "")
      .trim();
    const jStart = text.indexOf("{"), jEnd = text.lastIndexOf("}");
    if (jStart !== -1 && jEnd !== -1) text = text.slice(jStart, jEnd + 1);

    let post;
    try { post = JSON.parse(text); }
    catch { return res.status(502).json({ error: "Could not parse model output", sample: text.slice(0, 300) }); }
    if (!post.title || !post.body) return res.status(502).json({ error: "Model output missing title or body" });

    // Slugs are title-only. We no longer append timestamps/random numbers.
    // If an identical slug already exists, skip rather than create an ugly URL;
    // the next cron run can generate a different article/title.
    const slug = slugify(post.title);
    const dupRes = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug&slug=eq.${encodeURIComponent(slug)}`,
      { headers: sbHeaders }
    );
    const dup = await dupRes.json();
    if (Array.isArray(dup) && dup.length) {
      return res.status(200).json({ ok: true, skipped: true, reason: "duplicate clean slug", slug });
    }

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: "POST",
      headers: { ...sbHeaders, Prefer: "return=representation" },
      body: JSON.stringify({
        title: post.title,
        slug,
        topic,
        excerpt: (post.excerpt || "").slice(0, 200),
        body: post.body,
        image_url: (post.image_url && /^https?:\/\//.test(post.image_url)) ? post.image_url : pickImage(topic, post.title),
        published: true,
      }),
    });

    if (!insertRes.ok) {
      const detail = await insertRes.text();
      return res.status(500).json({ error: "Supabase insert failed", detail: detail.slice(0, 400) });
    }

    return res.status(200).json({ ok: true, topic, title: post.title, slug });
  } catch (err) {
    return res.status(500).json({ error: String((err && err.message) || err) });
  }
}
