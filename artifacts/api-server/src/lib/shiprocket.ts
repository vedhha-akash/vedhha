const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!res.ok) throw new Error(`Shiprocket login failed: ${res.status}`);
  const data = await res.json() as { token: string };
  cachedToken = data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return cachedToken;
}

function getWeight(product: string): number {
  const p = product.toLowerCase();
  if (p.includes("blazer")) return 0.6;
  if (p.includes("bomber")) return 0.5;
  if (p.includes("hoodie")) return 0.4;
  return 0.3;
}

export interface ShiprocketOrderInput {
  orderId: string;
  product: string;
  qty: number;
  priceNum: number;
  payment: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ShiprocketResult {
  shiprocketOrderId?: string | number;
  awb?: string;
  error?: string;
}

export async function createShiprocketOrder(input: ShiprocketOrderInput): Promise<ShiprocketResult> {
  try {
    const token = await getToken();
    const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION ?? "Primary";

    const nameParts = input.name.trim().split(" ");
    const firstName = nameParts[0] ?? input.name;
    const lastName = nameParts.slice(1).join(" ") || firstName;

    const unitPrice = input.priceNum / (input.qty || 1);
    const weight = getWeight(input.product);

    const payload = {
      order_id: input.orderId,
      order_date: new Date().toISOString().split("T")[0],
      pickup_location: pickupLocation,
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: input.address,
      billing_city: input.city,
      billing_state: input.state,
      billing_pincode: input.pincode,
      billing_country: "India",
      billing_email: process.env.SHIPROCKET_EMAIL,
      billing_phone: input.phone.replace(/\D/g, "").slice(-10),
      shipping_is_billing: true,
      order_items: [
        {
          name: input.product,
          sku: input.orderId,
          units: input.qty,
          selling_price: unitPrice,
          discount: 0,
          tax: 0,
          hsn: 0,
        },
      ],
      payment_method: input.payment === "cod" ? "COD" : "Prepaid",
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: input.priceNum,
      length: 30,
      breadth: 25,
      height: 3,
      weight,
    };

    const res = await fetch(`${SHIPROCKET_BASE}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json() as { order_id?: number; shipment_id?: number; awb_code?: string; status?: number; message?: string };

    if (!res.ok) {
      return { error: `Shiprocket order creation failed: ${data.message ?? res.status}` };
    }

    const awb = data.awb_code ?? undefined;
    return {
      shiprocketOrderId: data.order_id,
      awb,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: message };
  }
}

export async function sendTrackingSms(phone: string, name: string, orderId: string, awb: string): Promise<void> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) return;
  const msg = `Hi ${name}! Your VEDHHA order ${orderId} has been shipped. Track your package with AWB: ${awb} at shiprocket.in. Thank you for shopping with us!`;
  const url = new URL("https://www.fast2sms.com/dev/bulkV2");
  url.searchParams.set("authorization", apiKey);
  url.searchParams.set("route", "q");
  url.searchParams.set("message", msg);
  url.searchParams.set("numbers", phone.replace(/\D/g, "").slice(-10));
  url.searchParams.set("flash", "0");
  await fetch(url.toString(), { method: "GET" }).catch(() => {});
}
