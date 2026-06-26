import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3.23.8'

const BodySchema = z.object({
  guest_name: z.string().trim().min(1).max(200),
  guest_email: z.string().trim().email().max(255).optional().or(z.literal('')),
  guest_phone: z.string().trim().min(1).max(50),
  room_type: z.string().trim().min(1).max(500),
  check_in: z.string().trim().min(1),
  check_out: z.string().trim().min(1),
  num_guests: z.number().int().min(1).max(50),
  special_requests: z.string().trim().max(2000).optional().or(z.literal('')),
  total_price: z.number().optional(),
})

// TEMPORARY: Resend sandbox only allows sending to the account owner email.
// Once a domain is verified at resend.com/domains, change this to ranaabhishek1988@gmail.com.
const HOTEL_EMAIL = 'prithvirajch2013@gmail.com'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const d = parsed.data
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const bookedAt = new Date()
    const bookedAtIST = bookedAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })

    const { data: row, error: insertErr } = await supabase
      .from('bookings')
      .insert({
        guest_name: d.guest_name,
        guest_email: d.guest_email || null,
        guest_phone: d.guest_phone,
        room_type: d.room_type,
        check_in: d.check_in,
        check_out: d.check_out,
        num_guests: d.num_guests,
        special_requests: d.special_requests || null,
        total_price: d.total_price ?? null,
      })
      .select('id, created_at')
      .single()
    if (insertErr) {
      console.error('DB insert failed', insertErr)
      throw new Error('Failed to save booking')
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a">
        <h2 style="color:#6b21a8;margin:0 0 16px">New Booking Request — Royal Plaza Hotels</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#666;width:180px">Guest Name</td><td style="padding:8px 0;font-weight:600">${escape(d.guest_name)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Guest Email</td><td style="padding:8px 0">${escape(d.guest_email || '—')}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Guest Phone</td><td style="padding:8px 0">${escape(d.guest_phone)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Room Type</td><td style="padding:8px 0">${escape(d.room_type)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Check-in Date</td><td style="padding:8px 0">${escape(d.check_in)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Check-out Date</td><td style="padding:8px 0">${escape(d.check_out)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Number of Guests</td><td style="padding:8px 0">${d.num_guests}</td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top">Special Requests</td><td style="padding:8px 0;white-space:pre-wrap">${escape(d.special_requests || '—')}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Booking Time</td><td style="padding:8px 0">${escape(bookedAtIST)} IST</td></tr>
          ${d.total_price ? `<tr><td style="padding:8px 0;color:#666">Estimated Total</td><td style="padding:8px 0;font-weight:600">₹${d.total_price.toLocaleString('en-IN')}</td></tr>` : ''}
        </table>
        <p style="margin-top:20px;font-size:12px;color:#888">Booking ID: ${row.id}</p>
      </div>`

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Royal Plaza Bookings <onboarding@resend.dev>',
        to: [HOTEL_EMAIL],
        reply_to: d.guest_email || undefined,
        subject: `New Booking — ${d.guest_name} (${d.check_in} → ${d.check_out})`,
        html,
      }),
    })
    const resendBody = await resendRes.json()
    if (!resendRes.ok) {
      console.error('Resend failed', resendRes.status, resendBody)
      return new Response(JSON.stringify({ ok: false, booking_id: row.id, error: 'Email delivery failed' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    await supabase.from('bookings').update({ email_sent: true }).eq('id', row.id)

    return new Response(JSON.stringify({ ok: true, booking_id: row.id }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}
