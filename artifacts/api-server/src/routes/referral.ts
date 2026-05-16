import { Router } from "express";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const router = Router();

function generateCode(name: string): string {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VED-${clean}-${rand}`;
}

// Generate or retrieve referral code for a user
router.post("/referral/generate", async (req, res) => {
  const { name, contact } = req.body;
  if (!name || !contact) return res.status(400).json({ error: "Missing fields" });

  // Check if this contact already has a code
  const existing = await pool.query(
    "SELECT * FROM referrals WHERE owner_contact = $1 LIMIT 1",
    [contact]
  );
  if (existing.rows.length > 0) {
    return res.json({ code: existing.rows[0].code, uses: existing.rows[0].uses });
  }

  const code = generateCode(name);
  await pool.query(
    "INSERT INTO referrals (code, owner_name, owner_contact) VALUES ($1, $2, $3)",
    [code, name, contact]
  );
  res.json({ code, uses: 0 });
});

// Validate referral code + get discount
router.get("/referral/validate/:code", async (req, res) => {
  const { code } = req.params;
  const result = await pool.query(
    "SELECT * FROM referrals WHERE code = $1",
    [code.toUpperCase()]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Invalid referral code" });
  }
  res.json({ valid: true, discount: 40, owner: result.rows[0].owner_name });
});

// Increment uses after successful order
router.post("/referral/use", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing code" });
  await pool.query(
    "UPDATE referrals SET uses = uses + 1 WHERE code = $1",
    [code.toUpperCase()]
  );
  res.json({ ok: true });
});

// Get all referrals (admin)
router.get("/referral/all", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM referrals ORDER BY uses DESC, created_at DESC"
  );
  res.json(result.rows);
});

export default router;
