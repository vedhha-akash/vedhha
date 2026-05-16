import { Router } from "express";
import nodemailer from "nodemailer";
import { logger } from "../lib/logger.js";
import { mintSession } from "../lib/otpSessions.js";

const router = Router();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const rateLimitStore = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitStore.get(key) ?? []).filter(
    (t) => t > windowStart,
  );
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  rateLimitStore.set(key, timestamps);
  return false;
}

const otpStore = new Map<string, { otp: string; expires: number }>();

function createMailTransporter() {
  const user = process.env["BREVO_SMTP_USER"] ?? "vedhhatheeklavyawear@gmail.com";
  const pass = process.env["BREVO_SMTP_KEY"];
  if (!pass) throw new Error("Email service not configured (BREVO_SMTP_KEY missing)");
  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: { user, pass },
  });
}

async function sendOtpEmail(email: string, otp: string): Promise<void> {
  const transporter = createMailTransporter();
  await transporter.sendMail({
    from: `"VEDHHA — The Eklavya Wear" <vedhhatheeklavyawear@gmail.com>`,
    to: email,
    subject: `${otp} is your VEDHHA login code`,
    text: `Your VEDHHA login OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`,
    html: `
      <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; max-width: 480px; margin: 0 auto;">
        <h2 style="letter-spacing: 4px; text-transform: uppercase; color: #fff; margin-bottom: 4px;">VEDHHA</h2>
        <p style="color: #999; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">The Eklavya Wear</p>
        <hr style="border-color: #222; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 14px;">Your one-time login code:</p>
        <div style="font-size: 42px; letter-spacing: 12px; font-weight: bold; color: #fff; margin: 16px 0;">${otp}</div>
        <p style="color: #555; font-size: 12px;">Valid for 10 minutes. Do not share this with anyone.</p>
        <hr style="border-color: #222; margin: 24px 0;" />
        <p style="color: #333; font-size: 11px;">© VEDHHA — The Eklavya Wear. Mumbai, India.</p>
      </div>
    `,
  });
}

router.post("/otp/send", async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  const key = email.toLowerCase();

  if (isRateLimited(`send:${key}`)) {
    logger.warn({ email }, "OTP send rate limit exceeded");
    res.status(429).json({ error: "Too many OTP requests. Please wait 10 minutes and try again." });
    return;
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore.set(key, { otp, expires: Date.now() + 10 * 60 * 1000 });

  try {
    await sendOtpEmail(key, otp);
    res.json({ success: true });
  } catch (err) {
    otpStore.delete(key);
    const msg = err instanceof Error ? err.message : "Unknown error";
    logger.error({ email, err: msg }, "OTP send failed");
    res.status(500).json({ error: msg });
  }
});

router.post("/otp/verify", (req, res) => {
  const { email, otp } = req.body as { email?: string; otp?: string };
  if (!email || !otp) {
    res.status(400).json({ error: "Email and OTP are required" });
    return;
  }

  const key = email.toLowerCase();
  const record = otpStore.get(key);
  if (!record) {
    res.status(400).json({ error: "No OTP found. Please request a new one." });
    return;
  }
  if (Date.now() > record.expires) {
    otpStore.delete(key);
    res.status(400).json({ error: "OTP has expired. Please request a new one." });
    return;
  }
  if (record.otp !== otp) {
    res.status(400).json({ error: "Incorrect OTP. Please try again." });
    return;
  }

  otpStore.delete(key);
  res.json({ success: true });
});

router.post("/otp/session", (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  const key = email.toLowerCase();

  if (isRateLimited(`session:${key}`)) {
    logger.warn({ email }, "OTP session rate limit exceeded");
    res.status(429).json({ error: "Too many session requests. Please wait 10 minutes and try again." });
    return;
  }

  const token = mintSession(key);
  logger.info({ email }, "OTP session token issued");
  res.json({ token });
});

export default router;
