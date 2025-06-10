// src/routes/api/collab/sessions/+server.js
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

const SUPABASE_FUNCTIONS_URL = 'https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1';

export async function GET({ request }) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/list-session`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: user.id }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return json({ error: `Failed to fetch sessions: ${errorText}` }, { status: res.status });
    }

    const data = await res.json();
    return json(data, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title } = await request.json();
    if (!title || title.trim().length < 3) {
      return json({ error: 'Title must be at least 3 characters' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-session`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: title.trim(), user_id: user.id }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return json({ error: `Failed to create session: ${errorText}` }, { status: res.status });
    }

    const data = await res.json();
    return json(data, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return json({ error: 'Server error' }, { status: 500 });
  }
}