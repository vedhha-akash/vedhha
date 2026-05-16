import app from "./app";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function ensureTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        phone TEXT UNIQUE,
        email TEXT UNIQUE,
        name TEXT NOT NULL,
        notifications_enabled BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await client.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS email TEXT UNIQUE`);
    await client.query(`ALTER TABLE customers ALTER COLUMN phone DROP NOT NULL`);
    logger.info("Database tables verified");
  } catch (err) {
    logger.error({ err }, "Failed to ensure database tables");
  } finally {
    client.release();
  }
}

ensureTables().then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
});
