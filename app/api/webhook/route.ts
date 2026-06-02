import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { createPrintfulOrder } from "@/lib/printful";
import { sendShopReceipt, sendRullarUnlock } from "@/lib/mailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  console.log("[webhook] STRIPE_WEBHOOK_SECRET prefix:", process.env.STRIPE_WEBHOOK_SECRET?.slice(0, 10));

  const rawBody = await req.arrayBuffer();
  const body    = Buffer.from(rawBody);
  const sig     = req.headers.get("stripe-signature");

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

    // ── Rullar email-token upplåsning ──
    if (session.metadata?.product === "rullar_unlock") {
      const email = session.customer_details?.email;
      if (!email) {
        console.warn("[webhook] rullar_unlock utan email — hoppar över");
        return NextResponse.json({ received: true });
      }

      const token = randomUUID();
      const { error } = await supabase.from("rullar_tokens").insert({ token, email });
      if (error) {
        console.error("[webhook] rullar_tokens insert failed:", error.message);
        return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
      }

      const link = `${process.env.NEXT_PUBLIC_URL}/rullar?token=${token}`;
      sendRullarUnlock({ email, link }).catch((err) =>
        console.error("[webhook] rullar unlock email failed:", err)
      );
      console.log("[webhook] rullar_unlock token skapad för", email);
      return NextResponse.json({ received: true });
    }

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

    // Send shop receipt email
    const recipientEmail = session.metadata?.recipientEmail ?? session.customer_details?.email;
    if (recipientEmail) {
      const items: Array<{ name: string; quantity: number }> = JSON.parse(
        session.metadata?.printfulItems ?? "[]"
      ).map((i: { name: string; quantity: number }) => ({ name: i.name, quantity: i.quantity }));

      sendShopReceipt({
        name:    session.metadata?.recipientName ?? "Customer",
        email:   recipientEmail,
        items,
        total:   session.amount_total ?? 0,
        orderId: session.id,
      }).catch((err) => console.error("[webhook] shop receipt email failed:", err));
    }
  }

  return NextResponse.json({ received: true });
}
