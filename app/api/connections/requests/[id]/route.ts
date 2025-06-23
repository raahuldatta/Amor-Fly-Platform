import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from '@/lib/supabase'

interface RouteContext {
  params: {
    id: string
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: requestId } = context.params
    const { action } = await request.json()

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    
    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get connection request
    const { data: connectionRequest, error: requestError } = await supabase
      .from('connections')
      .select('*')
      .eq('id', requestId)
      .eq('recipient_id', user.id)
      .single()

    if (requestError || !connectionRequest) {
      return NextResponse.json({ error: "Connection request not found" }, { status: 404 })
    }

    if (action === 'accept') {
      // Accept connection request
      const { error: updateError } = await supabase
        .from('connections')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (updateError) {
        console.error('Error accepting connection:', updateError)
        return NextResponse.json({ error: "Failed to accept connection" }, { status: 500 })
      }

      // Create notification for requester
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: connectionRequest.requester_id,
          type: 'connection_accepted',
          title: 'Connection Accepted',
          message: `${user.anonymous_name || 'Someone'} accepted your connection request!`,
          related_id: requestId,
          related_type: 'connection',
          is_read: false,
          created_at: new Date().toISOString()
        })

      if (notificationError) {
        console.error('Error creating notification:', notificationError)
        // Don't fail the request if notification fails
      }

      return NextResponse.json({ message: "Connection accepted successfully" })
    } else {
      // Decline connection request
      const { error: updateError } = await supabase
        .from('connections')
        .update({ 
          status: 'declined',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (updateError) {
        console.error('Error declining connection:', updateError)
        return NextResponse.json({ error: "Failed to decline connection" }, { status: 500 })
      }

      return NextResponse.json({ message: "Connection declined successfully" })
    }
  } catch (error) {
    console.error("Error in PATCH /api/connections/requests/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
