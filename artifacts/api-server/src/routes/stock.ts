import { Router } from "express";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const router = Router();

router.get("/stock", async (_req, res) => {
  try {
    const result = await pool.query(`SELECT product_id, size, quantity FROM product_stock`);
    const stock: Record<string, Record<string, number>> = {};
    for (const row of result.rows as { product_id: string; size: string; quantity: number }[]) {
      if (!stock[row.product_id]) stock[row.product_id] = {};
      stock[row.product_id][row.size] = row.quantity;
    }
    res.json({ stock });
  } catch (err) {
    console.error("Get stock error:", err);
    res.status(500).json({ error: "Failed to fetch stock" });
  }
});

router.put("/stock", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { productId, size, quantity } = req.body as { productId: string; size: string; quantity: number };
    await pool.query(
      `INSERT INTO product_stock (product_id, size, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (product_id, size) DO UPDATE SET quantity = $3, updated_at = NOW()`,
      [productId, size, quantity]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Update stock error:", err);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

router.post("/stock/deduct", async (req, res) => {
  try {
    const { productId, size, qty } = req.body as { productId: string; size: string; qty: number };
    await pool.query(
      `UPDATE product_stock SET quantity = GREATEST(0, quantity - $1), updated_at = NOW()
       WHERE product_id = $2 AND size = $3`,
      [qty, productId, size]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Deduct stock error:", err);
    res.status(500).json({ error: "Failed to deduct stock" });
  }
});

router.get("/orders/customer/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, status, tracking_number, updated_at FROM orders WHERE id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get order status error:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
