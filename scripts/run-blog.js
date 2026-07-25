// Standalone runner for the Render Cron Job service.
// Reuses the same generation logic as the Vercel function, but callable from CLI.
// Render Cron runs this on the schedule in render.yaml (Mon/Wed/Fri 14:00 UTC);
// the weekly limit set in the admin still caps it at 1-3 posts/week.
import handler from "../api/generate-blog.js";

const req = { headers: { "x-vercel-cron": "1" }, query: {} };
const res = {
  statusCode: 200,
  status(c){ this.statusCode = c; return this; },
  json(o){ console.log("[auto-blog]", this.statusCode, JSON.stringify(o)); return this; },
};

handler(req, res)
  .then(() => process.exit(0))
  .catch((e) => { console.error("[auto-blog] error", e); process.exit(1); });
