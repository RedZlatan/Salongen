import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createPrintfulOrder } from "@/lib/printful";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("[webhook] checkout.session.completed", {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
    });

    if (!session.metadata?.printfulItems) {
      console.warn("[webhook] No printfulItems in metadata — skipping Printful order");
      return NextResponse.json({ received: true });
    }

    try {
      const result = await createPrintfulOrder(session);
      console.log("[webhook] Printful order created", result?.result?.id ?? result);
    } catch (err) {
      console.error("[webhook] Printful order creation failed:", err);
      return NextResponse.json({ error: "Printful order failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
