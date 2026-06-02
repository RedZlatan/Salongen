-- Rullar — email-token upplåsning
-- Kör i Supabase SQL-editorn (eller via psql) för att skapa tabellen.

create table if not exists public.rullar_tokens (
  token       text primary key,          -- unik upplåsnings-token (uuid)
  email       text,                       -- kundens email (eller mottagare av gratisexemplar)
  used        boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- RLS är avstängd som standard (samma mönster som interest_list — åtkomst sker
-- server-side via anon/service key). För att hårdna: sätt SUPABASE_SERVICE_ROLE_KEY
-- i serverns miljö och aktivera RLS så att enbart service_role kommer åt tabellen:
--
--   alter table public.rullar_tokens enable row level security;
--   -- (inga policies för anon → endast service_role kan läsa/skriva)
