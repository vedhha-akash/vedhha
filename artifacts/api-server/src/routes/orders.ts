import { Router } from "express";
import pg from "pg";
import { createShiprocketOrder, sendTrackingSms } from "../lib/shiprocket.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const router = Router();

async function notifyAdmin(product: string, size: string, qty: string | number, price: string, payment: string, name: string, city: string) {
  const apiKey = process.env["FAST2SMS_API_KEY"];
  if (!apiKey) return;
  const msg = `New VEDHHA Order! ${product} | Size: ${size} | Qty: ${qty} | ${price} | ${payment} | Customer: ${name}, ${city}. Check admin panel.`;
  const url = new URL("https://www.fast2sms.com/dev/bulkV2");
  url.searchParams.set("authorization", apiKey);
  url.searchParams.set("route", "q");
  url.searchParams.set("message", msg);
  url.searchParams.set("numbers", "9151304494");
  url.searchParams.set("flash", "0");
  await fetch(url.toString(), { method: "GET", headers: { "cache-control": "no-cache" } }).catch(() => {});
}

router.post("/orders", async (req, res) => {
  try {
    const {
      id, product, productImg, size, qty, price, priceNum,
      payment, paymentLabel, name, phone, address, city, state,
      pincode, status, cancelReason, razorpayPaymentId,
    } = req.body as Record<string, string | number>;

    await pool.query(
      `INSERT INTO orders (id, product, product_img, size, qty, price, price_num, payment, payment_label, name, phone, address, city, state, pincode, status, cancel_reason, razorpay_payment_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       ON CONFLICT (id) DO NOTHING`,
      [id, product, productImg, size, qty, price, priceNum, payment, paymentLabel, name, phone, address, city, state, pincode, status ?? "pending", cancelReason ?? null, razorpayPaymentId ?? null]
    );

    notifyAdmin(String(product), String(size), qty, String(price), String(paymentLabel), String(name), String(city));

    if (process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD) {
      createShiprocketOrder({
        orderId: String(id),
        product: String(product),
        qty: Number(qty) || 1,
        priceNum: Number(priceNum) || 0,
        payment: String(payment),
        name: String(name),
        phone: String(phone),
        address: String(address),
        city: String(city),
        state: String(state),
        pincode: String(pincode),
      }).then(async (result) => {
        if (result.error) {
          console.error("Shiprocket error:", result.error);
          return;
        }
        const notes = result.shiprocketOrderId ? `Shiprocket ID: ${result.shiprocketOrderId}` : undefined;
        const awb = result.awb;
        if (notes || awb) {
          await pool.query(
            `UPDATE orders SET tracking_number = COALESCE($1, tracking_number), notes = COALESCE($2, notes), updated_at = NOW() WHERE id = $3`,
            [awb ?? null, notes ?? null, String(id)]
          ).catch((e: unknown) => console.error("Tracking update error:", e));
        }
        if (awb) {
          await sendTrackingSms(String(phone), String(name), String(id), awb);
        }
      }).catch((e: unknown) => console.error("Shiprocket async error:", e));
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Save order error:", err);
    res.status(500).json({ success: false, error: "Failed to save order" });
  }
});

router.get("/orders", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const result = await pool.query(
      `SELECT * FROM orders ORDER BY created_at DESC`
    );
    res.json({ orders: result.rows });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.patch("/orders/:id", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { id } = req.params;
    const { status, trackingNumber, notes } = req.body as Record<string, string>;

    await pool.query(
      `UPDATE orders SET status = COALESCE($1, status), tracking_number = COALESCE($2, tracking_number), notes = COALESCE($3, notes), updated_at = NOW() WHERE id = $4`,
      [status ?? null, trackingNumber ?? null, notes ?? null, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

export default router;
