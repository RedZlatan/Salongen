import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export interface CartItem {
  printfulVariantId?: number;
  quantity: number;
  name: string;
  price: number; // in öre
}

export interface ShippingAddress {
  name: string;
  address1: string;
  city: string;
  zip: string;
  country: string;
  email: string;
}

export async function POST(req: NextRequest) {
  const {
    items,
    shippingAddress,
    metadata: extraMetadata,
  }: {
    items: CartItem[];
    shippingAddress?: ShippingAddress;
    metadata?: Record<string, string>;
  } = await req.json();

  const sessionMetadata: Record<string, string> = { ...(extraMetadata ?? {}) };

  // Store Printful item list in metadata for the webhook to pick up.
  // The shipping address is now collected by Stripe — no need to store it here.
  const printfulItems = items.filter((i) => i.printfulVariantId);
  if (printfulItems.length > 0) {
    sessionMetadata.printfulItems = JSON.stringify(
      printfulItems.map((i) => ({ variant_id: i.printfulVariantId, quantity: i.quantity, name: i.name }))
    );
  }

  const hasPhysicalItems = printfulItems.length > 0;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "sek",
          product_data: { name: item.name },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      ...(hasPhysicalItems && {
        shipping_address_collection: {
          allowed_countries: ["SE", "NO", "DK", "FI", "DE", "GB"],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 4900, currency: "sek" },
              display_name: "Standard frakt",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 5 },
                maximum: { unit: "business_day", value: 10 },
              },
            },
          },
        ],
      }),
      metadata: sessionMetadata,
      success_url: `${process.env.NEXT_PUBLIC_URL}/?booking=success`,
      cancel_url:  `${process.env.NEXT_PUBLIC_URL}/?booking=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Stripe error";
    console.error("[checkout] Stripe session creation failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
