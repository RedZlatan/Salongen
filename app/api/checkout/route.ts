import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export interface CartItem {
  printfulVariantId: number;
  quantity: number;
  name: string;
  price: number; // in öre/cents
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
  const { items, shippingAddress }: { items: CartItem[]; shippingAddress: ShippingAddress } =
    await req.json();

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

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
    metadata: {
      printfulItems: JSON.stringify(
        items.map((i) => ({
          variant_id: i.printfulVariantId,
          quantity: i.quantity,
          name: i.name,
        }))
      ),
      recipientName: shippingAddress.name,
      recipientAddress1: shippingAddress.address1,
      recipientCity: shippingAddress.city,
      recipientZip: shippingAddress.zip,
      recipientCountry: shippingAddress.country,
      recipientEmail: shippingAddress.email,
    },
    success_url: `${baseUrl}/?checkout=success`,
    cancel_url: `${baseUrl}/?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
