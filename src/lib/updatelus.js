// Replace $lib with the correct relative path to supabase.js
import { supabase } from './supabase.js'; // Adjust the path as needed

async function syncUsers() {
    // Fetch all users from auth.users
    const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('id, email, created_at');

    if (authError) {
        console.error('Error fetching users from auth.users:', authError);
        return;
    }

    // Insert users into the custom users table
    for (const user of authUsers) {
        const { error } = await supabase
            .from('users')
            .upsert(
                {
                    id: user.id,
                    email: user.email,
                    created_at: user.created_at,
                },
                { onConflict: 'id' } // Avoid duplicating users
            );

        if (error) {
            console.error('Error syncing user:', error);
        }
    }

    console.log('Users synced successfully!');
}

// Call the function to sync users
syncUsers();