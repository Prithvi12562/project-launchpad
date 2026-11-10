# Royal Plaza Hotels — Billing & Staff Management Prompts

Source: `Lovable_Hotel_Billing_Prompts.pptx` uploaded by the user.

## How to use this deck

The deck contains Prompts 0–6. Work on **one prompt at a time, in order**. Finish and test each prompt before moving to the next; do not start a later prompt until the user asks.

Before starting:

1. Confirm GitHub sync is on or save a version for rollback.
2. In Prompt 1, replace `[MY LOGIN EMAIL]` with the user's login email.
3. In Prompt 2, replace the room list with the hotel's real rooms, or use editable sample rooms.
4. Have the accountant verify tax settings before real use; do not hardcode tax rates.

## Prompt 0 — Ground rules

Extend the existing Royal Plaza Hotels website for Dhanaura; do not rebuild or restyle the public site.

1. Do not change `src/pages/Landing.tsx`, the guest booking form, or its look. Guest booking requests must continue working as they do today.
2. Do not edit `src/integrations/supabase/client.ts`; keep the Supabase project pinned to the hotel's own project. Keep `AGENTS.md`.
3. Do not touch/delete existing booking rows, change `send-booking-email` behavior, or modify `profiles`; only add safe migrations.
4. Leave website-builder pages (Dashboard, CreateWebsite, Editor, Preview) alone. New staff screens belong under `/staff`.
5. Enforce privileged logic (invoice numbers, payments, availability, role checks) in database policies/constraints/functions or Edge Functions, never only in the UI.
6. Never put secrets in frontend code. Use sample/test data only. Dashboard figures must come from real database queries; do not invent numbers.
7. After each task, honestly state what works and what remains unfinished.

## Prompt 1 — Staff security and roles

Before adding staff features, address open registration and staff authorization:

1. Create enum `app_role`: `admin`, `receptionist`, `billing`.
2. Create separate `user_roles` table (`user_id uuid references auth.users on delete cascade`, `role app_role`, unique `(user_id, role)`). Do not store roles on `profiles`.
3. Create `SECURITY DEFINER` functions `has_role(_user_id uuid, _role app_role)` and `is_staff(_user_id uuid)` with fixed `search_path`; use them in RLS policies to avoid recursion.
4. Enable RLS on `user_roles`: staff can read their own roles; only admins can insert/update/delete roles.
5. Add a `StaffRoute` requiring login and at least one database-verified staff role. Otherwise show “Access denied.” Add a placeholder `/staff` Staff Dashboard. Keep existing `ProtectedRoute` for old pages.
6. Disable public self-sign-up for the hotel: hide/remove the public Register link/route and explain how to turn off public sign-ups in Supabase Auth settings. Admins will create staff accounts later.
7. Provide a one-time SQL snippet to make the user's account (`[MY LOGIN EMAIL]`) the first admin. Do not hardcode the email in app code.
8. Add `/staff/login` as a separate staff login entry point.

Acceptance: a newly created user with no role cannot open `/staff` or read hotel data; a user with an assigned role can.

## Prompt 2 — Rooms, guests, reservations database

Add tables with migrations, foreign keys, indexes, and staff-only RLS. Permissions: admin has all; receptionist manages rooms/guests/reservations; billing can read bookings and guests. Do not modify existing booking rows.

### Tables and columns

- `room_categories`: `id`, `name`, `base_rate`, `capacity`, `description`, `active`. Seed Deluxe (1500) and Super Deluxe (4500).
- `rooms`: `id`, unique `room_number`, `floor`, `category_id`, enum status (`available`, `occupied`, `cleaning`, `maintenance`, `out_of_service`), `notes`, `active`.
- `guests`: `id`, `full_name`, `phone`, `email`, `address`, `id_type`, `id_number_last4` only (never store full ID numbers), `created_at`.
- Extend `bookings` with nullable `guest_id`, `room_id`, server-generated unique `booking_ref` (example format `RP-2026-000001`), status enum (`pending`, `confirmed`, `checked_in`, `checked_out`, `cancelled`), `agreed_rate`, `actual_check_in_at`, `actual_check_out_at`, source (`website`, `walk_in`, `phone`), `cancelled_reason`, `updated_at`, `created_by`.
- `audit_logs`: `id`, `user_id`, `action`, `table_name`, `record_id`, `old_data jsonb`, `new_data jsonb`, `created_at`. Insert-only; nobody may edit or delete logs.

### Database rules

- A room cannot have two active bookings (`pending`/`confirmed`/`checked_in`) with overlapping date ranges. Use `btree_gist` exclusion on `room_id + daterange(check_in, check_out, '[]')`, with checkout day equal to the next check-in day allowed.
- Existing website requests with no room remain `pending`, source `website`.
- Create `check_room_availability(category_id, check_in, check_out)` returning free rooms.
- Triggers add audit logs for booking status changes and room status changes.
- Seed sample rooms only if the user has not provided a real room list; sample format: 101–110 Deluxe, 201–205 Super Deluxe. Use editable placeholders if needed.
- Explain exactly how to apply migrations.

## Prompt 3 — Staff dashboard UI

Build staff screens under `/staff`, with left sidebar and clean readable styling that matches the hotel's existing colors. Sections: Overview, Rooms, Reservations, Guests, Check-in/Check-out, Billing & Invoices (placeholder), Payments (placeholder), Reports (placeholder), Staff & Roles, Settings. Show only items allowed for the logged-in role.

- Overview cards use real queries for total rooms, occupied, available, reserved, cleaning/maintenance, today's arrivals/departures, and in-house guests. Future reservations do not count as occupied.
- Rooms: status-colored grid, category/status filters, add/edit room, set cleaning/maintenance with notes, room detail.
- Reservations: search guest/phone/ref; filter date/status/room; create walk-in/advance booking; edit; cancel with reason; translate database conflicts into plain language. Website requests appear as pending until staff assign a room and confirm.
- Guests: searchable directory and stay history.
- Check-in/out: check in confirmed booking to available room and record actual time; transfer room while keeping booking history; checkout changes room to cleaning until staff marks available.
- Every screen has loading, empty, and error states.

## Prompt 4 — Billing, payments, invoices

Add:

- `hotel_settings`: hotel name, address, phone, GSTIN, currency, rounding, check-in/out times, invoice prefix.
- `tax_rates`: name, percent, active; configurable, no hardcoded rates.
- `services`: name, price, active.
- `invoices`: id, unique `invoice_number`, nullable `booking_id`, `guest_id`, type (`auto`/`manual`), status (`draft`/`issued`/`cancelled`), subtotal, discount, `tax_total`, `grand_total`, `created_by`, reason, `issued_at`.
- `invoice_items`: `invoice_id`, description, quantity, `unit_price`, discount, `tax_rate`.
- `payments`: id, `invoice_id`, amount, method (`cash`/`upi`/`card`/`bank`/`other`), reference, `received_by`, `received_at`, unique `idempotency_key`, kind (`payment`/`refund`). Include audit logging.

Rules:

- Generate invoice numbers using a database function and sequence; never in the browser.
- Auto bill from booking: nights = checkout minus check-in (minimum one); room charge = agreed rate × nights, shown clearly. Staff can add extras, discount, and tax before issuing.
- Manual bill: staff add line items for walk-in/other charges, optionally link guest/booking, and must enter a reason.
- Issued invoices cannot be edited; correct with credit note or logged cancel-and-reissue.
- Allow multiple/partial payments and advance deposits. Derive unpaid/partially paid/paid status only from saved payment records. Idempotency prevents duplicate submissions. Refunds are separate traceable records.
- Printable/downloadable PDF includes hotel name/address/GSTIN, invoice number/date, guest, booking reference, room, dates/nights, itemized charges, discounts, tax breakdown, total, payments, balance, and status.
- Settings displays: “Tax settings must be verified by your accountant before real use.”
- Permissions: billing/admin create invoices/payments; receptionist can view the bill at checkout only.

## Prompt 5 — Reports, settings, staff

- Reports with CSV export: daily/monthly collections (cash received) vs billed revenue, outstanding/partially paid invoices, occupancy by date/category, arrivals/departures, cancellations, payment-method breakdown. Each report states in one line what its totals include.
- Admin-only Settings: hotel details, categories/rates, tax rates, service catalogue, check-in/out policy, invoice prefix.
- Admin-only Staff & Roles: create staff users via a secure Edge Function using service role (never in browser), assign/remove roles, deactivate staff.
- Update `send-booking-email` so hotel recipient comes from a secret/setting, not a hardcoded address. Do not change guest booking form behavior.

## Prompt 6 — Test pass

Use dummy guests and test payments; report PASS/FAIL honestly, without claiming unverified passes:

1. Create guest/reservation; verify category counts and availability.
2. Same-room overlap must be rejected; checkout day equal to next check-in must be allowed.
3. Check in and verify occupied count; transfer rooms and preserve history; checkout and verify room becomes cleaning.
4. Auto bill one-night and multi-night stays, plus manual bill.
5. Add extras, discount, tax; record advance and second partial payment; verify balance, invoice PDF, payment history.
6. Submit same payment twice; only one record should save.
7. Test admin, receptionist, billing, and no-role user; verify blocked actions are denied by database, not merely hidden.
8. Verify audit logs for bookings/invoices/payments and confirm public booking form still works.

Then list completed/pending work and setup/backup steps.