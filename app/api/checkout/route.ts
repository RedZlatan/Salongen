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

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

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
    // Collect shipping address from customer for physical Printful orders
    ...(hasPhysicalItems && {
      shipping_address_collection: {
        allowed_countries: ["SE", "NO", "DK", "FI", "DE", "GB"],
      },
    }),
    metadata: sessionMetadata,
    success_url: `${baseUrl}/?booking=success`,
    cancel_url:  `${baseUrl}/?booking=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
