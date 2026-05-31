import Stripe from "stripe";

interface PrintfulItem {
  variant_id: number;
  quantity: number;
  name: string;
}

export async function createPrintfulOrder(session: Stripe.Checkout.Session) {
  const items: PrintfulItem[] = JSON.parse(session.metadata?.printfulItems ?? "[]");

  const body = {
    recipient: {
      name: session.metadata?.recipientName,
      address1: session.metadata?.recipientAddress1,
      city: session.metadata?.recipientCity,
      zip: session.metadata?.recipientZip,
      country_code: session.metadata?.recipientCountry,
      email: session.metadata?.recipientEmail,
    },
    items: items.map((item) => ({
      sync_variant_id: item.variant_id,
      quantity: item.quantity,
    })),
    retail_costs: {
      currency: session.currency?.toUpperCase() ?? "SEK",
    },
    confirm: true,
  };

  console.log("[printful] Creating order:", JSON.stringify(body, null, 2));

  const res = await fetch("https://api.printful.com/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
      "X-PF-Store-Id": "18258389",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("[printful] API error:", JSON.stringify(data, null, 2));
    throw new Error(`Printful order failed: ${res.status} ${JSON.stringify(data)}`);
  }

  console.log("[printful] Order response:", JSON.stringify(data?.result ?? data, null, 2));
  return data;
}
