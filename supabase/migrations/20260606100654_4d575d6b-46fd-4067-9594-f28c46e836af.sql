
-- Remove overly permissive public INSERT policy; edge function uses service_role and bypasses RLS
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;

-- Revoke direct INSERT grant from anon/authenticated (service_role retains ALL)
REVOKE INSERT ON public.bookings FROM anon, authenticated;

-- Lock down SECURITY DEFINER trigger function from being called via API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
