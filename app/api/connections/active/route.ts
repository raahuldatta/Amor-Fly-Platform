import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    // Get active connections for user
    const { data: connections, error: connectionsError } = await supabase
      .from('connections')
      .select(`
        *,
        requester:users!connections_requester_id_fkey(*),
        recipient:users!connections_recipient_id_fkey(*)
      `)
      .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .eq('status', 'accepted')
      .order('updated_at', { ascending: false })

    if (connectionsError) {
      console.error('Error fetching connections:', connectionsError)
      return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 })
    }

    // Format connections to show the other user
    const formattedConnections = connections?.map(connection => {
      const otherUser = connection.requester_id === user.id 
        ? connection.recipient 
        : connection.requester
      
      return {
        id: connection.id,
        otherUser: {
          id: otherUser.id,
          anonymous_name: otherUser.anonymous_name,
          email: otherUser.email,
          growth_points: otherUser.growth_points,
          engagement_level: otherUser.engagement_level
        },
        status: connection.status,
        created_at: connection.created_at,
        updated_at: connection.updated_at
      }
    }) || []

    return NextResponse.json({ connections: formattedConnections })
  } catch (error) {
    console.error("Error in GET /api/connections/active:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
