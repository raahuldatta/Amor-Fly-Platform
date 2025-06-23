import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { recipientId, message } = body

    if (!recipientId) {
      return NextResponse.json({ error: "Recipient ID is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    
    // Get current user from Supabase
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (currentUserError || !currentUser) {
      return NextResponse.json({ error: "Current user not found" }, { status: 404 })
    }

    // Check if connection request already exists
    const { data: existingRequest, error: existingRequestError } = await supabase
      .from('connections')
      .select('*')
      .or(`requester_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
      .or(`requester_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
      .single()

    if (existingRequestError && existingRequestError.code !== 'PGRST116') {
      console.error('Error checking existing request:', existingRequestError)
      return NextResponse.json({ error: "Failed to check existing request" }, { status: 500 })
    }

    if (existingRequest) {
      return NextResponse.json({ error: "Connection request already exists" }, { status: 409 })
    }

    // Create connection request
    const { data: connectionRequest, error: connectionError } = await supabase
      .from('connections')
      .insert({
        requester_id: currentUser.id,
        recipient_id: recipientId,
        message: message || '',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (connectionError) {
      console.error('Error creating connection request:', connectionError)
      return NextResponse.json({ error: "Failed to create connection request" }, { status: 500 })
    }

    // Create notification for recipient
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: recipientId,
        type: 'connection_request',
        title: 'New Connection Request',
        message: `${currentUser.anonymous_name || 'Someone'} wants to connect with you!`,
        related_id: connectionRequest.id,
        related_type: 'connection',
        is_read: false,
        created_at: new Date().toISOString()
      })

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      // Don't fail the request if notification fails
    }

    return NextResponse.json({ connection: connectionRequest }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/connections/request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
