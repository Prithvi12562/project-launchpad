# Project Technical Decisions

- Pin the Supabase URL and publishable key in `src/integrations/supabase/client.ts` to the hotel's own project, because the platform connection auto-rewrites `.env` to a different project and breaks bookings.
