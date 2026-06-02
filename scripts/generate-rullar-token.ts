/**
 * Skapar en gratis upplåsnings-token för Rullar och skriver ut länken.
 *
 *   npx ts-node scripts/generate-rullar-token.ts din@email.com
 *
 * Token sparas i Supabase-tabellen rullar_tokens; länken låser upp läsningen
 * på valfri enhet. Används för att ge bort boken gratis.
 */
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

// Fristående script — Next laddar inte .env.local åt oss, så vi gör det själva.
function loadEnvLocal() {
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    // ingen .env.local — förlita oss på redan satta miljövariabler
  }
}

async function main() {
  loadEnvLocal();

  const email = process.argv[2];
  if (!email || !email.includes("@")) {
    console.error("Användning: npx ts-node scripts/generate-rullar-token.ts <email>");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "https://www.sistasalongen.com";

  if (!url || !key) {
    console.error("Saknar NEXT_PUBLIC_SUPABASE_URL eller Supabase-nyckel i miljön.");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const token = randomUUID();

  const { error } = await supabase.from("rullar_tokens").insert({ email, token });
  if (error) {
    console.error("Kunde inte skapa token:", error.message);
    process.exit(1);
  }

  const link = `${baseUrl}/rullar?token=${token}`;
  console.log("\n✓ Token skapad för", email);
  console.log("  Länk:", link, "\n");
}

main();
