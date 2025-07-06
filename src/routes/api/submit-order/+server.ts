// src/routes/api/send-order/+server.ts
import { json } from '@sveltejs/kit';
import { VITE_SUPABASE_SERVICE_ROLE_KEY, VITE_ORDER_EMAIL_SECRET } from '$env/static/private';

export async function POST({ request }) {
  const body = await request.json();

  const response = await fetch('https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1/send-order-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VITE_SUPABASE_SERVICE_ROLE_KEY}`,
      'X-Custom-Secret': VITE_ORDER_EMAIL_SECRET
    },
    body: JSON.stringify(body)
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Edge Function Error:', result);
    return json({ error: result.error || 'Unknown error' }, { status: 500 });
  }

  return json(result);
}
