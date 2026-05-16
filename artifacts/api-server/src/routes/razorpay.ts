import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = Router();


const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

router.post("/razorpay/create-order", async (req, res) => {
  try {
    const { amount } = req.body as { amount: number };
    if (!amount || amount <= 0) {
      res.status(400).json({ error: "Invalid amount" });
      return;
    }
    const rzp = getRazorpay();
    const order = await rzp.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `vedhha_${Date.now()}`,
    });
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

router.post("/razorpay/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body as {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      };

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected === razorpay_signature) {
      res.json({ verified: true, paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ verified: false, error: "Signature mismatch" });
    }
  } catch (err) {
    console.error("Razorpay verify error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

export default router;
