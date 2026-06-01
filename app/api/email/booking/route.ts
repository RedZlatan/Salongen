import { NextRequest, NextResponse } from "next/server";
import { sendBookingConfirmation } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    await sendBookingConfirmation(data);
  } catch (err) {
    console.error("[email/booking] send failed:", err);
    // Non-fatal — don't block the checkout flow
  }

  return NextResponse.json({ ok: true });
}
