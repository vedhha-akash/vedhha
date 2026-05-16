import { Router } from "express";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const router = Router();

// ── Bootstrap tables ──────────────────────────────────────────────────────────
async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customer_reviews (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(80)  NOT NULL,
      location   VARCHAR(80)  NOT NULL,
      product    VARCHAR(120) NOT NULL,
      rating     SMALLINT     NOT NULL CHECK (rating BETWEEN 1 AND 5),
      review     TEXT         NOT NULL,
      initials   VARCHAR(4)   NOT NULL,
      color      VARCHAR(40)  NOT NULL,
      created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS review_reactions (
      id         SERIAL PRIMARY KEY,
      review_key VARCHAR(30)  NOT NULL,
      action     VARCHAR(8)   NOT NULL CHECK (action IN ('like','dislike')),
      voter_key  VARCHAR(60)  NOT NULL,
      created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      UNIQUE (review_key, voter_key)
    );

    CREATE TABLE IF NOT EXISTS review_comments (
      id         SERIAL PRIMARY KEY,
      review_key VARCHAR(30)  NOT NULL,
      name       VARCHAR(80)  NOT NULL,
      comment    TEXT         NOT NULL,
      created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );
  `);
}
ensureTables().catch(console.error);

const COLORS = [
  "bg-amber-600","bg-rose-700","bg-emerald-700","bg-violet-700","bg-blue-700",
  "bg-orange-700","bg-teal-700","bg-red-700","bg-indigo-700","bg-pink-700",
  "bg-green-700","bg-cyan-700","bg-purple-700","bg-sky-700","bg-lime-700","bg-yellow-700",
];
function pickColor(name: string) {
  let n = 0;
  for (const c of name) n += c.charCodeAt(0);
  return COLORS[n % COLORS.length];
}
function makeInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
}

// ── GET all customer reviews ───────────────────────────────────────────────────
router.get("/customer-reviews", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM customer_reviews ORDER BY created_at DESC"
  );
  return res.json(rows);
});

// ── POST submit a review ──────────────────────────────────────────────────────
router.post("/customer-reviews", async (req, res) => {
  const { name, location, product, rating, review } = req.body as {
    name: string; location: string; product: string; rating: number; review: string;
  };
  if (!name || !location || !product || !rating || !review) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const initials = makeInitials(name);
  const color = pickColor(name);
  const { rows } = await pool.query(
    `INSERT INTO customer_reviews (name, location, product, rating, review, initials, color)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [name.trim(), location.trim(), product.trim(), Number(rating), review.trim(), initials, color]
  );
  return res.json(rows[0]);
});

// ── GET reaction counts for multiple keys ─────────────────────────────────────
// POST body: { keys: string[] }
router.post("/customer-reviews/counts", async (req, res) => {
  const { keys } = req.body as { keys: string[] };
  if (!keys?.length) return res.json({});
  const { rows } = await pool.query(
    `SELECT review_key, action, COUNT(*)::int AS cnt
     FROM review_reactions
     WHERE review_key = ANY($1)
     GROUP BY review_key, action`,
    [keys]
  );
  const result: Record<string, { likes: number; dislikes: number }> = {};
  for (const key of keys) result[key] = { likes: 0, dislikes: 0 };
  for (const r of rows) {
    if (r.action === "like")    result[r.review_key].likes    = r.cnt;
    if (r.action === "dislike") result[r.review_key].dislikes = r.cnt;
  }
  return res.json(result);
});

// ── POST react to a review ────────────────────────────────────────────────────
router.post("/customer-reviews/react", async (req, res) => {
  const { reviewKey, action, voterKey } = req.body as {
    reviewKey: string; action: "like" | "dislike"; voterKey: string;
  };
  if (!reviewKey || !action || !voterKey) {
    return res.status(400).json({ error: "reviewKey, action, voterKey required" });
  }
  // If voter already reacted to this review — update or remove
  const existing = await pool.query(
    "SELECT id, action FROM review_reactions WHERE review_key=$1 AND voter_key=$2",
    [reviewKey, voterKey]
  );
  if (existing.rows.length) {
    if (existing.rows[0].action === action) {
      // Same action → undo (toggle off)
      await pool.query("DELETE FROM review_reactions WHERE review_key=$1 AND voter_key=$2", [reviewKey, voterKey]);
    } else {
      // Different action → switch
      await pool.query("UPDATE review_reactions SET action=$1 WHERE review_key=$2 AND voter_key=$3", [action, reviewKey, voterKey]);
    }
  } else {
    await pool.query(
      "INSERT INTO review_reactions (review_key, action, voter_key) VALUES ($1,$2,$3)",
      [reviewKey, action, voterKey]
    );
  }
  // Return updated counts
  const { rows } = await pool.query(
    `SELECT action, COUNT(*)::int AS cnt FROM review_reactions WHERE review_key=$1 GROUP BY action`,
    [reviewKey]
  );
  const counts = { likes: 0, dislikes: 0 };
  for (const r of rows) {
    if (r.action === "like")    counts.likes    = r.cnt;
    if (r.action === "dislike") counts.dislikes = r.cnt;
  }
  return res.json(counts);
});

// ── GET comments for a review ─────────────────────────────────────────────────
router.get("/customer-reviews/comments/:reviewKey", async (req, res) => {
  const { reviewKey } = req.params;
  const { rows } = await pool.query(
    "SELECT id, name, comment, created_at FROM review_comments WHERE review_key=$1 ORDER BY created_at ASC",
    [reviewKey]
  );
  return res.json(rows);
});

// ── POST add a comment ────────────────────────────────────────────────────────
router.post("/customer-reviews/comments", async (req, res) => {
  const { reviewKey, name, comment } = req.body as {
    reviewKey: string; name: string; comment: string;
  };
  if (!reviewKey || !name || !comment) {
    return res.status(400).json({ error: "reviewKey, name, comment required" });
  }
  const { rows } = await pool.query(
    "INSERT INTO review_comments (review_key, name, comment) VALUES ($1,$2,$3) RETURNING *",
    [reviewKey, name.trim(), comment.trim()]
  );
  return res.json(rows[0]);
});

// ── GET comment counts for multiple keys ──────────────────────────────────────
router.post("/customer-reviews/comment-counts", async (req, res) => {
  const { keys } = req.body as { keys: string[] };
  if (!keys?.length) return res.json({});
  const { rows } = await pool.query(
    `SELECT review_key, COUNT(*)::int AS cnt FROM review_comments WHERE review_key = ANY($1) GROUP BY review_key`,
    [keys]
  );
  const result: Record<string, number> = {};
  for (const key of keys) result[key] = 0;
  for (const r of rows) result[r.review_key] = r.cnt;
  return res.json(result);
});

export default router;
