import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import WebSocket from 'ws';

// @ts-ignore
global.WebSocket = WebSocket;
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const USERS = [
  {
    email: 'ammachi@helphive.com',
    password: 'Password123!',
    data: {
      full_name: 'Mary Ammachi',
      role: 'requester',
      phone: '+919876543210',
      address: 'Near Petta Junction, Kanjirappally',
    }
  },
  {
    email: 'george@helphive.com',
    password: 'Password123!',
    data: {
      full_name: 'George K',
      role: 'volunteer',
      phone: '+919876543211',
      address: 'Pazhayidam, Kanjirappally',
    }
  },
  {
    email: 'thomas@helphive.com',
    password: 'Password123!',
    data: {
      full_name: 'Thomas Uncle',
      role: 'requester',
      phone: '+919876543212',
      address: '2nd Ward, Kanjirappally',
    }
  }
];

async function createUsers() {
  console.log('Creating demo users...');
  
  for (const user of USERS) {
    console.log(`Signing up ${user.email}...`);
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: user.data,
      }
    });

    if (error) {
      console.error(`Error signing up ${user.email}:`, error.message);
      continue;
    }

    if (data.user) {
      console.log(`Successfully signed up ${user.email} with ID ${data.user.id}`);
      
      // Try creating the profile just in case the app logic isn't triggered
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: user.data.full_name,
        role: user.data.role,
        email: user.email,
        phone: user.data.phone,
        address: user.data.address,
        verified: user.data.role === 'volunteer',
        rating: 5.0,
      });

      if (profileError) {
        console.log(`Note: Profile might already exist or insert failed for ${user.email}:`, profileError.message);
      }
    }
  }
  
  console.log('\nFinished creating users.');
}

createUsers();
