// ============================================================================
// AUTO-BLOG — Vercel Serverless Function
// Runs on a weekly cron (see vercel.json). Each run:
//   1. looks at the most recent post and picks the NEXT topic in rotation
//   2. asks Claude to write the post
//   3. saves it to Supabase (blog_posts) so it appears on /blog-events
//
// Required Vercel Environment Variables (Project → Settings → Environment Variables):
//   ANTHROPIC_API_KEY          your Anthropic API key
//   SUPABASE_URL               https://uyzvmrbjlzafpwpamjwa.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  Supabase → Settings → API → service_role (SECRET, server only)
//   CRON_SECRET                any long random string (protects manual calls)
//
// Manual test after deploy:
//   https://your-site.com/api/generate-blog?secret=YOUR_CRON_SECRET
// ============================================================================

const TOPICS = [
  "Boxing for Fitness",
  "Nutrition",
  "Parkinson's Boxing Benefits",
];

const GUIDE = {
  "Boxing for Fitness":
    "How boxing-based training builds fitness: calorie burn, full-body strength, conditioning, coordination, stress relief, and why it stays interesting. Practical and encouraging for beginners.",
  "Nutrition":
    "Simple, sustainable nutrition that supports training: protein, whole-food carbs, hydration, timing around workouts, and habits that actually stick. General wellness only — no medical or prescriptive diet advice, no calorie targets, no weight-loss promises.",
  "Parkinson's Boxing Benefits":
    "How low-impact, controlled boxing supports people living with Parkinson's: balance, coordination, rhythm, posture, confidence, and community. Must state Punch is NOT a Rock Steady Boxing affiliate, that the program is fitness-based and not medical treatment or therapy, and that readers should consult their physician.",
};

function slugify(s) {
  return String(s).toLowerCase().trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default async function handler(req, res) {
  try {
    const { ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET } = process.env;
    if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: "Missing environment variables." });
    }

    // Allow Vercel Cron, or a manual call carrying the secret.
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

    // ---- 1. Pick the next topic in rotation --------------------------------
    const lastRes = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=topic,slug&order=created_at.desc&limit=1`,
      { headers: sbHeaders }
    );
    const last = await lastRes.json();
    const lastTopic = Array.isArray(last) && last[0] ? last[0].topic : null;
    const lastIdx = TOPICS.indexOf(lastTopic);
    const topic = TOPICS[(lastIdx + 1) % TOPICS.length]; // -1 + 1 = 0 → first topic

    // ---- 2. Write the post with Claude -------------------------------------
    const prompt = `You are writing a blog post for Punch Boxing & Fitness, a boxing-based fitness gym in Pittsburgh's South Hills (Greentree, 15220).

TOPIC: ${topic}
FOCUS: ${GUIDE[topic]}

Voice: personal, direct, warm, motivational. Words that fit: journey, community, confidence, stronger, fitter, consistency, transformation. Avoid: athlete, performance, hardcore, elite, dominate. Never invent statistics, studies, member names, or testimonials. No medical claims. Do not promise specific weight-loss results.

Write a fresh post (450-650 words) with 3-4 "## " subheadings, short paragraphs, and a closing line inviting the reader to try a free first class at Punch. Use markdown.

Respond with ONLY a JSON object, no markdown fence, no preamble:
{"title": "...", "excerpt": "one sentence under 160 characters", "body": "full markdown post"}`;

    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiRes.ok) {
      const detail = await aiRes.text();
      return res.status(502).json({ error: "Anthropic API error", detail: detail.slice(0, 400) });
    }

    const aiJson = await aiRes.json();
    const text = (aiJson.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    let post;
    try {
      post = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: "Could not parse model output", sample: text.slice(0, 300) });
    }
    if (!post.title || !post.body) {
      return res.status(502).json({ error: "Model output missing title or body" });
    }

    // ---- 3. Save to Supabase (unique slug) ---------------------------------
    let slug = slugify(post.title);
    const dupRes = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug&slug=eq.${encodeURIComponent(slug)}`,
      { headers: sbHeaders }
    );
    const dup = await dupRes.json();
    if (Array.isArray(dup) && dup.length) slug = `${slug}-${Date.now().toString().slice(-5)}`;

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: "POST",
      headers: { ...sbHeaders, Prefer: "return=representation" },
      body: JSON.stringify({
        title: post.title,
        slug,
        topic,
        excerpt: (post.excerpt || "").slice(0, 200),
        body: post.body,
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
