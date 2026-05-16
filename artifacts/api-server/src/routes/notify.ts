import { Router } from "express";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const router = Router();

router.post("/notify", async (req, res) => {
  const { product, name, contact } = req.body;
  if (!product || !name || !contact) {
    return res.status(400).json({ error: "Missing fields" });
  }
  await pool.query(
    "INSERT INTO notify_requests (product, name, contact) VALUES ($1, $2, $3)",
    [product, name, contact]
  );
  res.json({ ok: true });
});

router.get("/notify", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM notify_requests ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

export default router;
