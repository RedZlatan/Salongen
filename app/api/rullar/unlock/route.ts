import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Verifierar en upplåsnings-token mot rullar_tokens.
// Giltig om token finns. Markeras som använd vid första inlösen, men förblir
// giltig så att köparen kan låsa upp på flera enheter (idempotent).
// Vill du ha engångstoken: avvisa när data.used === true nedan.
export async function POST(req: NextRequest) {
  let token: unknown;
  try {
    ({ token } = await req.json());
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  if (!token || typeof token !== "string") {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("rullar_tokens")
    .select("token, used")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    console.error("[rullar/unlock] lookup failed:", error.message);
    return NextResponse.json({ valid: false }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ valid: false });
  }

  if (!data.used) {
    await supabase.from("rullar_tokens").update({ used: true }).eq("token", token);
  }

  return NextResponse.json({ valid: true });
}
