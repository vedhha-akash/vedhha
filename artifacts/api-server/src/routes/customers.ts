import { Router } from "express";
import { eq, desc, or, ilike } from "drizzle-orm";
import { db, customersTable } from "@workspace/db";
import { logger } from "../lib/logger.js";
import { validateSession, consumeSession } from "../lib/otpSessions.js";

const router = Router();

function getSessionToken(req: { headers: Record<string, string | string[] | undefined> }): string | null {
  const raw = req.headers["x-otp-token"];
  if (!raw || Array.isArray(raw)) return null;
  return raw;
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// Lookup customer by email (email is now the primary login identifier)
router.get("/customers/:identifier", async (req, res) => {
  const { identifier } = req.params;
  if (!identifier || !isValidEmail(identifier)) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  const key = identifier.toLowerCase();

  const token = getSessionToken(req as Parameters<typeof getSessionToken>[0]);
  if (!token || !validateSession(token, key)) {
    res.status(401).json({ error: "Valid OTP session required" });
    return;
  }

  try {
    const rows = await db
      .select({ name: customersTable.name, notificationsEnabled: customersTable.notificationsEnabled })
      .from(customersTable)
      .where(eq(customersTable.email, key))
      .limit(1);

    if (rows.length > 0) {
      res.json({ isReturning: true, customer: rows[0] });
    } else {
      res.json({ isReturning: false });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    logger.error({ identifier: key, err: msg }, "Customer lookup failed");
    res.status(500).json({ error: msg });
  }
});

router.post("/customers/upsert", async (req, res) => {
  const { email, name, notificationsEnabled } = req.body as {
    email?: string;
    name?: string;
    notificationsEnabled?: boolean;
  };

  if (!email || !isValidEmail(email)) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }
  if (!name || name.trim().length < 2) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  const key = email.toLowerCase();

  const token = getSessionToken(req as Parameters<typeof getSessionToken>[0]);
  if (!token || !consumeSession(token, key)) {
    res.status(401).json({ error: "Valid OTP session required" });
    return;
  }

  try {
    const existing = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.email, key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(customersTable)
        .set({
          name: name.trim(),
          notificationsEnabled: notificationsEnabled ?? existing[0].notificationsEnabled,
          updatedAt: new Date(),
        })
        .where(eq(customersTable.email, key));

      logger.info({ email: key }, "Customer updated");
      res.json({ success: true, isReturning: true });
    } else {
      await db.insert(customersTable).values({
        email: key,
        name: name.trim(),
        notificationsEnabled: notificationsEnabled ?? false,
      });

      logger.info({ email: key }, "Customer created");
      res.json({ success: true, isReturning: false });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    logger.error({ email: key, err: msg }, "Customer upsert failed");
    res.status(500).json({ error: msg });
  }
});

router.post("/customers/broadcast", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { message } = req.body as { message?: string };
  if (!message || message.trim().length < 5) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  res.json({ sent: 0, total: 0, results: [], note: "Broadcast via email not yet implemented" });
});

router.get("/customers", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

  try {
    const rows = await db
      .select({
        id: customersTable.id,
        phone: customersTable.phone,
        email: customersTable.email,
        name: customersTable.name,
        notificationsEnabled: customersTable.notificationsEnabled,
        createdAt: customersTable.createdAt,
      })
      .from(customersTable)
      .where(
        search
          ? or(
              ilike(customersTable.phone, `%${search}%`),
              ilike(customersTable.name, `%${search}%`),
              ilike(customersTable.email, `%${search}%`)
            )
          : undefined
      )
      .orderBy(desc(customersTable.createdAt));

    res.json({ customers: rows, total: rows.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    logger.error({ err: msg }, "Customers list failed");
    res.status(500).json({ error: msg });
  }
});

// ── Upsert via Google OAuth ────────────────────────────────────────────────────
router.post("/customers/upsert-google", async (req, res) => {
  try {
    const { email, name } = req.body as { email?: string; name?: string };
    if (!email || typeof email !== "string") {
      res.status(400).json({ error: "email required" });
      return;
    }
    const safeName = (name || email.split("@")[0]).trim();
    const key = email.toLowerCase();

    const existing = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.email, key))
      .limit(1);

    let customer;
    if (existing.length > 0) {
      [customer] = await db
        .update(customersTable)
        .set({ name: safeName })
        .where(eq(customersTable.email, key))
        .returning();
    } else {
      [customer] = await db
        .insert(customersTable)
        .values({ name: safeName, phone: key, email: key, notificationsEnabled: true })
        .returning();
    }

    res.json({ name: customer.name, notificationsEnabled: customer.notificationsEnabled });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    logger.error({ err: msg }, "upsert-google failed");
    res.status(500).json({ error: msg });
  }
});

export default router;
