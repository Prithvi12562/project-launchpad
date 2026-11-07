# Project Technical Decisions

- Keep Supabase URL and publishable key in Vite environment variables so preview and deployed builds can target the intended project without embedding credentials in client code.