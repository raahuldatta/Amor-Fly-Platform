import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  console.log("Clerk webhook received!");

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const body = await req.text();
  console.log("Webhook payload:", body);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  const eventType = evt.type;
  console.log("Webhook event type:", eventType);

  if (eventType === 'user.created') {
    const payload = evt.data;
    const { id, email_addresses, first_name, last_name, image_url } = payload;
    
    if (!id || !email_addresses) {
        return new Response('Error: Missing user data', { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    
    // Check if user already exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', id)
        .single();

    if (existingUser) {
        console.log(`User with Clerk ID ${id} already exists in Supabase.`);
        return new Response('User already exists', { status: 200 });
    }

    const newUser = {
      clerk_id: id,
      email: email_addresses[0].email_address,
      name: `${first_name || ''} ${last_name || ''}`.trim(),
      image_url: image_url,
      profile: {
        bio: "",
        avatar: image_url || "",
        skills: [],
        location: "",
        interests: []
      },
      selected_skills: [],
      personality_answers: {},
      anonymous_name: `User${Math.floor(Math.random() * 9999) + 1}`,
      growth_points: 0,
      engagement_level: 0,
      weekly_connections_used: 0,
      is_active: true,
      is_verified: true, // Assuming verification from Clerk
      role: "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single();

      if (error) {
        console.error('Error creating new user in Supabase:', error);
        return new Response('Error occurred while creating user', { status: 500 });
      }

      console.log(`New user created in Supabase with ID: ${data.id}`);
      
    } catch (error) {
      console.error('Error creating new user in Supabase:', error);
      return new Response('Error occurred while creating user', { status: 500 });
    }
  }
  
  // We can add user.updated and user.deleted later

  return new Response('', { status: 200 })
} 