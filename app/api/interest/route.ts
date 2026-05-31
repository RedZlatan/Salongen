import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { email, product } = await req.json();

  if (!email || !product) {
    return NextResponse.json({ error: "Missing email or product" }, { status: 400 });
  }

  const { error } = await supabase
    .from("interest_list")
    .insert({ email, product });

  if (error) {
    console.error("[interest] Supabase insert failed:", error.message);
    return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
