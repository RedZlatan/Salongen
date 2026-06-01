import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer();
  const body    = Buffer.from(rawBody);
  const sig  = req.headers.get("stripe-signature");

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
    const session     = event.data.object as Stripe.Checkout.Session;
    const bookingRef  = session.metadata?.booking_ref;

    if (!bookingRef) {
      // Not an event booking — skip silently
      return NextResponse.json({ received: true });
    }

    console.log("[event-webhook] confirming booking", bookingRef);

    const { error } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("booking_ref", bookingRef);

    if (error) {
      console.error("[event-webhook] Supabase update failed:", error.message);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }

    console.log("[event-webhook] booking confirmed:", bookingRef);
  }

  return NextResponse.json({ received: true });
}
