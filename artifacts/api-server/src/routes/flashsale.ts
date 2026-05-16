import { Router } from "express";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const router = Router();

// Get active flash sale
router.get("/flash-sale", async (_req, res) => {
  const result = await pool.query(
    "SELECT * FROM flash_sales WHERE active = true AND ends_at > NOW() ORDER BY created_at DESC LIMIT 1"
  );
  if (result.rows.length === 0) return res.json({ sale: null });
  res.json({ sale: result.rows[0] });
});

// Create flash sale (admin)
router.post("/flash-sale", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });

  const { title, subtitle, discount_pct, ends_at } = req.body;
  if (!title || !discount_pct || !ends_at) return res.status(400).json({ error: "Missing fields" });

  // Deactivate all existing sales first
  await pool.query("UPDATE flash_sales SET active = false");

  const result = await pool.query(
    "INSERT INTO flash_sales (title, subtitle, discount_pct, ends_at, active) VALUES ($1, $2, $3, $4, true) RETURNING *",
    [title, subtitle || "", discount_pct, ends_at]
  );
  res.json({ sale: result.rows[0] });
});

// Deactivate all flash sales (admin)
router.delete("/flash-sale", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });

  await pool.query("UPDATE flash_sales SET active = false");
  res.json({ ok: true });
});

export default router;
